"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BrainCircuit,
  Boxes,
  Check,
  CircuitBoard,
  Code,
  Cog,
  FileCheck2,
  GitBranch,
  Hammer,
  MessagesSquare,
  Shield,
  Workflow,
  Wrench,
} from "lucide-react";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { servicesData } from "@/data/mock-data";
import type { Service } from "@/types";

const BEZIER = "cubic-bezier(0.23, 1, 0.32, 1)";

function renderIcon(name: string, className = "h-5 w-5") {
  const props = { className, strokeWidth: 1.5 as number };
  switch (name) {
    case "Code":
      return <Code {...props} />;
    case "BrainCircuit":
      return <BrainCircuit {...props} />;
    case "Shield":
      return <Shield {...props} />;
    case "CircuitBoard":
      return <CircuitBoard {...props} />;
    case "Cog":
      return <Cog {...props} />;
    case "Wrench":
      return <Wrench {...props} />;
    case "Boxes":
      return <Boxes {...props} />;
    case "Hammer":
      return <Hammer {...props} />;
    default:
      return <Code {...props} />;
  }
}

const PHASES = [
  {
    id: "01",
    title: "Diagnóstico",
    body: "Alcance escrito y rango de inversión antes de firmar.",
    duration: "1-2 sem",
  },
  {
    id: "02",
    title: "Construcción",
    body: "Sprints semanales con demo en tu repositorio.",
    duration: "Variable",
  },
  {
    id: "03",
    title: "Entrega",
    body: "Runbooks, infra y sesión de hand-off al cierre.",
    duration: "2 sem",
  },
] as const;

const COMMITMENTS = [
  {
    Icon: GitBranch,
    title: "Código en tu repositorio desde el primer commit.",
    body: "Tu cuenta de GitHub o GitLab. No reutilizamos código privado entre clientes.",
  },
  {
    Icon: MessagesSquare,
    title: "Hablas con el ingeniero, no con un PM.",
    body: "La persona técnica responsable es la que está en las llamadas contigo.",
  },
  {
    Icon: FileCheck2,
    title: "Alcance y precio escritos antes de empezar.",
    body: "Si algo cambia durante el proyecto, te avisamos antes de facturarlo.",
  },
  {
    Icon: Workflow,
    title: "Transferencia documentada al cierre.",
    body: "Infraestructura, secretos, runbooks y sesión de hand-off.",
  },
] as const;

function HeroVisual() {
  return (
    <svg
      viewBox="0 0 440 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-auto w-full max-w-sm"
    >
      <defs>
        <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="14"
            stdDeviation="22"
            floodColor="oklch(0.2 0.02 252)"
            floodOpacity="0.10"
          />
        </filter>
      </defs>
      {/* Main card */}
      <rect
        x="20"
        y="20"
        width="400"
        height="480"
        rx="24"
        fill="white"
        stroke="oklch(0.922 0.006 252)"
        strokeWidth="1.5"
        filter="url(#cardShadow)"
      />
      {/* Top accent bar */}
      <rect x="20" y="20" width="400" height="6" rx="3" fill="oklch(0.572 0.220 23)" />
      {/* Header row */}
      <rect x="48" y="56" width="80" height="10" rx="5" fill="oklch(0.55 0.02 252)" />
      <rect x="48" y="76" width="130" height="8" rx="4" fill="oklch(0.85 0.01 252)" />
      {/* Big metric */}
      <rect x="48" y="116" width="180" height="52" rx="10" fill="oklch(0.97 0.004 252)" />
      <rect x="64" y="132" width="60" height="22" rx="6" fill="oklch(0.572 0.220 23)" />
      <rect x="136" y="135" width="70" height="8" rx="4" fill="oklch(0.78 0.01 252)" />
      <rect x="136" y="151" width="50" height="6" rx="3" fill="oklch(0.88 0.008 252)" />
      {/* Small metric row */}
      <rect x="244" y="116" width="148" height="52" rx="10" fill="oklch(0.97 0.004 252)" />
      <rect x="260" y="132" width="40" height="22" rx="6" fill="oklch(0.70 0.02 252)" />
      <rect x="310" y="135" width="60" height="8" rx="4" fill="oklch(0.78 0.01 252)" />
      <rect x="310" y="151" width="42" height="6" rx="3" fill="oklch(0.88 0.008 252)" />
      {/* Divider */}
      <line x1="48" y1="192" x2="392" y2="192" stroke="oklch(0.92 0.006 252)" strokeWidth="1" />
      {/* List items */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect
            x="48"
            y={208 + i * 44}
            width="10"
            height="10"
            rx="3"
            fill={i === 0 ? "oklch(0.572 0.220 23)" : "oklch(0.85 0.01 252)"}
          />
          <rect
            x="68"
            y={210 + i * 44}
            width={100 + (i % 2) * 40}
            height="8"
            rx="4"
            fill="oklch(0.80 0.01 252)"
          />
          <rect
            x="68"
            y={224 + i * 44}
            width={60 + (i % 3) * 30}
            height="6"
            rx="3"
            fill="oklch(0.89 0.006 252)"
          />
          <rect
            x={340 - (i % 2) * 20}
            y={212 + i * 44}
            width={40 + (i % 2) * 20}
            height="10"
            rx="5"
            fill={i === 1 ? "oklch(0.572 0.220 23 / 0.15)" : "oklch(0.96 0.004 252)"}
          />
        </g>
      ))}
      {/* Bottom CTA bar */}
      <rect x="48" y="404" width="344" height="64" rx="12" fill="oklch(0.572 0.220 23)" />
      <rect x="148" y="424" width="120" height="12" rx="6" fill="white" opacity="0.95" />
      <rect x="148" y="444" width="80" height="8" rx="4" fill="white" opacity="0.6" />
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
      {/* ──────────────────────── HERO — light editorial ──────────────────────── */}
      <section
        id="services-hero"
        className="relative overflow-hidden bg-white pt-32 pb-24 sm:pt-40 sm:pb-28"
      >
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="space-y-7 lg:col-span-7">
            <span className="text-brand-500 block font-mono text-xs font-bold tracking-widest uppercase">
              Servicios
            </span>
            <h1 className="font-display text-ink-900 text-4xl leading-[1.07] font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Ingeniería que diseña, construye y <span className="text-brand-500">mantiene</span>.
            </h1>
            <p className="text-ink-600 max-w-xl text-lg leading-relaxed">
              Software, IA, electrónica, automatización, mantenimiento y fabricación, bajo un mismo
              equipo. Cada problema lo atiende el especialista que de verdad lo domina, desde el
              diagnóstico hasta la entrega.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => goToBudget()}
                className="bg-brand-500 shadow-brand-500/20 hover:bg-brand-600 hover:shadow-brand-600/25 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-medium text-white shadow-lg transition-all duration-200 active:scale-[0.97]"
                style={{ transitionTimingFunction: BEZIER }}
              >
                Calcular proyecto
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </button>
              <Link
                href="#services-process"
                className="border-ink-200 text-ink-900 hover:border-ink-300 hover:bg-ink-50 inline-flex items-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-medium transition-all duration-200 active:scale-[0.97]"
                style={{ transitionTimingFunction: BEZIER }}
              >
                Cómo trabajamos
              </Link>
            </div>
          </div>
          <div className="hidden justify-end lg:col-span-5 lg:flex">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* ──────────────────────── CATALOG ──────────────────────── */}
      <section id="services-catalog" className="bg-white py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <header className="mb-12 max-w-2xl space-y-3">
              <span className="text-brand-500 block font-mono text-xs font-bold tracking-widest uppercase">
                Catálogo
              </span>
              <h2 className="font-display text-ink-900 text-4xl font-semibold tracking-tight sm:text-5xl">
                Ocho disciplinas. El especialista correcto en cada una.
              </h2>
              <p className="text-ink-600 text-base leading-relaxed">
                Elige un servicio para ver qué entregamos, qué problemas resuelve y con qué
                herramientas trabajamos.
              </p>
            </header>
          </ScrollReveal>

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
                        ? "border-brand-500 bg-brand-500 shadow-brand-500/20 text-white shadow-md"
                        : "border-ink-200 text-ink-800 hover:border-ink-300 hover:bg-ink-50 bg-white"
                    }`}
                    style={{ transitionTimingFunction: BEZIER }}
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
                      <span
                        className={`mt-0.5 block text-sm leading-relaxed ${isSelected ? "text-white/70" : "text-ink-500"}`}
                      >
                        {svc.subtitle}
                      </span>
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Detail panel — DARK anchor */}
            <article
              key={active.id}
              className="animate-fade-in bg-ink-900 overflow-hidden rounded-2xl lg:col-span-8"
            >
              <div className="bg-brand-500 h-1" />
              <div className="space-y-7 p-7 sm:p-10">
                <header className="space-y-3">
                  <span className="text-brand-400 block font-mono text-xs font-bold tracking-widest uppercase">
                    {active.category}
                  </span>
                  <h3 className="font-display text-3xl font-semibold tracking-tight text-white">
                    {active.title}
                  </h3>
                  <p className="text-ink-300 text-base leading-relaxed">{active.description}</p>
                  <p className="text-ink-400 text-sm leading-relaxed">
                    {active.detailedDescription}
                  </p>
                </header>

                <div className="border-ink-800 grid grid-cols-1 gap-7 border-t pt-7 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="text-ink-500 text-xs font-semibold tracking-widest uppercase">
                      Qué entregamos
                    </h4>
                    <ul className="space-y-2.5">
                      {active.benefits.map((benefit, idx) => (
                        <li
                          key={idx}
                          className="text-ink-300 flex items-start gap-2.5 text-sm leading-relaxed"
                        >
                          <Check
                            className="text-brand-500 mt-0.5 h-4 w-4 flex-shrink-0"
                            strokeWidth={2}
                          />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-ink-500 text-xs font-semibold tracking-widest uppercase">
                      Problemas que abordamos
                    </h4>
                    <ul className="space-y-2.5">
                      {active.problemsSolved.map((problem, idx) => (
                        <li
                          key={idx}
                          className="text-ink-400 flex items-start gap-2.5 text-sm leading-relaxed"
                        >
                          <span
                            aria-hidden="true"
                            className="bg-ink-600 mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                          />
                          {problem}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="border-ink-800 space-y-3 border-t pt-6">
                  <h4 className="text-ink-500 text-xs font-semibold tracking-widest uppercase">
                    Stack
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {active.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="border-ink-700 bg-ink-800 text-ink-300 rounded-md border px-2.5 py-1 font-mono text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-ink-800 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-ink-500 text-sm">Respondemos en menos de 48 horas hábiles.</p>
                  <button
                    type="button"
                    onClick={() => goToBudget(active.title)}
                    className="bg-brand-500 shadow-brand-500/25 hover:bg-brand-600 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-md transition-all duration-200 active:scale-[0.97]"
                    style={{ transitionTimingFunction: BEZIER }}
                  >
                    Calcular este servicio
                    <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ──────────────────────── PROCESS ──────────────────────── */}
      <section id="services-process" className="border-ink-100 bg-ink-50 border-t py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <header className="mb-12 max-w-2xl space-y-3">
              <span className="text-brand-500 block font-mono text-xs font-bold tracking-widest uppercase">
                Cómo trabajamos
              </span>
              <h2 className="font-display text-ink-900 text-4xl font-semibold tracking-tight sm:text-5xl">
                Tres fases. Sin sorpresas en la factura.
              </h2>
            </header>
          </ScrollReveal>
          <ol className="border-ink-200 bg-ink-200 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border md:grid-cols-3">
            {PHASES.map((phase, idx) => (
              <ScrollReveal
                key={phase.id}
                as="li"
                delay={idx * 0.08}
                className="flex flex-col gap-4 bg-white p-7 sm:p-8"
              >
                <div className="flex items-baseline justify-between">
                  <span className="bg-brand-500 font-display shadow-brand-500/25 flex h-10 w-10 items-center justify-center rounded-xl text-base font-bold text-white shadow-md">
                    {phase.id}
                  </span>
                  <span className="text-ink-500 font-mono text-xs">{phase.duration}</span>
                </div>
                <h3 className="font-display text-ink-900 text-xl font-semibold tracking-tight">
                  {phase.title}
                </h3>
                <p className="text-ink-600 text-sm leading-relaxed">{phase.body}</p>
              </ScrollReveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ──────────────────────── COMMITMENTS ──────────────────────── */}
      <section id="services-commitments" className="bg-white py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <ScrollReveal className="space-y-4 lg:col-span-5">
              <span className="text-brand-500 block font-mono text-xs font-bold tracking-widest uppercase">
                Compromisos
              </span>
              <h2 className="font-display text-ink-900 text-4xl font-semibold tracking-tight sm:text-5xl">
                Lo que sí podemos prometer.
              </h2>
              <p className="text-ink-600 text-base leading-relaxed">
                Compromisos que firmamos por escrito y son verificables al cierre del proyecto.
              </p>
            </ScrollReveal>
            <ul className="border-ink-200 bg-ink-200 space-y-px overflow-hidden rounded-2xl border lg:col-span-7">
              {COMMITMENTS.map(({ Icon, title, body }, idx) => (
                <ScrollReveal
                  key={idx}
                  as="li"
                  delay={idx * 0.06}
                  className="flex gap-5 bg-white px-7 py-7"
                >
                  <span className="bg-brand-50 text-brand-600 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <div className="space-y-1.5">
                    <h3 className="text-ink-900 text-base font-semibold">{title}</h3>
                    <p className="text-ink-600 text-sm leading-relaxed">{body}</p>
                  </div>
                </ScrollReveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ──────────────────────── CTA — dark card ──────────────────────── */}
      <section id="services-cta" className="bg-ink-50 px-4 pb-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal direction="fade">
            <div className="bg-ink-900 relative overflow-hidden rounded-3xl px-6 py-16 text-center sm:px-12 sm:py-24">
              <div
                aria-hidden="true"
                className="bg-brand-500/10 pointer-events-none absolute top-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 blur-[80px]"
              />
              <div className="relative">
                <h2 className="font-display mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                  Hablemos sobre tu proyecto.
                </h2>
                <p className="text-ink-400 mx-auto mt-4 max-w-xl text-base leading-relaxed">
                  Una videollamada de 30 minutos para definir alcance, presupuesto y un punto de
                  inicio realista. Sin presentación corporativa.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => goToBudget()}
                    className="bg-brand-500 shadow-brand-500/30 hover:bg-brand-600 hover:shadow-brand-600/35 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-medium text-white shadow-lg transition-all duration-200 active:scale-[0.97]"
                    style={{ transitionTimingFunction: BEZIER }}
                  >
                    Calcular proyecto
                    <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                  <Link
                    href="/nosotros"
                    className="border-ink-700 bg-ink-800 text-ink-100 hover:border-ink-600 hover:bg-ink-700 inline-flex items-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-medium transition-colors duration-200"
                  >
                    Conocer al equipo
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
