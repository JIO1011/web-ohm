import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getGeminiClient,
  ADVISOR_SYSTEM_INSTRUCTION,
  ADVISOR_MODEL,
  FALLBACK_ADVISOR_REPLY,
} from "@/lib/gemini-client";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const Message = z.object({
  sender: z.enum(["user", "advisor"]),
  text: z.string().min(1).max(4000),
});

const Body = z.object({
  messages: z.array(Message).min(1).max(40),
});

export async function POST(req: Request) {
  const ip = getClientIp(req.headers);
  const limit = rateLimit(`advisor:${ip}`, { limit: 12, windowMs: 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      {
        error:
          "Has alcanzado el límite temporal de consultas. Reintenta en unos segundos.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(limit.resetInMs / 1000)) },
      }
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Cuerpo inválido." },
      { status: 400 }
    );
  }

  const ai = getGeminiClient();

  if (!ai) {
    return NextResponse.json({
      text: FALLBACK_ADVISOR_REPLY,
      timestamp: new Date().toISOString(),
    });
  }

  const messages = parsed.data.messages;
  const latest = messages[messages.length - 1];
  if (!latest) {
    return NextResponse.json({ error: "Sin mensaje del usuario." }, { status: 400 });
  }

  const historyContext = messages
    .slice(0, -1)
    .map((m) => `${m.sender === "user" ? "Client" : "Crysta (OhmRoyal AI)"}: ${m.text}`)
    .join("\n");

  const prompt = `${
    historyContext ? `Historial de conversación previa:\n${historyContext}\n\n` : ""
  }Mensaje actual de cliente para evaluar:\n"${latest.text}"\n\nPor favor, responde de forma estructurada como Crysta.`;

  try {
    const response = await ai.models.generateContent({
      model: ADVISOR_MODEL,
      contents: prompt,
      config: {
        systemInstruction: ADVISOR_SYSTEM_INSTRUCTION,
        temperature: 0.8,
      },
    });

    return NextResponse.json({
      text:
        response.text ||
        "Disculpa, obtuve una respuesta vacía del modelo. ¿Podrías reformular tu consulta técnica?",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Gemini Advisor API Error:", err);
    return NextResponse.json(
      { error: "Disculpa, ocurrió un error temporal al invocar al Advisor Inteligente." },
      { status: 500 }
    );
  }
}
