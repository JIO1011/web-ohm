"use client";

import { motion } from "motion/react";
import {
  SiDocker,
  SiFlutter,
  SiGo,
  SiGraphql,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRedis,
  SiSupabase,
  SiTerraform,
  SiTypescript,
} from "react-icons/si";
import { BrainCircuit, Cloud, Code2 } from "lucide-react";

const technologies = [
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  { name: "React", icon: SiReact, color: "#61DAFB" },
  { name: "Next.js", icon: Code2, color: "#FFFFFF" },
  { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
  { name: "Python", icon: SiPython, color: "#3776AB" },
  { name: "Go", icon: SiGo, color: "#00ADD8" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
  { name: "Redis", icon: SiRedis, color: "#FF4438" },
  { name: "Docker", icon: SiDocker, color: "#2496ED" },
  { name: "Terraform", icon: SiTerraform, color: "#844FBA" },
  { name: "AWS", icon: Cloud, color: "#FF9900" },
  { name: "GCP", icon: Cloud, color: "#4285F4" },
  { name: "GraphQL", icon: SiGraphql, color: "#E10098" },
  { name: "React Native", icon: SiReact, color: "#61DAFB" },
  { name: "Flutter", icon: SiFlutter, color: "#02569B" },
  { name: "Gemini", icon: BrainCircuit, color: "#8E75B2" },
  { name: "OpenAI", icon: BrainCircuit, color: "#10A37F" },
  { name: "Supabase", icon: SiSupabase, color: "#3ECF8E" },
];

const marqueeItems = [...technologies, ...technologies, ...technologies, ...technologies];

export default function InfiniteMarquee() {
  return (
    <div className="relative z-30 -my-8 w-full overflow-x-clip pb-14 pt-10 sm:-my-10">
      {/* First Ribbon (Dark, straight/slightly tilted) */}
      <div className="relative z-20 mx-auto w-[105vw] -translate-x-[2.5vw] -rotate-1">
        <div className="relative flex h-20 w-full items-center overflow-hidden bg-ink-900 shadow-xl">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-ink-900 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-ink-900 to-transparent" />

          <div className="flex w-max items-center">
            <motion.div
              className="flex items-center gap-10 px-5"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ ease: "linear", duration: 80, repeat: Infinity }}
            >
              {marqueeItems.map((tech, idx) => {
                const Icon = tech.icon;
                return (
                  <div
                    key={`m1-${idx}`}
                    className="flex shrink-0 items-center gap-3 whitespace-nowrap text-base font-medium uppercase tracking-widest text-ink-200"
                  >
                    <Icon className="h-6 w-6" style={{ color: tech.color }} />
                    <span>{tech.name}</span>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Second Ribbon (Brand Red, tilted opposite way to create lasso effect) */}
      <div className="absolute inset-0 z-10 mx-auto -mt-2 w-[105vw] -translate-x-[2.5vw] rotate-[2deg]">
        <div className="relative flex h-20 w-full items-center overflow-hidden bg-brand-500 opacity-95 shadow-lg">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-brand-500 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-brand-500 to-transparent" />

          <div className="flex w-max items-center">
            <motion.div
              className="flex items-center gap-10 px-5"
              animate={{ x: ["-50%", "0%"] }}
              transition={{ ease: "linear", duration: 90, repeat: Infinity }}
            >
              {marqueeItems.map((tech, idx) => {
                const Icon = tech.icon;
                return (
                  <div
                    key={`m2-${idx}`}
                    className="flex shrink-0 items-center gap-3 whitespace-nowrap text-base font-medium uppercase tracking-widest text-white"
                  >
                    <Icon className="h-6 w-6" style={{ color: tech.color }} />
                    <span>{tech.name}</span>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
