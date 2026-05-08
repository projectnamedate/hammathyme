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
    <main className="relative min-h-[100svh] w-screen px-6 pt-32 pb-16 md:px-24 md:pt-40 md:pb-24">
      {/* hero — full-bleed editorial spread */}
      <header className="mb-20 grid grid-cols-1 gap-10 md:mb-32 md:grid-cols-12 md:gap-x-12">
        <div className="md:col-span-8">
          <MaskReveal direction="up" delay={0.3}>
            <h1 className="font-display text-[clamp(56px,11vw,200px)] font-light lowercase leading-[0.86] tracking-[-0.04em] text-[var(--ink-0)]">
              live
              <br />
              <em className="font-serif italic font-normal text-[var(--bloodlust)]">demos</em>
              <span aria-hidden className="text-[var(--cinnamon)]">.</span>
            </h1>
          </MaskReveal>
        </div>
        <aside className="flex items-end md:col-span-4">
          <p className="max-w-[36ch] font-display font-light text-[clamp(18px,1.5vw,22px)] leading-[1.5] tracking-[-0.015em] text-[var(--ink-1)]">
            interactive specimens. each runs through a daily cost cap and rate
            limit. click in, hit run, watch the pipeline.
          </p>
        </aside>
      </header>

      <section className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-x-12 md:gap-y-24">
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
      </section>
    </main>
  );
}
