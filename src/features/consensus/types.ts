/* ──────────────────────────────────────────────────────────
 *  Consensus MVP — Shared types
 *  All data for a session lives in a single JSON file.
 * ────────────────────────────────────────────────────────── */

export const CATEGORIES = [
  "software",
  "licencias",
  "equipamiento",
  "adecuaciones",
  "otro",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  software: "Software",
  licencias: "Licencias",
  equipamiento: "Equipamiento",
  adecuaciones: "Adecuaciones",
  otro: "Otro",
};

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
  submittedAt: string; // ISO
}

export type SessionStatus = "open" | "closed";

export interface ConsensusSession {
  code: string; // 6-char alphanumeric e.g. "AB12CD"
  name: string; // human-readable session name
  status: SessionStatus;
  createdAt: string; // ISO
  needs: Need[];
}

/** Lightweight session row for the admin "Mis sesiones" list. */
export interface SessionSummary {
  code: string;
  name: string;
  status: SessionStatus;
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
  categoryDistribution: Record<Category, number>;
  uniqueAreas: string[];
}

export interface DashboardResponse {
  session: { code: string; name: string; status: SessionStatus; createdAt: string };
  needs: Need[];
  stats: SessionStats;
}
