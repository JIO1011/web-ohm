import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { listSessions } from "@/lib/consensus-repo";
import { isSupabaseConfigured } from "@/lib/env";
import AdminDashboard from "@/features/consensus/admin-dashboard";

export const metadata: Metadata = {
  title: "Mis sesiones — Consensus",
  description: "Crea y administra tus sesiones de descubrimiento de necesidades.",
};

export const dynamic = "force-dynamic";

export default async function ConsensusAdminPage() {
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f6f7fb] px-4 text-center">
        <p className="max-w-md text-sm text-[#64748b]">
          Consensus aún no está configurado. Define las variables de entorno de Supabase para
          habilitar las cuentas de administrador.
        </p>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = (await supabase?.auth.getUser()) ?? { data: { user: null } };

  if (!user) redirect("/consensus/login?next=/consensus/admin");

  const sessions = await listSessions(user.id);

  return <AdminDashboard email={user.email ?? ""} initialSessions={sessions} />;
}
