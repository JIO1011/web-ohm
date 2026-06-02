import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import AdvisorChat from "@/components/ui/advisor-chat";
import { env } from "@/lib/env";

const APP_NAME = "OhmRoyal";
const APP_DESC =
  "Ingeniería de software para empresas con equipo técnico propio. Desarrollo web, móvil, IA y ciberseguridad desde LATAM.";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    default: `${APP_NAME} | Ingeniería de Software desde LATAM`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESC,
  applicationName: APP_NAME,
  keywords: [
    "ingeniería de software",
    "desarrollo web Next.js",
    "inteligencia artificial",
    "ciberseguridad",
    "cloud DevOps",
    "LATAM",
    "OhmRoyal",
  ],
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: APP_NAME,
    title: `${APP_NAME} | Ingeniería de Software desde LATAM`,
    description: APP_DESC,
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} | Ingeniería de Software`,
    description: APP_DESC,
  },
  icons: {
    icon: "/logo.webp",
    apple: "/logo.webp",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#F02D3A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=Space+Grotesk:wght@400;500;700;900&family=JetBrains+Mono:wght@400;700&display=swap"
        />
      </head>
      <body className="relative min-h-screen bg-ink-0 font-sans text-ink-900 selection:bg-brand-100 selection:text-brand-900">
        <Navbar />
        <main id="main-content-flow" className="min-h-screen">
          {children}
        </main>
        <Footer />
        <AdvisorChat />
      </body>
    </html>
  );
}
