import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSession } from "@/features/consensus/consensus-repo";
import NeedForm from "@/features/consensus/need-form";

interface Props {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const session = await getSession(code);
  return {
    title: session ? `${session.name} — Consensus` : "Sesión no encontrada",
    description: session
      ? `Registra tus necesidades para la sesión "${session.name}".`
      : "La sesión solicitada no existe.",
  };
}

export default async function ConsensusParticipantPage({ params }: Props) {
  const { code } = await params;
  const session = await getSession(code);

  if (!session) {
    notFound();
  }

  return <NeedForm sessionCode={session.code} sessionName={session.name} />;
}
