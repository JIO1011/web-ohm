import type { Metadata } from "next";
import ServicesSection from "@/features/services/services-section";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Catálogo de servicios de OhmRoyal: Frontend, Backend, IA, Mobile, UI/UX, QA, Cloud y Ciberseguridad.",
};

export default function ServiciosPage() {
  return <ServicesSection />;
}
