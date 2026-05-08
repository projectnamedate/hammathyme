import { Plinth } from "@/components/Plinth";
import { MaskReveal } from "@/components/motion/MaskReveal";

export const metadata = { title: "agents" };

const ROSTER = [
  {
    slug: "kira",
    name: "kira",
    born: "feb 2026",
    followers: "—",
    tint: "var(--cream-2)",
  },
];

export default function RosterWall() {
  return (
    <main className="relative min-h-[100svh] w-screen px-6 pt-32 pb-16 md:px-24 md:pt-40 md:pb-24">
      {/* editorial header — full-width on desktop */}
      <header className="mb-20 grid grid-cols-1 gap-10 md:mb-32 md:grid-cols-12 md:gap-x-12">
        <div className="md:col-span-8">
          <MaskReveal direction="up" delay={0.3}>
            <h1 className="font-display text-[clamp(56px,11vw,200px)] font-light lowercase leading-[0.86] tracking-[-0.04em] text-[var(--ink-0)]">
              autonomous
              <br />
              <em className="font-serif italic font-normal text-[var(--bloodlust)]">characters</em>
              <span aria-hidden className="text-[var(--cinnamon)]">.</span>
            </h1>
          </MaskReveal>
        </div>
        <aside className="flex items-end md:col-span-4">
          <p className="max-w-[40ch] font-display font-light text-[clamp(18px,1.5vw,22px)] leading-[1.5] tracking-[-0.015em] text-[var(--ink-1)]">
            a character layered over an autonomous agent. any creator or brand
            can send one into the digital world to work as a 24/7 marketer,
            onboarder, and live ad for the product.
          </p>
        </aside>
      </header>

      {/* roster — single hero plinth on desktop, grows as cast lands */}
      <section className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-x-12 md:gap-y-24" data-spotlight-grid>
        {ROSTER.map((r, i) => (
          <div key={r.slug} className="md:col-span-4">
            <Plinth
              href={`/agents/${r.slug}`}
              index={i + 1}
              title={r.name}
              caption={`${r.born} · ${r.followers} followers`}
              tint={r.tint}
              cursorLabel="meet →"
            />
          </div>
        ))}
        {/* the cast grows — quiet hairline tile rather than dashed placeholders */}
        <div className="md:col-span-4">
          <div className="flex aspect-[3/4] w-full items-end border border-[var(--ink-4)] bg-[var(--cream-1)] p-6 md:p-8">
            <p className="max-w-[20ch] font-display font-light text-[clamp(18px,1.4vw,22px)] leading-[1.35] tracking-[-0.02em] text-[var(--ink-2)]">
              the cast
              <br />
              <em className="font-serif italic font-normal text-[var(--bloodlust)]">grows</em>
              <span aria-hidden className="text-[var(--cinnamon)]">.</span>
            </p>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <span className="block h-px w-8 bg-[var(--ink-3)]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-3)]">
              02 · in production
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
