import Link from "next/link";
import { Plinth } from "@/components/Plinth";
import { MaskReveal } from "@/components/motion/MaskReveal";

export const metadata = { title: "agents" };

const ROSTER = [
  { slug: "kira", name: "kira", born: "feb 2026", followers: "—", tint: "var(--cream-2)", note: "the placeholder character at launch" },
];

export default function RosterWall() {
  return (
    <main className="relative min-h-[100svh] w-screen px-6 pt-32 pb-24 md:px-24 md:pt-40">
      {/* heading */}
      <header className="mb-24 max-w-[60ch]">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--cinnamon)]">
          iv · roster wall
        </p>
        <MaskReveal direction="up" delay={0.3}>
          <h1 className="mt-6 font-display text-[clamp(48px,8vw,128px)] font-light lowercase leading-[0.88] tracking-[-0.04em] text-[var(--ink-0)]">
            autonomous <em className="font-serif italic font-normal text-[var(--bloodlust)]">characters</em>.
          </h1>
        </MaskReveal>
        <p className="mt-8 font-display font-light text-[var(--fs-4)] leading-relaxed text-[var(--ink-1)]">
          persistent ai personas with their own social presence, posting cadence, and visual identity.
        </p>
      </header>

      {/* plinth grid — opacity-spotlight on hover */}
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-x-16 md:gap-y-24" data-spotlight-grid>
        {ROSTER.map((r, i) => (
          <Plinth
            key={r.slug}
            href={`/agents/${r.slug}`}
            index={i + 1}
            title={r.name}
            caption={`${r.born} · ${r.followers} followers`}
            tint={r.tint}
            cursorLabel="meet →"
          />
        ))}
        {/* placeholder slots so the wall reads as gallery, not "1 character" */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={`empty-${i}`} className="opacity-30">
            <div className="aspect-[3/4] w-full border border-dashed border-[var(--ink-4)]" />
            <div className="mt-4 flex flex-col gap-2">
              <span className="block h-px w-8 bg-[var(--ink-4)]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-3)]">
                {String(i + 2).padStart(2, "0")} · awaiting cast
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* footer return */}
      <footer className="mt-32 flex items-center justify-between border-t border-[var(--ink-4)] pt-8">
        <Link
          href="/"
          data-cursor="link"
          className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)] underline decoration-[var(--ink-3)] underline-offset-4 hover:text-[var(--cinnamon)]"
        >
          ← entry hall
        </Link>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-3)]">
          iv / viii
        </span>
      </footer>
    </main>
  );
}
