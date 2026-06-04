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
import type { NeedRow, SessionRow } from "@/lib/supabase/types";
import type {
  ConsensusSession,
  Need,
  SessionSummary,
  SubmitNeedPayload,
} from "@/features/consensus/types";
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
    submittedAt: r.submitted_at,
  };
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

  return {
    code: session.code,
    name: session.name,
    status: session.status,
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
    .select("id, status")
    .eq("code", code.toUpperCase())
    .maybeSingle();
  if (!session) return null;
  if (session.status === "closed") throw new Error("SESSION_CLOSED");

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
    created_at: string;
    consensus_needs: { count: number }[];
  };

  const { data, error } = await supabase
    .from("consensus_sessions")
    .select("code, name, status, created_at, consensus_needs(count)")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false })
    .returns<SessionListRow[]>();

  if (error || !data) return [];

  return data.map((s) => ({
    code: s.code,
    name: s.name,
    status: s.status,
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
