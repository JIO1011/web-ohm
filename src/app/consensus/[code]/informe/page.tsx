import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/consensus-repo";
import { computeStats, consolidateNeeds, sortByScore } from "@/features/consensus/scoring";
import { PRIORITY_META, voteKey } from "@/features/consensus/types";
import PrintButton from "@/features/consensus/print-button";

interface Props {
  params: Promise<{ code: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const session = await getSession(code);
  return {
    title: session ? `Informe ejecutivo — ${session.name}` : "Sesión no encontrada",
  };
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("es-ES", { dateStyle: "long", timeStyle: "short" });

export default async function ConsensusReportPage({ params }: Props) {
  const { code } = await params;
  const session = await getSession(code);
  if (!session) notFound();

  const ranked = sortByScore(session.needs);
  const stats = computeStats(session.needs);
  const { groups } = consolidateNeeds(session.needs, session.groups);
  const top = ranked[0] ?? null;
  const dominant = stats.dominantCategory;
  const dominantPct =
    dominant && stats.totalNeeds > 0 ? Math.round((dominant.count / stats.totalNeeds) * 100) : 0;

  // Data-driven recommendation (no AI): point the reader at what matters.
  const recommendation = (() => {
    if (stats.totalNeeds === 0) return "Aún no se han registrado necesidades en esta sesión.";
    const parts: string[] = [];
    if (stats.criticalCount > 0) {
      parts.push(
        `Atender primero las ${stats.criticalCount} necesidad${
          stats.criticalCount === 1 ? "" : "es"
        } de prioridad crítica (puntaje ≥ 80).`
      );
    } else if (stats.highCount > 0) {
      parts.push(
        `No hay necesidades críticas; iniciar por las ${stats.highCount} de prioridad alta.`
      );
    }
    if (dominant) {
      parts.push(
        `La categoría con mayor demanda es "${dominant.category}" (${dominantPct}% de las solicitudes).`
      );
    }
    if (groups.length > 0) {
      parts.push(
        `Se consolidaron ${groups.length} necesidad${
          groups.length === 1 ? "" : "es"
        } a partir de solicitudes similares.`
      );
    }
    return parts.join(" ");
  })();

  return (
    <div className="report mx-auto max-w-4xl bg-white px-6 py-8 text-[#0f172a] sm:px-10">
      {/* Print-only stylesheet: clean A4 output, hide screen chrome */}
      <style>{`
        @media print {
          header, .no-print { display: none !important; }
          .report { padding: 0 !important; max-width: none !important; }
          body { background: #fff !important; }
          .report-section { break-inside: avoid; }
          @page { margin: 16mm; }
        }
      `}</style>

      {/* Top bar: title + print */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-[#2f6bff] uppercase">
            Ohm<span className="text-[#ff6b4a]">Royal</span> · Consensus
          </p>
          <h1 className="font-outfit mt-1 text-2xl font-bold sm:text-3xl">Informe ejecutivo</h1>
          <p className="mt-1 text-sm text-[#64748b]">
            {session.name} · Código {session.code} · Generado el {fmtDate(new Date().toISOString())}
          </p>
          <p className="mt-1 text-xs text-[#94a3b8]">
            Estado: {session.status === "closed" ? "Cerrada" : "Abierta"}
            {session.closesAt ? ` · Cierre programado: ${fmtDate(session.closesAt)}` : ""}
          </p>
        </div>
        <PrintButton />
      </div>

      {/* Resumen ejecutivo */}
      <section className="report-section mb-8">
        <h2 className="font-outfit mb-3 text-sm font-bold tracking-wide text-[#334155] uppercase">
          Resumen ejecutivo
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Necesidades", value: stats.totalNeeds },
            { label: "Participantes", value: stats.uniqueParticipants },
            { label: "Críticas", value: stats.criticalCount },
            {
              label: "Categoría top",
              value: dominant ? `${dominant.category} (${dominantPct}%)` : "—",
            },
          ].map((c) => (
            <div key={c.label} className="rounded-xl border border-[#e7eaf3] p-3">
              <p className="text-[10px] font-semibold tracking-wide text-[#94a3b8] uppercase">
                {c.label}
              </p>
              <p className="font-outfit mt-1 text-lg font-extrabold capitalize">{c.value}</p>
            </div>
          ))}
        </div>

        {top && (
          <div className="mt-3 rounded-xl border border-[#e7eaf3] bg-[#f8faff] p-4">
            <p className="text-[10px] font-semibold tracking-wide text-[#94a3b8] uppercase">
              Necesidad prioritaria #1
            </p>
            <p className="mt-1 font-semibold">{top.description}</p>
            <p className="mt-1 text-xs text-[#64748b]">
              <span className="capitalize">{top.category}</span> ·{" "}
              {PRIORITY_META[top.priority].label} · {top.name} · {top.area} · Puntaje {top.score}
              /125
            </p>
          </div>
        )}
      </section>

      {/* Necesidades consolidadas */}
      {groups.length > 0 && (
        <section className="report-section mb-8">
          <h2 className="font-outfit mb-3 text-sm font-bold tracking-wide text-[#334155] uppercase">
            Necesidades consolidadas
          </h2>
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[#e7eaf3] text-[10px] tracking-wide text-[#94a3b8] uppercase">
                <th className="py-2 pr-2">Necesidad</th>
                <th className="py-2 pr-2">Solicitudes</th>
                <th className="py-2 pr-2">Personas</th>
                <th className="py-2 pr-2">Puntaje</th>
                <th className="py-2 pr-2">Votos</th>
                <th className="py-2">Prioridad</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => {
                const v = session.votes[voteKey("group", g.id)] ?? { up: 0, down: 0 };
                return (
                  <tr key={g.id} className="border-b border-[#eef1f7]">
                    <td className="py-2 pr-2 font-medium">{g.name}</td>
                    <td className="py-2 pr-2">{g.count}</td>
                    <td className="py-2 pr-2">{g.participants}</td>
                    <td className="py-2 pr-2 font-bold">{g.score}</td>
                    <td className="py-2 pr-2">
                      👍 {v.up} · 👎 {v.down}
                    </td>
                    <td className="py-2">{PRIORITY_META[g.priority].label}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}

      {/* Ranking de prioridades */}
      <section className="report-section mb-8">
        <h2 className="font-outfit mb-3 text-sm font-bold tracking-wide text-[#334155] uppercase">
          Ranking de prioridades {ranked.length > 25 ? "(top 25)" : ""}
        </h2>
        {ranked.length === 0 ? (
          <p className="text-sm text-[#94a3b8]">Sin necesidades registradas.</p>
        ) : (
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[#e7eaf3] text-[10px] tracking-wide text-[#94a3b8] uppercase">
                <th className="py-2 pr-2">#</th>
                <th className="py-2 pr-2">Necesidad</th>
                <th className="py-2 pr-2">Categoría</th>
                <th className="py-2 pr-2">Área</th>
                <th className="py-2 pr-2">Puntaje</th>
                <th className="py-2">Prioridad</th>
              </tr>
            </thead>
            <tbody>
              {ranked.slice(0, 25).map((n, i) => (
                <tr key={n.id} className="border-b border-[#eef1f7]">
                  <td className="py-2 pr-2 text-[#94a3b8]">{i + 1}</td>
                  <td className="max-w-[260px] py-2 pr-2">
                    <span className="font-medium">{n.description}</span>
                  </td>
                  <td className="py-2 pr-2 capitalize">{n.category}</td>
                  <td className="py-2 pr-2 text-[#64748b]">{n.area}</td>
                  <td className="py-2 pr-2 font-bold">{n.score}</td>
                  <td className="py-2">{PRIORITY_META[n.priority].label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Distribución por categoría */}
      {stats.totalNeeds > 0 && (
        <section className="report-section mb-8">
          <h2 className="font-outfit mb-3 text-sm font-bold tracking-wide text-[#334155] uppercase">
            Distribución por categoría
          </h2>
          <ul className="space-y-1.5 text-sm">
            {session.categories.map((cat) => {
              const count = stats.categoryDistribution[cat] ?? 0;
              const pct = stats.totalNeeds > 0 ? Math.round((count / stats.totalNeeds) * 100) : 0;
              return (
                <li key={cat} className="flex items-center justify-between">
                  <span className="capitalize">{cat}</span>
                  <span className="font-mono text-[#64748b]">
                    {count} ({pct}%)
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Recomendación */}
      <section className="report-section mb-8 rounded-xl border border-[#e7eaf3] bg-[#f8faff] p-4">
        <h2 className="font-outfit mb-2 text-sm font-bold tracking-wide text-[#334155] uppercase">
          Recomendación
        </h2>
        <p className="text-sm leading-relaxed text-[#334155]">{recommendation}</p>
      </section>

      <footer className="border-t border-[#e7eaf3] pt-4 text-xs text-[#94a3b8]">
        Generado por OhmRoyal Consensus · {fmtDate(new Date().toISOString())}
      </footer>
    </div>
  );
}
