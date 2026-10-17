"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { track } from "@vercel/analytics";
import { FormEvent, useState } from "react";
import {
  SAMPLE_STORYBOARD,
  STORYBOARD_PRESETS,
  type StoryboardPreset,
  type StoryboardPanel,
} from "@/lib/demo-samples";

type ApiState = {
  loading: boolean;
  status: string;
  sample: boolean;
};

const CONTROL =
  "border border-[var(--ink-4)] bg-[var(--cream-0)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-1)] transition-[border-color,background-color,color,opacity,transform] duration-300 hover:border-[var(--cinnamon)] hover:text-[var(--cinnamon)] focus-visible:border-[var(--cinnamon)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-45";

const INPUT =
  "w-full border border-[var(--ink-4)] bg-[var(--cream-0)] p-4 font-display text-[18px] font-light leading-[1.35] tracking-[-0.01em] text-[var(--ink-0)] outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-[var(--ink-3)] focus:border-[var(--cinnamon)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]";

const CINEMA = [0.65, 0, 0.35, 1] as const;
const SOFT = [0.25, 0.1, 0.25, 1] as const;

const STORYBOARD_QUICK_PRESETS = STORYBOARD_PRESETS.slice(0, 3);
const SAMPLE_BOARD_IMAGE = "/work/interactive-playable/storyboard/sample-board-v01.jpg";

function sampleBoardFor(preset: StoryboardPreset) {
  return preset.id === STORYBOARD_PRESETS[0].id ? SAMPLE_BOARD_IMAGE : null;
}

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
  const [storyboardImage, setStoryboardImage] = useState<string | null>(SAMPLE_BOARD_IMAGE);
  const [liveUsed, setLiveUsed] = useState(false);
  const [state, setState] = useState<ApiState>({ loading: false, status: "sample board loaded", sample: true });

  function loadStoryboardPreset(nextPreset: StoryboardPreset) {
    setPreset(nextPreset);
    setPrompt(nextPreset.prompt);
    setStoryboardImage(sampleBoardFor(nextPreset));
    setState({ loading: false, status: `${nextPreset.genre} brief loaded`, sample: true });
  }

  function loadRandomStoryboardPreset() {
    loadStoryboardPreset(randomDifferent(STORYBOARD_PRESETS, preset, (item) => item.id));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.loading || liveUsed) return;
    track("demo_run", { demo: "storyboard" });
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
      setStoryboardImage(data.imageUrl ?? sampleBoardFor(preset));
      if (!data.sample) setLiveUsed(true);
      setState({ loading: false, status: data.status ?? "live", sample: Boolean(data.sample) });
    } catch (error) {
      setPanels(SAMPLE_STORYBOARD);
      setStoryboardImage(sampleBoardFor(preset));
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
                  alt="Six-panel colour-pencil storyboard sheet"
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
            {storyboardImage ? (
              <figcaption className="mt-3 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ink-2)]">
                colour-pencil board · gpt image 2.5 sunburst
              </figcaption>
            ) : null}
          </motion.figure>
        </div>
      </div>
    </section>
  );
}
