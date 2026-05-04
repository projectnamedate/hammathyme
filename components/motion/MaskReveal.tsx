"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const CINEMA = [0.65, 0, 0.35, 1] as const;

type Props = {
  children: ReactNode;
  /** "up" slides content up from below a horizontal mask. "right" wipes left → right. */
  direction?: "up" | "right";
  delay?: number;
  duration?: number;
  className?: string;
  inView?: boolean;
};

export function MaskReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.85,
  className,
  inView = false,
}: Props) {
  const reduce = useReducedMotion();

  const initial =
    direction === "up"
      ? { clipPath: "inset(0% 0% 100% 0%)" }
      : { clipPath: "inset(0% 100% 0% 0%)" };
  const visible = { clipPath: "inset(0% 0% 0% 0%)" };

  return (
    <motion.div
      className={className}
      initial={reduce ? false : initial}
      animate={inView ? undefined : visible}
      whileInView={inView ? visible : undefined}
      viewport={inView ? { once: true, amount: 0.5 } : undefined}
      transition={{ duration: reduce ? 0 : duration, delay: reduce ? 0 : delay, ease: CINEMA }}
    >
      {children}
    </motion.div>
  );
}
