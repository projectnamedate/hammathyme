/**
 * tiny lobster glyph — a wink to peter steinberger's openclaw (347k ★).
 * uses currentColor so the parent decides ink/cinnamon/whatever.
 */
export function Lobster({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {/* claws */}
      <path d="M 7 11 Q 3 8, 5 13 Q 6 14, 9 13 Z" fill="currentColor" />
      <path d="M 25 11 Q 29 8, 27 13 Q 26 14, 23 13 Z" fill="currentColor" />
      {/* antennae */}
      <path d="M 14 9 L 12 4" />
      <path d="M 18 9 L 20 4" />
      {/* body */}
      <ellipse cx="16" cy="16" rx="5" ry="6" fill="currentColor" />
      {/* legs */}
      <path d="M 11 14 L 8 17" />
      <path d="M 11 17 L 8 19" />
      <path d="M 21 14 L 24 17" />
      <path d="M 21 17 L 24 19" />
      {/* tail segments */}
      <path d="M 12 22 L 13 26" />
      <path d="M 16 22 L 16 28" />
      <path d="M 20 22 L 19 26" />
    </svg>
  );
}
