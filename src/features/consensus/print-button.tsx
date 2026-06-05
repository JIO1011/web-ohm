"use client";

import { Printer } from "lucide-react";

/** Triggers the browser's print dialog (→ "Save as PDF"). Hidden when printing. */
export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2f6bff] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#2f6bff]/25 transition-all hover:bg-[#2457e6] active:scale-[0.98]"
    >
      <Printer className="h-4 w-4" strokeWidth={2} />
      Imprimir / Guardar PDF
    </button>
  );
}
