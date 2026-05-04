"use client";

import Link from "next/link";
import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CASE_STUDIES } from "@/lib/works";

const CARD_WIDTH_VW = 64;

export function HorizontalGallery() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const total = CASE_STUDIES.length;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    let lenis: Lenis | null = null;
    let rafId = 0;

    if (!reduce) {
      lenis = new Lenis({
        wrapper: wrap,
        content: trackRef.current!,
        orientation: "horizontal",
        gestureOrientation: "both",
        smoothWheel: true,
        wheelMultiplier: 1.1,
        touchMultiplier: 2,
        lerp: 0.1,
        duration: 1.2,
      });
      const raf = (time: number) => {
        lenis!.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    }

    const onScroll = () => {
      const cardW = window.innerWidth * (CARD_WIDTH_VW / 100);
      const idx = Math.round(wrap.scrollLeft / cardW);
      setActive(Math.min(total - 1, Math.max(0, idx)));
    };
    wrap.addEventListener("scroll", onScroll, { passive: true });

    const onKey = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT") return;
      const cardW = window.innerWidth * (CARD_WIDTH_VW / 100);
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        if (lenis) lenis.scrollTo(wrap.scrollLeft + cardW);
        else wrap.scrollBy({ left: cardW, behavior: "smooth" });
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        if (lenis) lenis.scrollTo(wrap.scrollLeft - cardW);
        else wrap.scrollBy({ left: -cardW, behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(rafId);
      lenis?.destroy();
      wrap.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, [reduce, total]);

  return (
    <section className="relative h-[100svh] w-screen overflow-hidden bg-[var(--cream-0)]">
      {/* Frame counter */}
      <div className="pointer-events-none absolute right-6 top-6 z-30 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)] md:right-12 md:top-12">
        <span className="text-[var(--cinnamon)] tabular-nums">{String(active + 1).padStart(3, "0")}</span>
        <span className="mx-2 text-[var(--ink-3)]">/</span>
        <span className="tabular-nums">{String(total).padStart(3, "0")}</span>
      </div>

      {/* Caption / current title */}
      <motion.div
        key={active}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.65, 0, 0.35, 1] }}
        className="pointer-events-none absolute bottom-6 left-6 z-30 md:bottom-12 md:left-12"
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--cinnamon)]">
          {CASE_STUDIES[active]?.capabilityLabel}
        </div>
        <div className="mt-2 max-w-[28ch] font-display text-[clamp(20px,2vw,28px)] font-light lowercase leading-tight tracking-[-0.02em] text-[var(--ink-1)]">
          {CASE_STUDIES[active]?.title}
        </div>
      </motion.div>

      {/* nav hints */}
      <div className="pointer-events-none absolute bottom-6 right-6 z-30 hidden font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-3)] md:block md:bottom-12 md:right-12">
        ← drag · scroll · →
      </div>

      {/* gallery track */}
      <div
        ref={wrapRef}
        className="hide-scrollbar h-full w-full overflow-x-auto overflow-y-hidden"
        tabIndex={0}
        aria-label="case study gallery"
      >
        <div ref={trackRef} className="flex h-full pl-[18vw] pr-[18vw]" style={{ width: "max-content" }}>
          {CASE_STUDIES.map((item, i) => (
            <GalleryCard key={item.slug} item={item} index={i} isActive={i === active} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryCard({
  item,
  index,
  isActive,
}: {
  item: (typeof CASE_STUDIES)[number];
  index: number;
  isActive: boolean;
}) {
  return (
    <Link
      href={`/work/${item.slug}`}
      data-cursor="link"
      data-cursor-label="enter"
      className="group relative mr-[3vw] flex h-full shrink-0 flex-col"
      style={{ width: `${CARD_WIDTH_VW}vw` }}
    >
      <motion.div
        className="relative h-full w-full overflow-hidden"
        style={{ background: item.tint }}
        animate={{
          scale: isActive ? 1 : 0.94,
          opacity: isActive ? 1 : 0.55,
        }}
        transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
      >
        {/* index numeral, gigantic, low-opacity */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-[5%] -left-[3%] font-display font-light tabular-nums leading-none text-[var(--ink-0)] opacity-[0.05]"
          style={{ fontSize: "min(58vh,38vw)" }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* meta block */}
        <div className="absolute left-8 top-8 flex flex-col gap-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-0)] mix-blend-difference">
          <span>{item.year}</span>
          <span className="text-[var(--cinnamon)]">{item.capabilityLabel}</span>
        </div>

        {/* title */}
        <div className="absolute bottom-12 left-8 right-8">
          <h3 className="font-display text-[clamp(36px,5vw,80px)] font-light lowercase leading-[0.92] tracking-[-0.04em] text-[var(--ink-0)] mix-blend-difference">
            {item.title}
          </h3>
          <p className="mt-4 max-w-[36ch] font-display font-light text-[var(--fs-3)] leading-relaxed text-[var(--ink-1)] mix-blend-difference">
            {item.summary}
          </p>
          <div className="mt-6 inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-1)] mix-blend-difference">
            <span className="h-px w-8 bg-current transition-[width] duration-500 group-hover:w-16" />
            enter case study
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
