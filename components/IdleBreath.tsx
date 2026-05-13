"use client";

import { useEffect } from "react";

/**
 * Idle micro-motion on the wordmark.
 *
 *   • CSS animation (wordmark-breath) on every `.kw` element runs continuously
 *     when the body has [data-idle="1"]. It scales the whole mark subtly so
 *     the approved per-letter gaps stay intact.
 *   • Once per minute, the cinnamon period in `.kw .dot` redraws as a single
 *     stroke (clip-path animation).
 *
 * The component itself only sets / unsets the `[data-idle]` attribute based on
 * user interaction, so the animations are pure CSS once started.
 */
export function IdleBreath() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: number | null = null;
    const idleAfterMs = 6000;

    const startIdle = () => {
      document.body.dataset.idle = "1";
    };
    const stopIdle = () => {
      delete document.body.dataset.idle;
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(startIdle, idleAfterMs);
    };

    // start the idle timer immediately
    timer = window.setTimeout(startIdle, idleAfterMs);

    const events: Array<keyof WindowEventMap> = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "wheel",
      "scroll",
    ];
    events.forEach((e) => window.addEventListener(e, stopIdle, { passive: true }));

    return () => {
      if (timer) window.clearTimeout(timer);
      delete document.body.dataset.idle;
      events.forEach((e) => window.removeEventListener(e, stopIdle));
    };
  }, []);

  return null;
}
