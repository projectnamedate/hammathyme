"use client";

export function FilmGrain() {
  // Static SVG noise tinted to rose, tiled, with a subtle CSS animation that
  // translates the pattern. Reduced-motion = pure static texture.
  return (
    <div
      aria-hidden
      className="grain pointer-events-none fixed inset-0 z-[10]"
      style={{
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.12  0 0 0 0 0.04  0 0 0 0 0.04  0 0 0 0.045 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
        opacity: 0.6,
        mixBlendMode: "multiply",
      }}
    />
  );
}
