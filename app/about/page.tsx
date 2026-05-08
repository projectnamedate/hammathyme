import Link from "next/link";
import { WallPlate } from "@/components/WallPlate";
import { MaskReveal } from "@/components/motion/MaskReveal";

export const metadata = { title: "about" };

const TIMELINE = [
  { year: "2010 — 2014", role: "broadcast producer", network: "discovery" },
  { year: "2014 — 2018", role: "senior producer", network: "turner" },
  { year: "2018 — 2024", role: "executive producer", network: "comcast" },
  { year: "2024 — now",  role: "ai producer",      network: "hammer studios" },
];

export default function Anteroom() {
  return (
    <main className="relative min-h-[100svh] w-screen px-6 pt-32 pb-16 md:px-24 md:pt-40 md:pb-24">
      {/* hero — full-bleed name on desktop */}
      <header className="mb-20 grid grid-cols-1 gap-10 md:mb-32 md:grid-cols-12 md:gap-x-12">
        <div className="md:col-span-8">
          <MaskReveal direction="up" delay={0.3}>
            <h1 className="font-display text-[clamp(56px,11vw,200px)] font-light lowercase leading-[0.86] tracking-[-0.04em] text-[var(--ink-0)]">
              jeff
              <br />
              <em className="font-serif italic font-normal text-[var(--bloodlust)]">hammer</em>
              <span aria-hidden className="text-[var(--cinnamon)]">.</span>
            </h1>
          </MaskReveal>
        </div>
        <aside className="flex items-end md:col-span-4">
          <p className="max-w-[36ch] font-display font-light text-[clamp(18px,1.5vw,22px)] leading-[1.5] tracking-[-0.015em] text-[var(--ink-1)]">
            fifteen years on broadcast pipelines. eighteen months on ai. same
            job: get the cut, hit the deadline, deliver to spec.
          </p>
        </aside>
      </header>

      {/* body — bio + experience side-by-side on desktop */}
      <section className="grid w-full grid-cols-1 gap-16 md:grid-cols-12 md:gap-x-12">
        <div className="md:col-span-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">
            currently
          </p>
          <p className="mt-6 max-w-[40ch] font-display font-light text-[clamp(22px,2vw,28px)] leading-[1.4] tracking-[-0.02em] text-[var(--ink-1)]">
            producing autonomous characters, character animation, ai film, and
            brand systems out of hammer studios.
          </p>
        </div>

        <aside className="md:col-span-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">
            experience
          </p>
          <ol className="mt-6 flex flex-col gap-8 border-l border-[var(--ink-4)] pl-6">
            {TIMELINE.map((t, i) => (
              <li key={t.year}>
                <WallPlate
                  index={i + 1}
                  title={t.role}
                  year={t.year}
                  client={t.network}
                  className="!gap-2"
                />
              </li>
            ))}
          </ol>
        </aside>
      </section>

      <footer className="mt-24 flex border-t border-[var(--ink-4)] pt-8 md:mt-32">
        <Link href="/contact" data-cursor="link" data-cursor-label="say hi" className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-1)] hover:text-[var(--cinnamon)]">
          get in touch →
        </Link>
      </footer>
    </main>
  );
}
