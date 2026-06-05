"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  CalendarClock,
  Check,
  ChevronDown,
  ClipboardCopy,
  ExternalLink,
  Loader2,
  Lock,
  LockOpen,
  LogOut,
  Plus,
  QrCode,
  Settings2,
  Trash2,
  Users,
  X,
} from "lucide-react";
import type { SessionSummary } from "./types";
import {
  createSessionAction,
  setSessionStatusAction,
  setScheduleAction,
  deleteSessionAction,
  updateCategoriesAction,
} from "./actions";
import { signOutAction } from "./auth-actions";

const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2f6bff] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#2f6bff]/25 transition-all hover:bg-[#2457e6] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";
const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-2xl border border-[#e7eaf3] bg-white px-4 py-2 text-sm font-semibold text-[#334155] transition-colors hover:bg-[#f6f8fd] active:scale-[0.98]";
const inputBase =
  "w-full rounded-2xl border border-[#e7eaf3] bg-white px-4 py-3 text-sm text-[#0f172a] transition-colors placeholder:text-[#94a3b8] focus:border-[#2f6bff] focus:ring-2 focus:ring-[#2f6bff]/20 focus:outline-none";

export default function AdminDashboard({
  email,
  initialSessions,
}: {
  email: string;
  initialSessions: SessionSummary[];
}) {
  const router = useRouter();
  const [origin, setOrigin] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [pendingCode, setPendingCode] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const copyTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setOrigin(window.location.origin);
    return () => {
      if (copyTimeout.current) clearTimeout(copyTimeout.current);
    };
  }, []);

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      if (copyTimeout.current) clearTimeout(copyTimeout.current);
      copyTimeout.current = setTimeout(() => setCopied(null), 2000);
    } catch {
      /* noop */
    }
  };

  const handleCreate = () => {
    if (name.trim().length < 3) {
      setError("El nombre debe tener al menos 3 caracteres.");
      return;
    }
    setError("");
    startTransition(async () => {
      const res = await createSessionAction(name.trim());
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setName("");
      router.refresh();
    });
  };

  const toggleStatus = (code: string, current: SessionSummary["status"]) => {
    setPendingCode(code);
    startTransition(async () => {
      await setSessionStatusAction(code, current === "open" ? "closed" : "open");
      setPendingCode(null);
      router.refresh();
    });
  };

  const remove = (code: string) => {
    if (!window.confirm("¿Eliminar esta sesión y todas sus necesidades? No se puede deshacer."))
      return;
    setPendingCode(code);
    startTransition(async () => {
      await deleteSessionAction(code);
      setPendingCode(null);
      router.refresh();
    });
  };

  return (
    <div className="min-h-screen bg-transparent pb-28 text-[#0f172a]">
      {/* Header */}
      <section className="border-b border-[#e7eaf3] bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eaf0ff]">
              <BrainCircuit className="h-5 w-5 text-[#2f6bff]" strokeWidth={2} />
            </span>
            <div className="leading-tight">
              <p className="font-outfit text-sm font-bold text-[#0f172a]">Consensus</p>
              <p className="text-[11px] text-[#94a3b8]">{email}</p>
            </div>
          </div>
          <form action={signOutAction}>
            <button type="submit" className={`${btnGhost} text-xs`}>
              <LogOut className="h-3.5 w-3.5" strokeWidth={2} />
              Salir
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pt-10 sm:px-6">
        <h1 className="font-outfit text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl">
          Mis sesiones
        </h1>
        <p className="mt-1 text-sm text-[#64748b]">
          Crea una sesión, comparte el código y revisa la matriz priorizada.
        </p>

        {/* Create */}
        <div className="mt-6 rounded-3xl border border-[#e7eaf3] bg-white p-5 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.25)] sm:p-6">
          <label htmlFor="new-session" className="block text-sm font-semibold text-[#334155]">
            Nueva sesión
          </label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <input
              id="new-session"
              type="text"
              placeholder="Ej: POA Ingeniería 2026"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              className={inputBase}
              maxLength={120}
            />
            <button
              type="button"
              onClick={handleCreate}
              disabled={isPending || name.trim().length < 3}
              className={`${btnPrimary} shrink-0`}
            >
              {isPending && !pendingCode ? (
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
              ) : (
                <Plus className="h-4 w-4" strokeWidth={2} />
              )}
              Crear sesión
            </button>
          </div>
          {error ? (
            <p className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
              {error}
            </p>
          ) : null}
        </div>

        {/* List */}
        <div className="mt-6 space-y-3">
          {initialSessions.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#dde3ee] bg-white p-10 text-center">
              <p className="text-sm text-[#94a3b8]">
                Aún no tienes sesiones. Crea la primera arriba.
              </p>
            </div>
          ) : (
            initialSessions.map((s) => {
              const participantUrl = `${origin}/consensus/${s.code}`;
              const resultsUrl = `${origin}/consensus/${s.code}/resultados`;
              const busy = isPending && pendingCode === s.code;
              const isOpen = s.status === "open";
              return (
                <div
                  key={s.code}
                  className="overflow-hidden rounded-3xl border border-[#e7eaf3] bg-white shadow-sm"
                >
                  {/* ── Code hero banner ── */}
                  {isOpen && (
                    <div className="flex flex-col items-center gap-4 border-b border-[#eef1f7] bg-[#f8faff] px-6 py-5 sm:flex-row sm:justify-between">
                      <div className="text-center sm:text-left">
                        <p className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#64748b] sm:justify-start">
                          <QrCode className="h-3.5 w-3.5" strokeWidth={2} />
                          Comparte este código con tu equipo
                        </p>
                        <p className="font-outfit mt-1 text-4xl font-extrabold tracking-[0.25em] text-[#2f6bff] sm:text-5xl">
                          {s.code}
                        </p>
                      </div>
                      <div className="flex flex-wrap justify-center gap-2 sm:justify-end">
                        <button
                          type="button"
                          onClick={() => copy(participantUrl, `p-${s.code}`)}
                          className={`${btnPrimary} text-sm`}
                        >
                          {copied === `p-${s.code}` ? (
                            <Check className="h-4 w-4" strokeWidth={2.5} />
                          ) : (
                            <ClipboardCopy className="h-4 w-4" strokeWidth={2} />
                          )}
                          {copied === `p-${s.code}` ? "¡Copiado!" : "Copiar enlace"}
                        </button>
                        <Link
                          href={participantUrl}
                          target="_blank"
                          className={`${btnGhost} text-sm`}
                        >
                          <ExternalLink className="h-4 w-4" strokeWidth={2} />
                          Abrir
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* ── Session info + actions ── */}
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-outfit truncate text-lg font-bold text-[#0f172a]">
                            {s.name}
                          </h2>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              isOpen ? "bg-[#dcfce7] text-[#15803d]" : "bg-[#f1f5f9] text-[#64748b]"
                            }`}
                          >
                            {isOpen ? "Abierta" : "Cerrada"}
                          </span>
                          {!isOpen && (
                            <span className="font-mono text-xs tracking-[0.15em] text-[#94a3b8]">
                              {s.code}
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#94a3b8]">
                          <span className="inline-flex items-center gap-1">
                            <Users className="h-3 w-3" strokeWidth={2} />
                            {s.needCount} {s.needCount === 1 ? "necesidad" : "necesidades"}
                          </span>
                          <span>{new Date(s.createdAt).toLocaleDateString("es-ES")}</span>
                        </div>
                      </div>

                      <Link
                        href={`/consensus/${s.code}/resultados`}
                        className={`${btnGhost} shrink-0`}
                      >
                        Ver resultados
                        <ArrowRight className="h-4 w-4" strokeWidth={2} />
                      </Link>
                    </div>

                    {/* Secondary actions */}
                    <div className="mt-4 flex flex-wrap gap-2 border-t border-[#eef1f7] pt-4">
                      <button
                        type="button"
                        onClick={() => copy(resultsUrl, `r-${s.code}`)}
                        className={`${btnGhost} text-xs`}
                      >
                        {copied === `r-${s.code}` ? (
                          <Check className="h-3.5 w-3.5 text-[#15803d]" strokeWidth={2.5} />
                        ) : (
                          <ClipboardCopy className="h-3.5 w-3.5" strokeWidth={2} />
                        )}
                        Copiar enlace resultados
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleStatus(s.code, s.status)}
                        disabled={busy}
                        className={`${btnGhost} text-xs`}
                      >
                        {busy ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
                        ) : isOpen ? (
                          <Lock className="h-3.5 w-3.5" strokeWidth={2} />
                        ) : (
                          <LockOpen className="h-3.5 w-3.5" strokeWidth={2} />
                        )}
                        {isOpen ? "Cerrar sesión" : "Reabrir sesión"}
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(s.code)}
                        disabled={busy}
                        className={`${btnGhost} text-xs text-[#dc2626] hover:bg-red-50`}
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                        Eliminar
                      </button>
                    </div>

                    {/* Auto-close schedule */}
                    <ScheduleEditor
                      code={s.code}
                      initialClosesAt={s.closesAt}
                      inputBase={inputBase}
                      btnGhost={btnGhost}
                    />

                    {/* Category editor */}
                    <CategoryEditor
                      code={s.code}
                      initialCategories={s.categories}
                      inputBase={inputBase}
                      btnGhost={btnGhost}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}

/* ── Auto-close schedule editor ── */
function toLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function ScheduleEditor({
  code,
  initialClosesAt,
  inputBase: ib,
  btnGhost: bg,
}: {
  code: string;
  initialClosesAt: string | null;
  inputBase: string;
  btnGhost: string;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(initialClosesAt ? toLocalInput(initialClosesAt) : "");
  const [closesAt, setClosesAt] = useState<string | null>(initialClosesAt);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async (clear: boolean) => {
    setSaving(true);
    setError("");
    // Convert the local datetime to an unambiguous ISO string on the client,
    // where the user's timezone is correct (the server tz may differ).
    let iso: string | null = null;
    if (!clear) {
      if (!value) {
        setError("Elige una fecha y hora.");
        setSaving(false);
        return;
      }
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) {
        setError("Fecha inválida.");
        setSaving(false);
        return;
      }
      iso = d.toISOString();
    }
    const res = await setScheduleAction(code, iso);
    setSaving(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setClosesAt(iso);
    if (clear) setValue("");
  };

  return (
    <div className="mt-3 border-t border-[#eef1f7] pt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-xs font-semibold text-[#64748b] hover:text-[#334155]"
      >
        <span className="flex items-center gap-1.5">
          <CalendarClock className="h-3.5 w-3.5" strokeWidth={2} />
          Cierre automático
          {closesAt ? (
            <span className="font-normal text-[#2f6bff]">
              ·{" "}
              {new Date(closesAt).toLocaleString("es-ES", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          ) : (
            <span className="font-normal text-[#94a3b8]">· sin programar</span>
          )}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={2}
        />
      </button>

      {open && (
        <div className="mt-3 space-y-2">
          <div className="flex flex-wrap gap-2">
            <input
              type="datetime-local"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className={`${ib} max-w-[16rem] py-1.5 text-xs`}
            />
            <button
              type="button"
              onClick={() => save(false)}
              disabled={saving}
              className={`${bg} text-xs`}
            >
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
              ) : (
                <Check className="h-3.5 w-3.5" strokeWidth={2} />
              )}
              Programar
            </button>
            {closesAt && (
              <button
                type="button"
                onClick={() => save(true)}
                disabled={saving}
                className={`${bg} text-xs text-[#dc2626] hover:bg-red-50`}
              >
                <X className="h-3.5 w-3.5" strokeWidth={2} />
                Quitar
              </button>
            )}
          </div>
          <p className="text-[11px] text-[#94a3b8]">
            Al llegar la fecha, la sesión deja de aceptar necesidades automáticamente.
          </p>
          {error && <p className="text-xs font-medium text-red-600">{error}</p>}
        </div>
      )}
    </div>
  );
}

/* ── Inline category editor — one per session card ── */
function CategoryEditor({
  code,
  initialCategories,
  inputBase: ib,
  btnGhost: bg,
}: {
  code: string;
  initialCategories: string[];
  inputBase: string;
  btnGhost: string;
}) {
  const [open, setOpen] = useState(false);
  const [cats, setCats] = useState<string[]>(initialCategories);
  const [newCat, setNewCat] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [catError, setCatError] = useState("");
  const saveTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(
    () => () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    },
    []
  );

  const addCat = () => {
    const trimmed = newCat.trim().toLowerCase();
    if (!trimmed) return;
    if (cats.includes(trimmed)) {
      setCatError("Ya existe esa categoría.");
      return;
    }
    if (cats.length >= 20) {
      setCatError("Máximo 20 categorías.");
      return;
    }
    setCatError("");
    setCats((prev) => [...prev, trimmed]);
    setNewCat("");
  };

  const removeCat = (cat: string) => {
    if (cats.length <= 1) {
      setCatError("Debe quedar al menos una categoría.");
      return;
    }
    setCatError("");
    setCats((prev) => prev.filter((c) => c !== cat));
  };

  const save = async () => {
    setSaving(true);
    setCatError("");
    const res = await updateCategoriesAction(code, cats);
    setSaving(false);
    if (!res.ok) {
      setCatError(res.error);
      return;
    }
    setSaved(true);
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mt-3 border-t border-[#eef1f7] pt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-xs font-semibold text-[#64748b] hover:text-[#334155]"
      >
        <span className="flex items-center gap-1.5">
          <Settings2 className="h-3.5 w-3.5" strokeWidth={2} />
          Categorías del formulario ({cats.length})
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={2}
        />
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          {/* Current categories */}
          <div className="flex flex-wrap gap-1.5">
            {cats.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1 rounded-full bg-[#f1f5f9] px-2.5 py-1 text-xs font-medium text-[#334155] capitalize"
              >
                {cat}
                <button
                  type="button"
                  onClick={() => removeCat(cat)}
                  className="text-[#94a3b8] hover:text-[#dc2626]"
                  aria-label={`Eliminar ${cat}`}
                >
                  <X className="h-3 w-3" strokeWidth={2.5} />
                </button>
              </span>
            ))}
          </div>

          {/* Add new */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nueva categoría…"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCat()}
              className={`${ib} py-1.5 text-xs`}
              maxLength={40}
            />
            <button type="button" onClick={addCat} className={`${bg} shrink-0 py-1.5 text-xs`}>
              <Plus className="h-3 w-3" strokeWidth={2.5} />
              Añadir
            </button>
          </div>

          {catError && <p className="text-xs font-medium text-red-600">{catError}</p>}

          <button type="button" onClick={save} disabled={saving} className={`${bg} text-xs`}>
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
            ) : saved ? (
              <Check className="h-3.5 w-3.5 text-[#15803d]" strokeWidth={2.5} />
            ) : (
              <Check className="h-3.5 w-3.5" strokeWidth={2} />
            )}
            {saved ? "¡Guardado!" : "Guardar categorías"}
          </button>
        </div>
      )}
    </div>
  );
}
