import { notFound } from "next/navigation";
import Image from "next/image";
import { JsonLd } from "@/components/JsonLd";
import { TrackedLink } from "@/components/TrackedLink";
import { ViewLink } from "@/components/ViewLink";
import { PipelineVisualizer } from "@/components/PipelineVisualizer";
import { SplatViewer } from "@/components/SplatViewer";
import { WhaleAR } from "@/components/WhaleAR";
import { ProjectorFigure } from "@/components/figures/projector/ProjectorFigure";
import { CarWashFrame } from "@/components/figures/car-wash/CarWashFrame";
import { SushiScrambleGame } from "@/components/games/sushi-scramble/SushiScrambleGame";
import { SlopocalypseFrame } from "@/components/games/slopocalypse/SlopocalypseFrame";
import { BioBayFrame } from "@/components/games/bio-bay/BioBayFrame";
import { PortalWorldsFrame } from "@/components/games/portal-worlds/PortalWorldsFrame";
import { Wordmark } from "@/components/Wordmark";
import { FadeIn } from "@/components/motion/FadeIn";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { PromptStoryboardDemo } from "@/components/interactives/InteractiveDemos";
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
  if (key === "motion-graphics/chrome-hammer") return <ChromeHammerDetail transitionName={transitionName} />;
  if (key === "motion-graphics/reel") return <MotionReelDetail transitionName={transitionName} />;
  if (key === "motion-graphics/internet-capital-markets") {
    return <InternetCapitalMarketsDetail transitionName={transitionName} />;
  }
  if (key === "motion-graphics/spring-health") {
    return <SpringHealthDetail transitionName={transitionName} />;
  }
  if (key === "motion-graphics/spotify-titles") {
    return <SpotifyTitlesDetail transitionName={transitionName} />;
  }
  if (key === "pipelines-tools/pipeline-visualizer") {
    return <PipelineDetail piece={piece} transitionName={transitionName} />;
  }
  if (key === "pipelines-tools/creative-skills") {
    return <CreativeSkillsDetail piece={piece} transitionName={transitionName} />;
  }
  if (key === "pipelines-tools/qc-by-measurement") return <QcDetail transitionName={transitionName} />;
  if (key === "interactive-playable/sushi-scramble") return <SushiScrambleDetail transitionName={transitionName} />;
  if (key === "interactive-playable/35mm-projector") return <ProjectorDetail transitionName={transitionName} />;
  if (key === "interactive-playable/slopocalypse") return <SlopocalypseDetail transitionName={transitionName} />;
  if (key === "interactive-playable/car-wash") return <CarWashDetail transitionName={transitionName} />;
  if (key === "interactive-playable/bioluminescent-bay") return <BioBayDetail transitionName={transitionName} />;
  if (key === "interactive-playable/portal-worlds") return <PortalWorldsDetail transitionName={transitionName} />;
  if (key === "interactive-playable/prompt-to-storyboard") return <PromptStoryboardDemo />;
  if (key === "vfx-cgi/environment-swap") return <EnvironmentSwapDetail transitionName={transitionName} />;
  if (key === "vfx-cgi/neural-set-capture") return <NeuralSetCaptureDetail transitionName={transitionName} />;
  if (key === "vfx-cgi/humpback-ar") return <HumpbackArDetail transitionName={transitionName} />;
  if (key === "film-animation/equinox") return <EquinoxCampaignDetail transitionName={transitionName} />;
  if (key === "film-animation/the-gunfight") return <TheGunfightDetail transitionName={transitionName} />;
  if (key === "film-animation/code-animation") return <CodeAnimationDetail transitionName={transitionName} />;
  if (category.slug === "websites") {
    return <WebsiteDetail piece={piece} transitionName={transitionName} />;
  }
  if (category.slug === "brand-systems") {
    const guide = category.brandGuides?.find((g) => g.slug === piece.slug);
    if (guide) return <BrandGuideDetail guide={guide} transitionName={transitionName} />;
  }
  notFound();
}

const SUSHI_SCRAMBLE_FACTS = [
  ["controls", "wasd · mouse to aim and fire · g ginger grenade · space jump · touch: twin sticks"],
  ["built with", "three.js · physically based materials · bokeh, bloom and ambient occlusion · web audio"],
  ["ai assets", "hero, hand and sushi: hunyuan 3d 3.1 from gpt image 2.5 designs · music: suno · ambience: elevenlabs"],
  ["set", "poly haven cc0 hdri and textures · lanterns, belt and plates built in code"],
];

function SushiScrambleDetail({ transitionName }: { transitionName: string }) {
  const frameStyle: CSSProperties = { viewTransitionName: transitionName };
  return (
    <section className="mx-auto max-w-[1320px]">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-x-8">
        <aside className="md:col-span-3">
          <p className="font-display text-[clamp(18px,1.5vw,24px)] font-light lowercase leading-[1.4] tracking-normal text-[var(--ink-1)]">
            A third-person shooter in a sushi bar. You are a salmon nigiri in power armour on a belt that never
            stops. Chopstick drones pinch, soy slows you down, and every third wave the diner reaches in.
          </p>
          <dl className="mt-5 grid grid-cols-1 gap-4 border-t border-[var(--ink-4)] pt-4">
            {SUSHI_SCRAMBLE_FACTS.map(([label, value]) => (
              <div key={label}>
                <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--cinnamon)]">{label}</dt>
                <dd className="mt-2 font-mono text-[10px] uppercase leading-[1.65] tracking-[0.14em] text-[var(--ink-2)]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
        <div className="relative md:col-span-9" style={frameStyle}>
          <SushiScrambleGame />
        </div>
      </div>
    </section>
  );
}

const PROJECTOR_FACTS = [
  ["mechanism", "4-slot geneva cross · 90° pull-down · front shutter, 1 to 3 blades"],
  ["film", "35mm · 4 perf · 0.825 × 0.602 in aperture · smpte universal leader"],
  ["built with", "anatomy skill · claude code · svg · webgl beam · web audio"],
  ["sources", "smpte st 139, st 195, st 242, st 55 · us patent 6,183,087"],
];

function ProjectorDetail({ transitionName }: { transitionName: string }) {
  const frameStyle: CSSProperties = { viewTransitionName: transitionName };
  return (
    <section className="mx-auto max-w-[1320px]">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-x-8">
        <aside className="md:col-span-3">
          <p className="font-display text-[clamp(18px,1.5vw,24px)] font-light lowercase leading-[1.4] tracking-normal text-[var(--ink-1)]">
            A 35mm projector, threaded and running. A Geneva cross pulls each frame into the
            gate and holds it still while the shutter flashes it twice.
          </p>
          <dl className="mt-5 grid grid-cols-1 gap-4 border-t border-[var(--ink-4)] pt-4">
            {PROJECTOR_FACTS.map(([label, value]) => (
              <div key={label}>
                <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--cinnamon)]">{label}</dt>
                <dd className="mt-2 font-mono text-[10px] uppercase leading-[1.65] tracking-[0.14em] text-[var(--ink-2)]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
        <div className="relative md:col-span-9" style={frameStyle}>
          <ProjectorFigure />
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 border-y border-[var(--ink-4)] py-5 md:grid-cols-12 md:gap-x-8">
        <p className="font-display text-[clamp(18px,1.5vw,24px)] font-light lowercase leading-[1.4] tracking-normal text-[var(--ink-1)] md:col-span-7">
          drawn in code with anatomy, a skill that explains an idea by building it as a working
          machine. the readout comes from the same model that moves the parts.
        </p>
        <p className="font-mono text-[10px] uppercase leading-[1.65] tracking-[0.14em] text-[var(--ink-2)] md:col-span-5">
          figure: hammer · kit:{" "}
          <TrackedLink
            event="outbound_click"
            data={{ piece: "35mm-projector", target: "anatomy" }}
            href="https://github.com/wheresryan22/anatomy"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-[var(--ink-3)] underline-offset-4 hover:text-[var(--cinnamon)]"
            data-cursor="link"
            data-cursor-label="open"
          >
            anatomy by wheresryan22
          </TrackedLink>{" "}
          (
          <a
            href="/licenses/anatomy.txt"
            className="underline decoration-[var(--ink-3)] underline-offset-4 hover:text-[var(--cinnamon)]"
            data-cursor="link"
            data-cursor-label="read"
          >
            mit
          </a>
          )
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-x-8">
        <p className="font-display text-[clamp(18px,1.5vw,24px)] font-light lowercase leading-[1.4] tracking-normal text-[var(--ink-1)] md:col-span-3">
          the same machine as a reveal film: 150 solid parts, turned, taken apart and put back together.
        </p>
        <div className="md:col-span-9">
          <video
            className="block h-auto w-full"
            src="/work/interactive-playable/35mm-projector/reveal-16x9.mp4"
            poster="/work/interactive-playable/35mm-projector/reveal-poster.jpg"
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            aria-label="The projector turns, shows its reels, lens, crank and lamphouse, comes apart into its parts and goes back together."
          />
          <p className="mt-3 font-mono text-[10px] uppercase leading-[1.65] tracking-[0.14em] text-[var(--ink-2)]">
            film: anatomy-reveal · motion blur sized to each frame&apos;s movement · 10 s
          </p>
        </div>
      </div>
    </section>
  );
}

const SLOPOCALYPSE_FACTS = [
  ["how to play", "find the keycards · open their doors · reach the exit · delete everything that moves · walls that look wrong hide secrets"],
  ["controls", "click to start · wasd move · mouse aims · click fires · space or e uses · 1-7, q or wheel switch guns · pgup and pgdn look · esc pauses · m mutes"],
  ["touch", "left half moves · right half turns · fire, use and weapon buttons"],
  ["built with", "three.js · 200-line palette renderer · 35 hz simulation on 1993 numbers · web audio"],
  ["ai assets", "monsters, guns, walls and props: gpt image 2.5 · sound: elevenlabs · music: suno"],
];

function SlopocalypseDetail({ transitionName }: { transitionName: string }) {
  const frameStyle: CSSProperties = { viewTransitionName: transitionName };
  return (
    <section className="mx-auto max-w-[1320px]">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-x-8">
        <aside className="md:col-span-3">
          <p className="font-display text-[clamp(18px,1.5vw,24px)] font-light lowercase leading-[1.4] tracking-normal text-[var(--ink-1)]">
            A 1993-style shooter where the demons are AI slop. Seven-fingered hands, melting stock-photo people
            and a giant influencer, across three episodes of a broken internet.
          </p>
          <dl className="mt-5 grid grid-cols-1 gap-4 border-t border-[var(--ink-4)] pt-4">
            {SLOPOCALYPSE_FACTS.map(([label, value]) => (
              <div key={label}>
                <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--cinnamon)]">{label}</dt>
                <dd className="mt-2 font-mono text-[10px] uppercase leading-[1.65] tracking-[0.14em] text-[var(--ink-2)]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
        <div className="relative md:col-span-9" style={frameStyle}>
          <SlopocalypseFrame />
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 border-y border-[var(--ink-4)] py-5 md:grid-cols-12 md:gap-x-8">
        <p className="font-display text-[clamp(18px,1.5vw,24px)] font-light lowercase leading-[1.4] tracking-normal text-[var(--ink-1)] md:col-span-7">
          the art is made the way 1993&apos;s was: photos of sculpted maquettes, keyed, shrunk and forced into
          one 256-colour palette. a script checks every pixel against it.
        </p>
        <p className="font-mono text-[10px] uppercase leading-[1.65] tracking-[0.14em] text-[var(--ink-2)] md:col-span-5">
          game: hammer · built with claude code · three episodes, twelve maps, twelve monsters, seven guns
        </p>
      </div>
    </section>
  );
}

const BIO_BAY_FACTS = [
  ["what to do", "walk the wet sand and each step lights up · stir the water and the light drifts on the current · wade into the school and it scatters · watch for the ray and the shooting stars · wait for the rain · wade out far enough and you slip under the surface"],
  ["controls", "wasd or arrows walk · right-drag or q and e look · left-drag stirs · m or the sound button mutes · phone: drag lower left to walk, one finger stirs, two fingers look, or tilt to look · postcard saves the view"],
  ["built with", "unity 6.3 web · urp shaders written by hand · a ping-pong glow map · every sound synthesized live in the browser · claude code in batch mode"],
  ["life", "jellyfish modelled in blender geometry nodes, pulsing in a vertex shader · fish and the ray drawn and animated in code, their wakes stamped into the glow map"],
];

function BioBayDetail({ transitionName }: { transitionName: string }) {
  const frameStyle: CSSProperties = { viewTransitionName: transitionName };
  return (
    <section className="mx-auto max-w-[1320px]">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-x-8">
        <aside className="md:col-span-3">
          <p className="font-display text-[clamp(18px,1.5vw,24px)] font-light lowercase leading-[1.4] tracking-normal text-[var(--ink-1)]">
            a night beach under the milky way where the plankton glow. your footsteps light the wet sand, waves ignite
            as they break, a school of fish and a manta ray trail light through the shallows, shooting stars cross the
            sky and rain lights the water drop by drop. under the surface the jellyfish glow from inside.
          </p>
          <dl className="mt-5 grid grid-cols-1 gap-4 border-t border-[var(--ink-4)] pt-4">
            {BIO_BAY_FACTS.map(([label, value]) => (
              <div key={label}>
                <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--cinnamon)]">{label}</dt>
                <dd className="mt-2 font-mono text-[10px] uppercase leading-[1.65] tracking-[0.14em] text-[var(--ink-2)]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
        <div className="relative md:col-span-9" style={frameStyle}>
          <BioBayFrame />
        </div>
      </div>
    </section>
  );
}

const PORTAL_WORLDS_FACTS = [
  ["what to do", "walk the castle hall · a soap bubble floats by the fireplace · walk up to it and it bursts open into a torn, sparkling window on a forest · step through · find the next bubble to the hall at night, and the mirror there brings you home"],
  ["controls", "click to look and hear · wasd or arrows walk · mouse looks · phone: drag to look, two fingers to walk"],
  ["built with", "three.js and spark 2.4 · three marble worlds by world labs · each world drawn by its own splat renderer into a render target · the bubble and its rim drawn per pixel in a shader · sound synthesized in code"],
];

function PortalWorldsDetail({ transitionName }: { transitionName: string }) {
  const frameStyle: CSSProperties = { viewTransitionName: transitionName };
  return (
    <section className="mx-auto max-w-[1320px]">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-x-8">
        <aside className="md:col-span-3">
          <p className="font-display text-[clamp(18px,1.5vw,24px)] font-light lowercase leading-[1.4] tracking-normal text-[var(--ink-1)]">
            three worlds made of gaussian splats, joined by bubble portals. a bubble wakes as you come near, bursts
            into a sparkling rim with the next world inside it, and you step straight through.
          </p>
          <dl className="mt-5 grid grid-cols-1 gap-4 border-t border-[var(--ink-4)] pt-4">
            {PORTAL_WORLDS_FACTS.map(([label, value]) => (
              <div key={label}>
                <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--cinnamon)]">{label}</dt>
                <dd className="mt-2 font-mono text-[10px] uppercase leading-[1.65] tracking-[0.14em] text-[var(--ink-2)]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
        <div className="relative md:col-span-9" style={frameStyle}>
          <PortalWorldsFrame />
        </div>
      </div>
    </section>
  );
}

const CAR_WASH_FACTS = [
  ["process", "pay · pull in · foam · brushes · rinse · wax · tire shine · blowers · drive off"],
  ["controls", "pay picks basic or deluxe · deluxe adds triple foam, wax and tire shine · the swatches repaint the car"],
  ["built with", "colorfigures skill · claude code · svg · hand-drawn wobble filter"],
];

function CarWashDetail({ transitionName }: { transitionName: string }) {
  const frameStyle: CSSProperties = { viewTransitionName: transitionName };
  return (
    <section className="mx-auto max-w-[1320px]">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-x-8">
        <aside className="md:col-span-3">
          <p className="font-display text-[clamp(18px,1.5vw,24px)] font-light lowercase leading-[1.4] tracking-normal text-[var(--ink-1)]">
            A tunnel car wash you run yourself. Pay at the kiosk, roll onto the conveyor, and the car rides
            through foam, brushes, rinse and blowers from muddy to dry.
          </p>
          <dl className="mt-5 grid grid-cols-1 gap-4 border-t border-[var(--ink-4)] pt-4">
            {CAR_WASH_FACTS.map(([label, value]) => (
              <div key={label}>
                <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--cinnamon)]">{label}</dt>
                <dd className="mt-2 font-mono text-[10px] uppercase leading-[1.65] tracking-[0.14em] text-[var(--ink-2)]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
        <div className="relative md:col-span-9" style={frameStyle}>
          <CarWashFrame />
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 border-y border-[var(--ink-4)] py-5 md:grid-cols-12 md:gap-x-8">
        <p className="font-display text-[clamp(18px,1.5vw,24px)] font-light lowercase leading-[1.4] tracking-normal text-[var(--ink-1)] md:col-span-7">
          drawn in code with colorfigures, a skill that builds everyday machines as hand-inked isometric
          figures. every station changes the car only as it passes.
        </p>
        <p className="font-mono text-[10px] uppercase leading-[1.65] tracking-[0.14em] text-[var(--ink-2)] md:col-span-5">
          figure: hammer · kit:{" "}
          <TrackedLink
            event="outbound_click"
            data={{ piece: "car-wash", target: "colorfigures" }}
            href="https://april-zhu.com/colorfigures"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-[var(--ink-3)] underline-offset-4 hover:text-[var(--cinnamon)]"
            data-cursor="link"
            data-cursor-label="open"
          >
            colorfigures by april zhu
          </TrackedLink>{" "}
          (
          <a
            href="/licenses/colorfigures.txt"
            className="underline decoration-[var(--ink-3)] underline-offset-4 hover:text-[var(--cinnamon)]"
            data-cursor="link"
            data-cursor-label="read"
          >
            mit
          </a>
          )
        </p>
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
      "The current Hammer site is itself a finished portfolio asset: a warm editorial identity, seven-category work atrium, detail-route gallery model, motion surfaces, and source-readable docs.",
    stack: ["next.js 16", "react 19", "tailwind v4", "motion", "view transitions", "vercel"],
    facts: [
      ["model", "gallery-first category routes with detail pages for finished work"],
      ["brand", "Outfit wordmark, warm cream system, cinnamon dot, serif italic accents"],
      ["surfaces", "films, a splat viewer, a projector you can crank, brand dossiers, websites"],
      ["docs", "AGENTS, brand guide, llms.txt, and public memory kept in sync with code"],
    ],
    shots: [
      {
        src: "/work/websites/hammathyme/home-v02.png",
        label: "entry hall",
        alt: "Hammer homepage screenshot",
        width: 1440,
        height: 1000,
      },
      {
        src: "/work/websites/hammathyme/atrium.png",
        label: "work atrium",
        alt: "Hammer work atrium screenshot",
        width: 1440,
        height: 1000,
      },
      {
        src: "/work/websites/hammathyme/code-animation.png",
        label: "code animation detail",
        alt: "Code animation detail page screenshot",
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
  {
    slug: "coefficient",
    status: "live stake-pool health dashboard",
    liveUrl: "https://coefficient.mythx.art",
    summary:
      "coefficient.mythx.art is a Solana stake-pool health dashboard built under the Mythx label: Nakamoto coefficient tracking, a 15-pool scorecard, validator reach and overlap views, and a daily cron indexer.",
    stack: ["next.js", "turso", "daily cron indexer", "solana stake-pool data"],
    facts: [
      ["product", "nakamoto coefficient tracker and stake-pool scorecard across 15 solana pools"],
      ["views", "pool scorecards, validator reach, and stake overlap"],
      ["data", "daily cron indexer writes fresh snapshots to turso"],
      ["label", "designed and built by Jeff Hammer under the mythx label"],
    ],
    shots: [
      {
        src: "/work/websites/coefficient/live.jpeg",
        label: "coefficient.mythx.art",
        alt: "coefficient.mythx.art stake pool scorecard home screenshot",
        width: 1200,
        height: 862,
        tone: "dark",
      },
      {
        src: "/work/websites/coefficient/reach.jpeg",
        label: "pool reach",
        alt: "coefficient.mythx.art stake pool reach and validator overlap view screenshot",
        width: 1200,
        height: 862,
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
            One continuous shot where every move sets off the next: kinetic type, a 3D bar chart,
            a dot-matrix globe, interface motion, and a three.js Rube Goldberg machine. 24 named
            motion moves, made entirely in code.
          </p>
          <p className="mt-5 border-t border-[var(--ink-4)] pt-4 font-mono text-[10px] uppercase leading-[1.65] tracking-[0.14em] text-[var(--ink-2)]">
            hyperframes · three.js · one shot, zero cuts
          </p>
        </aside>
        <div
          className="relative overflow-hidden border border-[var(--ink-3)] bg-[var(--cream-1)] p-2 shadow-[0_24px_80px_rgba(31,7,7,0.08)] md:col-span-9 md:p-4"
          style={frameStyle}
        >
          <video aria-label="Hammer motion graphics reel" className="block aspect-video w-full bg-[var(--cream-0)]" controls playsInline preload="metadata" poster="/work/motion/hammer-reel-v04-poster.jpg">
            <source src="/work/motion/hammer-reel-v04-web-hq-10bit-hevc.mp4" type='video/mp4; codecs="hvc1"' />
            <source
              src="/work/motion/hammer-reel-v04-web-max-h264.mp4"
              type='video/mp4; codecs="avc1.640032, mp4a.40.2"'
            />
          </video>
        </div>
      </div>
    </section>
  );
}

function EnvironmentSwapDetail({ transitionName }: { transitionName: string }) {
  const frameStyle: CSSProperties = { viewTransitionName: transitionName };
  return (
    <section className="mx-auto max-w-[1320px]">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-x-8">
        <aside className="md:col-span-3">
          <p className="font-display text-[clamp(18px,1.5vw,24px)] font-light lowercase leading-[1.4] tracking-normal text-[var(--ink-1)]">
            one first-person driving plate, many worlds. Aleph keeps the real dashboard, windshield,
            and forward motion and replaces only the landscape outside the glass.
          </p>
          <dl className="mt-5 grid grid-cols-1 gap-4 border-t border-[var(--ink-4)] pt-4">
            {[
              ["technique", "video-to-video environment swap"],
              ["model", "Runway Aleph 2"],
              ["plate", "one POV driving shot"],
              ["format", "5s · 1920x1080 · 24fps · h264"],
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
            aria-label="AI environment swap: one driving plate relit into neon, alien, crystal, and snow worlds"
            className="block aspect-video w-full bg-[var(--cream-0)]"
            controls
            playsInline
            preload="metadata"
            poster="/work/vfx-cgi/environment-swap/environment-swap-poster.jpg"
          >
            <source src="/work/vfx-cgi/environment-swap/environment-swap-web.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 border-y border-[var(--ink-4)] py-5 md:grid-cols-12 md:gap-x-8">
        <p className="font-display text-[clamp(18px,1.5vw,24px)] font-light lowercase leading-[1.4] tracking-normal text-[var(--ink-1)] md:col-span-7">
          the swap is prompt-driven and mask-free: name only what changes, keep the foreground. shoot
          the drive once, deliver it as any location: neon city, alien desert, blue crystal forest, alpine snow.
        </p>
        <p className="font-mono text-[10px] uppercase leading-[1.65] tracking-[0.14em] text-[var(--ink-2)] md:col-span-5">
          plate + edit: hammer · model: runway aleph 2
        </p>
      </div>
    </section>
  );
}

const SPLAT_DIR = "/work/vfx-cgi/neural-set-capture";
// Opening view matches the poster: training view 200, converted from the Blender Z-up frame.
const CAMERA: [number, number, number] = [40.65, 20, 13.47];
const TARGET: [number, number, number] = [10.16, 1.5, 1.35];

const SPLAT_STEPS = [
  { src: `${SPLAT_DIR}/step-1-film-frame.jpg`, label: "01 · film frame", alt: "The green saloon in a frame from The Gunfight" },
  { src: `${SPLAT_DIR}/step-2-isolated-still.jpg`, label: "02 · isolated still", alt: "The saloon isolated on a grey backdrop as a GPT Image 2.5 still" },
  { src: `${SPLAT_DIR}/step-3-hunyuan-mesh.jpg`, label: "03 · hunyuan 3d mesh", alt: "The saloon as a textured Hunyuan 3D mesh render" },
  { src: `${SPLAT_DIR}/step-4-splat-v02.jpg`, label: "04 · gaussian splat", alt: "The rebuilt main street rendered from the trained gaussian splat" },
];

function NeuralSetCaptureDetail({ transitionName }: { transitionName: string }) {
  const frameStyle: CSSProperties = { viewTransitionName: transitionName };
  return (
    <section className="mx-auto max-w-[1320px]">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-x-8">
        <aside className="md:col-span-3">
          <p className="font-display text-[clamp(18px,1.5vw,24px)] font-light lowercase leading-[1.4] tracking-normal text-[var(--ink-1)]">
            the main street from the gunfight, rebuilt as a 3D set and trained into a gaussian
            splat you can walk around.
          </p>
          <dl className="mt-5 grid grid-cols-1 gap-4 border-t border-[var(--ink-4)] pt-4">
            {[
              ["source", "frames from the gunfight"],
              ["assets", "gpt image 2.5 stills · hunyuan 3d 3.1 meshes"],
              ["set", "blender 5.1 · 304 posed renders"],
              ["splat", "brush on apple silicon · sog via splat-transform"],
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
          <SplatViewer
            src={`${SPLAT_DIR}/gunfight-street-v03.sog`}
            poster={`${SPLAT_DIR}/gunfight-street-poster-v02.jpg`}
            posterAlt="The rebuilt gunfight main street as a gaussian splat at golden hour"
            camera={CAMERA}
            target={TARGET}
            fov={35.1}
          />
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
        {SPLAT_STEPS.map((step) => (
          <figure key={step.src} className="border border-[var(--ink-4)] bg-[var(--cream-1)] p-2">
            <Image
              src={step.src}
              alt={step.alt}
              width={1280}
              height={720}
              sizes="(min-width: 768px) 25vw, 50vw"
              className="aspect-video w-full object-cover"
            />
            <figcaption className="mt-3 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ink-2)]">
              {step.label}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

const HUMPBACK_DIR = "/work/vfx-cgi/humpback-ar";

const HUMPBACK_STEPS = [
  { src: `${HUMPBACK_DIR}/step-1-reference.jpg`, label: "01 · gpt image 2.5 reference", alt: "A humpback whale reference image on a grey backdrop" },
  { src: `${HUMPBACK_DIR}/step-2-hunyuan-mesh.jpg`, label: "02 · hunyuan 3d mesh", alt: "The humpback as a textured Hunyuan 3D mesh render" },
  { src: `${HUMPBACK_DIR}/step-3-blender-rig.jpg`, label: "03 · blender rig and swim", alt: "The rigged humpback mid-stroke in Blender" },
];

function HumpbackArDetail({ transitionName }: { transitionName: string }) {
  const frameStyle: CSSProperties = { viewTransitionName: transitionName };
  return (
    <section className="mx-auto max-w-[1320px]">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-x-8">
        <aside className="md:col-span-3">
          <p className="font-display text-[clamp(18px,1.5vw,24px)] font-light lowercase leading-[1.4] tracking-normal text-[var(--ink-1)]">
            a full-size humpback that swims circles around you. open it on a phone and it lands in
            your room, on the table or at 15 metres.
          </p>
          <dl className="mt-5 grid grid-cols-1 gap-4 border-t border-[var(--ink-4)] pt-4">
            {[
              ["model", "gpt image 2.5 reference · hunyuan 3d 3.1 mesh"],
              ["rig", "blender 5.1 · spine skinned in code · 24s seamless lap"],
              ["scale", "15 m life-size · 0.6 m tabletop"],
              ["ar", "usdz for iphone quick look · glb for android scene viewer"],
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
          <WhaleAR qrSrc={`${HUMPBACK_DIR}/humpback-ar-qr.svg`} />
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-5">
        {HUMPBACK_STEPS.map((step) => (
          <figure key={step.src} className="border border-[var(--ink-4)] bg-[var(--cream-1)] p-2">
            <Image
              src={step.src}
              alt={step.alt}
              width={1280}
              height={720}
              sizes="(min-width: 640px) 33vw, 100vw"
              className="aspect-video w-full object-cover"
            />
            <figcaption className="mt-3 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ink-2)]">
              {step.label}
            </figcaption>
          </figure>
        ))}
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
            poster="/work/film-animation/equinox/equinox-question-everything-but-yourself-poster.jpg"
          >
            <source
              src="/work/film-animation/equinox/equinox-question-everything-but-yourself.mp4"
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

function TheGunfightDetail({ transitionName }: { transitionName: string }) {
  const frameStyle: CSSProperties = { viewTransitionName: transitionName };
  return (
    <section className="mx-auto max-w-[1320px]">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-x-8">
        <aside className="md:col-span-3">
          <p className="font-display text-[clamp(18px,1.5vw,24px)] font-light lowercase leading-[1.4] tracking-normal text-[var(--ink-1)]">
            Two old gunfighters meet on an empty main street at golden hour. The draw does not go
            the way the genre promises.
          </p>
          <dl className="mt-5 grid grid-cols-1 gap-4 border-t border-[var(--ink-4)] pt-4">
            {[
              ["production", "studioly pipeline · blender previz refs"],
              ["models", "nano banana 2.1 + midjourney stills · seedance 2.5 video · suno score"],
              ["format", "92s · 1920x808 · 2.39:1 · 24fps · h264/aac"],
              ["source", "studioly"],
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
            aria-label="The Gunfight, a western comedy short film"
            className="block aspect-[1920/808] w-full bg-[var(--ink-deepest)]"
            controls
            playsInline
            preload="metadata"
            poster="/work/film-animation/the-gunfight/the-gunfight-poster.jpg"
          >
            <source src="/work/film-animation/the-gunfight/the-gunfight-web.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 border-y border-[var(--ink-4)] py-5 md:grid-cols-12 md:gap-x-8">
        <p className="font-display text-[clamp(18px,1.5vw,24px)] font-light lowercase leading-[1.4] tracking-normal text-[var(--ink-1)] md:col-span-7">
          43 shots cut from Seedance 2.5 reference-to-video takes, then finished with a 35mm print
          look and real 250D grain. about two hundred dollars of generation spend.
        </p>
        <p className="font-mono text-[10px] uppercase leading-[1.65] tracking-[0.14em] text-[var(--ink-2)] md:col-span-5">
          production: hammer · pipeline: studioly
        </p>
      </div>
    </section>
  );
}

const CODE_ANIMATION_DIR = "/work/film-animation/code-animation";

const CODE_ANIMATION_FILMS = [
  { slug: "night-ferry", title: "night ferry", lane: "linocut · three spot plates", length: "27s" },
  { slug: "spore-sneeze", title: "spore sneeze", lane: "painted 2d · p5.brush", length: "19s" },
  { slug: "four-seasons", title: "four seasons", lane: "painted 2d on the gpu", length: "20s loop" },
  { slug: "paper-city", title: "paper city", lane: "fframes · rust + svg", length: "18s loop" },
  { slug: "shader-worlds", title: "shader worlds", lane: "fframes · gpu shaders", length: "16s loop" },
  { slug: "one-line", title: "one line", lane: "fframes · a single ink line", length: "16s loop" },
  { slug: "lantern-night", title: "lantern night", lane: "three.js + paint pass", length: "12s" },
];

function CodeAnimationDetail({ transitionName }: { transitionName: string }) {
  const frameStyle: CSSProperties = { viewTransitionName: transitionName };
  return (
    <section className="mx-auto max-w-[1320px]">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-x-8">
        <aside className="md:col-span-3">
          <p className="font-display text-[clamp(18px,1.5vw,24px)] font-light lowercase leading-[1.4] tracking-normal text-[var(--ink-1)]">
            The North Wind and the Sun, an Aesop fable drawn entirely in code, with seven shorts
            below. Every frame is a function of time, rendered headless and checked before it ships.
          </p>
          <dl className="mt-5 grid grid-cols-1 gap-4 border-t border-[var(--ink-4)] pt-4">
            {[
              ["written by", "claude opus 5.5 · directed by hammer"],
              ["lanes", "p5.brush · gpu painter · fframes · three.js"],
              ["sound", "eleven v4 voices · suno score · foley in code"],
              ["format", "82s · 1920x1080 · 24fps · h264/aac"],
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
            aria-label="The North Wind and the Sun, an Aesop fable drawn in code"
            className="block aspect-video w-full bg-[var(--ink-deepest)]"
            controls
            playsInline
            preload="metadata"
            poster={`${CODE_ANIMATION_DIR}/north-wind-poster.jpg`}
          >
            <source src={`${CODE_ANIMATION_DIR}/north-wind.mp4`} type="video/mp4" />
          </video>
        </div>
      </div>

      <ul className="mt-10 grid grid-cols-1 gap-6 border-t border-[var(--ink-4)] pt-8 sm:grid-cols-2 lg:grid-cols-3">
        {CODE_ANIMATION_FILMS.map((film) => (
          <li key={film.slug}>
            <div className="border border-[var(--ink-4)] bg-[var(--cream-1)] p-1.5">
              <video
                aria-label={`${film.title}, a short film drawn in code`}
                className="block aspect-video w-full bg-[var(--ink-deepest)]"
                controls
                playsInline
                preload="none"
                poster={`${CODE_ANIMATION_DIR}/${film.slug}-poster.jpg`}
              >
                <source src={`${CODE_ANIMATION_DIR}/${film.slug}.mp4`} type="video/mp4" />
              </video>
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-4">
              <p className="font-display text-[clamp(16px,1.3vw,20px)] font-light lowercase leading-tight text-[var(--ink-0)]">
                {film.title}
              </p>
              <p className="shrink-0 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ink-3)]">
                {film.length}
              </p>
            </div>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--cinnamon)]">
              {film.lane}
            </p>
          </li>
        ))}
      </ul>
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


function ChromeHammerDetail({ transitionName }: { transitionName: string }) {
  const frameStyle: CSSProperties = { viewTransitionName: transitionName };
  return (
    <section className="mx-auto max-w-[1320px]">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-x-8">
        <aside className="md:col-span-4">
          <p className="font-display text-[clamp(18px,1.5vw,24px)] font-light lowercase leading-[1.4] tracking-normal text-[var(--ink-1)]">
            a chrome drop splits, rains into the hammer wordmark, holds, then melts back into one drop. the last frame
            flows into the first, so it loops forever.
          </p>
          <dl className="mt-5 grid grid-cols-1 gap-4 border-t border-[var(--ink-4)] pt-4">
            {[
              ["built with", "three.js · raymarched in one shader: drops that blend into each other and a signed-distance wordmark · claude code"],
              ["sound", "synthesized from the frame numbers · every hit lands one frame after its picture"],
              ["format", "6s seamless loop · 1080x1080 · 30fps · h264/aac"],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--cinnamon)]">{label}</dt>
                <dd className="mt-2 font-mono text-[10px] uppercase leading-[1.65] tracking-[0.14em] text-[var(--ink-2)]">{value}</dd>
              </div>
            ))}
          </dl>
        </aside>
        <div className="relative md:col-span-8" style={frameStyle}>
          <video
            aria-label="a chrome drop that rains into the hammer wordmark and melts back, on a loop"
            className="block aspect-square w-full border border-[var(--ink-4)] bg-[#e9e9ea]"
            src="/work/motion/chrome-hammer/chrome-hammer.mp4"
            poster="/work/motion/chrome-hammer/chrome-hammer-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            controls
          />
        </div>
      </div>
    </section>
  );
}

function SpotifyTitlesDetail({ transitionName }: { transitionName: string }) {
  const frameStyle: CSSProperties = { viewTransitionName: transitionName };
  return (
    <section className="mx-auto max-w-[1320px]">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-x-8">
        <aside className="md:col-span-3">
          <p className="font-display text-[clamp(18px,1.5vw,24px)] font-light lowercase leading-[1.4] tracking-normal text-[var(--ink-1)]">
            A Spotify title sequence generated in a single text-to-video pass. Kinetic type,
            an album-wall flythrough, and the sound-wave end card, with display type holding
            razor sharp at 2k.
          </p>
          <dl className="mt-5 grid grid-cols-1 gap-4 border-t border-[var(--ink-4)] pt-4">
            {[
              ["type", "spec title study · not a spotify commission"],
              ["system", "minimax h3 (hailuo 3.0) via evolink · text-to-video"],
              ["sound", "native model audio · sound design, no music"],
              ["format", "12s · 2560x1440 · 24fps · h264/aac"],
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
            aria-label="Spotify kinetic title sequence generated with MiniMax H3"
            className="block aspect-video w-full bg-[var(--cream-0)]"
            controls
            playsInline
            preload="metadata"
            poster="/work/motion/spotify-titles/spotify-titles-poster.jpg"
          >
            <source src="/work/motion/spotify-titles/spotify-titles-h3.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      <div className="mt-10 border-y border-[var(--ink-4)] py-5">
        <p className="max-w-[78ch] font-mono text-[10px] uppercase leading-[1.65] tracking-[0.14em] text-[var(--ink-2)]">
          spec study · not commissioned by spotify · generated with minimax h3 (hailuo 3.0)
          via evolink · one pass, no keyframes, native 24fps
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

const AGENT_STACK_ROWS = [
  ["director", "taste and corrections"],
  ["brief", "scope and proof"],
  ["skills", "rules and recipes"],
  ["tools", "generation and build"],
  ["proof", "validation and live checks"],
] as const;

const CREATIVE_SKILL_ROWS = [
  {
    name: "startup check",
    mode: "open",
    copy: "starts from vault, repo, backlog, and live truth before edits.",
  },
  {
    name: "end session sweep",
    mode: "close",
    copy: "records commit, deploy, validation, open state, and next pickup.",
  },
  {
    name: "color theory",
    mode: "taste",
    copy: "keeps palette, contrast, mood, and grade decisions intentional.",
  },
  {
    name: "composition",
    mode: "frame",
    copy: "places the subject on purpose and measures where it actually landed.",
  },
  {
    name: "shotlist cinematography",
    mode: "coverage",
    copy: "turns a script into shots: sizes, angles, the axis, and continuity.",
  },
  {
    name: "video check",
    mode: "qc",
    copy: "reviews a finished video by measurement: contact sheets, cuts, and flicker.",
  },
] as const;

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
          <div className="mt-7 border-y border-[var(--ink-4)]">
            {CREATIVE_SKILL_ROWS.map((skill, index) => (
              <div
                key={skill.name}
                className={
                  "grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 py-4 " +
                  (index === 0 ? "" : "border-t border-[var(--ink-4)]")
                }
              >
                <p className="font-display text-[24px] font-light tabular-nums leading-none tracking-[-0.04em] text-[var(--ink-3)]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--cinnamon)]">
                    {skill.mode}
                  </p>
                  <p className="mt-2 font-display text-[clamp(17px,1.4vw,24px)] font-light lowercase leading-[1.1] tracking-[-0.02em] text-[var(--ink-0)]">
                    {skill.name}
                  </p>
                  <p className="mt-2 max-w-[32ch] font-display text-[clamp(14px,1vw,16px)] font-light leading-[1.45] tracking-[-0.005em] text-[var(--ink-1)]">
                    {skill.copy}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-7 border-t border-[var(--ink-4)] pt-4 font-mono text-[10px] uppercase leading-[1.65] tracking-[0.14em] text-[var(--ink-2)]">
            startup · closeout · color · framing · coverage · qc
          </p>
        </div>
        <div className="md:col-span-7">
          <AgentStackDiagram />
        </div>
      </div>
    </section>
  );
}

const QC_DIR = "/work/pipelines-tools/qc-by-measurement";

const QC_FIGURES = [
  {
    src: `${QC_DIR}/qc-composition.jpg`,
    width: 1920,
    height: 808,
    label: "composition · eyes at 0.55, 0.23 of frame · 11.5% from the nearest third point",
    alt: "A frame from The Gunfight with rule-of-thirds lines drawn over it",
  },
  {
    src: `${QC_DIR}/qc-splat-audit.jpg`,
    width: 1280,
    height: 360,
    label: "splat audit · the hillside blob at the viewer's low angle (v02) and gone after retraining (v03)",
    alt: "Two renders of the gaussian splat street from the same low angle, before and after the fix",
  },
];

function QcDetail({ transitionName }: { transitionName: string }) {
  const frameStyle: CSSProperties = { viewTransitionName: transitionName };
  return (
    <section className="mx-auto max-w-[1320px]">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-x-8">
        <aside className="md:col-span-3">
          <p className="font-display text-[clamp(18px,1.5vw,24px)] font-light lowercase leading-[1.4] tracking-normal text-[var(--ink-1)]">
            every finished piece gets checked by numbers before anyone calls it done. these are
            the checks, run on real work from this site.
          </p>
          <dl className="mt-5 grid grid-cols-1 gap-4 border-t border-[var(--ink-4)] pt-4">
            {[
              ["contact sheet", "frames with their number and timecode burned in"],
              ["cut detector", "frame-to-frame change: lone spikes are cuts, runs are motion"],
              ["composition", "thirds, phi and spiral drawn on the frame, with a measured position"],
              ["splat audit", "renders from every angle the viewer allows, not just the nice one"],
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

        <figure
          className="relative overflow-hidden border border-[var(--ink-3)] bg-[var(--cream-1)] p-2 shadow-[0_24px_80px_rgba(31,7,7,0.08)] md:col-span-9 md:p-4"
          style={frameStyle}
        >
          <Image
            src={`${QC_DIR}/qc-contact-sheet.jpg`}
            alt="Contact sheet of nine frames from The Gunfight, each labelled with its frame number and timecode"
            width={1920}
            height={810}
            priority
            sizes="(min-width: 768px) 75vw, 100vw"
            className="block w-full"
          />
          <figcaption className="mt-3 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ink-2)]">
            contact sheet · the gunfight · every 10 seconds
          </figcaption>
        </figure>
      </div>

      <figure className="mt-10 border border-[var(--ink-4)] bg-[var(--cream-1)] p-2">
        <Image
          src={`${QC_DIR}/qc-cut-detector.png`}
          alt="A chart of frame-to-frame change across The Gunfight, with 42 cuts marked"
          width={1920}
          height={560}
          sizes="100vw"
          className="block w-full"
        />
        <figcaption className="mt-3 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ink-2)]">
          cut detector · the gunfight · 2,209 frames · 42 cuts marked, 43 shots
        </figcaption>
      </figure>

      <div className="mt-5 grid grid-cols-1 items-start gap-3 md:grid-cols-2 md:gap-5">
        {QC_FIGURES.map((fig) => (
          <figure key={fig.src} className="border border-[var(--ink-4)] bg-[var(--cream-1)] p-2">
            <Image
              src={fig.src}
              alt={fig.alt}
              width={fig.width}
              height={fig.height}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="block w-full"
            />
            <figcaption className="mt-3 font-mono text-[9px] uppercase leading-[1.6] tracking-[0.18em] text-[var(--ink-2)]">
              {fig.label}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
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
        style={{ color: "#0F0F0F", fontFamily: '"Instrument Serif", Georgia, serif' }}
      >
        kira
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
