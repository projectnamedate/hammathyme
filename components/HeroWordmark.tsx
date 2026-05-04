"use client";

import { motion, useReducedMotion } from "motion/react";

const CINEMA = [0.65, 0, 0.35, 1] as const;

const LETTERS = ["h", "a", "m", "m", "e", "r"] as const;

/**
 * Hero variant of the wordmark with a letter-by-letter mask reveal.
 * Used only on the entry hall — every other place uses <Wordmark>.
 *
 * Each letter sits inside a horizontal mask (overflow hidden); the inner span
 * starts at translateY(110%) and rises to 0%. The cinnamon period drops in
 * last with a small extra delay.
 *
 * Kerning is preserved by the parent .kw class; we wrap each <span> letter
 * exactly as Wordmark does, with a motion child inside for the mask.
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
        {LETTERS.map((l, i) => (
          <span key={i}>{l}</span>
        ))}
        <span className="dot">.</span>
      </span>
    );
  }

  return (
    <span
      className="kw text-[clamp(96px,18vw,260px)] leading-[0.84]"
      aria-label={ariaLabel}
    >
      {LETTERS.map((l, i) => (
        <span key={i} style={{ overflow: "hidden", verticalAlign: "baseline" }}>
          <motion.span
            style={{ display: "inline-block", willChange: "transform" }}
            initial={{ y: "112%" }}
            animate={{ y: "0%" }}
            transition={{
              duration: 0.85,
              ease: CINEMA,
              delay: baseDelay + i * 0.045,
            }}
          >
            {l}
          </motion.span>
        </span>
      ))}
      {/* cinnamon period — drops in slightly later with a soft scale */}
      <span className="dot" style={{ display: "inline-block" }}>
        <motion.span
          style={{ display: "inline-block" }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.5,
            ease: [0.34, 1.56, 0.64, 1],
            delay: baseDelay + LETTERS.length * 0.045 + 0.12,
          }}
        >
          .
        </motion.span>
      </span>
    </span>
  );
}
