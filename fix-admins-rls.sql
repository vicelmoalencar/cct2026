-- ============================================
-- FIX: Admins table RLS policies
-- ============================================
-- Remove recursive policies and allow read access for checking admin status

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can read all admin records" ON admins;
DROP POLICY IF EXISTS "Only admins can insert new admins" ON admins;
DROP POLICY IF EXISTS "Only admins can update admins" ON admins;
DROP POLICY IF EXISTS "Only admins can delete admins" ON admins;

-- Create simple read policy for authenticated users
-- This allows the isAdmin() function to work without recursion
CREATE POLICY "Allow authenticated users to read admins"
  ON admins
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow anonymous users to read as well (for login check)
CREATE POLICY "Allow anonymous users to read admins"
  ON admins
  FOR SELECT
  TO anon
  USING (true);

-- Only service role can modify admins table
-- (You'll manage admins through Supabase Dashboard or service_role key)
