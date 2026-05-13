import { notFound } from "next/navigation";
import Image from "next/image";
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
  if (key === "agents/kira") return <KiraAgentDetail transitionName={transitionName} />;
  if (key === "motion-graphics/reel") return <MotionReelDetail transitionName={transitionName} />;
  if (key === "pipelines-tools/pipeline-visualizer") {
    return <PipelineDetail piece={piece} transitionName={transitionName} />;
  }
  if (category.slug === "websites") {
    return <WebsiteDetail piece={piece} transitionName={transitionName} />;
  }
  if (category.slug === "brand-systems") {
    const guide = category.brandGuides?.find((g) => g.slug === piece.slug);
    if (guide) return <BrandGuideDetail guide={guide} transitionName={transitionName} />;
  }
  notFound();
}

const KIRA_AGENT_FACTS = [
  ["system", "Hermes scheduler, reply queue, voice guards, media policy, and CDP fire path"],
  ["identity", "persistent face, canonical refs, x profile assets, and a 14-part brand bible"],
  ["outputs", "scheduled originals, reply campaigns, generated photos, clips, memes, and native GIF lanes"],
  ["governance", "AI disclosure, C2PA/provenance docs, rate caps, pause flags, and review-first expansion"],
];

const KIRA_AGENT_REFS = [
  { src: "/work/agents/kira/ref-head-tilt.png", label: "canonical portrait", width: 933, height: 1400 },
  { src: "/work/agents/kira/ref-serious.png", label: "voice anchor", width: 933, height: 1400 },
  { src: "/work/agents/kira/ref-desk.png", label: "crypto desk", width: 933, height: 1200 },
  { src: "/work/agents/kira/ref-brooklyn.png", label: "location test", width: 1089, height: 1400 },
];

function KiraAgentDetail({ transitionName }: { transitionName: string }) {
  const frameStyle: CSSProperties = { viewTransitionName: transitionName };
  return (
    <section className="mx-auto max-w-[1320px]">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-x-10">
        <div
          className="relative overflow-hidden border border-[var(--ink-4)] bg-[var(--cream-1)] shadow-[0_24px_80px_rgba(31,7,7,0.07)] md:col-span-8"
          style={frameStyle}
        >
          <Image
            src="/work/agents/kira/banner.png"
            alt="Kira profile banner"
            width={1500}
            height={500}
            priority
            sizes="(min-width: 768px) 66vw, 100vw"
            className="block aspect-[3/1] w-full object-cover"
          />
          <div className="grid grid-cols-[96px_1fr] gap-5 border-t border-[var(--ink-4)] p-5 md:grid-cols-[132px_1fr] md:p-7">
            <Image
              src="/work/agents/kira/avatar.png"
              alt="Kira avatar"
              width={700}
              height={900}
              sizes="132px"
              className="aspect-[1/1] w-full border border-[var(--ink-4)] object-cover object-top"
            />
            <div className="flex flex-col justify-between gap-6">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--cinnamon)]">
                  autonomous character · live system
                </p>
                <p className="mt-3 max-w-[46ch] font-display text-[clamp(22px,2.4vw,42px)] font-light leading-[1.12] tracking-[-0.025em] text-[var(--ink-0)]">
                  Kira is the working proof that a character can be a brand surface, content engine,
                  and always-on social operator.
                </p>
              </div>
              <ViewLink
                href="/work/brand-systems/kira"
                data-cursor="link"
                data-cursor-label="open →"
                className="w-fit font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ink-2)] underline decoration-[var(--ink-3)] underline-offset-4 hover:text-[var(--cinnamon)]"
              >
                brand guide dossier
              </ViewLink>
            </div>
          </div>
        </div>

        <aside className="md:col-span-4">
          <p className="font-display text-[clamp(18px,1.45vw,24px)] font-light lowercase leading-[1.42] tracking-[-0.015em] text-[var(--ink-1)]">
            This page pulls the finished Kira identity assets into the agents category and keeps the
            operational story separate from the brand bible. No keys, private queues, or live controls
            are exposed here.
          </p>
          <dl className="mt-8 grid grid-cols-1 gap-4 border-t border-[var(--ink-4)] pt-5">
            <div>
              <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--cinnamon)]">born</dt>
              <dd className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-2)]">
                february 2026
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--cinnamon)]">role</dt>
              <dd className="mt-2 font-mono text-[10px] uppercase leading-[1.7] tracking-[0.14em] text-[var(--ink-2)]">
                autonomous crypto character · social operator · media testbed
              </dd>
            </div>
          </dl>
        </aside>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-4">
        {KIRA_AGENT_FACTS.map(([label, value]) => (
          <div key={label} className="border-t border-[var(--ink-4)] pt-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--cinnamon)]">{label}</p>
            <p className="mt-3 font-display text-[clamp(15px,1.15vw,18px)] font-light leading-[1.45] tracking-[-0.01em] text-[var(--ink-1)]">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
        {KIRA_AGENT_REFS.map((ref) => (
          <figure key={ref.src} className="border border-[var(--ink-4)] bg-[var(--cream-1)] p-2">
            <Image
              src={ref.src}
              alt={`Kira ${ref.label}`}
              width={ref.width}
              height={ref.height}
              sizes="(min-width: 768px) 25vw, 50vw"
              className="aspect-[3/4] w-full object-cover object-top"
            />
            <figcaption className="mt-3 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ink-2)]">
              {ref.label}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

type WebsiteProfile = {
  slug: string;
  status: string;
  liveUrl: string;
  summary: string;
  stack: string[];
  facts: [string, string][];
  shots: { src: string; label: string; alt: string; width: number; height: number; tone?: "light" | "dark" }[];
};

const WEBSITE_DETAILS: WebsiteProfile[] = [
  {
    slug: "hammathyme",
    status: "live portfolio system",
    liveUrl: "https://hammathyme.vercel.app",
    summary:
      "The current Hammer site is itself a finished portfolio asset: a warm editorial identity, eight-category work atrium, detail-route gallery model, motion surfaces, and source-readable docs.",
    stack: ["next.js 16", "react 19", "tailwind v4", "motion", "view transitions", "vercel"],
    facts: [
      ["model", "gallery-first category routes with detail pages for finished work"],
      ["brand", "Outfit wordmark, warm cream system, cinnamon dot, serif italic accents"],
      ["surfaces", "brand dossiers, reel video, pipeline visualizer, agents, websites"],
      ["docs", "CLAUDE, brand guide, llms.txt, and public memory kept in sync with code"],
    ],
    shots: [
      {
        src: "/work/websites/hammathyme/home.png",
        label: "entry hall",
        alt: "Hammathyme homepage screenshot",
        width: 1440,
        height: 1000,
      },
      {
        src: "/work/websites/hammathyme/agents.png",
        label: "agents category",
        alt: "Agents category screenshot",
        width: 1440,
        height: 1000,
      },
      {
        src: "/work/websites/hammathyme/kira-agent.png",
        label: "kira detail",
        alt: "Kira agent detail screenshot",
        width: 1440,
        height: 1000,
      },
    ],
  },
  {
    slug: "kira",
    status: "live public character site",
    liveUrl: "https://onlykira.ai",
    summary:
      "onlykira.ai is the public microsite for Kira: a character-first web surface built from the Kira bible, live media language, and AI-native site production.",
    stack: ["next.js 15", "react 19", "gsap", "lenis", "brand bible", "ai media"],
    facts: [
      ["site", "live at onlykira.ai"],
      ["role", "public home for the autonomous character brand"],
      ["system", "brand tokens, voice rules, mobile feed, disclosure, and provenance surfaces"],
      ["production", "designed and built with AI from the Kira character bible"],
    ],
    shots: [
      {
        src: "/work/websites/kira/live.png",
        label: "onlykira.ai",
        alt: "onlykira.ai live website screenshot",
        width: 1440,
        height: 1000,
        tone: "dark",
      },
    ],
  },
  {
    slug: "opencrawl",
    status: "live devnet alpha site",
    liveUrl: "https://opencrawl.gg",
    summary:
      "opencrawl.gg is an autonomous-agent game site with a live-spectator lobby, crawler registration, leaderboard, and a full Construct brand bible behind it.",
    stack: ["next.js 16", "solana wallet adapter", "websocket feed", "game server", "brand bible", "pixel-dither UI"],
    facts: [
      ["product", "autonomous crawlers enter a procedural dungeon and compete without human input"],
      ["frontend", "lobby, live match feed, leaderboard, wallet path, registration, and docs"],
      ["brand", "dark Construct system, green energy ramp, gold loot states, red danger states"],
      ["source", "monorepo with shared engine, server, anchor program, frontend, and agent skill"],
    ],
    shots: [
      {
        src: "/work/websites/opencrawl/live.png",
        label: "opencrawl.gg",
        alt: "opencrawl.gg live website screenshot",
        width: 1440,
        height: 1000,
        tone: "dark",
      },
      {
        src: "/work/websites/opencrawl/lobby.png",
        label: "lobby",
        alt: "OpenCrawl lobby screenshot",
        width: 1200,
        height: 817,
        tone: "dark",
      },
      {
        src: "/work/websites/opencrawl/leaderboard.png",
        label: "leaderboard",
        alt: "OpenCrawl leaderboard screenshot",
        width: 1200,
        height: 817,
        tone: "dark",
      },
      {
        src: "/work/websites/opencrawl/register.png",
        label: "register",
        alt: "OpenCrawl registration screenshot",
        width: 1200,
        height: 817,
        tone: "dark",
      },
      {
        src: "/work/websites/opencrawl/brand-bible.png",
        label: "brand bible",
        alt: "OpenCrawl brand bible screenshot",
        width: 1200,
        height: 7192,
        tone: "dark",
      },
    ],
  },
  {
    slug: "coefficient",
    status: "live Solana dashboard",
    liveUrl: "https://coefficient.mythx.art",
    summary:
      "coefficient.mythx.art is a Solana stake-pool health dashboard: rankings, score breakdowns, validator data, and methodology for decentralization impact.",
    stack: ["next.js 16", "typescript", "tailwind v4", "turso", "drizzle", "solana rpc", "d3"],
    facts: [
      ["site", "live at coefficient.mythx.art"],
      ["product", "scores multi-validator stake pools on network-health impact"],
      ["data", "daily indexer from Solana RPC, StakeWiz, Trillium, Marinade, and sandwich lists"],
      ["production", "AI-built dashboard with scoring, details, compare views, flows, and embeds"],
    ],
    shots: [
      {
        src: "/work/websites/coefficient/live.png",
        label: "coefficient.mythx.art",
        alt: "Coefficient live website screenshot",
        width: 1440,
        height: 1000,
      },
    ],
  },
];

function WebsiteDetail({ piece, transitionName }: { piece: Piece; transitionName: string }) {
  const detail = WEBSITE_DETAILS.find((item) => item.slug === piece.slug);
  if (!detail) notFound();

  const [hero, ...secondaryShots] = detail.shots;
  const frameStyle: CSSProperties = { viewTransitionName: transitionName };

  return (
    <section className="mx-auto max-w-[1320px]">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-x-10">
        <div
          className="overflow-hidden border border-[var(--ink-4)] bg-[var(--cream-1)] p-2 shadow-[0_24px_80px_rgba(31,7,7,0.07)] md:col-span-8 md:p-3"
          style={frameStyle}
        >
          <a
            href={detail.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="link"
            data-cursor-label="open ↗"
            aria-label={`Open ${detail.liveUrl}`}
          >
            <Image
              src={hero.src}
              alt={hero.alt}
              width={hero.width}
              height={hero.height}
              priority
              sizes="(min-width: 768px) 66vw, 100vw"
              className="block aspect-[16/10] w-full bg-[var(--cream-0)] object-cover object-top"
            />
          </a>
        </div>
        <aside className="md:col-span-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--cinnamon)]">{detail.status}</p>
          <p className="mt-4 font-display text-[clamp(20px,1.9vw,32px)] font-light leading-[1.22] tracking-[-0.02em] text-[var(--ink-0)]">
            {detail.summary}
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {detail.stack.map((item) => (
              <span
                key={item}
                className="border border-[var(--ink-4)] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--ink-2)]"
              >
                {item}
              </span>
            ))}
          </div>
          <a
            href={detail.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="link"
            data-cursor-label="open ↗"
            className="mt-7 inline-flex w-fit border border-[var(--ink-4)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-1)] hover:border-[var(--cinnamon)] hover:text-[var(--cinnamon)]"
          >
            visit live site ↗
          </a>
        </aside>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-4">
        {detail.facts.map(([label, value]) => (
          <div key={label} className="border-t border-[var(--ink-4)] pt-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--cinnamon)]">{label}</p>
            <p className="mt-3 font-display text-[clamp(15px,1.12vw,18px)] font-light leading-[1.45] tracking-[-0.01em] text-[var(--ink-1)]">
              {value}
            </p>
          </div>
        ))}
      </div>

      {secondaryShots.length ? (
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {secondaryShots.map((shot) => (
            <figure
              key={shot.src}
              className="overflow-hidden border border-[var(--ink-4)] bg-[var(--cream-1)] p-2"
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                width={shot.width}
                height={shot.height}
                sizes="(min-width: 768px) 33vw, 100vw"
                className="aspect-[4/3] w-full object-cover object-top"
                style={shot.tone === "dark" ? { backgroundColor: "var(--ink-deepest)" } : undefined}
              />
              <figcaption className="mt-3 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ink-2)]">
                {shot.label}
              </figcaption>
            </figure>
          ))}
        </div>
      ) : null}
    </section>
  );
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
    <section className="mx-auto max-w-[1440px]">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-x-10">
        <div
          className="border border-[var(--ink-4)] bg-[var(--cream-1)] p-6 shadow-[0_24px_80px_rgba(31,7,7,0.07)] md:col-span-8 md:p-8"
          style={frameStyle}
        >
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-8">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-2)]">
                {guide.status}
              </p>
              <h2 className="mt-4 pb-[0.18em] font-display text-[clamp(58px,8vw,132px)] font-black lowercase leading-[0.88] tracking-[-0.05em] text-[var(--ink-0)]">
                {guide.title}
              </h2>
            </div>
            <div className="grid w-fit grid-cols-4 gap-1 md:grid-cols-2" aria-label={`${guide.title} color swatches`}>
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
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <p className="font-display text-[clamp(20px,2vw,34px)] font-light leading-[1.25] tracking-[-0.025em] text-[var(--ink-0)]">
              {guide.description}
            </p>
            <a
              href={guide.guideUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              data-cursor-label="open ↗"
              className="inline-flex min-h-14 w-fit items-center justify-center border border-[var(--ink-0)] bg-[var(--ink-0)] px-5 py-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--cream-0)] transition-colors hover:border-[var(--cinnamon)] hover:bg-[var(--cinnamon)] hover:text-[var(--ink-0)]"
            >
              open full guide ↗
            </a>
          </div>
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
      </div>
    </section>
  );
}
