import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession } from "@/lib/consensus-repo";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const Body = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(120),
});

export async function POST(req: Request) {
  const ip = getClientIp(req.headers);
  const limit = rateLimit(`consensus-session:${ip}`, { limit: 10, windowMs: 60_000 });
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

  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Nombre de sesión inválido.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const session = await createSession(parsed.data.name);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    return NextResponse.json(
      {
        code: session.code,
        name: session.name,
        shareUrl: `${baseUrl}/consensus/${session.code}`,
        resultsUrl: `${baseUrl}/consensus/${session.code}/resultados`,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating consensus session:", err);
    return NextResponse.json({ error: "Error de servidor." }, { status: 500 });
  }
}
