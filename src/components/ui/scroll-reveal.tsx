"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "fade";
  as?: "div" | "li" | "section";
}

const variants = {
  up:   { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -24 }, visible: { opacity: 1, x: 0 } },
  fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
} as const;

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  as = "div",
}: ScrollRevealProps) {
  const reduce = useReducedMotion();
  const v = variants[direction];

  const Component = motion[as] as typeof motion.div;

  return (
    <Component
      className={className}
      initial={reduce ? false : v.hidden}
      whileInView={v.visible}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.23, 1, 0.32, 1],
      }}
    >
      {children}
    </Component>
  );
}
