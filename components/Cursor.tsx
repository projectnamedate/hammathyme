"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const DOT = 6;
const RING_BASE = 18;
const RING_HOVER = 84;
const RING_SMALL = 30;

/**
 * Curator's cursor.
 *
 *   • a precise 6px ink dot pinned to the actual mouse position (mix-blend-difference)
 *   • a 1px-stroke bloodlust ring that lags slightly behind on a tuned spring
 *   • on interactive elements the ring expands into a labeled lozenge
 *     ("view →", "enter", "play", "read") — no magnetic snap (per research,
 *     snap reads template-y).
 *   • data-cursor="dot" keeps a small ink ring instead, for controls packed too tight for
 *     the lozenge to leave their neighbours readable.
 *   • inside a dark-theme figure the dot and ring turn cream, so the pointer never vanishes.
 *
 * Hidden on coarse-pointer / reduced-motion.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [small, setSmall] = useState(false);
  const [onDark, setOnDark] = useState(false);

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

    // Inside a dark-theme figure the ink dot and ring would vanish, so both turn cream there;
    // checked on every move and on a theme change, not only when the target changes.
    const darkAt = (el: Element | null) => el?.closest("[data-theme]")?.getAttribute("data-theme") === "dark";

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);

      const el = (e.target as HTMLElement | null) ?? null;
      setOnDark(darkAt(el));
      const interactive =
        el?.closest<HTMLElement>('a, button, [role="button"], [data-cursor]') ?? null;

      if (interactive !== lastTarget.current) {
        lastTarget.current = interactive;
        if (interactive) {
          const dot = interactive.dataset.cursor === "dot";
          setHovering(true);
          setSmall(dot);
          setLabel(dot ? null : (interactive.dataset.cursorLabel ?? "view →"));
        } else {
          setHovering(false);
          setSmall(false);
          setLabel(null);
        }
      }
    };

    const onLeave = () => {
      x.set(-200);
      y.set(-200);
    };

    // The figure flips its theme a frame after the media query does.
    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => requestAnimationFrame(() => setOnDark(darkAt(document.elementFromPoint(x.get(), y.get()))));

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    scheme.addEventListener("change", onScheme);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      scheme.removeEventListener("change", onScheme);
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
          className={`block rounded-full mix-blend-difference ${onDark ? "bg-[var(--cream-0)]" : "bg-[var(--ink-0)]"}`}
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
            width: hovering ? (small ? RING_SMALL : RING_HOVER) : RING_BASE,
            height: hovering ? (small ? RING_SMALL : 28) : RING_BASE,
            borderRadius: 999,
            backgroundColor: hovering && !small ? "var(--ink-0)" : "rgba(0,0,0,0)",
            color: hovering || onDark ? "var(--cream-0)" : "var(--bloodlust)",
            borderColor: onDark && (small || !hovering) ? "var(--cream-0)" : hovering ? "var(--ink-0)" : "var(--bloodlust)",
            paddingInline: hovering && !small ? 14 : 0,
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
