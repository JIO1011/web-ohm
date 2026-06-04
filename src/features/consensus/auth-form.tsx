"use client";

import { useActionState } from "react";
import Link from "next/link";
import { BrainCircuit, Loader2 } from "lucide-react";
import { signInAction, signUpAction, type AuthState } from "./auth-actions";

const btnPrimary =
  "inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2f6bff] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#2f6bff]/25 transition-all hover:bg-[#2457e6] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";
const inputBase =
  "w-full rounded-2xl border border-[#e7eaf3] bg-white px-4 py-3 text-sm text-[#0f172a] transition-colors placeholder:text-[#94a3b8] focus:border-[#2f6bff] focus:ring-2 focus:ring-[#2f6bff]/20 focus:outline-none";

export default function AuthForm({ mode, next }: { mode: "login" | "signup"; next?: string }) {
  const action = mode === "login" ? signInAction : signUpAction;
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(action, null);

  const isLogin = mode === "login";

  return (
    <div className="min-h-[80vh] bg-[#f6f7fb] text-[#0f172a]">
      <section className="mx-auto flex max-w-md flex-col px-4 pt-16 pb-28 sm:px-6">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf0ff]">
            <BrainCircuit className="h-6 w-6 text-[#2f6bff]" strokeWidth={2} />
          </span>
          <h1 className="font-outfit text-2xl font-bold tracking-tight text-[#0f172a]">
            {isLogin ? "Entrar a Consensus" : "Crear cuenta de admin"}
          </h1>
          <p className="mt-1 text-sm text-[#64748b]">
            {isLogin
              ? "Gestiona tus sesiones de descubrimiento."
              : "Para crear y administrar sesiones."}
          </p>
        </div>

        <form
          action={formAction}
          className="space-y-4 rounded-3xl border border-[#e7eaf3] bg-white p-6 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.25)] sm:p-8"
        >
          {next ? <input type="hidden" name="next" value={next} /> : null}

          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-semibold text-[#334155]">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="tu@empresa.com"
              className={inputBase}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-semibold text-[#334155]">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
              minLength={6}
              placeholder="••••••••"
              className={inputBase}
            />
          </div>

          {state?.error ? (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
              {state.error}
            </p>
          ) : null}

          <button type="submit" disabled={isPending} className={btnPrimary}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                {isLogin ? "Entrando…" : "Creando…"}
              </>
            ) : isLogin ? (
              "Entrar"
            ) : (
              "Crear cuenta"
            )}
          </button>

          <p className="text-center text-xs text-[#64748b]">
            {isLogin ? (
              <>
                ¿No tienes cuenta?{" "}
                <Link
                  href="/consensus/signup"
                  className="font-semibold text-[#2f6bff] hover:underline"
                >
                  Crear una
                </Link>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{" "}
                <Link
                  href="/consensus/login"
                  className="font-semibold text-[#2f6bff] hover:underline"
                >
                  Entrar
                </Link>
              </>
            )}
          </p>
        </form>
      </section>
    </div>
  );
}
