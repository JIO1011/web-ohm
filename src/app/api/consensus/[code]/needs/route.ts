import { NextResponse } from "next/server";
import { z } from "zod";
import { addNeed, getSession } from "@/lib/consensus-repo";
import { computeStats, sortByScore } from "@/features/consensus/scoring";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { isSupabaseConfigured } from "@/lib/env";
import { broadcastSessionChanged } from "@/lib/supabase/broadcast";

export const runtime = "nodejs";

const NeedBody = z.object({
  name: z.string().min(1, "Nombre es obligatorio").max(120),
  area: z.string().min(1, "Área es obligatoria").max(120),
  category: z.string().min(1).max(40),
  description: z.string().min(5, "Descripción muy corta").max(500),
  // Optional: lowers participant friction (see UX phase 1).
  justification: z.string().max(500).optional().default(""),
  impact: z.number().int().min(1).max(5),
  urgency: z.number().int().min(1).max(5),
  scope: z.number().int().min(1).max(5),
  // Honeypot: real users never fill this. If present, we fake success (200).
  hpField: z.string().optional(),
});

/* ── POST: submit a need ── */
export async function POST(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  const ip = getClientIp(req.headers);
  const limit = rateLimit(`consensus-need:${ip}`, { limit: 30, windowMs: 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intenta en un minuto." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(limit.resetInMs / 1000)) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const parsed = NeedBody.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Campos inválidos.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // Honeypot tripped → pretend success, give bots no signal (CLAUDE.md contract).
  if (parsed.data.hpField && parsed.data.hpField.length > 0) {
    return NextResponse.json({ success: true, need: null }, { status: 200 });
  }

  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Consensus no está disponible." }, { status: 503 });
  }

  try {
    const need = await addNeed(code, parsed.data);
    if (!need) {
      return NextResponse.json({ error: "Sesión no encontrada." }, { status: 404 });
    }

    // Notify live results viewers (best-effort).
    await broadcastSessionChanged(code);

    return NextResponse.json({ success: true, need }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "SESSION_CLOSED") {
      return NextResponse.json(
        { error: "Esta sesión está cerrada y ya no acepta necesidades." },
        { status: 409 }
      );
    }
    console.error("Error adding consensus need:", err);
    return NextResponse.json({ error: "Error de servidor." }, { status: 500 });
  }
}

/* ── GET: fetch session data + stats ── */
export async function GET(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  const ip = getClientIp(req.headers);
  const limit = rateLimit(`consensus-results:${ip}`, { limit: 120, windowMs: 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intenta en un minuto." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(limit.resetInMs / 1000)) } }
    );
  }

  try {
    const session = await getSession(code);
    if (!session) {
      return NextResponse.json({ error: "Sesión no encontrada." }, { status: 404 });
    }

    const sortedNeeds = sortByScore(session.needs);
    const stats = computeStats(session.needs);

    return NextResponse.json({
      session: {
        code: session.code,
        name: session.name,
        status: session.status,
        categories: session.categories,
        groups: session.groups,
        closesAt: session.closesAt,
        createdAt: session.createdAt,
      },
      needs: sortedNeeds,
      stats,
      votes: session.votes,
    });
  } catch (err) {
    console.error("Error fetching consensus session:", err);
    return NextResponse.json({ error: "Error de servidor." }, { status: 500 });
  }
}
