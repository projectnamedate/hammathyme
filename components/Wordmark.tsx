"use client";

import { clsx } from "clsx";

type Props = {
  className?: string;
  ariaLabel?: string;
  size?: "sm" | "md" | "lg" | "hero";
};

const SIZE = {
  sm: "text-[clamp(20px,2vw,28px)]",
  md: "text-[clamp(28px,3vw,40px)]",
  lg: "text-[clamp(48px,6vw,96px)]",
  hero: "text-[clamp(96px,18vw,260px)] leading-[0.84]",
};

export const WORDMARK_LETTERS = ["h", "a", "m", "m", "e", "r"] as const;

function fireHermes(e: React.MouseEvent) {
  // Tap on the period intercepts: don't trigger the wrapping <a>.
  e.preventDefault();
  e.stopPropagation();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("hammer:hermes"));
  }
}

export function Wordmark({ className, ariaLabel = "hammer · home", size = "md" }: Props) {
  return (
    <span className={clsx("kw", SIZE[size], className)} aria-label={ariaLabel}>
      <span className="kw-word" aria-hidden>
        {WORDMARK_LETTERS.map((letter, index) => (
          <span className="kw-letter-mask" key={`${letter}-${index}`}>
            <span className="kw-letter">{letter}</span>
          </span>
        ))}
      </span>
      <span
        className="dot cursor-pointer"
        onClick={fireHermes}
        role="button"
        tabIndex={-1}
        aria-hidden
      />
    </span>
  );
}
