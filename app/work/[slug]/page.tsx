import Link from "next/link";
import { notFound } from "next/navigation";
import { CASE_STUDIES, findCase } from "@/lib/works";
import { WallPlate } from "@/components/WallPlate";
import { Figure } from "@/components/Figure";
import { SceneStack } from "@/components/SceneStack";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { PipelineVisualizer } from "@/components/PipelineVisualizer";
import { Plinth } from "@/components/Plinth";

export async function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = findCase(slug);
  return { title: c?.title ?? `work · ${slug}` };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = findCase(slug);
  if (!c) notFound();

  const idx = CASE_STUDIES.findIndex((x) => x.slug === c.slug);
  const next = CASE_STUDIES[(idx + 1) % CASE_STUDIES.length]!;

  // Agents is a roster — multiple characters in one category index.
  if (c.slug === "agents") {
    return (
      <main className="relative min-h-[100svh] w-screen px-6 pt-32 pb-16 md:px-24 md:pt-40 md:pb-24">
        <header className="mb-20 grid grid-cols-1 gap-10 md:mb-32 md:grid-cols-12 md:gap-x-12">
          <div className="md:col-span-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--cinnamon)]">
              {String(idx + 1).padStart(2, "0")} · {c.capabilityLabel}
            </p>
            <MaskReveal direction="up" delay={0.3}>
              <h1 className="mt-6 font-display text-[clamp(56px,11vw,200px)] font-light lowercase leading-[0.86] tracking-[-0.04em] text-[var(--ink-0)]">
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

        <section className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-x-12 md:gap-y-24" data-spotlight-grid>
          <div className="md:col-span-4">
            <Plinth
              href="#kira"
              index={1}
              title="kira"
              caption="feb 2026 · — followers"
              tint="var(--cream-2)"
              cursorLabel="meet →"
            />
          </div>
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

        <footer className="mt-24 flex items-center justify-between border-t border-[var(--ink-4)] pt-8 md:mt-32">
          <Link
            href="/work"
            data-cursor="link"
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)] underline decoration-[var(--ink-3)] underline-offset-4 hover:text-[var(--cinnamon)]"
          >
            ← atrium
          </Link>
          <Link
            href={`/work/${next.slug}`}
            data-cursor="link"
            data-cursor-label="enter →"
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-1)] hover:text-[var(--cinnamon)]"
          >
            next · {next.title} →
          </Link>
        </footer>
      </main>
    );
  }

  // Pipelines & tools is a live editorial page, not a scene-paged case study —
  // the pipeline visualizer is the centrepiece.
  if (c.slug === "pipelines-tools") {
    return (
      <main className="relative min-h-[100svh] w-screen px-6 pt-32 pb-16 md:px-24 md:pt-40 md:pb-24">
        <header className="mb-20 grid grid-cols-1 gap-10 md:mb-28 md:grid-cols-12 md:gap-x-12">
          <div className="md:col-span-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--cinnamon)]">
              {String(idx + 1).padStart(2, "0")} · {c.capabilityLabel}
            </p>
            <MaskReveal direction="up" delay={0.3}>
              <h1 className="mt-6 font-display text-[clamp(56px,11vw,200px)] font-light lowercase leading-[0.86] tracking-[-0.04em] text-[var(--ink-0)]">
                pipelines
                <br />
                <em className="font-serif italic font-normal text-[var(--bloodlust)]">+ tools</em>
                <span aria-hidden className="text-[var(--cinnamon)]">.</span>
              </h1>
            </MaskReveal>
          </div>
          <aside className="flex items-end md:col-span-4">
            <p className="max-w-[40ch] font-display font-light text-[clamp(18px,1.5vw,22px)] leading-[1.5] tracking-[-0.015em] text-[var(--ink-1)]">
              three real pipelines. every step labelled with model, cost, and
              time. click a node for the receipt; the full prompts ship on
              request.
            </p>
          </aside>
        </header>

        <PipelineVisualizer />

        <footer className="mt-24 flex items-center justify-between border-t border-[var(--ink-4)] pt-8 md:mt-32">
          <Link
            href="/work"
            data-cursor="link"
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)] underline decoration-[var(--ink-3)] underline-offset-4 hover:text-[var(--cinnamon)]"
          >
            ← atrium
          </Link>
          <Link
            href={`/work/${next.slug}`}
            data-cursor="link"
            data-cursor-label="enter →"
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-1)] hover:text-[var(--cinnamon)]"
          >
            next · {next.title} →
          </Link>
        </footer>
      </main>
    );
  }

  const scenes = [
    {
      id: "title",
      label: "i · title",
      node: (
        <div className="flex h-full w-full flex-col items-start justify-center px-12 md:px-24">
          <WallPlate
            index={idx + 1}
            title={c.title}
            year={c.year}
            medium={c.capabilityLabel}
            client={c.client}
            role="ai producer"
          />
          <h1 className="mt-12 font-display text-[clamp(56px,9vw,160px)] font-light lowercase leading-[0.88] tracking-[-0.04em] text-[var(--ink-0)]">
            {c.title}
          </h1>
          <p className="mt-12 max-w-[42ch] font-display font-light text-[var(--fs-5)] leading-relaxed text-[var(--ink-1)]">
            {c.summary}
          </p>
        </div>
      ),
    },
    {
      id: "brief",
      label: "ii · brief",
      node: (
        <div className="flex h-full w-full items-center justify-center px-12 md:px-32">
          <div className="max-w-[60ch]">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--cinnamon)]">brief</p>
            <p className="mt-8 font-display text-[clamp(24px,3vw,40px)] font-light leading-[1.3] tracking-[-0.025em] text-[var(--ink-0)]">
              the brief, the constraints, the prior art. lorem ipsum dolor sit amet, consectetur adipiscing elit.
              <em className="font-serif italic font-normal text-[var(--bloodlust)]"> sed do</em> eiusmod tempor incididunt.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "approach",
      label: "iii · approach",
      node: (
        <div className="flex h-full w-full items-center justify-center px-12 md:px-32">
          <div className="grid w-full max-w-[1200px] grid-cols-1 gap-12 md:grid-cols-2">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--cinnamon)]">approach</p>
              <p className="mt-6 font-display text-[clamp(20px,2.4vw,28px)] font-light leading-[1.4] tracking-[-0.02em] text-[var(--ink-0)]">
                what tools, what models, what cuts. how the pipeline assembled itself.
              </p>
              <ul className="mt-10 grid grid-cols-2 gap-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">
                <li>· veo 3.1</li>
                <li>· runway gen-4.5</li>
                <li>· kling 3.0</li>
                <li>· hedra avatar</li>
                <li>· suno v4.5</li>
                <li>· hyperframes</li>
              </ul>
            </div>
            <Figure number={1} caption="approach board" year={c.year}>
              <div
                className="aspect-[4/5] w-full border border-[var(--ink-4)]"
                style={{ background: c.tint }}
              />
            </Figure>
          </div>
        </div>
      ),
    },
    {
      id: "pipeline",
      label: "iv · pipeline",
      node: (
        <div className="flex h-full w-full items-center justify-center px-12 md:px-32">
          <Figure number={2} caption="pipeline diagram" year={c.year} className="w-full max-w-[1100px]">
            <PipelineDiagram tint={c.tint} />
          </Figure>
        </div>
      ),
    },
    {
      id: "gallery",
      label: "v · gallery",
      node: (
        <div className="flex h-full w-full items-center px-12 md:px-32">
          <div className="grid w-full grid-cols-3 gap-6 md:gap-12">
            {[3, 4, 5].map((n, i) => (
              <Figure key={n} number={n} caption={`still ${i + 1}`} year={c.year}>
                <div
                  className="aspect-[4/5] w-full border border-[var(--ink-4)]"
                  style={{ background: c.tint, opacity: 0.7 + i * 0.1 }}
                />
              </Figure>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "next",
      label: "vi · next room",
      node: (
        <div className="flex h-full w-full items-center justify-center px-12 md:px-32">
          <div className="flex flex-col items-center gap-8 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--cinnamon)]">next room</p>
            <Link
              href={`/work/${next.slug}`}
              data-cursor="link"
              data-cursor-label="enter →"
              className="group block"
            >
              <p className="font-display text-[clamp(48px,8vw,128px)] font-light lowercase leading-[0.88] tracking-[-0.04em] text-[var(--ink-1)] transition-colors duration-500 group-hover:text-[var(--ink-0)]">
                {next.title}
              </p>
              <span className="mt-6 inline-block h-px w-16 bg-[var(--ink-3)] transition-[width,background] duration-500 group-hover:w-32 group-hover:bg-[var(--cinnamon)]" />
            </Link>
            <Link
              href="/work"
              data-cursor="link"
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)] underline decoration-[var(--ink-3)] underline-offset-4 hover:text-[var(--cinnamon)]"
            >
              ← back to atrium
            </Link>
          </div>
        </div>
      ),
    },
  ];

  return <SceneStack scenes={scenes} caseTitle={c.title} back={{ href: "/work", label: "atrium" }} />;
}

function PipelineDiagram({ tint }: { tint: string }) {
  // Simple SVG: 5 nodes, 4 connectors, mono labels.
  const nodes = ["brief", "research", "generate", "polish", "deliver"];
  return (
    <svg
      role="img"
      aria-label="pipeline diagram"
      viewBox="0 0 1100 220"
      className="w-full"
    >
      <defs>
        <style type="text/css">{`
          .pl-node-bg { fill: ${tint}; stroke: var(--ink-3); stroke-width: 1; }
          .pl-label   { font-family: 'Geist Mono', ui-monospace, monospace; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; fill: var(--ink-1); }
          .pl-num     { font-family: 'Outfit', sans-serif; font-weight: 300; font-size: 28px; fill: var(--ink-0); letter-spacing: -0.04em; }
          .pl-conn    { stroke: var(--ink-3); stroke-width: 1; fill: none; stroke-dasharray: 2 4; }
          .pl-pip     { fill: var(--cinnamon); }
        `}</style>
      </defs>
      {nodes.map((n, i) => {
        const x = 60 + i * 240;
        return (
          <g key={n}>
            <rect className="pl-node-bg" x={x} y={50} width={180} height={110} />
            <text className="pl-num" x={x + 16} y={84}>{String(i + 1).padStart(2, "0")}</text>
            <text className="pl-label" x={x + 16} y={146}>{n}</text>
            <circle className="pl-pip" cx={x + 168} cy={62} r={3} />
            {i < nodes.length - 1 ? (
              <path className="pl-conn" d={`M ${x + 180} 105 L ${x + 240} 105`} />
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
