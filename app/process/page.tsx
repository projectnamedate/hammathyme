import { WallPlate } from "@/components/WallPlate";
import { MaskReveal } from "@/components/motion/MaskReveal";

export const metadata = { title: "process" };

const STEPS = [
  { title: "brief", body: "what's the cut, who's it for, what's the budget. one paragraph, no decks." },
  { title: "research", body: "market refresh, references, competitor sites. an agent runs the first pass." },
  { title: "build a pipeline", body: "models · prompts · cost cap · the diagram lives in the case study." },
  { title: "iterate", body: "show the failed takes. that's the honesty signal." },
  { title: "deliver", body: "broadcast-grade out: hls, captions, color, sound. on time." },
];

export default function WorkingRoom() {
  return (
    <main className="relative min-h-[100svh] w-screen px-6 pt-32 pb-16 md:px-24 md:pt-40 md:pb-24">
      {/* hero — full-bleed editorial spread */}
      <header className="mb-20 grid grid-cols-1 gap-10 md:mb-32 md:grid-cols-12 md:gap-x-12">
        <div className="md:col-span-8">
          <MaskReveal direction="up" delay={0.3}>
            <h1 className="font-display text-[clamp(56px,11vw,200px)] font-light lowercase leading-[0.86] tracking-[-0.04em] text-[var(--ink-0)]">
              how it
              <br />
              <em className="font-serif italic font-normal text-[var(--bloodlust)]">works</em>
              <span aria-hidden className="text-[var(--cinnamon)]">.</span>
            </h1>
          </MaskReveal>
        </div>
        <aside className="flex items-end md:col-span-4">
          <p className="max-w-[36ch] font-display font-light text-[clamp(18px,1.5vw,22px)] leading-[1.5] tracking-[-0.015em] text-[var(--ink-1)]">
            five steps. opinionated, brief, broadcast-grade. the same five
            steps every project, every time.
          </p>
        </aside>
      </header>

      <ol className="grid grid-cols-1 gap-12 md:grid-cols-5">
        {STEPS.map((s, i) => (
          <li key={s.title} className="flex flex-col gap-6 border-t border-[var(--ink-3)] pt-6">
            <WallPlate index={i + 1} title={s.title} year="" className="!gap-2" />
            <p className="font-display font-light text-[var(--fs-4)] leading-relaxed text-[var(--ink-1)]">
              {s.body}
            </p>
          </li>
        ))}
      </ol>
    </main>
  );
}
