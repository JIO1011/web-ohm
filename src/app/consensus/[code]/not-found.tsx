import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function ConsensusSessionNotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-sm rounded-3xl border border-[#e7eaf3] bg-white p-8 text-center shadow-[0_18px_50px_-24px_rgba(15,23,42,0.25)]">
        <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1ec]">
          <SearchX className="h-6 w-6 text-[#ff7a59]" strokeWidth={2} />
        </span>
        <h1 className="font-outfit text-xl font-bold text-[#0f172a]">Sesión no encontrada</h1>
        <p className="mt-2 text-sm leading-relaxed text-[#64748b]">
          El código no corresponde a ninguna sesión activa. Verifica el código con tu facilitador e
          intenta de nuevo.
        </p>
        <Link
          href="/calcular-proyecto/consensus"
          className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-[#e7eaf3] bg-white px-5 py-2.5 text-sm font-semibold text-[#334155] transition-colors hover:bg-[#f6f8fd]"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          Volver a Consensus
        </Link>
      </div>
    </div>
  );
}
