-- ──────────────────────────────────────────────────────────
--  Consensus R3 — collective validation (voting)
--
--  Participants validate the prioritized needs with 👍 / 👎. A vote targets
--  either an individual need or a consolidated group. `voter_key` is an
--  anonymous per-browser id (the whole tool is code-gated trust, not auth), and
--  the UNIQUE constraint keeps one vote per voter per target (changeable).
-- ──────────────────────────────────────────────────────────

create table if not exists consensus_votes (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references consensus_sessions(id) on delete cascade,
  target_kind text not null check (target_kind in ('need', 'group')),
  target_id uuid not null,
  voter_key text not null,
  value smallint not null check (value in (-1, 1)),
  created_at timestamptz not null default now(),
  unique (session_id, target_kind, target_id, voter_key)
);

create index if not exists consensus_votes_session_idx on consensus_votes(session_id);
create index if not exists consensus_votes_target_idx on consensus_votes(target_kind, target_id);

-- Public read/aggregation is done server-side via the service-role client, so no
-- public policies — RLS on with no policy locks the table to service-role only.
alter table consensus_votes enable row level security;
