/**
 * The 8 work categories shown on the /work atrium and their portfolio
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
    slug: "agents-digital-twins",
    title: "agents + digital twins",
    capability: "autonomous-characters",
    capabilityLabel: "agents + digital twins",
    year: "2026",
    client: "selected",
    summary:
      "a living virtual replica driven by autonomous ai. one end twins a person or brand into a 24/7 agent that markets and onboards. the other twins a physical asset or system with live sensor data to monitor, simulate, and predict.",
    tint: "var(--cream-2)",
    hero: { main: "agents +", italic: "digital twins" },
    pieces: [
      {
        slug: "kira",
        title: "kira",
        year: "feb 2026",
        client: "hammer studios",
        blurb: "the first Kira-class autonomous character: persistent face, brand bible, scheduled posts, replies, media policy, and runtime guardrails.",
        status: "live",
        tint: "var(--cream-2)",
      },
      {
        slug: "bradley",
        title: "bradley",
        year: "2026",
        client: "hammer studios",
        blurb: "a persona digital twin: locked likeness and identity sheet, lora training next, then run as an autonomous agent.",
        status: "in-production",
        tint: "var(--bloodlust)",
      },
      {
        slug: "sensor-twin-dashboard",
        title: "live sensor twin",
        year: "2026",
        blurb: "a roll-your-own twin: live device telemetry streamed to a time-series store, with real-time state and anomaly flags on a dashboard.",
        status: "coming-soon",
        tint: "var(--cream-1)",
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
      {
        slug: "internet-capital-markets",
        title: "icm teaser",
        year: "2026",
        blurb: "teaser for the ICM film. title treatment and lower-thirds package built with ai-assisted motion design.",
        status: "live",
        tint: "var(--cream-2)",
      },
      {
        slug: "audio-reactive-overlays",
        title: "audio reactive overlays",
        year: "2026",
        blurb: "a 64-second Remotion overlay driven by energy, band, centroid, and beat analysis.",
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
      "orchestration, not generation. coding agents write the blender scripts, wire comfyui and runway into repeatable pipelines, and train gaussian splats from sets built with hunyuan 3d.",
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
        slug: "blender-lookdev-pipeline",
        title: "blender look-dev pipeline",
        year: "2026",
        blurb:
          "one sculptural form through six material moods: cinnamon ceramic, graphite metal, warm cream, bloodlust lacquer, chrome, and clay, finished as a look-dev contact sheet.",
        status: "live",
        tint: "var(--cream-2)",
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
        slug: "comfyui-production-backend",
        title: "comfyui outfit morph",
        year: "2026",
        blurb:
          "the real ComfyUI graph behind an AIVFX outfit morph: Wan VACE conditioning, mask control, sampler, decode, MP4 review, and PNG frame export.",
        status: "live",
        tint: "var(--bloodlust)",
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
      "the tools beneath the work: pipeline maps, prompt architecture, reusable creative skills, and agent-stack patterns built for repeatable ai production.",
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
        slug: "prompt-library",
        title: "prompt library",
        year: "2026",
        blurb: "the public shape of Hammer's prompt system: briefs, taste locks, tool recipes, review gates, and handoff notes.",
        status: "live",
        tint: "var(--cream-2)",
      },
      {
        slug: "creative-skills",
        title: "creative skills",
        year: "2026",
        blurb: "the reusable operating layer: startup checks, end session sweeps, color theory, character prompting, and review systems.",
        status: "live",
        tint: "var(--cream-1)",
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
      "live demos visitors can use directly: storyboard prompts, character consistency, Kira chat, and a brand-guide mini game. provider calls share a $1 daily cap.",
    tint: "var(--cream-2)",
    hero: { main: "interactive", italic: "+ playable" },
    pieces: [
      {
        slug: "prompt-to-storyboard",
        title: "prompt -> storyboard",
        year: "2026",
        blurb: "type a sentence, get six storyboard panels with shot type, camera, caption, and palette.",
        status: "live",
        tint: "var(--cream-1)",
      },
      {
        slug: "consistency-lab",
        title: "character consistency",
        year: "2026",
        blurb: "Kira continuity board with safe LoRA remix hook, locked face anchors, and fallback refs.",
        status: "live",
        tint: "var(--cream-2)",
      },
      {
        slug: "talk-to-character",
        title: "talk to a character",
        year: "2026",
        blurb: "chat with Kira in her public voice through a capped DeepSeek/OpenRouter route.",
        status: "live",
        tint: "var(--cinnamon)",
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
    slug: "film-animation",
    title: "film + animation",
    capability: "visual-media",
    capabilityLabel: "film + animation",
    year: "2026",
    client: "selected",
    summary:
      "narrative film and character animation, ai-native end to end. commercial spots, shorts, documentary work, and short-form animated pieces. live work includes Equinox with Angry Gods, the gunfight, a western comedy short, and the applicant, a one-minute ai-native short.",
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
        slug: "the-applicant",
        title: "the applicant",
        year: "2026",
        client: "studioly",
        blurb:
          "a one-minute ai-native short made end-to-end through the Studioly pipeline: locked GPT Image 2 frames, Seedance 2.0 takes, native crowd audio.",
        status: "live",
        tint: "var(--cinnamon)",
      },
      {
        slug: "animated-short",
        title: "animated short",
        year: "2026",
        blurb: "short narrative animation built from generated characters, animated plates, ai voice, music, and remotion finishing.",
        status: "coming-soon",
        tint: "var(--bloodlust)",
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
  "agents-digital-twins/kira",
  "motion-graphics/reel",
  "motion-graphics/internet-capital-markets",
  "motion-graphics/audio-reactive-overlays",
  "motion-graphics/spring-health",
  "motion-graphics/spotify-titles",
  "vfx-cgi/environment-swap",
  "vfx-cgi/neural-set-capture",
  "vfx-cgi/blender-lookdev-pipeline",
  "vfx-cgi/comfyui-production-backend",
  "pipelines-tools/pipeline-visualizer",
  "pipelines-tools/prompt-library",
  "pipelines-tools/creative-skills",
  "interactive-playable/prompt-to-storyboard",
  "interactive-playable/consistency-lab",
  "interactive-playable/talk-to-character",
  "interactive-playable/dot-discipline",
  "film-animation/equinox",
  "film-animation/the-gunfight",
  "film-animation/the-applicant",
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
