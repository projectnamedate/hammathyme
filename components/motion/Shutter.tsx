"use client";

import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const SHUTTER = [0.85, 0, 0.15, 1] as const;

/**
 * Page-level radial shutter. On route change, a cinnamon disc expands from
 * center to fully cover the viewport, then contracts revealing the new page.
 */
export function PageShutter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<"idle" | "in">("idle");

  useEffect(() => {
    if (reduce) return;
    setPhase("in");
    const t = setTimeout(() => setPhase("idle"), 520);
    return () => clearTimeout(t);
  }, [pathname, reduce]);

  return (
    <>
      {children}
      <AnimatePresence>
        {phase === "in" && !reduce ? (
          <motion.div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[80] flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.18, delay: 0.32 } }}
          >
            <motion.span
              className="block rounded-full bg-[var(--cinnamon)]"
              initial={{ width: 0, height: 0 }}
              animate={{ width: "260vmax", height: "260vmax" }}
              transition={{ duration: 0.48, ease: SHUTTER }}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
