import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/consensus-repo";
import { computeStats, sortByScore } from "@/features/consensus/scoring";
import type { DashboardResponse } from "@/features/consensus/types";
import ResultsDashboard from "@/features/consensus/results-dashboard";

interface Props {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const session = await getSession(code);
  return {
    title: session ? `Resultados — ${session.name}` : "Sesión no encontrada",
    description: session
      ? `Matriz priorizada de necesidades para "${session.name}".`
      : "La sesión solicitada no existe.",
  };
}

export const dynamic = "force-dynamic"; // always fetch fresh data on page load

export default async function ConsensusResultsPage({ params }: Props) {
  const { code } = await params;
  const session = await getSession(code);

  if (!session) {
    notFound();
  }

  const sortedNeeds = sortByScore(session.needs);
  const stats = computeStats(session.needs);

  const initialData: DashboardResponse = {
    session: { code: session.code, name: session.name, createdAt: session.createdAt },
    needs: sortedNeeds,
    stats,
  };

  return (
    <ResultsDashboard
      sessionCode={session.code}
      sessionName={session.name}
      initialData={initialData}
    />
  );
}
