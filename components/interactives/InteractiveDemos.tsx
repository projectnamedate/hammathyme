"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FormEvent, useMemo, useState } from "react";
import {
  CONSISTENCY_SCENES,
  SAMPLE_STORYBOARD,
  STORYBOARD_PRESETS,
  sampleKiraReply,
  type ConsistencyScene,
  type StoryboardPreset,
  type StoryboardPanel,
} from "@/lib/demo-samples";
import { WORDMARK_LETTERS } from "@/components/Wordmark";

type ApiState = {
  loading: boolean;
  status: string;
  sample: boolean;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const CONTROL =
  "border border-[var(--ink-4)] bg-[var(--cream-0)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-1)] transition-[border-color,background-color,color,opacity,transform] duration-300 hover:border-[var(--cinnamon)] hover:text-[var(--cinnamon)] focus-visible:border-[var(--cinnamon)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-45";

const INPUT =
  "w-full border border-[var(--ink-4)] bg-[var(--cream-0)] p-4 font-display text-[18px] font-light leading-[1.35] tracking-[-0.01em] text-[var(--ink-0)] outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-[var(--ink-3)] focus:border-[var(--cinnamon)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]";

const CINEMA = [0.65, 0, 0.35, 1] as const;
const SOFT = [0.25, 0.1, 0.25, 1] as const;

const PRESET_BUTTON =
  "min-h-10 overflow-hidden border border-[var(--ink-4)] bg-[var(--cream-0)] px-3 py-2 text-left font-mono text-[9px] uppercase leading-[1.25] tracking-[0.12em] text-[var(--ink-1)] transition-[border-color,background-color,color,opacity,transform] duration-300 hover:border-[var(--cinnamon)] hover:text-[var(--cinnamon)] focus-visible:border-[var(--cinnamon)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]";

const STORYBOARD_QUICK_PRESETS = STORYBOARD_PRESETS.slice(0, 3);

function randomDifferent<T>(items: readonly T[], current: T, getId: (item: T) => string): T {
  const pool = items.filter((item) => getId(item) !== getId(current));
  return pool[Math.floor(Math.random() * pool.length)] ?? current;
}

function statusCopy(state: ApiState) {
  if (state.loading) return "running";
  return state.status;
}

function DemoStatus({ state }: { state: ApiState }) {
  const reduce = useReducedMotion();
  return (
    <div
      className="flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--ink-2)]"
      aria-live="polite"
    >
      <motion.span
        className="inline-flex h-2 w-2 rounded-full bg-[var(--cinnamon)]"
        animate={reduce ? undefined : { scale: state.loading ? [1, 1.65, 1] : 1, opacity: state.loading ? [0.55, 1, 0.55] : 1 }}
        transition={reduce ? undefined : { duration: 0.9, repeat: state.loading ? Infinity : 0, ease: SOFT }}
      />
      <span>{statusCopy(state)}</span>
      <span className="text-[var(--ink-4)]">/</span>
      <span>$1 daily cap</span>
    </div>
  );
}

function PanelGlyph({ index }: { index: number }) {
  const reduce = useReducedMotion();
  const left = 18 + (index % 3) * 7;
  return (
    <div className="pointer-events-none absolute inset-3 overflow-hidden border border-[var(--ink-4)] bg-[var(--cream-0)]">
      <motion.div
        className="absolute h-16 w-16 rounded-full bg-[var(--cinnamon)] opacity-25"
        style={{ left: `${left}%`, top: `${10 + (index % 2) * 12}%` }}
        animate={reduce ? undefined : { scale: [1, 1.12, 1], x: [0, 3 - index, 0] }}
        transition={reduce ? undefined : { duration: 3.5 + index * 0.2, repeat: Infinity, ease: SOFT }}
      />
      <div className="absolute bottom-0 left-0 h-10 w-full bg-[var(--ink-0)] opacity-[0.08]" />
      <motion.div
        className="absolute bottom-6 h-[1px] w-24 bg-[var(--ink-1)]"
        style={{ left: `${12 + index * 3}%`, rotate: `${index % 2 ? -7 : 5}deg` }}
        animate={reduce ? undefined : { scaleX: [0.78, 1, 0.78] }}
        transition={reduce ? undefined : { duration: 2.8, repeat: Infinity, delay: index * 0.15, ease: CINEMA }}
      />
      <motion.div
        className="absolute h-8 w-5 bg-[var(--ink-0)]"
        style={{ left: `${42 + (index % 2) * 18}%`, top: `${34 + (index % 3) * 7}%` }}
        animate={reduce ? undefined : { y: [0, -3, 0] }}
        transition={reduce ? undefined : { duration: 2.4, repeat: Infinity, delay: index * 0.2, ease: SOFT }}
      />
    </div>
  );
}

export function PromptStoryboardDemo() {
  const reduce = useReducedMotion();
  const inputId = "storyboard-brief";
  const [preset, setPreset] = useState<StoryboardPreset>(STORYBOARD_PRESETS[0]);
  const [prompt, setPrompt] = useState(STORYBOARD_PRESETS[0].prompt);
  const [panels, setPanels] = useState<StoryboardPanel[]>(SAMPLE_STORYBOARD);
  const [storyboardImage, setStoryboardImage] = useState<string | null>(null);
  const [liveUsed, setLiveUsed] = useState(false);
  const [state, setState] = useState<ApiState>({ loading: false, status: "sample board loaded", sample: true });

  function loadStoryboardPreset(nextPreset: StoryboardPreset) {
    setPreset(nextPreset);
    setPrompt(nextPreset.prompt);
    setStoryboardImage(null);
    setState({ loading: false, status: `${nextPreset.genre} brief loaded`, sample: true });
  }

  function loadRandomStoryboardPreset() {
    loadStoryboardPreset(randomDifferent(STORYBOARD_PRESETS, preset, (item) => item.id));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.loading || liveUsed) return;
    setState({ loading: true, status: "running", sample: true });
    try {
      const response = await fetch("/api/demos/storyboard", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        panels?: StoryboardPanel[];
        imageUrl?: string;
        status?: string;
        sample?: boolean;
      };
      if (!response.ok || !data.ok || !data.panels) throw new Error(data.error || "storyboard failed");
      setPanels(data.panels);
      setStoryboardImage(data.imageUrl ?? null);
      if (!data.sample) setLiveUsed(true);
      setState({ loading: false, status: data.status ?? "live", sample: Boolean(data.sample) });
    } catch (error) {
      setPanels(SAMPLE_STORYBOARD);
      setStoryboardImage(null);
      setState({
        loading: false,
        status: error instanceof Error ? error.message : "sample fallback",
        sample: true,
      });
    }
  }

  return (
    <section className="mx-auto max-w-[1440px]">
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[420px_1fr]">
        <motion.form
          onSubmit={submit}
          className="border-y border-[var(--ink-4)] py-6 xl:sticky xl:top-28 xl:self-start"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.55, ease: CINEMA }}
        >
          <DemoStatus state={state} />
          <div className="mt-5 border-t border-[var(--ink-4)] pt-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--cinnamon)]">
              {preset.genre}
            </p>
            <p className="mt-2 font-display text-[22px] font-light leading-[1.18] tracking-[-0.015em] text-[var(--ink-0)]">
              {preset.title}
            </p>
          </div>
          <label htmlFor={inputId} className="mt-5 block font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--cinnamon)]">
            brief
          </label>
          <textarea
            id={inputId}
            name="storyboard-brief"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            className={`${INPUT} mt-3 min-h-[172px] resize-none`}
            maxLength={520}
            autoComplete="off"
            placeholder="write the scene…"
          />
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button className={CONTROL} data-cursor="link" data-cursor-label="build" disabled={state.loading || liveUsed} type="submit">
              {liveUsed ? "live used" : "build board"}
            </button>
            <button
              className={CONTROL}
              data-cursor="link"
              data-cursor-label="random"
              type="button"
              onClick={loadRandomStoryboardPreset}
            >
              random brief
            </button>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-2 border-t border-[var(--ink-4)] pt-3">
            {STORYBOARD_QUICK_PRESETS.map((item) => (
              <button
                key={item.id}
                type="button"
                data-cursor="link"
                data-cursor-label="load"
                onClick={() => loadStoryboardPreset(item)}
                className={`min-h-16 border border-[var(--ink-4)] bg-[var(--cream-0)] px-3 py-2 text-left transition-[border-color,color] duration-300 hover:border-[var(--cinnamon)] hover:text-[var(--cinnamon)] focus-visible:border-[var(--cinnamon)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] ${
                  preset.id === item.id ? "border-[var(--cinnamon)] text-[var(--cinnamon)]" : "text-[var(--ink-1)]"
                }`}
              >
                <span className="block font-mono text-[9px] uppercase tracking-[0.14em]">{item.title}</span>
                <span className="mt-1 block font-display text-[14px] font-light leading-[1.25] tracking-[-0.005em]">
                  {item.prompt}
                </span>
              </button>
            ))}
          </div>
        </motion.form>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          <motion.figure
            className="border border-[var(--ink-4)] bg-[var(--cream-1)] p-3 md:col-span-2 xl:col-span-3"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.58, ease: CINEMA }}
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-[var(--cream-0)]">
              {storyboardImage ? (
                <motion.img
                  key={storyboardImage}
                  src={storyboardImage}
                  alt="Generated six-panel storyboard contact sheet"
                  className="h-full w-full object-cover"
                  initial={reduce ? false : { opacity: 0, scale: 1.015 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: reduce ? 0 : 0.5, ease: SOFT }}
                />
              ) : (
                <div className="grid h-full grid-cols-3 grid-rows-2 gap-2 p-3">
                  {panels.map((panel, index) => (
                    <div key={`preview-${panel.id}-${index}`} className="relative overflow-hidden border border-[var(--ink-4)] bg-[var(--cream-2)]">
                      <PanelGlyph index={index} />
                      <span className="absolute left-3 top-3 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--ink-0)]">
                        {panel.id}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <AnimatePresence>
                {state.loading ? (
                  <motion.div
                    className="absolute inset-y-0 left-0 w-14 bg-[linear-gradient(90deg,transparent,rgba(242,142,134,0.38),transparent)]"
                    initial={{ x: "-120%" }}
                    animate={{ x: "2200%" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: CINEMA }}
                  />
                ) : null}
              </AnimatePresence>
            </div>
            <figcaption className="mt-3 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ink-2)]">
              fal nano banana 2 storyboard sheet when budget store is connected
            </figcaption>
          </motion.figure>
        </div>
      </div>
    </section>
  );
}

const LAB_FRAMES = CONSISTENCY_SCENES.slice(0, 6);

export function ConsistencyLabDemo() {
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState<ConsistencyScene>(CONSISTENCY_SCENES[0]);
  const [liveImage, setLiveImage] = useState<string | null>(null);
  const [state, setState] = useState<ApiState>({ loading: false, status: "canonical refs loaded", sample: true });

  function loadKiraPreset(scene: ConsistencyScene) {
    setSelected(scene);
    setLiveImage(null);
    setState({ loading: false, status: `${scene.shortLabel} prompt loaded`, sample: true });
  }

  function loadRandomKiraPreset() {
    loadKiraPreset(randomDifferent(CONSISTENCY_SCENES, selected, (item) => item.id));
  }

  async function generate() {
    if (state.loading) return;
    setState({ loading: true, status: "running", sample: true });
    try {
      const response = await fetch("/api/demos/consistency", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sceneId: selected.id }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        imageUrl?: string;
        status?: string;
        sample?: boolean;
      };
      if (!response.ok || !data.ok || !data.imageUrl) throw new Error("render failed");
      setLiveImage(data.imageUrl);
      setState({ loading: false, status: data.status ?? "live", sample: Boolean(data.sample) });
    } catch {
      setLiveImage(selected.image);
      setState({ loading: false, status: "sample fallback", sample: true });
    }
  }

  return (
    <section className="mx-auto max-w-[1440px]">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {LAB_FRAMES.map((frame, index) => (
            <motion.button
              key={`${frame.id}-${index}`}
              type="button"
              data-cursor="link"
              data-cursor-label="select"
              onClick={() => loadKiraPreset(frame)}
              className={`relative overflow-hidden border bg-[var(--cream-1)] p-2 text-left transition ${
                selected.id === frame.id ? "border-[var(--cinnamon)]" : "border-[var(--ink-4)]"
              }`}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : index * 0.06, ease: CINEMA }}
              whileHover={reduce ? undefined : { y: -5 }}
            >
              <div className="relative overflow-hidden">
                <motion.img
                  src={frame.id === selected.id && liveImage ? liveImage : frame.image}
                  alt={`Kira ${frame.label}`}
                  className="aspect-[3/4] w-full object-cover object-top"
                  animate={reduce ? undefined : { scale: selected.id === frame.id ? 1.035 : 1 }}
                  transition={{ duration: reduce ? 0 : 0.55, ease: SOFT }}
                />
                <motion.div
                  className="absolute inset-0 border border-[var(--cream-0)] opacity-0"
                  animate={reduce ? undefined : { opacity: selected.id === frame.id ? [0.15, 0.45, 0.15] : 0 }}
                  transition={{ duration: 1.8, repeat: selected.id === frame.id ? Infinity : 0, ease: SOFT }}
                />
              </div>
              <span className="absolute bottom-3 left-3 bg-[var(--cream-0)] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--ink-1)]">
                {String(index + 1).padStart(2, "0")} / {frame.shortLabel}
              </span>
            </motion.button>
          ))}
        </div>

        <motion.aside
          className="border-y border-[var(--ink-4)] py-6 lg:sticky lg:top-28 lg:self-start"
          initial={reduce ? false : { opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: reduce ? 0 : 0.6, ease: CINEMA }}
        >
          <DemoStatus state={state} />
          <div className="mt-5 border-t border-[var(--ink-4)] pt-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--cinnamon)]">
              selected prompt
            </p>
            <p className="mt-2 font-display text-[24px] font-light leading-[1.1] tracking-[-0.015em] text-[var(--ink-0)]">
              {selected.label}
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase leading-[1.55] tracking-[0.12em] text-[var(--ink-2)]">
              {selected.description}
            </p>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <button
              className={CONTROL}
              data-cursor="link"
              data-cursor-label="random"
              type="button"
              onClick={loadRandomKiraPreset}
            >
              random prompt
            </button>
            <button
              className={CONTROL}
              data-cursor="link"
              data-cursor-label="render"
              type="button"
              onClick={generate}
              disabled={state.loading}
            >
              {state.loading ? "running" : "generate"}
            </button>
          </div>
          <div className="mt-5 grid max-h-[240px] grid-cols-2 gap-2 overflow-y-auto border-y border-[var(--ink-4)] py-3 pr-1">
            {CONSISTENCY_SCENES.map((scene) => (
              <button
                key={scene.id}
                type="button"
                data-cursor="link"
                data-cursor-label="select"
                onClick={() => loadKiraPreset(scene)}
                className={`${PRESET_BUTTON} ${selected.id === scene.id ? "border-[var(--cinnamon)] text-[var(--cinnamon)]" : ""}`}
              >
                {scene.shortLabel}
              </button>
            ))}
          </div>
          <div className="mt-5 overflow-hidden border border-[var(--ink-4)] bg-[var(--cream-1)] p-3">
            <AnimatePresence mode="wait">
              <motion.img
                key={liveImage ?? selected.image}
                src={liveImage ?? selected.image}
                alt={`Selected Kira ${selected.label}`}
                className="aspect-[4/5] w-full object-cover object-top"
                initial={reduce ? false : { opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.985 }}
                transition={{ duration: reduce ? 0 : 0.45, ease: SOFT }}
              />
            </AnimatePresence>
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-[var(--ink-4)] pt-4">
            {[
              ["identity", "locked"],
              ["wardrobe", "black blazer"],
              ["prompt", "safe"],
              ["mode", state.loading ? "running" : state.sample ? "sample" : "live"],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--cinnamon)]">{label}</dt>
                <dd className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--ink-2)]">{value}</dd>
              </div>
            ))}
          </dl>
        </motion.aside>
      </div>
    </section>
  );
}

export function KiraChatDemo() {
  const reduce = useReducedMotion();
  const inputId = "kira-chat-message";
  const [input, setInput] = useState("How would you turn a noisy product launch into one clean post?");
  const [userMessages, setUserMessages] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "give me a concrete constraint. vibes are expensive. edges are useful.",
    },
  ]);
  const [state, setState] = useState<ApiState>({ loading: false, status: "character online", sample: true });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || state.loading || userMessages >= 4) return;
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setUserMessages((count) => count + 1);
    setState({ loading: true, status: "thinking", sample: true });
    try {
      const response = await fetch("/api/demos/kira-chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: trimmed, messages: nextMessages }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        reply?: string;
        status?: string;
        sample?: boolean;
      };
      if (!response.ok || !data.ok || !data.reply) throw new Error("chat failed");
      const assistantMessage: ChatMessage = { role: "assistant", content: data.reply };
      setMessages([...nextMessages, assistantMessage].slice(-7));
      setState({ loading: false, status: data.status ?? "live", sample: Boolean(data.sample) });
    } catch {
      const assistantMessage: ChatMessage = { role: "assistant", content: sampleKiraReply(trimmed) };
      setMessages([...nextMessages, assistantMessage].slice(-7));
      setState({ loading: false, status: "sample fallback", sample: true });
    }
  }

  return (
    <section className="mx-auto max-w-[1180px]">
      <motion.div
        className="grid min-h-[620px] grid-cols-1 border border-[var(--ink-4)] bg-[var(--cream-1)] lg:grid-cols-[360px_1fr]"
        initial={reduce ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.65, ease: CINEMA }}
      >
        <aside className="border-b border-[var(--ink-4)] p-5 lg:border-b-0 lg:border-r">
          <DemoStatus state={state} />
          <div className="mt-8 aspect-[1/1] overflow-hidden border border-[var(--ink-4)] bg-[var(--cream-0)]">
            <motion.img
              src="/work/brand-guides/kira/assets/refs/finals/photo/final/cinematic_ai_icons_upres/2_blade_runner_2x.png"
              alt="Kira cinematic portrait"
              className="h-full w-full object-cover object-top"
              animate={reduce ? undefined : { scale: state.loading ? [1, 1.025, 1] : 1 }}
              transition={reduce ? undefined : { duration: 1.4, repeat: state.loading ? Infinity : 0, ease: SOFT }}
            />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            {["voice", "image", "market", "brand"].map((preset) => (
              <button
                key={preset}
                type="button"
                className={CONTROL}
                data-cursor="link"
                data-cursor-label="prompt"
                onClick={() => setInput(`give me a ${preset} take in kira voice.`)}
              >
                {preset}
              </button>
            ))}
          </div>
        </aside>

        <div className="flex min-h-[620px] flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto p-5 md:p-7">
            <AnimatePresence initial={false}>
              {messages.map((message, index) => (
                <motion.div
                  key={`${message.role}-${index}-${message.content.slice(0, 12)}`}
                  className={`max-w-[78%] border border-[var(--ink-4)] p-4 ${
                    message.role === "user"
                      ? "ml-auto bg-[var(--ink-0)] text-[var(--cream-0)]"
                      : "bg-[var(--cream-0)] text-[var(--ink-0)]"
                  }`}
                  initial={reduce ? false : { opacity: 0, y: 14, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: reduce ? 0 : 0.35, ease: SOFT }}
                >
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] opacity-70">{message.role}</p>
                  <p className="mt-2 font-display text-[19px] font-light leading-[1.35] tracking-[-0.01em]">
                    {message.content}
                  </p>
                </motion.div>
              ))}
              {state.loading ? (
                <motion.div
                  key="typing"
                  className="w-fit border border-[var(--ink-4)] bg-[var(--cream-0)] px-4 py-3"
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -6 }}
                >
                  <span className="sr-only">Kira is typing</span>
                  <span className="flex gap-1">
                    {[0, 1, 2].map((dot) => (
                      <motion.span
                        key={dot}
                        className="h-1.5 w-1.5 rounded-full bg-[var(--cinnamon)]"
                        animate={reduce ? undefined : { y: [0, -4, 0], opacity: [0.45, 1, 0.45] }}
                        transition={reduce ? undefined : { duration: 0.7, repeat: Infinity, delay: dot * 0.12 }}
                      />
                    ))}
                  </span>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          <form onSubmit={submit} className="border-t border-[var(--ink-4)] p-4 md:flex md:gap-3">
            <label htmlFor={inputId} className="sr-only">
              message Kira
            </label>
            <input
              id={inputId}
              name="kira-chat-message"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className={`${INPUT} min-h-0 flex-1`}
              maxLength={420}
              autoComplete="off"
              placeholder={userMessages >= 4 ? "message cap reached" : "message kira…"}
              disabled={userMessages >= 4}
            />
            <button
              className={`${CONTROL} mt-3 min-w-[132px] md:mt-0`}
              data-cursor="link"
              data-cursor-label="send"
              type="submit"
              disabled={state.loading || userMessages >= 4}
            >
              {userMessages >= 4 ? "capped" : "send"}
            </button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

const DOT_TARGET = {
  gap: -9,
  baseline: 12,
  size: 171,
};

export function DotDisciplineGame() {
  const reduce = useReducedMotion();
  const [gap, setGap] = useState(28);
  const [baseline, setBaseline] = useState(-34);
  const [size, setSize] = useState(132);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [message, setMessage] = useState("align the mark");

  const score = useMemo(() => {
    const gapScore = Math.abs(gap - DOT_TARGET.gap) * 0.9;
    const baselineScore = Math.abs(baseline - DOT_TARGET.baseline) * 0.95;
    const sizeScore = Math.abs(size - DOT_TARGET.size) * 0.42;
    return clamp(Math.round(100 - gapScore - baselineScore - sizeScore), 0, 100);
  }, [baseline, gap, size]);
  const controls: [string, number, (next: number) => void, number, number][] = [
    ["dot gap", gap, setGap, -60, 44],
    ["baseline", baseline, setBaseline, -60, 88],
    ["diameter", size, setSize, 118, 230],
  ];

  function lock() {
    const nextStreak = score >= 90 ? streak + 1 : 0;
    setStreak(nextStreak);
    setBest(Math.max(best, score));
    setMessage(score >= 98 ? "approved" : score >= 90 ? "near the recipe" : "missed the recipe");
    if (score >= 90) {
      setGap(DOT_TARGET.gap + (Math.random() * 72 - 36));
      setBaseline(DOT_TARGET.baseline + (Math.random() * 92 - 46));
      setSize(DOT_TARGET.size + (Math.random() * 92 - 46));
    }
  }

  return (
    <section className="mx-auto max-w-[1220px]">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <motion.div
          className="relative overflow-hidden border border-[var(--ink-4)] bg-[var(--cream-1)] p-5 md:p-8"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.65, ease: CINEMA }}
        >
          <div className="relative h-[300px] overflow-hidden bg-[var(--cream-0)] md:aspect-[16/9] md:h-auto md:min-h-[320px]">
            <div className="absolute left-[8%] right-[8%] top-[55%] h-[1px] bg-[var(--ink-4)]" />
            <div className="absolute left-[8%] right-[8%] top-[62%] h-[1px] bg-[var(--cinnamon)] opacity-45" />
            <div className="absolute left-1/2 top-1/2 w-[min(88vw,640px)] -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="relative inline-block pb-[0.18em]">
                <span
                  className="kw text-[clamp(36px,10vw,172px)] leading-[0.84] text-[var(--ink-0)]"
                  aria-label="hammer wordmark calibration"
                >
                  <span className="kw-word" aria-hidden>
                    {WORDMARK_LETTERS.map((letter, index) => (
                      <span className="kw-letter-mask" key={`${letter}-${index}`}>
                        <span className="kw-letter">{letter}</span>
                      </span>
                    ))}
                  </span>
                  <span
                    aria-hidden
                    className="relative inline-block rounded-full align-baseline"
                    style={{
                      width: `${DOT_TARGET.size / 1000}em`,
                      height: `${DOT_TARGET.size / 1000}em`,
                      marginLeft: `${DOT_TARGET.gap / 1000}em`,
                      transform: `translateY(${DOT_TARGET.baseline / 1000}em)`,
                    }}
                  >
                    <motion.span
                      className="absolute inset-0 rounded-full border border-[var(--cinnamon)]"
                      animate={reduce ? undefined : { scale: [1, 1.18, 1], opacity: [0.3, 0.82, 0.3] }}
                      transition={reduce ? undefined : { duration: 1.8, repeat: Infinity, ease: SOFT }}
                    />
                    <motion.span
                      className="absolute rounded-full bg-[var(--cinnamon)]"
                      style={{
                        width: `${size / 1000}em`,
                        height: `${size / 1000}em`,
                        left: `calc(50% + ${(gap - DOT_TARGET.gap) / 1000}em)`,
                        top: `calc(50% + ${(baseline - DOT_TARGET.baseline) / 1000}em)`,
                        transform: "translate(-50%, -50%)",
                      }}
                      animate={reduce ? undefined : { boxShadow: score >= 90 ? "0 0 0 12px rgba(242,142,134,0.18)" : "0 0 0 0 rgba(242,142,134,0)" }}
                      transition={{ duration: reduce ? 0 : 0.35, ease: SOFT }}
                    />
                  </span>
                </span>
              </div>
            </div>
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between font-mono uppercase tracking-[0.16em]">
              <span className="text-[10px] text-[var(--ink-2)]">{message}</span>
              <motion.span
                className="font-display text-[56px] font-light leading-none tracking-[-0.04em] text-[var(--ink-0)]"
                animate={reduce ? undefined : { scale: score >= 90 ? 1.08 : 1 }}
                transition={{ duration: reduce ? 0 : 0.25, ease: SOFT }}
              >
                {score}
              </motion.span>
            </div>
          </div>
        </motion.div>

        <motion.aside
          className="border-y border-[var(--ink-4)] py-6"
          initial={reduce ? false : { opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: reduce ? 0 : 0.62, ease: CINEMA }}
        >
          <div className="grid grid-cols-3 gap-2">
            {[
              ["score", String(score)],
              ["streak", String(streak)],
              ["best", String(best)],
            ].map(([label, value]) => (
              <div key={label} className="border border-[var(--ink-4)] bg-[var(--cream-0)] p-3">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--cinnamon)]">{label}</p>
                <p className="mt-2 font-display text-[28px] font-light leading-none tracking-[-0.035em] text-[var(--ink-0)]">{value}</p>
              </div>
            ))}
          </div>

          {controls.map(([label, value, setter, min, max]) => (
            <label key={String(label)} className="mt-6 block">
              <span className="flex justify-between font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--ink-2)]">
                <span>{label}</span>
                <span>{Math.round(Number(value))}</span>
              </span>
              <input
                className="mt-3 h-1 w-full accent-[var(--cinnamon)]"
                type="range"
                name={`dot-${label.replace(/\s+/g, "-")}`}
                min={Number(min)}
                max={Number(max)}
                step="0.1"
                value={Number(value)}
                onChange={(event) => setter(Number(event.target.value))}
              />
            </label>
          ))}

          <div className="mt-6 grid grid-cols-2 gap-2">
            <button className={CONTROL} data-cursor="link" data-cursor-label="lock" type="button" onClick={lock}>
              lock
            </button>
            <button
              className={CONTROL}
              data-cursor="link"
              data-cursor-label="reset"
              type="button"
              onClick={() => {
                setGap(28);
                setBaseline(-34);
                setSize(132);
                setStreak(0);
                setMessage("align the mark");
              }}
            >
              reset
            </button>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
