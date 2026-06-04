import { Cog, Settings } from "lucide-react";

/**
 * Ambient decorative backdrop for Consensus — pure white canvas, three
 * rainbow-colored spinning gears, and two flowing dashed paths with a
 * rainbow gradient stroke. No blobs or mesh gradients.
 *
 * Fixed + pointer-events-none so it sits behind scrolling content.
 * Reuses `.calc-anim` (disabled under prefers-reduced-motion).
 */
export default function ConsensusBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-white"
    >
      {/* Gears — each gets its own rainbow hue, medium opacity */}
      <Settings
        className="calc-anim absolute -top-10 right-[7%] h-44 w-44"
        strokeWidth={1}
        style={{
          color: "#ffa94d",
          opacity: 0.35,
          animation: "gear-spin 46s linear infinite",
        }}
      />
      <Cog
        className="calc-anim absolute bottom-[14%] left-[2%] h-24 w-24"
        strokeWidth={1}
        style={{
          color: "#b197fc",
          opacity: 0.38,
          animation: "gear-spin-rev 36s linear infinite",
        }}
      />
      <Cog
        className="calc-anim absolute top-[38%] right-[3%] h-16 w-16"
        strokeWidth={1}
        style={{
          color: "#4dabf7",
          opacity: 0.35,
          animation: "gear-spin 30s linear infinite",
        }}
      />

      {/* Rainbow dashed paths */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 800"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="consensus-rainbow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ff6b6b" />
            <stop offset="20%" stopColor="#ffa94d" />
            <stop offset="40%" stopColor="#ffd43b" />
            <stop offset="60%" stopColor="#69db7c" />
            <stop offset="80%" stopColor="#4dabf7" />
            <stop offset="100%" stopColor="#b197fc" />
          </linearGradient>
        </defs>

        {/* Animated dashed top path */}
        <path
          className="calc-anim"
          d="M-40 220 C 200 120, 420 360, 700 260 S 1100 120, 1320 320"
          stroke="url(#consensus-rainbow)"
          strokeOpacity="0.5"
          strokeWidth="2.5"
          strokeDasharray="10 12"
          style={{ animation: "dash-flow 10s linear infinite" }}
        />

        {/* Static bottom path — softer */}
        <path
          d="M-40 600 C 260 680, 520 460, 780 580 S 1180 700, 1320 540"
          stroke="url(#consensus-rainbow)"
          strokeOpacity="0.28"
          strokeWidth="2"
          strokeDasharray="6 14"
        />
      </svg>
    </div>
  );
}
