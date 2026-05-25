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
    shot: "subject",
    camera: "medium portrait",
    action: "the subject turns toward the mark",
    caption: "the idea becomes legible",
    palette: "warm skin, dark cloth, cream glass",
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

export type StoryboardPreset = {
  id: string;
  title: string;
  genre: string;
  prompt: string;
};

export const STORYBOARD_PRESETS: StoryboardPreset[] = [
  {
    id: "founder-tool",
    title: "founder tool",
    genre: "product",
    prompt: "A compact launch film for a founder tool that turns messy product notes into one precise launch plan.",
  },
  {
    id: "rain-chase",
    title: "rain chase",
    genre: "action",
    prompt: "A rain-slick courier races across rooftops to deliver a glowing data key before sunrise.",
  },
  {
    id: "pastry-rivals",
    title: "pastry rivals",
    genre: "romance",
    prompt: "Two rival pastry chefs fall for each other while building one impossible wedding cake.",
  },
  {
    id: "matchbook-noir",
    title: "matchbook noir",
    genre: "noir",
    prompt: "A tired detective follows a trail of matchbooks through a city of old signs and fog.",
  },
  {
    id: "moon-greenhouse",
    title: "moon greenhouse",
    genre: "sci-fi",
    prompt: "A botanist on a moon greenhouse discovers the first flower that responds to music.",
  },
  {
    id: "answering-fog",
    title: "answering fog",
    genre: "suspense",
    prompt: "A lighthouse keeper realizes the foghorn is answering back from somewhere beyond the rocks.",
  },
  {
    id: "solar-train",
    title: "solar train",
    genre: "western",
    prompt: "A desert mechanic fixes the only solar train before a dust storm shuts down the town.",
  },
  {
    id: "rowing-final",
    title: "rowing final",
    genre: "sports",
    prompt: "An underdog rowing team learns to sync breath and timing before the final race.",
  },
  {
    id: "mirror-gala",
    title: "mirror gala",
    genre: "heist",
    prompt: "A crew swaps a museum replica during a gala using only timing, mirrors, and misdirection.",
  },
  {
    id: "rooftop-mix",
    title: "rooftop mix",
    genre: "music",
    prompt: "A bedroom producer turns one voice memo into a citywide rooftop performance.",
  },
  {
    id: "family-menu",
    title: "family menu",
    genre: "documentary",
    prompt: "A chef rebuilds a family restaurant menu after finding an old notebook.",
  },
  {
    id: "watch-reveal",
    title: "watch reveal",
    genre: "luxury",
    prompt: "A watchmaker reveals a new model through shadows, gears, and one precise hand movement.",
  },
  {
    id: "lisbon-notes",
    title: "lisbon notes",
    genre: "travel",
    prompt: "A solo traveler follows handwritten notes through Lisbon to find a hidden film screening.",
  },
  {
    id: "office-demo",
    title: "office demo",
    genre: "comedy",
    prompt: "A chaotic office team tries to shoot one perfect product demo before the coffee runs out.",
  },
  {
    id: "floating-library",
    title: "floating library",
    genre: "fantasy",
    prompt: "A courier maps a floating library where every book rearranges the city below.",
  },
  {
    id: "night-market-app",
    title: "night market",
    genre: "cyberpunk",
    prompt: "A night-market coder launches a privacy app under rain, signage, and broken billboards.",
  },
  {
    id: "sleep-city",
    title: "sleep city",
    genre: "wellness",
    prompt: "A sleep app launch visualizes a restless city slowly learning to breathe.",
  },
  {
    id: "kitchen-robot",
    title: "kitchen robot",
    genre: "game",
    prompt: "A tiny robot competes in a kitchen obstacle course to prove it can clean anything.",
  },
  {
    id: "repair-jacket",
    title: "repair jacket",
    genre: "campaign",
    prompt: "A sustainable jacket campaign follows one garment from repair table to rainy commute.",
  },
  {
    id: "coffee-ritual",
    title: "coffee ritual",
    genre: "commercial",
    prompt: "A neighborhood coffee brand turns a morning ritual into a warm thirty-second spot.",
  },
];

export type ConsistencyScene = {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  image: string;
};

export const CONSISTENCY_SCENES: ConsistencyScene[] = [
  {
    id: "desk-signal",
    label: "night desk",
    shortLabel: "desk",
    description: "daylight trading desk with cool monitors behind her",
    image: "/work/agents/kira/ref-desk.png",
  },
  {
    id: "brooklyn-glass",
    label: "street glass",
    shortLabel: "street",
    description: "brooklyn window wall with city glass",
    image: "/work/agents/kira/ref-brooklyn.png",
  },
  {
    id: "voice-anchor",
    label: "voice anchor",
    shortLabel: "voice",
    description: "direct voice-anchor frame with a clean expression",
    image: "/work/agents/kira/ref-serious.png",
  },
  {
    id: "studio-card",
    label: "studio card",
    shortLabel: "studio",
    description: "quiet apartment window corner with plants and monitors",
    image: "/work/agents/kira/ref-head-tilt.png",
  },
  {
    id: "rain-street",
    label: "neon street",
    shortLabel: "neon",
    description: "rain-dark street window with color kept behind her",
    image: "/work/brand-guides/kira/assets/refs/finals/photo/final/cinematic_ai_icons_upres/2_blade_runner_2x.png",
  },
  {
    id: "diner-light",
    label: "diner light",
    shortLabel: "diner",
    description: "morning diner booth with chrome trim",
    image: "/work/brand-guides/kira/assets/refs/finals/photo/final/kitchen_morning_POST.jpg",
  },
  {
    id: "rooftop-close",
    label: "rooftop close",
    shortLabel: "roof",
    description: "covered rooftop under overcast skyline light",
    image: "/work/agents/kira/ref-brooklyn.png",
  },
  {
    id: "archive-room",
    label: "archive room",
    shortLabel: "archive",
    description: "labeled boxes, laptop, paper trail",
    image: "/work/agents/kira/ref-serious.png",
  },
  {
    id: "gallery-floor",
    label: "gallery floor",
    shortLabel: "gallery",
    description: "cream corridor and quiet wall text",
    image: "/work/agents/kira/ref-head-tilt.png",
  },
  {
    id: "phone-nook",
    label: "phone nook",
    shortLabel: "nook",
    description: "co-working phone booth with a closed laptop",
    image: "/work/agents/kira/ref-desk.png",
  },
  {
    id: "train-shelter",
    label: "train shelter",
    shortLabel: "train",
    description: "soft overcast daylight at a platform shelter",
    image: "/work/agents/kira/ref-brooklyn.png",
  },
  {
    id: "product-table",
    label: "product table",
    shortLabel: "product",
    description: "mock launch poster and table-top proof",
    image: "/work/agents/kira/ref-head-tilt.png",
  },
  {
    id: "elevator-lobby",
    label: "elevator lobby",
    shortLabel: "lobby",
    description: "brushed metal lobby with doorway daylight",
    image: "/work/agents/kira/ref-serious.png",
  },
  {
    id: "hotel-desk",
    label: "hotel desk",
    shortLabel: "hotel",
    description: "notebook, coffee cup, quiet travel desk",
    image: "/work/brand-guides/kira/assets/refs/finals/photo/final/kitchen_morning_POST.jpg",
  },
  {
    id: "conference-hall",
    label: "conference hall",
    shortLabel: "hall",
    description: "muted crypto conference signage behind her",
    image: "/work/agents/kira/ref-desk.png",
  },
  {
    id: "server-door",
    label: "server door",
    shortLabel: "server",
    description: "blue rack lights in the background only",
    image: "/work/brand-guides/kira/assets/refs/finals/photo/final/cinematic_ai_icons_upres/2_blade_runner_2x.png",
  },
  {
    id: "record-aisle",
    label: "record aisle",
    shortLabel: "record",
    description: "album spines and soft window light",
    image: "/work/agents/kira/ref-brooklyn.png",
  },
  {
    id: "chess-cafe",
    label: "chess cafe",
    shortLabel: "chess",
    description: "quiet cafe window with a chess table",
    image: "/work/agents/kira/ref-serious.png",
  },
  {
    id: "bookstore-corner",
    label: "bookstore corner",
    shortLabel: "books",
    description: "paperbacks and calm window light",
    image: "/work/agents/kira/ref-head-tilt.png",
  },
  {
    id: "taxi-window",
    label: "taxi window",
    shortLabel: "taxi",
    description: "overcast daylight through a taxi side window",
    image: "/work/agents/kira/ref-brooklyn.png",
  },
];

export function sampleKiraReply(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("coin") || lower.includes("token") || lower.includes("market")) {
    return "i can talk market language, but i am not pretending to have live tape here. give me a thesis, a chart window, and the audience. i'll turn it into a clean post, not a fake signal.";
  }
  if (lower.includes("brand") || lower.includes("voice")) {
    return "kira voice is dry, precise, and allergic to fluff. one sharp observation, one visual anchor, no borrowed hype words. anything more is usually cooked.";
  }
  if (lower.includes("image") || lower.includes("photo") || lower.includes("look")) {
    return "the face stays locked by treating image generation like continuity, not vibes. same anchors, same wardrobe rules, same lens family, then only the scene changes.";
  }
  return "make the constraint smaller. i am better when the brief has edges: who is it for, what should they do, and what is the one visual that proves it.";
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
