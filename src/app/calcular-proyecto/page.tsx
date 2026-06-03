import type { Metadata } from "next";
import CalculatorLanding from "@/features/calculator/calculator-landing";

export const metadata: Metadata = {
  title: "Calcular Proyecto",
  description:
    "Calcula el alcance, la inversión y el tiempo de tu proyecto de software con OhmRoyal, en menos de tres minutos.",
};

export default function CalcularProyectoPage() {
  return <CalculatorLanding />;
}
