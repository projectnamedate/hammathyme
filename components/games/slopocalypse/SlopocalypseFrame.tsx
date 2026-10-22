const SRC = "/work/interactive-playable/slopocalypse/index.html";

// The game is its own Vite build in public/; pointer lock and keys work inside a same-origin iframe.
export function SlopocalypseFrame() {
  return (
    <div>
      <iframe
        src={SRC}
        title="slopocalypse, a playable shooter: click to start"
        allow="fullscreen; autoplay"
        allowFullScreen
        className="block aspect-[4/3] w-full border border-[var(--ink-4)] bg-black md:aspect-[16/10]"
      />
      <a
        href={SRC}
        target="_blank"
        rel="noreferrer"
        data-cursor="link"
        data-cursor-label="open"
        className="mt-3 inline-block font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)] underline decoration-[var(--ink-3)] underline-offset-4 hover:text-[var(--cinnamon)]"
      >
        play full window
      </a>
    </div>
  );
}
