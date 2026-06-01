import type { Metadata } from "next";
import AboutSection from "@/features/about/about-section";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Equipo, misión y certificaciones de OhmRoyal — agencia de software premium en LATAM.",
};

export default function NosotrosPage() {
  return <AboutSection />;
}
