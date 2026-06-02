import fs from 'fs';

const filePath = 'src/features/home/home-section.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Add motion import if not present
if (!content.includes('import { motion } from "motion/react";')) {
  content = content.replace('import Link from "next/link";', 'import Link from "next/link";\nimport { motion } from "motion/react";');
}

const componentStartIdx = content.indexOf('export default function HomeSection() {');

const newComponent = `export default function HomeSection() {
  const [, , featured, secondary] = blogPosts;

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  return (
    <div className="text-ink-900">
      {/* HERO — dark navy */}
      <section
        id="home-hero"
        className="relative overflow-hidden bg-ink-900 pb-24 pt-32 sm:pb-32 sm:pt-40"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle, oklch(0.963 0.013 145) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-brand-500/10 blur-[100px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-ink-700/30 blur-[80px]"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-4xl"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.p variants={fadeUpVariant} className="mb-5 font-mono text-xs tracking-[0.08em] text-brand-400">
              OhmRoyal · Ingeniería de software desde LATAM
            </motion.p>
            <motion.h1 variants={fadeUpVariant} className="mb-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink-0 sm:text-6xl lg:text-7xl">
              Construimos el{" "}
              <span className="text-brand-500">software</span>{" "}
              que tu equipo va a operar después.
            </motion.h1>
            <motion.p variants={fadeUpVariant} className="mb-10 max-w-2xl text-lg leading-relaxed text-ink-400 sm:text-xl">
              Desarrollo web, móvil, IA y ciberseguridad para empresas con equipo técnico
              propio. Hablas con el ingeniero, el código vive en tu repo, recibes todo
              documentado.
            </motion.p>

            <motion.div variants={fadeUpVariant} className="mb-12 flex flex-wrap gap-3">
              <Link
                href="/calcular-proyecto"
                className="group inline-flex items-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_4px_14px_0_rgba(221,4,38,0.25)] transition-all hover:bg-brand-600 hover:shadow-[0_6px_20px_rgba(221,4,38,0.3)] active:scale-95"
              >
                Calcular proyecto
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:translate-x-0.5 group-hover:scale-105">
                  <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
                </div>
              </Link>
              <Link
                href="/trabajo"
                className="inline-flex items-center gap-2 rounded-full border border-ink-700 bg-ink-800/80 px-7 py-3.5 text-sm font-semibold text-ink-100 transition-colors hover:border-ink-600 hover:bg-ink-700 active:scale-95"
              >
                Ver casos de trabajo
              </Link>
            </motion.div>

            <motion.div variants={fadeUpVariant} className="flex flex-wrap gap-2">
              {TRUST_CHIPS.map((chip, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink-700 bg-ink-800/60 px-3.5 py-1.5 text-xs text-ink-300 backdrop-blur-sm"
                >
                  <Check className="h-3 w-3 text-brand-400" strokeWidth={2.5} />
                  {chip}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="relative z-10">
        <InfiniteMarquee />
      </div>

      {/* PROCESS — warm cream (ink-0) */}
      <section
        id="home-process"
        className="bg-ink-0 py-24 sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-1 gap-12 lg:grid-cols-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUpVariant} className="space-y-4 lg:col-span-5">
              <p className="font-mono text-xs tracking-[0.08em] text-brand-600 uppercase">Cómo trabajamos</p>
              <h2 className="font-display text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
                Tres fases. Sin sorpresas.
              </h2>
              <p className="text-lg leading-relaxed text-ink-600">
                Documento de alcance, sprints semanales con demo, y handoff con runbooks al
                cierre. Eso firmamos en cada proyecto.
              </p>
              <Link
                href="/nosotros"
                className="group inline-flex items-center gap-2 pt-4 text-sm font-bold text-brand-600 transition-colors hover:text-brand-700 active:scale-95"
              >
                Conocer el equipo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
              </Link>
            </motion.div>

            <ol className="space-y-6 lg:col-span-7">
              {PHASES.map((phase) => (
                <motion.li
                  variants={fadeUpVariant}
                  key={phase.id}
                  className="group relative flex items-start gap-5 rounded-[2rem] border border-ink-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-ink-200 hover:shadow-md sm:p-8"
                >
                  <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-brand-50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative z-10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-500 font-display text-xl font-bold text-white shadow-lg shadow-brand-500/25">
                    {phase.id}
                  </span>
                  <div className="relative z-10 space-y-2">
                    <h3 className="font-display text-xl font-bold text-ink-900">
                      {phase.title}
                    </h3>
                    <p className="text-base leading-relaxed text-ink-600">{phase.body}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </motion.div>
        </div>
      </section>

      {/* STATS BAND — dark navy with amber numbers */}
      <section
        id="home-stats"
        className="border-y border-ink-800 bg-ink-950"
      >
        <motion.div 
          className="mx-auto max-w-7xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <dl className="grid grid-cols-2 divide-x divide-y divide-ink-800 lg:grid-cols-4 lg:divide-y-0">
            {STATS.map((stat, i) => (
              <motion.div variants={fadeUpVariant} key={i} className="flex flex-col gap-2 px-8 py-12 text-center lg:text-left">
                <dt className="order-2 text-sm font-medium leading-relaxed text-ink-400">{stat.label}</dt>
                <dd className="order-1 font-display text-5xl font-bold tracking-tight text-amber-500">
                  {stat.value}
                </dd>
              </motion.div>
            ))}
          </dl>
        </motion.div>
      </section>

      {/* SERVICES — alabaster */}
      <section
        id="home-services"
        className="bg-ink-50 py-28 sm:py-36"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.header 
            className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUpVariant} className="max-w-xl space-y-4">
              <p className="font-mono text-xs tracking-[0.08em] text-brand-600 uppercase">Servicios</p>
              <h2 className="font-display text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
                Seis frentes. Un equipo.
              </h2>
              <p className="text-lg leading-relaxed text-ink-500">
                No subcontratamos. La persona que diseña la arquitectura es la misma que
                escribe el código.
              </p>
            </motion.div>
            <motion.div variants={fadeUpVariant}>
              <Link
                href="/servicios"
                className="group inline-flex items-center gap-2 self-start text-sm font-bold text-ink-900 transition-colors hover:text-brand-600 md:self-end active:scale-95"
              >
                Ver catálogo completo
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  strokeWidth={2}
                />
              </Link>
            </motion.div>
          </motion.header>

          <motion.ul 
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {SERVICE_HIGHLIGHTS.map(({ Icon, title, body, category }, idx) => (
              <motion.li
                key={idx}
                variants={fadeUpVariant}
                className="group relative rounded-[2rem] border border-ink-200 bg-white p-2 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-ink-900/5"
              >
                <div className="h-full rounded-[calc(2rem-8px)] bg-ink-0 p-6 transition-colors group-hover:bg-white">
                  <span className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white text-ink-700 shadow-sm ring-1 ring-ink-200 transition-colors group-hover:bg-brand-500 group-hover:text-white group-hover:ring-brand-500">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <div className="space-y-2">
                    <h3 className="font-display text-xl font-bold text-ink-900">{title}</h3>
                    <p className="text-sm leading-relaxed text-ink-600">{body}</p>
                  </div>
                  <div className="mt-6">
                    <span className={\`inline-block rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] font-semibold \${
                      category === "Innovación" ? "bg-blue-100 text-blue-700" :
                      category === "Seguridad"  ? "bg-brand-100 text-brand-700" :
                      category === "Infraestructura" ? "bg-amber-100 text-amber-700" :
                      "bg-ink-100 text-ink-700"
                    }\`}>
                      {category}
                    </span>
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ul>

          <div className="mt-10 text-center md:hidden">
            <Link
              href="/servicios"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-700 active:scale-95"
            >
              Ver catálogo completo
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>

      {/* BLOG TEASER — warm cream (ink-0) */}
      {featured && secondary && (
        <section
          id="home-blog"
          className="bg-ink-0 py-28 sm:py-36"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.header 
              className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeUpVariant} className="max-w-xl space-y-4">
                <p className="font-mono text-xs tracking-[0.08em] text-brand-600 uppercase">Del blog</p>
                <h2 className="font-display text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
                  Notas sobre lo que escribimos, rompemos y arreglamos.
                </h2>
              </motion.div>
              <motion.div variants={fadeUpVariant}>
                <Link
                  href="/blog"
                  className="group inline-flex items-center gap-2 self-start text-sm font-bold text-ink-900 transition-colors hover:text-brand-600 md:self-end active:scale-95"
                >
                  Ver todos
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    strokeWidth={2}
                  />
                </Link>
              </motion.div>
            </motion.header>

            <motion.div 
              className="grid grid-cols-1 gap-6 lg:grid-cols-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <Link
                href={\`/blog/\${featured.slug}\`}
                className="group flex flex-col justify-between gap-6 overflow-hidden rounded-[2rem] border border-ink-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-ink-900/5 sm:p-12 lg:col-span-7 active:scale-[0.99]"
              >
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-brand-500 px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-white">
                      {featured.category}
                    </span>
                    <span className="font-mono text-xs text-ink-500">
                      {featured.readTime} · {featured.date}
                    </span>
                  </div>
                  <h3 className="font-display text-3xl font-bold leading-tight tracking-tight text-ink-900 transition-colors group-hover:text-brand-600 sm:text-4xl">
                    {featured.title}
                  </h3>
                  <p className="text-lg leading-relaxed text-ink-600">{featured.excerpt}</p>
                </div>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-brand-600 transition-colors group-hover:text-brand-700">
                  Leer artículo
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-50 transition-colors group-hover:bg-brand-100">
                    <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
                  </div>
                </span>
              </Link>

              <Link
                href={\`/blog/\${secondary.slug}\`}
                className="group flex flex-col justify-between gap-6 overflow-hidden rounded-[2rem] border border-ink-200 bg-ink-50 p-8 transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-ink-900/5 sm:p-10 lg:col-span-5 active:scale-[0.99]"
              >
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-ink-900 px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-ink-0">
                      {secondary.category}
                    </span>
                    <span className="font-mono text-xs text-ink-500">{secondary.readTime}</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold leading-snug text-ink-900 transition-colors group-hover:text-brand-600">
                    {secondary.title}
                  </h3>
                  <p className="text-base leading-relaxed text-ink-600">{secondary.excerpt}</p>
                </div>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-ink-900 transition-colors group-hover:text-brand-600">
                  Leer artículo
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </span>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA — dark navy */}
      <section
        id="home-cta"
        className="bg-ink-0 px-4 pb-28 sm:px-6 lg:px-8"
      >
        <motion.div 
          className="mx-auto max-w-7xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUpVariant} className="relative overflow-hidden rounded-[2.5rem] bg-ink-900 px-6 py-20 text-center shadow-2xl sm:px-16 sm:py-28">
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
              className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 bg-brand-500/15 blur-[100px]"
            />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl font-display text-4xl font-semibold tracking-tight text-ink-0 sm:text-6xl">
                Cuéntanos qué quieres construir.
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-400">
                Una videollamada de 30 minutos para definir alcance, presupuesto y un punto de
                inicio realista. Sin presentación corporativa.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link
                  href="/calcular-proyecto"
                  className="group inline-flex items-center gap-2 rounded-full bg-brand-500 px-8 py-4 text-base font-semibold text-white shadow-[0_4px_14px_0_rgba(221,4,38,0.25)] transition-all hover:bg-brand-600 hover:shadow-[0_6px_20px_rgba(221,4,38,0.3)] active:scale-95"
                >
                  Calcular proyecto
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:translate-x-0.5 group-hover:scale-105">
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </div>
                </Link>
                <Link
                  href="/servicios"
                  className="inline-flex items-center gap-2 rounded-full border border-ink-700 bg-ink-800/80 px-8 py-4 text-base font-semibold text-ink-100 transition-colors hover:border-ink-600 hover:bg-ink-700 active:scale-95"
                >
                  Ver servicios
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
`;

fs.writeFileSync(filePath, content.substring(0, componentStartIdx) + newComponent);
