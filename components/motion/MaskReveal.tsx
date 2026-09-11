"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const CINEMA = [0.65, 0, 0.35, 1] as const;

// The revealed clip expands past the box on every side: a lingering
// inset(0%) would clip glyph ink (italic descenders, swashes) that
// overflows the wrapper.
const VISIBLE_CLIP = "inset(-15% -15% -30% -15%)";

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
  const visible = { clipPath: VISIBLE_CLIP };

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
