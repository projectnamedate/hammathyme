"use client";

import Link from "next/link";
import {
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CASE_STUDIES, type CaseStudy } from "@/lib/works";
import { WallPlate } from "./WallPlate";

// Positions on a virtual canvas (cw/ch are canvas dimensions in % of viewport).
// Hand-tuned to feel "Swiss intentional," not random.
type Pos = { x: number; y: number; w: number; h: number };
const CANVAS_W_VW = 220;
const CANVAS_H_VH = 180;

const POSITIONS: Pos[] = [
  { x: 14,  y: 12,  w: 24, h: 36 },  // 01 top-left
  { x: 50,  y: 8,   w: 22, h: 30 },  // 02 top-mid
  { x: 78,  y: 18,  w: 26, h: 38 },  // 03 top-right (large)
  { x: 22,  y: 56,  w: 22, h: 30 },  // 04 mid-left
  { x: 56,  y: 50,  w: 28, h: 40 },  // 05 mid-center (large)
  { x: 100, y: 64,  w: 20, h: 28 },  // 06 mid-right
  { x: 30,  y: 100, w: 26, h: 36 },  // 07 bottom-left (large)
  { x: 70,  y: 110, w: 24, h: 32 },  // 08 bottom-right
];

/**
 * The atrium — bounded drag-canvas. Visitors drag to walk past 8 framed
 * pieces; hover spotlights one at full color while siblings drop to 35%
 * opacity. Wheel pans (delegated by framer-motion drag), arrow keys
 * step. Mobile = vertical snap-pages (separate component below).
 */
export function AtriumCanvas() {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Viewport-translated parallax for tile shimmer (subtle)
  const tileX = useTransform(x, [-1, 0, 1], [-1, 0, 1]);
  void tileX; // reserved for later parallax; kept for type stability

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 768px), (pointer: coarse)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Center the canvas on first mount on desktop
  useEffect(() => {
    if (isMobile) return;
    if (typeof window === "undefined") return;
    const initX = (window.innerWidth * (CANVAS_W_VW / 100) - window.innerWidth) / -2;
    const initY = (window.innerHeight * (CANVAS_H_VH / 100) - window.innerHeight) / -2;
    x.set(initX);
    y.set(initY);
  }, [isMobile, x, y]);

  // Keyboard panning
  useEffect(() => {
    if (isMobile || reduce) return;
    const onKey = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT") return;
      const step = window.innerWidth * 0.18;
      let nx = x.get();
      let ny = y.get();
      if (e.key === "ArrowRight") nx -= step;
      else if (e.key === "ArrowLeft") nx += step;
      else if (e.key === "ArrowDown") ny -= step;
      else if (e.key === "ArrowUp") ny += step;
      else return;
      e.preventDefault();
      // clamp within canvas bounds
      const maxX = 0;
      const minX = window.innerWidth - window.innerWidth * (CANVAS_W_VW / 100);
      const maxY = 0;
      const minY = window.innerHeight - window.innerHeight * (CANVAS_H_VH / 100);
      x.set(Math.max(minX, Math.min(maxX, nx)));
      y.set(Math.max(minY, Math.min(maxY, ny)));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobile, reduce, x, y]);

  if (isMobile) return <AtriumStack />;

  return (
    <section className="relative h-[100svh] w-screen overflow-hidden bg-[var(--cream-0)]">
      {/* hairline gallery floor */}
      <div aria-hidden className="pointer-events-none absolute inset-x-12 bottom-12 z-10 h-px bg-[var(--ink-4)]" />

      {/* nav hint */}
      <div className="pointer-events-none absolute bottom-6 left-6 z-30 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-3)] md:bottom-12 md:left-12">
        drag · wheel · arrows
      </div>

      {/* hovered piece caption */}
      <div className="pointer-events-none absolute bottom-6 right-6 z-30 max-w-[40ch] text-right md:bottom-12 md:right-12">
        <span className="block font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--cinnamon)]">
          {hovered
            ? CASE_STUDIES.find((c) => c.slug === hovered)?.capabilityLabel
            : "8 pieces"}
        </span>
        <span className="mt-2 block font-display text-[clamp(16px,1.6vw,22px)] font-light lowercase leading-tight tracking-[-0.02em] text-[var(--ink-1)]">
          {hovered
            ? CASE_STUDIES.find((c) => c.slug === hovered)?.title
            : "drag to walk past"}
        </span>
      </div>

      {/* the canvas */}
      <motion.div
        ref={wrapRef}
        className="absolute left-0 top-0 cursor-grab active:cursor-grabbing"
        style={{
          width: `${CANVAS_W_VW}vw`,
          height: `${CANVAS_H_VH}vh`,
          x,
          y,
        }}
        drag={!reduce}
        dragMomentum
        dragElastic={0.15}
        dragTransition={{ power: 0.32, timeConstant: 320, bounceStiffness: 120, bounceDamping: 24 }}
        dragConstraints={{
          left:
            typeof window !== "undefined"
              ? window.innerWidth - window.innerWidth * (CANVAS_W_VW / 100)
              : -1600,
          top:
            typeof window !== "undefined"
              ? window.innerHeight - window.innerHeight * (CANVAS_H_VH / 100)
              : -1600,
          right: 0,
          bottom: 0,
        }}
      >
        {CASE_STUDIES.slice(0, POSITIONS.length).map((item, i) => (
          <Tile
            key={item.slug}
            item={item}
            pos={POSITIONS[i]!}
            index={i + 1}
            isHovered={hovered === item.slug}
            anyHovered={hovered != null}
            onEnter={() => setHovered(item.slug)}
            onLeave={() => setHovered(null)}
          />
        ))}
      </motion.div>
    </section>
  );
}

function Tile({
  item,
  pos,
  index,
  isHovered,
  anyHovered,
  onEnter,
  onLeave,
}: {
  item: CaseStudy;
  pos: Pos;
  index: number;
  isHovered: boolean;
  anyHovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <motion.div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      className="absolute"
      style={{
        left: `${pos.x}vw`,
        top: `${pos.y}vh`,
        width: `${pos.w}vw`,
        height: `${pos.h}vh`,
      }}
      animate={{ opacity: anyHovered && !isHovered ? 0.35 : 1 }}
      transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
    >
      <Link
        href={`/work/${item.slug}`}
        data-cursor="link"
        data-cursor-label="enter →"
        draggable={false}
        className="group relative flex h-full w-full flex-col focus:outline-none"
      >
        {/* the framed piece */}
        <div
          className="relative h-[78%] w-full overflow-hidden border border-[var(--ink-4)]"
          style={{ background: item.tint }}
        >
          {/* idx numeral, low-opacity, gigantic */}
          <span
            aria-hidden
            className="pointer-events-none absolute -top-[10%] -left-[3%] font-display leading-none tabular-nums tracking-[-0.04em] text-[var(--ink-0)] opacity-[0.06]"
            style={{ fontSize: `min(${pos.h * 0.85}vh, ${pos.w * 0.55}vw)` }}
          >
            {String(index).padStart(2, "0")}
          </span>

          {/* cinnamon corner pip */}
          <span
            aria-hidden
            className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-[var(--cinnamon)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />

          {/* hairline frame on hover */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-2 border border-[var(--ink-3)] opacity-0 transition-opacity duration-500 group-hover:opacity-30"
          />
        </div>

        {/* mini wall plate under the piece */}
        <div className="mt-3 px-1">
          <WallPlate
            index={index}
            title={item.title}
            year={item.year}
            medium={item.capabilityLabel}
            client={item.client}
            className="!gap-2"
          />
        </div>
      </Link>
    </motion.div>
  );
}

/** Mobile fallback — vertical snap pages, one piece per screen. */
function AtriumStack() {
  return (
    <section className="hide-scrollbar h-[100svh] w-screen overflow-y-auto overflow-x-hidden bg-[var(--cream-0)]" style={{ scrollSnapType: "y mandatory" }}>
      {CASE_STUDIES.map((item, i) => (
        <article
          key={item.slug}
          className="relative flex h-[100svh] w-full snap-start flex-col items-center justify-center px-6"
          style={{ scrollSnapAlign: "start" }}
        >
          <Link
            href={`/work/${item.slug}`}
            data-cursor="link"
            className="group relative flex w-full flex-col items-center"
          >
            <div
              className="relative aspect-[3/4] w-[80vw] max-w-[440px] overflow-hidden border border-[var(--ink-4)]"
              style={{ background: item.tint }}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -top-[5%] -left-[3%] font-display text-[40vw] font-light leading-none tabular-nums tracking-[-0.04em] text-[var(--ink-0)] opacity-[0.06]"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="mt-6 text-center">
              <span className="block h-px w-12 bg-[var(--ink-3)] mx-auto" />
              <p className="mt-3 font-display text-[clamp(20px,4vw,28px)] font-light lowercase leading-tight tracking-[-0.02em] text-[var(--ink-0)]">
                {item.title}
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">
                {String(i + 1).padStart(2, "0")} · {item.year} · {item.capabilityLabel}
              </p>
            </div>
          </Link>
        </article>
      ))}
    </section>
  );
}
