"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

/**
 * Tap the cinnamon period in the wordmark → ephemeral hermes-agent style
 * status bar slides in at the bottom for ~3s. The caduceus glyph (☤) is
 * the Nous Hermes Agent's CLI signature — see InspectorOverlay for the
 * caduceus-vs-asclepius gag.
 *
 * Listens for the `hammer:hermes` custom event dispatched by Wordmark /
 * HeroWordmark when the period is clicked.
 */
export function HermesStatusBar() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onHermes() {
      setOpen(true);
    }
    window.addEventListener("hammer:hermes", onHermes);
    return () => window.removeEventListener("hammer:hermes", onHermes);
  }, []);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => setOpen(false), 3500);
    return () => window.clearTimeout(id);
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="hermes-status"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 14 }}
          transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
          className="pointer-events-none fixed bottom-4 left-1/2 z-[55] flex w-[min(720px,92vw)] -translate-x-1/2 items-center gap-3 border border-[var(--ink-3)] bg-[var(--cream-0)] px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-1)] shadow-[0_8px_24px_-12px_rgba(42,10,10,0.18)]"
          aria-hidden
        >
          <span className="font-display text-[15px] not-italic leading-none text-[var(--cinnamon)]">
            ☤
          </span>
          <Sep />
          <span>jeff-hammer-405b</span>
          <Sep />
          <span>2,478 / ∞ words</span>
          <Sep />
          <span className="flex items-center gap-2">
            <span className="text-[var(--cinnamon)]">[██████████]</span>
            <span>producing</span>
          </span>
          <Sep />
          <span>$0.00</span>
          <Sep />
          <span>since 2015</span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Sep() {
  return <span aria-hidden className="block h-3 w-px bg-[var(--ink-4)]" />;
}
