import Link from "next/link";
import { Plinth } from "@/components/Plinth";
import { MaskReveal } from "@/components/motion/MaskReveal";

export const metadata = { title: "notes" };

const NOTES = [
  { slug: "from-broadcast-to-ai-producer", title: "from broadcast to ai producer", caption: "01 · the bridge story", tint: "var(--cream-1)" },
  { slug: "what-an-ai-producer-actually-does", title: "what an ai producer does", caption: "02 · definition", tint: "var(--cream-2)" },
  { slug: "the-autonomous-character-stack", title: "the autonomous character stack", caption: "03 · the kira pipeline", tint: "var(--cream-1)" },
  { slug: "ai-video-model-comparison-may-2026", title: "ai video models · may 2026", caption: "04 · veo vs runway vs kling vs seedance", tint: "var(--bloodlust)" },
  { slug: "ai-video-pipeline-workflow", title: "an ai video pipeline", caption: "05 · brief to delivery", tint: "var(--cream-2)" },
];

export default function Library() {
  return (
    <main className="relative min-h-[100svh] w-screen px-6 pt-32 pb-24 md:px-24 md:pt-40">
      <header className="mb-24 max-w-[60ch]">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--cinnamon)]">
          v · library
        </p>
        <MaskReveal direction="up" delay={0.3}>
          <h1 className="mt-6 font-display text-[clamp(48px,8vw,128px)] font-light lowercase leading-[0.88] tracking-[-0.04em] text-[var(--ink-0)]">
            essays + <em className="font-serif italic font-normal text-[var(--bloodlust)]">dispatches</em>.
          </h1>
        </MaskReveal>
        <p className="mt-8 font-display font-light text-[var(--fs-4)] leading-relaxed text-[var(--ink-1)]">
          definitional pieces, model comparisons, workflow diaries. open territory in serp.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-x-8 gap-y-16 md:grid-cols-5 md:gap-x-12">
        {NOTES.map((n, i) => (
          <Plinth
            key={n.slug}
            href={`/notes/${n.slug}`}
            index={i + 1}
            title={n.title}
            caption={n.caption}
            tint={n.tint}
            cursorLabel="read →"
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
          v / viii
        </span>
      </footer>
    </main>
  );
}
