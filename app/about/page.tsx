import Link from "next/link";
import { WallPlate } from "@/components/WallPlate";

export const metadata = { title: "about" };

const TIMELINE = [
  { year: "2010 — 2014", role: "broadcast producer", network: "discovery" },
  { year: "2014 — 2018", role: "senior producer", network: "turner" },
  { year: "2018 — 2024", role: "executive producer", network: "comcast" },
  { year: "2024 — now",  role: "ai producer",      network: "hammer studios" },
];

export default function Anteroom() {
  return (
    <main className="relative min-h-[100svh] w-screen px-6 pt-32 pb-24 md:px-24 md:pt-40">
      <div className="grid w-full grid-cols-1 gap-24 md:grid-cols-12">
        {/* left: bio plate */}
        <section className="md:col-span-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--cinnamon)]">
            vi · anteroom
          </p>
          <h1 className="mt-6 font-display text-[clamp(48px,8vw,128px)] font-light lowercase leading-[0.88] tracking-[-0.04em] text-[var(--ink-0)]">
            jeff <em className="font-serif italic font-normal text-[var(--bloodlust)]">hammer</em>.
          </h1>
          <p className="mt-12 max-w-[42ch] font-display font-light text-[clamp(20px,2.4vw,28px)] leading-[1.4] tracking-[-0.02em] text-[var(--ink-1)]">
            fifteen years on broadcast pipelines. eighteen months on ai. same job: get the cut, hit the deadline, deliver to spec.
          </p>
          <p className="mt-8 max-w-[44ch] font-display font-light text-[var(--fs-4)] leading-relaxed text-[var(--ink-2)]">
            currently producing autonomous characters, motion graphics, ai film, and brand systems out of hammer studios.
          </p>
        </section>

        {/* right: experience timeline */}
        <aside className="md:col-span-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">
            experience
          </p>
          <ol className="mt-8 flex flex-col gap-8 border-l border-[var(--ink-4)] pl-6">
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
      </div>

      <footer className="mt-32 flex items-center justify-between border-t border-[var(--ink-4)] pt-8">
        <Link href="/" data-cursor="link" className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)] underline decoration-[var(--ink-3)] underline-offset-4 hover:text-[var(--cinnamon)]">
          ← entry hall
        </Link>
        <Link href="/contact" data-cursor="link" data-cursor-label="say hi" className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-1)] hover:text-[var(--cinnamon)]">
          get in touch →
        </Link>
      </footer>
    </main>
  );
}
