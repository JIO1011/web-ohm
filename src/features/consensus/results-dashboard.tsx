"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowDownToLine,
  BarChart3,
  ClipboardCopy,
  Check,
  ChevronDown,
  Combine,
  Download,
  FileText,
  Layers,
  Loader2,
  Pencil,
  RefreshCw,
  Search,
  AlertTriangle,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  TrendingUp,
  Trophy,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type {
  Category,
  ConsolidatedNeed,
  DashboardResponse,
  Need,
  SessionStats,
  VoteTally,
  VoteTarget,
  VoteValue,
} from "./types";
import { PRIORITY_META, voteKey } from "./types";
import { consolidateNeeds, exportToCSV } from "./scoring";
import { createGroupAction, deleteGroupAction, renameGroupAction } from "./actions";
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
        <span className="font-semibold text-[#334155] capitalize">{category}</span>
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

/* ── Executive band — at-a-glance decisions, not raw rows ── */
function ExecBand({ topNeed, stats }: { topNeed: Need | null; stats: SessionStats }) {
  const dominant = stats.dominantCategory;
  const dominantPct =
    dominant && stats.totalNeeds > 0 ? Math.round((dominant.count / stats.totalNeeds) * 100) : 0;
  const topMeta = topNeed ? PRIORITY_META[topNeed.priority] : null;

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {/* Necesidad #1 — top by score (spans 2 cols on desktop) */}
      <div className="relative overflow-hidden rounded-3xl border border-[#e7eaf3] bg-gradient-to-br from-[#f8faff] to-white p-5 shadow-sm md:col-span-2">
        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide text-[#94a3b8] uppercase">
          <Trophy className="h-3.5 w-3.5 text-[#f59e0b]" strokeWidth={2} />
          Necesidad prioritaria #1
        </div>
        {topNeed && topMeta ? (
          <>
            <p className="font-outfit mt-2 line-clamp-2 text-lg font-bold text-[#0f172a]">
              {topNeed.description}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-[#eaf0ff] px-2.5 py-0.5 font-semibold text-[#2f6bff] capitalize">
                {topNeed.category}
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-bold ${topMeta.bg} ${topMeta.text} ${topMeta.border}`}
              >
                {topMeta.emoji} {topMeta.label}
              </span>
              <span className="font-mono text-[#94a3b8]">
                {topNeed.name} · {topNeed.area}
              </span>
              <span className="font-outfit ml-auto text-2xl font-extrabold text-[#0f172a]">
                {topNeed.score}
                <span className="ml-0.5 text-xs font-medium text-[#94a3b8]">/125</span>
              </span>
            </div>
          </>
        ) : (
          <p className="mt-3 text-sm text-[#94a3b8]">Aún no hay necesidades registradas.</p>
        )}
      </div>

      {/* Right column: dominant category + participation stacked */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-1">
        <div className="rounded-3xl border border-[#e7eaf3] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide text-[#94a3b8] uppercase">
            <Layers className="h-3.5 w-3.5 text-[#7c3aed]" strokeWidth={2} />
            Categoría dominante
          </div>
          {dominant ? (
            <p className="font-outfit mt-2 text-lg font-bold text-[#0f172a] capitalize">
              {dominant.category}
              <span className="ml-2 text-sm font-medium text-[#94a3b8]">
                {dominant.count} ({dominantPct}%)
              </span>
            </p>
          ) : (
            <p className="mt-2 text-sm text-[#94a3b8]">—</p>
          )}
        </div>

        <div className="rounded-3xl border border-[#e7eaf3] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide text-[#94a3b8] uppercase">
            <UserCheck className="h-3.5 w-3.5 text-[#22c197]" strokeWidth={2} />
            Participación
          </div>
          <p className="font-outfit mt-2 text-lg font-bold text-[#0f172a]">
            {stats.uniqueParticipants}
            <span className="ml-1.5 text-sm font-medium text-[#94a3b8]">
              {stats.uniqueParticipants === 1 ? "persona" : "personas"}
            </span>
          </p>
          <p className="mt-0.5 text-xs text-[#94a3b8]">
            {stats.avgPerParticipant} necesidades por participante
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Vote buttons (👍 importante / 👎 poco relevante) ── */
function VoteButtons({
  tally,
  myVote,
  onVote,
}: {
  tally: VoteTally;
  myVote: VoteValue | 0;
  onVote: (value: VoteValue) => void;
}) {
  const net = tally.up - tally.down;
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => onVote(1)}
        aria-pressed={myVote === 1}
        title="Importante"
        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors ${
          myVote === 1
            ? "border-[#22c197] bg-[#dcfce7] text-[#15803d]"
            : "border-[#e7eaf3] bg-white text-[#64748b] hover:bg-[#f6f8fd]"
        }`}
      >
        <ThumbsUp className="h-3.5 w-3.5" strokeWidth={2} />
        {tally.up}
      </button>
      <button
        type="button"
        onClick={() => onVote(-1)}
        aria-pressed={myVote === -1}
        title="Poco relevante"
        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors ${
          myVote === -1
            ? "border-[#f87171] bg-[#fee2e2] text-[#b91c1c]"
            : "border-[#e7eaf3] bg-white text-[#64748b] hover:bg-[#f6f8fd]"
        }`}
      >
        <ThumbsDown className="h-3.5 w-3.5" strokeWidth={2} />
        {tally.down}
      </button>
      <span
        className={`ml-1 text-xs font-bold ${
          net > 0 ? "text-[#15803d]" : net < 0 ? "text-[#b91c1c]" : "text-[#94a3b8]"
        }`}
        title="Balance neto"
      >
        {net > 0 ? `+${net}` : net}
      </span>
    </div>
  );
}

/* ── Consolidated group card ── */
function GroupCard({
  group,
  isOwner,
  busy,
  tally,
  myVote,
  onVote,
  onDelete,
  onRename,
}: {
  group: ConsolidatedNeed;
  isOwner: boolean;
  busy: boolean;
  tally: VoteTally;
  myVote: VoteValue | 0;
  onVote: (value: VoteValue) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, current: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const meta = PRIORITY_META[group.priority];

  return (
    <div className="rounded-2xl border border-[#e7eaf3] bg-white shadow-sm">
      <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Layers className="h-4 w-4 shrink-0 text-[#7c3aed]" strokeWidth={2} />
            <h3 className="font-outfit truncate text-base font-bold text-[#0f172a]">
              {group.name}
            </h3>
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${meta.bg} ${meta.text} ${meta.border}`}
            >
              {meta.emoji} {meta.label}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#64748b]">
            <span className="inline-flex items-center gap-1 font-semibold text-[#334155]">
              <Users className="h-3.5 w-3.5" strokeWidth={2} />
              {group.count} {group.count === 1 ? "solicitud" : "solicitudes"} · {group.participants}{" "}
              {group.participants === 1 ? "persona" : "personas"}
            </span>
            <span className="font-mono">
              I{group.avgImpact} · U{group.avgUrgency} · A{group.avgScope}
            </span>
            <div className="flex flex-wrap gap-1">
              {group.categories.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-[#f1f5f9] px-2 py-0.5 text-[10px] font-medium text-[#64748b] capitalize"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="font-outfit text-2xl font-extrabold text-[#0f172a]">
            {group.score}
            <span className="ml-0.5 text-xs font-medium text-[#94a3b8]">/125</span>
          </span>
          {isOwner && (
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => onRename(group.id, group.name)}
                disabled={busy}
                className="rounded-lg p-1.5 text-[#94a3b8] transition-colors hover:bg-[#f1f5f9] hover:text-[#334155]"
                aria-label="Renombrar grupo"
              >
                <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => onDelete(group.id)}
                disabled={busy}
                className="rounded-lg p-1.5 text-[#94a3b8] transition-colors hover:bg-red-50 hover:text-[#dc2626]"
                aria-label="Deshacer grupo"
              >
                <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Collective validation */}
      <div className="flex items-center justify-between border-t border-[#eef1f7] px-5 py-3">
        <span className="text-[11px] font-semibold tracking-wide text-[#94a3b8] uppercase">
          ¿Qué tan relevante es?
        </span>
        <VoteButtons tally={tally} myVote={myVote} onVote={onVote} />
      </div>

      {/* Expand to see member needs */}
      {group.count > 0 && (
        <div className="border-t border-[#eef1f7] px-5 py-2">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1 text-xs font-semibold text-[#64748b] hover:text-[#334155]"
          >
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
              strokeWidth={2}
            />
            {open ? "Ocultar" : "Ver"} solicitudes ({group.count})
          </button>
          {open && (
            <ul className="mt-2 space-y-2 pb-2">
              {group.needs.map((n) => (
                <li key={n.id} className="rounded-xl bg-[#f8faff] px-3 py-2 text-xs">
                  <p className="font-medium text-[#334155]">{n.description}</p>
                  <p className="mt-0.5 text-[#94a3b8]">
                    {n.name} · {n.area} · <span className="capitalize">{n.category}</span> ·{" "}
                    {n.score}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default function ResultsDashboard({
  sessionCode,
  sessionName,
  initialData,
  isOwner = false,
}: {
  sessionCode: string;
  sessionName: string;
  initialData: DashboardResponse | null;
  isOwner?: boolean;
}) {
  const [data, setData] = useState<DashboardResponse | null>(initialData);
  const [isLoading, setIsLoading] = useState(!initialData);
  // Null on first render so server and client HTML match; set after mount.
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");
  const [copiedLink, setCopiedLink] = useState(false);

  /* Consolidation (manual grouping) — owner-only mutations */
  const [viewMode, setViewMode] = useState<"individual" | "consolidado">("individual");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [groupName, setGroupName] = useState("");
  const [actionError, setActionError] = useState("");
  const [isMutating, startMutation] = useTransition();

  /* Voting state */
  const [voterKey, setVoterKey] = useState("");
  const [myVotes, setMyVotes] = useState<Record<string, VoteValue>>({});

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

  /* ── Consolidated view: aggregate needs into their manual groups ── */
  const consolidated = useMemo(() => {
    if (!data) return { groups: [] as ConsolidatedNeed[], ungrouped: [] as Need[] };
    return consolidateNeeds(data.needs, data.session.groups);
  }, [data]);

  /* ── Selection + grouping handlers (owner only) ── */
  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const clearSelection = () => {
    setSelectedIds(new Set());
    setGroupName("");
    setActionError("");
  };

  const handleCreateGroup = () => {
    if (selectedIds.size < 2) {
      setActionError("Selecciona al menos 2 necesidades para fusionar.");
      return;
    }
    if (groupName.trim().length < 2) {
      setActionError("Ponle un nombre al grupo (mín. 2 caracteres).");
      return;
    }
    setActionError("");
    startMutation(async () => {
      const res = await createGroupAction(sessionCode, groupName.trim(), [...selectedIds]);
      if (!res.ok) {
        setActionError(res.error);
        return;
      }
      clearSelection();
      await fetchData();
      setViewMode("consolidado");
    });
  };

  const handleDeleteGroup = (groupId: string) => {
    startMutation(async () => {
      const res = await deleteGroupAction(sessionCode, groupId);
      if (!res.ok) {
        setActionError(res.error);
        return;
      }
      await fetchData();
    });
  };

  const handleRenameGroup = (groupId: string, current: string) => {
    const next = window.prompt("Nuevo nombre del grupo:", current);
    if (next === null) return;
    startMutation(async () => {
      const res = await renameGroupAction(sessionCode, groupId, next.trim());
      if (!res.ok) {
        setActionError(res.error);
        return;
      }
      await fetchData();
    });
  };

  /* ── Voting (anonymous, by code) ── */
  const myVotesKey = `consensus:votes:${sessionCode}`;
  useEffect(() => {
    // Stable per-browser voter id + this session's local vote memory.
    try {
      let vk = localStorage.getItem("consensus:voter");
      if (!vk) {
        vk = crypto.randomUUID();
        localStorage.setItem("consensus:voter", vk);
      }
      setVoterKey(vk);
      const raw = localStorage.getItem(myVotesKey);
      if (raw) setMyVotes(JSON.parse(raw) as Record<string, VoteValue>);
    } catch {
      /* ignore storage errors */
    }
  }, [myVotesKey]);

  const castVoteUI = (kind: VoteTarget, id: string, desired: VoteValue) => {
    if (!voterKey) return;
    const key = voteKey(kind, id);
    const current = myVotes[key] ?? 0;
    const value: VoteValue | 0 = current === desired ? 0 : desired;

    // Optimistic local update.
    setMyVotes((prev) => {
      const next = { ...prev };
      if (value === 0) delete next[key];
      else next[key] = value;
      try {
        localStorage.setItem(myVotesKey, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });

    void fetch(`/api/consensus/${sessionCode}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetKind: kind, targetId: id, voterKey, value }),
    })
      .then(() => fetchData())
      .catch(() => {
        /* best-effort; a refetch will reconcile */
      });
  };

  /* ── CSV export ── */
  const handleExport = () => {
    if (!data) return;
    const csv = exportToCSV({
      code: data.session.code,
      name: data.session.name,
      status: data.session.status,
      categories: data.session.categories,
      groups: data.session.groups,
      votes: data.votes,
      closesAt: data.session.closesAt,
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
      <div className="flex min-h-[60vh] items-center justify-center bg-transparent">
        <div className="flex items-center gap-3 text-[#64748b]">
          <Loader2 className="h-5 w-5 animate-spin" strokeWidth={2} />
          Cargando resultados…
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-transparent">
        <p className="text-[#64748b]">No se pudieron cargar los resultados.</p>
      </div>
    );
  }

  const stats = data.stats;

  return (
    <div className="bg-transparent pb-28 text-[#0f172a]">
      {/* Hero */}
      <section className="relative overflow-hidden pt-10 pb-6 sm:pt-14 sm:pb-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 right-4 h-72 w-72 rounded-full bg-[#74c0fc]/20 blur-[90px]"
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

            <div className="flex flex-wrap gap-2">
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
              <button type="button" onClick={handleExport} className={btnGhost}>
                <Download className="h-4 w-4" strokeWidth={2} />
                CSV
              </button>
              <Link
                href={`/consensus/${sessionCode}/informe`}
                target="_blank"
                className={btnPrimary}
              >
                <FileText className="h-4 w-4" strokeWidth={2} />
                Informe ejecutivo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
        {/* Executive band — decisions at a glance */}
        <ExecBand topNeed={data.needs[0] ?? null} stats={stats} />

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
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Sidebar: distribution */}
          <div className="rounded-2xl border border-[#e7eaf3] bg-white p-5 shadow-sm lg:col-span-1">
            <h3 className="mb-4 text-xs font-semibold tracking-wide text-[#94a3b8] uppercase">
              Distribución por categoría
            </h3>
            <div className="space-y-3">
              {(data?.session.categories ?? []).map((cat) => (
                <CategoryBar
                  key={cat}
                  category={cat}
                  count={stats.categoryDistribution[cat] ?? 0}
                  total={stats.totalNeeds}
                />
              ))}
            </div>
          </div>

          {/* Main: views */}
          <div className="space-y-4 lg:col-span-3">
            {/* View switch */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex rounded-2xl border border-[#e7eaf3] bg-white p-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => setViewMode("individual")}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    viewMode === "individual"
                      ? "bg-[#2f6bff] text-white shadow-sm"
                      : "text-[#64748b] hover:text-[#334155]"
                  }`}
                >
                  <BarChart3 className="h-3.5 w-3.5" strokeWidth={2} />
                  Individuales
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("consolidado")}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    viewMode === "consolidado"
                      ? "bg-[#2f6bff] text-white shadow-sm"
                      : "text-[#64748b] hover:text-[#334155]"
                  }`}
                >
                  <Combine className="h-3.5 w-3.5" strokeWidth={2} />
                  Consolidadas
                  {consolidated.groups.length > 0 ? ` (${consolidated.groups.length})` : ""}
                </button>
              </div>
              {viewMode === "consolidado" ? (
                <p className="text-xs text-[#94a3b8]">
                  {isOwner
                    ? "Selecciona necesidades sin agrupar y fusiónalas →"
                    : "Vota 👍 / 👎 la relevancia de cada necesidad"}
                </p>
              ) : null}
            </div>

            {viewMode === "individual" ? (
              <>
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
                    {(data?.session.categories ?? []).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategoryFilter(cat)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                          categoryFilter === cat
                            ? "bg-[#2f6bff] text-white shadow-sm"
                            : "bg-[#f1f4fb] text-[#64748b] hover:bg-[#e7ebf5]"
                        }`}
                      >
                        {cat}
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
                                <p className="text-sm font-medium text-[#0f172a]">
                                  {need.description}
                                </p>
                                <p className="mt-0.5 text-xs text-[#94a3b8]">
                                  {need.name} · {need.area}
                                </p>
                              </div>
                              <span className="font-outfit shrink-0 text-lg font-bold text-[#0f172a]">
                                {need.score}
                              </span>
                            </div>
                            <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px]">
                              <span className="rounded-full bg-[#eaf0ff] px-2 py-0.5 font-semibold text-[#2f6bff] capitalize">
                                {need.category}
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
                                <td className="px-4 py-3 font-mono text-xs text-[#94a3b8]">
                                  {i + 1}
                                </td>
                                <td className="px-4 py-3">
                                  <span className="rounded-full bg-[#eaf0ff] px-2 py-0.5 text-[10px] font-semibold text-[#2f6bff]">
                                    {need.category}
                                  </span>
                                </td>
                                <td className="max-w-[260px] px-4 py-3">
                                  <p className="truncate text-sm font-medium text-[#0f172a]">
                                    {need.description}
                                  </p>
                                  <p className="mt-0.5 truncate text-xs text-[#94a3b8]">
                                    {need.name}
                                  </p>
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
              </>
            ) : (
              /* ── Consolidated view ── */
              <div className="space-y-3">
                {consolidated.groups.length === 0 && consolidated.ungrouped.length === 0 ? (
                  <div className="rounded-2xl border border-[#e7eaf3] bg-white p-10 text-center shadow-sm">
                    <Combine className="mx-auto h-8 w-8 text-[#dde3ee]" strokeWidth={1.5} />
                    <p className="mt-3 text-sm text-[#94a3b8]">
                      Aún no hay necesidades para consolidar.
                    </p>
                  </div>
                ) : (
                  <>
                    {consolidated.groups.map((g) => (
                      <GroupCard
                        key={g.id}
                        group={g}
                        isOwner={isOwner}
                        busy={isMutating}
                        tally={data.votes[voteKey("group", g.id)] ?? { up: 0, down: 0 }}
                        myVote={myVotes[voteKey("group", g.id)] ?? 0}
                        onVote={(v) => castVoteUI("group", g.id, v)}
                        onDelete={handleDeleteGroup}
                        onRename={handleRenameGroup}
                      />
                    ))}

                    {consolidated.ungrouped.length > 0 && (
                      <div className="rounded-2xl border border-[#e7eaf3] bg-white p-5 shadow-sm">
                        <h4 className="mb-3 text-xs font-semibold tracking-wide text-[#94a3b8] uppercase">
                          Sin agrupar ({consolidated.ungrouped.length})
                        </h4>
                        <ul className="space-y-2">
                          {consolidated.ungrouped.map((n) => {
                            const selected = selectedIds.has(n.id);
                            return (
                              <li
                                key={n.id}
                                className={`flex flex-col gap-2 rounded-xl border px-3 py-2.5 transition-colors sm:flex-row sm:items-start ${
                                  selected ? "border-[#2f6bff] bg-[#eaf0ff]" : "border-[#eef1f7]"
                                }`}
                              >
                                {isOwner && (
                                  <input
                                    type="checkbox"
                                    checked={selected}
                                    onChange={() => toggleSelected(n.id)}
                                    aria-label="Seleccionar para agrupar"
                                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#2f6bff]"
                                  />
                                )}
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-[#0f172a]">
                                    {n.description}
                                  </p>
                                  <p className="mt-0.5 text-xs text-[#94a3b8]">
                                    {n.name} · {n.area} ·{" "}
                                    <span className="capitalize">{n.category}</span> · Puntaje{" "}
                                    {n.score}
                                  </p>
                                </div>
                                <VoteButtons
                                  tally={data.votes[voteKey("need", n.id)] ?? { up: 0, down: 0 }}
                                  myVote={myVotes[voteKey("need", n.id)] ?? 0}
                                  onVote={(v) => castVoteUI("need", n.id, v)}
                                />
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Floating fuse bar (owner, consolidated view, ≥1 selected) ── */}
      {isOwner && viewMode === "consolidado" && selectedIds.size > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e7eaf3] bg-white/95 px-4 py-3 shadow-[0_-8px_30px_-12px_rgba(15,23,42,0.25)] backdrop-blur">
          <div className="mx-auto flex max-w-3xl flex-col gap-2 sm:flex-row sm:items-center">
            <span className="text-sm font-semibold text-[#0f172a]">
              {selectedIds.size} seleccionada{selectedIds.size === 1 ? "" : "s"}
            </span>
            <input
              type="text"
              placeholder="Nombre de la necesidad consolidada…"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateGroup()}
              className="flex-1 rounded-xl border border-[#e7eaf3] bg-[#f6f8fd] px-3 py-2 text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:border-[#2f6bff] focus:ring-2 focus:ring-[#2f6bff]/20 focus:outline-none"
              maxLength={80}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCreateGroup}
                disabled={isMutating}
                className={btnPrimary}
              >
                {isMutating ? (
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                ) : (
                  <Combine className="h-4 w-4" strokeWidth={2} />
                )}
                Fusionar
              </button>
              <button
                type="button"
                onClick={clearSelection}
                disabled={isMutating}
                className={btnGhost}
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          </div>
          {actionError ? (
            <p className="mx-auto mt-2 max-w-3xl text-xs font-medium text-red-600">{actionError}</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
