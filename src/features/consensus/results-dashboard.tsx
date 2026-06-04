"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDownToLine,
  BarChart3,
  ClipboardCopy,
  Check,
  Download,
  Loader2,
  RefreshCw,
  Search,
  AlertTriangle,
  TrendingUp,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { Category, DashboardResponse } from "./types";
import { CATEGORIES, CATEGORY_LABELS, PRIORITY_META } from "./types";
import { exportToCSV } from "./scoring";
import { createClient } from "@/lib/supabase/client";

/* ── Shared styles ── */
const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2f6bff] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#2f6bff]/25 transition-all hover:bg-[#2457e6] active:scale-[0.98]";
const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-2xl border border-[#e7eaf3] bg-white px-4 py-2.5 text-sm font-semibold text-[#334155] transition-colors hover:bg-[#f6f8fd] active:scale-[0.98]";

/* ── Stat card ── */
function StatCard({
  label,
  value,
  Icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: string | number;
  Icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e7eaf3] bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: iconBg }}
        >
          <Icon className="h-5 w-5" style={{ color: iconColor }} strokeWidth={2} />
        </span>
        <div>
          <p className="text-[10px] font-semibold tracking-wide text-[#94a3b8] uppercase">
            {label}
          </p>
          <p className="font-outfit text-2xl font-extrabold text-[#0f172a]">{value}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Category bar ── */
function CategoryBar({
  category,
  count,
  total,
}: {
  category: Category;
  count: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-[#334155]">{CATEGORY_LABELS[category]}</span>
        <span className="font-mono text-[#94a3b8]">
          {count} ({pct}%)
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#eef1f7]">
        <div
          className="h-full rounded-full bg-[#2f6bff] transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function ResultsDashboard({
  sessionCode,
  sessionName,
  initialData,
}: {
  sessionCode: string;
  sessionName: string;
  initialData: DashboardResponse | null;
}) {
  const [data, setData] = useState<DashboardResponse | null>(initialData);
  const [isLoading, setIsLoading] = useState(!initialData);
  // Null on first render so server and client HTML match; set after mount.
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");
  const [copiedLink, setCopiedLink] = useState(false);

  /* ── Fetch data ── */
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/consensus/${sessionCode}/needs`);
      if (!res.ok) return;
      const json = (await res.json()) as DashboardResponse;
      setData(json);
      setLastRefresh(new Date());
    } catch {
      /* silent retry */
    } finally {
      setIsLoading(false);
    }
  }, [sessionCode]);

  /* Live updates via Supabase Realtime broadcast on the per-session channel.
     The server emits "session_changed" when a need is added; we refetch on
     each event. A slow interval is kept as a safety net for missed broadcasts
     (best-effort delivery) and for refreshing when returning to the tab. */
  useEffect(() => {
    if (!initialData) fetchData();
    else setLastRefresh(new Date());

    const supabase = createClient();
    let channel: RealtimeChannel | null = null;
    if (supabase) {
      channel = supabase
        .channel(`consensus-${sessionCode}`)
        .on("broadcast", { event: "session_changed" }, () => fetchData())
        .subscribe();
    }

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") fetchData();
    }, 30_000);

    return () => {
      clearInterval(interval);
      if (supabase && channel) supabase.removeChannel(channel);
    };
  }, [fetchData, initialData, sessionCode]);

  /* ── Filtered needs ── */
  const filteredNeeds = useMemo(() => {
    if (!data) return [];
    let needs = data.needs;
    if (categoryFilter !== "all") {
      needs = needs.filter((n) => n.category === categoryFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      needs = needs.filter(
        (n) =>
          n.description.toLowerCase().includes(q) ||
          n.name.toLowerCase().includes(q) ||
          n.area.toLowerCase().includes(q)
      );
    }
    return needs;
  }, [data, categoryFilter, searchQuery]);

  /* ── CSV export ── */
  const handleExport = () => {
    if (!data) return;
    const csv = exportToCSV({
      code: data.session.code,
      name: data.session.name,
      status: data.session.status,
      createdAt: data.session.createdAt,
      needs: data.needs,
    });
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `consensus-${data.session.code}-resultados.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ── Copy share link ── */
  const copyShareLink = async () => {
    try {
      const url = `${window.location.origin}/consensus/${sessionCode}`;
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      /* fallback */
    }
  };

  /* ── Loading state ── */
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f6f7fb]">
        <div className="flex items-center gap-3 text-[#64748b]">
          <Loader2 className="h-5 w-5 animate-spin" strokeWidth={2} />
          Cargando resultados…
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f6f7fb]">
        <p className="text-[#64748b]">No se pudieron cargar los resultados.</p>
      </div>
    );
  }

  const stats = data.stats;

  return (
    <div className="bg-[#f6f7fb] pb-28 text-[#0f172a]">
      {/* Hero */}
      <section className="relative overflow-hidden pt-10 pb-6 sm:pt-14 sm:pb-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 right-4 h-72 w-72 rounded-full bg-[#2f6bff]/15 blur-[90px]"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eaf0ff] px-3 py-1 text-xs font-semibold text-[#2f6bff]">
                  <BarChart3 className="h-3.5 w-3.5" strokeWidth={2} />
                  Resultados · {sessionCode}
                </span>
                {data.session.status === "closed" ? (
                  <span className="inline-flex items-center rounded-full bg-[#f1f5f9] px-3 py-1 text-xs font-semibold text-[#64748b]">
                    Sesión cerrada
                  </span>
                ) : null}
              </div>
              <h1 className="font-outfit text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl">
                {sessionName}
              </h1>
              <p className="text-sm text-[#94a3b8]">
                Última actualización: {lastRefresh ? lastRefresh.toLocaleTimeString("es-ES") : "—"}{" "}
                ·{" "}
                <button
                  type="button"
                  onClick={fetchData}
                  className="inline-flex items-center gap-1 text-[#2f6bff] hover:underline"
                >
                  <RefreshCw className="h-3 w-3" strokeWidth={2} />
                  Refrescar
                </button>
              </p>
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={copyShareLink} className={btnGhost}>
                {copiedLink ? (
                  <>
                    <Check className="h-4 w-4 text-[#15803d]" strokeWidth={2.5} />
                    Copiado
                  </>
                ) : (
                  <>
                    <ClipboardCopy className="h-4 w-4" strokeWidth={2} />
                    Copiar enlace
                  </>
                )}
              </button>
              <button type="button" onClick={handleExport} className={btnPrimary}>
                <Download className="h-4 w-4" strokeWidth={2} />
                Exportar CSV
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            label="Total"
            value={stats.totalNeeds}
            Icon={BarChart3}
            iconBg="#eaf0ff"
            iconColor="#2f6bff"
          />
          <StatCard
            label="Críticas"
            value={stats.criticalCount}
            Icon={AlertTriangle}
            iconBg="#fef2f2"
            iconColor="#dc2626"
          />
          <StatCard
            label="Altas"
            value={stats.highCount}
            Icon={TrendingUp}
            iconBg="#fffbeb"
            iconColor="#d97706"
          />
          <StatCard
            label="Áreas"
            value={stats.uniqueAreas.length}
            Icon={Users}
            iconBg="#f0e6fb"
            iconColor="#7c3aed"
          />
        </div>

        {/* Distribution + Filters */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Sidebar: distribution */}
          <div className="rounded-2xl border border-[#e7eaf3] bg-white p-5 shadow-sm lg:col-span-1">
            <h3 className="mb-4 text-xs font-semibold tracking-wide text-[#94a3b8] uppercase">
              Distribución por categoría
            </h3>
            <div className="space-y-3">
              {CATEGORIES.map((cat) => (
                <CategoryBar
                  key={cat}
                  category={cat}
                  count={stats.categoryDistribution[cat] ?? 0}
                  total={stats.totalNeeds}
                />
              ))}
            </div>
          </div>

          {/* Main: table */}
          <div className="space-y-4 lg:col-span-3">
            {/* Filters bar */}
            <div className="flex flex-col gap-3 rounded-2xl border border-[#e7eaf3] bg-white p-4 sm:flex-row sm:items-center">
              {/* Category pills */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setCategoryFilter("all")}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                    categoryFilter === "all"
                      ? "bg-[#2f6bff] text-white shadow-sm"
                      : "bg-[#f1f4fb] text-[#64748b] hover:bg-[#e7ebf5]"
                  }`}
                >
                  Todas
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                      categoryFilter === cat
                        ? "bg-[#2f6bff] text-white shadow-sm"
                        : "bg-[#f1f4fb] text-[#64748b] hover:bg-[#e7ebf5]"
                    }`}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative sm:ml-auto sm:w-60">
                <Search
                  className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#94a3b8]"
                  strokeWidth={2}
                />
                <input
                  type="text"
                  placeholder="Buscar…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-[#e7eaf3] bg-[#f6f8fd] py-2 pr-3 pl-9 text-sm text-[#0f172a] transition-colors placeholder:text-[#94a3b8] focus:border-[#2f6bff] focus:ring-2 focus:ring-[#2f6bff]/20 focus:outline-none"
                />
              </div>
            </div>

            {/* Table */}
            {filteredNeeds.length === 0 ? (
              <div className="rounded-2xl border border-[#e7eaf3] bg-white p-10 text-center shadow-sm">
                <ArrowDownToLine className="mx-auto h-8 w-8 text-[#dde3ee]" strokeWidth={1.5} />
                <p className="mt-3 text-sm text-[#94a3b8]">
                  {stats.totalNeeds === 0
                    ? "Aún no hay necesidades registradas. Comparte el enlace para empezar."
                    : "No se encontraron resultados con los filtros actuales."}
                </p>
              </div>
            ) : (
              <>
                {/* Mobile: stacked cards */}
                <ul className="space-y-3 md:hidden">
                  {filteredNeeds.map((need, i) => {
                    const meta = PRIORITY_META[need.priority];
                    return (
                      <li
                        key={need.id}
                        className="rounded-2xl border border-[#e7eaf3] bg-white p-4 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-[#0f172a]">{need.description}</p>
                            <p className="mt-0.5 text-xs text-[#94a3b8]">
                              {need.name} · {need.area}
                            </p>
                          </div>
                          <span className="font-outfit shrink-0 text-lg font-bold text-[#0f172a]">
                            {need.score}
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px]">
                          <span className="rounded-full bg-[#eaf0ff] px-2 py-0.5 font-semibold text-[#2f6bff]">
                            {CATEGORY_LABELS[need.category]}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-bold ${meta.bg} ${meta.text} ${meta.border}`}
                          >
                            {meta.emoji} {meta.label}
                          </span>
                          <span className="font-mono text-[#94a3b8]">
                            #{i + 1} · I{need.impact} U{need.urgency} A{need.scope}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {/* Desktop: table */}
                <div className="hidden overflow-x-auto rounded-2xl border border-[#e7eaf3] bg-white shadow-sm md:block">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-[#eef1f7] bg-[#f6f8fd]">
                        <th className="px-4 py-3 text-[10px] font-semibold tracking-wide text-[#94a3b8] uppercase">
                          #
                        </th>
                        <th className="px-4 py-3 text-[10px] font-semibold tracking-wide text-[#94a3b8] uppercase">
                          Categoría
                        </th>
                        <th className="px-4 py-3 text-[10px] font-semibold tracking-wide text-[#94a3b8] uppercase">
                          Descripción
                        </th>
                        <th className="px-4 py-3 text-[10px] font-semibold tracking-wide text-[#94a3b8] uppercase">
                          Área
                        </th>
                        <th className="px-4 py-3 text-center text-[10px] font-semibold tracking-wide text-[#94a3b8] uppercase">
                          I
                        </th>
                        <th className="px-4 py-3 text-center text-[10px] font-semibold tracking-wide text-[#94a3b8] uppercase">
                          U
                        </th>
                        <th className="px-4 py-3 text-center text-[10px] font-semibold tracking-wide text-[#94a3b8] uppercase">
                          A
                        </th>
                        <th className="px-4 py-3 text-center text-[10px] font-semibold tracking-wide text-[#94a3b8] uppercase">
                          Puntaje
                        </th>
                        <th className="px-4 py-3 text-[10px] font-semibold tracking-wide text-[#94a3b8] uppercase">
                          Prioridad
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredNeeds.map((need, i) => {
                        const meta = PRIORITY_META[need.priority];
                        return (
                          <tr
                            key={need.id}
                            className="border-b border-[#eef1f7] transition-colors last:border-0 hover:bg-[#f6f8fd]"
                          >
                            <td className="px-4 py-3 font-mono text-xs text-[#94a3b8]">{i + 1}</td>
                            <td className="px-4 py-3">
                              <span className="rounded-full bg-[#eaf0ff] px-2 py-0.5 text-[10px] font-semibold text-[#2f6bff]">
                                {CATEGORY_LABELS[need.category]}
                              </span>
                            </td>
                            <td className="max-w-[260px] px-4 py-3">
                              <p className="truncate text-sm font-medium text-[#0f172a]">
                                {need.description}
                              </p>
                              <p className="mt-0.5 truncate text-xs text-[#94a3b8]">{need.name}</p>
                            </td>
                            <td className="px-4 py-3 text-xs text-[#64748b]">{need.area}</td>
                            <td className="px-4 py-3 text-center font-mono text-xs text-[#334155]">
                              {need.impact}
                            </td>
                            <td className="px-4 py-3 text-center font-mono text-xs text-[#334155]">
                              {need.urgency}
                            </td>
                            <td className="px-4 py-3 text-center font-mono text-xs text-[#334155]">
                              {need.scope}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="font-outfit text-base font-bold text-[#0f172a]">
                                {need.score}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${meta.bg} ${meta.text} ${meta.border}`}
                              >
                                {meta.emoji} {meta.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
