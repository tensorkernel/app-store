/*
  # Add user_id to reviews table

  1. Changes
    - Add `user_id` column to `reviews` table to link reviews to authenticated users
    - Update RLS policies to allow users to manage their own reviews
*/

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
