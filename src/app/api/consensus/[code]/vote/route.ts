import { NextResponse } from "next/server";
import { z } from "zod";
import { castVote } from "@/lib/consensus-repo";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { isSupabaseConfigured } from "@/lib/env";
import { broadcastSessionChanged } from "@/lib/supabase/broadcast";

export const runtime = "nodejs";

const VoteBody = z.object({
  targetKind: z.enum(["need", "group"]),
  targetId: z.string().uuid(),
  voterKey: z.string().min(8).max(64),
  // 1 = importante, -1 = poco relevante, 0 = quitar voto.
  value: z.union([z.literal(1), z.literal(-1), z.literal(0)]),
});

export async function POST(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  const ip = getClientIp(req.headers);
  const limit = rateLimit(`consensus-vote:${ip}`, { limit: 60, windowMs: 60_000 });
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

  const parsed = VoteBody.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Campos inválidos.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Consensus no está disponible." }, { status: 503 });
  }

  const { targetKind, targetId, voterKey, value } = parsed.data;
  const ok = await castVote(code, targetKind, targetId, voterKey, value);
  if (!ok) {
    return NextResponse.json({ error: "No se pudo registrar el voto." }, { status: 404 });
  }

  await broadcastSessionChanged(code);
  return NextResponse.json({ success: true }, { status: 200 });
}
