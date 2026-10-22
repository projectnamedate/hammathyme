"use client";

import { useEffect, useRef, useState } from "react";

const SRC = "/work/interactive-playable/car-wash/car-wash.html";

// The figure is a self-contained Colorfigures page; the frame grows to fit it, measured from
// its last element because the page's body is height:100% of whatever the frame is.
export function CarWashFrame() {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(720);

  useEffect(() => {
    const frame = ref.current;
    if (!frame) return;
    let observer: ResizeObserver | undefined;
    const measure = () => {
      const end = frame.contentDocument?.querySelector(".made-with");
      if (end) setHeight(Math.ceil(end.getBoundingClientRect().bottom + 32));
    };
    const attach = () => {
      measure();
      observer?.disconnect();
      const body = frame.contentDocument?.body;
      if (body) {
        observer = new ResizeObserver(measure);
        observer.observe(body);
      }
    };
    frame.addEventListener("load", attach);
    if (frame.contentDocument?.readyState === "complete") attach();
    return () => {
      frame.removeEventListener("load", attach);
      observer?.disconnect();
    };
  }, []);

  return (
    <iframe
      ref={ref}
      src={SRC}
      title="car wash, a playable figure: pay, pull in, wash, drive off"
      className="block w-full border border-[var(--ink-4)]"
      style={{ height }}
    />
  );
}
