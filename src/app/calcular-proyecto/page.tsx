import type { Metadata } from "next";
import { Suspense } from "react";
import ContactSection from "@/features/contact/contact-section";

export const metadata: Metadata = {
  title: "Calcular Proyecto",
  description:
    "Wizard de 3 pasos: diseña tu arquitectura, agenda un diagnóstico y envía el pliego de requerimientos a OhmRoyal.",
};

export default function CalcularProyectoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <ContactSection />
    </Suspense>
  );
}
