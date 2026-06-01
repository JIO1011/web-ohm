import { NextResponse } from "next/server";
import { listLeads } from "@/lib/leads-repo";
import { env } from "@/lib/env";

export const runtime = "nodejs";

/**
 * Protected endpoint. Send: `Authorization: Bearer $LEADS_ADMIN_TOKEN`.
 * If LEADS_ADMIN_TOKEN is not configured, returns 503 — never falls back to
 * an unauthenticated mode.
 */
export async function GET(req: Request) {
  if (!env.LEADS_ADMIN_TOKEN) {
    return NextResponse.json(
      { error: "Endpoint deshabilitado: configure LEADS_ADMIN_TOKEN." },
      { status: 503 }
    );
  }

  const auth = req.headers.get("authorization") ?? "";
  const match = auth.match(/^Bearer (.+)$/i);
  const token = match?.[1];

  if (!token || token !== env.LEADS_ADMIN_TOKEN) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const leads = await listLeads();
    return NextResponse.json(leads);
  } catch (err) {
    console.error("Error reading leads:", err);
    return NextResponse.json({ error: "Error de servidor." }, { status: 500 });
  }
}
