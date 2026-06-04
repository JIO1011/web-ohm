import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

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
    <footer id="ohmroyal-footer" className="bg-ink-950 text-ink-400 pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-4">
            <div className="text-ink-0 flex items-center gap-2.5 text-lg font-semibold">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden">
                <Image
                  src="/logo.webp"
                  alt="OhmRoyal"
                  width={32}
                  height={32}
                  className="h-full w-full object-contain"
                />
              </span>
              <span className="font-display">
                Ohm<span className="text-brand-400 font-bold">Royal</span>
              </span>
            </div>
            <p className="text-ink-400 max-w-sm text-sm leading-relaxed">
              Ingeniería de software desde LATAM para empresas con equipo técnico propio.
              Construimos lo que tu equipo va a operar después.
            </p>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-ink-300 mb-5 text-xs font-semibold tracking-[0.08em] uppercase">
              Servicios
            </h3>
            <ul className="space-y-2.5">
              {servicesLinks.map((link, idx) => (
                <li key={`svc-${idx}`}>
                  <Link
                    href={link.href}
                    className="text-ink-400 hover:text-ink-0 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-ink-300 mb-5 text-xs font-semibold tracking-[0.08em] uppercase">
              Compañía
            </h3>
            <ul className="space-y-2.5">
              {agencyLinks.map((link, idx) => (
                <li key={`co-${idx}`}>
                  <Link
                    href={link.href}
                    className="text-ink-400 hover:text-ink-0 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5 lg:col-span-3">
            <h3 className="text-ink-300 text-xs font-semibold tracking-[0.08em] uppercase">
              Contacto
            </h3>
            <p className="text-ink-400 text-sm leading-relaxed">
              Primera videollamada de 30 minutos. Sin presión.
            </p>
            <Link
              href="/calcular-proyecto"
              className="group border-ink-800 bg-ink-900 text-ink-100 hover:border-brand-500/50 hover:bg-ink-800 inline-flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-all"
            >
              <span>Hablar con el equipo</span>
              <ArrowUpRight
                className="text-ink-500 group-hover:text-brand-400 h-4 w-4 transition-colors"
                strokeWidth={1.75}
              />
            </Link>
          </div>
        </div>

        <div
          id="footer-bottom"
          className="border-ink-800 text-ink-500 mt-16 flex flex-col items-center justify-between gap-4 border-t pt-8 text-sm md:flex-row"
        >
          <p>© {currentYear} OhmRoyal. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-ink-300 cursor-default transition-colors">Términos</span>
            <span className="hover:text-ink-300 cursor-default transition-colors">Privacidad</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
