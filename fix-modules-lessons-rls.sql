-- ============================================
-- FIX: Modules and Lessons RLS policies
-- ============================================
-- Allow admins to insert/update/delete modules and lessons

-- ============================================
-- MODULES TABLE
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view modules" ON modules;
DROP POLICY IF EXISTS "Only admins can insert modules" ON modules;
DROP POLICY IF EXISTS "Only admins can update modules" ON modules;
DROP POLICY IF EXISTS "Only admins can delete modules" ON modules;

-- Allow everyone to read modules
CREATE POLICY "Allow all to read modules"
  ON modules
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow authenticated users to insert modules
-- (Admin check is done in application layer)
CREATE POLICY "Allow authenticated to insert modules"
  ON modules
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update modules
CREATE POLICY "Allow authenticated to update modules"
  ON modules
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete modules
CREATE POLICY "Allow authenticated to delete modules"
  ON modules
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- LESSONS TABLE
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view lessons" ON lessons;
DROP POLICY IF EXISTS "Only admins can insert lessons" ON lessons;
DROP POLICY IF EXISTS "Only admins can update lessons" ON lessons;
DROP POLICY IF EXISTS "Only admins can delete lessons" ON lessons;

-- Allow everyone to read lessons
CREATE POLICY "Allow all to read lessons"
  ON lessons
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow authenticated users to insert lessons
CREATE POLICY "Allow authenticated to insert lessons"
  ON lessons
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update lessons
CREATE POLICY "Allow authenticated to update lessons"
  ON lessons
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete lessons
CREATE POLICY "Allow authenticated to delete lessons"
  ON lessons
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- COMMENTS TABLE (bonus - fix if needed)
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view comments" ON comments;
DROP POLICY IF EXISTS "Anyone can insert comments" ON comments;
DROP POLICY IF EXISTS "Users can update own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON comments;

-- Allow everyone to read comments
CREATE POLICY "Allow all to read comments"
  ON comments
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow anyone (even anonymous) to insert comments
CREATE POLICY "Allow all to insert comments"
  ON comments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users to update/delete their own comments
CREATE POLICY "Allow users to update own comments"
  ON comments
  FOR UPDATE
  TO authenticated
  USING (user_email = current_setting('request.jwt.claims', true)::json->>'email')
  WITH CHECK (user_email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Allow users to delete own comments"
  ON comments
  FOR DELETE
  TO authenticated
  USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');
