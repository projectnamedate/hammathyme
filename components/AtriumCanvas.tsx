"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { CASE_STUDIES, type CaseStudy } from "@/lib/works";
import { CardArt } from "./CardArt";
import { ViewLink } from "./ViewLink";

/**
 * The atrium — a fixed museum wall, not a drag-canvas.
 *
 *   • 8 framed pieces sit at hand-tuned positions on a single 100vw × 100vh
 *     room. Visitors *scan* the wall — they don't navigate.
 *   • Piece 01 is spotlighted by default; siblings drop to 35% opacity.
 *   • Hover or arrow keys move the spotlight; click enters the piece.
 *   • Mobile = vertical snap-pages.
 */

type Pos = { x: number; y: number; w: number; h: number };

// Hand-tuned 4-over-4 staggered grid for 8 pieces. x/w in vw, y/h in vh.
// Top row tall/short/tall/short, bottom row short/tall/short/tall (mirrored)
// for Swiss asymmetry. y leaves a clear title band ~80–144px at the top.
const POSITIONS: Pos[] = [
  { x:  6, y: 22, w: 18, h: 26 }, // 01 tall — brand systems
  { x: 28, y: 28, w: 16, h: 20 }, // 02 short — autonomous characters
  { x: 48, y: 22, w: 20, h: 26 }, // 03 tall — motion graphics
  { x: 72, y: 28, w: 16, h: 20 }, // 04 short — animation
  { x:  6, y: 58, w: 18, h: 20 }, // 05 short — pipelines + tools
  { x: 28, y: 52, w: 16, h: 26 }, // 06 tall — interactive + playable
  { x: 48, y: 58, w: 20, h: 20 }, // 07 short — visual media
  { x: 72, y: 52, w: 16, h: 26 }, // 08 tall — websites
];

const CINEMA = [0.65, 0, 0.35, 1] as const;

export function AtriumCanvas() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touring, setTouring] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 768px), (pointer: coarse)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Auto-tour: when idle for 4s, the spotlight slowly cycles through pieces
  // every 3s. Any interaction stops it.
  useEffect(() => {
    if (isMobile || reduce) return;
    let idleTimer: number | null = null;
    let tourInterval: number | null = null;
    const startTour = () => {
      setTouring(true);
      tourInterval = window.setInterval(() => {
        setActive((cur) => (cur + 1) % POSITIONS.length);
      }, 3000);
    };
    const stopTour = () => {
      setTouring(false);
      if (tourInterval) {
        window.clearInterval(tourInterval);
        tourInterval = null;
      }
    };
    const resetIdle = () => {
      stopTour();
      if (idleTimer) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(startTour, 4000);
    };
    idleTimer = window.setTimeout(startTour, 4000);
    const events: Array<keyof WindowEventMap> = [
      "mousemove",
      "mousedown",
      "wheel",
      "keydown",
      "touchstart",
    ];
    events.forEach((e) => window.addEventListener(e, resetIdle, { passive: true }));
    return () => {
      stopTour();
      if (idleTimer) window.clearTimeout(idleTimer);
      events.forEach((e) => window.removeEventListener(e, resetIdle));
    };
  }, [isMobile, reduce]);

  // Arrow-key navigation between pieces (treats wall as 4×2 grid).
  useEffect(() => {
    if (isMobile) return;
    const onKey = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT") return;
      const total = POSITIONS.length;
      let next = active;
      if (e.key === "ArrowRight") next = (active + 1) % total;
      else if (e.key === "ArrowLeft") next = (active - 1 + total) % total;
      else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        // Jump to the row 1↔ row 2 piece nearest the current x position.
        const cur = POSITIONS[active]!;
        const onTop = cur.y < 40;
        const candidates = POSITIONS.map((p, i) => ({ p, i })).filter(
          ({ p }) => (onTop ? p.y >= 40 : p.y < 40),
        );
        const nearest = candidates.reduce(
          (best, c) =>
            Math.abs(c.p.x - cur.x) < Math.abs(best.p.x - cur.x) ? c : best,
          candidates[0]!,
        );
        next = nearest.i;
      } else return;
      e.preventDefault();
      setActive(next);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, isMobile]);

  if (isMobile) return <AtriumStack active={active} setActive={setActive} />;

  const activePiece = CASE_STUDIES[active]!;

  return (
    <section className="relative h-[100svh] w-screen overflow-hidden bg-[var(--cream-0)]">
      {/* active piece title — locked below nav */}
      <div className="pointer-events-none absolute left-1/2 top-20 z-30 w-[min(680px,82vw)] -translate-x-1/2 text-center md:top-24">
        <motion.p
          key={activePiece.slug}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: CINEMA }}
          className="font-display text-[clamp(20px,2.2vw,30px)] font-light lowercase leading-tight tracking-[-0.02em] text-[var(--ink-0)]"
        >
          {activePiece.title}
          <span aria-hidden className="text-[var(--cinnamon)]">.</span>
        </motion.p>
      </div>

      {/* the wall */}
      <div className="absolute inset-0 z-10">
        {CASE_STUDIES.slice(0, POSITIONS.length).map((item, i) => (
          <Tile
            key={item.slug}
            item={item}
            pos={POSITIONS[i]!}
            index={i + 1}
            isActive={i === active}
            onEnter={() => setActive(i)}
          />
        ))}
      </div>

      {/* nav hints + tour indicator — bottom only */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-6 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-3)] md:bottom-10">
        <span><kbd className="not-italic text-[var(--ink-1)]">←</kbd> <kbd className="not-italic text-[var(--ink-1)]">→</kbd> step</span>
        <span aria-hidden className="block h-3 w-px bg-[var(--ink-4)]" />
        <span>hover · click to enter</span>
        {touring ? (
          <>
            <span aria-hidden className="block h-3 w-px bg-[var(--ink-4)]" />
            <span className="flex items-center gap-2 text-[var(--cinnamon)]">
              <span aria-hidden className="block h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--cinnamon)]" />
              touring
            </span>
          </>
        ) : null}
      </div>
    </section>
  );
}

function Tile({
  item,
  pos,
  index,
  isActive,
  onEnter,
}: {
  item: CaseStudy;
  pos: Pos;
  index: number;
  isActive: boolean;
  onEnter: () => void;
}) {
  return (
    <motion.div
      onMouseEnter={onEnter}
      onFocus={onEnter}
      animate={{ opacity: isActive ? 1 : 0.35 }}
      transition={{ duration: 0.6, ease: CINEMA }}
      className="absolute"
      style={{
        left: `${pos.x}vw`,
        top: `${pos.y}vh`,
        width: `${pos.w}vw`,
        height: `${pos.h}vh`,
      }}
    >
      <ViewLink
        href={`/work/${item.slug}`}
        data-cursor="link"
        data-cursor-label="enter →"
        className="group relative flex h-full w-full flex-col focus:outline-none"
      >
        {/* the framed piece */}
        <div
          className="relative h-[78%] w-full overflow-hidden border border-[var(--ink-4)]"
          style={{ background: item.tint }}
        >
          <CardArt capability={item.capability} active={isActive} />

          {/* hairline frame on hover */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-2 border border-[var(--ink-3)] opacity-0 transition-opacity duration-500 group-hover:opacity-30"
          />

          {/* active marker (cinnamon corner pip) */}
          <span
            aria-hidden
            className={
              "absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-[var(--cinnamon)] transition-opacity duration-500 " +
              (isActive ? "opacity-100" : "opacity-0")
            }
          />
        </div>

        {/* mini wall plate caption */}
        <div className="mt-3 flex items-baseline gap-3">
          <span className="font-display text-[clamp(18px,1.4vw,22px)] font-light tabular-nums leading-none tracking-[-0.04em] text-[var(--ink-0)]">
            {String(index).padStart(2, "0")}
          </span>
          <span aria-hidden className="block h-px flex-1 bg-[var(--ink-4)]" />
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[var(--ink-2)]">
            {item.capabilityLabel}
          </span>
        </div>
      </ViewLink>
    </motion.div>
  );
}

/** Mobile fallback — vertical snap pages, one piece per screen. */
function AtriumStack({
  active,
  setActive,
}: {
  active: number;
  setActive: (i: number) => void;
}) {
  return (
    <section
      className="hide-scrollbar h-[100svh] w-screen overflow-y-auto overflow-x-hidden bg-[var(--cream-0)]"
      style={{ scrollSnapType: "y mandatory" }}
      onScroll={(e) => {
        const idx = Math.round(e.currentTarget.scrollTop / window.innerHeight);
        if (idx !== active) setActive(idx);
      }}
    >
      {CASE_STUDIES.map((item, i) => (
        <article
          key={item.slug}
          className="relative flex h-[100svh] w-full snap-start flex-col items-center justify-center px-6"
          style={{ scrollSnapAlign: "start" }}
        >
          <ViewLink
            href={`/work/${item.slug}`}
            data-cursor="link"
            className="group relative flex w-full flex-col items-center"
          >
            <div
              className="relative aspect-[3/4] w-[80vw] max-w-[440px] overflow-hidden border border-[var(--ink-4)]"
              style={{ background: item.tint }}
            >
              <CardArt capability={item.capability} active />
            </div>
            <div className="mt-6 text-center">
              <span className="block h-px w-12 bg-[var(--ink-3)] mx-auto" />
              <p className="mt-3 font-display text-[clamp(20px,4vw,28px)] font-light lowercase leading-tight tracking-[-0.02em] text-[var(--ink-0)]">
                {item.title}
                <span aria-hidden className="text-[var(--cinnamon)]">.</span>
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">
                {String(i + 1).padStart(2, "0")} · {item.year} · {item.capabilityLabel}
              </p>
            </div>
          </ViewLink>
        </article>
      ))}
    </section>
  );
}
