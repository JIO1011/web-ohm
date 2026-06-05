"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

/* The /calcular-proyecto and /consensus subtrees render standalone: no OhmRoyal
   navbar / footer / advisor, only a minimal floating header (logo + back). */
const STANDALONE_PREFIXES = ["/calcular-proyecto", "/consensus"] as const;

export default function SiteShell({
  navbar,
  footer,
  advisor,
  children,
}: {
  navbar: ReactNode;
  footer: ReactNode;
  advisor: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isStandalone = STANDALONE_PREFIXES.some((prefix) => pathname?.startsWith(prefix));

  // Whether a Supabase auth session exists (i.e. the viewer is a facilitator).
  // Checked only on /consensus routes, lazy-loaded so the marketing bundle never
  // pulls in Supabase. Lets the results "Volver" return owners to their panel.
  const [hasAuthSession, setHasAuthSession] = useState(false);
  useEffect(() => {
    if (!pathname?.startsWith("/consensus")) return;
    let active = true;
    void import("@/lib/supabase/client").then(({ createClient }) => {
      const supabase = createClient();
      if (!supabase) return;
      void supabase.auth.getSession().then(({ data }) => {
        if (active) setHasAuthSession(Boolean(data.session));
      });
    });
    return () => {
      active = false;
    };
  }, [pathname]);

  if (isStandalone) {
    // Back-navigation rules:
    //  /calcular-proyecto subpages      → /calcular-proyecto (tools hub)
    //  /consensus/[code]/resultados     → /consensus/admin (owner) or landing
    //  any other /consensus/* page      → /calcular-proyecto/consensus (landing)
    //  /calcular-proyecto (hub itself)  → / (home)
    const backHref = (() => {
      if (!pathname) return "/";
      if (pathname.startsWith("/calcular-proyecto")) {
        return pathname === "/calcular-proyecto" ? "/" : "/calcular-proyecto";
      }
      if (/^\/consensus\/[^/]+\/resultados$/.test(pathname)) {
        return hasAuthSession ? "/consensus/admin" : "/calcular-proyecto/consensus";
      }
      if (pathname.startsWith("/consensus")) {
        return "/calcular-proyecto/consensus";
      }
      return "/";
    })();
    return (
      <>
        <header className="absolute top-0 left-0 z-30 w-full">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="font-outfit flex items-center gap-2 text-lg font-bold tracking-tight text-[#1b2348]"
            >
              <Image
                src="/logo.webp"
                alt="OhmRoyal"
                width={30}
                height={30}
                className="h-7 w-7 object-contain"
              />
              <span>
                Ohm<span className="text-[#ff6b4a]">Royal</span>
              </span>
            </Link>
            <Link
              href={backHref}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-[#334155] shadow-sm backdrop-blur transition-colors hover:bg-white"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2} />
              Volver
            </Link>
          </div>
        </header>
        <main className="relative min-h-screen">{children}</main>
      </>
    );
  }

  return (
    <>
      {navbar}
      <main id="main-content-flow" className="min-h-screen">
        {children}
      </main>
      {footer}
      {advisor}
    </>
  );
}
