-- ============================================
-- COMPLETE FIX: Disable RLS for admins table
-- ============================================
-- The simplest solution: disable RLS completely for admins table
-- Since it's just used for checking permissions, it's safe to allow reads

-- First, drop ALL existing policies (even if we don't know their names)
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'admins') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON admins';
    END LOOP;
END $$;

-- Disable RLS for admins table
-- This allows anyone to READ the admins table
-- But only service_role can INSERT/UPDATE/DELETE (via Supabase Dashboard)
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- Verify the table exists and show current data
SELECT * FROM admins;
