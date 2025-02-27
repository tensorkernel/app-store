/*
  # Add Admin User

  1. New Data
    - Add an admin user with username 'admin' and password 'admin'
    - Set is_admin flag to true for this user
  
  2. Security
    - Ensures the admin user can access the admin panel
*/

-- Insert admin user into auth.users table
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
)
VALUES (
  gen_random_uuid(),
  'admin@example.com',
  crypt('admin', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"username": "admin"}',
  false,
  'authenticated'
)
ON CONFLICT (email) DO NOTHING;

-- Get the user ID of the admin user
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@example.com';
  
  -- Insert admin profile
  INSERT INTO public.profiles (
    id,
    email,
    username,
    is_admin,
    created_at
  )
  VALUES (
    admin_user_id,
    'admin@example.com',
    'admin',
    true,
    now()
  )
  ON CONFLICT (id) DO UPDATE
  SET is_admin = true;
END $$;
