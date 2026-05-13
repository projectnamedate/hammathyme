"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Wordmark } from "@/components/Wordmark";
import { WallPlate } from "@/components/WallPlate";
import { Figure } from "@/components/Figure";
import { Plinth } from "@/components/Plinth";
import { FadeIn } from "@/components/motion/FadeIn";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";
import { SplitText } from "@/components/motion/SplitText";
import { MaskReveal } from "@/components/motion/MaskReveal";

const COLORS = [
  { token: "--cream-0", role: "page" },
  { token: "--cream-1", role: "card" },
  { token: "--cream-2", role: "deep cream" },
  { token: "--ink-0", role: "primary text" },
  { token: "--ink-1", role: "secondary" },
  { token: "--ink-2", role: "muted" },
  { token: "--ink-3", role: "subtle" },
  { token: "--ink-4", role: "hairline" },
  { token: "--cinnamon", role: "live accent" },
  { token: "--cinnamon-h", role: "hover" },
  { token: "--bloodlust", role: "deep accent" },
];

const TYPE_SCALE = [
  { px: 12, label: "fs-1 · caption" },
  { px: 14, label: "fs-2 · small body" },
  { px: 16, label: "fs-3 · body" },
  { px: 20, label: "fs-4 · lede" },
  { px: 24, label: "fs-5 · h5" },
  { px: 32, label: "fs-6 · h4" },
  { px: 48, label: "fs-7 · h3" },
  { px: 72, label: "fs-8 · h2" },
  { px: 112, label: "fs-9 · h1" },
];

const EASINGS = [
  { name: "cinema", value: "cubic-bezier(0.65, 0, 0.35, 1)" },
  { name: "shutter", value: "cubic-bezier(0.85, 0, 0.15, 1)" },
  { name: "soft", value: "cubic-bezier(0.25, 0.1, 0.25, 1)" },
  { name: "spring", value: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
];

const DURATIONS = [
  { name: "instant", ms: 100 },
  { name: "quick", ms: 200 },
  { name: "standard", ms: 400 },
  { name: "slow", ms: 600 },
  { name: "cinematic", ms: 1000 },
];

function Specimen({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border border-[var(--ink-4)] bg-[var(--cream-1)]/40 p-6">
      <div className="mb-6 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">{label}</span>
        <span aria-hidden className="block h-px w-8 bg-[var(--ink-3)]" />
      </div>
      {children}
    </div>
  );
}

export default function DesignSystem() {
  const [splitKey, setSplitKey] = useState(0);
  const [maskKey, setMaskKey] = useState(0);
  const [staggerKey, setStaggerKey] = useState(0);

  return (
    <main className="relative w-screen px-6 pt-32 pb-32 md:px-24 md:pt-40">
      <header className="mb-32 max-w-[60ch]">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--cinnamon)]">
          internal · specimen plates
        </p>
        <h1 className="mt-6 font-display text-[clamp(48px,8vw,128px)] font-light lowercase leading-[0.88] tracking-[-0.04em] text-[var(--ink-0)]">
          design <em className="font-serif italic font-normal text-[var(--bloodlust)]">system</em>.
        </h1>
        <p className="mt-8 font-display font-light text-[var(--fs-4)] leading-relaxed text-[var(--ink-1)]">
          every brand token, every component, every motion primitive on one wall. compiled live from BRAND_GUIDE.md.
        </p>
      </header>

      {/* 01 wordmark */}
      <Section number="01" title="wordmark">
        <div className="flex flex-col gap-8 overflow-hidden border border-[var(--ink-4)] bg-[var(--cream-1)]/40 p-6 md:p-8">
          <Wordmark size="hero" className="!text-[clamp(72px,18vw,260px)]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-2)]">
            outfit black · per-letter cold-open construction · website-aligned period
          </span>
        </div>
      </Section>

      {/* 02 color */}
      <Section number="02" title="color">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {COLORS.map((c) => (
            <div key={c.token} className="border border-[var(--ink-4)]">
              <div className="aspect-[4/3] w-full" style={{ background: `var(${c.token})` }} aria-hidden />
              <div className="border-t border-[var(--ink-4)] p-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-0)]">{c.token}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-3)]">{c.role}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 03 type scale */}
      <Section number="03" title="type scale">
        <ul className="space-y-3">
          {TYPE_SCALE.map((t) => (
            <li
              key={t.px}
              className="flex min-w-0 flex-col gap-2 border-b border-[var(--ink-4)] pb-3 [container-type:inline-size] sm:flex-row sm:items-baseline sm:gap-8"
            >
              <span className="w-auto shrink-0 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ink-3)] sm:w-24">{t.label}</span>
              <span
                className="block min-w-0 font-display lowercase tracking-[-0.04em] text-[var(--ink-0)]"
                style={{ fontSize: `min(${t.px}px, 24cqw)`, fontWeight: 700, lineHeight: 1 }}
              >
                hammer · {t.px}px
              </span>
            </li>
          ))}
        </ul>
      </Section>

      {/* 04 type families */}
      <Section number="04" title="type families">
        <div className="grid gap-12 md:grid-cols-3">
          <Specimen label="display · outfit">
            <div className="font-display text-[64px] font-light lowercase leading-none tracking-[-0.04em] text-[var(--ink-0)]">aa bb cc</div>
            <div className="mt-3 font-display font-light text-[16px] leading-relaxed text-[var(--ink-1)]">the quick brown fox jumps over the lazy dog · 0123456789</div>
          </Specimen>
          <Specimen label="body · geist">
            <div className="text-[48px] font-medium leading-none tracking-[-0.025em] text-[var(--ink-0)]">Aa Bb Cc</div>
            <div className="mt-3 text-[16px] leading-relaxed text-[var(--ink-1)]">The quick brown fox jumps over the lazy dog. 0123456789.</div>
          </Specimen>
          <Specimen label="mono · geist mono">
            <div className="font-mono text-[32px] leading-none tracking-[0] text-[var(--ink-0)]">Aa Bb Cc</div>
            <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-1)]">the quick brown fox · 0123456789</div>
          </Specimen>
        </div>
        <div className="mt-12 border-t border-[var(--ink-4)] pt-6">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">italic motif · instrument serif</div>
          <p className="font-display text-[clamp(28px,4vw,56px)] font-light lowercase leading-tight tracking-[-0.04em] text-[var(--ink-0)]">
            a producer who treats <em className="font-serif italic font-normal text-[var(--bloodlust)]">machines</em> like crew.
          </p>
        </div>
      </Section>

      {/* 05 motion easings */}
      <Section number="05" title="motion · easings">
        <div className="grid gap-6 md:grid-cols-4">
          {EASINGS.map((e) => (
            <div key={e.name} className="border border-[var(--ink-4)] p-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">{e.name}</div>
              <div className="mt-1 break-all font-mono text-[10px] text-[var(--ink-3)]">{e.value}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* 06 duration scale */}
      <Section number="06" title="motion · durations">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
          {DURATIONS.map((d) => (
            <div key={d.name} className="border border-[var(--ink-4)] p-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">{d.name}</div>
              <div className="mt-2 font-display text-[40px] font-light leading-none tracking-[-0.04em] text-[var(--ink-0)] tabular-nums">
                {d.ms}<span className="font-serif italic text-[var(--cinnamon)] text-[24px]">ms</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 07 motion primitives */}
      <Section number="07" title="motion · primitives">
        <div className="grid gap-6 md:grid-cols-2">
          <Specimen label="<FadeIn>">
            <FadeIn>
              <p className="font-display text-[var(--fs-5)] font-light lowercase tracking-[-0.02em] text-[var(--ink-0)]">fade in from below.</p>
            </FadeIn>
          </Specimen>
          <Specimen label="<ScrollReveal>">
            <ScrollReveal>
              <p className="font-display text-[var(--fs-5)] font-light lowercase tracking-[-0.02em] text-[var(--ink-0)]">reveals on viewport entry.</p>
            </ScrollReveal>
          </Specimen>
          <Specimen label="<SplitText>">
            <button
              onClick={() => setSplitKey((k) => k + 1)}
              data-cursor="link"
              data-cursor-label="replay"
              className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--cinnamon)]"
            >
              ↻ replay
            </button>
            <div key={splitKey}>
              <SplitText
                as="h3"
                mode="mask"
                className="font-display text-[clamp(28px,4vw,56px)] font-light lowercase leading-none tracking-[-0.04em] text-[var(--ink-0)]"
              >
                letter-by-letter mask reveal.
              </SplitText>
            </div>
          </Specimen>
          <Specimen label="<MaskReveal>">
            <button
              onClick={() => setMaskKey((k) => k + 1)}
              data-cursor="link"
              data-cursor-label="replay"
              className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--cinnamon)]"
            >
              ↻ replay
            </button>
            <div key={maskKey}>
              <MaskReveal direction="up">
                <div className="aspect-video w-full bg-[var(--cinnamon)]" />
              </MaskReveal>
            </div>
          </Specimen>
          <Specimen label="<StaggerChildren>">
            <button
              onClick={() => setStaggerKey((k) => k + 1)}
              data-cursor="link"
              data-cursor-label="replay"
              className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--cinnamon)]"
            >
              ↻ replay
            </button>
            <div key={staggerKey}>
              <StaggerChildren className="space-y-2">
                {[1, 2, 3, 4].map((n) => (
                  <StaggerItem key={n}>
                    <span className="font-display text-[var(--fs-4)] font-light lowercase text-[var(--ink-0)]">item {n}</span>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </div>
          </Specimen>
          <Specimen label="<Cursor> (live)">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">
              the curator's cursor is mounted globally on fine-pointer devices. hover any link or button to expand the lozenge.
            </p>
          </Specimen>
        </div>
      </Section>

      {/* 08 chrome components */}
      <Section number="08" title="chrome · components">
        <div className="grid gap-6 md:grid-cols-2">
          <Specimen label="<WallPlate>">
            <WallPlate
              index={5}
              title="building the hammer brand"
              year="2026"
              medium="brand systems"
              client="self"
              role="ai producer"
            />
          </Specimen>
          <Specimen label="<Figure>">
            <Figure number={1} caption="pipeline diagram" year="2026">
              <div className="aspect-video w-full bg-[var(--cream-2)]" />
            </Figure>
          </Specimen>
        </div>
      </Section>

      {/* 09 plinth */}
      <Section number="09" title="chrome · plinth">
        <ScrollReveal>
          <div className="grid grid-cols-2 gap-12 md:grid-cols-4 md:gap-x-16">
            {[1, 2, 3, 4].map((n) => (
              <Plinth
                key={n}
                href="#"
                index={n}
                title={`piece ${n}`}
                caption={`0${n} · sample · 2026`}
                tint={n % 2 === 0 ? "var(--cream-2)" : "var(--cream-1)"}
              />
            ))}
          </div>
        </ScrollReveal>
      </Section>

      {/* 10 idle breath demo */}
      <Section number="10" title="idle · wordmark breath">
        <div className="border border-[var(--ink-4)] p-12">
          <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">
            don't move your mouse for 6 seconds.
          </p>
          <Wordmark size="lg" />
        </div>
      </Section>

      <footer className="mt-32 border-t border-[var(--ink-0)] pt-12 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-2)]">
        <Link href="/" data-cursor="link" className="underline decoration-[var(--ink-3)] underline-offset-4 hover:text-[var(--cinnamon)]">
          ← entry hall
        </Link>
        <span>brand tokens compiled from BRAND_GUIDE.md · museum-coded gallery · phase 2</span>
      </footer>
    </main>
  );
}

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-32 border-t border-[var(--ink-4)] pt-12">
      <div className="mb-12 flex items-baseline justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--cinnamon)]">
          {number} · {title}
        </p>
        <span aria-hidden className="block h-px w-16 bg-[var(--ink-3)]" />
      </div>
      {children}
    </section>
  );
}
