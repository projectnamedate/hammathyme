/**
 * Curated case-study list driving /work and /work/[slug].
 * Each entry is a placeholder until real content lands; the index, capability
 * tag, and accent color drive the gallery card rendering.
 */
export type CaseStudy = {
  slug: string;
  title: string;
  capability: string;
  capabilityLabel: string;
  year: string;
  client: string;
  summary: string;
  /** background tint for the placeholder card (CSS color) */
  tint: string;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "hammer-brand-build",
    title: "building the hammer brand",
    capability: "brand-systems",
    capabilityLabel: "brand systems",
    year: "2026",
    client: "self",
    summary:
      "a brand identity and portfolio site designed and built end-to-end with ai in the loop.",
    tint: "var(--cream-1)",
  },
  {
    slug: "kira-autonomous-character",
    title: "kira — an autonomous character",
    capability: "autonomous-characters",
    capabilityLabel: "autonomous characters",
    year: "2026",
    client: "hammer studios",
    summary:
      "a persistent ai character with her own social presence, scheduled posts, and consistent identity.",
    tint: "var(--cream-2)",
  },
  {
    slug: "motion-graphics-reel",
    title: "motion graphics reel",
    capability: "motion-graphics",
    capabilityLabel: "motion graphics",
    year: "2026",
    client: "various",
    summary:
      "programmatic motion design built in remotion and hyperframes. broadcast-grade polish.",
    tint: "var(--bloodlust)",
  },
  {
    slug: "ai-film-placeholder",
    title: "ai film + video",
    capability: "ai-film-video",
    capabilityLabel: "ai film + video",
    year: "2026",
    client: "tbd",
    summary:
      "short-form ai-generated video. veo, runway, kling, seedance pipeline.",
    tint: "var(--cinnamon)",
  },
  {
    slug: "pipelines-and-tools",
    title: "pipelines + tools",
    capability: "pipelines-tools",
    capabilityLabel: "pipelines + tools",
    year: "2026",
    client: "hammer studios",
    summary:
      "prompt libraries, agent stacks, comfyui graphs, n8n workflows. the tools beneath the work.",
    tint: "var(--cream-1)",
  },
  {
    slug: "interactive-demos",
    title: "interactive + playable",
    capability: "interactive-playable",
    capabilityLabel: "interactive + playable",
    year: "2026",
    client: "hammer studios",
    summary:
      "live demos visitors can use directly. talk-to-character, prompt-to-storyboard, consistency lab.",
    tint: "var(--cream-2)",
  },
  {
    slug: "broadcast-commercial",
    title: "broadcast + commercial",
    capability: "broadcast-commercial",
    capabilityLabel: "broadcast + commercial",
    year: "2026",
    client: "tbd",
    summary:
      "ai work delivered to broadcast and agency standards. fifteen years of network pipelines applied.",
    tint: "var(--bloodlust)",
  },
  {
    slug: "editorial-writing",
    title: "editorial + writing",
    capability: "editorial-writing",
    capabilityLabel: "editorial + writing",
    year: "2026",
    client: "self",
    summary:
      "long-form essays and definitional pieces about ai production.",
    tint: "var(--ink-1)",
  },
];

export function findCase(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}
