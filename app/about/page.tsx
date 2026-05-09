import Link from "next/link";
import { WallPlate } from "@/components/WallPlate";
import { MaskReveal } from "@/components/motion/MaskReveal";

export const metadata = {
  title: "about",
  description:
    "Jeff Hammer — ten-plus years on broadcast and agency pipelines, now producing with AI. Comcast, Discovery, Tribune Media.",
};

const TIMELINE = [
  { year: "2015 — 2017", role: "producer",          network: "tribune media · la" },
  { year: "2018 — 2021", role: "creative producer", network: "discovery inc. · la" },
  { year: "2021 — now",  role: "senior producer",   network: "comcast · la" },
];

const CLIENTS = [
  "cadillac",
  "toyota",
  "subaru",
  "nissan",
  "tire rack",
  "autozone",
  "fox",
  "columbia",
  "kodak",
  "hulu",
  "sennheiser",
  "stx",
  "xfinity",
];

export default function Anteroom() {
  return (
    <main className="relative min-h-[100svh] w-screen px-6 pt-32 pb-16 md:px-24 md:pt-40 md:pb-24">
      {/* hero */}
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
            ten-plus years on broadcast and agency pipelines. now producing
            with ai. same job: get the cut, hit the deadline, deliver to spec.
          </p>
        </aside>
      </header>

      {/* body — currently + timeline */}
      <section className="grid w-full grid-cols-1 gap-16 md:grid-cols-12 md:gap-x-12">
        <div className="md:col-span-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">
            currently
          </p>
          <p className="mt-6 max-w-[44ch] font-display font-light text-[clamp(22px,2vw,28px)] leading-[1.4] tracking-[-0.02em] text-[var(--ink-1)]">
            producing brand systems, agents, motion graphics, animation,
            visual media, and websites.
          </p>
        </div>

        <aside className="md:col-span-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">
            experience
          </p>
          <ol className="mt-6 flex flex-col gap-8 border-l border-[var(--ink-4)] pl-6">
            {TIMELINE.map((t, i) => (
              <li key={`${t.year}-${t.network}`}>
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

      {/* meta footer — clients · education · memberships */}
      <section className="mt-24 grid grid-cols-1 gap-12 border-t border-[var(--ink-4)] pt-12 md:mt-32 md:grid-cols-12 md:gap-x-12">
        <div className="md:col-span-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">
            selected clients
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-1)]">
            {CLIENTS.map((c, i) => (
              <li key={c} className="flex items-center gap-5">
                <span>{c}</span>
                {i < CLIENTS.length - 1 ? (
                  <span aria-hidden className="text-[var(--ink-3)]">·</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-5 grid grid-cols-2 gap-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">
              education
            </p>
            <ul className="mt-4 flex flex-col gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-1)]">
              <li>ma film theory</li>
              <li>ba film production</li>
              <li className="text-[var(--ink-3)]">the new school · 2007–2013</li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">
              memberships
            </p>
            <ul className="mt-4 flex flex-col gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-1)]">
              <li>pga member</li>
              <li>aicp member</li>
              <li>adobe certified pro</li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="mt-24 flex border-t border-[var(--ink-4)] pt-8 md:mt-32">
        <Link href="/contact" data-cursor="link" data-cursor-label="say hi" className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-1)] hover:text-[var(--cinnamon)]">
          get in touch →
        </Link>
      </footer>
    </main>
  );
}
