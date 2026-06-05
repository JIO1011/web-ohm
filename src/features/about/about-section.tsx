import Link from "next/link";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Boxes,
  Code,
  Eye,
  HeartPulse,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ScrollReveal from "@/components/ui/scroll-reveal";

const BEZIER = "cubic-bezier(0.23, 1, 0.32, 1)";

interface Certification {
  Icon: LucideIcon;
  credential: string;
  issuer: string;
  holder: string;
  discipline: string;
}

// Certificaciones reales del equipo (perfiles del sitio original).
// Selección curada: una por disciplina, atribuida a su titular.
const CERTIFICATIONS: readonly Certification[] = [
  {
    Icon: ShieldCheck,
    credential: "ISO/IEC 27001",
    issuer: "TÜV Rheinland",
    holder: "Jorge Inlago",
    discipline: "Ciberseguridad",
  },
  {
    Icon: Boxes,
    credential: "SolidWorks Associate (CSWA)",
    issuer: "Dassault Systèmes",
    holder: "Cristopher Collaguazo",
    discipline: "Diseño mecánico 3D",
  },
  {
    Icon: Code,
    credential: "Full Stack Open",
    issuer: "Universidad de Helsinki",
    holder: "Cristopher Collaguazo",
    discipline: "Desarrollo de software",
  },
  {
    Icon: HeartPulse,
    credential: "Mantenimiento de equipos médicos",
    issuer: "Formación especializada",
    holder: "Edisson Ortiz",
    discipline: "Electrónica biomédica",
  },
] as const;


const WHY_US = [
  {
    Icon: Users,
    title: "El especialista indicado, no un generalista.",
    body: "Cada tipo de problema lo atiende quien tiene trayectoria comprobada en esa área. No improvisamos fuera de nuestro terreno.",
  },
  {
    Icon: BadgeCheck,
    title: "Proceso claro desde el primer contacto.",
    body: "Alcance definido, hitos verificables y sin sorpresas de último momento. Sabes qué esperar en cada etapa.",
  },
  {
    Icon: ShieldCheck,
    title: "Si algo falla, respondemos.",
    body: "No desaparecemos al entregar. Soporte real y acompañamiento en cada proyecto hasta que funcione.",
  },
] as const;

export default function AboutSection() {
  return (
    <div className="text-ink-900">
      {/* ──────────────────────── HERO — light editorial ──────────────────────── */}
      <section
        id="about-hero"
        className="relative overflow-hidden bg-white pt-32 pb-24 sm:pt-40 sm:pb-28"
      >
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <span className="text-brand-500 block font-mono text-xs font-bold tracking-widest uppercase">
              Nosotros
            </span>
            <h1 className="font-display text-ink-900 text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Una red de especialistas, no un equipo de{" "}
              <span className="text-brand-500">generalistas</span>.
            </h1>
            <p className="text-ink-600 max-w-2xl text-lg leading-relaxed">
              OhmRoyal es una red de especialistas técnicos en Quito, Ecuador. Cada área —software,
              electrónica, automatización, mantenimiento industrial y diseño mecánico— tiene al
              profesional indicado. Cuando algo falla, sabemos exactamente a quién llamar.
            </p>
          </div>
        </div>
      </section>

      {/* ──────────────────────── APPROACH ──────────────────────── */}
      <section id="about-approach" className="bg-white py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <ScrollReveal className="space-y-3 lg:col-span-5">
              <span className="text-brand-500 block font-mono text-xs font-bold tracking-widest uppercase">
                Cómo lo entendemos
              </span>
              <h2 className="font-display text-ink-900 text-4xl font-semibold tracking-tight sm:text-5xl">
                El especialista correcto para cada problema.
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.1} className="space-y-5 lg:col-span-7">
              <p className="text-ink-700 text-lg leading-relaxed">
                La mayoría de los proveedores técnicos intentan cubrir todo con un perfil genérico.
                El resultado suele ser el mismo: soluciones a medias y problemas que vuelven a
                aparecer unas semanas después.
              </p>
              <p className="text-ink-700 text-lg leading-relaxed">
                Trabajamos al revés. Reunimos especialistas con trayectoria comprobada en su área y,
                ante cada problema, asignamos a quien de verdad lo domina. Software, electrónica,
                automatización o mantenimiento: el criterio técnico manda, y el acompañamiento llega
                hasta la entrega.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ──────────────────────── MISSION + VISION ──────────────────────── */}
      <section id="about-purpose" className="border-ink-100 bg-ink-50 border-t py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <header className="mb-12 max-w-2xl space-y-3">
              <span className="text-brand-500 block font-mono text-xs font-bold tracking-widest uppercase">
                Propósito
              </span>
              <h2 className="font-display text-ink-900 text-4xl font-semibold tracking-tight sm:text-5xl">
                Lo que nos mueve.
              </h2>
            </header>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <ScrollReveal>
              <div className="border-ink-200 h-full rounded-2xl border bg-white p-8 sm:p-10">
                <span className="bg-brand-50 text-brand-500 mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl">
                  <Target className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <h3 className="font-display text-ink-900 mb-3 text-2xl font-semibold">Misión</h3>
                <p className="text-ink-600 text-base leading-relaxed">
                  Conectar a las empresas con el especialista técnico correcto para cada desafío,
                  con soluciones reales, criterio profesional, proceso claro y acompañamiento hasta
                  la entrega.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="bg-ink-900 flex h-full flex-col rounded-2xl p-8 sm:p-10">
                <span className="bg-brand-500/15 text-brand-400 mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl">
                  <Eye className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <h3 className="font-display mb-3 text-2xl font-semibold text-white">Visión</h3>
                <p className="text-ink-400 text-base leading-relaxed">
                  Ser la red técnica de referencia en la región: el lugar al que las empresas acuden
                  cuando necesitan que algo funcione bien, rápido y con soporte real detrás.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ──────────────────────── WHY US ──────────────────────── */}
      <section id="about-why" className="bg-white py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <header className="mb-12 max-w-2xl space-y-3">
              <span className="text-brand-500 block font-mono text-xs font-bold tracking-widest uppercase">
                Por qué elegirnos
              </span>
              <h2 className="font-display text-ink-900 text-4xl font-semibold tracking-tight sm:text-5xl">
                Tres cosas que nos diferencian.
              </h2>
            </header>
          </ScrollReveal>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {WHY_US.map(({ Icon, title, body }, idx) => (
              <ScrollReveal key={title} delay={idx * 0.07}>
                <div
                  className="group border-ink-200 bg-ink-50 hover:border-ink-300 h-full rounded-2xl border p-7 transition-all duration-300 hover:shadow-md"
                  style={{ transitionTimingFunction: BEZIER }}
                >
                  <span className="bg-brand-50 text-brand-500 group-hover:bg-brand-500 mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors group-hover:text-white">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <h3 className="font-display text-ink-900 mb-2 text-lg font-semibold">{title}</h3>
                  <p className="text-ink-600 text-sm leading-relaxed">{body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────── CERTIFICATIONS ──────────────────────── */}
      <section id="about-certifications" className="border-ink-100 bg-ink-50 border-t py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <ScrollReveal className="space-y-4 lg:col-span-4">
              <span className="text-brand-500 block font-mono text-xs font-bold tracking-widest uppercase">
                Credenciales
              </span>
              <h2 className="font-display text-ink-900 text-4xl font-semibold tracking-tight sm:text-5xl">
                Formación que respalda el criterio.
              </h2>
              <p className="text-ink-600 text-base leading-relaxed">
                No basta con decir que somos especialistas. Estas son algunas de las certificaciones
                y títulos que sostienen el trabajo de cada área, emitidos por instituciones
                reconocidas.
              </p>
            </ScrollReveal>

            <div className="lg:col-span-8">
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {CERTIFICATIONS.map(({ Icon, credential, issuer, discipline }, idx) => (
                  <ScrollReveal key={credential} as="li" delay={idx * 0.07}>
                    <div
                      className="group border-ink-200 hover:border-ink-300 flex h-full flex-col gap-4 rounded-2xl border bg-white p-6 transition-all duration-300 hover:shadow-md"
                      style={{ transitionTimingFunction: BEZIER }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="bg-brand-50 text-brand-500 group-hover:bg-brand-500 inline-flex h-11 w-11 items-center justify-center rounded-xl transition-colors group-hover:text-white">
                          <Icon className="h-5 w-5" strokeWidth={1.5} />
                        </span>
                        <Award
                          className="text-ink-300 h-4 w-4"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-brand-500 block font-mono text-[11px] font-bold tracking-widest uppercase">
                          {discipline}
                        </span>
                        <h3 className="font-display text-ink-900 text-lg leading-snug font-semibold">
                          {credential}
                        </h3>
                      </div>
                      <div className="border-ink-100 text-ink-500 mt-auto border-t pt-3 text-sm">
                        <span className="text-ink-700 font-medium">{issuer}</span>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────── TEAM / AI — dark ──────────────────────── */}
      <section id="about-team" className="bg-ink-900 py-28 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center lg:gap-12">
            {/* TEXT COLUMN */}
            <ScrollReveal className="space-y-8">
              <header className="space-y-3">
                <span className="text-brand-400 block font-mono text-xs font-bold tracking-widest uppercase">
                  Red de especialistas
                </span>
                <h2 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Las personas detrás de cada proyecto.
                </h2>
              </header>
              
              <div className="space-y-4 pt-4 border-t border-ink-800">
                <h3 className="font-display text-2xl font-medium text-white sm:text-3xl leading-snug">
                  Trabaja con desarrolladores que utilizan inteligencia artificial.
                </h3>
                <p className="text-ink-400 text-lg leading-relaxed">
                  Todos los desarrolladores con los que trabajamos utilizan herramientas de codificación de IA modernas para realizar entregas más rápido que nunca, a la vez que producen un código más limpio y consistente.
                </p>
              </div>
            </ScrollReveal>

            {/* ICONS GRID COLUMN */}
            <ScrollReveal delay={0.1} className="mx-auto w-full max-w-lg lg:max-w-none relative">
              {/* Subtle background glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-brand-500/20 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="grid grid-cols-3 gap-4 sm:gap-6 relative z-10">
                {[
                  { name: "Claude", src: "https://cdn.simpleicons.org/anthropic" },
                  { name: "GitHub", src: "https://cdn.simpleicons.org/github/111827" },
                  { name: "Codex (OpenAI)", src: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg" },
                  { name: "Cursor", src: "https://cdn.simpleicons.org/cursor/111827" },
                  { name: "Gemini", src: "https://cdn.simpleicons.org/googlegemini" },
                  { name: "Copilot", src: "https://cdn.simpleicons.org/githubcopilot/111827" },
                  { name: "Ollama", src: "https://cdn.simpleicons.org/ollama/111827" },
                  { name: "Windsurf", src: "https://cdn.simpleicons.org/windsurf/111827" },
                  { name: "Supabase", src: "https://cdn.simpleicons.org/supabase" },
                ].map(({ name, src }, i) => (
                  <div 
                    key={i} 
                    className="flex aspect-square items-center justify-center rounded-2xl sm:rounded-[2rem] bg-white shadow-2xl shadow-black/40 hover:scale-105 transition-transform duration-300"
                    title={name}
                  >
                    <img src={src} alt={name} className="h-8 w-8 sm:h-12 sm:w-12 object-contain" />
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ──────────────────────── CTA — dark card ──────────────────────── */}
      <section id="about-cta" className="bg-ink-50 px-4 pt-28 pb-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal direction="fade">
            <div className="bg-ink-900 relative overflow-hidden rounded-3xl px-6 py-16 text-center sm:px-12 sm:py-24">
              <div
                aria-hidden="true"
                className="bg-brand-500/10 pointer-events-none absolute top-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 blur-[80px]"
              />
              <div className="relative">
                <h2 className="font-display mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                  ¿Tienes un problema técnico que resolver?
                </h2>
                <p className="text-ink-400 mx-auto mt-4 max-w-xl text-base leading-relaxed">
                  Cuéntanos qué necesitas en una primera videollamada. Te decimos con honestidad si
                  es para nosotros y quién lo atendería.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/calcular-proyecto"
                    className="bg-brand-500 shadow-brand-500/30 hover:bg-brand-600 hover:shadow-brand-600/35 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-medium text-white shadow-lg transition-all duration-200 active:scale-[0.97]"
                    style={{ transitionTimingFunction: BEZIER }}
                  >
                    Agendar diagnóstico
                    <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                  </Link>
                  <Link
                    href="/trabajo"
                    className="border-ink-700 bg-ink-800 text-ink-100 hover:border-ink-600 hover:bg-ink-700 inline-flex items-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-medium transition-colors duration-200"
                  >
                    Ver nuestro trabajo
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
