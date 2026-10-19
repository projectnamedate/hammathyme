/**
 * Pipeline visualizer data — the production pipelines, each rendered as a
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
        tool: "seedance · kling · aleph",
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
    slug: "short-film",
    label: "short film",
    brief: "the gunfight, a 92-second western, through studioly",
    totalCost: "$212 · 168 logged calls",
    totalTime: "2 days",
    finalOutput: "92s · 2.39:1 · 35mm print look",
    nodes: [
      {
        id: "script",
        label: "script",
        tool: "claude opus 5.5",
        output: "script + shot list",
        summary: "the story is written, broken down, and covered shot by shot before anything is generated.",
        x: 100, y: ROW,
      },
      {
        id: "locks",
        label: "look + cast",
        tool: "nb 2.1 · midjourney",
        cost: "$5",
        output: "82 stills",
        summary: "character, location, and look references locked as the authority for every shot.",
        x: 320, y: ROW,
      },
      {
        id: "previz",
        label: "previz",
        tool: "blender 5.1",
        output: "greybox reference clips",
        summary: "blocking and camera for each shot, rendered in blender as reference for the video model.",
        x: 540, y: ROW,
      },
      {
        id: "takes",
        label: "takes",
        tool: "seedance 2.5 r2v",
        cost: "$198",
        output: "56 takes → 43 shots",
        summary: "each shot generated from its references and previz, reviewed, and re-rolled when it misses.",
        x: 760, y: ROW,
      },
      {
        id: "finish",
        label: "cut + finish",
        tool: "eleven v4 · suno · ffmpeg",
        cost: "$0.47",
        output: "92s master",
        summary: "voices, score, and a 35mm print look with real film grain, cut to picture.",
        x: 980, y: ROW,
      },
    ],
    edges: [
      { from: "script", to: "locks" },
      { from: "locks", to: "previz" },
      { from: "previz", to: "takes" },
      { from: "takes", to: "finish" },
    ],
  },
  {
    slug: "film-to-splat",
    label: "film to splat",
    brief: "a street from the film, rebuilt and walkable",
    totalCost: "$4.75",
    totalTime: "about an hour of compute",
    finalOutput: "1m gaussians · 16 mb sog",
    nodes: [
      {
        id: "frames",
        label: "film frames",
        tool: "the gunfight master",
        output: "reference frames",
        summary: "frames from the finished film are the design authority for the set.",
        x: 100, y: ROW,
      },
      {
        id: "stills",
        label: "isolated stills",
        tool: "gpt image 2.5",
        cost: "$0.55",
        output: "one building per still",
        summary: "each building redrawn alone on a grey backdrop, matched to the film.",
        x: 320, y: ROW,
      },
      {
        id: "meshes",
        label: "meshes",
        tool: "hunyuan 3d 3.1 pro",
        cost: "$4.20",
        output: "8 meshes · 4k pbr",
        summary: "image to 3d for every building, the water tower, and the trough.",
        x: 540, y: ROW,
      },
      {
        id: "views",
        label: "set + views",
        tool: "blender 5.1 · cycles",
        output: "304 posed renders",
        summary: "the street assembled at real scale and rendered from every camera the viewer allows.",
        x: 760, y: ROW,
      },
      {
        id: "splat",
        label: "train + ship",
        tool: "brush · spark",
        output: "orbitable splat",
        summary: "trained on apple silicon, compressed to sog, and checked from the viewer's own angles.",
        x: 980, y: ROW,
      },
    ],
    edges: [
      { from: "frames", to: "stills" },
      { from: "stills", to: "meshes" },
      { from: "meshes", to: "views" },
      { from: "views", to: "splat" },
      { from: "splat", to: "views", loop: true },
    ],
  },
  {
    slug: "still-to-ar",
    label: "still to ar",
    brief: "a life-size humpback in your room",
    totalCost: "≈ $1.20",
    totalTime: "one session",
    finalOutput: "usdz + glb · tabletop and 15 m",
    nodes: [
      {
        id: "reference",
        label: "reference",
        tool: "gpt image 2.5",
        cost: "$0.06",
        output: "neutral rigging pose",
        summary: "one animal, body straight, fins clear of the flank, so the mesh comes back riggable.",
        x: 100, y: ROW,
      },
      {
        id: "mesh",
        label: "mesh",
        tool: "hunyuan 3d 3.1 pro",
        cost: "$0.53",
        time: "3 min",
        output: "500k tris · 4k pbr",
        summary: "image to 3d, then decimated to 100k triangles with 2k textures for phones.",
        x: 320, y: ROW,
      },
      {
        id: "rig",
        label: "rig + swim",
        tool: "blender 5.1 · python",
        output: "spine skin · 24s lap",
        summary: "skinned to a spine in code and keyed as a seamless lap: tail stroke, fins, a bank into the turn.",
        x: 540, y: ROW,
      },
      {
        id: "export",
        label: "export",
        tool: "usd · gltf · usdchecker",
        output: "4 files under 10 mb",
        summary: "tabletop and life-size at true scale, checked against apple's ar rules.",
        x: 760, y: ROW,
      },
      {
        id: "place",
        label: "place",
        tool: "quick look · scene viewer",
        output: "qr → your room",
        summary: "a phone opens it in ar; a desktop shows a code that sends you to the phone.",
        x: 980, y: ROW,
      },
    ],
    edges: [
      { from: "reference", to: "mesh" },
      { from: "mesh", to: "rig" },
      { from: "rig", to: "export" },
      { from: "export", to: "place" },
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
        tool: "p5 · fframes · three.js",
        output: "scene code",
        summary: "every frame is a function of time, so any frame renders on its own.",
        x: 320, y: ROW,
      },
      {
        id: "render",
        label: "render",
        tool: "headless gpu · fframes",
        output: "frames · 24fps",
        summary: "the film is recorded frame by frame, the same every run.",
        x: 540, y: ROW,
      },
      {
        id: "review",
        label: "self-review",
        tool: "contact sheets · strips",
        output: "review notes",
        summary: "the agent checks its own frames for pops, flicker, and timing before anyone watches.",
        x: 760, y: ROW,
      },
      {
        id: "master",
        label: "score + master",
        tool: "web audio · ffmpeg",
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
