"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type State = "poster" | "loading" | "live" | "unsupported";

const POSTER = "/work/interactive-playable/sushi-scramble/poster-v01.webp";

// three, the post stack, the models and the audio (~7 MB) load only after the visitor presses play.
export function SushiScrambleGame({ autoStart = false, debug = false }: { autoStart?: boolean; debug?: boolean }) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<State>(autoStart ? "loading" : "poster");
  const [progress, setProgress] = useState(0);
  const requested = state !== "poster";

  useEffect(() => {
    if (!requested) return;
    const mount = mountRef.current;
    if (!mount) return;
    if (!document.createElement("canvas").getContext("webgl2")) {
      setState("unsupported");
      return;
    }
    let disposed = false;
    let cleanup = () => {};
    (async () => {
      const { createSushiScramble } = await import("@/lib/games/sushi-scramble/engine");
      if (disposed) return;
      const game = await createSushiScramble(mount, { debug, onProgress: setProgress });
      if (disposed) {
        game.dispose();
        return;
      }
      cleanup = game.dispose;
      setState("live");
    })().catch((error) => {
      console.error("sushi scramble failed", error);
      if (!disposed) setState("unsupported");
    });
    return () => {
      disposed = true;
      cleanup();
    };
  }, [requested, debug]);

  const fullscreen = () => {
    const el = frameRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen?.();
  };

  return (
    <div ref={frameRef} className="relative aspect-[16/9] w-full overflow-hidden bg-[#120d10] [&:fullscreen]:aspect-auto">
      <div ref={mountRef} className="absolute inset-0" />
      {state !== "live" ? (
        <Image src={POSTER} alt="An armoured salmon nigiri on a sushi conveyor belt as a chopstick drone dives in" fill sizes="(min-width: 768px) 75vw, 100vw" className="object-cover" priority />
      ) : null}
      {state === "poster" || state === "loading" ? (
        <button
          type="button"
          onClick={() => setState("loading")}
          disabled={state === "loading"}
          data-cursor="link"
          className="absolute bottom-4 left-4 border border-[var(--cream-0)] bg-[rgba(31,7,7,0.55)] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--cream-0)] transition-colors hover:border-[var(--cinnamon)] hover:text-[var(--cinnamon)] disabled:opacity-70"
        >
          {state === "loading" ? `loading ${Math.round(progress * 100)}%` : "play"}
        </button>
      ) : null}
      {state === "live" ? (
        <button
          type="button"
          onClick={fullscreen}
          data-cursor="link"
          className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 border border-[rgba(246,239,227,0.5)] px-3 py-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--cream-0)] hover:border-[var(--cinnamon)] hover:text-[var(--cinnamon)]"
        >
          fullscreen
        </button>
      ) : null}
      {state === "unsupported" ? (
        <p className="absolute inset-x-0 bottom-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--cream-0)]">
          this game needs webgl2
        </p>
      ) : null}
    </div>
  );
}
