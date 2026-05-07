"use client";

import { usePathname } from "next/navigation";
import { findRoom, runningHead } from "@/lib/rooms";

type Props = { piece?: string | number };

/**
 * Editorial running-head: `[ JH / II / 03 ]` — fixed top-left.
 * Reads the current room from the pathname; piece number can be passed by a route.
 */
export function RunningHead({ piece }: Props) {
  const path = usePathname();
  const room = findRoom(path);
  if (path === "/work") return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-6 top-6 z-40 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--bloodlust)] opacity-60 md:left-12 md:top-12"
      style={{ viewTransitionName: "running-head" }}
    >
      {runningHead(room, piece)}
    </div>
  );
}
