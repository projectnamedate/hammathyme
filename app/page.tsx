"use client";

import { motion, useReducedMotion } from "motion/react";
import { HeroWordmark } from "@/components/HeroWordmark";
import { ViewLink } from "@/components/ViewLink";

const CINEMA = [0.65, 0, 0.35, 1] as const;

export default function EntryHall() {
  const reduce = useReducedMotion();
  return (
    <main className="relative flex h-[100svh] w-screen items-center justify-center overflow-hidden bg-[var(--cream-0)]">
      {/* center stack */}
      <div className="flex flex-col items-center gap-10">
        <HeroWordmark ariaLabel="hammer · ai producer" baseDelay={0.55} />

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.5, ease: CINEMA }}
          className="flex flex-col items-center gap-3"
        >
          <span aria-hidden className="block h-px w-10 bg-[var(--ink-3)]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--ink-2)]">
            ai producer
          </span>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 2.0, ease: CINEMA }}
        >
          <ViewLink
            href="/work"
            data-cursor="link"
            data-cursor-label="enter →"
            className="group inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--ink-1)] transition-colors hover:text-[var(--cinnamon)]"
          >
            <span className="block h-px w-12 bg-[var(--ink-2)] transition-[width,background] duration-500 group-hover:w-20 group-hover:bg-[var(--cinnamon)]" />
            enter the gallery
          </ViewLink>
        </motion.div>
      </div>

      {/* bottom kicker */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 2.0, ease: CINEMA }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-3)] md:bottom-12"
      >
        eight rooms · drag to walk through
      </motion.div>
    </main>
  );
}
