"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { findRoom } from "@/lib/rooms";

/**
 * Giant italic Instrument Serif room numeral etched as a background mark.
 * One per route — fades and crossfades with route transitions.
 *
 * Sits behind everything (z-0). Visitors feel it before they read it.
 */
export function RoomWatermark() {
  const path = usePathname();
  const room = findRoom(path);
  const reduce = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 flex items-center justify-end overflow-hidden"
      style={{ viewTransitionName: "room-watermark" }}
    >
      <motion.span
        key={room.numeral}
        initial={reduce ? false : { opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
        className="select-none font-serif italic font-normal leading-none text-[var(--ink-1)]"
        style={{
          fontSize: "clamp(40vh, 56vh, 80vh)",
          opacity: 0.05,
          letterSpacing: "-0.04em",
          marginRight: "-0.06em",
        }}
      >
        {room.numeral}.
      </motion.span>
    </motion.div>
  );
}
