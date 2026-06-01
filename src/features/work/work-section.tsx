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

const CLIENT_REVIEWS: readonly ClientReview[] = [
  {
    name: "Mariana Gaviria",
    role: "VP de Tecnología, Mozaico S.A.S.",
    quote: "El cambio de stack y la caché Redis nos quitaron el problema de raíz. Ya no reiniciamos servicios manualmente y los analistas dejaron de quejarse en Slack.",
    caseId: "mozaico-interactivo",
  },
  {
    name: "Arthur Pendelton",
    role: "Director de DevSecOps, SecureVault",
    quote: "Lo que más valoramos fue el documento de hallazgos. CVSS, mitigación y un retest agendado. No es lo habitual.",
    caseId: "securevault-enterprise",
  },
  {
    name: "Esteban Ruiz",
    role: "Gerente de operaciones, Aura Retail Group",
    quote: "Pasamos de pronosticar inventario con Excel mensual a tener el modelo en producción. Los primeros tres meses ya pagaron el proyecto.",
    caseId: "aura-ai-analytics",
  },
] as const;

interface CaseConfig {
  metric: string;
  metricLabel: string;
  bars: readonly number[];
  accentClass: string;
  accentBgClass: string;
}

const CASE_CONFIG: Record<string, CaseConfig> = {
  "mozaico-interactivo": {
    metric: "220ms",
    metricLabel: "Latencia de consulta",
    bars: [0.9, 0.3, 0.72, 0.95, 0.48, 0.82],
    accentClass: "text-brand-600",
    accentBgClass: "bg-brand-600",
  },
  "securevault-enterprise": {
    metric: "0",
    metricLabel: "Vulnerabilidades críticas",
    bars: [0.08, 0.0, 0.03, 0.0, 0.0, 0.02],
    accentClass: "text-blue-400",
    accentBgClass: "bg-blue-400",
  },
  "aura-ai-analytics": {
    metric: "93%",
    metricLabel: "Precisión del modelo",
    bars: [0.72, 0.80, 0.85, 0.88, 0.91, 0.93],
    accentClass: "text-amber-500",
    accentBgClass: "bg-amber-500",
  },
};

function CaseVisual({ caseId }: { caseId: string }) {
  const c = CASE_CONFIG[caseId] ?? CASE_CONFIG["mozaico-interactivo"]!;

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-2xl bg-ink-900"
    >
      {/* Header bar */}
      <div className="flex items-center gap-2 border-b border-ink-800 bg-ink-950 px-4 py-3">
        <span className={`h-2.5 w-2.5 rounded-full ${c.accentBgClass}`} />
        <span className="h-2.5 w-2.5 rounded-full bg-ink-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink-700" />
        <span className="ml-3 h-2 w-24 rounded-full bg-ink-700" />
      </div>

      {/* Body */}
      <div className="grid grid-cols-2 gap-4 p-5">
        {/* Metric block */}
        <div className="space-y-1.5">
          <p className="font-mono text-xs text-ink-500">{c.metricLabel}</p>
          <p className={`font-display text-4xl font-bold ${c.accentClass}`}>
            {c.metric}
          </p>
          <div className="h-2 w-28 rounded-full bg-ink-700" />
          <div className="h-2 w-20 rounded-full bg-ink-800" />
        </div>

        {/* Side blocks */}
        <div className="space-y-2">
          <div className="rounded-lg bg-ink-800 p-3">
            <div className={`mb-1.5 h-4 w-10 rounded ${c.accentBgClass} opacity-70`} />
            <div className="h-2 w-20 rounded-full bg-ink-700" />
          </div>
          <div className="rounded-lg bg-ink-800 p-3">
            <div className="mb-1.5 h-4 w-10 rounded bg-blue-500 opacity-60" />
            <div className="h-2 w-16 rounded-full bg-ink-700" />
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
                <div className="h-1.5 w-full rounded-full bg-ink-800" />
              </div>
            ))}
          </div>
        </div>

        {/* Result row */}
        <div className="col-span-2 flex items-center justify-between border-t border-ink-800 pt-3">
          <div className={`h-5 w-24 rounded-md ${c.accentBgClass} opacity-15`} />
          <div className={`h-2 w-16 rounded-full ${c.accentBgClass}`} />
        </div>
      </div>
    </div>
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

  const handlePrevReview = () => setReviewIndex((i) => (i - 1 + CLIENT_REVIEWS.length) % CLIENT_REVIEWS.length);
  const handleNextReview = () => setReviewIndex((i) => (i + 1) % CLIENT_REVIEWS.length);

  return (
    <div className="text-ink-900">
      {/* HERO — dark navy */}
      <section id="work-hero" className="relative overflow-hidden bg-ink-900 pb-24 pt-32 sm:pb-28 sm:pt-36">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "radial-gradient(circle, oklch(0.963 0.013 145) 1px, transparent 1px)", backgroundSize: "36px 36px" }}
        />
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-brand-500/10 blur-[100px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <p className="font-mono text-xs tracking-[0.08em] text-brand-400">Casos</p>
            <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink-0 sm:text-5xl lg:text-6xl">
              Tres proyectos. Resultados verificables.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-ink-400">
              Cada caso con su reto inicial, la solución que implementamos y métricas que el
              cliente puede confirmar.
            </p>
          </div>
        </div>
      </section>

      {/* CASE SELECTOR */}
      <section id="work-cases" className="bg-ink-0 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div role="tablist" aria-label="Casos de estudio" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
                      ? "border-brand-500 bg-brand-500 text-white shadow-md shadow-brand-500/20"
                      : "border-ink-200 bg-white text-ink-700 hover:border-ink-300 hover:bg-ink-50"
                  }`}
                >
                  <span className={`font-mono text-xs ${isSelected ? "text-white/70" : "text-ink-400"}`}>
                    Caso 0{idx + 1}
                  </span>
                  <span className="text-sm font-medium leading-snug">{c.client}</span>
                  <span className={`text-xs leading-relaxed ${isSelected ? "text-white/60" : "text-ink-500"}`}>
                    {c.category}
                  </span>
                </button>
              );
            })}
          </div>

          <article key={activeCase.id} className="animate-fade-in mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="space-y-7 lg:col-span-7">
              <header className="space-y-4">
                <p className="font-mono text-xs tracking-[0.08em] text-brand-600">{activeCase.category}</p>
                <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
                  {activeCase.title}
                </h2>
                <p className="text-lg leading-relaxed text-ink-700">{activeCase.description}</p>
              </header>

              <div className="space-y-6 border-t border-ink-100 pt-7">
                <div className="space-y-2.5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-ink-500">El reto</h3>
                  <p className="text-base leading-relaxed text-ink-700">{activeCase.challenge}</p>
                </div>
                <div className="space-y-2.5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-ink-500">La solución</h3>
                  <p className="text-base leading-relaxed text-ink-700">{activeCase.solution}</p>
                </div>
              </div>

              <div className="space-y-3 border-t border-ink-100 pt-6">
                <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-ink-500">Stack</h3>
                <div className="flex flex-wrap gap-1.5">
                  {activeCase.technologies.map((tech, idx) => (
                    <span key={idx} className="rounded-md border border-ink-200 bg-white px-2.5 py-1 font-mono text-xs text-ink-700">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <aside className="space-y-5 lg:col-span-5">
              <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-sm">
                <CaseVisual caseId={activeCase.id} />
              </div>

              <div className="space-y-4 overflow-hidden rounded-2xl border border-ink-200 bg-white">
                <div className="h-1 bg-brand-500" />
                <div className="space-y-3 px-6 pb-6">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-ink-500">Resultados</h3>
                  <ul className="space-y-2.5">
                    {activeCase.results.map((result, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-700">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-500" strokeWidth={2} />
                        {result}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push("/calcular-proyecto")}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink-900 px-5 py-3 text-sm font-medium text-ink-0 transition-colors hover:bg-ink-800"
              >
                Cotizar un proyecto similar
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </aside>
          </article>
        </div>
      </section>

      {/* TESTIMONIALS — white */}
      <section id="work-testimonials" className="border-y border-ink-100 bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <header className="mb-12 max-w-2xl space-y-3">
            <p className="font-mono text-xs tracking-[0.08em] text-brand-600">Lo que dicen</p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
              Tres conversaciones, sin guion.
            </h2>
          </header>

          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-ink-200 bg-ink-200 lg:grid-cols-12">
            <div className="flex flex-col justify-between gap-6 bg-ink-900 p-8 lg:col-span-4">
              <Quote className="h-8 w-8 text-brand-500" strokeWidth={1.5} />
              <div className="space-y-1.5">
                <p className="font-mono text-xs text-ink-500">
                  {String(reviewIndex + 1).padStart(2, "0")} / {String(CLIENT_REVIEWS.length).padStart(2, "0")}
                </p>
                <h3 className="font-display text-xl font-semibold text-ink-0">{currentReview.name}</h3>
                <p className="text-sm text-ink-400">{currentReview.role}</p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={handlePrevReview} aria-label="Testimonio anterior"
                  className="rounded-full border border-ink-700 bg-ink-800 p-2 text-ink-300 transition-colors hover:border-ink-600 hover:bg-ink-700">
                  <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
                </button>
                <button type="button" onClick={handleNextReview} aria-label="Testimonio siguiente"
                  className="rounded-full border border-ink-700 bg-ink-800 p-2 text-ink-300 transition-colors hover:border-ink-600 hover:bg-ink-700">
                  <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-6 bg-white p-8 sm:p-10 lg:col-span-8">
              <p className="font-display text-xl leading-relaxed text-ink-800 sm:text-2xl">
                &ldquo;{currentReview.quote}&rdquo;
              </p>
              <Link href="#" onClick={(e) => { e.preventDefault(); setSelectedCaseId(currentReview.caseId); document.getElementById("work-cases")?.scrollIntoView({ behavior: "smooth" }); }}
                className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700">
                Ver el caso completo
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA — dark navy */}
      <section id="work-cta" className="bg-ink-0 px-4 pb-28 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl bg-ink-900 px-6 py-16 text-center sm:px-12 sm:py-20">
            <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 bg-brand-500/10 blur-[80px]" />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink-0 sm:text-4xl">
                ¿Tu proyecto se parece a alguno de estos?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-400">
                Si tu caso encaja, podemos compartirte más detalles bajo NDA durante la primera
                videollamada.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button type="button" onClick={() => router.push("/calcular-proyecto")}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-brand-500/30 transition-all hover:bg-brand-600 active:scale-95">
                  Agendar diagnóstico
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </button>
                <Link href="/servicios"
                  className="inline-flex items-center gap-2 rounded-xl border border-ink-700 bg-ink-800 px-6 py-3 text-sm font-medium text-ink-100 transition-colors hover:border-ink-600 hover:bg-ink-700">
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
