/* ──────────────────────────────────────────────────────────
 *  Consensus — Supabase persistence (service-role).
 *
 *  All DB access here uses the service-role client (RLS-bypassing) and is
 *  therefore SERVER-ONLY. Owner-scoped mutations additionally filter by
 *  ownerId as defense-in-depth. The public-by-code paths (getSession, addNeed)
 *  are gated by knowing the session code + upstream Zod validation + rate limit.
 *
 *  Returns/throws contract:
 *   • Functions return `null` for "not configured" or "not found" where noted.
 *   • Callers (API routes / server components) map null → 503 / 404.
 * ────────────────────────────────────────────────────────── */

import "server-only";

import { randomInt } from "node:crypto";
import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import type { GroupRow, NeedRow, SessionRow } from "@/lib/supabase/types";
import type {
  ConsensusGroup,
  ConsensusSession,
  Need,
  SessionSummary,
  SubmitNeedPayload,
  VoteTally,
  VoteTarget,
  VoteValue,
} from "@/features/consensus/types";
import { voteKey } from "@/features/consensus/types";
import { calculateScore, clampLevel, getPriority } from "@/features/consensus/scoring";

/* ── Row → domain mappers ── */
function rowToNeed(r: NeedRow): Need {
  return {
    id: r.id,
    name: r.name,
    area: r.area,
    category: r.category,
    description: r.description,
    justification: r.justification ?? "",
    impact: r.impact,
    urgency: r.urgency,
    scope: r.scope,
    score: r.score,
    priority: r.priority,
    groupId: r.group_id ?? null,
    submittedAt: r.submitted_at,
  };
}

/**
 * Effective status: a session whose `closes_at` deadline has passed is treated
 * as closed even if its stored status is still "open". Computed (not persisted)
 * so the deadline takes effect instantly without a background job.
 */
function effectiveStatus(status: "open" | "closed", closesAt: string | null): "open" | "closed" {
  if (status === "closed") return "closed";
  if (closesAt && new Date(closesAt).getTime() <= Date.now()) return "closed";
  return "open";
}

/* ── Code generation (crypto-grade, no ambiguous chars) ── */
function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[randomInt(chars.length)];
  }
  return code;
}

/* ── Public API ── */

/** Create a session owned by `ownerId`. Returns null if Supabase is unconfigured. */
export async function createSession(
  name: string,
  ownerId: string
): Promise<ConsensusSession | null> {
  const supabase = createAdminClient();
  if (!supabase) return null;

  // Generate a unique code (retry on the unlikely collision).
  let code = generateCode();
  for (let attempt = 0; attempt < 10; attempt++) {
    const { data: existing } = await supabase
      .from("consensus_sessions")
      .select("id")
      .eq("code", code)
      .maybeSingle();
    if (!existing) break;
    code = generateCode();
  }

  const { data, error } = await supabase
    .from("consensus_sessions")
    .insert({ code, name: name.trim(), owner_id: ownerId })
    .select()
    .single();

  if (error || !data) throw error ?? new Error("Insert failed");

  return {
    code: data.code,
    name: data.name,
    status: data.status,
    categories: data.categories,
    groups: [],
    votes: {},
    closesAt: data.closes_at ?? null,
    createdAt: data.created_at,
    needs: [],
  };
}

/**
 * Look up a session by code (case-insensitive) with its needs, sorted by score.
 * Wrapped in React `cache()` so a single request reads the DB only once.
 */
export const getSession = cache(async (code: string): Promise<ConsensusSession | null> => {
  const supabase = createAdminClient();
  if (!supabase) return null;

  const { data: session } = await supabase
    .from("consensus_sessions")
    .select()
    .eq("code", code.toUpperCase())
    .maybeSingle<SessionRow>();
  if (!session) return null;

  const { data: needs } = await supabase
    .from("consensus_needs")
    .select()
    .eq("session_id", session.id)
    .order("score", { ascending: false })
    .returns<NeedRow[]>();

  const { data: groups } = await supabase
    .from("consensus_groups")
    .select()
    .eq("session_id", session.id)
    .order("created_at", { ascending: true })
    .returns<GroupRow[]>();

  const { data: voteRows } = await supabase
    .from("consensus_votes")
    .select("target_kind, target_id, value")
    .eq("session_id", session.id)
    .returns<{ target_kind: "need" | "group"; target_id: string; value: -1 | 1 }[]>();

  // Aggregate votes into { "kind:id": { up, down } } tallies.
  const votes: Record<string, VoteTally> = {};
  for (const v of voteRows ?? []) {
    const key = voteKey(v.target_kind, v.target_id);
    const tally = (votes[key] ??= { up: 0, down: 0 });
    if (v.value === 1) tally.up += 1;
    else tally.down += 1;
  }

  return {
    code: session.code,
    name: session.name,
    status: effectiveStatus(session.status, session.closes_at),
    categories: session.categories,
    groups: (groups ?? []).map((g) => ({ id: g.id, name: g.name })),
    votes,
    closesAt: session.closes_at ?? null,
    createdAt: session.created_at,
    needs: (needs ?? []).map(rowToNeed),
  };
});

/**
 * Add a need to an open session. Returns:
 *  • the created Need on success,
 *  • null when Supabase is unconfigured or the session does not exist,
 *  • throws { code: "SESSION_CLOSED" } when the session is closed.
 */
export async function addNeed(code: string, input: SubmitNeedPayload): Promise<Need | null> {
  const supabase = createAdminClient();
  if (!supabase) return null;

  const { data: session } = await supabase
    .from("consensus_sessions")
    .select("id, status, closes_at")
    .eq("code", code.toUpperCase())
    .maybeSingle<{ id: string; status: "open" | "closed"; closes_at: string | null }>();
  if (!session) return null;
  if (effectiveStatus(session.status, session.closes_at) === "closed") {
    throw new Error("SESSION_CLOSED");
  }

  const impact = clampLevel(input.impact);
  const urgency = clampLevel(input.urgency);
  const scope = clampLevel(input.scope);
  const score = calculateScore(impact, urgency, scope);
  const justification = input.justification.trim();

  const { data, error } = await supabase
    .from("consensus_needs")
    .insert({
      session_id: session.id,
      name: input.name.trim(),
      area: input.area.trim(),
      category: input.category,
      description: input.description.trim(),
      justification: justification.length > 0 ? justification : null,
      impact,
      urgency,
      scope,
      score,
      priority: getPriority(score),
    })
    .select()
    .single<NeedRow>();

  if (error || !data) throw error ?? new Error("Insert failed");
  return rowToNeed(data);
}

/* ── Admin (owner-scoped) operations ── */

/** List sessions owned by `ownerId`, newest first, with their need counts. */
export async function listSessions(ownerId: string): Promise<SessionSummary[]> {
  const supabase = createAdminClient();
  if (!supabase) return [];

  // The embedded `consensus_needs(count)` aggregate can't be inferred without
  // hand-written relationship metadata, so we assert the row shape explicitly.
  type SessionListRow = {
    code: string;
    name: string;
    status: "open" | "closed";
    categories: string[];
    closes_at: string | null;
    created_at: string;
    consensus_needs: { count: number }[];
  };

  const { data, error } = await supabase
    .from("consensus_sessions")
    .select("code, name, status, categories, closes_at, created_at, consensus_needs(count)")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false })
    .returns<SessionListRow[]>();

  if (error || !data) return [];

  return data.map((s) => ({
    code: s.code,
    name: s.name,
    status: effectiveStatus(s.status, s.closes_at),
    categories: s.categories,
    closesAt: s.closes_at ?? null,
    createdAt: s.created_at,
    needCount: s.consensus_needs[0]?.count ?? 0,
  }));
}

/** Set a session's status. Filters by ownerId so one admin can't touch another's. */
export async function setSessionStatus(
  code: string,
  ownerId: string,
  status: "open" | "closed"
): Promise<boolean> {
  const supabase = createAdminClient();
  if (!supabase) return false;

  const { error, count } = await supabase
    .from("consensus_sessions")
    .update({ status }, { count: "exact" })
    .eq("code", code.toUpperCase())
    .eq("owner_id", ownerId);

  return !error && (count ?? 0) > 0;
}

/**
 * Set or clear a session's auto-close deadline (`closesAt = null` clears it).
 * Owner-scoped.
 */
export async function setSessionSchedule(
  code: string,
  ownerId: string,
  closesAt: string | null
): Promise<boolean> {
  const supabase = createAdminClient();
  if (!supabase) return false;

  const { error, count } = await supabase
    .from("consensus_sessions")
    .update({ closes_at: closesAt }, { count: "exact" })
    .eq("code", code.toUpperCase())
    .eq("owner_id", ownerId);

  return !error && (count ?? 0) > 0;
}

/** Update the category list for a session. Owner-scoped. */
export async function updateSessionCategories(
  code: string,
  ownerId: string,
  categories: string[]
): Promise<boolean> {
  const supabase = createAdminClient();
  if (!supabase) return false;

  const { error, count } = await supabase
    .from("consensus_sessions")
    .update({ categories }, { count: "exact" })
    .eq("code", code.toUpperCase())
    .eq("owner_id", ownerId);

  return !error && (count ?? 0) > 0;
}

/** Delete a session (cascades to its needs). Owner-scoped. */
export async function deleteSession(code: string, ownerId: string): Promise<boolean> {
  const supabase = createAdminClient();
  if (!supabase) return false;

  const { error, count } = await supabase
    .from("consensus_sessions")
    .delete({ count: "exact" })
    .eq("code", code.toUpperCase())
    .eq("owner_id", ownerId);

  return !error && (count ?? 0) > 0;
}

/* ── Consolidation groups (owner-scoped, manual) ── */

type AdminClient = NonNullable<ReturnType<typeof createAdminClient>>;

/** Return the session's UUID iff `ownerId` owns it, else null. Service-role-safe. */
async function resolveOwnedSessionId(
  supabase: AdminClient,
  code: string,
  ownerId: string
): Promise<string | null> {
  const { data } = await supabase
    .from("consensus_sessions")
    .select("id")
    .eq("code", code.toUpperCase())
    .eq("owner_id", ownerId)
    .maybeSingle<{ id: string }>();
  return data?.id ?? null;
}

/** Owner id of a session by code (server-only; used to decide admin controls). */
export async function getSessionOwnerId(code: string): Promise<string | null> {
  const supabase = createAdminClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("consensus_sessions")
    .select("owner_id")
    .eq("code", code.toUpperCase())
    .maybeSingle<{ owner_id: string }>();
  return data?.owner_id ?? null;
}

/**
 * Create a consolidation group and assign the given needs to it.
 * Owner-scoped; needs are filtered to the session so cross-session ids are ignored.
 * Returns the new group, or null on failure / not owned.
 */
export async function createGroup(
  code: string,
  ownerId: string,
  name: string,
  needIds: string[]
): Promise<ConsensusGroup | null> {
  const supabase = createAdminClient();
  if (!supabase) return null;

  const sessionId = await resolveOwnedSessionId(supabase, code, ownerId);
  if (!sessionId) return null;

  const { data: group, error } = await supabase
    .from("consensus_groups")
    .insert({ session_id: sessionId, name: name.trim() })
    .select()
    .single<GroupRow>();
  if (error || !group) return null;

  if (needIds.length > 0) {
    await supabase
      .from("consensus_needs")
      .update({ group_id: group.id })
      .eq("session_id", sessionId)
      .in("id", needIds);
  }

  return { id: group.id, name: group.name };
}

/** Rename a group. Owner-scoped. */
export async function renameGroup(
  code: string,
  ownerId: string,
  groupId: string,
  name: string
): Promise<boolean> {
  const supabase = createAdminClient();
  if (!supabase) return false;

  const sessionId = await resolveOwnedSessionId(supabase, code, ownerId);
  if (!sessionId) return false;

  const { error, count } = await supabase
    .from("consensus_groups")
    .update({ name: name.trim() }, { count: "exact" })
    .eq("id", groupId)
    .eq("session_id", sessionId);

  return !error && (count ?? 0) > 0;
}

/** Delete a group; its needs are ungrouped (FK on delete set null). Owner-scoped. */
export async function deleteGroup(
  code: string,
  ownerId: string,
  groupId: string
): Promise<boolean> {
  const supabase = createAdminClient();
  if (!supabase) return false;

  const sessionId = await resolveOwnedSessionId(supabase, code, ownerId);
  if (!sessionId) return false;

  // Votes are polymorphic (no FK to groups), so clear this group's votes first.
  await supabase
    .from("consensus_votes")
    .delete()
    .eq("session_id", sessionId)
    .eq("target_kind", "group")
    .eq("target_id", groupId);

  const { error, count } = await supabase
    .from("consensus_groups")
    .delete({ count: "exact" })
    .eq("id", groupId)
    .eq("session_id", sessionId);

  return !error && (count ?? 0) > 0;
}

/**
 * Assign needs to a group (`groupId = null` ungroups them). Owner-scoped and
 * filtered to the session. Returns true on success.
 */
export async function assignNeedsToGroup(
  code: string,
  ownerId: string,
  groupId: string | null,
  needIds: string[]
): Promise<boolean> {
  const supabase = createAdminClient();
  if (!supabase) return false;
  if (needIds.length === 0) return true;

  const sessionId = await resolveOwnedSessionId(supabase, code, ownerId);
  if (!sessionId) return false;

  const { error } = await supabase
    .from("consensus_needs")
    .update({ group_id: groupId })
    .eq("session_id", sessionId)
    .in("id", needIds);

  return !error;
}

/* ── Voting (public, by code) ── */

/**
 * Cast or clear an anonymous vote. `value = 0` removes the voter's vote; ±1
 * upserts it (one vote per voter per target). Validates the target belongs to
 * the session. Returns false when the session/target is invalid.
 */
export async function castVote(
  code: string,
  targetKind: VoteTarget,
  targetId: string,
  voterKey: string,
  value: VoteValue | 0
): Promise<boolean> {
  const supabase = createAdminClient();
  if (!supabase) return false;

  const { data: session } = await supabase
    .from("consensus_sessions")
    .select("id")
    .eq("code", code.toUpperCase())
    .maybeSingle<{ id: string }>();
  if (!session) return false;

  // The target must belong to this session.
  const table = targetKind === "need" ? "consensus_needs" : "consensus_groups";
  const { data: target } = await supabase
    .from(table)
    .select("id")
    .eq("id", targetId)
    .eq("session_id", session.id)
    .maybeSingle<{ id: string }>();
  if (!target) return false;

  if (value === 0) {
    const { error } = await supabase
      .from("consensus_votes")
      .delete()
      .eq("session_id", session.id)
      .eq("target_kind", targetKind)
      .eq("target_id", targetId)
      .eq("voter_key", voterKey);
    return !error;
  }

  const { error } = await supabase.from("consensus_votes").upsert(
    {
      session_id: session.id,
      target_kind: targetKind,
      target_id: targetId,
      voter_key: voterKey,
      value,
    },
    { onConflict: "session_id,target_kind,target_id,voter_key" }
  );
  return !error;
}
