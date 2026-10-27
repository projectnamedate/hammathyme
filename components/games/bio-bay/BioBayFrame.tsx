"use client";

import { useState } from "react";

const BASE = "/work/interactive-playable/bio-bay";

// The bay is an 18 MB Unity web build, so the page shows a walk through it and loads the build only on a click.
export function BioBayFrame() {
  const [playing, setPlaying] = useState(false);
  return (
    <div>
      {playing ? (
        <iframe
          src={`${BASE}/index.html`}
          title="bioluminescent bay, a night beach to walk"
          allow="fullscreen; autoplay; accelerometer; gyroscope; web-share"
          allowFullScreen
          className="block aspect-[16/10] w-full border border-[var(--ink-4)] bg-black"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          data-cursor="link"
          data-cursor-label="walk"
          className="group relative block aspect-[16/10] w-full overflow-hidden border border-[var(--ink-4)] bg-black text-left"
        >
          <video
            src={`${BASE}/walk.mp4`}
            poster={`${BASE}/poster.jpg`}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span className="absolute bottom-4 left-4 bg-black/55 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white transition-colors group-hover:bg-[var(--cinnamon)]">
            walk the bay · 18 mb
          </span>
        </button>
      )}
      <a
        href={`${BASE}/index.html`}
        target="_blank"
        rel="noreferrer"
        data-cursor="link"
        data-cursor-label="open"
        className="mt-3 inline-block font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)] underline decoration-[var(--ink-3)] underline-offset-4 hover:text-[var(--cinnamon)]"
      >
        open full window
      </a>
    </div>
  );
}
