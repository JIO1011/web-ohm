"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BrainCircuit, Check, Sparkles, Users } from "lucide-react";
import ConsensusBackdrop from "./consensus-backdrop";

const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2f6bff] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#2f6bff]/25 transition-all hover:bg-[#2457e6] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";
const inputBase =
  "w-full rounded-2xl border border-[#e7eaf3] bg-white px-4 py-3 text-sm text-[#0f172a] transition-colors placeholder:text-[#94a3b8] focus:border-[#2f6bff] focus:ring-2 focus:ring-[#2f6bff]/20 focus:outline-none";

export default function CreateSession() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("");

  const handleJoin = () => {
    const code = joinCode.trim().toUpperCase();
    if (code.length < 4) return;
    router.push(`/consensus/${code}`);
  };

  return (
    <div className="bg-transparent pb-28 text-[#0f172a]">
      <ConsensusBackdrop />
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-10 sm:pt-24 sm:pb-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 right-4 h-72 w-72 rounded-full bg-[#b197fc]/20 blur-[90px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 right-44 h-56 w-56 rounded-full bg-[#66d9e8]/20 blur-[90px]"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eaf0ff] px-3 py-1 text-xs font-semibold text-[#2f6bff]">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
              Consensus · Beta
            </span>
            <h1 className="font-outfit text-4xl font-bold tracking-tight text-[#0f172a] sm:text-5xl lg:text-[3.25rem] lg:leading-[1.05]">
              Descubre las necesidades reales de tu equipo.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-[#64748b]">
              Crea una sesión, comparte el código y obtén una matriz priorizada automáticamente. Los
              participantes se unen sin registro, en minutos.
            </p>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Admin card */}
          <div className="rounded-3xl border border-[#e7eaf3] bg-white p-6 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.25)] sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eaf0ff]">
                <BrainCircuit className="h-5 w-5 text-[#2f6bff]" strokeWidth={2} />
              </span>
              <div>
                <h2 className="font-outfit text-lg font-bold text-[#0f172a]">Soy facilitador</h2>
                <p className="text-xs text-[#94a3b8]">Crea y administra tus sesiones</p>
              </div>
            </div>

            <p className="mt-6 text-sm leading-relaxed text-[#64748b]">
              Entra a tu panel para crear sesiones, compartir el código y ver los resultados en
              tiempo real. Requiere una cuenta gratuita.
            </p>

            <Link href="/consensus/admin" className={`mt-6 w-full ${btnPrimary}`}>
              <BrainCircuit className="h-4 w-4" strokeWidth={2} />
              Ir al panel
            </Link>

            <div className="mt-5 flex flex-wrap gap-3 border-t border-[#eef1f7] pt-4">
              {["Gratis", "Tiempo real", "Exporta a CSV"].map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-[#94a3b8]"
                >
                  <Check className="h-3 w-3 text-[#22c197]" strokeWidth={3} />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Join card */}
          <div className="rounded-3xl border border-[#e7eaf3] bg-white p-6 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.25)] sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f0e6fb]">
                <Users className="h-5 w-5 text-[#7c3aed]" strokeWidth={2} />
              </span>
              <div>
                <h2 className="font-outfit text-lg font-bold text-[#0f172a]">
                  Unirme a una sesión
                </h2>
                <p className="text-xs text-[#94a3b8]">Ingresa el código que te compartieron</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="join-code" className="block text-sm font-semibold text-[#334155]">
                  Código de sesión
                </label>
                <input
                  id="join-code"
                  type="text"
                  placeholder="Ej: AB12CD"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                  className={`${inputBase} text-center font-mono text-lg tracking-[0.2em] uppercase`}
                  maxLength={8}
                />
              </div>

              <button
                type="button"
                onClick={handleJoin}
                disabled={joinCode.trim().length < 4}
                className={`w-full ${btnPrimary} bg-[#7c3aed] shadow-[#7c3aed]/25 hover:bg-[#6d28d9]`}
              >
                Unirme
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>

            <div className="mt-5 space-y-2 border-t border-[#eef1f7] pt-4">
              <p className="text-[11px] font-semibold tracking-wide text-[#94a3b8] uppercase">
                ¿Cómo funciona?
              </p>
              {[
                "Ingresa el código que te dieron",
                "Registra tus necesidades",
                "El equipo ve la matriz priorizada",
              ].map((step, i) => (
                <p key={i} className="flex items-start gap-2 text-xs text-[#64748b]">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#f0e6fb] text-[9px] font-bold text-[#7c3aed]">
                    {i + 1}
                  </span>
                  {step}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
