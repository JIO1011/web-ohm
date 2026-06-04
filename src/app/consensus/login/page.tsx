import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AuthForm from "@/features/consensus/auth-form";

export const metadata: Metadata = {
  title: "Entrar — Consensus",
  description: "Inicia sesión para gestionar tus sesiones de Consensus.",
};

export default async function ConsensusLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  const supabase = await createClient();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect(next ?? "/consensus/admin");
  }

  return <AuthForm mode="login" next={next} />;
}
