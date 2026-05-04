"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  amount?: number;
  className?: string;
};

export function ScrollReveal({
  children,
  delay = 0,
  duration = 0.7,
  y = 24,
  amount = 0.4,
  className,
}: Props) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{
        duration: reduce ? 0 : duration,
        delay: reduce ? 0 : delay,
        ease: [0.65, 0, 0.35, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
