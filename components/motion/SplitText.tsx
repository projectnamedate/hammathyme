"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";

const CINEMA = [0.65, 0, 0.35, 1] as const;
const SOFT = [0.25, 0.1, 0.25, 1] as const;

type Props = {
  children: string;
  delay?: number;
  stagger?: number;
  className?: string;
  style?: CSSProperties;
  /** "chars" reveals letter-by-letter, "words" reveals word-by-word */
  by?: "chars" | "words";
  /** "mask" slides letters up from a horizontal mask. "fade" cross-fades letters in. */
  mode?: "mask" | "fade";
  inView?: boolean;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
};

export function SplitText({
  children,
  delay = 0,
  stagger = 0.045,
  className,
  style,
  by = "chars",
  mode = "mask",
  inView = false,
  as = "span",
}: Props) {
  const reduce = useReducedMotion();
  const tokens = by === "chars" ? Array.from(children) : children.split(" ");

  const Container = motion[as as keyof typeof motion] as typeof motion.span;

  const containerVariants = {
    hidden: {},
    show: {
      transition: reduce
        ? { staggerChildren: 0, delayChildren: 0 }
        : { staggerChildren: stagger, delayChildren: delay },
    },
  };

  const itemVariants =
    mode === "mask"
      ? ({
          hidden: { y: "110%" },
          show: {
            y: "0%",
            transition: { duration: 0.85, ease: CINEMA },
          },
        } as const)
      : ({
          hidden: { opacity: 0, y: 8 },
          show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: SOFT },
          },
        } as const);

  return (
    <Container
      className={className}
      style={style}
      initial="hidden"
      whileInView={inView ? "show" : undefined}
      animate={inView ? undefined : "show"}
      viewport={inView ? { once: true, amount: 0.5 } : undefined}
      variants={containerVariants}
      aria-label={children}
    >
      {tokens.map((tok, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            display: "inline-block",
            overflow: mode === "mask" ? "hidden" : "visible",
            verticalAlign: "baseline",
          }}
        >
          <motion.span
            style={{ display: "inline-block", willChange: "transform, opacity" }}
            variants={itemVariants}
          >
            {tok === " " ? "\u00A0" : tok}
            {by === "words" && i < tokens.length - 1 ? "\u00A0" : null}
          </motion.span>
        </span>
      ))}
    </Container>
  );
}
