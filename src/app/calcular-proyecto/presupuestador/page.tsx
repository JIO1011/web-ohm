import type { Metadata } from "next";
import { Suspense } from "react";
import ContactSection from "@/features/contact/contact-section";

export const metadata: Metadata = {
  title: "Presupuestador de software",
  description:
    "Wizard de 3 pasos: diseña tu arquitectura, agenda un diagnóstico y envía el pliego de requerimientos a OhmRoyal.",
};

export default function PresupuestadorPage() {
  return (
    <Suspense fallback={<div className="bg-ink-50 min-h-screen" />}>
      <ContactSection />
    </Suspense>
  );
}
