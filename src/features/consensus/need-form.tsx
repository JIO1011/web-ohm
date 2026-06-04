"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  Cog,
  FileText,
  Laptop,
  Loader2,
  Package,
  Plus,
  ShieldAlert,
  Tag,
} from "lucide-react";
import type { Category, Need, SessionStatus } from "./types";
import { CATEGORIES, CATEGORY_LABELS, PRIORITY_META } from "./types";
import { calculateScore, getPriority } from "./scoring";

/** Remembers the participant's name/area across needs and sessions. */
const IDENTITY_KEY = "consensus:identity";

/* ── Styles (consistent with presupuestador + create-session) ── */
const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2f6bff] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#2f6bff]/25 transition-all hover:bg-[#2457e6] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";
const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-2xl border border-[#e7eaf3] bg-white px-5 py-2.5 text-sm font-semibold text-[#334155] transition-colors hover:bg-[#f6f8fd] active:scale-[0.98]";
const inputBase =
  "w-full rounded-2xl border border-[#e7eaf3] bg-white px-4 py-3 text-sm text-[#0f172a] transition-colors placeholder:text-[#94a3b8] focus:border-[#2f6bff] focus:ring-2 focus:ring-[#2f6bff]/20 focus:outline-none";
const optBase =
  "rounded-2xl border text-left transition-all duration-200 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f6bff]/40 cursor-pointer";
const optIdle =
  "border-[#e7eaf3] bg-white text-[#0f172a] hover:border-[#2f6bff]/45 hover:bg-[#f6f8fd]";

/* Category icons */
const CATEGORY_ICONS: Record<Category, typeof Laptop> = {
  software: Laptop,
  licencias: Tag,
  equipamiento: Package,
  adecuaciones: Cog,
  otro: FileText,
};

/* Slider labels */
const SLIDER_LABELS: Record<number, string> = {
  1: "Muy bajo",
  2: "Bajo",
  3: "Medio",
  4: "Alto",
  5: "Muy alto",
};

function SliderField({
  label,
  value,
  onChange,
  description,
  accentColor,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  description: string;
  accentColor: string;
}) {
  const sliderId = `consensus-slider-${label.toLowerCase()}`;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={sliderId} className="text-sm font-semibold text-[#334155]">
          {label}
        </label>
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-bold"
          style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
        >
          {value} · {SLIDER_LABELS[value]}
        </span>
      </div>
      <p className="text-xs text-[#94a3b8]">{description}</p>
      <div className="relative pt-1">
        <input
          id={sliderId}
          type="range"
          min={1}
          max={5}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-valuetext={`${value} de 5 · ${SLIDER_LABELS[value]}`}
          className="consensus-slider h-2 w-full cursor-pointer appearance-none rounded-full bg-[#eef1f7] outline-none"
          style={
            {
              "--slider-color": accentColor,
              "--slider-pct": `${((value - 1) / 4) * 100}%`,
            } as React.CSSProperties
          }
        />
        {/* Tick marks */}
        <div className="mt-1 flex justify-between px-0.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                n <= value ? "bg-[#2f6bff]" : "bg-[#dde3ee]"
              }`}
              aria-label={`Valor ${n}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function NeedForm({
  sessionCode,
  sessionName,
  sessionStatus,
}: {
  sessionCode: string;
  sessionName: string;
  sessionStatus: SessionStatus;
}) {
  const router = useRouter();

  /* Form state */
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [category, setCategory] = useState<Category>("software");
  const [description, setDescription] = useState("");
  const [justification, setJustification] = useState("");
  const [impact, setImpact] = useState(3);
  const [urgency, setUrgency] = useState(3);
  const [scope, setScope] = useState(3);
  /* Honeypot — real users never fill it; bots often do. */
  const [hpField, setHpField] = useState("");

  /* Submission */
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [submittedNeed, setSubmittedNeed] = useState<Need | null>(null);

  /* Restore remembered identity (name + area) on mount. */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(IDENTITY_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { name?: string; area?: string };
      if (saved.name) setName(saved.name);
      if (saved.area) setArea(saved.area);
    } catch {
      /* ignore malformed storage */
    }
  }, []);

  /* Live score */
  const score = useMemo(() => calculateScore(impact, urgency, scope), [impact, urgency, scope]);
  const priority = useMemo(() => getPriority(score), [score]);
  const priorityMeta = PRIORITY_META[priority];

  /* Inject slider styles */
  useEffect(() => {
    const styleId = "consensus-slider-styles";
    if (document.getElementById(styleId)) return;
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      .consensus-slider {
        background: linear-gradient(to right, var(--slider-color) 0%, var(--slider-color) var(--slider-pct), #eef1f7 var(--slider-pct), #eef1f7 100%);
      }
      .consensus-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--slider-color);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        cursor: pointer;
        transition: transform 0.15s ease;
      }
      .consensus-slider::-webkit-slider-thumb:hover {
        transform: scale(1.15);
      }
      .consensus-slider::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--slider-color);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);
  }, []);

  const canSubmit =
    name.trim().length >= 1 && area.trim().length >= 1 && description.trim().length >= 5;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError("");
    setIsLoading(true);

    // Remember identity for next time (best-effort).
    try {
      localStorage.setItem(IDENTITY_KEY, JSON.stringify({ name: name.trim(), area: area.trim() }));
    } catch {
      /* ignore */
    }

    try {
      const res = await fetch(`/api/consensus/${sessionCode}/needs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          area: area.trim(),
          category,
          description: description.trim(),
          justification: justification.trim(),
          impact,
          urgency,
          scope,
          hpField,
        }),
      });
      const data = (await res.json()) as { success?: boolean; need?: Need; error?: string };
      if (!res.ok) throw new Error(data.error || "Error al enviar.");
      setSubmittedNeed(data.need ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de conexión.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setDescription("");
    setJustification("");
    setImpact(3);
    setUrgency(3);
    setScope(3);
    setSubmittedNeed(null);
    setError("");
    // Keep name, area, category — user likely stays in same context
  };

  /* ── Success screen ── */
  if (submittedNeed) {
    // Use the server-confirmed priority, not the live slider-derived one.
    const submittedMeta = PRIORITY_META[submittedNeed.priority];
    return (
      <div className="bg-[#f6f7fb] pb-28 text-[#0f172a]">
        <section className="relative overflow-hidden pt-10 pb-10 sm:pt-14 sm:pb-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-28 right-4 h-72 w-72 rounded-full bg-[#22c197]/15 blur-[90px]"
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dcfce7] px-3 py-1 text-xs font-semibold text-[#15803d]">
                <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.5} />
                Necesidad registrada
              </span>
              <h1 className="font-outfit text-4xl font-bold tracking-tight text-[#0f172a] sm:text-5xl">
                ¡Gracias!
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-[#64748b]">
                Tu necesidad fue registrada correctamente en la sesión.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-[#e7eaf3] bg-white p-6 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.25)] sm:p-8">
            {/* Summary */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-outfit text-lg font-bold text-[#0f172a]">
                  {submittedNeed.description.slice(0, 60)}
                  {submittedNeed.description.length > 60 ? "…" : ""}
                </h3>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${submittedMeta.bg} ${submittedMeta.text} ${submittedMeta.border}`}
                >
                  {submittedMeta.emoji} {submittedMeta.label}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 rounded-2xl bg-[#f6f8fd] p-4">
                <div className="text-center">
                  <p className="text-[10px] font-semibold tracking-wide text-[#94a3b8] uppercase">
                    Impacto
                  </p>
                  <p className="font-outfit mt-1 text-2xl font-bold text-[#0f172a]">
                    {submittedNeed.impact}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-semibold tracking-wide text-[#94a3b8] uppercase">
                    Urgencia
                  </p>
                  <p className="font-outfit mt-1 text-2xl font-bold text-[#0f172a]">
                    {submittedNeed.urgency}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-semibold tracking-wide text-[#94a3b8] uppercase">
                    Alcance
                  </p>
                  <p className="font-outfit mt-1 text-2xl font-bold text-[#0f172a]">
                    {submittedNeed.scope}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 rounded-2xl border border-[#e7eaf3] bg-white p-3">
                <BarChart3 className="h-4 w-4 text-[#2f6bff]" strokeWidth={2} />
                <span className="text-sm text-[#64748b]">Puntaje total:</span>
                <span className="font-outfit text-xl font-extrabold text-[#2f6bff]">
                  {submittedNeed.score}
                </span>
                <span className="text-xs text-[#94a3b8]">/ 125</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col gap-3 border-t border-[#eef1f7] pt-6 sm:flex-row">
              <button type="button" onClick={resetForm} className={btnPrimary}>
                <Plus className="h-4 w-4" strokeWidth={2} />
                Enviar otra necesidad
              </button>
              <button
                type="button"
                onClick={() => router.push(`/consensus/${sessionCode}/resultados`)}
                className={btnGhost}
              >
                Ver resultados
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  /* ── Closed session ── */
  if (sessionStatus === "closed") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#f6f7fb] px-4 text-[#0f172a]">
        <div className="max-w-md rounded-3xl border border-[#e7eaf3] bg-white p-8 text-center shadow-[0_18px_50px_-24px_rgba(15,23,42,0.25)]">
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f1f5f9]">
            <ShieldAlert className="h-6 w-6 text-[#64748b]" strokeWidth={2} />
          </span>
          <h1 className="font-outfit text-xl font-bold text-[#0f172a]">{sessionName}</h1>
          <p className="mt-2 text-sm text-[#64748b]">
            Esta sesión está cerrada y ya no acepta nuevas necesidades.
          </p>
          <button
            type="button"
            onClick={() => router.push(`/consensus/${sessionCode}/resultados`)}
            className={`mt-6 ${btnGhost}`}
          >
            Ver resultados
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>
    );
  }

  /* ── Main form ── */
  return (
    <div className="bg-[#f6f7fb] pb-28 text-[#0f172a]">
      {/* Hero */}
      <section className="relative overflow-hidden pt-10 pb-10 sm:pt-14 sm:pb-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 right-4 h-72 w-72 rounded-full bg-[#2f6bff]/15 blur-[90px]"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eaf0ff] px-3 py-1 text-xs font-semibold text-[#2f6bff]">
              <ShieldAlert className="h-3.5 w-3.5" strokeWidth={2} />
              Sesión: {sessionCode}
            </span>
            <h1 className="font-outfit text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
              {sessionName}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-[#64748b] sm:text-lg">
              Registra una necesidad de tu área. Puedes enviar más de una.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#e7eaf3] bg-white p-6 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.25)] sm:p-8">
          <div className="space-y-8">
            {/* Honeypot — hidden from humans, ignored by screen readers. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="hp-field">No llenar</label>
              <input
                id="hp-field"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={hpField}
                onChange={(e) => setHpField(e.target.value)}
              />
            </div>

            {/* ── Section 1: Info básica ── */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-[#0f172a]">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#eaf0ff] text-[11px] font-bold text-[#2f6bff]">
                  1
                </span>
                Información básica
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="need-name" className="block text-sm font-semibold text-[#334155]">
                    Nombre <span className="text-[#ff7a59]">*</span>
                  </label>
                  <input
                    id="need-name"
                    type="text"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputBase}
                    maxLength={120}
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="need-area" className="block text-sm font-semibold text-[#334155]">
                    Área / Departamento <span className="text-[#ff7a59]">*</span>
                  </label>
                  <input
                    id="need-area"
                    type="text"
                    placeholder="Ej: Ingeniería, Sistemas"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className={inputBase}
                    maxLength={120}
                  />
                </div>
              </div>
            </div>

            {/* ── Section 2: Necesidad ── */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-[#0f172a]">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#fff1ec] text-[11px] font-bold text-[#ff7a59]">
                  2
                </span>
                Necesidad
              </h3>

              {/* Category selector */}
              <div className="space-y-1.5">
                <span className="block text-sm font-semibold text-[#334155]">Categoría</span>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                  {CATEGORIES.map((cat) => {
                    const Icon = CATEGORY_ICONS[cat];
                    const isActive = category === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        aria-pressed={isActive}
                        className={`flex flex-col items-center gap-1.5 px-3 py-3 text-center ${optBase} ${
                          isActive
                            ? "border-[#2f6bff] bg-[#eaf0ff] ring-2 ring-[#2f6bff]/30"
                            : optIdle
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 ${isActive ? "text-[#2f6bff]" : "text-[#94a3b8]"}`}
                          strokeWidth={1.75}
                        />
                        <span className="text-xs font-semibold">{CATEGORY_LABELS[cat]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="need-description"
                  className="block text-sm font-semibold text-[#334155]"
                >
                  Descripción <span className="text-[#ff7a59]">*</span>
                </label>
                <textarea
                  id="need-description"
                  placeholder="¿Qué se necesita? Incluye nombre y versión si aplica."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`${inputBase} min-h-[80px] resize-y`}
                  maxLength={500}
                  rows={3}
                />
                <p className="text-right text-[10px] text-[#c4cad8]">{description.length}/500</p>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="need-justification"
                  className="block text-sm font-semibold text-[#334155]"
                >
                  Justificación <span className="font-normal text-[#94a3b8]">(opcional)</span>
                </label>
                <textarea
                  id="need-justification"
                  placeholder="¿Para qué se usará? ¿Qué problema resuelve?"
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  className={`${inputBase} min-h-[80px] resize-y`}
                  maxLength={500}
                  rows={3}
                />
                <p className="text-right text-[10px] text-[#c4cad8]">{justification.length}/500</p>
              </div>
            </div>

            {/* ── Section 3: Priorización ── */}
            <div className="space-y-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-[#0f172a]">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#eaf0ff] text-[11px] font-bold text-[#2f6bff]">
                  3
                </span>
                Priorización
              </h3>

              <SliderField
                label="Impacto"
                value={impact}
                onChange={setImpact}
                description="¿Qué tan relevante es para el trabajo del área?"
                accentColor="#2f6bff"
              />
              <SliderField
                label="Urgencia"
                value={urgency}
                onChange={setUrgency}
                description="¿Cuándo se necesita?"
                accentColor="#ff7a59"
              />
              <SliderField
                label="Alcance"
                value={scope}
                onChange={setScope}
                description="¿A cuántas personas beneficia?"
                accentColor="#7c3aed"
              />

              {/* Live score preview */}
              <div className="flex items-center justify-between rounded-2xl border border-[#e7eaf3] bg-[#f6f8fd] px-5 py-4">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-[#2f6bff]" strokeWidth={2} />
                  <div>
                    <p className="text-xs font-semibold text-[#94a3b8]">Puntaje calculado</p>
                    <p className="font-outfit text-2xl font-extrabold text-[#0f172a]">
                      {score}
                      <span className="ml-1 text-sm font-medium text-[#94a3b8]">/ 125</span>
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-bold ${priorityMeta.bg} ${priorityMeta.text} ${priorityMeta.border}`}
                >
                  {priorityMeta.emoji} {priorityMeta.label}
                </span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                {error}
              </p>
            )}

            {/* Submit */}
            <div className="flex items-center justify-between border-t border-[#eef1f7] pt-6">
              <p className="flex items-center gap-1.5 text-xs text-[#94a3b8]">
                <Check className="h-3 w-3 text-[#22c197]" strokeWidth={3} />
                Puedes enviar más de una necesidad
              </p>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || !canSubmit}
                className={btnPrimary}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                    Enviando…
                  </>
                ) : (
                  <>
                    Enviar necesidad
                    <ArrowRight className="h-4 w-4" strokeWidth={2} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
