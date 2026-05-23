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
      className="pointer-events-none fixed inset-0 z-0 hidden items-center justify-end overflow-hidden md:flex"
      style={{ viewTransitionName: "room-watermark" }}
    >
      <motion.svg
        aria-hidden="true"
        focusable="false"
        key={room.numeral}
        role="presentation"
        initial={reduce ? false : { opacity: 0, x: 12 }}
        animate={{ opacity: 0.06, x: 0 }}
        transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
        className="h-full w-full overflow-visible text-[var(--ink-0)]"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <text
          className="select-none fill-current font-serif italic font-normal leading-none"
          dominantBaseline="central"
          dx="0.06em"
          textAnchor="end"
          x="100%"
          y="50%"
          style={{
            fontSize: "clamp(40vh, 56vh, 80vh)",
            letterSpacing: "-0.04em",
          }}
        >
          {room.numeral}.
        </text>
      </motion.svg>
    </motion.div>
  );
}
