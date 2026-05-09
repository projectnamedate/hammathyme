import Link from "next/link";
import { notFound } from "next/navigation";
import { CASE_STUDIES, findCase, statusLabel, type Piece } from "@/lib/works";
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

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = findCase(slug);
  if (!c) notFound();

  const idx = CASE_STUDIES.findIndex((x) => x.slug === c.slug);
  const next = CASE_STUDIES[(idx + 1) % CASE_STUDIES.length]!;

  return (
    <main className="relative min-h-[100svh] w-screen px-6 pt-32 pb-16 md:px-24 md:pt-40 md:pb-24">
      {/* editorial header — full-bleed h1 + right pull-quote */}
      <header className="mb-20 grid grid-cols-1 gap-10 md:mb-32 md:grid-cols-12 md:gap-x-12">
        <div className="md:col-span-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--cinnamon)]">
            {String(idx + 1).padStart(2, "0")} · {c.capabilityLabel}
          </p>
          <MaskReveal direction="up" delay={0.3}>
            <h1 className="mt-6 font-display text-[clamp(56px,11vw,200px)] font-light lowercase leading-[0.86] tracking-[-0.04em] text-[var(--ink-0)]">
              {c.hero.main ? (
                <>
                  {c.hero.main}
                  <br />
                </>
              ) : null}
              <em className="font-serif italic font-normal text-[var(--bloodlust)]">{c.hero.italic}</em>
              <span aria-hidden className="text-[var(--cinnamon)]">.</span>
            </h1>
          </MaskReveal>
        </div>
        <aside className="flex items-end md:col-span-4">
          <p className="max-w-[40ch] font-display font-light text-[clamp(18px,1.5vw,22px)] leading-[1.5] tracking-[-0.015em] text-[var(--ink-1)]">
            {c.summary}
          </p>
        </aside>
      </header>

      {/* pieces grid */}
      <section
        className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-x-12 md:gap-y-24"
        data-spotlight-grid
        aria-label={`${c.capabilityLabel} portfolio`}
      >
        {c.pieces.map((p, i) => (
          <PieceTile key={p.slug} category={c.slug} piece={p} index={i + 1} />
        ))}
      </section>

      {/* category-specific extra widgets */}
      {c.slug === "pipelines-tools" ? (
        <section className="mt-32" aria-label="pipeline visualizer">
          <header className="mb-10 flex items-baseline gap-6 border-t border-[var(--ink-4)] pt-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--cinnamon)]">
              live demo
            </p>
            <p className="font-display text-[clamp(20px,1.6vw,26px)] font-light lowercase leading-none tracking-[-0.025em] text-[var(--ink-0)]">
              pipeline visualizer
              <span aria-hidden className="text-[var(--cinnamon)]">.</span>
            </p>
          </header>
          <PipelineVisualizer />
        </section>
      ) : null}

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

function PieceTile({
  category,
  piece,
  index,
}: {
  category: string;
  piece: Piece;
  index: number;
}) {
  const isLive = piece.status === "live";
  // Live pieces will eventually link to /work/[category]/[piece]; for now,
  // anchor-only so the click signals "no detail page yet" without 404-ing.
  const href = isLive ? `#${piece.slug}` : `#${piece.slug}`;
  const caption = `${piece.year} · ${statusLabel(piece.status)}`;
  void category;

  return (
    <div className="md:col-span-4">
      <div className={isLive ? "" : "opacity-80"}>
        <Plinth
          href={href}
          index={index}
          title={piece.title}
          caption={caption}
          tint={piece.tint}
          cursorLabel={isLive ? "view →" : "soon"}
        />
      </div>
      {piece.blurb ? (
        <p className="mt-4 max-w-[36ch] font-display font-light text-[clamp(13px,1vw,16px)] leading-[1.5] tracking-[-0.005em] text-[var(--ink-2)]">
          {piece.blurb}
        </p>
      ) : null}
    </div>
  );
}
