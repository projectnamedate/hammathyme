"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

const SHUTTER = [0.85, 0, 0.15, 1] as const;
const SESSION_KEY = "hf-entry-seen";

/**
 * First-paint cinematic curtain.
 *   1. Cinnamon disc fills the screen.
 *   2. Disc collapses outward in 700ms revealing the cream room behind.
 *   3. Component unmounts.
 *
 * Mounts once per session via sessionStorage so internal nav doesn't replay it.
 * Reduced-motion: skip entirely.
 */
export function EntryCurtain() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (reduce) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 768px), (pointer: coarse)").matches) return;
    if (sessionStorage.getItem(SESSION_KEY) === "1") return;
    setOpen(true);
    // mark immediately so a quick navigation doesn't refire
    sessionStorage.setItem(SESSION_KEY, "1");
    const t = setTimeout(() => setOpen(false), 800);
    return () => clearTimeout(t);
  }, [reduce]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-[var(--cream-0)]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.12, delay: 0.6 } }}
        >
          <motion.span
            className="block origin-center rounded-full bg-[var(--cinnamon)]"
            initial={{ scale: 1 }}
            animate={{ scale: 0 }}
            style={{ width: "260vmax", height: "260vmax" }}
            transition={{ duration: 0.7, ease: SHUTTER }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
