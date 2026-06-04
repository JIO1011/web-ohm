-- ============================================================
--  Consensus — schema, constraints & Row Level Security
--  Run in Supabase: SQL Editor → New query → paste → Run.
--
--  Access model:
--   • Admin (authenticated) manages ONLY their own sessions/needs (RLS below).
--   • Participants & the shared results link are anonymous: the app reaches
--     them server-side with the service_role key (which bypasses RLS), gated
--     by knowing the 6-char session code + Zod validation + rate limiting.
--   So there are intentionally NO public (anon) SELECT/INSERT policies.
-- ============================================================

-- ── Sessions ────────────────────────────────────────────────
create table if not exists public.consensus_sessions (
  id         uuid primary key default gen_random_uuid(),
  code       text not null unique,
  name       text not null check (char_length(name) between 3 and 120),
  owner_id   uuid not null references auth.users (id) on delete cascade,
  status     text not null default 'open' check (status in ('open', 'closed')),
  created_at timestamptz not null default now()
);

create index if not exists consensus_sessions_owner_idx
  on public.consensus_sessions (owner_id, created_at desc);

-- ── Needs ───────────────────────────────────────────────────
create table if not exists public.consensus_needs (
  id            uuid primary key default gen_random_uuid(),
  session_id    uuid not null references public.consensus_sessions (id) on delete cascade,
  name          text not null check (char_length(name) between 1 and 120),
  area          text not null check (char_length(area) between 1 and 120),
  category      text not null check (category in ('software', 'licencias', 'equipamiento', 'adecuaciones', 'otro')),
  description   text not null check (char_length(description) between 5 and 500),
  justification text check (justification is null or char_length(justification) <= 500),
  impact        smallint not null check (impact between 1 and 5),
  urgency       smallint not null check (urgency between 1 and 5),
  scope         smallint not null check (scope between 1 and 5),
  score         smallint not null check (score between 1 and 125),
  priority      text not null check (priority in ('critica', 'alta', 'media', 'baja')),
  submitted_at  timestamptz not null default now()
);

create index if not exists consensus_needs_session_idx
  on public.consensus_needs (session_id, score desc);

-- ── Row Level Security ──────────────────────────────────────
alter table public.consensus_sessions enable row level security;
alter table public.consensus_needs    enable row level security;

-- Sessions: an authenticated admin can fully manage their own rows only.
create policy "owner manages own sessions"
  on public.consensus_sessions
  for all
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- Needs: an authenticated admin can read needs of sessions they own.
-- (Participant inserts and the public results view use the service_role key.)
create policy "owner reads needs of own sessions"
  on public.consensus_needs
  for select
  to authenticated
  using (
    exists (
      select 1 from public.consensus_sessions s
      where s.id = consensus_needs.session_id
        and s.owner_id = auth.uid()
    )
  );
