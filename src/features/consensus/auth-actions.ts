"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

const Credentials = z.object({
  email: z.string().email("Email inválido."),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
});

export type AuthState = { error: string } | null;

function safeNext(next: FormDataEntryValue | null): string {
  const value = typeof next === "string" ? next : "";
  // Only allow internal paths to avoid open-redirect.
  return value.startsWith("/") && !value.startsWith("//") ? value : "/consensus/admin";
}

export async function signInAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (!isSupabaseConfigured) return { error: "Autenticación no configurada." };

  const parsed = Credentials.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  const supabase = await createClient();
  if (!supabase) return { error: "Autenticación no configurada." };

  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: "Credenciales incorrectas." };

  redirect(safeNext(formData.get("next")));
}

export async function signUpAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (!isSupabaseConfigured) return { error: "Autenticación no configurada." };

  const parsed = Credentials.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  const supabase = await createClient();
  if (!supabase) return { error: "Autenticación no configurada." };

  const { data, error } = await supabase.auth.signUp(parsed.data);
  if (error) return { error: error.message };

  // When email confirmation is ON, there is no active session yet.
  if (!data.session) {
    return { error: "Revisa tu correo para confirmar la cuenta antes de entrar." };
  }

  redirect("/consensus/admin");
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/consensus/login");
}
