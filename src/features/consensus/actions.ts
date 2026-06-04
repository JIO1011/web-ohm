"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createSession, setSessionStatus, deleteSession } from "@/lib/consensus-repo";
import { isSupabaseConfigured } from "@/lib/env";
import type { SessionStatus } from "./types";

export type ActionResult<T = undefined> =
  | ({ ok: true } & (T extends undefined ? object : { data: T }))
  | { ok: false; error: string };

/** Resolve the authenticated admin's user id, or null. */
async function getOwnerId(): Promise<string | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

const NameSchema = z.string().trim().min(3, "Mínimo 3 caracteres").max(120);

export async function createSessionAction(name: string): Promise<ActionResult<{ code: string }>> {
  if (!isSupabaseConfigured) return { ok: false, error: "Consensus no está configurado." };

  const parsed = NameSchema.safeParse(name);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Nombre inválido." };
  }

  const ownerId = await getOwnerId();
  if (!ownerId) return { ok: false, error: "Debes iniciar sesión." };

  try {
    const session = await createSession(parsed.data, ownerId);
    if (!session) return { ok: false, error: "No se pudo crear la sesión." };
    revalidatePath("/consensus/admin");
    return { ok: true, data: { code: session.code } };
  } catch {
    return { ok: false, error: "Error al crear la sesión." };
  }
}

export async function setSessionStatusAction(
  code: string,
  status: SessionStatus
): Promise<ActionResult> {
  const ownerId = await getOwnerId();
  if (!ownerId) return { ok: false, error: "Debes iniciar sesión." };

  const ok = await setSessionStatus(code, ownerId, status);
  if (!ok) return { ok: false, error: "No se pudo actualizar la sesión." };
  revalidatePath("/consensus/admin");
  return { ok: true };
}

export async function deleteSessionAction(code: string): Promise<ActionResult> {
  const ownerId = await getOwnerId();
  if (!ownerId) return { ok: false, error: "Debes iniciar sesión." };

  const ok = await deleteSession(code, ownerId);
  if (!ok) return { ok: false, error: "No se pudo eliminar la sesión." };
  revalidatePath("/consensus/admin");
  return { ok: true };
}
