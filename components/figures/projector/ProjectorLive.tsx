"use client";

import { useEffect, useRef } from "react";

type Unmount = (() => void) & { snapshot?: () => Record<string, unknown> };
type Mount = (root: HTMLElement, data: Record<string, unknown>) => Unmount;

export function ProjectorLive() {
  const anchor = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = anchor.current?.closest<HTMLElement>(".pj-host");
    const root = host?.querySelector<HTMLElement>(".pj");
    const stage = root?.querySelector<HTMLElement>(".pj-stage");
    if (!host || !root || !stage) return;
    // The figure keeps the kit's own light and dark themes and follows the viewer's setting,
    // set before anything draws so a dark-mode visitor never sees the light card first.
    const dark = matchMedia("(prefers-color-scheme: dark)");
    const theme = () => {
      host.dataset.theme = dark.matches ? "dark" : "light";
    };
    theme();
    let unmount: Unmount = () => {};
    let cancelled = false;
    let timer = 0;
    let idle = 0;
    let fallback = 0;
    let markup = "";
    let mount: Mount | null = null;
    let data: Record<string, unknown> = {};

    // Every mount starts from fresh drawing markup, so a theme change mid-use never inherits
    // parts left apart or turned by the run before; what the reader chose carries over.
    const start = () => {
      if (!mount) return;
      const resume = unmount.snapshot?.();
      unmount();
      theme();
      stage.innerHTML = markup;
      unmount = mount(root, resume ? { ...data, resume } : data);
    };
    const load = async () => {
      const [{ PROJECTOR_STAGE }, live] = await Promise.all([import("./projector.stage"), import("./projector.live")]);
      if (cancelled) return;
      markup = PROJECTOR_STAGE;
      mount = live.mountProjector;
      data = live.PROJECTOR_DATA;
      start();
    };
    const onTheme = () => (mount ? start() : theme());
    dark.addEventListener("change", onTheme);

    // Load the drawing once the page has settled and the figure is close, so its chunk of
    // several hundred KB never competes with the page's first paint; the page's intro
    // animations finish about a second after load.
    const go = () => {
      if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(() => void load(), { timeout: 1200 });
      else fallback = window.setTimeout(() => void load(), 200);
    };
    const later = () => {
      timer = window.setTimeout(go, 1400);
    };
    const near = new IntersectionObserver(
      (entries) => {
        if (!entries[entries.length - 1].isIntersecting) return;
        near.disconnect();
        if (document.readyState === "complete") later();
        else window.addEventListener("load", later, { once: true });
      },
      { rootMargin: "300px 0px" },
    );
    near.observe(stage);

    return () => {
      cancelled = true;
      near.disconnect();
      window.removeEventListener("load", later);
      window.clearTimeout(timer);
      if (idle && typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idle);
      window.clearTimeout(fallback);
      dark.removeEventListener("change", onTheme);
      unmount();
    };
  }, []);

  return <span ref={anchor} hidden />;
}
