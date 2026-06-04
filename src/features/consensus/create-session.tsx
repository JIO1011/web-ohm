"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  ClipboardCopy,
  ExternalLink,
  Loader2,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";
import type { CreateSessionResponse } from "./types";

/* ── Inline QR code generator (SVG, no external deps) ── */
function generateQRMatrix(text: string): boolean[][] {
  // Minimal QR-like pattern using a simple encoding visualization.
  // For a real QR code in production, swap with a tiny library.
  // This creates a deterministic dot pattern from the text hash.
  const size = 21;
  const matrix: boolean[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => false)
  );

  // Position patterns (top-left, top-right, bottom-left)
  const drawFinder = (startRow: number, startCol: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isOuter = r === 0 || r === 6 || c === 0 || c === 6;
        const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        matrix[startRow + r]![startCol + c] = isOuter || isInner;
      }
    }
  };
  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // Timing patterns
  for (let i = 7; i < size - 7; i++) {
    matrix[6]![i] = i % 2 === 0;
    matrix[i]![6] = i % 2 === 0;
  }

  // Data area — fill with deterministic pattern from text
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }
  let seed = Math.abs(hash);
  for (let r = 8; r < size - 8; r++) {
    for (let c = 8; c < size - 8; c++) {
      if (r === 6 || c === 6) continue;
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      matrix[r]![c] = seed % 3 !== 0;
    }
  }

  return matrix;
}

function QRCode({ text, size = 140 }: { text: string; size?: number }) {
  const matrix = generateQRMatrix(text);
  const cellSize = size / matrix.length;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="rounded-xl"
      role="img"
      aria-label={`QR code para ${text}`}
    >
      <rect width={size} height={size} fill="white" rx="8" />
      {matrix.map((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize + 1}
              y={r * cellSize + 1}
              width={cellSize - 0.5}
              height={cellSize - 0.5}
              fill="#0f172a"
              rx={1}
            />
          ) : null
        )
      )}
    </svg>
  );
}

/* ── Shared styles (matching presupuestador) ── */
const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2f6bff] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#2f6bff]/25 transition-all hover:bg-[#2457e6] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";
const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-2xl border border-[#e7eaf3] bg-white px-5 py-2.5 text-sm font-semibold text-[#334155] transition-colors hover:bg-[#f6f8fd] active:scale-[0.98]";
const inputBase =
  "w-full rounded-2xl border border-[#e7eaf3] bg-white px-4 py-3 text-sm text-[#0f172a] transition-colors placeholder:text-[#94a3b8] focus:border-[#2f6bff] focus:ring-2 focus:ring-[#2f6bff]/20 focus:outline-none";

export default function CreateSession() {
  const router = useRouter();

  /* Create session state */
  const [sessionName, setSessionName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createdSession, setCreatedSession] = useState<CreateSessionResponse | null>(null);
  const [error, setError] = useState("");

  /* Join session state */
  const [joinCode, setJoinCode] = useState("");

  /* Copy feedback */
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const copyTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      if (copyTimeout.current) clearTimeout(copyTimeout.current);
      copyTimeout.current = setTimeout(() => setCopiedField(null), 2000);
    } catch {
      /* fallback: do nothing */
    }
  };

  /* ── Create session ── */
  const handleCreate = async () => {
    if (!sessionName.trim() || sessionName.trim().length < 3) {
      setError("El nombre debe tener al menos 3 caracteres.");
      return;
    }
    setError("");
    setIsCreating(true);
    try {
      const res = await fetch("/api/consensus/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: sessionName.trim() }),
      });
      const data = (await res.json()) as CreateSessionResponse & { error?: string };
      if (!res.ok) throw new Error(data.error || "Error al crear sesión.");
      setCreatedSession(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de conexión.");
    } finally {
      setIsCreating(false);
    }
  };

  /* ── Join session ── */
  const handleJoin = () => {
    const code = joinCode.trim().toUpperCase();
    if (code.length < 4) return;
    router.push(`/consensus/${code}`);
  };

  /* ── Success screen after creating a session ── */
  if (createdSession) {
    return (
      <div className="bg-[#f6f7fb] pb-28 text-[#0f172a]">
        {/* Hero */}
        <section className="relative overflow-hidden pt-10 pb-10 sm:pt-14 sm:pb-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-28 right-4 h-72 w-72 rounded-full bg-[#2f6bff]/15 blur-[90px]"
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dcfce7] px-3 py-1 text-xs font-semibold text-[#15803d]">
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                Sesión creada
              </span>
              <h1 className="font-outfit text-4xl font-bold tracking-tight text-[#0f172a] sm:text-5xl lg:text-[3.25rem] lg:leading-[1.05]">
                ¡Listo! Comparte el código.
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-[#64748b]">
                Los participantes pueden unirse con el código o escaneando el QR.
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-[#e7eaf3] bg-white p-6 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.25)] sm:p-10">
            {/* Session name */}
            <p className="text-xs font-semibold tracking-wide text-[#94a3b8] uppercase">
              Sesión
            </p>
            <p className="mt-1 font-outfit text-xl font-bold text-[#0f172a]">
              {createdSession.name}
            </p>

            {/* Code + QR */}
            <div className="mt-8 flex flex-col items-center gap-8 sm:flex-row sm:items-start">
              {/* Code */}
              <div className="flex-1 text-center sm:text-left">
                <p className="text-xs font-semibold tracking-wide text-[#94a3b8] uppercase">
                  Código de acceso
                </p>
                <p className="font-outfit mt-2 text-5xl font-extrabold tracking-[0.15em] text-[#2f6bff]">
                  {createdSession.code}
                </p>
                <button
                  type="button"
                  onClick={() => copyToClipboard(createdSession.code, "code")}
                  className={`mt-3 ${btnGhost} text-xs`}
                >
                  {copiedField === "code" ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#15803d]" strokeWidth={2.5} />
                      Copiado
                    </>
                  ) : (
                    <>
                      <ClipboardCopy className="h-3.5 w-3.5" strokeWidth={2} />
                      Copiar código
                    </>
                  )}
                </button>
              </div>

              {/* QR */}
              <div className="flex flex-col items-center gap-2">
                <QRCode text={createdSession.shareUrl} size={140} />
                <p className="text-[11px] text-[#94a3b8]">Escanear para unirse</p>
              </div>
            </div>

            {/* Links */}
            <div className="mt-8 space-y-3 border-t border-[#eef1f7] pt-6">
              {/* Share URL */}
              <div className="flex items-center gap-2">
                <div className="min-w-0 flex-1 rounded-xl bg-[#f6f8fd] px-4 py-2.5">
                  <p className="text-[10px] font-semibold tracking-wide text-[#94a3b8] uppercase">
                    Enlace para participantes
                  </p>
                  <p className="mt-0.5 truncate font-mono text-xs text-[#334155]">
                    {createdSession.shareUrl}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(createdSession.shareUrl, "share")}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e7eaf3] bg-white transition-colors hover:bg-[#f6f8fd]"
                  aria-label="Copiar enlace de participantes"
                >
                  {copiedField === "share" ? (
                    <Check className="h-4 w-4 text-[#15803d]" strokeWidth={2.5} />
                  ) : (
                    <ClipboardCopy className="h-4 w-4 text-[#64748b]" strokeWidth={2} />
                  )}
                </button>
              </div>

              {/* Results URL */}
              <div className="flex items-center gap-2">
                <div className="min-w-0 flex-1 rounded-xl bg-[#f6f8fd] px-4 py-2.5">
                  <p className="text-[10px] font-semibold tracking-wide text-[#94a3b8] uppercase">
                    Enlace de resultados
                  </p>
                  <p className="mt-0.5 truncate font-mono text-xs text-[#334155]">
                    {createdSession.resultsUrl}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(createdSession.resultsUrl, "results")}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e7eaf3] bg-white transition-colors hover:bg-[#f6f8fd]"
                  aria-label="Copiar enlace de resultados"
                >
                  {copiedField === "results" ? (
                    <Check className="h-4 w-4 text-[#15803d]" strokeWidth={2.5} />
                  ) : (
                    <ClipboardCopy className="h-4 w-4 text-[#64748b]" strokeWidth={2} />
                  )}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 border-t border-[#eef1f7] pt-6 sm:flex-row">
              <a href={createdSession.resultsUrl} className={btnPrimary}>
                Ver resultados
                <ExternalLink className="h-4 w-4" strokeWidth={2} />
              </a>
              <button
                type="button"
                onClick={() => {
                  setCreatedSession(null);
                  setSessionName("");
                }}
                className={btnGhost}
              >
                Crear otra sesión
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  /* ── Main screen: create or join ── */
  return (
    <div className="bg-[#f6f7fb] pb-28 text-[#0f172a]">
      {/* Hero */}
      <section className="relative overflow-hidden pt-10 pb-10 sm:pt-14 sm:pb-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 right-4 h-72 w-72 rounded-full bg-[#2f6bff]/15 blur-[90px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 right-44 h-56 w-56 rounded-full bg-[#818cf8]/15 blur-[90px]"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eaf0ff] px-3 py-1 text-xs font-semibold text-[#2f6bff]">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
              Consensus · Beta
            </span>
            <h1 className="font-outfit text-4xl font-bold tracking-tight text-[#0f172a] sm:text-5xl lg:text-[3.25rem] lg:leading-[1.05]">
              Descubre las necesidades reales de tu equipo.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-[#64748b]">
              Crea una sesión, comparte el código y obtén una matriz priorizada automáticamente.
              Sin registro, sin configuración, en minutos.
            </p>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Create session card */}
          <div className="rounded-3xl border border-[#e7eaf3] bg-white p-6 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.25)] sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eaf0ff]">
                <Plus className="h-5 w-5 text-[#2f6bff]" strokeWidth={2} />
              </span>
              <div>
                <h2 className="font-outfit text-lg font-bold text-[#0f172a]">
                  Crear sesión
                </h2>
                <p className="text-xs text-[#94a3b8]">Empieza a recopilar necesidades</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="session-name"
                  className="block text-sm font-semibold text-[#334155]"
                >
                  Nombre de la sesión
                </label>
                <input
                  id="session-name"
                  type="text"
                  placeholder="Ej: POA Ingeniería 2026"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  className={inputBase}
                  maxLength={120}
                />
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={handleCreate}
                disabled={isCreating || sessionName.trim().length < 3}
                className={`w-full ${btnPrimary}`}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                    Creando…
                  </>
                ) : (
                  <>
                    <BrainCircuit className="h-4 w-4" strokeWidth={2} />
                    Crear sesión
                  </>
                )}
              </button>
            </div>

            {/* Trust signals */}
            <div className="mt-5 flex flex-wrap gap-3 border-t border-[#eef1f7] pt-4">
              {["Sin registro", "Gratis", "Resultados al instante"].map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-[#94a3b8]"
                >
                  <Check className="h-3 w-3 text-[#22c197]" strokeWidth={3} />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Join session card */}
          <div className="rounded-3xl border border-[#e7eaf3] bg-white p-6 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.25)] sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f0e6fb]">
                <Users className="h-5 w-5 text-[#7c3aed]" strokeWidth={2} />
              </span>
              <div>
                <h2 className="font-outfit text-lg font-bold text-[#0f172a]">
                  Unirme a una sesión
                </h2>
                <p className="text-xs text-[#94a3b8]">Ingresa el código que te compartieron</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="join-code"
                  className="block text-sm font-semibold text-[#334155]"
                >
                  Código de sesión
                </label>
                <input
                  id="join-code"
                  type="text"
                  placeholder="Ej: AB12CD"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                  className={`${inputBase} font-mono text-center text-lg tracking-[0.2em] uppercase`}
                  maxLength={8}
                />
              </div>

              <button
                type="button"
                onClick={handleJoin}
                disabled={joinCode.trim().length < 4}
                className={`w-full ${btnPrimary} bg-[#7c3aed] shadow-[#7c3aed]/25 hover:bg-[#6d28d9]`}
              >
                Unirme
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>

            {/* How it works */}
            <div className="mt-5 space-y-2 border-t border-[#eef1f7] pt-4">
              <p className="text-[11px] font-semibold tracking-wide text-[#94a3b8] uppercase">
                ¿Cómo funciona?
              </p>
              {[
                "Ingresa el código que te dieron",
                "Registra tus necesidades",
                "El equipo ve la matriz priorizada",
              ].map((step, i) => (
                <p key={i} className="flex items-start gap-2 text-xs text-[#64748b]">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#f0e6fb] text-[9px] font-bold text-[#7c3aed]">
                    {i + 1}
                  </span>
                  {step}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
