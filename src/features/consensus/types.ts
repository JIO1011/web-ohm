/* ──────────────────────────────────────────────────────────
 *  Consensus MVP — Shared types
 *  All data for a session lives in a single JSON file.
 * ────────────────────────────────────────────────────────── */

export const DEFAULT_CATEGORIES: readonly string[] = [
  "software",
  "licencias",
  "equipamiento",
  "adecuaciones",
  "otro",
];

/** Dynamic string — sessions can define their own category set. */
export type Category = string;

export const PRIORITIES = ["critica", "alta", "media", "baja"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const PRIORITY_META: Record<
  Priority,
  { label: string; emoji: string; bg: string; text: string; border: string }
> = {
  critica: {
    label: "Crítica",
    emoji: "🔴",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
  alta: {
    label: "Alta",
    emoji: "🟠",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  media: {
    label: "Media",
    emoji: "🔵",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  baja: {
    label: "Baja",
    emoji: "⚪",
    bg: "bg-gray-50",
    text: "text-gray-500",
    border: "border-gray-200",
  },
};

/* ── Core entities ── */

export interface Need {
  id: string;
  name: string;
  area: string;
  category: Category;
  description: string;
  justification: string;
  impact: number; // 1–5
  urgency: number; // 1–5
  scope: number; // 1–5
  score: number; // impact × urgency × scope (max 125)
  priority: Priority;
  groupId: string | null; // consolidation group, null when standalone
  submittedAt: string; // ISO
}

/** A manually-created consolidation group (the admin merges similar needs). */
export interface ConsensusGroup {
  id: string;
  name: string;
}

/** Collective-validation tally for a votable item (a need or a group). */
export interface VoteTally {
  up: number;
  down: number;
}

export type VoteTarget = "need" | "group";
export type VoteValue = -1 | 1;

/** Map key for a vote target: `need:<id>` or `group:<id>`. */
export function voteKey(kind: VoteTarget, id: string): string {
  return `${kind}:${id}`;
}

/** A group with its aggregated needs — computed client-side for the consolidated view. */
export interface ConsolidatedNeed {
  id: string; // group id
  name: string; // canonical group name
  needs: Need[];
  count: number; // how many needs in the group
  participants: number; // distinct participants in the group
  categories: string[]; // distinct categories present
  avgImpact: number;
  avgUrgency: number;
  avgScope: number;
  score: number; // aggregate score from rounded averages
  priority: Priority;
}

export type SessionStatus = "open" | "closed";

export interface ConsensusSession {
  code: string; // 6-char alphanumeric e.g. "AB12CD"
  name: string; // human-readable session name
  status: SessionStatus; // effective status (honors closesAt)
  categories: string[]; // admin-defined, defaults to DEFAULT_CATEGORIES
  groups: ConsensusGroup[]; // manual consolidation groups
  votes: Record<string, VoteTally>; // keyed by voteKey(kind, id)
  closesAt: string | null; // optional auto-close deadline (ISO)
  createdAt: string; // ISO
  needs: Need[];
}

/** Lightweight session row for the admin "Mis sesiones" list. */
export interface SessionSummary {
  code: string;
  name: string;
  status: SessionStatus; // effective status (honors closesAt)
  categories: string[];
  closesAt: string | null;
  createdAt: string;
  needCount: number;
}

/* ── API payloads ── */

export interface CreateSessionPayload {
  name: string;
}

export interface CreateSessionResponse {
  code: string;
  name: string;
  shareUrl: string;
  resultsUrl: string;
}

export interface SubmitNeedPayload {
  name: string;
  area: string;
  category: Category;
  description: string;
  justification: string;
  impact: number;
  urgency: number;
  scope: number;
}

export interface SessionStats {
  totalNeeds: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  categoryDistribution: Record<string, number>;
  uniqueAreas: string[];
  /** Distinct participants, keyed by normalized name. */
  uniqueParticipants: number;
  /** Needs per participant (totalNeeds / uniqueParticipants), 1 decimal. */
  avgPerParticipant: number;
  /** Category with the most needs, or null when there are none. */
  dominantCategory: { category: string; count: number } | null;
}

export interface DashboardResponse {
  session: {
    code: string;
    name: string;
    status: SessionStatus;
    categories: string[];
    groups: ConsensusGroup[];
    closesAt: string | null;
    createdAt: string;
  };
  needs: Need[];
  stats: SessionStats;
  votes: Record<string, VoteTally>;
}
