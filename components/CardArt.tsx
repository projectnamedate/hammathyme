/**
 * Per-capability SVG specimens — abstract hand-coded compositions that read as
 * editorial illustrations on the atrium wall while real video / stills are
 * still placeholder. Each specimen reads instantly as the capability it
 * represents at thumbnail scale.
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
  /* 01 — brand systems · the hammer wordmark in oxblood-on-cream */
  "brand-systems": () => (
    <g>
      <rect width="100" height="120" fill="var(--cream-1)" />
      <text
        x="50"
        y="78"
        textAnchor="middle"
        fontFamily="Outfit, sans-serif"
        fontWeight="900"
        fontSize="80"
        letterSpacing="-2"
        fill="var(--ink-0)"
      >
        h
        <tspan className="anim-pulse" fill="var(--cinnamon)">.</tspan>
      </text>
      <line x1="20" y1="98" x2="80" y2="98" stroke="var(--ink-3)" strokeWidth="0.4" />
      <text x="50" y="108" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="3.6" letterSpacing="1" fill="var(--ink-2)">
        BRAND · SYSTEMS · 26
      </text>
    </g>
  ),

  /* 02 — autonomous characters · concentric-eye / orbit */
  "autonomous-characters": () => (
    <g>
      <rect width="100" height="120" fill="var(--cream-2)" />
      <g transform="translate(50 56)">
        <circle r="36" fill="none" stroke="var(--ink-1)" strokeWidth="0.6" />
        <circle className="anim-orbit" r="24" fill="none" stroke="var(--ink-2)" strokeWidth="0.6" strokeDasharray="1 2" />
        <circle r="14" fill="var(--bloodlust)" />
        <circle r="5" cx="-2" cy="-3" fill="var(--cinnamon)" />
      </g>
      <line x1="20" y1="98" x2="80" y2="98" stroke="var(--ink-3)" strokeWidth="0.4" />
      <text x="50" y="108" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="3.6" letterSpacing="1" fill="var(--ink-2)">
        AUTONOMOUS · CHARACTER
      </text>
    </g>
  ),

  /* 03 — motion graphics · frame ladder */
  "motion-graphics": () => (
    <g>
      <rect width="100" height="120" fill="var(--bloodlust)" />
      <g transform="translate(15 22)" stroke="var(--cream-0)" strokeWidth="0.5" fill="none">
        {[0, 12, 24, 36, 48].map((y) => (
          <rect key={y} x="0" y={y} width="70" height="8" />
        ))}
        <rect className="anim-shimmer-x" x="0" y="24" width="70" height="8" fill="var(--cinnamon)" stroke="none" />
      </g>
      <text x="50" y="108" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="3.6" letterSpacing="1" fill="var(--cream-1)">
        MOTION · GRAPHICS · 26
      </text>
    </g>
  ),

  /* 04 — animation · keyframe curve + puppet rig joints */
  animation: () => (
    <g>
      <rect width="100" height="120" fill="var(--cinnamon)" />
      {/* timeline panel */}
      <g transform="translate(14 30)">
        <rect width="72" height="52" fill="var(--ink-0)" />
        {/* baseline grid */}
        <g stroke="var(--ink-2)" strokeWidth="0.3" opacity="0.4">
          <line x1="0" y1="13" x2="72" y2="13" />
          <line x1="0" y1="26" x2="72" y2="26" />
          <line x1="0" y1="39" x2="72" y2="39" />
        </g>
        {/* eased keyframe curve — bezier S-curve across timeline */}
        <path
          d="M 4 44 C 22 44, 22 12, 36 26 S 50 44, 68 8"
          fill="none"
          stroke="var(--cinnamon)"
          strokeWidth="1.1"
        />
        {/* keyframe diamonds along curve */}
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
        {/* active playhead */}
        <g transform="translate(36 26)">
          <circle className="anim-pulse" r="4" fill="none" stroke="var(--cinnamon)" strokeWidth="0.6" />
        </g>
        {/* tiny puppet rig — head, torso, foot dots with bone lines */}
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
      <text x="50" y="108" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="3.6" letterSpacing="1" fill="var(--ink-0)">
        ANIMATION · 26
      </text>
    </g>
  ),

  /* 05 — pipelines & tools · node graph */
  "pipelines-tools": () => (
    <g>
      <rect width="100" height="120" fill="var(--cream-1)" />
      <g transform="translate(0 32)">
        {/* nodes */}
        {[
          { x: 15, y: 10 },
          { x: 50, y: 10 },
          { x: 85, y: 10 },
          { x: 32, y: 36 },
          { x: 68, y: 36 },
          { x: 50, y: 60 },
        ].map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r="3.4" fill="var(--ink-0)" />
            {i === 5 ? <circle className="anim-pulse" cx={n.x} cy={n.y} r="6" fill="none" stroke="var(--cinnamon)" strokeWidth="0.6" /> : null}
          </g>
        ))}
        {/* connections */}
        <g stroke="var(--ink-3)" strokeWidth="0.4" fill="none">
          <line x1="15" y1="10" x2="32" y2="36" />
          <line x1="50" y1="10" x2="32" y2="36" />
          <line x1="50" y1="10" x2="68" y2="36" />
          <line x1="85" y1="10" x2="68" y2="36" />
          <line x1="32" y1="36" x2="50" y2="60" />
          <line x1="68" y1="36" x2="50" y2="60" />
        </g>
      </g>
      <text x="50" y="108" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="3.6" letterSpacing="1" fill="var(--ink-2)">
        PIPELINES · TOOLS · 26
      </text>
    </g>
  ),

  /* 06 — interactive / playable · cursor + button */
  "interactive-playable": () => (
    <g>
      <rect width="100" height="120" fill="var(--cream-2)" />
      <g transform="translate(0 22)">
        {/* button outline */}
        <rect x="14" y="14" width="72" height="32" fill="none" stroke="var(--ink-1)" strokeWidth="0.6" rx="2" />
        <text x="50" y="34" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="5" letterSpacing="1.2" fill="var(--ink-1)">
          RUN
        </text>
        {/* cursor arrow */}
        <g className="anim-twitch" transform="translate(56 38) rotate(-8)" fill="var(--bloodlust)" stroke="var(--cream-0)" strokeWidth="0.4">
          <polygon points="0,0 0,12 3,9 6,12 8,11 5,8 9,8" />
        </g>
        {/* secondary state */}
        <line x1="14" y1="60" x2="86" y2="60" stroke="var(--ink-3)" strokeWidth="0.4" />
        <circle cx="20" cy="60" r="1.6" fill="var(--cinnamon)" />
      </g>
      <text x="50" y="108" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="3.6" letterSpacing="1" fill="var(--ink-2)">
        INTERACTIVE · PLAYABLE
      </text>
    </g>
  ),

  /* 07 — visual media · SMPTE bars + play triangle */
  "visual-media": () => (
    <g>
      <rect width="100" height="120" fill="var(--bloodlust)" />
      <g transform="translate(15 22)">
        {/* SMPTE-style bars in palette */}
        {[
          "var(--cream-0)",
          "var(--cream-2)",
          "var(--cinnamon)",
          "var(--ink-3)",
          "var(--ink-2)",
          "var(--ink-1)",
          "var(--ink-0)",
        ].map((c, i) => (
          <rect key={i} x={i * 10} y="0" width="10" height="48" fill={c} />
        ))}
        {/* lower black */}
        <rect x="0" y="48" width="70" height="14" fill="var(--ink-0)" />
        <rect className="anim-pulse" x="0" y="48" width="14" height="14" fill="var(--cinnamon)" />
      </g>
      <text x="50" y="108" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="3.6" letterSpacing="1" fill="var(--cream-1)">
        VISUAL · MEDIA · 26
      </text>
    </g>
  ),

  /* 08 — editorial / writing · prose columns + pull quote */
  "editorial-writing": () => (
    <g>
      <rect width="100" height="120" fill="var(--cream-1)" />
      <g transform="translate(15 24)">
        {/* two columns of fake type */}
        {[0, 1].map((c) => (
          <g key={c} transform={`translate(${c * 38} 0)`}>
            {Array.from({ length: 14 }).map((_, i) => (
              <rect
                key={i}
                x="0"
                y={i * 4.5}
                width={i === 5 ? 22 : 32 - (i % 3) * 2}
                height="1.2"
                fill="var(--ink-2)"
                opacity={i === 5 ? 1 : 0.6}
              />
            ))}
          </g>
        ))}
        {/* italic pull-quote stroke */}
        <line className="anim-stroke-pulse" x1="-2" y1="22" x2="-2" y2="40" stroke="var(--cinnamon)" strokeWidth="1.2" />
      </g>
      <text x="50" y="108" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="3.6" letterSpacing="1" fill="var(--ink-2)">
        EDITORIAL · WRITING · 26
      </text>
    </g>
  ),

  /* fallback — flat tint, useful while authoring new capabilities */
  default: () => (
    <g>
      <rect width="100" height="120" fill="var(--cream-2)" />
    </g>
  ),
};
