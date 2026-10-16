"use client";

import { useEffect, useRef } from "react";
import { VIEW_LOADERS } from "./projector.views";

type Unmount = (() => void) & { snapshot?: () => Record<string, unknown> };
type Mount = (root: HTMLElement, data: Record<string, unknown>) => Unmount;

// Each palette rides one of the kit's two themes, which the shading and the beam key on.
const PALETTES: Record<string, [string, string]> = { light: ["light", ""], dark: ["dark", ""], paper: ["light", "paper"], blueprint: ["dark", "blueprint"] };
const KEY = "pj-palette";

export function ProjectorLive() {
  const anchor = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = anchor.current?.closest<HTMLElement>(".pj-host");
    const root = host?.querySelector<HTMLElement>(".pj");
    const stage = root?.querySelector<HTMLElement>(".pj-stage");
    if (!host || !root || !stage) return;
    // The figure follows the viewer's setting unless they picked a palette on its chips, and is
    // set before anything draws so a dark-mode visitor never sees the light card first.
    const dark = matchMedia("(prefers-color-scheme: dark)");
    let choice = "auto";
    try {
      choice = localStorage.getItem(KEY) || "auto";
    } catch {}
    // A shared link (the figure's share chip) carries its settings in the query.
    const params = new URLSearchParams(location.search);
    const linkedTheme = params.get("theme");
    if (linkedTheme && (linkedTheme === "auto" || linkedTheme in PALETTES)) choice = linkedTheme;
    if (params.get("finish") === "metal") host.dataset.finish = "metal";
    const linkedView = params.get("view");
    const number = (key: string) => (params.has(key) ? Number(params.get(key)) : undefined);
    const link = { fps: number("fps"), blades: number("blades"), slow: params.get("slow") === "1", trace: params.get("trace") === "1" };
    const linked = ["fps", "blades", "slow", "trace"].some((key) => params.has(key));
    const theme = () => {
      const [mode, palette] = PALETTES[choice] ?? [dark.matches ? "dark" : "light", ""];
      host.dataset.theme = mode;
      if (palette) host.dataset.palette = palette;
      else delete host.dataset.palette;
      host.dataset.choice = choice;
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
    let mid = { markup: "", data: {} as Record<string, unknown> };
    host.dataset.views = "";
    host.dataset.view = "mid";

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
      mid = { markup, data };
      if (linkedView && VIEW_LOADERS[linkedView]) {
        const chosen = await VIEW_LOADERS[linkedView]();
        if (cancelled) return;
        markup = chosen.STAGE;
        data = chosen.DATA;
        host.dataset.view = linkedView;
      }
      if (linked) data = { ...data, link };
      start();
    };
    const restyle = () => (mount ? start() : theme());
    const onTheme = () => {
      if (choice === "auto") restyle();
    };
    dark.addEventListener("change", onTheme);
    const onPick = (event: Event) => {
      choice = (event as CustomEvent<string>).detail;
      try {
        localStorage.setItem(KEY, choice);
      } catch {}
      restyle();
    };
    host.addEventListener("pj-palette", onPick);
    // Another camera height is another drawing, loaded the first time it is picked.
    const onView = async (event: Event) => {
      const view = (event as CustomEvent<string>).detail;
      if (!mount || view === host.dataset.view) return;
      if (view === "mid") ({ markup, data } = mid);
      else {
        const load = VIEW_LOADERS[view];
        if (!load) return;
        const chosen = await load();
        if (cancelled) return;
        markup = chosen.STAGE;
        data = chosen.DATA;
      }
      host.dataset.view = view;
      start();
    };
    host.addEventListener("pj-view", onView);

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
      host.removeEventListener("pj-palette", onPick);
      host.removeEventListener("pj-view", onView);
      unmount();
    };
  }, []);

  return <span ref={anchor} hidden />;
}
