import type { ReactNode } from "react";
import ConsensusBackdrop from "@/features/consensus/consensus-backdrop";

/** Wraps every /consensus/* page with the shared animated backdrop. */
export default function ConsensusLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ConsensusBackdrop />
      {/* Clear the floating standalone header (logo + Volver) so page titles
         aren't hidden under it — content reads as a section below the bar. */}
      <div className="pt-20">{children}</div>
    </>
  );
}
