import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  Cloud,
  Code,
  Database,
  FileText,
  GitBranch,
  Shield,
  Smartphone,
  Users,
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
    title: "Frontend moderno",
    body: "Next.js, TypeScript y Tailwind. LCP bajo 1.5 s, accesibilidad AA, linting y CI incluidos.",
  },
  {
    Icon: BrainCircuit,
    title: "Integración de IA",
    body: "Agentes y RAG sobre Gemini o GPT. Empezamos con un caso concreto, no con un proyecto de investigación.",
  },
] as const;

const COMPACT_SERVICES: readonly ServiceHighlight[] = [
  {
    Icon: Database,
    title: "Backend y APIs",
    body: "Node, Python o Go. Documentación OpenAPI desde el día uno.",
  },
  {
    Icon: Smartphone,
    title: "Aplicaciones móviles",
    body: "React Native o Flutter. Publicación en stores incluida.",
  },
  {
    Icon: Cloud,
    title: "Cloud y DevOps",
    body: "Terraform en AWS o GCP. Despliegues sin downtime.",
  },
  {
    Icon: Shield,
    title: "Ciberseguridad",
    body: "Auditorías OWASP y análisis estático en CI.",
  },
] as const;

const STATS = [
  { value: "24/7", label: "Soporte técnico continuo" },
  { value: "+5", label: "Años de experiencia" },
  { value: "+30", label: "Proyectos activos" },
  { value: "+10", label: "Empresas confían en nosotros" },
] as const;

const DIFFERENTIATORS = [
  {
    Icon: GitBranch,
    title: "Código bajo tu control",
    body: "El repositorio, la infraestructura y los secretos quedan a tu nombre desde el primer commit. No hay dependencia técnica de nosotros para operar.",
  },
  {
    Icon: FileText,
    title: "Decisiones documentadas",
    body: "Cada decisión de arquitectura incluye el contexto, lo que descartamos y por qué. Tu equipo puede entender el sistema sin necesitar a quien lo construyó.",
  },
  {
    Icon: Users,
    title: "Transferencia real",
    body: "El proyecto no termina cuando sube el código. Hacemos hand-off en vivo: runbooks, accesos, pipelines y una sesión de preguntas con tu equipo.",
  },
  {
    Icon: Code,
    title: "Demos antes que reportes",
    body: "Cada semana mostramos algo que funciona. Preferimos que veas el avance en el browser antes que leer un estado en un documento.",
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
    title: "Construcción",
    body: "Sprints semanales con demo. Trabajamos en tu repositorio de GitHub desde el primer commit.",
  },
  {
    id: "03",
    title: "Entrega",
    body: "Infraestructura, secretos y runbooks transferidos. Sesión de hand-off para que tu equipo continúe.",
  },
] as const;

export default function HomeSection() {
  const [featured, secondary, tertiary] = blogPosts;

  return (
    <div className="text-ink-900">
      {/* ──────────────────────── HERO — light editorial ──────────────────────── */}
      <section
        id="home-hero"
        className="relative flex min-h-[calc(100vh-140px)] flex-col justify-center overflow-hidden bg-white pb-20 pt-32 sm:pb-24 sm:pt-40"
      >
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="mb-6 font-display text-5xl font-semibold leading-[1.08] tracking-tight text-ink-900 sm:text-6xl lg:text-7xl">
              Construimos el{" "}
              <span className="text-brand-500">software</span>{" "}
              que tu equipo va a operar después.
            </h1>
            <p className="mb-10 max-w-2xl text-lg leading-relaxed text-ink-600 sm:text-xl">
              Desarrollo web, móvil, IA y ciberseguridad para empresas que necesitan
              sistemas mantenibles. Trabajas directo con quien escribe el código,
              sin capas de intermediarios.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/calcular-proyecto"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 text-sm font-medium text-white shadow-lg shadow-brand-500/20 transition-all duration-200 hover:bg-brand-600 hover:shadow-brand-600/25 active:scale-[0.97]"
                style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
              >
                Calcular proyecto
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </Link>
              <Link
                href="/servicios"
                className="inline-flex items-center gap-2 rounded-xl border border-ink-200 px-6 py-3.5 text-sm font-medium text-ink-900 transition-all duration-200 hover:border-ink-300 hover:bg-ink-50 active:scale-[0.97]"
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
      <section
        id="home-services"
        aria-label="Servicios de ingeniería"
        className="bg-white py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <header className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl space-y-3">
                <span className="block font-mono text-xs font-bold uppercase tracking-widest text-brand-500">
                  Servicios de ingeniería
                </span>
                <h2 className="font-display text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
                  Seis frentes. Un equipo.
                </h2>
                <p className="text-base leading-relaxed text-ink-600">
                  No subcontratamos. La persona que diseña la arquitectura es la misma que
                  escribe el código.
                </p>
              </div>
              <Link
                href="/servicios"
                className="group inline-flex items-center gap-2 self-start text-sm font-medium text-ink-900 transition-colors hover:text-brand-600 md:self-end"
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
              <ScrollReveal key={idx} delay={idx * 0.08}>
                <div className="group rounded-2xl border border-ink-200 bg-ink-50 p-8 transition-all duration-300 hover:border-ink-300 hover:shadow-lg sm:p-10"
                  style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
                >
                  <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-500 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <h3 className="mb-2 font-display text-xl font-semibold text-ink-900">
                    {title}
                  </h3>
                  <p className="max-w-md text-sm leading-relaxed text-ink-600">{body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* 4 compact cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {COMPACT_SERVICES.map(({ Icon, title, body }, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.06}>
                <div className="group rounded-2xl border border-ink-200 bg-ink-50 p-6 transition-all duration-300 hover:border-ink-300 hover:shadow-md"
                  style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
                >
                  <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-ink-100 text-ink-700 transition-colors group-hover:bg-ink-900 group-hover:text-white">
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                  <h3 className="mb-1 font-display text-base font-semibold text-ink-900">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-ink-500">{body}</p>
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
        className="border-t border-ink-100 bg-ink-50 py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <header className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl space-y-3">
                <span className="block font-mono text-xs font-bold uppercase tracking-widest text-brand-500">
                  Sobre nosotros
                </span>
                <h2 className="font-display text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
                  Construimos para que no dependas de nosotros.
                </h2>
                <p className="text-base leading-relaxed text-ink-600">
                  El código, la infraestructura y el conocimiento quedan en tu equipo.
                  Así es como trabajamos y por eso puedes confiarnos el proyecto completo.
                </p>
              </div>
              <Link
                href="/nosotros"
                className="group inline-flex items-center gap-2 self-start text-sm font-medium text-ink-900 transition-colors hover:text-brand-600 md:self-end"
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
                <ScrollReveal key={idx} delay={idx * 0.07}>
                  <div className="group h-full rounded-2xl border border-ink-200 bg-white p-6 transition-all duration-300 hover:border-ink-300 hover:shadow-md"
                    style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
                  >
                    <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-500 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                    </span>
                    <h3 className="mb-2 font-display text-base font-semibold text-ink-900">
                      {title}
                    </h3>
                    <p className="text-sm leading-relaxed text-ink-500">{body}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Process timeline — the "how" — dark anchor card */}
            <ScrollReveal delay={0.1} className="lg:col-span-5">
              <div className="flex h-full flex-col rounded-2xl bg-ink-900 p-8 sm:p-10">
                <span className="block font-mono text-xs font-bold uppercase tracking-widest text-brand-400">
                  Cómo trabajamos
                </span>
                <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-white">
                  Tres fases. Alcance escrito desde el inicio.
                </h3>
                <ol className="mt-8 space-y-7">
                  {PHASES.map((phase, idx) => (
                    <li key={phase.id} className="relative flex gap-5">
                      <div className="flex flex-col items-center">
                        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-500 font-display text-sm font-bold text-white">
                          {phase.id}
                        </span>
                        {idx < PHASES.length - 1 && (
                          <span className="mt-2 w-px flex-1 bg-ink-700" aria-hidden="true" />
                        )}
                      </div>
                      <div className="space-y-1.5 pb-1">
                        <h4 className="font-display text-base font-semibold text-white">
                          {phase.title}
                        </h4>
                        <p className="text-sm leading-relaxed text-ink-400">{phase.body}</p>
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
      <section
        id="home-stats"
        aria-label="OhmRoyal en cifras"
        className="bg-ink-900"
      >
        <div className="mx-auto max-w-7xl">
          <div className="pt-16 text-center">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-500">
              OhmRoyal en cifras
            </span>
          </div>
          <dl className="mt-8 grid grid-cols-2 divide-x divide-y divide-ink-800 border-y border-ink-800 lg:grid-cols-4 lg:divide-y-0">
            {STATS.map((stat, i) => (
              <ScrollReveal key={i} delay={i * 0.06}>
                <div className="flex flex-col gap-2 px-8 py-12 text-center transition-colors duration-300 hover:bg-ink-800/50">
                  <dt className="order-2 text-sm leading-relaxed text-ink-400">{stat.label}</dt>
                  <dd className="order-1 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
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
        <section
          id="home-blog"
          aria-label="Artículos del blog"
          className="bg-ink-50 py-28"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <header className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="max-w-xl space-y-3">
                  <span className="block font-mono text-xs font-bold uppercase tracking-widest text-brand-500">
                    Artículos
                  </span>
                  <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
                    Notas sobre lo que escribimos, rompemos y arreglamos.
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="group inline-flex items-center gap-2 self-start text-sm font-medium text-ink-900 transition-colors hover:text-brand-600 md:self-end"
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
                  className="group relative flex h-full min-h-[500px] flex-col justify-end overflow-hidden rounded-3xl border border-ink-800 bg-ink-900 p-8 sm:p-10"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
                  
                  <div className="relative z-10 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-brand-500 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                        {featured.category}
                      </span>
                      <span className="font-mono text-xs font-medium text-ink-300">
                        {featured.readTime} · {featured.date}
                      </span>
                    </div>
                    <h3 className="font-display text-3xl font-semibold leading-snug tracking-tight text-white transition-colors sm:text-4xl">
                      {featured.title}
                    </h3>
                    <p className="line-clamp-2 text-base leading-relaxed text-ink-200">
                      {featured.excerpt}
                    </p>
                    <div className="pt-2">
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-white group-hover:text-brand-300">
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
                  className="group flex flex-1 flex-col justify-between gap-6 overflow-hidden rounded-3xl border border-ink-200 bg-white p-8 sm:p-10"
                >
                  <div className="space-y-4">
                    <span className="block font-mono text-xs font-bold uppercase tracking-widest text-brand-500">
                      {secondary.category}
                    </span>
                    <h3 className="font-display text-2xl font-semibold leading-snug tracking-tight text-ink-900 transition-colors">
                      {secondary.title}
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 group-hover:text-brand-700">
                    Leer artículo
                    <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                </Link>

                {/* Bottom Right Card - Dark */}
                <Link
                  href={`/blog/${tertiary.slug}`}
                  className="group flex flex-1 flex-col justify-between gap-6 overflow-hidden rounded-3xl border border-ink-800 bg-ink-900 p-8 sm:p-10"
                >
                  <div className="space-y-4">
                    <span className="block font-mono text-xs font-bold uppercase tracking-widest text-brand-500">
                      {tertiary.category}
                    </span>
                    <h3 className="font-display text-2xl font-semibold leading-snug tracking-tight text-white transition-colors">
                      {tertiary.title}
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-white group-hover:text-brand-300">
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
      <section
        id="home-cta"
        aria-label="Contacto"
        className="bg-ink-50 px-4 pb-28 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <ScrollReveal direction="fade">
            <div className="relative overflow-hidden rounded-3xl bg-ink-900 px-6 py-16 text-center sm:px-12 sm:py-24">
              <div className="relative">
                <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                  Cuéntanos qué problema quieres resolver.
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-400">
                  Una videollamada de 30 minutos para definir alcance, presupuesto y un punto de
                  inicio realista. Sin presentación corporativa.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/calcular-proyecto"
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 text-sm font-medium text-white shadow-lg shadow-brand-500/30 transition-all duration-200 hover:bg-brand-600 hover:shadow-brand-600/35 active:scale-[0.97]"
                    style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
                  >
                    Calcular proyecto
                    <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                  </Link>
                  <Link
                    href="/servicios"
                    className="inline-flex items-center gap-2 rounded-xl border border-ink-700 bg-ink-800 px-6 py-3.5 text-sm font-medium text-ink-100 transition-colors duration-200 hover:border-ink-600 hover:bg-ink-700"
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
