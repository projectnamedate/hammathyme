import Link from "next/link";
import { Plinth } from "@/components/Plinth";
import { MaskReveal } from "@/components/motion/MaskReveal";

export const metadata = { title: "lab" };

const SPECIMENS = [
  { slug: "pipeline-visualizer", title: "pipeline visualizer", caption: "01 · diagram a producer's stack", tint: "var(--cream-1)" },
  { slug: "storyboard-generator", title: "prompt → storyboard", caption: "02 · 6-shot from a sentence", tint: "var(--cream-2)" },
  { slug: "consistency-lab", title: "character consistency", caption: "03 · 6 scenes, one character", tint: "var(--bloodlust)", textInverse: true },
  { slug: "live-render-feed", title: "live render feed", caption: "04 · what the agents produced today", tint: "var(--cream-1)" },
];

export default function StudyRoom() {
  return (
    <main className="relative min-h-[100svh] w-screen px-6 pt-32 pb-24 md:px-24 md:pt-40">
      <header className="mb-24 max-w-[60ch]">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--cinnamon)]">
          iii · study room
        </p>
        <MaskReveal direction="up" delay={0.3}>
          <h1 className="mt-6 font-display text-[clamp(48px,8vw,128px)] font-light lowercase leading-[0.88] tracking-[-0.04em] text-[var(--ink-0)]">
            live <em className="font-serif italic font-normal text-[var(--bloodlust)]">demos</em>.
          </h1>
        </MaskReveal>
        <p className="mt-8 font-display font-light text-[var(--fs-4)] leading-relaxed text-[var(--ink-1)]">
          interactive specimens. each runs through a daily cost cap and rate limit.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-x-12 md:gap-y-20">
        {SPECIMENS.map((s, i) => (
          <Plinth
            key={s.slug}
            href={`/lab/${s.slug}`}
            index={i + 1}
            title={s.title}
            caption={s.caption}
            tint={s.tint}
            cursorLabel="run →"
          />
        ))}
      </div>

      <footer className="mt-32 flex items-center justify-between border-t border-[var(--ink-4)] pt-8">
        <Link
          href="/"
          data-cursor="link"
          className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)] underline decoration-[var(--ink-3)] underline-offset-4 hover:text-[var(--cinnamon)]"
        >
          ← entry hall
        </Link>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-3)]">
          iii / viii
        </span>
      </footer>
    </main>
  );
}
