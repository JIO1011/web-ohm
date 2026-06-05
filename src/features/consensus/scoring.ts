/* ──────────────────────────────────────────────────────────
 *  Consensus MVP — Scoring & CSV export
 * ────────────────────────────────────────────────────────── */

import type {
  Priority,
  ConsensusGroup,
  ConsensusSession,
  ConsolidatedNeed,
  Need,
  SessionStats,
} from "./types";
import { PRIORITY_META } from "./types";

/**
 * Normalize a free-text label for grouping: lowercase, strip accents, collapse
 * whitespace. Single source of truth for "level 1" auto-consolidation — reused
 * later by manual grouping (R1). Deterministic, no AI.
 */
export function normalizeLabel(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

/** Clamp a raw priority input to an integer in [1, 5]. Single source of truth. */
export function clampLevel(n: number): number {
  return Math.max(1, Math.min(5, Math.round(n)));
}

/** P = Impact × Urgency × Scope   (max 125) */
export function calculateScore(impact: number, urgency: number, scope: number): number {
  return clampLevel(impact) * clampLevel(urgency) * clampLevel(scope);
}

/** Map a numeric score to a named priority level. */
export function getPriority(score: number): Priority {
  if (score >= 80) return "critica";
  if (score >= 50) return "alta";
  if (score >= 25) return "media";
  return "baja";
}

/** Return needs sorted by score, highest first (does not mutate the input). */
export function sortByScore(needs: Need[]): Need[] {
  return [...needs].sort((a, b) => b.score - a.score);
}

/** Compute aggregate stats for a session's needs. */
export function computeStats(needs: Need[]): SessionStats {
  const categoryDistribution: Record<string, number> = {};

  let criticalCount = 0;
  let highCount = 0;
  let mediumCount = 0;
  let lowCount = 0;
  const areaSet = new Set<string>();
  const participantSet = new Set<string>();

  for (const n of needs) {
    categoryDistribution[n.category] = (categoryDistribution[n.category] ?? 0) + 1;
    areaSet.add(n.area);
    participantSet.add(normalizeLabel(n.name));
    switch (n.priority) {
      case "critica":
        criticalCount++;
        break;
      case "alta":
        highCount++;
        break;
      case "media":
        mediumCount++;
        break;
      case "baja":
        lowCount++;
        break;
    }
  }

  // Dominant category = the one with the most needs (null when empty).
  let dominantCategory: { category: string; count: number } | null = null;
  for (const [category, count] of Object.entries(categoryDistribution)) {
    if (!dominantCategory || count > dominantCategory.count) {
      dominantCategory = { category, count };
    }
  }

  const uniqueParticipants = participantSet.size;
  const avgPerParticipant =
    uniqueParticipants > 0 ? Math.round((needs.length / uniqueParticipants) * 10) / 10 : 0;

  return {
    totalNeeds: needs.length,
    criticalCount,
    highCount,
    mediumCount,
    lowCount,
    categoryDistribution,
    uniqueAreas: [...areaSet].sort(),
    uniqueParticipants,
    avgPerParticipant,
    dominantCategory,
  };
}

/**
 * Aggregate needs into their manual consolidation groups. Single source of
 * truth used by both the live dashboard (client) and the printable report
 * (server). Groups are sorted by aggregate score, highest first.
 */
export function consolidateNeeds(
  needs: Need[],
  groups: ConsensusGroup[]
): { groups: ConsolidatedNeed[]; ungrouped: Need[] } {
  const byGroup = new Map<string, Need[]>();
  for (const g of groups) byGroup.set(g.id, []);
  const ungrouped: Need[] = [];
  for (const n of needs) {
    const bucket = n.groupId ? byGroup.get(n.groupId) : undefined;
    if (bucket) bucket.push(n);
    else ungrouped.push(n);
  }

  const consolidated: ConsolidatedNeed[] = groups
    .map((g) => {
      const gn = byGroup.get(g.id) ?? [];
      const count = gn.length;
      const avg = (sel: (n: Need) => number) =>
        count > 0 ? Math.round((gn.reduce((s, n) => s + sel(n), 0) / count) * 10) / 10 : 0;
      const avgImpact = avg((n) => n.impact);
      const avgUrgency = avg((n) => n.urgency);
      const avgScope = avg((n) => n.scope);
      const score = calculateScore(
        Math.round(avgImpact),
        Math.round(avgUrgency),
        Math.round(avgScope)
      );
      return {
        id: g.id,
        name: g.name,
        needs: gn,
        count,
        participants: new Set(gn.map((n) => normalizeLabel(n.name))).size,
        categories: [...new Set(gn.map((n) => n.category))],
        avgImpact,
        avgUrgency,
        avgScope,
        score,
        priority: getPriority(score),
      };
    })
    .sort((a, b) => b.score - a.score);

  return { groups: consolidated, ungrouped };
}

/** Generate a CSV string from a session (sorted by score desc). */
export function exportToCSV(session: ConsensusSession): string {
  const header = [
    "#",
    "Categoría",
    "Descripción",
    "Justificación",
    "Nombre",
    "Área",
    "Impacto",
    "Urgencia",
    "Alcance",
    "Puntaje",
    "Prioridad",
    "Fecha",
  ].join(",");

  const sorted = sortByScore(session.needs);

  const rows = sorted.map((n, i) => {
    // Quote-wrap and neutralize spreadsheet formula injection: a leading
    // = + - @ (or tab/CR) is prefixed with ' so Excel/Sheets treats it as text.
    const escape = (s: string) => {
      const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
      return `"${safe.replace(/"/g, '""')}"`;
    };
    const meta = PRIORITY_META[n.priority];
    return [
      i + 1,
      escape(n.category),
      escape(n.description),
      escape(n.justification),
      escape(n.name),
      escape(n.area),
      n.impact,
      n.urgency,
      n.scope,
      n.score,
      escape(meta?.label ?? n.priority),
      escape(n.submittedAt),
    ].join(",");
  });

  return [header, ...rows].join("\n");
}
