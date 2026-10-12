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
    totalCost: "≈ $10–25",
    totalTime: "≈ 50 min",
    finalOutput: "broadcast prores 4444 + h.264 web cut",
    nodes: [
      {
        id: "brief",
        label: "brief",
        tool: "claude opus 5.5",
        cost: "$0.02",
        time: "30s",
        output: "brief.md",
        summary: "one-paragraph director's statement: cut, audience, deadline.",
        x: 100, y: ROW,
      },
      {
        id: "script",
        label: "script",
        tool: "claude opus 5.5",
        cost: "$0.04",
        time: "60s",
        output: "shot-list.md",
        summary: "hero-shot list: object, talent, movement, macro texture, and end card.",
        x: 320, y: ROW,
      },
      {
        id: "moodboard",
        label: "mood board",
        tool: "gpt image 2.5",
        cost: "$1–3",
        time: "2 min",
        output: "8 stills · 1024²",
        summary: "look refs and keyframes for lighting, texture, camera, and talent read.",
        x: 540, y: ROW,
      },
      {
        id: "video",
        label: "generation",
        tool: "seedance 2.5 · kling 3 · runway aleph",
        cost: "$8–22",
        time: "18 min",
        output: "candidate takes · 1080p",
        summary: "short motion passes from the selected keyframe and shot direction.",
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
      { from: "moodboard", to: "video" },
      { from: "video", to: "grade" },
    ],
  },
  {
    slug: "code-animation",
    label: "code animation",
    brief: "a short film drawn entirely in code",
    totalCost: "no generation spend",
    totalTime: "one session per film",
    finalOutput: "1080p h.264 master · -14 lufs",
    nodes: [
      {
        id: "treatment",
        label: "treatment",
        tool: "claude opus 5.5",
        output: "treatment.md",
        summary: "pitch, beats, palette, and a timing table, approved before any code.",
        x: 100, y: ROW,
      },
      {
        id: "scene",
        label: "scene code",
        tool: "p5.brush · fframes · three.js",
        output: "scene code",
        summary: "every frame is a function of time, so any frame renders on its own.",
        x: 320, y: ROW,
      },
      {
        id: "render",
        label: "render",
        tool: "headless gpu browser · fframes",
        output: "frames · 24fps",
        summary: "the film is recorded frame by frame, the same every run.",
        x: 540, y: ROW,
      },
      {
        id: "review",
        label: "self-review",
        tool: "contact sheets · frame strips",
        output: "review notes",
        summary: "the agent checks its own frames for pops, flicker, and timing before anyone watches.",
        x: 760, y: ROW,
      },
      {
        id: "master",
        label: "score + master",
        tool: "web audio synthesis · ffmpeg",
        output: "h.264 + aac",
        summary: "sound is synthesized in code, measured, and mixed into the master.",
        x: 980, y: ROW,
      },
    ],
    edges: [
      { from: "treatment", to: "scene" },
      { from: "scene", to: "render" },
      { from: "render", to: "review" },
      { from: "review", to: "scene", loop: true },
      { from: "review", to: "master" },
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
