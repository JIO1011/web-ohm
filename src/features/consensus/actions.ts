"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  createSession,
  setSessionStatus,
  setSessionSchedule,
  deleteSession,
  updateSessionCategories,
  createGroup,
  renameGroup,
  deleteGroup,
  assignNeedsToGroup,
} from "@/lib/consensus-repo";
import { broadcastSessionChanged } from "@/lib/supabase/broadcast";
import { rateLimit } from "@/lib/rate-limit";
import { isSupabaseConfigured } from "@/lib/env";
import type { ConsensusGroup, SessionStatus } from "./types";

export type ActionResult<T = undefined> =
  | ({ ok: true } & (T extends undefined ? object : { data: T }))
  | { ok: false; error: string };

const RATE_LIMITED = "Demasiadas solicitudes. Intenta de nuevo en un minuto.";

/**
 * Per-user, per-scope rate limit for authenticated server actions (the API
 * routes are limited per-IP; these run server-side with no request object, so
 * we key on the owner id). Returns true when the caller is over budget.
 */
function overLimit(ownerId: string, scope: string, limit: number): boolean {
  return !rateLimit(`consensus-action:${scope}:${ownerId}`, { limit, windowMs: 60_000 }).ok;
}

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
  if (overLimit(ownerId, "create", 15)) return { ok: false, error: RATE_LIMITED };

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
  if (overLimit(ownerId, "mutate", 40)) return { ok: false, error: RATE_LIMITED };

  const ok = await setSessionStatus(code, ownerId, status);
  if (!ok) return { ok: false, error: "No se pudo actualizar la sesión." };
  revalidatePath("/consensus/admin");
  return { ok: true };
}

/** Set or clear the auto-close deadline. `closesAt` is an ISO string or null. */
export async function setScheduleAction(
  code: string,
  closesAt: string | null
): Promise<ActionResult> {
  const ownerId = await getOwnerId();
  if (!ownerId) return { ok: false, error: "Debes iniciar sesión." };
  if (overLimit(ownerId, "mutate", 40)) return { ok: false, error: RATE_LIMITED };

  let normalized: string | null = null;
  if (closesAt !== null) {
    const d = new Date(closesAt);
    if (Number.isNaN(d.getTime())) return { ok: false, error: "Fecha inválida." };
    normalized = d.toISOString();
  }

  const ok = await setSessionSchedule(code, ownerId, normalized);
  if (!ok) return { ok: false, error: "No se pudo programar el cierre." };
  revalidatePath("/consensus/admin");
  return { ok: true };
}

export async function deleteSessionAction(code: string): Promise<ActionResult> {
  const ownerId = await getOwnerId();
  if (!ownerId) return { ok: false, error: "Debes iniciar sesión." };
  if (overLimit(ownerId, "mutate", 40)) return { ok: false, error: RATE_LIMITED };

  const ok = await deleteSession(code, ownerId);
  if (!ok) return { ok: false, error: "No se pudo eliminar la sesión." };
  revalidatePath("/consensus/admin");
  return { ok: true };
}

const CategorySchema = z
  .array(z.string().trim().min(1).max(40))
  .min(1, "Debe haber al menos una categoría.")
  .max(20, "Máximo 20 categorías.");

export async function updateCategoriesAction(
  code: string,
  categories: string[]
): Promise<ActionResult> {
  const ownerId = await getOwnerId();
  if (!ownerId) return { ok: false, error: "Debes iniciar sesión." };
  if (overLimit(ownerId, "mutate", 40)) return { ok: false, error: RATE_LIMITED };

  const parsed = CategorySchema.safeParse(categories);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Categorías inválidas." };
  }

  const ok = await updateSessionCategories(code, ownerId, parsed.data);
  if (!ok) return { ok: false, error: "No se pudieron guardar las categorías." };
  revalidatePath("/consensus/admin");
  return { ok: true };
}

/* ── Consolidation (manual grouping) ── */

const GroupNameSchema = z.string().trim().min(2, "Mínimo 2 caracteres").max(80);
const NeedIdsSchema = z.array(z.string().uuid()).max(500);

/** Create a group from the selected needs and notify live viewers. */
export async function createGroupAction(
  code: string,
  name: string,
  needIds: string[]
): Promise<ActionResult<{ group: ConsensusGroup }>> {
  const ownerId = await getOwnerId();
  if (!ownerId) return { ok: false, error: "Debes iniciar sesión." };
  if (overLimit(ownerId, "group", 60)) return { ok: false, error: RATE_LIMITED };

  const parsedName = GroupNameSchema.safeParse(name);
  if (!parsedName.success) {
    return { ok: false, error: parsedName.error.issues[0]?.message ?? "Nombre inválido." };
  }
  const parsedIds = NeedIdsSchema.safeParse(needIds);
  if (!parsedIds.success) return { ok: false, error: "Selección inválida." };

  const group = await createGroup(code, ownerId, parsedName.data, parsedIds.data);
  if (!group) return { ok: false, error: "No se pudo crear el grupo." };

  await broadcastSessionChanged(code);
  revalidatePath(`/consensus/${code}/resultados`);
  return { ok: true, data: { group } };
}

/** Rename a group. */
export async function renameGroupAction(
  code: string,
  groupId: string,
  name: string
): Promise<ActionResult> {
  const ownerId = await getOwnerId();
  if (!ownerId) return { ok: false, error: "Debes iniciar sesión." };
  if (overLimit(ownerId, "group", 60)) return { ok: false, error: RATE_LIMITED };

  const parsedName = GroupNameSchema.safeParse(name);
  if (!parsedName.success) {
    return { ok: false, error: parsedName.error.issues[0]?.message ?? "Nombre inválido." };
  }

  const ok = await renameGroup(code, ownerId, groupId, parsedName.data);
  if (!ok) return { ok: false, error: "No se pudo renombrar el grupo." };

  await broadcastSessionChanged(code);
  revalidatePath(`/consensus/${code}/resultados`);
  return { ok: true };
}

/** Delete a group (its needs become individual again). */
export async function deleteGroupAction(code: string, groupId: string): Promise<ActionResult> {
  const ownerId = await getOwnerId();
  if (!ownerId) return { ok: false, error: "Debes iniciar sesión." };
  if (overLimit(ownerId, "group", 60)) return { ok: false, error: RATE_LIMITED };

  const ok = await deleteGroup(code, ownerId, groupId);
  if (!ok) return { ok: false, error: "No se pudo deshacer el grupo." };

  await broadcastSessionChanged(code);
  revalidatePath(`/consensus/${code}/resultados`);
  return { ok: true };
}

/** Assign needs to a group, or ungroup them with `groupId = null`. */
export async function assignNeedsAction(
  code: string,
  groupId: string | null,
  needIds: string[]
): Promise<ActionResult> {
  const ownerId = await getOwnerId();
  if (!ownerId) return { ok: false, error: "Debes iniciar sesión." };
  if (overLimit(ownerId, "group", 60)) return { ok: false, error: RATE_LIMITED };

  const parsedIds = NeedIdsSchema.safeParse(needIds);
  if (!parsedIds.success) return { ok: false, error: "Selección inválida." };
  if (groupId !== null && !z.string().uuid().safeParse(groupId).success) {
    return { ok: false, error: "Grupo inválido." };
  }

  const ok = await assignNeedsToGroup(code, ownerId, groupId, parsedIds.data);
  if (!ok) return { ok: false, error: "No se pudo actualizar la selección." };

  await broadcastSessionChanged(code);
  revalidatePath(`/consensus/${code}/resultados`);
  return { ok: true };
}
