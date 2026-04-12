-- =============================================================================
-- SUPABASE RLS SECURITY HOTFIX
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- Date: 2026-04-13
-- =============================================================================

-- ---------------------------------------------------------------------------
-- FIX 3.1 [HIGH]: Lock down anon INSERT on memories table.
-- Currently WITH CHECK (true) lets anyone set status='approved' directly,
-- bypassing all server-side validation (moderation, rate limits, bans).
-- After this fix, anon inserts MUST have status = 'pending'.
-- ---------------------------------------------------------------------------

-- Drop the existing permissive INSERT policy
DROP POLICY IF EXISTS "Anon can insert memories" ON memories;

-- Re-create with a strict CHECK: force status to 'pending'
CREATE POLICY "Anon can insert memories"
  ON memories
  FOR INSERT
  TO anon
  WITH CHECK (status = 'pending');

-- Also add a column-level default so the DB enforces pending even if omitted:
ALTER TABLE memories ALTER COLUMN status SET DEFAULT 'pending';

-- ---------------------------------------------------------------------------
-- FIX 3.3 [MEDIUM]: Remove anon SELECT on banned_users.
-- Currently anon can enumerate every banned IP/UUID via the REST API.
-- Only the service_role (server-side) should read this table.
-- ---------------------------------------------------------------------------

-- Drop the overly-permissive anon SELECT policy
DROP POLICY IF EXISTS "Anon can read banned users" ON banned_users;

-- Ensure the restrictive ALL policy still exists (blocks anon writes)
-- This is a no-op if it already exists, safe to re-run:
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'banned_users'
      AND policyname = 'Anon cannot modify banned users'
  ) THEN
    CREATE POLICY "Anon cannot modify banned users"
      ON banned_users
      FOR ALL
      TO anon
      USING (false);
  END IF;
END$$;

-- Explicitly block anon from reading banned_users
CREATE POLICY "Anon cannot read banned users"
  ON banned_users
  FOR SELECT
  TO anon
  USING (false);

-- ---------------------------------------------------------------------------
-- VERIFICATION QUERIES (run after applying the above)
-- ---------------------------------------------------------------------------

-- Check memories policies:
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'memories'
ORDER BY policyname;

-- Check banned_users policies:
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'banned_users'
ORDER BY policyname;

-- Test: This should FAIL with the anon key (status != 'pending'):
-- INSERT INTO memories (recipient, message, status) VALUES ('test', 'test', 'approved');

-- Test: This should SUCCEED with the anon key:
-- INSERT INTO memories (recipient, message, status) VALUES ('test', 'test', 'pending');
