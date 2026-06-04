/* ──────────────────────────────────────────────────────────
 *  Consensus MVP — Scoring & CSV export
 * ────────────────────────────────────────────────────────── */

import type { Priority, ConsensusSession, Need, Category, SessionStats } from "./types";
import { CATEGORIES, CATEGORY_LABELS, PRIORITY_META } from "./types";

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
  const categoryDistribution = Object.fromEntries(CATEGORIES.map((c) => [c, 0])) as Record<
    Category,
    number
  >;

  let criticalCount = 0;
  let highCount = 0;
  let mediumCount = 0;
  let lowCount = 0;
  const areaSet = new Set<string>();

  for (const n of needs) {
    categoryDistribution[n.category]++;
    areaSet.add(n.area);
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

  return {
    totalNeeds: needs.length,
    criticalCount,
    highCount,
    mediumCount,
    lowCount,
    categoryDistribution,
    uniqueAreas: [...areaSet].sort(),
  };
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
      escape(CATEGORY_LABELS[n.category]),
      escape(n.description),
      escape(n.justification),
      escape(n.name),
      escape(n.area),
      n.impact,
      n.urgency,
      n.scope,
      n.score,
      escape(meta.label),
      escape(n.submittedAt),
    ].join(",");
  });

  return [header, ...rows].join("\n");
}
