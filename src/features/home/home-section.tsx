import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  CircuitBoard,
  Code,
  Cog,
  FileText,
  MessagesSquare,
  Shield,
  Users,
  Wrench,
} from "lucide-react";
import InfiniteMarquee from "@/components/ui/infinite-marquee";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { blogPosts } from "@/data/mock-data";

interface ServiceHighlight {
  Icon: typeof Code;
  title: string;
  body: string;
}

/* --- Services: 2 featured + 4 compact --- */
const FEATURED_SERVICES: readonly ServiceHighlight[] = [
  {
    Icon: Code,
    title: "Software a medida",
    body: "Plataformas web y full-stack con React, TypeScript y Node. Pensadas para crecer y mantenerse, no solo para entregar.",
  },
  {
    Icon: BrainCircuit,
    title: "IA aplicada e investigación",
    body: "Agentes, RAG y análisis de datos sobre casos concretos. Experiencia real en biomedicina: histopatología y señales EEG.",
  },
] as const;

const COMPACT_SERVICES: readonly ServiceHighlight[] = [
  {
    Icon: CircuitBoard,
    title: "Electrónica e IoT",
    body: "Sistemas embebidos, microcontroladores y dispositivos conectados.",
  },
  {
    Icon: Cog,
    title: "Automatización y robótica",
    body: "Control, sensado y actuación para procesos industriales.",
  },
  {
    Icon: Wrench,
    title: "Mantenimiento técnico",
    body: "Equipos electromecánicos, industriales y biomédicos.",
  },
  {
    Icon: Shield,
    title: "Ciberseguridad",
    body: "Auditorías OWASP, DevSecOps y endurecimiento práctico.",
  },
] as const;

// PLACEHOLDER: cifras a confirmar — OhmRoyal recién digitaliza el negocio.
// Referencia del sitio original: 8 años, 10 empresas, 80 proyectos.
const STATS = [
  { value: "24/7", label: "Soporte técnico continuo" },
  { value: "+5", label: "Años de experiencia" },
  { value: "+30", label: "Proyectos activos" },
  { value: "+10", label: "Empresas confían en nosotros" },
] as const;

const DIFFERENTIATORS = [
  {
    Icon: Users,
    title: "El especialista indicado",
    body: "Cada problema lo atiende quien tiene trayectoria comprobada en esa área. No improvisamos fuera de nuestro terreno.",
  },
  {
    Icon: FileText,
    title: "Proceso claro y por escrito",
    body: "Alcance definido, hitos verificables y rango de inversión antes de empezar. Sin sorpresas de último momento.",
  },
  {
    Icon: Shield,
    title: "Si algo falla, respondemos",
    body: "No desaparecemos al entregar. Damos soporte real y acompañamiento hasta que la solución funcione de verdad.",
  },
  {
    Icon: MessagesSquare,
    title: "Hablas con quien ejecuta",
    body: "El responsable técnico está en las llamadas contigo. Sin capas de intermediarios entre tú y el trabajo.",
  },
] as const;

const PHASES = [
  {
    id: "01",
    title: "Diagnóstico",
    body: "Una o dos sesiones para entender el problema. Alcance por escrito y rango de inversión antes de firmar.",
  },
  {
    id: "02",
    title: "Ejecución",
    body: "Avances frecuentes y demostrables. Te mostramos resultados reales, no solo reportes de estado.",
  },
  {
    id: "03",
    title: "Entrega",
    body: "Dejamos todo funcionando y documentado, con acompañamiento para que tu equipo continúe.",
  },
] as const;

export default function HomeSection() {
  const [featured, secondary, tertiary] = blogPosts;

  return (
    <div className="text-ink-900">
      {/* ──────────────────────── HERO — light editorial ──────────────────────── */}
      <section
        id="home-hero"
        className="bg-ink-900 relative flex min-h-[calc(100vh-140px)] flex-col justify-center overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-24"
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
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-display mb-6 text-5xl leading-[1.08] font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Ingeniería aplicada, con el{" "}
              <span className="text-brand-500">especialista correcto</span> para cada problema.
            </h1>
            <p className="text-ink-400 mb-10 max-w-2xl text-lg leading-relaxed sm:text-xl">
              Software, IA, electrónica, automatización y mantenimiento industrial. Reunimos
              especialistas con trayectoria y asignamos a quien domina tu caso, con proceso claro y
              resultados verificables.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/calcular-proyecto"
                className="bg-brand-500 shadow-brand-500/30 hover:bg-brand-600 hover:shadow-brand-600/35 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-medium text-white shadow-lg transition-all duration-200 active:scale-[0.97]"
                style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
              >
                Calcular proyecto
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </Link>
              <Link
                href="/servicios"
                className="border-ink-700 bg-ink-800 text-ink-100 hover:border-ink-600 hover:bg-ink-700 inline-flex items-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-medium transition-all duration-200 active:scale-[0.97]"
                style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
              >
                Ver servicios
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────── MARQUEE RIBBON ──────────────────────── */}
      <InfiniteMarquee />

      {/* ──────────────────────── SERVICES — 2 featured + 4 compact ──────────────────────── */}
      <section id="home-services" aria-label="Servicios de ingeniería" className="bg-white py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <header className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl space-y-3">
                <span className="text-brand-500 block font-mono text-xs font-bold tracking-widest uppercase">
                  Servicios de ingeniería
                </span>
                <h2 className="font-display text-ink-900 text-4xl font-semibold tracking-tight sm:text-5xl">
                  Seis frentes técnicos. El especialista correcto en cada uno.
                </h2>
                <p className="text-ink-600 text-base leading-relaxed">
                  Software, electrónica, automatización, mantenimiento e IA. Cada área la atiende
                  quien tiene trayectoria real en ella, no un generalista.
                </p>
              </div>
              <Link
                href="/servicios"
                className="group text-ink-900 hover:text-brand-600 inline-flex items-center gap-2 self-start text-sm font-medium transition-colors md:self-end"
              >
                Ver catálogo completo
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={1.75}
                />
              </Link>
            </header>
          </ScrollReveal>

          {/* 2 featured cards — larger */}
          <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            {FEATURED_SERVICES.map(({ Icon, title, body }, idx) => (
              <ScrollReveal key={title} delay={idx * 0.08}>
                <div
                  className="group border-ink-200 bg-ink-50 hover:border-ink-300 rounded-2xl border p-8 transition-all duration-300 hover:shadow-lg sm:p-10"
                  style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
                >
                  <span className="bg-brand-50 text-brand-500 group-hover:bg-brand-500 mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-colors group-hover:text-white">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <h3 className="font-display text-ink-900 mb-2 text-xl font-semibold">{title}</h3>
                  <p className="text-ink-600 max-w-md text-sm leading-relaxed">{body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* 4 compact cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {COMPACT_SERVICES.map(({ Icon, title, body }, idx) => (
              <ScrollReveal key={title} delay={idx * 0.06}>
                <div
                  className="group border-ink-200 bg-ink-50 hover:border-ink-300 rounded-2xl border p-6 transition-all duration-300 hover:shadow-md"
                  style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
                >
                  <span className="bg-ink-100 text-ink-700 group-hover:bg-ink-900 mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors group-hover:text-white">
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                  <h3 className="font-display text-ink-900 mb-1 text-base font-semibold">
                    {title}
                  </h3>
                  <p className="text-ink-500 text-sm leading-relaxed">{body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────── ABOUT — trust principles + process ──────────────────────── */}
      <section
        id="home-about"
        aria-label="Sobre nosotros"
        className="border-ink-100 bg-ink-50 border-t py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <header className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl space-y-3">
                <span className="text-brand-500 block font-mono text-xs font-bold tracking-widest uppercase">
                  Sobre nosotros
                </span>
                <h2 className="font-display text-ink-900 text-4xl font-semibold tracking-tight sm:text-5xl">
                  Por qué las empresas confían en nosotros.
                </h2>
                <p className="text-ink-600 text-base leading-relaxed">
                  Reunimos especialistas con trayectoria comprobada. Cada problema lo resuelve quien
                  lo domina, con proceso claro y soporte hasta la entrega.
                </p>
              </div>
              <Link
                href="/nosotros"
                className="group text-ink-900 hover:text-brand-600 inline-flex items-center gap-2 self-start text-sm font-medium transition-colors md:self-end"
              >
                Conocer al equipo
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={1.75}
                />
              </Link>
            </header>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            {/* Trust principles — the "why" */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-7">
              {DIFFERENTIATORS.map(({ Icon, title, body }, idx) => (
                <ScrollReveal key={title} delay={idx * 0.07}>
                  <div
                    className="group border-ink-200 hover:border-ink-300 h-full rounded-2xl border bg-white p-6 transition-all duration-300 hover:shadow-md"
                    style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
                  >
                    <span className="bg-brand-50 text-brand-500 group-hover:bg-brand-500 mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors group-hover:text-white">
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                    </span>
                    <h3 className="font-display text-ink-900 mb-2 text-base font-semibold">
                      {title}
                    </h3>
                    <p className="text-ink-500 text-sm leading-relaxed">{body}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Process timeline — the "how" — dark anchor card */}
            <ScrollReveal delay={0.1} className="lg:col-span-5">
              <div className="bg-ink-900 flex h-full flex-col rounded-2xl p-8 sm:p-10">
                <span className="text-brand-400 block font-mono text-xs font-bold tracking-widest uppercase">
                  Cómo trabajamos
                </span>
                <h3 className="font-display mt-3 text-2xl font-semibold tracking-tight text-white">
                  Tres fases. Alcance escrito desde el inicio.
                </h3>
                <ol className="mt-8 space-y-7">
                  {PHASES.map((phase, idx) => (
                    <li key={phase.id} className="relative flex gap-5">
                      <div className="flex flex-col items-center">
                        <span className="bg-brand-500 font-display flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white">
                          {phase.id}
                        </span>
                        {idx < PHASES.length - 1 && (
                          <span className="bg-ink-700 mt-2 w-px flex-1" aria-hidden="true" />
                        )}
                      </div>
                      <div className="space-y-1.5 pb-1">
                        <h4 className="font-display text-base font-semibold text-white">
                          {phase.title}
                        </h4>
                        <p className="text-ink-400 text-sm leading-relaxed">{phase.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ──────────────────────── STATS — premium dark mode ──────────────────────── */}
      <section id="home-stats" aria-label="OhmRoyal en cifras" className="bg-ink-900">
        <div className="mx-auto max-w-7xl">
          <div className="pt-16 text-center">
            <span className="text-brand-500 font-mono text-xs font-bold tracking-widest uppercase">
              OhmRoyal en cifras
            </span>
          </div>
          <dl className="divide-ink-800 border-ink-800 mt-8 grid grid-cols-2 divide-x divide-y border-y lg:grid-cols-4 lg:divide-y-0">
            {STATS.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.06}>
                <div className="hover:bg-ink-800/50 flex flex-col gap-2 px-8 py-12 text-center transition-colors duration-300">
                  <dt className="text-ink-400 order-2 text-sm leading-relaxed">{stat.label}</dt>
                  <dd className="font-display order-1 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                    {stat.value}
                  </dd>
                </div>
              </ScrollReveal>
            ))}
          </dl>
        </div>
      </section>

      {/* ──────────────────────── BLOG TEASER ──────────────────────── */}
      {featured && secondary && tertiary && (
        <section id="home-blog" aria-label="Artículos del blog" className="bg-ink-50 py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <header className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="max-w-xl space-y-3">
                  <span className="text-brand-500 block font-mono text-xs font-bold tracking-widest uppercase">
                    Artículos
                  </span>
                  <h2 className="font-display text-ink-900 text-3xl font-semibold tracking-tight sm:text-4xl">
                    Notas sobre lo que escribimos, rompemos y arreglamos.
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="group text-ink-900 hover:text-brand-600 inline-flex items-center gap-2 self-start text-sm font-medium transition-colors md:self-end"
                >
                  Ver todos
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={1.75}
                  />
                </Link>
              </header>
            </ScrollReveal>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
              {/* Left Column - Large Card */}
              <ScrollReveal className="lg:col-span-7">
                <Link
                  href={`/blog/${featured.slug}`}
                  className="group border-ink-800 bg-ink-900 relative flex h-full min-h-[500px] flex-col justify-end overflow-hidden rounded-3xl border p-8 sm:p-10"
                >
                  <div className="from-ink-900/90 via-ink-900/20 absolute inset-0 bg-gradient-to-t to-transparent transition-opacity duration-300 group-hover:opacity-90" />

                  <div className="relative z-10 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="bg-brand-500 rounded-full px-3 py-1 font-mono text-xs font-bold tracking-wider text-white uppercase shadow-sm">
                        {featured.category}
                      </span>
                      <span className="text-ink-300 font-mono text-xs font-medium">
                        {featured.readTime} · {featured.date}
                      </span>
                    </div>
                    <h3 className="font-display text-3xl leading-snug font-semibold tracking-tight text-white transition-colors sm:text-4xl">
                      {featured.title}
                    </h3>
                    <p className="text-ink-200 line-clamp-2 text-base leading-relaxed">
                      {featured.excerpt}
                    </p>
                    <div className="pt-2">
                      <span className="group-hover:text-brand-300 inline-flex items-center gap-2 text-sm font-medium text-white">
                        Leer artículo completo
                        <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>

              {/* Right Column - Two Smaller Cards */}
              <ScrollReveal delay={0.08} className="flex flex-col gap-5 lg:col-span-5">
                {/* Top Right Card - Light */}
                <Link
                  href={`/blog/${secondary.slug}`}
                  className="group border-ink-200 flex flex-1 flex-col justify-between gap-6 overflow-hidden rounded-3xl border bg-white p-8 sm:p-10"
                >
                  <div className="space-y-4">
                    <span className="text-brand-500 block font-mono text-xs font-bold tracking-widest uppercase">
                      {secondary.category}
                    </span>
                    <h3 className="font-display text-ink-900 text-2xl leading-snug font-semibold tracking-tight transition-colors">
                      {secondary.title}
                    </h3>
                  </div>
                  <span className="text-brand-600 group-hover:text-brand-700 inline-flex items-center gap-2 text-sm font-medium">
                    Leer artículo
                    <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                </Link>

                {/* Bottom Right Card - Dark */}
                <Link
                  href={`/blog/${tertiary.slug}`}
                  className="group border-ink-800 bg-ink-900 flex flex-1 flex-col justify-between gap-6 overflow-hidden rounded-3xl border p-8 sm:p-10"
                >
                  <div className="space-y-4">
                    <span className="text-brand-500 block font-mono text-xs font-bold tracking-widest uppercase">
                      {tertiary.category}
                    </span>
                    <h3 className="font-display text-2xl leading-snug font-semibold tracking-tight text-white transition-colors">
                      {tertiary.title}
                    </h3>
                  </div>
                  <span className="group-hover:text-brand-300 inline-flex items-center gap-2 text-sm font-medium text-white">
                    Leer artículo
                    <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </section>
      )}

      {/* ──────────────────────── CTA — contained dark card ──────────────────────── */}
      <section id="home-cta" aria-label="Contacto" className="bg-ink-50 px-4 pb-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal direction="fade">
            <div className="bg-ink-900 relative overflow-hidden rounded-3xl px-6 py-16 text-center sm:px-12 sm:py-24">
              <div className="relative">
                <h2 className="font-display mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                  Cuéntanos qué problema quieres resolver.
                </h2>
                <p className="text-ink-400 mx-auto mt-4 max-w-xl text-base leading-relaxed">
                  Una videollamada de 30 minutos para definir alcance, presupuesto y un punto de
                  inicio realista. Sin presentación corporativa.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/calcular-proyecto"
                    className="bg-brand-500 shadow-brand-500/30 hover:bg-brand-600 hover:shadow-brand-600/35 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-medium text-white shadow-lg transition-all duration-200 active:scale-[0.97]"
                    style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
                  >
                    Calcular proyecto
                    <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                  </Link>
                  <Link
                    href="/servicios"
                    className="border-ink-700 bg-ink-800 text-ink-100 hover:border-ink-600 hover:bg-ink-700 inline-flex items-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-medium transition-colors duration-200"
                  >
                    Ver servicios
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
