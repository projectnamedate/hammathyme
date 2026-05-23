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
      className={clsx("group relative block", className)}
    >
      <motion.div
        whileHover={reduce ? undefined : { y: -4 }}
        transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
        className="relative aspect-[3/4] w-full overflow-hidden border border-[rgba(31,7,7,0.18)] bg-[var(--cream-1)] shadow-[0_12px_34px_rgba(31,7,7,0.075)] transition-[border-color,box-shadow] duration-500 group-hover:border-[var(--ink-4)] group-hover:shadow-[0_18px_52px_rgba(31,7,7,0.12)]"
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

        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-100 transition-opacity duration-500 group-hover:opacity-70"
          style={{
            background:
              "linear-gradient(135deg, rgba(250, 238, 233, 0.20), rgba(242, 142, 134, 0.08) 52%, rgba(229, 191, 180, 0.18))",
          }}
        />

        {/* hairline frame */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-2 border border-[rgba(31,7,7,0.22)] opacity-25 transition-opacity duration-500 group-hover:opacity-40"
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
