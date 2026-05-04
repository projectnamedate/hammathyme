"use client";

import Link from "next/link";
import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

export type Scene = { id: string; label: string; node: React.ReactNode };

/**
 * Horizontal scene-paged container for case studies.
 * Each scene is a single 100vw × 100vh frame. Scroll-snap mandatory; arrow keys
 * step. Frame counter tracks position. Lenis horizontal handles wheel-to-x.
 */
export function SceneStack({
  scenes,
  back,
  caseTitle,
}: {
  scenes: Scene[];
  back?: { href: string; label: string };
  caseTitle: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || typeof window === "undefined") return;

    let lenis: Lenis | null = null;
    let rafId = 0;
    if (!reduce) {
      lenis = new Lenis({
        wrapper: wrap,
        content: trackRef.current!,
        orientation: "horizontal",
        gestureOrientation: "both",
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        lerp: 0.1,
        duration: 1.0,
      });
      const raf = (t: number) => {
        lenis!.raf(t);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    }

    const onScroll = () => {
      const idx = Math.round(wrap.scrollLeft / window.innerWidth);
      setActive(Math.min(scenes.length - 1, Math.max(0, idx)));
    };
    wrap.addEventListener("scroll", onScroll, { passive: true });

    const onKey = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT") return;
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        const target = (active + 1) * window.innerWidth;
        if (lenis) lenis.scrollTo(target);
        else wrap.scrollTo({ left: target, behavior: "smooth" });
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        const target = (active - 1) * window.innerWidth;
        if (lenis) lenis.scrollTo(target);
        else wrap.scrollTo({ left: target, behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(rafId);
      lenis?.destroy();
      wrap.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, [active, reduce, scenes.length]);

  return (
    <section className="relative h-[100svh] w-screen overflow-hidden bg-[var(--cream-0)]">
      {/* persistent meta */}
      <div className="pointer-events-none absolute left-6 top-20 z-30 max-w-[42ch] font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)] md:left-12 md:top-24">
        <div className="text-[var(--cinnamon)]">case study</div>
        <div className="mt-1 text-[var(--ink-1)]">{caseTitle}</div>
      </div>

      <div className="pointer-events-none absolute right-6 top-20 z-30 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)] md:right-12 md:top-24">
        <div>scene · <span className="tabular-nums text-[var(--cinnamon)]">{String(active + 1).padStart(2, "0")}</span></div>
        <div className="mt-1 text-[var(--ink-3)]">/ {String(scenes.length).padStart(2, "0")}</div>
      </div>

      {/* scene label, animated on change */}
      <motion.div
        key={active}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.65, 0, 0.35, 1] }}
        className="pointer-events-none absolute bottom-6 left-6 z-30 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)] md:bottom-12 md:left-12"
      >
        {scenes[active]?.label}
      </motion.div>

      <div className="pointer-events-none absolute bottom-6 right-6 z-30 hidden font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-3)] md:block md:bottom-12 md:right-12">
        ← scenes · → scroll
      </div>

      {back ? (
        <Link
          href={back.href}
          data-cursor="link"
          className="absolute left-6 bottom-6 z-30 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-1)] underline decoration-[var(--ink-3)] underline-offset-4 transition-colors hover:text-[var(--cinnamon)] md:left-12 md:bottom-24 md:left-12"
        >
          ← {back.label}
        </Link>
      ) : null}

      {/* track */}
      <div
        ref={wrapRef}
        className="hide-scrollbar h-full w-full overflow-x-auto overflow-y-hidden"
        style={{ scrollSnapType: reduce ? "none" : "x mandatory" }}
        tabIndex={0}
      >
        <div ref={trackRef} className="flex h-full" style={{ width: `${scenes.length * 100}vw` }}>
          {scenes.map((s) => (
            <div
              key={s.id}
              className="relative h-full w-screen shrink-0"
              style={{ scrollSnapAlign: "start" }}
            >
              {s.node}
            </div>
          ))}
        </div>
      </div>

      {/* progress bar */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-px bg-[var(--ink-4)]">
        <motion.div
          className="h-full bg-[var(--cinnamon)]"
          animate={{
            width: `${((active + 1) / scenes.length) * 100}%`,
          }}
          transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
        />
      </div>
    </section>
  );
}
