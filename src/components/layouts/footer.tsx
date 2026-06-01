import Link from "next/link";
import { ArrowUpRight, Cpu } from "lucide-react";

const servicesLinks = [
  { label: "Frontend moderno", href: "/servicios" },
  { label: "Backend y APIs", href: "/servicios" },
  { label: "Integración de IA", href: "/servicios" },
  { label: "Aplicaciones móviles", href: "/servicios" },
  { label: "Cloud y DevOps", href: "/servicios" },
  { label: "Ciberseguridad", href: "/servicios" },
] as const;

const agencyLinks = [
  { label: "Nosotros", href: "/nosotros" },
  { label: "Casos de trabajo", href: "/trabajo" },
  { label: "Blog", href: "/blog" },
  { label: "Calcular proyecto", href: "/calcular-proyecto" },
] as const;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="ohmroyal-footer" className="bg-ink-950 pb-10 pt-20 text-ink-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-4">
            <div className="flex items-center gap-2.5 text-lg font-semibold text-ink-0">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 shadow-md shadow-brand-500/30">
                <Cpu className="h-4 w-4 text-white" strokeWidth={1.75} />
              </span>
              <span className="font-display">
                Ohm<span className="font-bold text-brand-400">Royal</span>
              </span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-ink-400">
              Ingeniería de software desde LATAM para empresas con equipo técnico propio.
              Construimos lo que tu equipo va a operar después.
            </p>
          </div>

          <div className="lg:col-span-3">
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.08em] text-ink-300">
              Servicios
            </h3>
            <ul className="space-y-2.5">
              {servicesLinks.map((link, idx) => (
                <li key={`svc-${idx}`}>
                  <Link href={link.href} className="text-sm text-ink-400 transition-colors hover:text-ink-0">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.08em] text-ink-300">
              Compañía
            </h3>
            <ul className="space-y-2.5">
              {agencyLinks.map((link, idx) => (
                <li key={`co-${idx}`}>
                  <Link href={link.href} className="text-sm text-ink-400 transition-colors hover:text-ink-0">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5 lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-300">
              Contacto
            </h3>
            <p className="text-sm leading-relaxed text-ink-400">
              Primera videollamada de 30 minutos. Sin presión.
            </p>
            <Link
              href="/calcular-proyecto"
              className="group inline-flex w-full items-center justify-between gap-3 rounded-xl border border-ink-800 bg-ink-900 px-4 py-3 text-sm font-medium text-ink-100 transition-all hover:border-brand-500/50 hover:bg-ink-800"
            >
              <span>Hablar con el equipo</span>
              <ArrowUpRight className="h-4 w-4 text-ink-500 transition-colors group-hover:text-brand-400" strokeWidth={1.75} />
            </Link>
          </div>
        </div>

        <div
          id="footer-bottom"
          className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-ink-800 pt-8 text-sm text-ink-500 md:flex-row"
        >
          <p>© {currentYear} OhmRoyal. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <span className="cursor-default transition-colors hover:text-ink-300">Términos</span>
            <span className="cursor-default transition-colors hover:text-ink-300">Privacidad</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
