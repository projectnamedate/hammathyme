"use client";

import { ViewLink } from "./ViewLink";
import { motion, useReducedMotion } from "motion/react";
import { clsx } from "clsx";
import type { CSSProperties, ReactNode } from "react";

type Props = {
  href: string;
  index: number;
  title: ReactNode;
  caption: string;
  /** background tint */
  tint?: string;
  /** optional cursor label override */
  cursorLabel?: string;
  /** optional hero (image/video/SVG) */
  children?: ReactNode;
  className?: string;
  transitionName?: string;
};

/**
 * Plinth — character / demo / book-cover card variant. Used in portfolio
 * grids. Generous whitespace, museum-plate caption underneath.
 * Hover: subtle ground shadow + slight tilt; siblings spotlight-fade is
 * handled by the parent grid via [data-spotlight].
 */
export function Plinth({
  href,
  index,
  title,
  caption,
  tint,
  cursorLabel = "view",
  children,
  className,
  transitionName,
}: Props) {
  const reduce = useReducedMotion();
  const num = String(index).padStart(2, "0");
  const frameStyle: CSSProperties = {
    ...(tint ? { background: tint } : {}),
    ...(transitionName ? { viewTransitionName: transitionName } : {}),
  };

  return (
    <ViewLink
      href={href}
      data-cursor="link"
      data-cursor-label={cursorLabel}
      data-plinth
      className={clsx("group relative block focus:outline-none", className)}
    >
      <motion.div
        whileHover={reduce ? undefined : { y: -4 }}
        transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
        className="relative aspect-[3/4] w-full overflow-hidden border border-[var(--ink-4)] bg-[var(--cream-1)]"
        style={frameStyle}
      >
        {/* Index numeral, gigantic, low-opacity */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-3 top-3 z-10 font-display text-[clamp(56px,8vw,96px)] font-light leading-none tabular-nums tracking-[-0.04em] text-[var(--ink-0)] opacity-[0.06] mix-blend-multiply"
        >
          {num}
        </span>
        {/* hero slot */}
        {children ? (
          <div className="relative h-full w-full">{children}</div>
        ) : null}

        {/* hairline frame */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-2 border border-[var(--ink-3)] opacity-0 transition-opacity duration-500 group-hover:opacity-30"
        />
      </motion.div>

      {/* plate caption */}
      <div className="mt-4 flex flex-col gap-2">
        <span className="block h-px w-8 bg-[var(--ink-3)]" />
        <span className="font-display text-[var(--fs-4)] font-light lowercase leading-tight tracking-[-0.02em] text-[var(--ink-0)]">
          {title}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">
          {caption}
        </span>
      </div>
    </ViewLink>
  );
}
