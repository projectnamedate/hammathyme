"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const DOT = 6;
const RING_BASE = 18;
const RING_HOVER = 84;

/**
 * Curator's cursor.
 *
 *   • a precise 6px ink dot pinned to the actual mouse position (mix-blend-difference)
 *   • a 1px-stroke bloodlust ring that lags slightly behind on a tuned spring
 *   • on interactive elements the ring expands into a labeled lozenge
 *     ("view →", "enter", "play", "read") — no magnetic snap (per research,
 *     snap reads template-y).
 *
 * Hidden on coarse-pointer / reduced-motion.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 380, damping: 38, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 380, damping: 38, mass: 0.6 });

  const lastTarget = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fineMq = window.matchMedia("(pointer: fine)").matches;
    if (reduce || !fineMq) return;
    setEnabled(true);
    document.body.dataset.cursorMounted = "1";
    return () => {
      delete document.body.dataset.cursorMounted;
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);

      const el = (e.target as HTMLElement | null) ?? null;
      const interactive =
        el?.closest<HTMLElement>('a, button, [role="button"], [data-cursor]') ?? null;

      if (interactive !== lastTarget.current) {
        lastTarget.current = interactive;
        if (interactive) {
          setHovering(true);
          setLabel(interactive.dataset.cursorLabel ?? "view →");
        } else {
          setHovering(false);
          setLabel(null);
        }
      }
    };

    const onLeave = () => {
      x.set(-200);
      y.set(-200);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* tiny dot — locked to true cursor */}
      <motion.div
        aria-hidden
        style={{ translateX: x, translateY: y, x: "-50%", y: "-50%" }}
        className="pointer-events-none fixed left-0 top-0 z-[60]"
      >
        <span
          className="block rounded-full bg-[var(--ink-0)] mix-blend-difference"
          style={{ width: DOT, height: DOT }}
        />
      </motion.div>

      {/* ring → lozenge — spring-trailed */}
      <motion.div
        aria-hidden
        style={{ translateX: ringX, translateY: ringY, x: "-50%", y: "-50%" }}
        className="pointer-events-none fixed left-0 top-0 z-[59] flex items-center justify-center"
      >
        <motion.div
          initial={false}
          animate={{
            width: hovering ? RING_HOVER : RING_BASE,
            height: hovering ? 28 : RING_BASE,
            borderRadius: hovering ? 999 : 999,
            backgroundColor: hovering ? "var(--ink-0)" : "rgba(0,0,0,0)",
            color: hovering ? "var(--cream-0)" : "var(--bloodlust)",
            borderColor: hovering ? "var(--ink-0)" : "var(--bloodlust)",
            paddingInline: hovering ? 14 : 0,
          }}
          transition={{ duration: 0.32, ease: [0.65, 0, 0.35, 1] }}
          className="flex items-center justify-center whitespace-nowrap border font-mono text-[10px] uppercase tracking-[0.22em]"
        >
          {hovering && label ? label : null}
        </motion.div>
      </motion.div>
    </>
  );
}
