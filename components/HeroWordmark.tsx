"use client";

import { motion, useReducedMotion } from "motion/react";
import { WORDMARK_LETTERS } from "./Wordmark";

const CINEMA = [0.65, 0, 0.35, 1] as const;
const LETTER_STAGGER = 0.045;

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
 * The word uses the cold-open per-letter construction. The period keeps the
 * approved website baseline placement.
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
        <span className="kw-word" aria-hidden>
          {WORDMARK_LETTERS.map((letter, index) => (
            <span className="kw-letter-mask" key={`${letter}-${index}`}>
              <span className="kw-letter">{letter}</span>
            </span>
          ))}
        </span>
        <span className="dot cursor-pointer" onClick={fireHermes} aria-hidden />
      </span>
    );
  }

  return (
    <span
      className="kw text-[clamp(96px,18vw,260px)] leading-[0.84]"
      aria-label={ariaLabel}
    >
      <span className="kw-word" aria-hidden>
        {WORDMARK_LETTERS.map((letter, index) => (
          <span className="kw-letter-mask" key={`${letter}-${index}`}>
            <motion.span
              className="kw-letter"
              style={{ willChange: "transform" }}
              initial={{ y: "112%" }}
              animate={{ y: "0%" }}
              transition={{
                duration: 0.85,
                ease: CINEMA,
                delay: baseDelay + index * LETTER_STAGGER,
              }}
            >
              {letter}
            </motion.span>
          </span>
        ))}
      </span>
      <motion.span
        className="inline-block cursor-pointer"
        onClick={fireHermes}
        aria-hidden
        style={{ transformOrigin: "center center" }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.5,
          ease: [0.34, 1.56, 0.64, 1],
          delay: baseDelay + 0.98,
        }}
      >
        <span className="dot" aria-hidden />
      </motion.span>
    </span>
  );
}
