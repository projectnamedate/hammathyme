/**
 * Pipeline visualizer data — three sample pipelines, each rendered as a
 * hand-positioned node graph. Coordinates are in the viewBox 0..1200 / 0..400
 * used by `<PipelineVisualizer>`.
 *
 * Brand contract: shape + receipts are public; full prompts and configs are
 * not. Each node's `summary` is the public-level description.
 */

export type PipelineNode = {
  id: string;
  label: string;
  tool: string;
  cost?: string;
  time?: string;
  output: string;
  summary: string;
  /** position inside the viewBox */
  x: number;
  y: number;
};

export type PipelineEdge = {
  from: string;
  to: string;
  /** if true, draws a curved return path (for loops) */
  loop?: boolean;
};

export type Pipeline = {
  slug: string;
  label: string;
  /** quick descriptor, shown in the tab */
  brief: string;
  totalCost: string;
  totalTime: string;
  finalOutput: string;
  nodes: PipelineNode[];
  edges: PipelineEdge[];
};

const ROW = 200;

export const PIPELINES: Pipeline[] = [
  {
    slug: "campaign-hero-shots",
    label: "campaign hero shots",
    brief: "brand film concept to compact cut",
    totalCost: "≈ $25",
    totalTime: "≈ 50 min",
    finalOutput: "broadcast prores 4444 + h.264 web cut",
    nodes: [
      {
        id: "brief",
        label: "brief",
        tool: "claude opus 4.7",
        cost: "$0.02",
        time: "30s",
        output: "brief.md",
        summary: "one-paragraph director's statement: cut, audience, deadline.",
        x: 100, y: ROW,
      },
      {
        id: "script",
        label: "script",
        tool: "claude opus 4.7",
        cost: "$0.04",
        time: "60s",
        output: "shot-list.md",
        summary: "hero-shot list: object, talent, movement, macro texture, and end card.",
        x: 320, y: ROW,
      },
      {
        id: "moodboard",
        label: "mood board",
        tool: "fal flux pro 1.1",
        cost: "$0.40",
        time: "2 min",
        output: "8 stills · 1024²",
        summary: "look refs at three lighting states. picks one for veo seed.",
        x: 540, y: ROW,
      },
      {
        id: "veo",
        label: "generation",
        tool: "google veo 3.1",
        cost: "$24",
        time: "18 min",
        output: "12 takes · 1080p",
        summary: "12 candidate takes from one shot description + seed image.",
        x: 760, y: ROW,
      },
      {
        id: "grade",
        label: "grade + master",
        tool: "davinci resolve",
        time: "30 min",
        output: "prores + h.264",
        summary: "select, conform, color-grade to broadcast 709, mix, master.",
        x: 980, y: ROW,
      },
    ],
    edges: [
      { from: "brief", to: "script" },
      { from: "script", to: "moodboard" },
      { from: "moodboard", to: "veo" },
      { from: "veo", to: "grade" },
    ],
  },
  {
    slug: "autonomous-character",
    label: "autonomous character",
    brief: "kira-class · always-on social presence",
    totalCost: "≈ $0.10 / day",
    totalTime: "≈ 90s / post",
    finalOutput: "live posts + replies, 24/7",
    nodes: [
      {
        id: "design",
        label: "character design",
        tool: "claude opus + flux",
        cost: "$0.50",
        time: "10 min",
        output: "bio + key art",
        summary: "name, voice, look, posting rules. one short charter doc.",
        x: 100, y: ROW,
      },
      {
        id: "lora",
        label: "lora",
        tool: "fal · kohya",
        cost: "$2",
        time: "25 min",
        output: "character.safetensors",
        summary: "trained on the identity sheet. locks face + wardrobe.",
        x: 320, y: ROW,
      },
      {
        id: "schedule",
        label: "scheduler",
        tool: "hermes (custom)",
        output: "daily plan",
        summary: "agent that picks topics, tone, and posting cadence per day.",
        x: 540, y: ROW,
      },
      {
        id: "post",
        label: "post generator",
        tool: "claude haiku + flux + lora",
        cost: "$0.08 / post",
        time: "90s",
        output: "image + caption",
        summary: "writes copy on the topic, generates image with the lora.",
        x: 760, y: ROW,
      },
      {
        id: "publish",
        label: "publish + reply",
        tool: "platform apis · claude haiku",
        cost: "$0.02 / reply",
        output: "live posts",
        summary: "publishes, watches mentions, drafts replies in voice.",
        x: 980, y: ROW,
      },
    ],
    edges: [
      { from: "design", to: "lora" },
      { from: "lora", to: "schedule" },
      { from: "schedule", to: "post" },
      { from: "post", to: "publish" },
      { from: "publish", to: "schedule", loop: true },
    ],
  },
  {
    slug: "motion-graphics-insert",
    label: "motion graphics insert",
    brief: "remotion + hyperframes · broadcast cut",
    totalCost: "≈ $0.50",
    totalTime: "≈ 6 min",
    finalOutput: "prores master + lottie web fallback",
    nodes: [
      {
        id: "brief",
        label: "brief",
        tool: "claude opus",
        cost: "$0.02",
        time: "30s",
        output: "brief.md",
        summary: "what the insert says + how long it can be.",
        x: 140, y: ROW,
      },
      {
        id: "comp",
        label: "comp",
        tool: "remotion + claude code",
        time: "2 min",
        output: "react.tsx",
        summary: "agent writes the remotion composition from the brief.",
        x: 420, y: ROW,
      },
      {
        id: "render",
        label: "render",
        tool: "remotion lambda",
        cost: "$0.50",
        time: "4 min",
        output: "mp4 · 4k",
        summary: "deterministic render farm. seek-driven, frame-perfect.",
        x: 700, y: ROW,
      },
      {
        id: "deliver",
        label: "deliver",
        tool: "ffmpeg",
        time: "30s",
        output: "prores + lottie",
        summary: "broadcast master + a lottie web fallback for the site.",
        x: 980, y: ROW,
      },
    ],
    edges: [
      { from: "brief", to: "comp" },
      { from: "comp", to: "render" },
      { from: "render", to: "deliver" },
    ],
  },
];
