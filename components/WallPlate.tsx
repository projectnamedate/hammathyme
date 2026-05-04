import { clsx } from "clsx";

type Props = {
  index: number | string;
  title: string;
  year: string;
  medium?: string;
  client?: string;
  role?: string;
  className?: string;
  align?: "left" | "right" | "center";
};

/**
 * Museum wall plate. Letterpress aesthetic. Used under every framed piece
 * in the atrium and as the title block on case-study scenes.
 *
 *   05
 *   ──────
 *   Title — Year — Medium — Client — Role
 */
export function WallPlate({
  index,
  title,
  year,
  medium,
  client,
  role,
  className,
  align = "left",
}: Props) {
  // Drop medium when it duplicates the title (placeholder data hits this often).
  const m = medium && title.toLowerCase().trim() !== medium.toLowerCase().trim() ? medium : undefined;
  const meta = [title, year, m, client, role].filter(Boolean).join(" — ");
  return (
    <figcaption
      className={clsx(
        "flex flex-col gap-3 text-[var(--ink-1)]",
        align === "right" && "items-end text-right",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <span className="font-display text-[clamp(36px,6vw,72px)] font-light tabular-nums leading-none tracking-[-0.04em] text-[var(--ink-0)]">
        {typeof index === "number" ? String(index).padStart(2, "0") : index}
      </span>
      <span aria-hidden className="block h-px w-12 bg-[var(--ink-3)]" />
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">
        {meta}
      </span>
    </figcaption>
  );
}
