-- ──────────────────────────────────────────────────────────
--  Consensus R2 — scheduled auto-close
--
--  Optional deadline per session. When `closes_at` is in the past the session
--  is treated as closed (computed in code via effectiveStatus — no row mutation
--  needed), so participants can no longer submit needs after the deadline.
-- ──────────────────────────────────────────────────────────

alter table consensus_sessions
  add column if not exists closes_at timestamptz;
