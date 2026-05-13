import { notFound } from "next/navigation";
import { ViewLink } from "@/components/ViewLink";
import { PipelineVisualizer } from "@/components/PipelineVisualizer";
import {
  findCase,
  findPiece,
  getReadyPieceParams,
  hasPieceDetail,
  pieceDetailKey,
  statusLabel,
  type BrandGuideProfile,
  type CaseStudy,
  type Piece,
} from "@/lib/works";
import type { CSSProperties } from "react";

export async function generateStaticParams() {
  return getReadyPieceParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; piece: string }>;
}) {
  const { slug, piece } = await params;
  const category = findCase(slug);
  const item = findPiece(slug, piece);
  return { title: item && category ? `${item.title} · ${category.title}` : "work" };
}

export default async function WorkPiecePage({
  params,
}: {
  params: Promise<{ slug: string; piece: string }>;
}) {
  const { slug, piece: pieceSlug } = await params;
  const category = findCase(slug);
  const piece = findPiece(slug, pieceSlug);
  if (!category || !piece || !hasPieceDetail(slug, pieceSlug)) notFound();

  const transitionName = `work-${category.slug}-${piece.slug}`;

  return (
    <main className="relative min-h-[100svh] w-screen px-6 pt-28 pb-16 md:px-24 md:pt-32 md:pb-24">
      <DetailHeader category={category} piece={piece} />
      {renderPieceDetail(category, piece, transitionName)}
    </main>
  );
}

function DetailHeader({ category, piece }: { category: CaseStudy; piece: Piece }) {
  return (
    <header className="mx-auto mb-8 flex max-w-[1440px] flex-col gap-5 border-b border-[var(--ink-4)] pb-6 md:mb-10 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--cinnamon)]">
          {category.capabilityLabel} · {statusLabel(piece.status)}
        </p>
        <h1 className="mt-3 pb-[0.18em] font-display text-[clamp(44px,7vw,112px)] font-black lowercase leading-[0.96] tracking-[-0.045em] text-[var(--ink-0)]">
          {piece.title}
        </h1>
      </div>
      <ViewLink
        href={`/work/${category.slug}`}
        data-cursor="link"
        data-cursor-label="close"
        className="w-fit font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)] underline decoration-[var(--ink-3)] underline-offset-4 hover:text-[var(--cinnamon)]"
      >
        close
      </ViewLink>
    </header>
  );
}

function renderPieceDetail(category: CaseStudy, piece: Piece, transitionName: string) {
  const key = pieceDetailKey(category.slug, piece.slug);
  if (key === "motion-graphics/reel") return <MotionReelDetail transitionName={transitionName} />;
  if (key === "pipelines-tools/pipeline-visualizer") {
    return <PipelineDetail piece={piece} transitionName={transitionName} />;
  }
  if (category.slug === "brand-systems") {
    const guide = category.brandGuides?.find((g) => g.slug === piece.slug);
    if (guide) return <BrandGuideDetail guide={guide} transitionName={transitionName} />;
  }
  notFound();
}

function MotionReelDetail({ transitionName }: { transitionName: string }) {
  const frameStyle: CSSProperties = { viewTransitionName: transitionName };
  return (
    <section className="mx-auto grid max-w-[1180px] grid-cols-1 gap-6 md:grid-cols-12 md:gap-x-8">
      <aside className="md:col-span-3">
        <p className="font-display text-[clamp(18px,1.5vw,24px)] font-light lowercase leading-[1.4] tracking-[-0.015em] text-[var(--ink-1)]">
          A compact reel of AI motion work: Remotion, HyperFrames, brand identity motion, kinetic type,
          data motion, particles, and audio-reactive animation.
        </p>
      </aside>
      <div
        className="relative overflow-hidden border border-[var(--ink-3)] bg-[var(--cream-1)] p-2 shadow-[0_24px_80px_rgba(31,7,7,0.08)] md:col-span-9 md:p-4"
        style={frameStyle}
      >
        <video className="block aspect-video w-full bg-[var(--cream-0)]" controls playsInline preload="metadata">
          <source src="/work/motion/hammer-reel-v3-web-hq-10bit-hevc.mp4" type='video/mp4; codecs="hvc1"' />
          <source
            src="/work/motion/hammer-reel-v3-web-max-h264.mp4"
            type='video/mp4; codecs="avc1.64002A, mp4a.40.2"'
          />
        </video>
      </div>
    </section>
  );
}

function PipelineDetail({ piece, transitionName }: { piece: Piece; transitionName: string }) {
  const frameStyle: CSSProperties = { viewTransitionName: transitionName };
  return (
    <section className="mx-auto max-w-[1440px]">
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-x-12">
        <p className="font-display text-[clamp(18px,1.5vw,24px)] font-light lowercase leading-[1.42] tracking-[-0.015em] text-[var(--ink-1)] md:col-span-5">
          {piece.blurb}
        </p>
        <p className="font-mono text-[10px] uppercase leading-[1.8] tracking-[0.18em] text-[var(--ink-2)] md:col-span-4 md:col-start-9">
          interactive production map · cost, time, tools, handoff points
        </p>
      </div>
      <div
        className="border border-[var(--ink-4)] bg-[var(--cream-1)] p-4 shadow-[0_24px_80px_rgba(31,7,7,0.06)] md:p-8"
        style={frameStyle}
      >
        <PipelineVisualizer />
      </div>
    </section>
  );
}

function BrandGuideDetail({ guide, transitionName }: { guide: BrandGuideProfile; transitionName: string }) {
  const frameStyle: CSSProperties = { viewTransitionName: transitionName };
  return (
    <section className="mx-auto grid max-w-[1180px] grid-cols-1 gap-8 md:grid-cols-12 md:gap-x-10">
      <div
        className="border border-[var(--ink-4)] bg-[var(--cream-1)] p-6 shadow-[0_24px_80px_rgba(31,7,7,0.07)] md:col-span-8 md:p-8"
        style={frameStyle}
      >
        <div className="mb-10 flex items-start justify-between gap-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-2)]">
              {guide.status}
            </p>
            <h2 className="mt-4 pb-[0.18em] font-display text-[clamp(58px,8vw,132px)] font-black lowercase leading-[0.88] tracking-[-0.05em] text-[var(--ink-0)]">
              {guide.title}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-1" aria-label={`${guide.title} color swatches`}>
            {guide.swatches.map((swatch) => (
              <span
                key={swatch.label}
                className="block size-10 border border-[rgba(31,7,7,0.16)] md:size-12"
                style={{ backgroundColor: swatch.value }}
                title={`${swatch.label} ${swatch.value}`}
              />
            ))}
          </div>
        </div>
        <p className="font-display text-[clamp(20px,2vw,34px)] font-light leading-[1.25] tracking-[-0.025em] text-[var(--ink-0)]">
          {guide.description}
        </p>
      </div>

      <aside className="md:col-span-4">
        <div className="border-t border-[var(--ink-4)] pt-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--cinnamon)]">
            verified source
          </p>
          <p className="mt-3 font-mono text-[10px] uppercase leading-[1.7] tracking-[0.14em] text-[var(--ink-2)]">
            {guide.source}
          </p>
        </div>
        <ul className="mt-8 space-y-4">
          {guide.evidence.map((item) => (
            <li
              key={item}
              className="grid grid-cols-[24px_1fr] gap-3 border-t border-[var(--ink-4)] pt-4 font-display text-[clamp(15px,1.2vw,18px)] font-light leading-[1.45] text-[var(--ink-1)]"
            >
              <span className="mt-[0.45em] block h-px w-6 bg-[var(--ink-3)]" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </aside>
    </section>
  );
}
