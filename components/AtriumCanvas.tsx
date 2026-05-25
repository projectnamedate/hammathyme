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
const TOUR_IDLE_MS = 10000;
const TOUR_STEP_MS = 4500;

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

  // Auto-tour waits for a real idle pause so the wall feels calm, not kiosk-like.
  useEffect(() => {
    if (isMobile || reduce) return;
    let idleTimer: number | null = null;
    let tourInterval: number | null = null;
    const startTour = () => {
      setTouring(true);
      tourInterval = window.setInterval(() => {
        setActive((cur) => (cur + 1) % POSITIONS.length);
      }, TOUR_STEP_MS);
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
      idleTimer = window.setTimeout(startTour, TOUR_IDLE_MS);
    };
    idleTimer = window.setTimeout(startTour, TOUR_IDLE_MS);
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

  const activePiece = CASE_STUDIES[active]!;

  return (
    <>
      <section className="relative hidden h-[100svh] w-screen overflow-hidden md:block">
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
          <span>
            <kbd className="not-italic text-[var(--ink-1)]">←</kbd>{" "}
            <kbd className="not-italic text-[var(--ink-1)]">→</kbd> step
          </span>
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
      <div className="md:hidden">
        <AtriumStack active={active} setActive={setActive} />
      </div>
    </>
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
      animate={{ scale: isActive ? 1 : 0.985 }}
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
        className="group relative flex h-full w-full flex-col"
      >
        {/* the framed piece */}
        <div
          className={
            "relative h-[78%] w-full overflow-hidden border transition-[border-color,box-shadow] duration-500 " +
            (isActive
              ? "border-[var(--ink-4)] shadow-[0_14px_46px_rgba(31,7,7,0.10)]"
              : "border-[rgba(31,7,7,0.16)] shadow-[0_8px_24px_rgba(31,7,7,0.055)]")
          }
          style={{ background: item.tint }}
        >
          <CardArt capability={item.capability} active={isActive} />

          <span
            aria-hidden
            className={
              "pointer-events-none absolute inset-0 transition-opacity duration-500 " +
              (isActive ? "opacity-0" : "opacity-100")
            }
            style={{
              background:
                "linear-gradient(135deg, rgba(250, 238, 233, 0.18), rgba(242, 142, 134, 0.10) 52%, rgba(229, 191, 180, 0.18))",
            }}
          />

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
          <span
            className={
              "font-display text-[clamp(18px,1.4vw,22px)] font-light tabular-nums leading-none tracking-[-0.04em] transition-colors duration-500 " +
              (isActive ? "text-[var(--ink-0)]" : "text-[var(--ink-1)]")
            }
          >
            {String(index).padStart(2, "0")}
          </span>
          <span
            aria-hidden
            className={
              "block h-px flex-1 transition-colors duration-500 " +
              (isActive ? "bg-[var(--ink-4)]" : "bg-[rgba(242,142,134,0.42)]")
            }
          />
          <span
            className={
              "font-mono text-[9px] uppercase tracking-[0.22em] transition-colors duration-500 " +
              (isActive ? "text-[var(--ink-2)]" : "text-[var(--ink-2)]")
            }
          >
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
      className="hide-scrollbar h-[100svh] w-screen overflow-y-auto overflow-x-hidden"
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
