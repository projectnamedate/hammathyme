"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Lobster } from "./Lobster";

/**
 * printer's marks overlay — press `?` to toggle. shows the 12-col grid,
 * the .kw kerning markers on every wordmark, color tokens labelled in the
 * corners, and a small openclaw lobster pip (the brand wink for AI engineers).
 *
 * the overlay is *museum-coded*, not gamer-coded — closes hard with the atelier
 * metaphor. press `?` again or `esc` to dismiss.
 */
export function InspectorOverlay() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [vw, setVw] = useState(0);

  useEffect(() => {
    setVw(window.innerWidth);
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Don't fire while typing in inputs.
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || target?.isContentEditable) return;

      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // 12-col grid math
  const COLS = 12;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="inspector"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
          className="pointer-events-none fixed inset-0 z-[60]"
          aria-hidden
        >
          {/* 12-col grid */}
          <div className="absolute inset-0 px-6 md:px-24">
            <div className="relative h-full w-full">
              {Array.from({ length: COLS + 1 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute top-0 bottom-0 w-px"
                  style={{
                    left: `${(i / COLS) * 100}%`,
                    background: "var(--cinnamon)",
                    opacity: 0.18,
                  }}
                />
              ))}
              {/* baseline at common heights */}
              {[80, 96, 144].map((y) => (
                <span
                  key={y}
                  className="absolute left-0 right-0 h-px"
                  style={{ top: y, background: "var(--cinnamon)", opacity: 0.18 }}
                />
              ))}
            </div>
          </div>

          {/* .kw kerning markers — outline every wordmark span */}
          <KerningMarkers />

          {/* corner labels */}
          <div className="absolute left-6 top-6 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--cinnamon)] md:left-24 md:top-24">
            inspector · grid 12 col
          </div>
          <div className="absolute right-6 top-6 text-right font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--cinnamon)] md:right-24 md:top-24">
            ?  toggle  ·  esc  close
          </div>

          {/* color tokens — bottom left */}
          <div className="absolute left-6 bottom-6 flex flex-col gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)] md:left-24 md:bottom-12">
            {[
              { token: "cream-0", v: "#FAEEE9" },
              { token: "ink-0",   v: "#2a0a0a" },
              { token: "bloodlust", v: "#5a1c1c" },
              { token: "cinnamon",  v: "#F28E86" },
            ].map((c) => (
              <div key={c.token} className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="block h-3 w-3 border border-[var(--ink-3)]"
                  style={{ background: c.v }}
                />
                <span>--{c.token}</span>
                <span className="text-[var(--ink-3)]">{c.v}</span>
              </div>
            ))}
          </div>

          {/* lobster pip + caduceus gag — bottom right */}
          <div className="absolute right-6 bottom-6 flex flex-col items-end gap-2 md:right-24 md:bottom-12">
            <a
              href="https://github.com/NousResearch/hermes-agent/issues/9565"
              target="_blank"
              rel="noreferrer"
              className="pointer-events-auto flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)] hover:text-[var(--cinnamon)]"
            >
              <span className="text-[14px] leading-none text-[var(--cinnamon)]" aria-hidden>☤</span>
              <span>caduceus, not ⚕ — issue #9565</span>
            </a>
            <div className="flex items-center gap-3">
              <Lobster className="h-4 w-4 text-[var(--cinnamon)]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">
                openclaw · 347k ★
              </span>
            </div>
          </div>

          {/* viewport readout — top center */}
          <div className="absolute left-1/2 top-2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-3)]">
            {vw}px · {COLS}-col grid
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function KerningMarkers() {
  const [rects, setRects] = useState<DOMRect[]>([]);

  useEffect(() => {
    function measure() {
      const spans = Array.from(document.querySelectorAll(".kw")) as HTMLElement[];
      setRects(spans.map((el) => el.getBoundingClientRect()));
    }
    measure();
    const id = window.setTimeout(measure, 50);
    window.addEventListener("resize", measure);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <>
      {rects.map((r, i) => (
        <span
          key={i}
          className="absolute border border-[var(--cinnamon)]"
          style={{
            left: r.left,
            top: r.top,
            width: r.width,
            height: r.height,
            opacity: 0.5,
          }}
        />
      ))}
    </>
  );
}
