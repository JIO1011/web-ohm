"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  Cloud,
  Cpu,
  FileCheck2,
  GitBranch,
  LayoutGrid,
  MessagesSquare,
  Server,
  Shield,
  ShieldAlert,
  Smartphone,
  Workflow,
} from "lucide-react";
import { servicesData } from "@/data/mock-data";
import type { Service } from "@/types";

function renderIcon(name: string, className = "h-5 w-5") {
  const props = { className, strokeWidth: 1.5 as number };
  switch (name) {
    case "LayoutGrid":  return <LayoutGrid  {...props} />;
    case "Server":      return <Server      {...props} />;
    case "BrainCircuit":return <BrainCircuit{...props} />;
    case "Smartphone":  return <Smartphone  {...props} />;
    case "Cpu":         return <Cpu         {...props} />;
    case "ShieldAlert": return <ShieldAlert {...props} />;
    case "Cloud":       return <Cloud       {...props} />;
    case "Shield":      return <Shield      {...props} />;
    default:            return <Cpu         {...props} />;
  }
}

const PHASES = [
  { id: "01", title: "Diagnóstico", body: "Alcance escrito y rango de inversión antes de firmar.", duration: "1-2 sem" },
  { id: "02", title: "Construcción", body: "Sprints semanales con demo en tu repositorio.", duration: "Variable" },
  { id: "03", title: "Entrega", body: "Runbooks, infra y sesión de hand-off al cierre.", duration: "2 sem" },
] as const;

const COMMITMENTS = [
  { Icon: GitBranch,       title: "Código en tu repositorio desde el primer commit.", body: "Tu cuenta de GitHub o GitLab. No reutilizamos código privado entre clientes." },
  { Icon: MessagesSquare,  title: "Hablas con el ingeniero, no con un PM.",            body: "La persona técnica responsable es la que está en las llamadas contigo." },
  { Icon: FileCheck2,      title: "Alcance y precio escritos antes de empezar.",       body: "Si algo cambia durante el proyecto, te avisamos antes de facturarlo." },
  { Icon: Workflow,        title: "Transferencia documentada al cierre.",              body: "Infraestructura, secretos, runbooks y sesión de hand-off." },
] as const;

function HeroVisual() {
  return (
    <svg viewBox="0 0 440 520" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-auto w-full max-w-sm">
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
      {[0,1,2,3].map((i) => (
        <g key={i}>
          <rect x="48" y={208 + i * 44} width="10" height="10" rx="3" fill={i === 0 ? "oklch(0.572 0.220 23)" : "oklch(0.362 0.042 252)"} />
          <rect x="68" y={210 + i * 44} width={100 + (i % 2) * 40} height="8" rx="4" fill="oklch(0.362 0.042 252)" />
          <rect x="68" y={224 + i * 44} width={60 + (i % 3) * 30} height="6" rx="3" fill="oklch(0.285 0.042 252)" />
          <rect x={340 - (i % 2) * 20} y={212 + i * 44} width={40 + (i % 2) * 20} height="10" rx="5" fill={i === 1 ? "oklch(0.572 0.220 23 / 0.2)" : "oklch(0.152 0.030 252)"} />
        </g>
      ))}
      {/* Bottom CTA bar */}
      <rect x="48" y="404" width="344" height="64" rx="12" fill="oklch(0.572 0.220 23)" />
      <rect x="148" y="424" width="120" height="12" rx="6" fill="white" opacity="0.9" />
      <rect x="148" y="444" width="80" height="8" rx="4" fill="white" opacity="0.5" />
    </svg>
  );
}

export default function ServicesSection() {
  const router = useRouter();
  const firstService = servicesData[0];
  if (!firstService) throw new Error("servicesData empty");

  const [selectedServiceId, setSelectedServiceId] = useState<string>(firstService.id);
  const active: Service = servicesData.find((svc) => svc.id === selectedServiceId) ?? firstService;

  const goToBudget = (preset?: string) => {
    const search = preset ? `?service=${encodeURIComponent(preset)}` : "";
    router.push(`/calcular-proyecto${search}`);
  };

  return (
    <div className="text-ink-900">
      {/* HERO — dark navy */}
      <section
        id="services-hero"
        className="relative overflow-hidden bg-ink-900 pb-24 pt-32 sm:pb-28 sm:pt-36"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(circle, oklch(0.963 0.013 145) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-brand-500/10 blur-[100px]" />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-end gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="space-y-7 lg:col-span-7">
            <p className="font-mono text-xs tracking-[0.08em] text-brand-400">Servicios</p>
            <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink-0 sm:text-5xl lg:text-6xl">
              Ingeniería de software para empresas que ya tienen equipo técnico.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-ink-400">
              Diseñamos, construimos y mantenemos plataformas web, móviles y de
              infraestructura. Trabajamos directamente con tu CTO o gerente de producto.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => goToBudget()}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-brand-500/30 transition-all hover:bg-brand-600 active:scale-95"
              >
                Cotizar un proyecto
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </button>
              <Link
                href="/trabajo"
                className="inline-flex items-center gap-2 rounded-xl border border-ink-700 bg-ink-800 px-6 py-3 text-sm font-medium text-ink-100 transition-colors hover:border-ink-600 hover:bg-ink-700"
              >
                Ver casos de trabajo
              </Link>
            </div>
          </div>
          <div className="hidden justify-end lg:col-span-5 lg:flex">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* CATALOG */}
      <section
        id="services-catalog"
        className="bg-ink-0 py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <header className="mb-12 max-w-2xl space-y-3">
            <p className="font-mono text-xs tracking-[0.08em] text-brand-600">Catálogo</p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
              Ocho servicios. Un equipo responsable de extremo a extremo.
            </h2>
          </header>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Service selector */}
            <nav aria-label="Lista de servicios" className="space-y-1.5 lg:col-span-4">
              {servicesData.map((svc) => {
                const isSelected = svc.id === selectedServiceId;
                return (
                  <button
                    key={svc.id}
                    type="button"
                    onClick={() => setSelectedServiceId(svc.id)}
                    aria-pressed={isSelected}
                    className={`group flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-200 ${
                      isSelected
                        ? "border-brand-500 bg-brand-500 text-white shadow-md shadow-brand-500/20"
                        : "border-ink-200 bg-white text-ink-800 hover:border-ink-300 hover:bg-ink-50"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${
                        isSelected ? "bg-white/20 text-white" : "bg-ink-100 text-ink-700"
                      }`}
                    >
                      {renderIcon(svc.icon)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-base font-medium">{svc.title}</span>
                      <span className={`mt-0.5 block text-sm leading-relaxed ${isSelected ? "text-white/70" : "text-ink-500"}`}>
                        {svc.subtitle}
                      </span>
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Detail panel — DARK */}
            <article
              key={active.id}
              className="animate-fade-in overflow-hidden rounded-2xl bg-ink-900 lg:col-span-8"
            >
              <div className="h-1 bg-brand-500" />
              <div className="space-y-7 p-7 sm:p-10">
                <header className="space-y-3">
                  <p className="font-mono text-xs tracking-[0.08em] text-brand-400">{active.category}</p>
                  <h3 className="font-display text-3xl font-semibold tracking-tight text-ink-0">
                    {active.title}
                  </h3>
                  <p className="text-base leading-relaxed text-ink-300">{active.description}</p>
                  <p className="text-sm leading-relaxed text-ink-400">{active.detailedDescription}</p>
                </header>

                <div className="grid grid-cols-1 gap-7 border-t border-ink-800 pt-7 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-500">
                      Qué entregamos
                    </h4>
                    <ul className="space-y-2.5">
                      {active.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-300">
                          <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-500" strokeWidth={2} />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-500">
                      Problemas que abordamos
                    </h4>
                    <ul className="space-y-2.5">
                      {active.problemsSolved.map((problem, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-400">
                          <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-ink-600" />
                          {problem}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-3 border-t border-ink-800 pt-6">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-500">Stack</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {active.technologies.map((tech, idx) => (
                      <span key={idx} className="rounded-md border border-ink-700 bg-ink-800 px-2.5 py-1 font-mono text-xs text-ink-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-ink-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-ink-500">Respondemos en menos de 48 horas hábiles.</p>
                  <button
                    type="button"
                    onClick={() => goToBudget(active.title)}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-brand-500/25 transition-all hover:bg-brand-600 active:scale-95"
                  >
                    Cotizar este servicio
                    <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="services-process" className="bg-white py-24 border-y border-ink-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <header className="mb-12 max-w-2xl space-y-3">
            <p className="font-mono text-xs tracking-[0.08em] text-brand-600">Cómo trabajamos</p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
              Tres fases. Sin sorpresas en la factura.
            </h2>
          </header>
          <ol className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-ink-200 bg-ink-200 md:grid-cols-3">
            {PHASES.map((phase) => (
              <li key={phase.id} className="flex flex-col gap-4 bg-ink-0 p-7 sm:p-8">
                <div className="flex items-baseline justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 font-display text-base font-bold text-white shadow-md shadow-brand-500/25">
                    {phase.id}
                  </span>
                  <span className="font-mono text-xs text-ink-500">{phase.duration}</span>
                </div>
                <h3 className="font-display text-xl font-semibold tracking-tight text-ink-900">{phase.title}</h3>
                <p className="text-sm leading-relaxed text-ink-600">{phase.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* COMMITMENTS */}
      <section id="services-commitments" className="bg-ink-0 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-5">
              <p className="font-mono text-xs tracking-[0.08em] text-brand-600">Compromisos</p>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
                Lo que sí podemos prometer.
              </h2>
              <p className="text-base leading-relaxed text-ink-600">
                Compromisos que firmamos por escrito y son verificables al cierre del proyecto.
              </p>
            </div>
            <ul className="space-y-px overflow-hidden rounded-2xl border border-ink-200 bg-ink-200 lg:col-span-7">
              {COMMITMENTS.map(({ Icon, title, body }, idx) => (
                <li key={idx} className="flex gap-5 bg-white px-7 py-7">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <div className="space-y-1.5">
                    <h3 className="text-base font-semibold text-ink-900">{title}</h3>
                    <p className="text-sm leading-relaxed text-ink-600">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA — dark navy */}
      <section id="services-cta" className="bg-ink-0 px-4 pb-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl bg-ink-900 px-6 py-16 text-center sm:px-12 sm:py-20">
            <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 bg-brand-500/10 blur-[80px]" />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink-0 sm:text-4xl">
                Hablemos sobre tu proyecto.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-400">
                30 minutos para definir alcance, presupuesto y un punto de inicio realista.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => goToBudget()}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-brand-500/30 transition-all hover:bg-brand-600 active:scale-95"
                >
                  Calcular proyecto
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </button>
                <Link
                  href="/trabajo"
                  className="inline-flex items-center gap-2 rounded-xl border border-ink-700 bg-ink-800 px-6 py-3 text-sm font-medium text-ink-100 transition-colors hover:border-ink-600 hover:bg-ink-700"
                >
                  Ver casos de trabajo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
