/*
  # Initial schema setup for APK Store

  1. New Tables
    - `apps`: Stores application information including metadata and download links
    - `reviews`: Stores user reviews and ratings for apps
    - `profiles`: Stores user profile information with admin privileges
  
  2. Security
    - Enable RLS on all tables
    - Add policies for public access to view apps and reviews
    - Add policies for authenticated users with appropriate permissions
    - Add admin-specific policies for content management
  
  3. Performance
    - Add indexes for frequently queried columns
    - Create trigger for automatic timestamp updates
*/

-- Create apps table
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

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id uuid NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  username text NOT NULL UNIQUE,
  avatar_url text,
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for apps table
CREATE POLICY "Anyone can view apps" 
  ON apps FOR SELECT 
  USING (true);

CREATE POLICY "Admins can insert apps" 
  ON apps FOR INSERT 
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

CREATE POLICY "Admins can update apps" 
  ON apps FOR UPDATE 
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

CREATE POLICY "Admins can delete apps" 
  ON apps FOR DELETE 
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

-- Create policies for reviews table
CREATE POLICY "Anyone can view reviews" 
  ON reviews FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can insert reviews" 
  ON reviews FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own reviews" 
  ON reviews FOR UPDATE 
  TO authenticated
  USING (user_name = (SELECT username FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can delete reviews" 
  ON reviews FOR DELETE 
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

-- Create policies for profiles table
CREATE POLICY "Users can view profiles" 
  ON profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  TO authenticated
  USING (id = auth.uid());

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for apps table
CREATE TRIGGER update_apps_updated_at
BEFORE UPDATE ON apps
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS apps_category_idx ON apps(category);
CREATE INDEX IF NOT EXISTS apps_download_count_idx ON apps(download_count DESC);
CREATE INDEX IF NOT EXISTS reviews_app_id_idx ON reviews(app_id);
