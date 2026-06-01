import { NextResponse } from "next/server";
import { z } from "zod";
import { createLead } from "@/lib/leads-repo";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const customAnswersSchema = z
  .record(z.union([z.string(), z.number()]))
  .default({});

const ContactBody = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  company: z.string().max(160).optional().default("N/A"),
  serviceType: z.string().max(160).optional().default("General Software Spec"),
  projectBudget: z.string().max(160).optional().default("No declarado"),
  projectBrief: z.string().min(10).max(4000),
  // Honeypot — any value means bot. We validate length manually after Zod
  // so we can drop silently (HTTP 200) rather than echo a 400 back to bots.
  hpField: z.string().optional().default(""),
  customAnswers: customAnswersSchema,
});

export async function POST(req: Request) {
  const ip = getClientIp(req.headers);
  const limit = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      {
        error:
          "Has enviado demasiadas solicitudes recientes. Vuelve a intentarlo en unos minutos.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(limit.resetInMs / 1000)) },
      }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const parsed = ContactBody.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Faltan campos obligatorios o tienen formato inválido.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  // Honeypot: if the field has anything, drop silently with 200 to not give bots feedback.
  if (parsed.data.hpField && parsed.data.hpField.length > 0) {
    return NextResponse.json({ success: true, leadId: null });
  }

  try {
    const lead = await createLead({
      name: parsed.data.name,
      email: parsed.data.email,
      company: parsed.data.company,
      serviceType: parsed.data.serviceType,
      projectBudget: parsed.data.projectBudget,
      projectBrief: parsed.data.projectBrief,
      customAnswers: {
        ...parsed.data.customAnswers,
        submittedAt: new Date().toISOString(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Propuesta de proyecto recibida con éxito y registrada en OhmRoyal Leads.",
        leadId: lead.id,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating contact lead:", err);
    return NextResponse.json(
      { error: "Error de servidor al guardar la propuesta." },
      { status: 500 }
    );
  }
}
