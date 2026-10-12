/**
 * The 7 work categories shown on the /work atrium and their portfolio
 * contents. Each category is a collection of pieces; ready pieces open
 * /work/[category]/[piece] detail pages.
 *
 * Not every piece has a detail route yet. In-production pieces still render as
 * deliberate slots rather than empty grid cells.
 */

export type PieceStatus = "live" | "in-production" | "coming-soon";

export type Piece = {
  slug: string;
  title: string;
  year: string;
  client?: string;
  blurb?: string;
  status: PieceStatus;
  tint?: string;
};

export type BrandGuideProfile = {
  slug: string;
  title: string;
  status: string;
  source: string;
  description: string;
  evidence: string[];
  swatches: { label: string; value: string }[];
  guideUrl: string;
  guideLabel: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  capability: string;
  capabilityLabel: string;
  year: string;
  client: string;
  summary: string;
  /** background tint for the placeholder card on the atrium */
  tint: string;
  /** the editorial hero title — first line plain, second line italic */
  hero: { main: string; italic: string };
  /** portfolio contents inside this category */
  pieces: Piece[];
  /** optional source-guide dossiers for brand systems */
  brandGuides?: BrandGuideProfile[];
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "film-animation",
    title: "film + animation",
    capability: "visual-media",
    capabilityLabel: "film + animation",
    year: "2026",
    client: "selected",
    summary:
      "narrative film and animation, ai-native end to end. live work includes Equinox with Angry Gods, the gunfight, a western comedy short, and five short films drawn entirely in code.",
    tint: "var(--bloodlust)",
    hero: { main: "film", italic: "+ animation" },
    pieces: [
      {
        slug: "equinox",
        title: "equinox campaign",
        year: "2026",
        client: "Equinox / Angry Gods",
        blurb:
          "campaign spot for Equinox with Angry Gods: AI culture chaos against the human body as proof.",
        status: "live",
        tint: "var(--cream-1)",
      },
      {
        slug: "the-gunfight",
        title: "the gunfight",
        year: "2026",
        client: "studioly",
        blurb:
          "a 92-second western comedy short: two old gunfighters, one empty street, and a draw nobody saw coming. Seedance 2.5 takes on a 35mm print look.",
        status: "live",
        tint: "var(--bloodlust)",
      },
      {
        slug: "code-animation",
        title: "code animation",
        year: "2026",
        blurb:
          "five short films drawn entirely in code: painted 2d, a gpu painter, fframes, and three.js with a paint pass. every frame and every sound is code.",
        status: "live",
        tint: "var(--cinnamon)",
      },
    ],
  },
  {
    slug: "vfx-cgi",
    title: "vfx + cgi",
    capability: "vfx-cgi",
    capabilityLabel: "vfx + cgi",
    year: "2026",
    client: "selected",
    summary:
      "orchestration, not generation. coding agents write the blender scripts, wire runway into repeatable pipelines, and train gaussian splats from sets built with hunyuan 3d.",
    tint: "var(--cinnamon)",
    hero: { main: "vfx", italic: "+ cgi" },
    pieces: [
      {
        slug: "environment-swap",
        title: "environment swap",
        year: "2026",
        blurb:
          "one first-person driving plate relit into many worlds (neon city, alien desert, blue crystal forest, alpine snow), with the real dashboard preserved. a mask-free video-to-video environment swap via Runway Aleph 2.",
        status: "live",
        tint: "var(--cinnamon)",
      },
      {
        slug: "neural-set-capture",
        title: "neural set capture",
        year: "2026",
        blurb: "the gunfight's main street rebuilt from film frames with Hunyuan 3D, assembled in Blender, and trained into a gaussian splat you can orbit.",
        status: "live",
        tint: "var(--cinnamon)",
      },
      {
        slug: "blender-lookdev-pipeline",
        title: "blender look-dev pipeline",
        year: "2026",
        blurb:
          "one sculptural form through six material moods: cinnamon ceramic, graphite metal, warm cream, bloodlust lacquer, chrome, and clay, finished as a look-dev contact sheet.",
        status: "live",
        tint: "var(--cream-2)",
      },
    ],
  },
  {
    slug: "motion-graphics",
    title: "motion graphics",
    capability: "motion-graphics",
    capabilityLabel: "motion graphics",
    year: "2026",
    client: "various",
    summary:
      "programmatic motion design built in remotion and hyperframes. deterministic, reproducible, broadcast-grade.",
    tint: "var(--bloodlust)",
    hero: { main: "motion", italic: "graphics" },
    pieces: [
      {
        slug: "internet-capital-markets",
        title: "icm teaser",
        year: "2026",
        blurb: "teaser for the ICM film. title treatment and lower-thirds package built with ai-assisted motion design.",
        status: "live",
        tint: "var(--cream-2)",
      },
      {
        slug: "reel",
        title: "motion graphics reel",
        year: "2026",
        blurb: "selected ai motion work cut to a single piece. remotion and hyperframes, rendered from prores masters.",
        status: "live",
        tint: "var(--bloodlust)",
      },
      {
        slug: "spring-health",
        title: "Spring Health",
        year: "2026",
        client: "Spring Health",
        blurb: "a 51-second HyperFrames showcase translating Spring Health's brand system, product UI, and care-system story into motion.",
        status: "live",
        tint: "#01382E",
      },
      {
        slug: "spotify-titles",
        title: "spotify titles",
        year: "2026",
        blurb:
          "a kinetic title sequence for Spotify: 'music for everyone' and 'listening is everything' set in motion. one text-to-video pass via MiniMax H3, native sound.",
        status: "live",
        tint: "var(--cinnamon)",
      },
    ],
  },
  {
    slug: "brand-systems",
    title: "brand systems",
    capability: "brand-systems",
    capabilityLabel: "brand systems",
    year: "2026",
    client: "selected",
    summary:
      "brand identities built with ai in the loop: token systems, wordmarks, voice rules, motion language, and live product surfaces.",
    tint: "var(--cream-1)",
    hero: { main: "brand", italic: "systems" },
    pieces: [
      {
        slug: "hammer",
        title: "hammer",
        year: "2026",
        client: "self",
        blurb: "studio identity for this portfolio: protected wordmark, dot rules, palette, type, motion, and site tokens.",
        status: "live",
        tint: "var(--cream-1)",
      },
      {
        slug: "kira",
        title: "kira",
        year: "2026",
        client: "hammer studios",
        blurb:
          "agent identity, character bible, runtime guardrails, and website system for an autonomous ai crypto character.",
        status: "live",
        tint: "var(--cream-2)",
      },
      {
        slug: "agentify",
        title: "agentify",
        year: "2026",
        client: "agentify",
        blurb: "agent-payment readiness identity: Ledger Gate mark, rail wordmark, Nocturne Ledger palette, protocol surfaces, and agent-readable proof.",
        status: "live",
        tint: "#14132A",
      },
    ],
    brandGuides: [
      {
        slug: "hammer",
        title: "hammer",
        status: "canonical studio guide",
        source: "brand guide, visual reference, site tokens, motion reel wordmark",
        description:
          "Hammer is the portfolio studio identity: a warm editorial system built around a lowercase Outfit Black wordmark, a protected cinnamon circular period, Geist body copy, Instrument Serif italic accents, and motion tokens shared by the site and reel.",
        evidence: [
          "canonical wordmark construction, optical letter gaps, and protected dot rules",
          "warm cream surface system with vinaceous cinnamon and polished bloodlust accents",
          "motion primitives, easing tokens, and portfolio UI rules compiled into the site",
        ],
        swatches: [
          { label: "cream", value: "#FAEEE9" },
          { label: "ink", value: "#1F0707" },
          { label: "cinnamon", value: "#F28E86" },
          { label: "bloodlust", value: "#5A201D" },
        ],
        guideUrl: "/work/brand-guides/hammer/index.html",
        guideLabel: "full Hammer brand guide",
      },
      {
        slug: "kira",
        title: "kira",
        status: "agent system + bible + website",
        source: "14-part brand bible, agent runtime guardrails, onlykira site",
        description:
          "Kira is an autonomous-character agent system, not just a look. The bible defines canon, voice, visual anchors, content recipes, governance, runtime guardrails, and the website that consumes those rules.",
        evidence: [
          "fourteen-section brand bible with editable markdown source and compiled HTML",
          "agent voice, reply, media, and disclosure rules shape public behavior",
          "onlykira site imports tokens and runs shipped copy through voice-lint rules",
          "visual pipeline locks character anchors, lenses, lighting, color grades, and caption recipes",
        ],
        swatches: [
          { label: "paper", value: "#F7F3EC" },
          { label: "ink", value: "#0F0F0F" },
          { label: "copper", value: "#B4673A" },
          { label: "signal", value: "#FF6D1F" },
        ],
        guideUrl: "/work/brand-guides/kira/index.html",
        guideLabel: "full Kira brand bible",
      },
      {
        slug: "agentify",
        title: "agentify",
        status: "locked brand guide",
        source: "Nocturne Ledger v2 guide, brand bible route, live marketing site",
        description:
          "Agentify is the identity for agent-payment readiness. The surface is dark protocol, built around the Ledger Gate mark, an italic rail wordmark, moon-ash copy, and violet and ion signal colors. The site carries public proof that agents can read it.",
        evidence: [
          "Ledger Gate mark uses two posts, a top crossbar, a ledger cut, and a center node",
          "the Rail Underline wordmark turns the agent-on-a-rail motif into typography",
          "the marketing site ships agent-readable files, well-known manifests, and an MCP endpoint as brand proof",
        ],
        swatches: [
          { label: "eclipse", value: "#0C0D16" },
          { label: "moon ash", value: "#E8DFD0" },
          { label: "aurora", value: "#8B6CFF" },
          { label: "dim gold", value: "#C7A66A" },
        ],
        guideUrl: "https://agentify.nexus/brand-bible",
        guideLabel: "canonical Agentify brand bible",
      },
    ],
  },
  {
    slug: "websites",
    title: "websites",
    capability: "websites",
    capabilityLabel: "websites",
    year: "2026",
    client: "selected",
    summary:
      "ai-native websites: design, build, and ship. live public work includes agentify.nexus, onlykira.ai, and coefficient.mythx.art.",
    tint: "var(--cream-1)",
    hero: { main: "", italic: "websites" },
    pieces: [
      {
        slug: "hammer",
        title: "hammer",
        year: "2026",
        client: "self",
        blurb: "this site. a brand-system-first portfolio with gallery routes, detail pages, motion, and source-readable docs.",
        status: "live",
        tint: "var(--cream-1)",
      },
      {
        slug: "kira",
        title: "kira",
        year: "2026",
        client: "hammer studios",
        blurb:
          "onlykira.ai: public microsite for the autonomous Kira agent character, built with AI and the Kira brand bible.",
        status: "live",
        tint: "var(--cream-2)",
      },
      {
        slug: "agentify",
        title: "agentify",
        year: "2026",
        client: "agentify",
        blurb: "agentify.nexus: public agent-payment readiness site with cinematic shaders, proof surfaces, services, audit path, and agent-readable infrastructure.",
        status: "live",
        tint: "#14132A",
      },
      {
        slug: "coefficient",
        title: "coefficient",
        year: "2026",
        client: "mythx",
        blurb: "coefficient.mythx.art: solana stake-pool health dashboard: nakamoto coefficient tracking, pool scorecards, and validator reach, indexed daily.",
        status: "live",
        tint: "#161A2B",
      },
    ],
  },
  {
    slug: "interactive-playable",
    title: "interactive + playable",
    capability: "interactive-playable",
    capabilityLabel: "interactive + playable",
    year: "2026",
    client: "hammer studios",
    summary:
      "live demos: a 35mm projector you can crank and take apart, a prompt-to-storyboard board in colour pencil, and a brand-guide mini game. provider calls share a $1 daily cap.",
    tint: "var(--cream-2)",
    hero: { main: "interactive", italic: "+ playable" },
    pieces: [
      {
        slug: "35mm-projector",
        title: "35mm projector",
        year: "2026",
        blurb: "a working 35mm projector drawn in code: crank it, click a part to watch it work, take it apart.",
        status: "live",
        tint: "var(--cream-1)",
      },
      {
        slug: "prompt-to-storyboard",
        title: "prompt -> storyboard",
        year: "2026",
        blurb: "type a sentence, get a six-panel storyboard drawn in colour pencil.",
        status: "live",
        tint: "var(--cream-1)",
      },
      {
        slug: "dot-discipline",
        title: "dot discipline",
        year: "2026",
        blurb: "mini game from the Hammer brand guide: tune the wordmark period and baseline until it scores.",
        status: "live",
        tint: "var(--cream-1)",
      },
    ],
  },
  {
    slug: "pipelines-tools",
    title: "pipelines + tools",
    capability: "pipelines-tools",
    capabilityLabel: "pipelines + tools",
    year: "2026",
    client: "hammer studios",
    summary:
      "the tools beneath the work: pipeline maps, reusable creative skills, and agent-stack patterns built for repeatable ai production.",
    tint: "var(--cream-1)",
    hero: { main: "pipelines", italic: "+ tools" },
    pieces: [
      {
        slug: "pipeline-visualizer",
        title: "pipeline visualizer",
        year: "2026",
        blurb: "interactive node-graph of three real pipelines. opens as a detail view.",
        status: "live",
        tint: "var(--cream-1)",
      },
      {
        slug: "creative-skills",
        title: "creative skills",
        year: "2026",
        blurb: "the reusable operating layer: startup checks, end session sweeps, color theory, and review systems.",
        status: "live",
        tint: "var(--cream-1)",
      },
    ],
  }
];

export function findCase(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}

export function findPiece(categorySlug: string, pieceSlug: string): Piece | undefined {
  return findCase(categorySlug)?.pieces.find((p) => p.slug === pieceSlug);
}

const DETAIL_READY_KEYS = new Set([
  "brand-systems/hammer",
  "brand-systems/kira",
  "brand-systems/agentify",
  "motion-graphics/reel",
  "motion-graphics/internet-capital-markets",
  "motion-graphics/spring-health",
  "motion-graphics/spotify-titles",
  "vfx-cgi/environment-swap",
  "vfx-cgi/neural-set-capture",
  "vfx-cgi/blender-lookdev-pipeline",
  "pipelines-tools/pipeline-visualizer",
  "pipelines-tools/creative-skills",
  "interactive-playable/35mm-projector",
  "interactive-playable/prompt-to-storyboard",
  "interactive-playable/dot-discipline",
  "film-animation/equinox",
  "film-animation/the-gunfight",
  "film-animation/code-animation",
  "websites/hammer",
  "websites/kira",
  "websites/agentify",
  "websites/coefficient",
]);

export function pieceDetailKey(categorySlug: string, pieceSlug: string): string {
  return `${categorySlug}/${pieceSlug}`;
}

export function hasPieceDetail(categorySlug: string, pieceSlug: string): boolean {
  return DETAIL_READY_KEYS.has(pieceDetailKey(categorySlug, pieceSlug));
}

export function getReadyPieceParams(): { slug: string; piece: string }[] {
  return CASE_STUDIES.flatMap((category) =>
    category.pieces
      .filter((piece) => hasPieceDetail(category.slug, piece.slug))
      .map((piece) => ({ slug: category.slug, piece: piece.slug })),
  );
}

export function statusLabel(s: PieceStatus): string {
  if (s === "live") return "live";
  if (s === "in-production") return "in production";
  return "coming soon";
}
