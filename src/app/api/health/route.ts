import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json({
    status: "ok",
    time: new Date().toISOString(),
    aiEnabled: Boolean(env.GEMINI_API_KEY),
  });
}
