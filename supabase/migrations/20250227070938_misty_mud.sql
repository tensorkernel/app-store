/*
  # Fix database schema for APK Store

  This migration checks if tables and policies exist before creating them to avoid errors.
  
  1. Tables
    - `apps` - Stores application information
    - `reviews` - Stores user reviews for apps
    - `profiles` - Stores user profile information
  
  2. Security
    - Enable RLS on all tables
    - Create appropriate policies for each table
    
  3. Performance
    - Add indexes for common query patterns
*/

-- Create apps table if it doesn't exist
CREATE TABLE IF NOT EXISTS apps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  thumbnail_url text NOT NULL,
  screenshots jsonb NOT NULL DEFAULT '[]'::jsonb,
  download_url text NOT NULL,
  category text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  seo_keywords text NOT NULL DEFAULT '',
  seo_description text NOT NULL DEFAULT '',
  version text NOT NULL,
  publisher text NOT NULL,
  download_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create reviews table if it doesn't exist
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id uuid NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  username text NOT NULL UNIQUE,
  avatar_url text,
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security if not already enabled
DO $$
BEGIN
  -- Enable RLS on apps table
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'apps' AND rowsecurity = true
  ) THEN
    ALTER TABLE apps ENABLE ROW LEVEL SECURITY;
  END IF;
  
  -- Enable RLS on reviews table
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'reviews' AND rowsecurity = true
  ) THEN
    ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
  END IF;
  
  -- Enable RLS on profiles table
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'profiles' AND rowsecurity = true
  ) THEN
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policies for apps table if they don't exist
DO $$
BEGIN
  -- Anyone can view apps
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'apps' AND policyname = 'Anyone can view apps'
  ) THEN
    CREATE POLICY "Anyone can view apps" 
      ON apps FOR SELECT 
      USING (true);
  END IF;
  
  -- Admins can insert apps
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'apps' AND policyname = 'Admins can insert apps'
  ) THEN
    CREATE POLICY "Admins can insert apps" 
      ON apps FOR INSERT 
      TO authenticated
      WITH CHECK (EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid() AND profiles.is_admin = true
      ));
  END IF;
  
  -- Admins can update apps
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'apps' AND policyname = 'Admins can update apps'
  ) THEN
    CREATE POLICY "Admins can update apps" 
      ON apps FOR UPDATE 
      TO authenticated
      USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid() AND profiles.is_admin = true
      ));
  END IF;
  
  -- Admins can delete apps
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'apps' AND policyname = 'Admins can delete apps'
  ) THEN
    CREATE POLICY "Admins can delete apps" 
      ON apps FOR DELETE 
      TO authenticated
      USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid() AND profiles.is_admin = true
      ));
  END IF;
END $$;

-- Create policies for reviews table if they don't exist
DO $$
BEGIN
  -- Anyone can view reviews
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reviews' AND policyname = 'Anyone can view reviews'
  ) THEN
    CREATE POLICY "Anyone can view reviews" 
      ON reviews FOR SELECT 
      USING (true);
  END IF;
  
  -- Anyone can insert reviews
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reviews' AND policyname = 'Anyone can insert reviews'
  ) THEN
    CREATE POLICY "Anyone can insert reviews" 
      ON reviews FOR INSERT 
      TO authenticated
      WITH CHECK (true);
  END IF;
  
  -- Users can update their own reviews
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reviews' AND policyname = 'Users can update their own reviews'
  ) THEN
    CREATE POLICY "Users can update their own reviews" 
      ON reviews FOR UPDATE 
      TO authenticated
      USING (user_name = (SELECT username FROM profiles WHERE id = auth.uid()));
  END IF;
  
  -- Admins can delete reviews
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reviews' AND policyname = 'Admins can delete reviews'
  ) THEN
    CREATE POLICY "Admins can delete reviews" 
      ON reviews FOR DELETE 
      TO authenticated
      USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid() AND profiles.is_admin = true
      ));
  END IF;
END $$;

-- Create policies for profiles table if they don't exist
DO $$
BEGIN
  -- Users can view profiles
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can view profiles'
  ) THEN
    CREATE POLICY "Users can view profiles" 
      ON profiles FOR SELECT 
      USING (true);
  END IF;
  
  -- Users can update own profile
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile" 
      ON profiles FOR UPDATE 
      TO authenticated
      USING (id = auth.uid());
  END IF;
END $$;

-- Create function to update updated_at timestamp if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for apps table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_apps_updated_at'
  ) THEN
    CREATE TRIGGER update_apps_updated_at
    BEFORE UPDATE ON apps
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Create indexes for performance if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'apps' AND indexname = 'apps_category_idx'
  ) THEN
    CREATE INDEX apps_category_idx ON apps(category);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'apps' AND indexname = 'apps_download_count_idx'
  ) THEN
    CREATE INDEX apps_download_count_idx ON apps(download_count DESC);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'reviews' AND indexname = 'reviews_app_id_idx'
  ) THEN
    CREATE INDEX reviews_app_id_idx ON reviews(app_id);
  END IF;
END $$;
