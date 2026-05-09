/**
 * The 8 work categories shown on the /work atrium and their portfolio
 * contents. Each category is a collection of pieces; pieces will eventually
 * have their own /work/[category]/[piece] case-study pages.
 *
 * For now, pieces are placeholders with a status — every category should
 * render populated even before real assets land, so each piece reads as a
 * deliberate slot ("in production · 2026") rather than an empty grid cell.
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
      "brand identities built with ai in the loop — palette, wordmark, motion, voice. selected work below.",
    tint: "var(--cream-1)",
    hero: { main: "brand", italic: "systems" },
    pieces: [
      {
        slug: "hammer",
        title: "hammer",
        year: "2026",
        client: "self",
        blurb: "the brand for this studio. wordmark, palette, motion language, deploy pipeline.",
        status: "live",
        tint: "var(--cream-1)",
      },
      {
        slug: "kira",
        title: "kira",
        year: "2026",
        client: "hammer studios",
        blurb: "identity for an autonomous character. lora-locked face, voice, posting style.",
        status: "live",
        tint: "var(--cream-2)",
      },
      {
        slug: "effigy",
        title: "effigy",
        year: "2026",
        client: "tbd",
        blurb: "ritual / ceremony brand. bloodlust accent, cream paper. coming next.",
        status: "in-production",
        tint: "var(--bloodlust)",
      },
    ],
  },
  {
    slug: "agents",
    title: "agents",
    capability: "autonomous-characters",
    capabilityLabel: "agents",
    year: "2026",
    client: "selected",
    summary:
      "a character layered over an autonomous agent. any creator or brand can send one into the digital world to work as a 24/7 marketer, onboarder, and live ad for the product.",
    tint: "var(--cream-2)",
    hero: { main: "autonomous", italic: "characters" },
    pieces: [
      {
        slug: "kira",
        title: "kira",
        year: "feb 2026",
        client: "hammer studios",
        blurb: "the first. persistent face, scheduled posts, replies in voice. kira-class.",
        status: "live",
        tint: "var(--cream-2)",
      },
      {
        slug: "the-cast-grows",
        title: "the cast grows",
        year: "2026",
        blurb: "more characters in production — branded mascots, indie creators, brand voices.",
        status: "in-production",
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
        slug: "broadcast-titles-vol-1",
        title: "broadcast titles vol. 1",
        year: "2026",
        blurb: "title-card system designed for episodic delivery. typography in motion.",
        status: "in-production",
        tint: "var(--bloodlust)",
      },
      {
        slug: "lower-thirds-set",
        title: "lower-thirds set",
        year: "2026",
        blurb: "name plates, lower-thirds, callouts. configurable, color-tunable, production-ready.",
        status: "coming-soon",
        tint: "var(--cream-2)",
      },
      {
        slug: "audio-reactive-overlays",
        title: "audio-reactive overlays",
        year: "2026",
        blurb: "beat-synced motion driven by waveform analysis. for music, podcasts, social.",
        status: "coming-soon",
        tint: "var(--cinnamon)",
      },
    ],
  },
  {
    slug: "animation",
    title: "animation",
    capability: "animation",
    capabilityLabel: "animation",
    year: "2026",
    client: "selected",
    summary:
      "puppet character animation built with rive and remotion. rigged, programmable, repeatable for episodic output.",
    tint: "var(--cinnamon)",
    hero: { main: "", italic: "animation" },
    pieces: [
      {
        slug: "puppet-rig-character",
        title: "puppet rig character",
        year: "2026",
        blurb: "rive-rigged character composited into remotion scenes. timeline + bone control.",
        status: "in-production",
        tint: "var(--cinnamon)",
      },
      {
        slug: "looping-social-bumpers",
        title: "looping social bumpers",
        year: "2026",
        blurb: "short looping animations sized for instagram, tiktok, x. brand-tunable.",
        status: "coming-soon",
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
      "the tools beneath the work. interactive pipeline visualizer below shows three real production pipelines with cost, time, and output at every step.",
    tint: "var(--cream-1)",
    hero: { main: "pipelines", italic: "+ tools" },
    pieces: [
      {
        slug: "pipeline-visualizer",
        title: "pipeline visualizer",
        year: "2026",
        blurb: "interactive node-graph of three real pipelines. live below.",
        status: "live",
        tint: "var(--cream-1)",
      },
      {
        slug: "prompt-library",
        title: "prompt library",
        year: "2026",
        blurb: "the actual prompts behind each pipeline. gated — request access.",
        status: "coming-soon",
        tint: "var(--cream-2)",
      },
      {
        slug: "comfyui-graphs",
        title: "comfyui graphs",
        year: "2026",
        blurb: "production-tested workflows — character consistency, style transfer, upscale.",
        status: "coming-soon",
        tint: "var(--bloodlust)",
      },
      {
        slug: "mcp-servers",
        title: "mcp servers",
        year: "2026",
        blurb: "small custom mcp servers for scheduling, telegram, kira's posting loop.",
        status: "coming-soon",
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
      "live demos visitors can use directly. each runs through a daily cost cap and rate limit.",
    tint: "var(--cream-2)",
    hero: { main: "interactive", italic: "+ playable" },
    pieces: [
      {
        slug: "prompt-to-storyboard",
        title: "prompt → storyboard",
        year: "2026",
        blurb: "type a sentence, get six storyboard panels with shot type, camera, caption.",
        status: "in-production",
        tint: "var(--cream-1)",
      },
      {
        slug: "consistency-lab",
        title: "character consistency",
        year: "2026",
        blurb: "pick a character, see six scenes with locked face and wardrobe.",
        status: "in-production",
        tint: "var(--cream-2)",
      },
      {
        slug: "live-render-feed",
        title: "live render feed",
        year: "2026",
        blurb: "public log of what kira and the cast posted today. read-only.",
        status: "coming-soon",
        tint: "var(--bloodlust)",
      },
      {
        slug: "talk-to-character",
        title: "talk to a character",
        year: "2026",
        blurb: "chat with kira (or whoever) directly in their voice. capped per visitor.",
        status: "coming-soon",
        tint: "var(--cinnamon)",
      },
    ],
  },
  {
    slug: "visual-media",
    title: "visual media",
    capability: "visual-media",
    capabilityLabel: "visual media",
    year: "2026",
    client: "selected",
    summary:
      "ai-native film, short-form video, and commercial work. veo, runway, kling, seedance — finished to network standards.",
    tint: "var(--bloodlust)",
    hero: { main: "visual", italic: "media" },
    pieces: [
      {
        slug: "hammer-soda-30",
        title: "hammer soda · :30",
        year: "2026",
        blurb: "a fake soda commercial — full pipeline + cost + timing published.",
        status: "in-production",
        tint: "var(--bloodlust)",
      },
      {
        slug: "hedra-explainer",
        title: "hedra avatar explainer",
        year: "2026",
        blurb: "talking-head explainer of \"what an ai producer does.\" lives on /about.",
        status: "coming-soon",
        tint: "var(--cream-2)",
      },
      {
        slug: "ai-music-video",
        title: "music video",
        year: "2026",
        blurb: "indie artist · pure veo / runway pipeline. full prompt library published.",
        status: "coming-soon",
        tint: "var(--cinnamon)",
      },
      {
        slug: "doc-grade-short",
        title: "90-second doc opener",
        year: "2026",
        blurb: "doc-grade polish, color, pacing — proving ai output can hit broadcast spec.",
        status: "coming-soon",
        tint: "var(--cream-1)",
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
      "ai-native websites — design, build, and ship. brand systems, marketing pages, portfolio sites.",
    tint: "var(--cream-1)",
    hero: { main: "", italic: "websites" },
    pieces: [
      {
        slug: "hammathyme",
        title: "hammathyme",
        year: "2026",
        client: "self",
        blurb: "this site. case study #1 — full visibility into process, prompts, decisions.",
        status: "live",
        tint: "var(--cream-1)",
      },
      {
        slug: "client-sites",
        title: "client sites",
        year: "2026",
        blurb: "marketing, brand, and portfolio sites for clients. coming soon.",
        status: "coming-soon",
        tint: "var(--cream-2)",
      },
    ],
  },
];

export function findCase(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}

export function statusLabel(s: PieceStatus): string {
  if (s === "live") return "live";
  if (s === "in-production") return "in production";
  return "coming soon";
}
