import { NextResponse } from "next/server";
import { z } from "zod";
import { addNeed, getSession } from "@/features/consensus/consensus-repo";
import { computeStats } from "@/features/consensus/scoring";
import { CATEGORIES } from "@/features/consensus/types";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const NeedBody = z.object({
  name: z.string().min(1, "Nombre es obligatorio").max(120),
  area: z.string().min(1, "Área es obligatoria").max(120),
  category: z.enum(CATEGORIES),
  description: z.string().min(5, "Descripción muy corta").max(500),
  justification: z.string().min(5, "Justificación muy corta").max(500),
  impact: z.number().int().min(1).max(5),
  urgency: z.number().int().min(1).max(5),
  scope: z.number().int().min(1).max(5),
});

/* ── POST: submit a need ── */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
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

  try {
    const need = await addNeed(code, parsed.data);
    if (!need) {
      return NextResponse.json({ error: "Sesión no encontrada." }, { status: 404 });
    }

    return NextResponse.json({ success: true, need }, { status: 201 });
  } catch (err) {
    console.error("Error adding consensus need:", err);
    return NextResponse.json({ error: "Error de servidor." }, { status: 500 });
  }
}

/* ── GET: fetch session data + stats ── */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  try {
    const session = await getSession(code);
    if (!session) {
      return NextResponse.json({ error: "Sesión no encontrada." }, { status: 404 });
    }

    const sortedNeeds = [...session.needs].sort((a, b) => b.score - a.score);
    const stats = computeStats(session.needs);

    return NextResponse.json({
      session: { code: session.code, name: session.name, createdAt: session.createdAt },
      needs: sortedNeeds,
      stats,
    });
  } catch (err) {
    console.error("Error fetching consensus session:", err);
    return NextResponse.json({ error: "Error de servidor." }, { status: 500 });
  }
}
