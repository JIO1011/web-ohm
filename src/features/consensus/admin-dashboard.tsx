"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  ClipboardCopy,
  Loader2,
  Lock,
  LockOpen,
  LogOut,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import type { SessionSummary } from "./types";
import { createSessionAction, setSessionStatusAction, deleteSessionAction } from "./actions";
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
                  className="rounded-3xl border border-[#e7eaf3] bg-white p-5 shadow-sm sm:p-6"
                >
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
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#94a3b8]">
                        <span className="font-mono tracking-[0.15em] text-[#2f6bff]">{s.code}</span>
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-3 w-3" strokeWidth={2} />
                          {s.needCount} {s.needCount === 1 ? "necesidad" : "necesidades"}
                        </span>
                        <span>{new Date(s.createdAt).toLocaleDateString("es-ES")}</span>
                      </div>
                    </div>

                    <Link
                      href={`/consensus/${s.code}/resultados`}
                      className={`${btnPrimary} shrink-0`}
                    >
                      Ver resultados
                      <ArrowRight className="h-4 w-4" strokeWidth={2} />
                    </Link>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-[#eef1f7] pt-4">
                    <button
                      type="button"
                      onClick={() => copy(participantUrl, `p-${s.code}`)}
                      className={`${btnGhost} text-xs`}
                    >
                      {copied === `p-${s.code}` ? (
                        <Check className="h-3.5 w-3.5 text-[#15803d]" strokeWidth={2.5} />
                      ) : (
                        <ClipboardCopy className="h-3.5 w-3.5" strokeWidth={2} />
                      )}
                      Enlace participantes
                    </button>
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
                      Enlace resultados
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
                      {isOpen ? "Cerrar" : "Reabrir"}
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
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
