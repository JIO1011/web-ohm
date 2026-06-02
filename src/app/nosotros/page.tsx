import type { Metadata } from "next";
import AboutSection from "@/features/about/about-section";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "OhmRoyal: una red de especialistas técnicos en Quito, Ecuador. Equipo, misión y visión en software, electrónica, automatización y mantenimiento industrial.",
};

export default function NosotrosPage() {
  return <AboutSection />;
}
