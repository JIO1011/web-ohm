import type { Metadata } from "next";
import ServicesSection from "@/features/services/services-section";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Catálogo de OhmRoyal: software, IA, ciberseguridad, electrónica e IoT, automatización, mantenimiento industrial y biomédico, diseño 3D y fabricación mecánica.",
};

export default function ServiciosPage() {
  return <ServicesSection />;
}
