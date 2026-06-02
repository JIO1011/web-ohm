"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { caseStudies } from "@/data/mock-data";
import type { CaseStudy } from "@/types";

interface ClientReview {
  name: string;
  role: string;
  quote: string;
  caseId: string;
}

// Testimonios reales tomados del sitio original de OhmRoyal (clientes
// anonimizados por acuerdo). Mapeados a los casos correspondientes.
const CLIENT_REVIEWS: readonly ClientReview[] = [
  {
    name: "María P.",
    role: "Administración de laboratorio",
    quote:
      "Pasamos de procesos en papel a una plataforma más clara y ordenada. El equipo entendió bien nuestras necesidades operativas.",
    caseId: "reactilab",
  },
  {
    name: "Representante de Trébol Plus",
    role: "Operación de entretenimiento",
    quote:
      "La máquina 360 quedó robusta, segura y con mejor estabilidad de video. Cumplió con lo que necesitábamos para uso en eventos.",
    caseId: "maquina-360",
  },
  {
    name: "Cliente bajo acuerdo",
    role: "Mantenimiento técnico",
    quote:
      "La intervención de mantenimiento fue técnica y ordenada. Se corrigieron fallas críticas y el equipo quedó operando de forma estable.",
    caseId: "mesa-quirurgica",
  },
] as const;

interface CaseConfig {
  metric: string;
  metricLabel: string;
  bars: readonly number[];
  accentClass: string;
  accentBgClass: string;
}

// La métrica destacada usa datos reales/verificables (año de entrega, estado,
// precisión dimensional). Las barras son ilustrativas — PLACEHOLDER hasta tener
// métricas reales aprobadas por el cliente.
const CASE_CONFIG: Record<string, CaseConfig> = {
  reactilab: {
    metric: "2025",
    metricLabel: "En producción · reacti-lab.com",
    bars: [0.4, 0.55, 0.7, 0.82, 0.9, 0.96],
    accentClass: "text-brand-600",
    accentBgClass: "bg-brand-600",
  },
  "maquina-360": {
    metric: "2026",
    metricLabel: "Validado en campo",
    bars: [0.5, 0.62, 0.7, 0.78, 0.86, 0.92],
    accentClass: "text-amber-500",
    accentBgClass: "bg-amber-500",
  },
  "mesa-quirurgica": {
    metric: "2025",
    metricLabel: "Operativo para uso clínico",
    bars: [0.45, 0.58, 0.66, 0.74, 0.83, 0.9],
    accentClass: "text-blue-400",
    accentBgClass: "bg-blue-400",
  },
  "placas-dentales-3d": {
    metric: "1:1",
    metricLabel: "Precisión dimensional",
    bars: [0.5, 0.6, 0.72, 0.8, 0.88, 0.94],
    accentClass: "text-emerald-500",
    accentBgClass: "bg-emerald-500",
  },
};

function CaseVisual({ caseId }: { caseId: string }) {
  const c = CASE_CONFIG[caseId] ?? CASE_CONFIG["reactilab"]!;

  return (
    <div aria-hidden="true" className="bg-ink-900 overflow-hidden rounded-2xl">
      {/* Header bar */}
      <div className="border-ink-800 bg-ink-950 flex items-center gap-2 border-b px-4 py-3">
        <span className={`h-2.5 w-2.5 rounded-full ${c.accentBgClass}`} />
        <span className="bg-ink-700 h-2.5 w-2.5 rounded-full" />
        <span className="bg-ink-700 h-2.5 w-2.5 rounded-full" />
        <span className="bg-ink-700 ml-3 h-2 w-24 rounded-full" />
      </div>

      {/* Body */}
      <div className="grid grid-cols-2 gap-4 p-5">
        {/* Metric block */}
        <div className="space-y-1.5">
          <p className="text-ink-500 font-mono text-xs">{c.metricLabel}</p>
          <p className={`font-display text-4xl font-bold ${c.accentClass}`}>{c.metric}</p>
          <div className="bg-ink-700 h-2 w-28 rounded-full" />
          <div className="bg-ink-800 h-2 w-20 rounded-full" />
        </div>

        {/* Side blocks */}
        <div className="space-y-2">
          <div className="bg-ink-800 rounded-lg p-3">
            <div className={`mb-1.5 h-4 w-10 rounded ${c.accentBgClass} opacity-70`} />
            <div className="bg-ink-700 h-2 w-20 rounded-full" />
          </div>
          <div className="bg-ink-800 rounded-lg p-3">
            <div className="mb-1.5 h-4 w-10 rounded bg-blue-500 opacity-60" />
            <div className="bg-ink-700 h-2 w-16 rounded-full" />
          </div>
        </div>

        {/* Bar chart */}
        <div className="col-span-2">
          <div className="flex items-end gap-1.5 pt-2" style={{ height: "64px" }}>
            {c.bars.map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className={`w-full rounded-sm ${
                    i === c.bars.length - 1 ? c.accentBgClass : "bg-ink-700"
                  }`}
                  style={{ height: `${Math.max(4, Math.round(h * 52))}px` }}
                />
                <div className="bg-ink-800 h-1.5 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Result row */}
        <div className="border-ink-800 col-span-2 flex items-center justify-between border-t pt-3">
          <div className={`h-5 w-24 rounded-md ${c.accentBgClass} opacity-15`} />
          <div className={`h-2 w-16 rounded-full ${c.accentBgClass}`} />
        </div>
      </div>
    </div>
  );
}

function HeroVisual() {
  return (
    <svg
      viewBox="0 0 440 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-auto w-full max-w-sm"
    >
      {/* Main card */}
      <rect x="20" y="20" width="400" height="480" rx="24" fill="oklch(0.215 0.042 252)" />
      {/* Top accent bar */}
      <rect x="20" y="20" width="400" height="6" rx="3" fill="oklch(0.572 0.220 23)" />
      {/* Header row */}
      <rect x="48" y="56" width="80" height="10" rx="5" fill="oklch(0.362 0.042 252)" />
      <rect x="48" y="76" width="130" height="8" rx="4" fill="oklch(0.285 0.042 252)" />
      {/* Big metric */}
      <rect x="48" y="116" width="180" height="52" rx="10" fill="oklch(0.152 0.030 252)" />
      <rect x="64" y="132" width="60" height="22" rx="6" fill="oklch(0.572 0.220 23)" />
      <rect x="136" y="135" width="70" height="8" rx="4" fill="oklch(0.362 0.042 252)" />
      <rect x="136" y="151" width="50" height="6" rx="3" fill="oklch(0.285 0.042 252)" />
      {/* Small metric row */}
      <rect x="244" y="116" width="148" height="52" rx="10" fill="oklch(0.152 0.030 252)" />
      <rect x="260" y="132" width="40" height="22" rx="6" fill="oklch(0.630 0.034 255)" />
      <rect x="310" y="135" width="60" height="8" rx="4" fill="oklch(0.362 0.042 252)" />
      <rect x="310" y="151" width="42" height="6" rx="3" fill="oklch(0.285 0.042 252)" />
      {/* Divider */}
      <line x1="48" y1="192" x2="392" y2="192" stroke="oklch(0.285 0.042 252)" strokeWidth="1" />
      {/* List items */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect
            x="48"
            y={208 + i * 44}
            width="10"
            height="10"
            rx="3"
            fill={i === 0 ? "oklch(0.572 0.220 23)" : "oklch(0.362 0.042 252)"}
          />
          <rect
            x="68"
            y={210 + i * 44}
            width={100 + (i % 2) * 40}
            height="8"
            rx="4"
            fill="oklch(0.362 0.042 252)"
          />
          <rect
            x="68"
            y={224 + i * 44}
            width={60 + (i % 3) * 30}
            height="6"
            rx="3"
            fill="oklch(0.285 0.042 252)"
          />
          <rect
            x={340 - (i % 2) * 20}
            y={212 + i * 44}
            width={40 + (i % 2) * 20}
            height="10"
            rx="5"
            fill={i === 1 ? "oklch(0.572 0.220 23 / 0.2)" : "oklch(0.152 0.030 252)"}
          />
        </g>
      ))}
      {/* Bottom CTA bar */}
      <rect x="48" y="404" width="344" height="64" rx="12" fill="oklch(0.572 0.220 23)" />
      <rect x="148" y="424" width="120" height="12" rx="6" fill="white" opacity="0.9" />
      <rect x="148" y="444" width="80" height="8" rx="4" fill="white" opacity="0.5" />
    </svg>
  );
}

export default function WorkSection() {
  const router = useRouter();
  const firstCase = caseStudies[0];
  if (!firstCase) throw new Error("caseStudies empty");

  const [selectedCaseId, setSelectedCaseId] = useState<string>(firstCase.id);
  const [reviewIndex, setReviewIndex] = useState<number>(0);

  const activeCase: CaseStudy = caseStudies.find((c) => c.id === selectedCaseId) ?? firstCase;
  const currentReview = CLIENT_REVIEWS[reviewIndex] ?? CLIENT_REVIEWS[0];
  if (!currentReview) throw new Error("Reviews empty");

  const handlePrevReview = () =>
    setReviewIndex((i) => (i - 1 + CLIENT_REVIEWS.length) % CLIENT_REVIEWS.length);
  const handleNextReview = () => setReviewIndex((i) => (i + 1) % CLIENT_REVIEWS.length);

  return (
    <div className="text-ink-900">
      {/* HERO — dark navy */}
      <section
        id="work-hero"
        className="bg-ink-900 relative flex min-h-screen flex-col justify-center overflow-hidden pt-32 pb-24 sm:pt-36 sm:pb-28"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(circle, oklch(0.963 0.013 145) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div
          aria-hidden="true"
          className="bg-brand-500/10 pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full blur-[100px]"
        />
        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="space-y-7 lg:col-span-7">
            <span className="text-brand-400 block font-mono text-xs font-bold tracking-widest uppercase">
              Trabajo
            </span>
            <h1 className="font-display text-4xl leading-[1.05] font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Proyectos reales, del software a la ingeniería aplicada.
            </h1>
            <p className="text-ink-400 max-w-xl text-lg leading-relaxed">
              Una selección de trabajos entregados: plataformas web, control electrónico,
              mantenimiento biomédico y diseño 3D. Cada uno con su reto, la solución y el resultado.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => router.push("/calcular-proyecto")}
                className="bg-brand-500 shadow-brand-500/30 hover:bg-brand-600 hover:shadow-brand-600/35 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-medium text-white shadow-lg transition-all duration-200 active:scale-[0.97]"
                style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
              >
                Calcular proyecto
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </button>
              <Link
                href="#work-cases"
                className="border-ink-700 bg-ink-800 text-ink-100 hover:border-ink-600 hover:bg-ink-700 inline-flex items-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-medium transition-colors duration-200"
              >
                Ver proyectos
              </Link>
            </div>
          </div>
          <div className="hidden justify-end lg:col-span-5 lg:flex">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* CASE SELECTOR */}
      <section id="work-cases" className="bg-ink-0 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            role="tablist"
            aria-label="Casos de estudio"
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            {caseStudies.map((c, idx) => {
              const isSelected = c.id === selectedCaseId;
              return (
                <button
                  key={c.id}
                  role="tab"
                  aria-selected={isSelected}
                  type="button"
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`flex flex-col gap-2 rounded-xl border px-5 py-4 text-left transition-all duration-200 ${
                    isSelected
                      ? "border-brand-500 bg-brand-500 shadow-brand-500/20 text-white shadow-md"
                      : "border-ink-200 text-ink-700 hover:border-ink-300 hover:bg-ink-50 bg-white"
                  }`}
                >
                  <span
                    className={`font-mono text-xs ${isSelected ? "text-white/70" : "text-ink-400"}`}
                  >
                    Caso 0{idx + 1}
                  </span>
                  <span className="text-sm leading-snug font-medium">{c.client}</span>
                  <span
                    className={`text-xs leading-relaxed ${isSelected ? "text-white/60" : "text-ink-500"}`}
                  >
                    {c.category}
                  </span>
                </button>
              );
            })}
          </div>

          <article
            key={activeCase.id}
            className="animate-fade-in mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12"
          >
            <div className="space-y-7 lg:col-span-7">
              <header className="space-y-4">
                <span className="text-brand-600 block font-mono text-xs font-bold tracking-widest uppercase">
                  {activeCase.category}
                </span>
                <h2 className="font-display text-ink-900 text-3xl font-semibold tracking-tight sm:text-4xl">
                  {activeCase.title}
                </h2>
                <p className="text-ink-700 text-lg leading-relaxed">{activeCase.description}</p>
              </header>

              <div className="border-ink-100 space-y-6 border-t pt-7">
                <div className="space-y-2.5">
                  <h3 className="text-ink-500 text-sm font-semibold tracking-[0.08em] uppercase">
                    El reto
                  </h3>
                  <p className="text-ink-700 text-base leading-relaxed">{activeCase.challenge}</p>
                </div>
                <div className="space-y-2.5">
                  <h3 className="text-ink-500 text-sm font-semibold tracking-[0.08em] uppercase">
                    La solución
                  </h3>
                  <p className="text-ink-700 text-base leading-relaxed">{activeCase.solution}</p>
                </div>
              </div>

              <div className="border-ink-100 space-y-3 border-t pt-6">
                <h3 className="text-ink-500 text-sm font-semibold tracking-[0.08em] uppercase">
                  Stack
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {activeCase.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="border-ink-200 text-ink-700 rounded-md border bg-white px-2.5 py-1 font-mono text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <aside className="space-y-5 lg:col-span-5">
              <div className="border-ink-200 overflow-hidden rounded-2xl border bg-white shadow-sm">
                <CaseVisual caseId={activeCase.id} />
              </div>

              <div className="border-ink-200 space-y-4 overflow-hidden rounded-2xl border bg-white">
                <div className="bg-brand-500 h-1" />
                <div className="space-y-3 px-6 pb-6">
                  <h3 className="text-ink-500 text-sm font-semibold tracking-[0.08em] uppercase">
                    Resultados
                  </h3>
                  <ul className="space-y-2.5">
                    {activeCase.results.map((result, idx) => (
                      <li
                        key={idx}
                        className="text-ink-700 flex items-start gap-2.5 text-sm leading-relaxed"
                      >
                        <Check
                          className="text-brand-500 mt-0.5 h-4 w-4 flex-shrink-0"
                          strokeWidth={2}
                        />
                        {result}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push("/calcular-proyecto")}
                className="bg-ink-900 text-ink-0 hover:bg-ink-800 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-colors"
              >
                Cotizar un proyecto similar
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </aside>
          </article>
        </div>
      </section>

      {/* TESTIMONIALS — white */}
      <section id="work-testimonials" className="border-ink-100 border-y bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <header className="mb-12 max-w-2xl space-y-3">
            <span className="text-brand-600 block font-mono text-xs font-bold tracking-widest uppercase">
              Testimonios
            </span>
            <h2 className="font-display text-ink-900 text-3xl font-semibold tracking-tight sm:text-4xl">
              Lo que dicen nuestros clientes.
            </h2>
          </header>

          <div className="border-ink-200 bg-ink-200 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border lg:grid-cols-12">
            <div className="bg-ink-900 flex flex-col justify-between gap-6 p-8 lg:col-span-4">
              <Quote className="text-brand-500 h-8 w-8" strokeWidth={1.5} />
              <div className="space-y-1.5">
                <p className="text-ink-500 font-mono text-xs">
                  {String(reviewIndex + 1).padStart(2, "0")} /{" "}
                  {String(CLIENT_REVIEWS.length).padStart(2, "0")}
                </p>
                <h3 className="font-display text-ink-0 text-xl font-semibold">
                  {currentReview.name}
                </h3>
                <p className="text-ink-400 text-sm">{currentReview.role}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevReview}
                  aria-label="Testimonio anterior"
                  className="border-ink-700 bg-ink-800 text-ink-300 hover:border-ink-600 hover:bg-ink-700 rounded-full border p-2 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={handleNextReview}
                  aria-label="Testimonio siguiente"
                  className="border-ink-700 bg-ink-800 text-ink-300 hover:border-ink-600 hover:bg-ink-700 rounded-full border p-2 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-6 bg-white p-8 sm:p-10 lg:col-span-8">
              <p className="font-display text-ink-800 text-xl leading-relaxed sm:text-2xl">
                &ldquo;{currentReview.quote}&rdquo;
              </p>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedCaseId(currentReview.caseId);
                  document.getElementById("work-cases")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-brand-600 hover:text-brand-700 inline-flex items-center gap-2 text-sm font-medium"
              >
                Ver el caso completo
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA — dark navy */}
      <section id="work-cta" className="bg-ink-0 px-4 pt-24 pb-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="bg-ink-900 relative overflow-hidden rounded-3xl px-6 py-16 text-center sm:px-12 sm:py-20">
            <div
              aria-hidden="true"
              className="bg-brand-500/10 pointer-events-none absolute top-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 blur-[80px]"
            />
            <div className="relative">
              <h2 className="font-display mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                ¿Tu proyecto se parece a alguno de estos?
              </h2>
              <p className="text-ink-400 mx-auto mt-4 max-w-xl text-base leading-relaxed">
                Cuéntanos qué necesitas en una primera videollamada. Definimos alcance, presupuesto
                y un punto de inicio realista. Sin compromiso.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/calcular-proyecto")}
                  className="bg-brand-500 shadow-brand-500/30 hover:bg-brand-600 hover:shadow-brand-600/35 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-medium text-white shadow-lg transition-all duration-200 active:scale-[0.97]"
                  style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
                >
                  Agendar diagnóstico
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </button>
                <Link
                  href="/servicios"
                  className="border-ink-700 bg-ink-800 text-ink-100 hover:border-ink-600 hover:bg-ink-700 inline-flex items-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-medium transition-colors duration-200"
                >
                  Ver servicios
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
