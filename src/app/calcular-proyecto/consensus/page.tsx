import type { Metadata } from "next";
import CreateSession from "@/features/consensus/create-session";

export const metadata: Metadata = {
  title: "Consensus · Descubrimiento de necesidades",
  description:
    "Crea una sesión, comparte un código con tu equipo y obtén una matriz priorizada de necesidades automáticamente. Sin registro, sin configuración.",
};

export default function ConsensusPage() {
  return <CreateSession />;
}
