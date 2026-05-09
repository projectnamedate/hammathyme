/**
 * Per-capability SVG specimens — abstract hand-coded compositions that read as
 * editorial illustrations on the atrium wall while real video / stills are
 * still placeholder. Each specimen reads instantly as the capability it
 * represents at thumbnail scale.
 *
 * Layout note: viewBox is 0 0 100 120 with preserveAspectRatio="xMidYMid slice"
 * so the SVG fills the slot. On landscape (desktop) tiles this means the top
 * and bottom ~25 SVG units may be cropped — keep all key content inside the
 * vertical safe band y∈[28, 92]. Bottom mono labels were removed because the
 * caption beneath each tile already states the capability.
 */

const COMMON_VIEWBOX = "0 0 100 120";

type Props = {
  capability: string;
  active?: boolean;
};

export function CardArt({ capability, active = false }: Props) {
  const Spec = SPECIMENS[capability] ?? SPECIMENS.default;
  return (
    <svg
      viewBox={COMMON_VIEWBOX}
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      data-active={active ? "1" : "0"}
      aria-hidden
    >
      <Spec active={active} />
    </svg>
  );
}

const SPECIMENS: Record<string, (p: { active: boolean }) => React.ReactElement> = {
  /* 01 — brand systems · the hammer wordmark, vertically centered */
  "brand-systems": () => (
    <g>
      <rect width="100" height="120" fill="var(--cream-1)" />
      <text
        x="50"
        y="78"
        textAnchor="middle"
        fontFamily="Outfit, sans-serif"
        fontWeight="900"
        fontSize="62"
        letterSpacing="-2"
        fill="var(--ink-0)"
      >
        h
        <tspan className="anim-pulse" fill="var(--cinnamon)">.</tspan>
      </text>
    </g>
  ),

  /* 02 — autonomous characters · concentric-eye / orbit, centered */
  "autonomous-characters": () => (
    <g>
      <rect width="100" height="120" fill="var(--cream-2)" />
      <g transform="translate(50 60)">
        <circle r="28" fill="none" stroke="var(--ink-1)" strokeWidth="0.6" />
        <circle className="anim-orbit" r="20" fill="none" stroke="var(--ink-2)" strokeWidth="0.6" strokeDasharray="1 2" />
        <circle r="12" fill="var(--bloodlust)" />
        <circle r="4" cx="-2" cy="-2" fill="var(--cinnamon)" />
      </g>
    </g>
  ),

  /* 03 — motion graphics · frame ladder, centered */
  "motion-graphics": () => (
    <g>
      <rect width="100" height="120" fill="var(--bloodlust)" />
      <g transform="translate(15 36)" stroke="var(--cream-0)" strokeWidth="0.5" fill="none">
        {[0, 12, 24, 36].map((y) => (
          <rect key={y} x="0" y={y} width="70" height="8" />
        ))}
        <rect className="anim-shimmer-x" x="0" y="12" width="70" height="8" fill="var(--cinnamon)" stroke="none" />
      </g>
    </g>
  ),

  /* 04 — animation · keyframe curve + puppet rig joints, centered */
  animation: () => (
    <g>
      <rect width="100" height="120" fill="var(--cinnamon)" />
      <g transform="translate(14 34)">
        <rect width="72" height="52" fill="var(--ink-0)" />
        {/* baseline grid */}
        <g stroke="var(--ink-2)" strokeWidth="0.3" opacity="0.4">
          <line x1="0" y1="13" x2="72" y2="13" />
          <line x1="0" y1="26" x2="72" y2="26" />
          <line x1="0" y1="39" x2="72" y2="39" />
        </g>
        {/* eased keyframe curve */}
        <path
          d="M 4 44 C 22 44, 22 12, 36 26 S 50 44, 68 8"
          fill="none"
          stroke="var(--cinnamon)"
          strokeWidth="1.1"
        />
        {[
          { x: 4, y: 44 },
          { x: 22, y: 18 },
          { x: 36, y: 26 },
          { x: 50, y: 38 },
          { x: 68, y: 8 },
        ].map((k, i) => (
          <g key={i} transform={`translate(${k.x} ${k.y}) rotate(45)`}>
            <rect x="-2" y="-2" width="4" height="4" fill="var(--cream-0)" />
          </g>
        ))}
        <g transform="translate(36 26)">
          <circle className="anim-pulse" r="4" fill="none" stroke="var(--cinnamon)" strokeWidth="0.6" />
        </g>
        <g transform="translate(58 38)" stroke="var(--cream-2)" strokeWidth="0.5" fill="var(--cream-0)">
          <line x1="0" y1="-6" x2="0" y2="2" />
          <line x1="-3" y1="-3" x2="3" y2="-3" />
          <line x1="0" y1="2" x2="-2" y2="8" />
          <line x1="0" y1="2" x2="2" y2="8" />
          <circle cx="0" cy="-7" r="1.4" />
          <circle cx="-3" cy="-3" r="0.8" />
          <circle cx="3" cy="-3" r="0.8" />
          <circle cx="0" cy="2" r="0.8" />
          <circle cx="-2" cy="8" r="0.8" />
          <circle cx="2" cy="8" r="0.8" />
        </g>
      </g>
    </g>
  ),

  /* 05 — pipelines & tools · node graph, centered */
  "pipelines-tools": () => (
    <g>
      <rect width="100" height="120" fill="var(--cream-1)" />
      <g transform="translate(0 36)">
        {[
          { x: 15, y: 6 },
          { x: 50, y: 6 },
          { x: 85, y: 6 },
          { x: 32, y: 30 },
          { x: 68, y: 30 },
          { x: 50, y: 52 },
        ].map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r="3.4" fill="var(--ink-0)" />
            {i === 5 ? <circle className="anim-pulse" cx={n.x} cy={n.y} r="6" fill="none" stroke="var(--cinnamon)" strokeWidth="0.6" /> : null}
          </g>
        ))}
        <g stroke="var(--ink-3)" strokeWidth="0.4" fill="none">
          <line x1="15" y1="6" x2="32" y2="30" />
          <line x1="50" y1="6" x2="32" y2="30" />
          <line x1="50" y1="6" x2="68" y2="30" />
          <line x1="85" y1="6" x2="68" y2="30" />
          <line x1="32" y1="30" x2="50" y2="52" />
          <line x1="68" y1="30" x2="50" y2="52" />
        </g>
      </g>
    </g>
  ),

  /* 06 — interactive / playable · cursor + button, centered */
  "interactive-playable": () => (
    <g>
      <rect width="100" height="120" fill="var(--cream-2)" />
      <g transform="translate(0 32)">
        <rect x="14" y="14" width="72" height="32" fill="none" stroke="var(--ink-1)" strokeWidth="0.6" rx="2" />
        <text x="50" y="34" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="5" letterSpacing="1.2" fill="var(--ink-1)">
          RUN
        </text>
        <g className="anim-twitch" transform="translate(56 38) rotate(-8)" fill="var(--bloodlust)" stroke="var(--cream-0)" strokeWidth="0.4">
          <polygon points="0,0 0,12 3,9 6,12 8,11 5,8 9,8" />
        </g>
        <line x1="14" y1="56" x2="86" y2="56" stroke="var(--ink-3)" strokeWidth="0.4" />
        <circle cx="20" cy="56" r="1.6" fill="var(--cinnamon)" />
      </g>
    </g>
  ),

  /* 07 — visual media · SMPTE bars + timecode, centered */
  "visual-media": () => (
    <g>
      <rect width="100" height="120" fill="var(--bloodlust)" />
      <g transform="translate(15 32)">
        {[
          "var(--cream-0)",
          "var(--cream-2)",
          "var(--cinnamon)",
          "var(--ink-3)",
          "var(--ink-2)",
          "var(--ink-1)",
          "var(--ink-0)",
        ].map((c, i) => (
          <rect key={i} x={i * 10} y="0" width="10" height="42" fill={c} />
        ))}
        <rect x="0" y="42" width="70" height="12" fill="var(--ink-0)" />
        <rect className="anim-pulse" x="0" y="42" width="14" height="12" fill="var(--cinnamon)" />
      </g>
    </g>
  ),

  /* 08 — websites · browser frame with content blocks, centered */
  websites: () => (
    <g>
      <rect width="100" height="120" fill="var(--cream-1)" />
      <g transform="translate(14 34)">
        {/* browser frame */}
        <rect width="72" height="52" fill="var(--cream-0)" stroke="var(--ink-3)" strokeWidth="0.6" />
        {/* chrome bar */}
        <rect x="0" y="0" width="72" height="7" fill="var(--ink-4)" />
        {/* traffic lights */}
        <circle cx="3.5" cy="3.5" r="0.9" fill="var(--bloodlust)" />
        <circle cx="6.5" cy="3.5" r="0.9" fill="var(--ink-3)" />
        <circle cx="9.5" cy="3.5" r="0.9" fill="var(--ink-3)" />
        {/* hero block */}
        <rect x="6" y="13" width="32" height="14" fill="var(--ink-0)" />
        {/* hero accent — animated cinnamon */}
        <rect className="anim-pulse" x="42" y="13" width="6" height="6" fill="var(--cinnamon)" />
        {/* content rows */}
        <rect x="6" y="32" width="44" height="2" fill="var(--ink-3)" />
        <rect x="6" y="36" width="36" height="2" fill="var(--ink-3)" />
        <rect x="6" y="40" width="40" height="2" fill="var(--ink-3)" />
        {/* sidebar block */}
        <rect x="54" y="32" width="12" height="14" fill="var(--ink-4)" />
      </g>
    </g>
  ),

  /* fallback — flat tint */
  default: () => (
    <g>
      <rect width="100" height="120" fill="var(--cream-2)" />
    </g>
  ),
};
