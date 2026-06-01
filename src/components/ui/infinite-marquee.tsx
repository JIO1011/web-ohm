"use client";

import { motion } from "motion/react";
import {
  SiC,
  SiCplusplus,
  SiDjango,
  SiDocker,
  SiExpress,
  SiFlutter,
  SiGo,
  SiGraphql,
  SiHtml5,
  SiMongodb,
  SiMysql,
  SiNodedotjs,
  SiPhp,
  SiPython,
  SiTypescript,
  SiUnity,
  SiSupabase,
  SiReact,
} from "react-icons/si";
import { Bot, Sparkles, BrainCircuit, Cpu, Cloud, Terminal } from "lucide-react";

const technologies = [
  { name: "Azure", icon: Cloud, color: "#0078D4" },
  { name: "C", icon: SiC, color: "#A8B9CC" },
  { name: "C++", icon: SiCplusplus, color: "#00599C" },
  { name: "C#", icon: Terminal, color: "#239120" },
  { name: "Claude Code", icon: Bot, color: "#D97757" },
  { name: "Codex", icon: Cpu, color: "#0058A0" },
  { name: "Copilot", icon: Sparkles, color: "#fafafa" },
  { name: "Django", icon: SiDjango, color: "#092E20" },
  { name: "Docker", icon: SiDocker, color: "#2496ED" },
  { name: "Express", icon: SiExpress, color: "#ffffff" },
  { name: "Flutter", icon: SiFlutter, color: "#02569B" },
  { name: "Gemini", icon: BrainCircuit, color: "#8E75B2" },
  { name: "Go", icon: SiGo, color: "#00ADD8" },
  { name: "GraphQL", icon: SiGraphql, color: "#E10098" },
  { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
  { name: "IoT", icon: Cpu, color: "#b8b8b8" },
  { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
  { name: "MySQL", icon: SiMysql, color: "#4479A1" },
  { name: "Node.js", icon: SiNodedotjs, color: "#339939" },
  { name: "PHP", icon: SiPhp, color: "#777BB4" },
  { name: "Python", icon: SiPython, color: "#3776AB" },
  { name: "Reactive", icon: SiReact, color: "#61DAFB" },
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  { name: "Unity", icon: SiUnity, color: "#ffffff" },
  { name: "Supabase", icon: SiSupabase, color: "#3ECF8E" },
];

const marqueeItems = [...technologies, ...technologies, ...technologies, ...technologies];

export default function InfiniteMarquee() {
  return (
    <div className="group relative z-40 flex min-h-[280px] flex-col items-center justify-center overflow-hidden bg-slate-50 py-20">
      {/* Tilted ribbon */}
      <div className="absolute z-20 flex h-20 w-[150vw] translate-y-20 rotate-2 transform items-center border-y border-slate-800 bg-black shadow-2xl">
        <div className="pointer-events-none absolute left-0 top-0 z-30 h-full w-32 bg-gradient-to-r from-black to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-30 h-full w-32 bg-gradient-to-l from-black to-transparent" />

        <div className="flex w-max items-center">
          <motion.div
            className="flex items-center space-x-14 px-6 pr-14"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 120, repeat: Infinity }}
          >
            {marqueeItems.map((tech, idx) => {
              const Icon = tech.icon;
              return (
                <div
                  key={`slanted-${idx}`}
                  className="flex items-center space-x-3 whitespace-nowrap font-display text-xl font-medium uppercase tracking-widest text-white/80 transition-colors sm:text-2xl"
                >
                  <Icon className="h-8 w-8" style={{ color: tech.color }} />
                  <span>{tech.name}</span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Horizontal ribbon */}
      <div className="absolute z-30 flex h-20 w-[150vw] -translate-y-4 items-center border-t border-slate-800 bg-black shadow-2xl">
        <div className="pointer-events-none absolute left-0 top-0 z-40 h-full w-32 bg-gradient-to-r from-black to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-40 h-full w-32 bg-gradient-to-l from-black to-transparent" />

        <div className="flex w-max items-center">
          <motion.div
            className="flex items-center space-x-14 px-6 pr-14"
            animate={{ x: ["-50%", "0%"] }}
            transition={{ ease: "linear", duration: 130, repeat: Infinity }}
          >
            {marqueeItems.map((tech, idx) => {
              const Icon = tech.icon;
              return (
                <div
                  key={`horiz-${idx}`}
                  className="flex items-center space-x-3 whitespace-nowrap font-display text-xl font-medium uppercase tracking-widest text-white/50 opacity-90 transition-all sm:text-2xl"
                >
                  <Icon className="h-8 w-8" style={{ color: tech.color }} />
                  <span>{tech.name}</span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
