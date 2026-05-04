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

export function Wordmark({ className, ariaLabel = "hammer · home", size = "md" }: Props) {
  return (
    <span className={clsx("kw", SIZE[size], className)} aria-label={ariaLabel}>
      <span>h</span>
      <span>a</span>
      <span>m</span>
      <span>m</span>
      <span>e</span>
      <span>r</span>
      <span className="dot">.</span>
    </span>
  );
}
