"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

/* Routes that opt out of the full OhmRoyal chrome (navbar / footer / advisor)
   and render standalone with only a minimal header: logo + "volver".
   The whole /calcular-proyecto subtree (tool cards + wizard) is standalone. */
const STANDALONE_PREFIXES = ["/calcular-proyecto"] as const;

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

  if (isStandalone) {
    // From a sub-route (e.g. the wizard) go up to the cards hub; from the hub, back to the site.
    const backHref = pathname && pathname !== "/calcular-proyecto" ? "/calcular-proyecto" : "/";
    return (
      <>
        {/* Minimal header — deliberately set apart from OhmRoyal styling, themed to
            the standalone calculator (Cobalto + Coral). Only logo + back are kept. */}
        <header className="sticky top-0 z-40 border-b border-[#e7eaf3] bg-[#f6f7fb]/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="font-outfit flex items-center gap-2 text-lg font-bold tracking-tight text-[#0f172a]"
            >
              <Image
                src="/logo.webp"
                alt="OhmRoyal"
                width={28}
                height={28}
                className="h-7 w-7 object-contain"
              />
              <span>
                Ohm<span className="text-[#2f6bff]">Royal</span>
              </span>
            </Link>
            <Link
              href={backHref}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#e7eaf3] bg-white px-3.5 py-2 text-sm font-semibold text-[#334155] transition-colors hover:border-[#2f6bff]/40 hover:text-[#2f6bff]"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2} />
              Volver
            </Link>
          </div>
        </header>
        <main className="min-h-screen bg-[#f6f7fb]">{children}</main>
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
