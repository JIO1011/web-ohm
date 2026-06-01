import type { Metadata } from "next";
import WorkSection from "@/features/work/work-section";

export const metadata: Metadata = {
  title: "Nuestro Trabajo",
  description:
    "Casos clínicos de OhmRoyal con telemetría real, métricas verificables y arquitecturas en producción.",
};

export default function TrabajoPage() {
  return <WorkSection />;
}
