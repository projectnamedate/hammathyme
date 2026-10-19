"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type Size = "toy" | "life";

const DIR = "/work/vfx-cgi/humpback-ar";
const POSTER = `${DIR}/humpback-loop-poster-v01.jpg`;
const MODELS: Record<Size, { usdz: string; glb: string; banner: string; other: Size }> = {
  toy: { usdz: `${DIR}/humpback-toy-v03.usdz`, glb: `${DIR}/humpback-toy-v03.glb`, banner: "See it life-size", other: "life" },
  life: { usdz: `${DIR}/humpback-life-v03.usdz`, glb: `${DIR}/humpback-life-v03.glb`, banner: "Back to tabletop", other: "toy" },
};

// Every iOS browser is WebKit and opens rel="ar" links in Quick Look, but only Safari reports
// relList.supports("ar"), so detect the platform instead (iPadOS reports itself as a Mac).
function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function sceneViewerIntent(size: Size) {
  const file = new URL(MODELS[size].glb, location.href).toString();
  const params = new URLSearchParams({ mode: "ar_preferred", disable_occlusion: "true", resizable: "false", title: "humpback" });
  return (
    `intent://arvr.google.com/scene-viewer/1.2?${params}&file=${encodeURIComponent(file)}` +
    `#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;` +
    `S.browser_fallback_url=${encodeURIComponent(location.href)};end;`
  );
}

export function WhaleAR({ qrSrc }: { qrSrc: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const toyRef = useRef<HTMLAnchorElement | null>(null);
  const lifeRef = useRef<HTMLAnchorElement | null>(null);

  const open = (size: Size) => {
    if (isIOS()) {
      (size === "toy" ? toyRef : lifeRef).current?.click();
      return;
    }
    if (/Android/.test(navigator.userAgent)) location.href = sceneViewerIntent(size);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      video.controls = true;
    }
    // The Quick Look banner button swaps between the two sizes.
    const pairs: [HTMLAnchorElement | null, Size][] = [
      [toyRef.current, "toy"],
      [lifeRef.current, "life"],
    ];
    const handlers = pairs.map(([link, size]) => {
      const onMessage = (event: Event) => {
        if ((event as MessageEvent).data === "_apple_ar_quicklook_button_tapped") {
          (MODELS[size].other === "toy" ? toyRef : lifeRef).current?.click();
        }
      };
      link?.addEventListener("message", onMessage);
      return () => link?.removeEventListener("message", onMessage);
    });
    return () => handlers.forEach((off) => off());
  }, []);

  return (
    <div>
      <video
        ref={videoRef}
        aria-label="A humpback whale swimming a slow circle through open water"
        className="block aspect-video w-full bg-[#0B3A4E]"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={POSTER}
      >
        <source src={`${DIR}/humpback-loop-v01.mp4`} type="video/mp4" />
      </video>

      <div className="mt-3 grid grid-cols-2 gap-2 pointer-fine:hidden">
        <button
          type="button"
          onClick={() => open("toy")}
          className="border border-[var(--ink-0)] bg-[var(--ink-0)] whitespace-nowrap px-3 py-4 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--cream-0)]"
        >
          on your table
        </button>
        <button
          type="button"
          onClick={() => open("life")}
          className="border border-[var(--ink-0)] bg-[var(--cinnamon)] whitespace-nowrap px-3 py-4 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-0)]"
        >
          life-size · 15 m
        </button>
        <p className="col-span-2 mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ink-2)]">
          life-size needs open space. turn to follow it.
        </p>
      </div>

      <div className="mt-4 hidden items-center gap-5 pointer-fine:flex">
        <Image src={qrSrc} alt="QR code that opens this page on a phone" width={112} height={112} unoptimized className="size-28 bg-[var(--cream-0)]" />
        <p className="font-mono text-[10px] uppercase leading-[1.7] tracking-[0.16em] text-[var(--ink-1)]">
          scan with your phone
          <br />
          to put it in your room
        </p>
      </div>

      {(["toy", "life"] as const).map((size) => (
        <a
          key={size}
          ref={size === "toy" ? toyRef : lifeRef}
          rel="ar"
          href={`${MODELS[size].usdz}#callToAction=${encodeURIComponent(MODELS[size].banner)}&allowsContentScaling=0`}
          aria-hidden
          tabIndex={-1}
          className="pointer-events-none absolute size-px overflow-hidden opacity-0"
        >
          {/* Quick Look requires an image as the link's first child. */}
          <Image src={POSTER} alt="" width={16} height={9} unoptimized />
        </a>
      ))}
    </div>
  );
}
