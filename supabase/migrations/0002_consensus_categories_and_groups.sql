-- ──────────────────────────────────────────────────────────
--  Consensus R1 — admin-defined categories + manual consolidation
-- ──────────────────────────────────────────────────────────

-- Admin-configurable category list per session (defaults preserve prior behavior).
alter table consensus_sessions
  add column if not exists categories text[]
  not null default array['software', 'licencias', 'equipamiento', 'adecuaciones', 'otro'];

-- Manual consolidation: an admin groups similar needs into a single "consolidated
-- need". Level-1 normalization is automatic in code; this table powers the
-- human (level-3) grouping. Designed so a future AI suggester only fills these
-- rows — no schema change needed for V-future.
create table if not exists consensus_groups (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references consensus_sessions(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);
create index if not exists consensus_groups_session_idx on consensus_groups(session_id);

-- A need belongs to at most one group; deleting a group ungroups its needs.
alter table consensus_needs
  add column if not exists group_id uuid references consensus_groups(id) on delete set null;
create index if not exists consensus_needs_group_idx on consensus_needs(group_id);

-- RLS: only the owning facilitator manages groups. Public read/aggregation of
-- consolidated needs is done server-side via the service-role client.
alter table consensus_groups enable row level security;

drop policy if exists "owner manages own groups" on consensus_groups;
create policy "owner manages own groups" on consensus_groups
  for all to authenticated
  using (
    exists (
      select 1 from consensus_sessions s
      where s.id = consensus_groups.session_id and s.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from consensus_sessions s
      where s.id = consensus_groups.session_id and s.owner_id = auth.uid()
    )
  );
