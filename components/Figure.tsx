import { clsx } from "clsx";
import type { ReactNode } from "react";

type Props = {
  number: number;
  caption: string;
  year?: string;
  children: ReactNode;
  className?: string;
};

/**
 * Figure-numbered media block. `Fig. 01 — Pipeline diagram, 2026`
 * Used inside case-study scenes for stills, video, and pipeline diagrams.
 */
export function Figure({ number, caption, year, children, className }: Props) {
  const num = String(number).padStart(2, "0");
  return (
    <figure className={clsx("flex flex-col gap-4", className)}>
      <div className="relative w-full">{children}</div>
      <figcaption className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">
        <span className="text-[var(--cinnamon)]">Fig. {num}</span>
        <span className="mx-2 text-[var(--ink-3)]">—</span>
        <span>{caption}</span>
        {year ? (
          <>
            <span className="mx-2 text-[var(--ink-3)]">·</span>
            <span className="text-[var(--ink-2)]">{year}</span>
          </>
        ) : null}
      </figcaption>
    </figure>
  );
}
