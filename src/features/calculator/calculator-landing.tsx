"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { Variants } from "motion/react";
import {
  ArrowRight,
  BrainCircuit,
  Calculator,
  Clock,
  Cog,
  LineChart,
  Settings,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};
const cardItem: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

function FloatChip({
  className,
  delay,
  tint,
  Icon,
  title,
  value,
}: {
  className: string;
  delay: string;
  tint: string;
  Icon: typeof Calculator;
  title: string;
  value: string;
}) {
  return (
    <div
      className={`calc-anim absolute flex items-center gap-2.5 rounded-2xl border border-white/70 bg-white/90 px-3.5 py-2.5 shadow-[0_16px_40px_-18px_rgba(27,35,72,0.4)] backdrop-blur ${className}`}
      style={{ animation: "floaty 6s ease-in-out infinite", animationDelay: delay }}
    >
      <span
        className="flex h-9 w-9 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${tint}22`, color: tint }}
      >
        <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
      </span>
      <span className="leading-tight">
        <span className="block text-[11px] font-medium text-[#7c8aa6]">{title}</span>
        <span className="font-outfit block text-sm font-bold text-[#1b2348]">{value}</span>
      </span>
    </div>
  );
}

export default function CalculatorLanding() {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden">
      {/* ── Pastel gradient backdrop ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20"
        style={{
          backgroundColor: "#eef3fb",
          backgroundImage:
            "radial-gradient(58% 50% at 10% 16%, #ffe4d6 0%, transparent 60%)," +
            "radial-gradient(55% 55% at 92% 18%, #dbe9fc 0%, transparent 62%)," +
            "radial-gradient(50% 50% at 14% 92%, #d7f5e6 0%, transparent 60%)," +
            "radial-gradient(48% 48% at 86% 88%, #f0e6fb 0%, transparent 60%)",
        }}
      />

      {/* ── Decorative animated layer ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <Settings
          className="calc-anim absolute -top-10 right-[8%] h-44 w-44 text-white/50"
          strokeWidth={1}
          style={{ animation: "gear-spin 42s linear infinite" }}
        />
        <Cog
          className="calc-anim absolute bottom-[12%] left-[2%] h-24 w-24 text-[#cdd7e6]/50"
          strokeWidth={1}
          style={{ animation: "gear-spin-rev 34s linear infinite" }}
        />
        <Cog
          className="calc-anim absolute top-[35%] right-[2%] h-16 w-16 text-[#cdd7e6]/40"
          strokeWidth={1}
          style={{ animation: "gear-spin 28s linear infinite" }}
        />
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1200 800"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            className="calc-anim"
            d="M-40 200 C 200 100, 420 340, 700 240 S 1100 100, 1320 300"
            stroke="#7fb6e6"
            strokeOpacity="0.4"
            strokeWidth="2"
            strokeDasharray="10 12"
            style={{ animation: "dash-flow 9s linear infinite" }}
          />
          <path
            d="M-40 580 C 260 660, 520 440, 780 560 S 1180 680, 1320 520"
            stroke="#ffb59f"
            strokeOpacity="0.4"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* ── Main content ── */}
      <div className="relative mx-auto w-full max-w-6xl px-5 pt-20 pb-10 sm:px-6 lg:px-8 lg:pt-16 lg:pb-8">
        {/* ── Row 1: copy + orb cluster ── */}
        <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-2 lg:gap-6">
          <motion.div variants={container} initial={reduce ? false : "hidden"} animate="show">
            <motion.span
              variants={item}
              className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-[#ff6b4a] uppercase"
            >
              <span className="h-px w-6 bg-[#ff6b4a]/60" />
              OhmRoyal · Herramientas
            </motion.span>

            <motion.h1
              variants={item}
              className="font-outfit mt-3 text-4xl leading-[1.05] font-extrabold tracking-tight text-[#1b2348] sm:text-5xl lg:text-[3rem]"
            >
              Calcula tu proyecto,{" "}
              <span className="relative whitespace-nowrap text-[#ff6b4a]">
                sin sorpresas
                <svg
                  aria-hidden="true"
                  viewBox="0 0 200 12"
                  className="absolute -bottom-1.5 left-0 h-2.5 w-full"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 8 C 50 2, 150 2, 198 7"
                    stroke="#ffb59f"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>
              .
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-4 max-w-md text-base leading-relaxed text-[#5a6783] sm:text-lg"
            >
              Elige la herramienta que necesitas. Estima costos y tiempos, o prioriza las
              iniciativas de tu equipo con inteligencia colectiva.
            </motion.p>

            <motion.p
              variants={item}
              className="mt-4 inline-flex items-center gap-2 text-sm text-[#5a6783]"
            >
              <span className="flex h-2 w-2 rounded-full bg-[#22c197]" />
              Respuesta en 48 h hábiles, sin compromiso
            </motion.p>
          </motion.div>

          {/* Orb cluster — desktop only */}
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.12 }}
            className="relative mx-auto hidden h-[380px] w-full max-w-md lg:block"
          >
            <div
              className="calc-anim absolute top-1/2 left-1/2 flex h-52 w-52 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[2.5rem] text-white shadow-[0_40px_80px_-30px_rgba(255,107,74,0.7)]"
              style={{
                backgroundImage: "linear-gradient(135deg, #ff8a63 0%, #ff5e7a 100%)",
                animation: "floaty 7s ease-in-out infinite",
              }}
            >
              <Calculator className="h-20 w-20" strokeWidth={1.5} />
              <span
                className="calc-anim absolute -top-3 -right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#ff6b4a] shadow-lg"
                style={{ animation: "floaty-slow 5s ease-in-out infinite" }}
              >
                <Sparkles className="h-5 w-5" strokeWidth={2} />
              </span>
            </div>
            <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-[#3b82f6]/20" />
            <FloatChip
              className="top-2 left-0"
              delay="0s"
              tint="#22c197"
              Icon={ShieldCheck}
              title="Alcance"
              value="Por escrito"
            />
            <FloatChip
              className="top-10 right-0"
              delay="1.1s"
              tint="#3b82f6"
              Icon={Clock}
              title="Tiempo"
              value="3-7 semanas"
            />
            <FloatChip
              className="bottom-4 left-6"
              delay="2s"
              tint="#ff6b4a"
              Icon={LineChart}
              title="Estimado"
              value="USD 2.8k"
            />
          </motion.div>
        </div>

        {/* ── Row 2: cards + character ────────────────────────────────────────────
            DESKTOP (lg+): 3-col grid. Cards occupy cols 1 and 3; col 2 is the
            character slot. Each column is ~1/3 of the expanded grid width.

            The "lean toward Consensus" effect works in three coordinated steps:
              1. lg:-mx-8          → expand the grid 32px on each side so the
                                     character column has room without shrinking cards.
              2. lg:grid-cols-3    → three equal columns (~400px each at max-w-6xl).
              3. Card 1: lg:translate-x-[90px]  → slides 90px right (toward center).
                 Card 2: lg:-translate-x-[90px] → slides 90px left  (toward center).
                 Both cards move closer to the character, tightening the cluster.
              4. Character column (hidden on mobile/tablet):
                 - lg:w-[800px]: image wider than the 400px column → overflows both
                   sides by ~200px, straddling both cards.
                 - lg:translate-x-[140px]: shifts 140px further right into Consensus.
                   Net right overlap: ~340px. Net left overlap: ~60px.
                   This makes the character visually "lean on" Consensus.
                 - lg:-translate-y-[70px]: lifts character 70px above card tops so
                   head and shoulders tower over both cards.

            MOBILE / TABLET (< lg): character column is `hidden` so it is removed
            from the grid flow. Cards use sm:grid-cols-2 (tablet) or single col.
        ──────────────────────────────────────────────────────────────────────────── */}
        <motion.div
          variants={container}
          initial={reduce ? false : "hidden"}
          animate="show"
          className="mt-8 grid grid-cols-1 items-center gap-5 sm:grid-cols-2 lg:-mx-8 lg:grid-cols-3 lg:gap-8"
        >
          {/* Card 1 — Presupuestador */}
          <motion.div variants={cardItem} className="relative z-10 lg:translate-x-[90px]">
            <Link
              href="/calcular-proyecto/presupuestador"
              className="group relative flex h-full min-h-[200px] flex-col justify-between overflow-hidden rounded-3xl p-6 text-white shadow-[0_24px_60px_-20px_rgba(255,107,74,0.55)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_32px_70px_-18px_rgba(255,107,74,0.7)] active:scale-[0.98] sm:p-7"
              style={{ backgroundImage: "linear-gradient(135deg, #ff8a63 0%, #ff4e6a 100%)" }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/20 blur-2xl"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-[#ff4e6a]/40 blur-2xl"
              />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                    <Calculator className="h-6 w-6" strokeWidth={1.75} />
                  </span>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold tracking-wider uppercase">
                    Disponible ahora
                  </span>
                </div>
                <h2 className="font-outfit mt-4 text-xl leading-snug font-extrabold tracking-tight sm:text-2xl">
                  Presupuestador de software
                </h2>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/80">
                  Diseña el alcance, estima arquitectura, inversión y tiempo en 3 pasos. Luego
                  agenda una videollamada.
                </p>
              </div>
              <div className="relative mt-5 flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-sm font-bold">
                  Calcular mi proyecto
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    strokeWidth={2.5}
                  />
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                  <Zap className="h-4 w-4" strokeWidth={2} />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Character column — desktop only (hidden on mobile/tablet) */}
          <motion.div
            variants={cardItem}
            className="pointer-events-none relative z-20 hidden items-center justify-center lg:flex lg:translate-x-[140px] lg:-translate-y-[70px]"
          >
            <Image
              src="/image.png"
              alt=""
              width={650}
              height={440}
              className="h-auto shrink-0 drop-shadow-2xl"
              style={{ width: "800px", maxWidth: "none" }}
              priority
            />
          </motion.div>

          {/* Card 2 — Consensus */}
          <motion.div variants={cardItem} className="relative z-10 lg:-translate-x-[90px]">
            <Link
              href="/calcular-proyecto/consensus"
              className="group relative flex h-full min-h-[200px] flex-col justify-between overflow-hidden rounded-3xl p-6 text-white shadow-[0_24px_60px_-20px_rgba(27,35,72,0.55)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_32px_70px_-18px_rgba(59,130,246,0.5)] active:scale-[0.98] sm:p-7"
              style={{ backgroundImage: "linear-gradient(135deg, #1b2348 0%, #243b8a 100%)" }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[#3b82f6]/20 blur-2xl"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-[#818cf8]/15 blur-2xl"
              />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                    <BrainCircuit className="h-6 w-6 text-[#93c5fd]" strokeWidth={1.75} />
                  </span>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold tracking-wider uppercase">
                    Beta · Gratis
                  </span>
                </div>
                <h2 className="font-outfit mt-4 text-xl leading-snug font-extrabold tracking-tight text-white sm:text-2xl">
                  Consensus
                </h2>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/80">
                  Descubre las necesidades reales de tu equipo. Recopila, prioriza y exporta una
                  matriz de decisiones en minutos.
                </p>
              </div>
              <div className="relative mt-5 flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-sm font-bold">
                  Crear sesión
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    strokeWidth={2.5}
                  />
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                  <BrainCircuit className="h-4 w-4 text-[#93c5fd]" strokeWidth={2} />
                </span>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
