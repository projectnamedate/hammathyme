import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { aboutMetadata, buildAboutPageJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo";

export const metadata = aboutMetadata;

const CLIENTS = [
  "cadillac",
  "columbia pictures",
  "equinox",
  "fox",
  "ihg hotels",
  "lululemon",
  "porsche",
  "rémy martin",
];

const AGENCIES = [
  "angry gods",
  "chandelier creative",
  "pg & co",
  "conscious minds",
  "look",
];

export default function Anteroom() {
  return (
    <main className="relative min-h-[100svh] w-screen px-6 pt-32 pb-16 md:px-24 md:pt-40 md:pb-24">
      <JsonLd
        jsonLd={[
          buildAboutPageJsonLd(),
          buildBreadcrumbJsonLd([
            { name: "home", path: "/" },
            { name: "about", path: "/about" },
          ]),
        ]}
      />
      {/* hero */}
      <header className="mb-20 grid grid-cols-1 gap-10 md:mb-32 md:grid-cols-12 md:gap-x-12">
        <div className="md:col-span-8">
          <MaskReveal direction="up" delay={0.3}>
            <h1 className="font-display text-[clamp(56px,11vw,200px)] font-light lowercase leading-[0.86] tracking-[-0.04em] text-[var(--ink-0)]">
              <span className="block">jeff</span>
              <span className="block pt-3 md:pt-6">
                <em className="font-serif italic font-normal text-[var(--bloodlust)]">hammer</em>
                <span aria-hidden>.</span>
              </span>
            </h1>
          </MaskReveal>
        </div>
        <aside className="flex items-end md:col-span-4">
          <p className="max-w-[36ch] font-display font-light text-[clamp(18px,1.5vw,22px)] leading-[1.5] tracking-[-0.015em] text-[var(--ink-1)]">
            ten-plus years on broadcast and agency pipelines. now producing
            with ai. same discipline, new tools.
          </p>
        </aside>
      </header>

      {/* body — currently */}
      <section className="grid w-full grid-cols-1 gap-16 md:grid-cols-12 md:gap-x-12">
        <div className="md:col-span-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">
            currently
          </p>
          <p className="mt-6 max-w-[44ch] font-display font-light text-[clamp(22px,2vw,28px)] leading-[1.4] tracking-[-0.02em] text-[var(--ink-1)]">
            creative technologist, building generative production
            pipelines for motion, media, and marketing work.
          </p>
        </div>
      </section>

      {/* meta footer — clients · agencies */}
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

        <div className="md:col-span-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">
            agencies
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-1)]">
            {AGENCIES.map((a, i) => (
              <li key={a} className="flex items-center gap-5">
                <span>{a}</span>
                {i < AGENCIES.length - 1 ? (
                  <span aria-hidden className="text-[var(--ink-3)]">·</span>
                ) : null}
              </li>
            ))}
          </ul>
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
