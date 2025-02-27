/*
  # Add admin user and improve app functionality

  1. New Features
    - Add admin user with username 'admin' and password 'admin'
    - Add user_id column to reviews table if it doesn't exist
    - Update RLS policies for better security
  
  2. Security
    - Ensure admin user has proper permissions
    - Update review policies to allow users to manage their own reviews
*/

-- Create admin user with username 'admin' and password 'admin'
-- Note: In a production environment, you would use a much stronger password
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'admin@example.com', 
   crypt('admin', gen_salt('bf')), -- Encrypt password
   now(), -- Email confirmed
   '{"provider": "email"}', -- User metadata
   now(), -- Created at
   now() -- Updated at
  )
ON CONFLICT (id) DO NOTHING;

-- Add admin user to profiles table with admin privileges
INSERT INTO public.profiles (id, email, username, is_admin, created_at)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'admin@example.com', 'admin', true, now())
ON CONFLICT (id) DO NOTHING;

-- Add user_id column to reviews table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reviews' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE reviews ADD COLUMN user_id UUID REFERENCES auth.users(id);
  END IF;
END $$;

-- Update RLS policies for reviews table
-- Drop existing policies first to avoid conflicts
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reviews' AND policyname = 'Users can update their own reviews'
  ) THEN
    DROP POLICY "Users can update their own reviews" ON reviews;
  END IF;
END $$;

-- Create updated policy for users to update their own reviews
CREATE POLICY "Users can update their own reviews" 
  ON reviews FOR UPDATE 
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    user_name = (SELECT username FROM profiles WHERE id = auth.uid())
  );

-- Create policy for users to delete their own reviews
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reviews' AND policyname = 'Users can delete their own reviews'
  ) THEN
    CREATE POLICY "Users can delete their own reviews" 
      ON reviews FOR DELETE 
      TO authenticated
      USING (
        user_id = auth.uid() OR 
        user_name = (SELECT username FROM profiles WHERE id = auth.uid())
      );
  END IF;
END $$;
