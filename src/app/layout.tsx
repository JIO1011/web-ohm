import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import AdvisorChat from "@/components/ui/advisor-chat";
import SiteShell from "@/components/layouts/site-shell";
import { env } from "@/lib/env";

/* Self-hosted via next/font: no render-blocking request, no CLS, automatic
   size-adjusted fallbacks. All four are variable fonts → every weight covered. */
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});
const outfit = Outfit({ subsets: ["latin"], display: "swap", variable: "--font-outfit" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

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
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${spaceGrotesk.variable} ${outfit.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-ink-0 text-ink-900 selection:bg-brand-100 selection:text-brand-900 relative min-h-screen font-sans">
        <SiteShell navbar={<Navbar />} footer={<Footer />} advisor={<AdvisorChat />}>
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
