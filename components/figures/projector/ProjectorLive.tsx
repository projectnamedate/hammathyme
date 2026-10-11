"use client";

import { useEffect, useRef } from "react";

export function ProjectorLive() {
  const anchor = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = anchor.current?.closest<HTMLElement>(".pj-host");
    const root = host?.querySelector<HTMLElement>(".pj");
    const stage = root?.querySelector<HTMLElement>(".pj-stage");
    if (!host || !root || !stage) return;
    const dark = matchMedia("(prefers-color-scheme: dark)");
    let unmount = () => {};
    let unlisten = () => {};
    let cancelled = false;

    const load = async () => {
      const [{ PROJECTOR_STAGE }, live] = await Promise.all([import("./projector.stage"), import("./projector.live")]);
      if (cancelled) return;
      if (!stage.firstChild) stage.innerHTML = PROJECTOR_STAGE;
      // The figure keeps the kit's own light and dark themes and follows the viewer's setting.
      const start = () => {
        unmount();
        host.dataset.theme = dark.matches ? "dark" : "light";
        unmount = live.mountProjector(root, live.PROJECTOR_DATA);
      };
      start();
      dark.addEventListener("change", start);
      unlisten = () => dark.removeEventListener("change", start);
    };

    // Load the drawing once the page has settled and the figure is close, so its 680 KB
    // chunk never competes with the page's first paint.
    let idle = 0;
    const whenIdle = (fn: () => void) => {
      const go = () => {
        idle = typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(fn, { timeout: 1200 }) : window.setTimeout(fn, 200);
      };
      // After the page's own intro animations, which finish about a second after load.
      const later = () => window.setTimeout(go, 1400);
      if (document.readyState === "complete") later();
      else window.addEventListener("load", later, { once: true });
    };
    const near = new IntersectionObserver(
      (entries) => {
        if (!entries[entries.length - 1].isIntersecting) return;
        near.disconnect();
        whenIdle(() => void load());
      },
      { rootMargin: "300px 0px" },
    );
    near.observe(stage);

    return () => {
      cancelled = true;
      near.disconnect();
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      unlisten();
      unmount();
    };
  }, []);

  return <span ref={anchor} hidden />;
}
