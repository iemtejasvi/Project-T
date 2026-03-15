-- =============================================================================
-- NEW SQL INDEXES — For sender search and /name/[name] pages
-- Run these in Supabase SQL Editor after deploying the code changes.
-- All statements are idempotent (safe to re-run).
-- =============================================================================

-- Ensure pg_trgm extension exists (already created in ALL SQL.txt)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- -----------------------------------------------------------------------------
-- 1. Trigram GIN index on sender for ILIKE search
-- The search now queries: recipient.ilike OR sender.ilike
-- Without this index, sender ILIKE '%term%' does a full sequential scan.
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_memories_sender_trgm
  ON memories USING gin (sender gin_trgm_ops);

-- -----------------------------------------------------------------------------
-- 2. Composite index for /name/[name] page queries
-- Query pattern: status='approved' AND (reveal_at IS NULL OR reveal_at <= now())
--   AND (recipient ILIKE name OR sender ILIKE name)
--   ORDER BY created_at DESC
-- The trigram indexes above handle the ILIKE filters.
-- This composite index helps with the status + reveal_at + ordering.
-- (idx_memories_status_pinned_created already covers status+created_at,
--  but this one is more targeted for the name page query pattern)
-- -----------------------------------------------------------------------------
-- No additional composite index needed — the existing indexes cover this:
--   idx_memories_status_pinned_created (status, pinned DESC, created_at DESC)
--   idx_memories_reveal_at (reveal_at WHERE reveal_at IS NOT NULL)
--   idx_memories_recipient_trgm (recipient gin_trgm_ops) — already exists
--   idx_memories_sender_trgm (sender gin_trgm_ops) — NEW above

-- -----------------------------------------------------------------------------
-- 3. Run ANALYZE to update statistics for the query planner
-- -----------------------------------------------------------------------------
ANALYZE memories;
