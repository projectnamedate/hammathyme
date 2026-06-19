import { notFound } from "next/navigation";
import Image from "next/image";
import { JsonLd } from "@/components/JsonLd";
import { ViewLink } from "@/components/ViewLink";
import { PipelineVisualizer } from "@/components/PipelineVisualizer";
import { Wordmark } from "@/components/Wordmark";
import { FadeIn } from "@/components/motion/FadeIn";
import { MaskReveal } from "@/components/motion/MaskReveal";
import {
  ConsistencyLabDemo,
  DotDisciplineGame,
  KiraChatDemo,
  PromptStoryboardDemo,
} from "@/components/interactives/InteractiveDemos";
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
import {
  buildBreadcrumbJsonLd,
  buildCreativeWorkJsonLd,
  buildPieceMetadata,
  buildVideoObjectJsonLd,
} from "@/lib/seo";
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
  return item && category ? buildPieceMetadata(category, item) : { title: "work" };
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
  const showStandardHeader = category.slug !== "brand-systems";

  return (
    <main className="relative min-h-[100svh] w-screen px-6 pt-28 pb-16 md:px-24 md:pt-32 md:pb-24">
      <JsonLd
        jsonLd={[
          buildCreativeWorkJsonLd(category, piece),
          buildVideoObjectJsonLd(category, piece),
          buildBreadcrumbJsonLd([
            { name: "home", path: "/" },
            { name: "work", path: "/work" },
            { name: category.title, path: `/work/${category.slug}` },
            { name: piece.title, path: `/work/${category.slug}/${piece.slug}` },
          ]),
        ]}
      />
      {showStandardHeader ? (
        <FadeIn duration={0.65} y={18}>
          <DetailHeader category={category} piece={piece} />
        </FadeIn>
      ) : (
        <FadeIn duration={0.65} y={18}>
          <DetailMetaBar category={category} piece={piece} />
        </FadeIn>
      )}
      <FadeIn delay={showStandardHeader ? 0.08 : 0} duration={0.7} y={24}>
        {renderPieceDetail(category, piece, transitionName)}
      </FadeIn>
    </main>
  );
}

function DetailMetaBar({ category, piece }: { category: CaseStudy; piece: Piece }) {
  return (
    <header className="mx-auto mb-8 flex max-w-[1440px] items-center justify-between gap-5 border-b border-[var(--ink-4)] pb-5 md:mb-10">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--cinnamon)]">
        {category.capabilityLabel} · {statusLabel(piece.status)}
      </p>
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

function DetailHeader({ category, piece }: { category: CaseStudy; piece: Piece }) {
  return (
    <header className="mx-auto mb-8 flex max-w-[1440px] flex-col gap-5 border-b border-[var(--ink-4)] pb-6 md:mb-10 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--cinnamon)]">
          {category.capabilityLabel} · {statusLabel(piece.status)}
        </p>
        <MaskReveal direction="up" delay={0.16} duration={0.72}>
          <h1 className="mt-3 pb-[0.18em] font-display text-[clamp(44px,7vw,116px)] font-bold lowercase leading-[0.92] tracking-normal text-[var(--ink-0)]">
            {piece.slug === "hammer" ? (
              <Wordmark size="lg" ariaLabel="hammer" className="align-baseline" />
            ) : (
              piece.title
            )}
          </h1>
        </MaskReveal>
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
  if (key === "motion-graphics/internet-capital-markets") {
    return <InternetCapitalMarketsDetail transitionName={transitionName} />;
  }
  if (key === "motion-graphics/audio-reactive-overlays") {
    return <AudioReactiveOverlayDetail transitionName={transitionName} />;
  }
  if (key === "motion-graphics/spring-health") {
    return <SpringHealthDetail transitionName={transitionName} />;
  }
  if (key === "pipelines-tools/pipeline-visualizer") {
    return <PipelineDetail piece={piece} transitionName={transitionName} />;
  }
  if (key === "pipelines-tools/prompt-library") {
    return <PromptLibraryDetail piece={piece} transitionName={transitionName} />;
  }
  if (key === "pipelines-tools/creative-skills") {
    return <CreativeSkillsDetail piece={piece} transitionName={transitionName} />;
  }
  if (key === "interactive-playable/prompt-to-storyboard") return <PromptStoryboardDemo />;
  if (key === "interactive-playable/consistency-lab") return <ConsistencyLabDemo />;
  if (key === "interactive-playable/talk-to-character") return <KiraChatDemo />;
  if (key === "interactive-playable/dot-discipline") return <DotDisciplineGame />;
  if (key === "visual-media/equinox") return <EquinoxCampaignDetail transitionName={transitionName} />;
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
    slug: "hammer",
    status: "live portfolio system",
    liveUrl: "https://hammer.ad",
    summary:
      "The current Hammer site is itself a finished portfolio asset: a warm editorial identity, eight-category work atrium, detail-route gallery model, motion surfaces, and source-readable docs.",
    stack: ["next.js 16", "react 19", "tailwind v4", "motion", "view transitions", "vercel"],
    facts: [
      ["model", "gallery-first category routes with detail pages for finished work"],
      ["brand", "Outfit wordmark, warm cream system, cinnamon dot, serif italic accents"],
      ["surfaces", "brand dossiers, reel video, pipeline visualizer, agents, websites"],
      ["docs", "AGENTS, brand guide, llms.txt, and public memory kept in sync with code"],
    ],
    shots: [
      {
        src: "/work/websites/hammathyme/home.png",
        label: "entry hall",
        alt: "Hammer homepage screenshot",
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
      "onlykira.ai is the public microsite for Kira: an agent-character web surface built from the Kira bible, live media language, and AI-native site production.",
    stack: ["next.js 15", "react 19", "gsap", "lenis", "brand bible", "ai media"],
    facts: [
      ["site", "live at onlykira.ai"],
      ["role", "public home for the autonomous agent character brand"],
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
    slug: "agentify",
    status: "live agent-payment readiness site",
    liveUrl: "https://agentify.nexus",
    summary:
      "agentify.nexus is the public proof surface for Agentify: a cinematic agent-payment readiness site with service catalog, free audit path, legal routes, and agent-readable manifests.",
    stack: ["next.js 15", "webgl2 shaders", "mcp", "llms.txt", "service catalog", "vercel"],
    facts: [
      ["offer", "agent-payment readiness audits and integration builds for commerce and B2B teams"],
      ["brand", "Nocturne Ledger v2: Ledger Gate mark, rail wordmark, dark protocol field"],
      ["proof", "robots, llms files, well-known manifests, markdown twins, and public MCP route"],
      ["funnel", "free readiness audit first; paid implementation quoted only after fit is clear"],
    ],
    shots: [
      {
        src: "/work/websites/agentify/live.jpeg",
        label: "agentify.nexus",
        alt: "Agentify live website screenshot",
        width: 1440,
        height: 4524,
        tone: "dark",
      },
    ],
  },
];

function WebsiteDetail({ piece, transitionName }: { piece: Piece; transitionName: string }) {
  const detail = WEBSITE_DETAILS.find((item) => item.slug === piece.slug);
  if (!detail) notFound();

  const [hero] = detail.shots;
  const secondaryShots = detail.shots.slice(1, 4);
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
    <section className="mx-auto max-w-[1320px]">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-x-8">
        <aside className="md:col-span-3">
          <p className="font-display text-[clamp(18px,1.5vw,24px)] font-light lowercase leading-[1.4] tracking-[-0.015em] text-[var(--ink-1)]">
            A compact reel of AI motion work: Remotion, HyperFrames, brand identity motion,
            kinetic type, data motion, particles, and early audio-reactive animation tests.
          </p>
          <p className="mt-5 border-t border-[var(--ink-4)] pt-4 font-mono text-[10px] uppercase leading-[1.65] tracking-[0.14em] text-[var(--ink-2)]">
            code-rendered motion · web video · social crops
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
      </div>
    </section>
  );
}

function EquinoxCampaignDetail({ transitionName }: { transitionName: string }) {
  const frameStyle: CSSProperties = { viewTransitionName: transitionName };
  return (
    <section className="mx-auto max-w-[1320px]">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-x-8">
        <aside className="md:col-span-3">
          <p className="font-display text-[clamp(18px,1.5vw,24px)] font-light lowercase leading-[1.4] tracking-normal text-[var(--ink-1)]">
            Production support for Angry Gods on Equinox's campaign spot. Synthetic spectacle resolves
            into a grounded idea: the body as proof.
          </p>
          <dl className="mt-5 grid grid-cols-1 gap-4 border-t border-[var(--ink-4)] pt-4">
            {[
              ["client", "Equinox"],
              ["agency", "Angry Gods"],
              ["format", "30s · 1276x720 · 24fps · h264/aac"],
              ["source", "Angry Gods"],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--cinnamon)]">
                  {label}
                </dt>
                <dd className="mt-2 font-mono text-[10px] uppercase leading-[1.65] tracking-[0.14em] text-[var(--ink-2)]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
        <div
          className="relative overflow-hidden border border-[var(--ink-3)] bg-[var(--cream-1)] p-2 shadow-[0_24px_80px_rgba(31,7,7,0.08)] md:col-span-9 md:p-4"
          style={frameStyle}
        >
          <video
            aria-label="Equinox Question Everything But Yourself campaign spot"
            className="block aspect-video w-full bg-[var(--cream-0)]"
            controls
            playsInline
            preload="metadata"
            poster="/work/visual-media/equinox/equinox-question-everything-but-yourself-poster.jpg"
          >
            <source
              src="/work/visual-media/equinox/equinox-question-everything-but-yourself.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 border-y border-[var(--ink-4)] py-5 md:grid-cols-12 md:gap-x-8">
        <p className="font-display text-[clamp(18px,1.5vw,24px)] font-light lowercase leading-[1.4] tracking-normal text-[var(--ink-1)] md:col-span-7">
          The spot uses unstable AI-coded imagery as the setup, then resolves into the campaign line:
          question everything but yourself.
        </p>
        <p className="font-mono text-[10px] uppercase leading-[1.65] tracking-[0.14em] text-[var(--ink-2)] md:col-span-5">
          source: Angry Gods
        </p>
      </div>
    </section>
  );
}

function InternetCapitalMarketsDetail({ transitionName }: { transitionName: string }) {
  const frameStyle: CSSProperties = { viewTransitionName: transitionName };
  return (
    <section className="mx-auto max-w-[1320px]">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-x-8">
        <aside className="md:col-span-3">
          <p className="font-display text-[clamp(18px,1.5vw,24px)] font-light lowercase leading-[1.4] tracking-normal text-[var(--ink-1)]">
            The ICM trailer package puts crypto-market footage, pixel-title cards, lower thirds,
            and screen inserts into one finished film teaser.
          </p>
          <p className="mt-5 border-t border-[var(--ink-4)] pt-4 font-mono text-[10px] uppercase leading-[1.65] tracking-[0.14em] text-[var(--ink-2)]">
            2m 46s · 1920x1080 · 23.976fps · h264/aac
          </p>
        </aside>
        <div
          className="relative overflow-hidden border border-[var(--ink-3)] bg-[var(--cream-1)] p-2 shadow-[0_24px_80px_rgba(31,7,7,0.08)] md:col-span-9 md:p-4"
          style={frameStyle}
        >
          <video
            aria-label="ICM teaser motion graphics video"
            className="block aspect-video w-full bg-[var(--cream-0)]"
            controls
            playsInline
            preload="metadata"
            poster="/work/motion/icm/icm-the-movie-trailer-poster.jpg"
          >
            <source src="/work/motion/icm/icm-the-movie-trailer-web.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}

function AudioReactiveOverlayDetail({ transitionName }: { transitionName: string }) {
  const frameStyle: CSSProperties = { viewTransitionName: transitionName };
  return (
    <section className="mx-auto max-w-[1320px]">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-x-8">
        <aside className="md:col-span-3">
          <p className="font-display text-[clamp(18px,1.5vw,24px)] font-light lowercase leading-[1.4] tracking-normal text-[var(--ink-1)]">
            A 64-second Remotion overlay driven by energy, band, centroid, and beat analysis.
            Designed response layers turn the track into motion graphics without fake instrument readouts.
          </p>
          <p className="mt-5 border-t border-[var(--ink-4)] pt-4 font-mono text-[10px] uppercase leading-[1.65] tracking-[0.14em] text-[var(--ink-2)]">
            64s · 1920x1080 · 24fps · h264/aac
          </p>
        </aside>
        <div
          className="relative overflow-hidden border border-[var(--ink-3)] bg-[var(--cream-1)] p-2 shadow-[0_24px_80px_rgba(31,7,7,0.08)] md:col-span-9 md:p-4"
          style={frameStyle}
        >
          <video
            aria-label="Hammer audio reactive overlays motion graphics video"
            className="block aspect-video w-full bg-[var(--cream-0)]"
            controls
            playsInline
            preload="metadata"
            poster="/work/motion/audio-reactive/audio-reactive-overlay-poster.png"
          >
            <source src="/work/motion/audio-reactive/audio-reactive-overlay-h264.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      <div className="mt-10 border-y border-[var(--ink-4)] py-5">
        <p className="max-w-[78ch] font-mono text-[10px] uppercase leading-[1.65] tracking-[0.14em] text-[var(--ink-2)]">
          music:{" "}
          <a
            href="https://freemusicarchive.org/music/Loyalty_Freak_Music/ROBOT_DANCE_/Loyalty_Freak_Music_-_ROBOT_DANCE__-_02_High_Technologic_Beat_Explosion/"
            className="underline decoration-[var(--ink-3)] underline-offset-4 hover:text-[var(--cinnamon)]"
          >
            High Technologic Beat Explosion
          </a>{" "}
          by Loyalty Freak Music. source track listed as CC0 1.0 Universal by{" "}
          <a
            href="https://commons.wikimedia.org/wiki/File:Loyalty_Freak_Music_-_02_-_High_Technologic_Beat_Explosion.ogg"
            className="underline decoration-[var(--ink-3)] underline-offset-4 hover:text-[var(--cinnamon)]"
          >
            Wikimedia Commons
          </a>
          .
        </p>
      </div>
    </section>
  );
}

function SpringHealthDetail({ transitionName }: { transitionName: string }) {
  const frameStyle: CSSProperties = { viewTransitionName: transitionName };
  return (
    <section className="mx-auto max-w-[1320px]">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-x-8">
        <aside className="md:col-span-3">
          <p className="font-display text-[clamp(18px,1.5vw,24px)] font-light lowercase leading-[1.4] tracking-normal text-[var(--ink-1)]">
            A Spring Health motion showcase built from brand guidelines, product UI,
            care-system storytelling, and HyperFrames production polish.
          </p>
          <dl className="mt-5 grid grid-cols-1 gap-4 border-t border-[var(--ink-4)] pt-4">
            {[
              ["client", "Spring Health"],
              ["scope", "brand motion · product UI · care-system reel"],
              ["system", "HyperFrames · Spring brand tokens · 30fps delivery"],
              ["format", "51s · 1920x1080 · 30fps · h264/aac"],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--cinnamon)]">
                  {label}
                </dt>
                <dd className="mt-2 font-mono text-[10px] uppercase leading-[1.65] tracking-[0.14em] text-[var(--ink-2)]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
        <div
          className="relative overflow-hidden border border-[var(--ink-3)] bg-[var(--cream-1)] p-2 shadow-[0_24px_80px_rgba(31,7,7,0.08)] md:col-span-9 md:p-4"
          style={frameStyle}
        >
          <video
            aria-label="Spring Health motion showcase reel"
            className="block aspect-video w-full bg-[var(--cream-0)]"
            controls
            playsInline
            preload="metadata"
            poster="/work/motion/spring-health/spring-health-showcase-poster.jpg"
          >
            <source src="/work/motion/spring-health/spring-health-showcase.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 border-y border-[var(--ink-4)] py-5 md:grid-cols-12 md:gap-x-8">
        <p className="font-display text-[clamp(18px,1.5vw,24px)] font-light lowercase leading-[1.4] tracking-normal text-[var(--ink-1)] md:col-span-7">
          The reel turns Spring Health's static identity into reusable motion: brand translation,
          product storytelling, system clarity, and final delivery in one compact cut.
        </p>
        <p className="font-mono text-[10px] uppercase leading-[1.65] tracking-[0.14em] text-[var(--ink-2)] md:col-span-5">
          music: EDM Detection Mode by Kevin MacLeod, licensed under Creative Commons: By Attribution.
        </p>
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

const PROMPT_LIBRARY_LAYERS = [
  {
    label: "intake",
    artifact: "production brief",
    copy: "turn a loose ask into one sharp brief: audience, output, constraints, and proof.",
  },
  {
    label: "taste",
    artifact: "style lock",
    copy: "protect the visual language before any model gets a chance to flatten it.",
  },
  {
    label: "recipe",
    artifact: "prompt pack",
    copy: "shape model behavior with inputs, aspect rules, negative space, and fallback paths.",
  },
  {
    label: "gate",
    artifact: "select sheet",
    copy: "score outputs against the brief, mark selects, and stop drift before it spreads.",
  },
  {
    label: "handoff",
    artifact: "operator note",
    copy: "leave the next producer a clear pickup state, not a mystery folder.",
  },
] as const;

const AGENT_STACK_ROWS = [
  ["director", "taste and corrections"],
  ["brief", "scope and proof"],
  ["skills", "rules and recipes"],
  ["tools", "generation and build"],
  ["proof", "validation and live checks"],
] as const;

function PromptLibraryDetail({ piece, transitionName }: { piece: Piece; transitionName: string }) {
  const frameStyle: CSSProperties = { viewTransitionName: transitionName };
  return (
    <section className="mx-auto max-w-[1440px]">
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-x-12">
        <p className="font-display text-[clamp(18px,1.5vw,24px)] font-light lowercase leading-[1.42] tracking-[-0.015em] text-[var(--ink-1)] md:col-span-5">
          {piece.blurb}
        </p>
        <p className="font-mono text-[10px] uppercase leading-[1.8] tracking-[0.18em] text-[var(--ink-2)] md:col-span-4 md:col-start-9">
          public architecture · private prompt text withheld · review gates exposed
        </p>
      </div>

      <div
        className="tool-panel border border-[var(--ink-4)] bg-[var(--cream-1)] p-5 shadow-[0_24px_80px_rgba(31,7,7,0.08)] md:p-8"
        style={frameStyle}
      >
        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-x-10">
          <div className="md:col-span-7">
            <PromptStackDiagram />
          </div>
          <div className="md:col-span-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--cinnamon)]">
              readable method, protected craft
            </p>
            <p className="mt-4 font-display text-[clamp(22px,2.2vw,40px)] font-light leading-[1.12] tracking-[-0.025em] text-[var(--ink-0)]">
              The value is not a secret prompt. It is the judgment to frame the ask, reject the drift, and protect the
              signal.
            </p>
            <p className="mt-7 border-t border-[var(--ink-4)] pt-4 font-mono text-[10px] uppercase leading-[1.65] tracking-[0.14em] text-[var(--ink-2)]">
              public method · private prompt text withheld · review gates exposed
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CreativeSkillsDetail({ piece, transitionName }: { piece: Piece; transitionName: string }) {
  const frameStyle: CSSProperties = { viewTransitionName: transitionName };
  return (
    <section className="mx-auto max-w-[1440px]">
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-x-12">
        <p className="font-display text-[clamp(18px,1.5vw,24px)] font-light lowercase leading-[1.42] tracking-[-0.015em] text-[var(--ink-1)] md:col-span-5">
          {piece.blurb}
        </p>
        <p className="font-mono text-[10px] uppercase leading-[1.8] tracking-[0.18em] text-[var(--ink-2)] md:col-span-4 md:col-start-9">
          skill router · agent stack · repeatable creative operations
        </p>
      </div>

      <div
        className="tool-panel grid grid-cols-1 gap-8 border border-[var(--ink-4)] bg-[var(--cream-1)] p-5 shadow-[0_24px_80px_rgba(31,7,7,0.08)] md:grid-cols-12 md:gap-x-10 md:p-8"
        style={frameStyle}
      >
        <div className="relative md:col-span-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--cinnamon)]">
            operating layer
          </p>
          <p className="mt-4 font-display text-[clamp(24px,2.7vw,52px)] font-light leading-[1.05] tracking-[-0.035em] text-[var(--ink-0)]">
            Skills keep taste from resetting at every prompt.
          </p>
          <p className="mt-5 font-display text-[clamp(15px,1.1vw,18px)] font-light leading-[1.5] tracking-[-0.01em] text-[var(--ink-1)]">
            This is the layer between a director's note and a tool call: brand rules, production recipes,
            verification habits, and review formats that keep outputs from going generic.
          </p>
          <p className="mt-7 border-t border-[var(--ink-4)] pt-4 font-mono text-[10px] uppercase leading-[1.65] tracking-[0.14em] text-[var(--ink-2)]">
            taste rules · production recipes · validation habits
          </p>
        </div>
        <div className="md:col-span-7">
          <AgentStackDiagram />
        </div>
      </div>
    </section>
  );
}

function PromptStackDiagram() {
  return (
    <svg viewBox="0 0 720 440" role="img" aria-label="Prompt library stack diagram" className="h-auto w-full">
      <defs>
        <linearGradient id="prompt-sheen" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--cream-0)" />
          <stop offset="48%" stopColor="var(--cream-2)" stopOpacity="0.34" />
          <stop offset="100%" stopColor="var(--cream-0)" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="718" height="438" fill="url(#prompt-sheen)" stroke="var(--ink-4)" />
      <rect x="22" y="22" width="676" height="396" fill="none" stroke="var(--ink-4)" strokeDasharray="2 10" opacity="0.72" />
      <rect className="tool-scanline" x="24" y="34" width="672" height="58" fill="var(--cinnamon)" opacity="0.16" />
      <g fontFamily="var(--font-mono)" fontSize="11" letterSpacing="1.8">
        {PROMPT_LIBRARY_LAYERS.map((layer, index) => {
          const y = 52 + index * 72;
          const delay = `${120 + index * 110}ms`;
          return (
            <g key={layer.label} className="tool-flow-card" style={{ "--tool-delay": delay } as CSSProperties}>
              <rect
                x="42"
                y={y}
                width="250"
                height="44"
                fill={index === 1 ? "var(--cinnamon)" : "var(--cream-1)"}
                stroke="var(--ink-3)"
              />
              <rect x="50" y={y + 8} width="16" height="28" fill="var(--ink-0)" opacity={index === 1 ? 0.14 : 0.06} />
              <text x="60" y={y + 27} fill="var(--ink-0)">
                {String(index + 1).padStart(2, "0")} / {layer.label}
              </text>
              <path
                className="tool-flow-line"
                style={{ "--tool-delay": `${260 + index * 110}ms` } as CSSProperties}
                d={`M 292 ${y + 22} H 392`}
                stroke="var(--ink-3)"
                strokeWidth="1.2"
              />
              <circle
                className="tool-flow-node"
                style={{ "--tool-delay": `${420 + index * 95}ms` } as CSSProperties}
                cx="392"
                cy={y + 22}
                r="4"
                fill="var(--cinnamon)"
              />
              <rect x="422" y={y - 4} width="220" height="52" fill="var(--cream-1)" stroke="var(--ink-4)" />
              <line x1="438" y1={y + 36} x2="620" y2={y + 36} stroke="var(--ink-4)" strokeWidth="1" />
              <text x="442" y={y + 27} fill="var(--ink-1)">
                {layer.artifact}
              </text>
            </g>
          );
        })}
      </g>
      <path className="tool-orbit-path" d="M 392 74 V 362" stroke="var(--cinnamon)" strokeWidth="1.4" />
      <text
        x="42"
        y="404"
        fill="var(--ink-2)"
        fontFamily="var(--font-mono)"
        fontSize="10"
        letterSpacing="2"
      >
        BRIEF TO REVIEWED HANDOFF · PROMPTS STAY PRIVATE, PROCESS STAYS READABLE
      </text>
    </svg>
  );
}

function AgentStackDiagram() {
  return (
    <svg viewBox="0 0 780 440" role="img" aria-label="Creative skills agent stack diagram" className="h-auto w-full">
      <defs>
        <radialGradient id="skill-glow" cx="50%" cy="40%" r="62%">
          <stop offset="0%" stopColor="var(--cinnamon)" stopOpacity="0.22" />
          <stop offset="45%" stopColor="var(--cream-2)" stopOpacity="0.24" />
          <stop offset="100%" stopColor="var(--cream-0)" />
        </radialGradient>
      </defs>
      <rect x="1" y="1" width="778" height="438" fill="url(#skill-glow)" stroke="var(--ink-4)" />
      <rect className="tool-scanline" x="42" y="64" width="696" height="66" fill="var(--cream-0)" opacity="0.28" />
      <g fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1.7">
        {AGENT_STACK_ROWS.map(([label], index) => {
          const x = 52 + index * 140;
          const isHot = index === 2;
          const delay = `${120 + index * 110}ms`;
          return (
            <g key={label} className="tool-flow-card" style={{ "--tool-delay": delay } as CSSProperties}>
              <rect
                x={x}
                y="120"
                width="108"
                height="108"
                fill={isHot ? "var(--cinnamon)" : "var(--cream-1)"}
                stroke="var(--ink-3)"
              />
              <rect x={x + 8} y="128" width="92" height="92" fill="none" stroke={isHot ? "var(--cream-0)" : "var(--ink-4)"} opacity="0.65" />
              <circle
                className="tool-orbit-node"
                style={{ "--tool-delay": `${240 + index * 120}ms` } as CSSProperties}
                cx={x + 54}
                cy="174"
                r="20"
                fill={isHot ? "var(--cream-0)" : "var(--ink-0)"}
                opacity="0.92"
              />
              <circle cx={x + 54} cy="174" r="5" fill={isHot ? "var(--ink-0)" : "var(--cinnamon)"} />
              <text x={x + 54} y="270" textAnchor="middle" fill="var(--ink-1)">
                {label}
              </text>
            </g>
          );
        })}
      </g>
      <text
        x="52"
        y="372"
        fill="var(--ink-2)"
        fontFamily="var(--font-mono)"
        fontSize="10"
        letterSpacing="2"
      >
        DIRECTOR NOTE IN · SKILLED TOOL USE · VERIFIED CREATIVE OUTPUT OUT
      </text>
    </svg>
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
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-2)]">
                  {guide.status}
                </p>
              </div>
              <h1 className="mt-5 pb-[0.18em] lowercase leading-none text-[var(--ink-0)]">
                <BrandGuideLogo guide={guide} />
              </h1>
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
              className="inline-flex min-h-14 w-fit items-center justify-center border border-[var(--ink-3)] bg-[var(--cream-0)] px-5 py-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ink-0)] transition-colors hover:border-[var(--cinnamon)] hover:bg-[var(--cinnamon)] hover:text-[var(--ink-0)]"
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

function BrandGuideLogo({ guide }: { guide: BrandGuideProfile }) {
  if (guide.slug === "hammer") {
    return <Wordmark size="lg" ariaLabel="hammer" className="align-baseline" />;
  }

  if (guide.slug === "kira") {
    return (
      <span
        className="block font-serif text-[clamp(74px,9vw,156px)] font-normal italic leading-[0.86] tracking-[-0.06em]"
        style={{ color: "#0F0F0F", fontFamily: '"Playfair Display", "Instrument Serif", Georgia, serif' }}
      >
        kira
      </span>
    );
  }

  if (guide.slug === "effigy") {
    return (
      <span className="flex flex-wrap items-end gap-5 md:gap-7">
        <EffigyLogomark className="h-[clamp(70px,9vw,150px)] w-auto shrink-0" />
        <span
          className="font-mono text-[clamp(58px,7vw,132px)] font-black leading-[0.82] tracking-[-0.065em]"
          style={{ color: "#0A1230", fontFamily: '"JetBrains Mono", "Geist Mono", ui-monospace, monospace' }}
        >
          effigy
        </span>
      </span>
    );
  }

  if (guide.slug === "agentify") {
    return <AgentifyWordmark />;
  }

  return (
    <span className="font-display text-[clamp(58px,8vw,132px)] font-light tracking-[-0.04em]">
      {guide.title}
    </span>
  );
}

function AgentifyWordmark() {
  return (
    <span className="inline-flex flex-wrap items-center gap-4 md:gap-5">
      <AgentifyLedgerGate className="h-[clamp(54px,6.4vw,104px)] w-auto shrink-0" />
      <span
        className="relative inline-block pr-[0.34em] pb-[0.18em] font-serif text-[clamp(70px,8vw,150px)] font-normal italic leading-[0.84] tracking-[-0.055em]"
        style={{ color: "#0C0D16", fontFamily: '"Instrument Serif", Georgia, serif' }}
      >
        <span
          aria-hidden
          className="absolute right-[0.05em] bottom-[-0.035em] left-[-0.06em] h-[0.018em] bg-[#C7A66A]"
        />
        <span
          aria-hidden
          className="absolute right-[-0.03em] bottom-[-0.07em] size-[0.08em] rounded-full bg-[#C7A66A]"
        />
        agentify
      </span>
    </span>
  );
}

function AgentifyLedgerGate({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" aria-hidden className={className}>
      <path d="M22 22 H74" stroke="#0C0D16" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M22 22 V78" stroke="#0C0D16" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M74 22 V78" stroke="#0C0D16" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M4 50 H92" stroke="#8B6CFF" strokeWidth="4" strokeLinecap="round" fill="none" />
      <circle cx="48" cy="50" r="4.6" fill="#4EC6DA" />
      <path d="M30 78 H66" stroke="#4EC6DA" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.55" />
    </svg>
  );
}

function EffigyLogomark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 130 230"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <g transform="translate(16, 10)">
        <circle cx="40" cy="30" r="16" fill="#78A7FF" />
        <path d="M 34 50 L 46 50 L 48 58 L 32 58 Z" fill="#78A7FF" />
        <path d="M 24 58 L 56 58 L 66 180 L 14 180 Z" fill="#78A7FF" />
        <rect x="8" y="184" width="64" height="28" fill="#78A7FF" />
      </g>
      <circle cx="40" cy="30" r="16" fill="#0A1230" />
      <path d="M 34 50 L 46 50 L 48 58 L 32 58 Z" fill="#0A1230" />
      <path d="M 24 58 L 56 58 L 66 180 L 14 180 Z" fill="#0A1230" />
      <rect x="8" y="184" width="64" height="28" fill="#0A1230" />
    </svg>
  );
}
