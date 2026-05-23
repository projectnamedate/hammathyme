export type StoryboardPanel = {
  id: string;
  shot: string;
  camera: string;
  action: string;
  caption: string;
  palette: string;
};

export const SAMPLE_STORYBOARD: StoryboardPanel[] = [
  {
    id: "01",
    shot: "cold open",
    camera: "locked 35mm wide",
    action: "a studio table waits under one practical lamp",
    caption: "the object arrives before the pitch",
    palette: "cream paper, maroon ink, cinnamon glint",
  },
  {
    id: "02",
    shot: "insert",
    camera: "macro push",
    action: "a hand slides the brief into frame",
    caption: "one line becomes the constraint",
    palette: "soft paper, warm shadow, red pencil",
  },
  {
    id: "03",
    shot: "process",
    camera: "top-down",
    action: "six boards assemble around the key phrase",
    caption: "structure before spectacle",
    palette: "cream grid, graphite, cinnamon notes",
  },
  {
    id: "04",
    shot: "character",
    camera: "medium portrait",
    action: "the lead turns toward the mark",
    caption: "continuity locks the face",
    palette: "skin tone, black jacket, warm glass",
  },
  {
    id: "05",
    shot: "payoff",
    camera: "slow dolly",
    action: "the final frame resolves into a poster",
    caption: "the system produces the asset",
    palette: "deep ink, cream type, cinnamon dot",
  },
  {
    id: "06",
    shot: "delivery",
    camera: "clean product hero",
    action: "renders, prompts, and costs land in one stack",
    caption: "ready for review, not runaway spend",
    palette: "warm paper, maroon rules, quiet signal",
  },
];

export type ConsistencyScene = {
  id: string;
  label: string;
  shortLabel: string;
  image: string;
  prompt: string;
};

export const CONSISTENCY_SCENES: ConsistencyScene[] = [
  {
    id: "desk",
    label: "night desk",
    shortLabel: "desk",
    image: "/work/agents/kira/ref-desk.png",
    prompt:
      "kira_agi_v1 at a quiet crypto desk, black blazer, copper light, safe public portrait, consistent face, editorial photography",
  },
  {
    id: "brooklyn",
    label: "street glass",
    shortLabel: "street",
    image: "/work/agents/kira/ref-brooklyn.png",
    prompt:
      "kira_agi_v1 by a brooklyn window wall, black blazer, copper reflection, safe public portrait, consistent face, editorial photography",
  },
  {
    id: "portrait",
    label: "voice anchor",
    shortLabel: "voice",
    image: "/work/agents/kira/ref-serious.png",
    prompt:
      "kira_agi_v1 direct portrait, black blazer, dry intelligent expression, safe public portrait, consistent face, editorial photography",
  },
  {
    id: "studio",
    label: "studio card",
    shortLabel: "studio",
    image: "/work/agents/kira/ref-head-tilt.png",
    prompt:
      "kira_agi_v1 in a warm studio, black blazer, head tilt, safe public portrait, consistent face, editorial photography",
  },
  {
    id: "neon",
    label: "neon street",
    shortLabel: "neon",
    image: "/work/brand-guides/kira/assets/refs/finals/photo/final/cinematic_ai_icons_upres/2_blade_runner_2x.png",
    prompt:
      "kira_agi_v1 on a rain-slick neon street, black leather jacket, neutral face light, safe public cinematic frame, consistent face, round black wireframe glasses",
  },
  {
    id: "diner",
    label: "diner light",
    shortLabel: "diner",
    image: "/work/brand-guides/kira/assets/refs/finals/photo/final/kitchen_morning_POST.jpg",
    prompt:
      "kira_agi_v1 in a quiet diner booth, black turtleneck, soft window light, safe public cinematic frame, consistent face, round black wireframe glasses",
  },
];

export function sampleKiraReply(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("coin") || lower.includes("token") || lower.includes("market")) {
    return "I can talk in market language, but I will not pretend to have live tape here. Give me a thesis, a chart window, and the audience. I will turn it into a clean post, not a fake signal.";
  }
  if (lower.includes("brand") || lower.includes("voice")) {
    return "Kira voice is dry, precise, and a little impatient with fluff. The trick is restraint: one sharp observation, one visual anchor, and no borrowed hype words.";
  }
  if (lower.includes("image") || lower.includes("photo") || lower.includes("look")) {
    return "The face stays locked by treating image generation like continuity, not vibes. Same anchors, same wardrobe rules, same lens family, then only the scene changes.";
  }
  return "Make the constraint smaller. I am better when the brief has edges: who is it for, what does it need to make them do, and what is the one visual that proves it.";
}

export function storyboardFallbackFromPrompt(prompt: string): StoryboardPanel[] {
  const trimmed = prompt.replace(/\s+/g, " ").trim();
  return SAMPLE_STORYBOARD.map((panel, index) => ({
    ...panel,
    action:
      index === 0
        ? `the brief appears: ${trimmed.slice(0, 82)}${trimmed.length > 82 ? "..." : ""}`
        : panel.action,
  }));
}
