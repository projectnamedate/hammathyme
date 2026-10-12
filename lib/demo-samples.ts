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
