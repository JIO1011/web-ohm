"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { Variants } from "motion/react";
import {
  ArrowRight,
  Calculator,
  Clock,
  Cog,
  LineChart,
  Settings,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/* Floating mini-card used in the illustration cluster. */
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
        style={{ backgroundColor: `${tint}1f`, color: tint }}
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
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden">
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
        {/* slow rotating gears */}
        <Settings
          className="calc-anim absolute -top-10 right-[12%] h-40 w-40 text-white/60"
          strokeWidth={1}
          style={{ animation: "gear-spin 42s linear infinite" }}
        />
        <Cog
          className="calc-anim absolute top-[40%] left-[4%] h-24 w-24 text-[#cdd7e6]/60"
          strokeWidth={1}
          style={{ animation: "gear-spin-rev 34s linear infinite" }}
        />
        <Settings
          className="calc-anim absolute bottom-[8%] left-[40%] h-20 w-20 text-[#cdd7e6]/50"
          strokeWidth={1}
          style={{ animation: "gear-spin 50s linear infinite" }}
        />
        {/* flowing connector line */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1200 800"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            className="calc-anim"
            d="M-40 220 C 240 120, 420 360, 700 260 S 1120 120, 1320 320"
            stroke="#7fb6e6"
            strokeOpacity="0.45"
            strokeWidth="2"
            strokeDasharray="10 12"
            style={{ animation: "dash-flow 9s linear infinite" }}
          />
          <path
            d="M-40 560 C 260 640, 520 420, 780 540 S 1180 660, 1320 500"
            stroke="#ffb59f"
            strokeOpacity="0.45"
            strokeWidth="2"
          />
        </svg>
        {/* soft color blobs */}
        <div
          className="calc-anim absolute top-[18%] left-[46%] h-40 w-40 rounded-full bg-[#ff6b4a]/15 blur-3xl"
          style={{ animation: "floaty-slow 8s ease-in-out infinite" }}
        />
        <div
          className="calc-anim absolute right-[30%] bottom-[16%] h-48 w-48 rounded-full bg-[#3b82f6]/12 blur-3xl"
          style={{ animation: "floaty 9s ease-in-out infinite" }}
        />
      </div>

      {/* ── Content ── */}
      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-5 pt-24 pb-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:pt-20 lg:pb-20">
        {/* Left: copy */}
        <motion.div
          variants={container}
          initial={reduce ? false : "hidden"}
          animate="show"
          className="max-w-xl"
        >
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-[#ff6b4a] uppercase"
          >
            <span className="h-px w-6 bg-[#ff6b4a]/60" />
            Calcular proyecto
          </motion.span>

          <motion.h1
            variants={item}
            className="font-outfit mt-4 text-[2.6rem] leading-[1.05] font-extrabold tracking-tight text-[#1b2348] sm:text-5xl lg:text-[3.4rem]"
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
            className="mt-6 max-w-lg text-lg leading-relaxed text-[#5a6783]"
          >
            Diseña el alcance, estima la inversión y el tiempo, y agenda una llamada. Todo en una
            herramienta simple, en menos de tres minutos.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/calcular-proyecto/presupuestador"
              className="group inline-flex items-center gap-2 rounded-full bg-[#ff6b4a] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#ff6b4a]/30 transition-all hover:bg-[#f5572f] hover:shadow-xl hover:shadow-[#ff6b4a]/35 active:scale-[0.97]"
            >
              Calcular mi proyecto
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                strokeWidth={2.25}
              />
            </Link>
            <span className="inline-flex items-center gap-2 text-sm text-[#5a6783]">
              <span className="flex h-2 w-2 rounded-full bg-[#22c197]" />
              Respuesta en 48 h hábiles, sin compromiso
            </span>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-8 inline-flex items-center gap-2.5 rounded-2xl border border-white/70 bg-white/60 px-4 py-2.5 backdrop-blur"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#fff0d6] text-[#e2920a]">
              <Sparkles className="h-4 w-4" strokeWidth={2} />
            </span>
            <span className="text-sm text-[#5a6783]">
              <strong className="font-semibold text-[#1b2348]">Próximamente:</strong> diagnóstico
              técnico asistido.
            </span>
          </motion.div>
        </motion.div>

        {/* Right: animated illustration cluster */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
          className="relative mx-auto hidden h-[440px] w-full max-w-md lg:block"
        >
          {/* central orb */}
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

          {/* faint orbit ring */}
          <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-[#3b82f6]/20" />

          {/* floating chips */}
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
    </section>
  );
}
