"use client";

import { usePathname } from "next/navigation";
import { findRoom } from "@/lib/rooms";
import { motion, useReducedMotion } from "motion/react";

/**
 * Top-right editorial chrome — Instrument Serif italic numeral above a mono
 * room name. Crossfades on route change.
 */
export function RoomNumeral() {
  const path = usePathname();
  const room = findRoom(path);
  const reduce = useReducedMotion();

  if (path === "/work") return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-6 top-6 z-40 text-right md:right-12 md:top-12"
      style={{ viewTransitionName: "room-numeral" }}
    >
      <motion.div
        key={room.numeral}
        initial={reduce ? false : { opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.65, 0, 0.35, 1] }}
        className="font-serif italic font-normal text-[14px] leading-none tracking-[0.18em] text-[var(--ink-1)]"
      >
        {room.numeral}.
      </motion.div>
      <motion.div
        key={room.name}
        initial={reduce ? false : { opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05, ease: [0.65, 0, 0.35, 1] }}
        className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]"
      >
        {room.name}
      </motion.div>
    </div>
  );
}
