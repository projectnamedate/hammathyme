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
    title: "identity systems",
    capability: "brand-systems",
    capabilityLabel: "brand systems",
    year: "2026",
    client: "selected",
    summary:
      "brand identities built with ai in the loop — palette, wordmark, motion, voice. kira, hammer, effigy.",
    tint: "var(--cream-1)",
  },
  {
    slug: "kira-autonomous-character",
    title: "persistent characters",
    capability: "autonomous-characters",
    capabilityLabel: "autonomous characters",
    year: "2026",
    client: "selected",
    summary:
      "ai characters with their own social presence, scheduled posts, and consistent identity across image, video, and conversation.",
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
    slug: "animation",
    title: "character animation",
    capability: "animation",
    capabilityLabel: "animation",
    year: "2026",
    client: "selected",
    summary:
      "puppet character animation built with rive and remotion. rigged, programmable, broadcast-grade.",
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
    slug: "visual-media",
    title: "film, video, broadcast",
    capability: "visual-media",
    capabilityLabel: "visual media",
    year: "2026",
    client: "selected",
    summary:
      "ai-native film, short-form video, and broadcast-grade work. veo, runway, kling, seedance — finished to network standards.",
    tint: "var(--bloodlust)",
  },
];

export function findCase(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}
