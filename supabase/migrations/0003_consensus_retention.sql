-- ──────────────────────────────────────────────────────────
--  Consensus Track 0 — retention of abandoned (empty) sessions
--
--  Safety: only sessions with ZERO needs older than 30 days are pruned. Any
--  session that ever received a need is never auto-deleted. Adjust the interval
--  or disable with: select cron.unschedule('consensus-prune-empty');
-- ──────────────────────────────────────────────────────────

create extension if not exists pg_cron;

select cron.unschedule('consensus-prune-empty')
where exists (select 1 from cron.job where jobname = 'consensus-prune-empty');

select cron.schedule('consensus-prune-empty', '0 3 * * *', $job$
  delete from consensus_sessions s
  where s.created_at < now() - interval '30 days'
    and not exists (select 1 from consensus_needs n where n.session_id = s.id)
$job$);
