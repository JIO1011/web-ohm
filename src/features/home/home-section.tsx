import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  Cloud,
  Code,
  Database,
  Shield,
  Smartphone,
} from "lucide-react";
import InfiniteMarquee from "@/components/ui/infinite-marquee";
import { blogPosts } from "@/data/mock-data";

interface ServiceHighlight {
  Icon: typeof Code;
  title: string;
  body: string;
  category: string;
}

const SERVICE_HIGHLIGHTS: readonly ServiceHighlight[] = [
  {
    Icon: Code,
    title: "Frontend moderno",
    body: "Next.js, TypeScript y Tailwind. LCP bajo 1.5 s, accesibilidad AA, linting y CI incluidos.",
    category: "Desarrollo",
  },
  {
    Icon: Database,
    title: "Backend y APIs",
    body: "Node, Python o Go. Observabilidad, validación de entrada y documentación OpenAPI desde el día uno.",
    category: "Desarrollo",
  },
  {
    Icon: BrainCircuit,
    title: "Integración de IA",
    body: "Agentes y RAG sobre Gemini o GPT. Empezamos con un caso concreto, no con un proyecto de investigación.",
    category: "Innovación",
  },
  {
    Icon: Smartphone,
    title: "Aplicaciones móviles",
    body: "iOS y Android con React Native o Flutter. Publicación en stores y crash reporting incluidos.",
    category: "Desarrollo",
  },
  {
    Icon: Cloud,
    title: "Cloud y DevOps",
    body: "Terraform en AWS o GCP. Despliegues sin downtime y costos visibles desde el primer mes.",
    category: "Infraestructura",
  },
  {
    Icon: Shield,
    title: "Ciberseguridad",
    body: "Auditorías OWASP, análisis estático en CI y plan de remediación con severidad CVSS.",
    category: "Seguridad",
  },
] as const;

const STATS = [
  { value: "48h", label: "Respuesta inicial máxima" },
  { value: "3", label: "Fases documentadas por proyecto" },
  { value: "8", label: "Servicios de ingeniería" },
  { value: "100%", label: "Código en tu repositorio" },
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

const TRUST_CHIPS = [
  "Código en tu repositorio desde el día 1",
  "Sprints semanales con demo",
  "Documentación al cierre",
] as const;

export default function HomeSection() {
  const [, , featured, secondary] = blogPosts;

  return (
    <div className="text-ink-900">
      {/* HERO — dark navy */}
      <section
        id="home-hero"
        className="relative overflow-hidden bg-ink-900 pb-24 pt-32 sm:pb-32 sm:pt-40"
      >
        {/* Dot-grid pattern */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle, oklch(0.963 0.013 145) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        {/* Brand glow top-right */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-brand-500/10 blur-[100px]"
        />
        {/* Ink glow bottom-left */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-ink-700/30 blur-[80px]"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="mb-5 font-mono text-xs tracking-[0.08em] text-brand-400">
              OhmRoyal · Ingeniería de software desde LATAM
            </p>
            <h1 className="mb-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink-0 sm:text-6xl lg:text-7xl">
              Construimos el{" "}
              <span className="text-brand-500">software</span>{" "}
              que tu equipo va a operar después.
            </h1>
            <p className="mb-10 max-w-2xl text-lg leading-relaxed text-ink-400 sm:text-xl">
              Desarrollo web, móvil, IA y ciberseguridad para empresas con equipo técnico
              propio. Hablas con el ingeniero, el código vive en tu repo, recibes todo
              documentado.
            </p>

            <div className="mb-12 flex flex-wrap gap-3">
              <Link
                href="/calcular-proyecto"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 text-sm font-medium text-white shadow-lg shadow-brand-500/25 transition-all hover:bg-brand-600 hover:shadow-brand-600/30 active:scale-95"
              >
                Calcular proyecto
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </Link>
              <Link
                href="/trabajo"
                className="inline-flex items-center gap-2 rounded-xl border border-ink-700 bg-ink-800 px-6 py-3.5 text-sm font-medium text-ink-100 transition-colors hover:border-ink-600 hover:bg-ink-700"
              >
                Ver casos de trabajo
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              {TRUST_CHIPS.map((chip, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink-700 bg-ink-800/60 px-3.5 py-1.5 text-xs text-ink-300 backdrop-blur-sm"
                >
                  <Check className="h-3 w-3 text-brand-400" strokeWidth={2.5} />
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="relative z-10">
        <InfiniteMarquee />
      </div>

      {/* STATS BAND — dark navy with amber numbers */}
      <section
        id="home-stats"
        className="border-y border-ink-800 bg-ink-950"
      >
        <div className="mx-auto max-w-7xl">
          <dl className="grid grid-cols-2 divide-x divide-y divide-ink-800 lg:grid-cols-4 lg:divide-y-0">
            {STATS.map((stat, i) => (
              <div key={i} className="flex flex-col gap-1.5 px-8 py-10">
                <dt className="order-2 text-sm leading-relaxed text-ink-400">{stat.label}</dt>
                <dd className="order-1 font-display text-4xl font-bold text-amber-500">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* SERVICES — mint canvas */}
      <section
        id="home-services"
        className="bg-ink-0 py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <header className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl space-y-3">
              <p className="font-mono text-xs tracking-[0.08em] text-brand-600">Servicios</p>
              <h2 className="font-display text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
                Seis frentes. Un equipo.
              </h2>
              <p className="text-base leading-relaxed text-ink-500">
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

          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICE_HIGHLIGHTS.map(({ Icon, title, body, category }, idx) => (
              <li
                key={idx}
                className="group overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-lg"
              >
                <div className="h-1 bg-ink-900 transition-colors group-hover:bg-brand-500" />
                <div className="space-y-4 p-6">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-ink-50 text-ink-700 transition-colors group-hover:bg-ink-900 group-hover:text-ink-0">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <div className="space-y-1.5">
                    <h3 className="font-display text-lg font-semibold text-ink-900">{title}</h3>
                    <p className="text-sm leading-relaxed text-ink-600">{body}</p>
                  </div>
                  <span className={`inline-block rounded-full px-2.5 py-1 font-mono text-[10px] tracking-[0.08em] ${
                    category === "Innovación" ? "bg-blue-100 text-blue-700" :
                    category === "Seguridad"  ? "bg-brand-100 text-brand-700" :
                    category === "Infraestructura" ? "bg-amber-100 text-amber-700" :
                    "bg-ink-100 text-ink-600"
                  }`}>
                    {category}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 text-center md:hidden">
            <Link
              href="/servicios"
              className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              Ver catálogo completo
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </Link>
          </div>
        </div>
      </section>

      {/* PROCESS — white section */}
      <section
        id="home-process"
        className="border-y border-ink-100 bg-white py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-5">
              <p className="font-mono text-xs tracking-[0.08em] text-brand-600">Cómo trabajamos</p>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl lg:text-5xl">
                Tres fases. Sin sorpresas en la factura.
              </h2>
              <p className="text-base leading-relaxed text-ink-600">
                Documento de alcance, sprints semanales con demo, y handoff con runbooks al
                cierre. Eso firmamos en cada proyecto.
              </p>
              <Link
                href="/nosotros"
                className="inline-flex items-center gap-2 pt-2 text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                Conocer el equipo
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </Link>
            </div>

            <ol className="space-y-4 lg:col-span-7">
              {PHASES.map((phase) => (
                <li
                  key={phase.id}
                  className="flex items-start gap-5 rounded-2xl border border-ink-200 bg-ink-0 p-6 transition-colors hover:border-ink-300 sm:gap-6"
                >
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-500 font-display text-lg font-bold text-white shadow-md shadow-brand-500/25">
                    {phase.id}
                  </span>
                  <div className="space-y-1.5">
                    <h3 className="font-display text-lg font-semibold text-ink-900">
                      {phase.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-ink-600">{phase.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* BLOG TEASER — mint canvas */}
      {featured && secondary && (
        <section
          id="home-blog"
          className="bg-ink-0 py-24"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <header className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl space-y-3">
                <p className="font-mono text-xs tracking-[0.08em] text-brand-600">Del blog</p>
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

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
              <Link
                href={`/blog/${featured.slug}`}
                className="group flex flex-col justify-between gap-6 overflow-hidden rounded-3xl border border-ink-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-lg sm:p-10 lg:col-span-7"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-brand-500 px-3 py-1 font-mono text-xs font-medium text-white">
                      {featured.category}
                    </span>
                    <span className="font-mono text-xs text-ink-500">
                      {featured.readTime} · {featured.date}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-semibold leading-snug tracking-tight text-ink-900 transition-colors group-hover:text-brand-700 sm:text-3xl">
                    {featured.title}
                  </h3>
                  <p className="text-base leading-relaxed text-ink-600">{featured.excerpt}</p>
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 group-hover:text-brand-700">
                  Leer artículo
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </span>
              </Link>

              <Link
                href={`/blog/${secondary.slug}`}
                className="group flex flex-col justify-between gap-6 overflow-hidden rounded-3xl border border-ink-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-lg sm:p-8 lg:col-span-5"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-ink-900 px-3 py-1 font-mono text-xs font-medium text-ink-0">
                      {secondary.category}
                    </span>
                    <span className="font-mono text-xs text-ink-500">{secondary.readTime}</span>
                  </div>
                  <h3 className="font-display text-xl font-semibold leading-snug text-ink-900 transition-colors group-hover:text-brand-700">
                    {secondary.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-ink-600">{secondary.excerpt}</p>
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 group-hover:text-brand-700">
                  Leer artículo
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA — dark navy */}
      <section
        id="home-cta"
        className="bg-ink-0 px-4 pb-28 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl bg-ink-900 px-6 py-16 text-center sm:px-12 sm:py-24">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, oklch(0.963 0.013 145) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 bg-brand-500/10 blur-[80px]"
            />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink-0 sm:text-5xl">
                Cuéntanos qué quieres construir.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-400">
                Una videollamada de 30 minutos para definir alcance, presupuesto y un punto de
                inicio realista. Sin presentación corporativa.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/calcular-proyecto"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 text-sm font-medium text-white shadow-lg shadow-brand-500/30 transition-all hover:bg-brand-600 hover:shadow-brand-600/35 active:scale-95"
                >
                  Calcular proyecto
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </Link>
                <Link
                  href="/servicios"
                  className="inline-flex items-center gap-2 rounded-xl border border-ink-700 bg-ink-800 px-6 py-3.5 text-sm font-medium text-ink-100 transition-colors hover:border-ink-600 hover:bg-ink-700"
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
