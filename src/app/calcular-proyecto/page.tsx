import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator, Sparkles } from "lucide-react";
import ScrollReveal from "@/components/ui/scroll-reveal";

export const metadata: Metadata = {
  title: "Calcular Proyecto",
  description:
    "Herramientas de OhmRoyal para estimar, planificar y arrancar tu proyecto. Empieza con el presupuestador de software.",
};

export default function CalcularProyectoPage() {
  return (
    <div className="bg-[#f6f7fb] text-[#0f172a]">
      {/* HERO */}
      <section className="relative overflow-hidden pt-12 pb-8 sm:pt-16 sm:pb-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 right-6 h-72 w-72 rounded-full bg-[#2f6bff]/15 blur-[90px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 right-48 h-56 w-56 rounded-full bg-[#ff7a59]/15 blur-[90px]"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eaf0ff] px-3 py-1 text-xs font-semibold text-[#2f6bff]">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
              Calcular proyecto
            </span>
            <h1 className="font-outfit text-4xl font-bold tracking-tight text-[#0f172a] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
              Elige por dónde empezar.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-[#64748b]">
              Herramientas para estimar, planificar y arrancar tu proyecto con nosotros. Hoy puedes
              diseñar un presupuesto en minutos; pronto sumaremos más.
            </p>
          </div>
        </div>
      </section>

      {/* TOOL CARDS */}
      <section className="mx-auto max-w-7xl px-4 pt-4 pb-28 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Presupuestador — active cobalt card */}
          <ScrollReveal>
            <Link
              href="/calcular-proyecto/presupuestador"
              className="group relative flex h-full min-h-[340px] flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-[#2f6bff] to-[#1e40af] p-8 text-white shadow-[0_24px_60px_-24px_rgba(47,107,255,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_30px_70px_-22px_rgba(47,107,255,0.65)] active:scale-[0.99] sm:p-10"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-16 -right-10 h-48 w-48 rounded-full bg-white/15 blur-2xl"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-[#ff7a59]/30 blur-3xl"
              />
              <div className="relative">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
                  <Calculator className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <span className="mt-6 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                  Disponible ahora
                </span>
                <h2 className="font-outfit mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                  Presupuestador de software
                </h2>
                <p className="mt-2 max-w-md text-base leading-relaxed text-white/80">
                  Diseña el alcance, estima arquitectura, tiempo y un rango de inversión realista en
                  tres pasos. Luego agenda la primera videollamada.
                </p>
              </div>
              <span className="relative mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white">
                Abrir presupuestador
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2}
                />
              </span>
            </Link>
          </ScrollReveal>

          {/* Próximamente — coral-tinted placeholder card */}
          <ScrollReveal delay={0.08}>
            <div className="relative flex h-full min-h-[340px] flex-col justify-between overflow-hidden rounded-3xl border border-[#e7eaf3] bg-white p-8 sm:p-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-16 -right-10 h-44 w-44 rounded-full bg-[#ff7a59]/10 blur-2xl"
              />
              <div className="relative">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1ec] text-[#ff7a59]">
                  <Sparkles className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <span className="mt-6 inline-block rounded-full bg-[#fff3d6] px-3 py-1 text-xs font-semibold text-[#b45309]">
                  Próximamente
                </span>
                <h2 className="font-outfit mt-3 text-2xl font-bold tracking-tight text-[#0f172a] sm:text-3xl">
                  Diagnóstico técnico asistido
                </h2>
                <p className="mt-2 max-w-md text-base leading-relaxed text-[#64748b]">
                  Una herramienta para auditar tu stack, detectar riesgos OWASP y priorizar mejoras
                  antes de escalar. En construcción.
                </p>
              </div>
              <span className="relative mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#94a3b8]">
                Disponible pronto
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
