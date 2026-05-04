import Link from "next/link";
import { WallPlate } from "@/components/WallPlate";

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
    <main className="relative min-h-[100svh] w-screen px-6 pt-32 pb-24 md:px-24 md:pt-40">
      <header className="mb-24 max-w-[60ch]">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--cinnamon)]">
          vii · working room
        </p>
        <h1 className="mt-6 font-display text-[clamp(48px,8vw,128px)] font-light lowercase leading-[0.88] tracking-[-0.04em] text-[var(--ink-0)]">
          how it <em className="font-serif italic font-normal text-[var(--bloodlust)]">works</em>.
        </h1>
        <p className="mt-8 font-display font-light text-[var(--fs-4)] leading-relaxed text-[var(--ink-1)]">
          five steps. opinionated, brief, broadcast-grade.
        </p>
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

      <footer className="mt-32 flex items-center justify-between border-t border-[var(--ink-4)] pt-8">
        <Link href="/" data-cursor="link" className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)] underline decoration-[var(--ink-3)] underline-offset-4 hover:text-[var(--cinnamon)]">
          ← entry hall
        </Link>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-3)]">vii / viii</span>
      </footer>
    </main>
  );
}
