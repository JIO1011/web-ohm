import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AuthForm from "@/features/consensus/auth-form";

export const metadata: Metadata = {
  title: "Crear cuenta — Consensus",
  description: "Crea una cuenta de admin para gestionar sesiones de Consensus.",
};

export default async function ConsensusSignupPage() {
  const supabase = await createClient();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect("/consensus/admin");
  }

  return <AuthForm mode="signup" />;
}
