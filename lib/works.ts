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
    slug: "brand-systems",
    title: "brand systems",
    capability: "brand-systems",
    capabilityLabel: "brand systems",
    year: "2026",
    client: "selected",
    summary:
      "brand identities built with ai in the loop — palette, wordmark, motion, voice. kira, hammer, effigy.",
    tint: "var(--cream-1)",
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
  },
  {
    slug: "motion-graphics",
    title: "motion graphics",
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
    title: "animation",
    capability: "animation",
    capabilityLabel: "animation",
    year: "2026",
    client: "selected",
    summary:
      "puppet character animation built with rive and remotion. rigged, programmable, broadcast-grade.",
    tint: "var(--cinnamon)",
  },
  {
    slug: "pipelines-tools",
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
    slug: "interactive-playable",
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
    title: "visual media",
    capability: "visual-media",
    capabilityLabel: "visual media",
    year: "2026",
    client: "selected",
    summary:
      "ai-native film, short-form video, and broadcast-grade work. veo, runway, kling, seedance — finished to network standards.",
    tint: "var(--bloodlust)",
  },
  {
    slug: "websites",
    title: "websites",
    capability: "websites",
    capabilityLabel: "websites",
    year: "2026",
    client: "selected",
    summary:
      "ai-native websites — design, build, and ship. brand systems, marketing pages, portfolio sites. this site is the case study.",
    tint: "var(--cream-1)",
  },
];

export function findCase(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}
