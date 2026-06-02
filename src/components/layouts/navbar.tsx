"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import Image from "next/image";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/trabajo", label: "Nuestro Trabajo" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/blog", label: "Blog" },
] as const;

/* Hero is light — navbar always uses dark text */

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navBgClass = !isScrolled
    ? "bg-transparent py-5"
    : "border-b border-ink-200/80 bg-white/95 py-4 shadow-sm backdrop-blur-md";

  const linkColor = (active: boolean): string => {
    if (active) return "text-brand-500 font-semibold";
    return "text-ink-600 hover:text-ink-900";
  };

  const logoColor = "text-ink-900";
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      id="ohmroyal-nav"
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${navBgClass}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link
            id="nav-logo"
            href="/"
            className={`flex cursor-pointer items-center gap-2 text-xl font-semibold tracking-tight focus:outline-none ${logoColor}`}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden">
              <Image src="/logo.webp" alt="OhmRoyal" width={32} height={32} className="h-full w-full object-contain" />
            </div>
            <span className="font-display">
              Ohm<span className="font-bold text-brand-500">Royal</span>
            </span>
          </Link>

          <nav id="desktop-nav" className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative rounded-lg px-4 py-2 text-sm transition-colors ${linkColor(active)}`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute bottom-1 left-4 right-4 h-0.5 rounded-full bg-brand-500" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              id="nav-cta-calcular-proyecto"
              href="/calcular-proyecto"
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-brand-500/20 transition-all duration-200 hover:bg-brand-600 hover:shadow-brand-600/25 active:scale-[0.97]"
              style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
            >
              <span>Calcular Proyecto</span>
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
            </Link>
          </div>

          <div className="lg:hidden">
            <button
              type="button"
              id="mobile-nav-toggle"
              aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-ink-900" strokeWidth={1.75} />
              ) : (
                <Menu className="h-6 w-6 text-ink-900" strokeWidth={1.75} />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="animate-fade-in absolute left-0 top-full w-full border-b border-ink-200 bg-ink-0/98 px-4 py-5 shadow-xl backdrop-blur-md lg:hidden"
        >
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={`m-${item.href}`}
                  href={item.href}
                  className={`rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                    active
                      ? "bg-brand-50 text-brand-600"
                      : "text-ink-700 hover:bg-ink-100 hover:text-ink-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="mt-4 border-t border-ink-100 pt-4">
            <Link
              href="/calcular-proyecto"
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-500 py-3.5 text-sm font-medium text-white shadow-md transition-colors hover:bg-brand-600"
            >
              <span>Calcular Proyecto</span>
              <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
