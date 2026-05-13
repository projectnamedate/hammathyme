"use client";

import { motion, useReducedMotion } from "motion/react";

const CINEMA = [0.65, 0, 0.35, 1] as const;

function fireHermes(e: React.MouseEvent) {
  e.preventDefault();
  e.stopPropagation();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("hammer:hermes"));
  }
}

/**
 * Hero variant of the wordmark with a letter-by-letter mask reveal.
 * Used only on the entry hall — every other place uses <Wordmark>.
 *
 * The word renders as one native Outfit text run so browser kerning stays intact.
 * A controlled circular cinnamon period drops in last.
 */
export function HeroWordmark({
  ariaLabel = "hammer · ai producer",
  baseDelay = 0.65,
}: {
  ariaLabel?: string;
  baseDelay?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    // Reduced motion = static rendering, no mask animation.
    return (
      <span className="kw text-[clamp(96px,18vw,260px)] leading-[0.84]" aria-label={ariaLabel}>
        <span className="kw-word">hammer</span>
        <span className="dot cursor-pointer" onClick={fireHermes} role="button" tabIndex={-1} aria-hidden />
      </span>
    );
  }

  return (
    <span
      className="kw text-[clamp(96px,18vw,260px)] leading-[0.84]"
      aria-label={ariaLabel}
    >
      <span style={{ overflow: "hidden", verticalAlign: "baseline" }}>
        <motion.span
          className="kw-word"
          style={{ display: "inline-block", willChange: "transform" }}
          initial={{ y: "112%" }}
          animate={{ y: "0%" }}
          transition={{
            duration: 0.85,
            ease: CINEMA,
            delay: baseDelay,
          }}
        >
          hammer
        </motion.span>
      </span>
      <motion.span
        className="dot cursor-pointer"
        onClick={fireHermes}
        role="button"
        tabIndex={-1}
        aria-hidden
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.5,
          ease: [0.34, 1.56, 0.64, 1],
          delay: baseDelay + 0.72,
        }}
      />
    </span>
  );
}
