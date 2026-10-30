import type { ReactElement, ReactNode } from "react";

type Props = {
  category: string;
  piece: string;
};

const VIEWBOX = "0 0 120 160";

export function PieceArt({ category, piece }: Props) {
  const key = `${category}/${piece}`;
  const Specimen = SPECIMENS[key] ?? CATEGORY_FALLBACKS[category] ?? DefaultSpecimen;

  return (
    <svg
      viewBox={VIEWBOX}
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden
    >
      <Specimen />
    </svg>
  );
}

const SPECIMENS: Record<string, () => ReactElement> = {
  "brand-systems/hammer": HammerGuide,
  "brand-systems/kira": KiraGuide,
  "brand-systems/agentify": AgentifyGuide,
  "motion-graphics/chrome-hammer": ChromeHammer,
  "motion-graphics/reel": MotionReel,
  "motion-graphics/internet-capital-markets": InternetCapitalMarkets,
  "motion-graphics/spring-health": SpringHealthMotion,
  "motion-graphics/spotify-titles": SpotifyTitles,
  "vfx-cgi/environment-swap": EnvironmentSwap,
  "vfx-cgi/neural-set-capture": NeuralSetCapture,
  "vfx-cgi/humpback-ar": HumpbackAr,
  "pipelines-tools/pipeline-visualizer": PipelineVisualizerCard,
  "pipelines-tools/creative-skills": CreativeSkills,
  "pipelines-tools/qc-by-measurement": QcByMeasurement,
  "interactive-playable/sushi-scramble": SushiScramble,
  "interactive-playable/35mm-projector": ProjectorAnatomy,
  "interactive-playable/slopocalypse": Slopocalypse,
  "interactive-playable/car-wash": CarWash,
  "vfx-cgi/bioluminescent-bay": BioBay,
  "vfx-cgi/portal-worlds": PortalWorlds,
  "interactive-playable/prompt-to-storyboard": PromptStoryboard,
  "film-animation/equinox": EquinoxCampaign,
  "film-animation/the-gunfight": TheGunfight,
  "film-animation/code-animation": CodeAnimation,
  "websites/hammer": HammerSite,
  "websites/kira": KiraSite,
  "websites/agentify": AgentifySite,
  "websites/coefficient": CoefficientSite,
};

const CATEGORY_FALLBACKS: Record<string, () => ReactElement> = {
  "brand-systems": HammerGuide,
  "motion-graphics": MotionReel,
  "vfx-cgi": NeuralSetCapture,
  "pipelines-tools": PipelineVisualizerCard,
  "interactive-playable": PromptStoryboard,
  "film-animation": EquinoxCampaign,
  websites: HammerSite,
};

function Plate({
  bg = "var(--cream-1)",
  frame = "var(--ink-4)",
  children,
}: {
  bg?: string;
  frame?: string;
  children: ReactNode;
}) {
  return (
    <g>
      <rect width="120" height="160" fill={bg} />
      <rect x="12" y="14" width="96" height="132" fill="none" stroke={frame} strokeWidth="0.7" />
      {children}
    </g>
  );
}

function MonoLabel({ children, y = 139, fill = "var(--ink-2)" }: { children: string; y?: number; fill?: string }) {
  return (
    <text
      x="60"
      y={y}
      textAnchor="middle"
      fontFamily="var(--font-mono)"
      fontSize="4.8"
      letterSpacing="1.2"
      fill={fill}
    >
      {children}
    </text>
  );
}

type BrowserColors = { screen: string; bar: string; accent: string; dot: string };

function Browser({
  dark = false,
  colors,
  children,
}: {
  dark?: boolean;
  colors?: BrowserColors;
  children: ReactNode;
}) {
  const c = colors ?? {
    screen: dark ? "var(--ink-deepest)" : "var(--cream-0)",
    bar: dark ? "var(--ink-0)" : "var(--ink-4)",
    accent: dark ? "var(--cinnamon)" : "var(--ink-3)",
    dot: dark ? "var(--ink-3)" : "var(--ink-2)",
  };
  return (
    <g transform="translate(20 44)">
      <rect width="80" height="62" fill={c.screen} stroke={c.accent} strokeWidth="0.8" />
      <rect width="80" height="8" fill={c.bar} />
      <circle cx="5" cy="4" r="1.2" fill={colors ? c.accent : "var(--cinnamon)"} />
      <circle cx="9" cy="4" r="1.2" fill={c.dot} />
      <circle cx="13" cy="4" r="1.2" fill={c.dot} />
      {children}
    </g>
  );
}

function FilmFrame({
  children,
  bg = "var(--ink-deepest)",
  edge = "var(--ink-3)",
  holes = "var(--cream-1)",
}: {
  children: ReactNode;
  bg?: string;
  edge?: string;
  holes?: string;
}) {
  return (
    <g transform="translate(18 32)">
      <rect width="84" height="74" fill={bg} stroke={edge} strokeWidth="0.8" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <rect x="4" y={6 + i * 11} width="5" height="5" fill={holes} opacity="0.75" />
          <rect x="75" y={6 + i * 11} width="5" height="5" fill={holes} opacity="0.75" />
        </g>
      ))}
      {children}
    </g>
  );
}

function HammerGuide() {
  return (
    <Plate>
      <text x="28" y="82" fontFamily="var(--font-display)" fontWeight="300" fontSize="34" fill="var(--ink-0)">
        h
      </text>
      <circle cx="50" cy="78.8" r="3.2" fill="var(--cinnamon)" />
      <g stroke="var(--ink-3)" strokeWidth="0.7">
        <line x1="66" y1="53" x2="94" y2="53" />
        <line x1="66" y1="63" x2="88" y2="63" />
        <line x1="66" y1="73" x2="98" y2="73" />
        <line x1="26" y1="103" x2="94" y2="103" />
        <line x1="26" y1="114" x2="76" y2="114" />
      </g>
      <rect x="26" y="118" width="12" height="12" fill="var(--cream-0)" stroke="var(--ink-4)" />
      <rect x="42" y="118" width="12" height="12" fill="var(--ink-0)" />
      <rect x="58" y="118" width="12" height="12" fill="var(--cinnamon)" />
      <MonoLabel>BRAND SYSTEM</MonoLabel>
    </Plate>
  );
}

function KiraGuide() {
  return (
    <Plate bg="#F7F3EC" frame="#D9D2C6">
      <g transform="translate(60 72)">
        <text
          x="0"
          y="0"
          textAnchor="middle"
          fontFamily="var(--font-instrument-serif), Georgia, serif"
          fontStyle="italic"
          fontWeight="800"
          fontSize="38"
          letterSpacing="-1.6"
          fill="#0F0F0F"
        >
          kira
        </text>
        <line x1="-29" y1="9" x2="29" y2="9" stroke="#B4673A" strokeWidth="1.4" />
      </g>
      <g stroke="#52504C" strokeWidth="0.65">
        <line x1="26" y1="108" x2="94" y2="108" />
        <line x1="26" y1="118" x2="84" y2="118" />
        <line x1="26" y1="128" x2="91" y2="128" />
      </g>
      <circle cx="33" cy="81" r="1.6" fill="#FF6D1F" />
      <MonoLabel fill="#52504C">CHARACTER BIBLE</MonoLabel>
    </Plate>
  );
}

function AgentifyLedgerGate({ x = 30, y = 34, scale = 0.55 }: { x?: number; y?: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} strokeLinecap="round" fill="none">
      <path d="M22 22 H74" stroke="#E8DFD0" strokeWidth="6" />
      <path d="M22 22 V78" stroke="#E8DFD0" strokeWidth="6" />
      <path d="M74 22 V78" stroke="#E8DFD0" strokeWidth="6" />
      <path d="M4 50 H92" stroke="#8B6CFF" strokeWidth="4" />
      <circle cx="48" cy="50" r="4.6" fill="#4EC6DA" stroke="none" />
      <path d="M30 78 H66" stroke="#4EC6DA" strokeWidth="3" opacity="0.55" />
    </g>
  );
}

function AgentifyGuide() {
  return (
    <Plate bg="#0C0D16" frame="rgba(232,223,208,0.22)">
      <rect x="18" y="24" width="84" height="88" fill="#14132A" stroke="rgba(232,223,208,0.22)" />
      <AgentifyLedgerGate x={35} y={28} scale={0.52} />
      <text
        x="60"
        y="101"
        textAnchor="middle"
        fontFamily="var(--font-serif), Georgia, serif"
        fontStyle="italic"
        fontSize="21"
        letterSpacing="-0.9"
        fill="#E8DFD0"
      >
        agentify
      </text>
      <line x1="34" y1="107" x2="84" y2="107" stroke="#C7A66A" strokeWidth="1" />
      <circle cx="88" cy="107" r="2.4" fill="#C7A66A" />
      <g stroke="#8B6CFF" strokeWidth="0.6" opacity="0.65">
        <line x1="26" y1="122" x2="94" y2="122" />
        <line x1="32" y1="130" x2="88" y2="130" />
      </g>
      <text
        x="60"
        y="140"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="4.8"
        letterSpacing="1.2"
        fill="#E8DFD0"
      >
        NOCTURNE LEDGER
      </text>
    </Plate>
  );
}

function MotionReel() {
  // lilac stock, periwinkle and the blue move chips from Chain Reaction
  return (
    <Plate bg="#DAD1EE" frame="#B9B0DA">
      <FilmFrame bg="#2B3F7A" edge="#8583BA" holes="#DAD1EE">
        <rect x="15" y="18" width="54" height="34" fill="#8965AE" />
        <path d="M 24 42 L 36 28 L 48 38 L 58 24" fill="none" stroke="#E7E2F5" strokeWidth="1.2" />
      </FilmFrame>
      <MonoLabel y={136} fill="#33539F">MOTION REEL</MonoLabel>
    </Plate>
  );
}

function InternetCapitalMarkets() {
  // black screen, the cyan-to-blue pixel title and its violet rule
  return (
    <Plate bg="#040E12" frame="#123341">
      <g transform="translate(24 46)" stroke="#00C0A8" strokeWidth="0.9" fill="none">
        <path d="M 0 54 C 18 18, 34 18, 46 34 S 62 48, 72 4" />
        <line x1="0" y1="54" x2="72" y2="54" stroke="#195170" />
        <line x1="0" y1="10" x2="0" y2="54" stroke="#195170" />
      </g>
      <circle cx="89" cy="50" r="4" fill="#A848F0" />
      <MonoLabel fill="#0090F0">ICM TEASER</MonoLabel>
    </Plate>
  );
}

function SpringHealthMotion() {
  return (
    <Plate bg="#01382E" frame="#0B5545">
      <g transform="translate(22 40)">
        <rect width="76" height="76" rx="8" fill="#F8F6F2" />
        <rect x="8" y="8" width="60" height="8" rx="4" fill="#01382E" opacity="0.92" />
        <rect x="8" y="24" width="48" height="6" rx="3" fill="#007055" opacity="0.42" />
        <rect x="8" y="38" width="60" height="22" rx="5" fill="#01382E" />
        <rect x="14" y="44" width="24" height="7" rx="3.5" fill="#8DFF9D" />
        <line x1="44" y1="46" x2="62" y2="46" stroke="#F8F6F2" strokeWidth="1.2" opacity="0.8" />
        <line x1="44" y1="53" x2="58" y2="53" stroke="#F8F6F2" strokeWidth="1.2" opacity="0.55" />
      </g>
      <g fill="#8DFF9D" opacity="0.9">
        <circle cx="35" cy="116" r="2.6" />
        <circle cx="48" cy="116" r="2.6" />
        <circle cx="61" cy="116" r="2.6" />
        <rect x="72" y="114" width="20" height="4" rx="2" />
      </g>
      <MonoLabel y={136} fill="#F8F6F2">SPRING HEALTH</MonoLabel>
    </Plate>
  );
}

function ChromeHammer() {
  // a chrome drop over its own reflection, and the wordmark it becomes
  return (
    <Plate bg="#E9E9EA" frame="#C9C9CC">
      <g transform="translate(60 70)">
        <ellipse cx="0" cy="34" rx="22" ry="3.2" fill="#c9c9cc" />
        <ellipse cx="0" cy="0" rx="21" ry="23" fill="#8d8f94" />
        <ellipse cx="-2" cy="-3" rx="17" ry="18.5" fill="#b9bbc0" />
        <ellipse cx="-6" cy="-9" rx="9" ry="7" fill="#eceef1" />
        <path d="M -16 10 Q 0 22 15 9 Q 4 16 -16 10 Z" fill="#5c5e63" />
        <ellipse cx="9" cy="-12" rx="2.6" ry="1.8" fill="#ffffff" />
        <circle cx="31" cy="-18" r="3.4" fill="#9fa1a6" />
        <circle cx="30.2" cy="-19" r="1.3" fill="#f2f3f5" />
      </g>
      <text x="60" y="132" textAnchor="middle" fontFamily="var(--font-display)" fontSize="15" fontWeight="700" fill="#9c9ea3" letterSpacing="-0.4">
        hammer<tspan fill="#d4553a">.</tspan>
      </text>
    </Plate>
  );
}

function SpotifyTitles() {
  return (
    <Plate bg="#121212" frame="#2A2A2A">
      <g transform="translate(21 30)">
        {["#E1338C", "#F59B23", "#3D8BFF", "#8D67AB", "#1DB954"].map((fill, i) => (
          <rect key={i} x={i * 16.5} y={i % 2 === 0 ? 0 : 4} width="13" height="13" rx="2.5" fill={fill} opacity="0.85" />
        ))}
      </g>
      <g transform="translate(60 86)">
        <circle r="19" fill="#1DB954" />
        <g fill="none" stroke="#121212" strokeLinecap="round">
          <path d="M -10 -6 Q 0 -10.5 10 -6" strokeWidth="2.1" />
          <path d="M -11 0 Q 0 -4.5 11 0" strokeWidth="2.4" />
          <path d="M -8.5 6 Q 0 2 8.5 6" strokeWidth="2.6" />
        </g>
      </g>
      <text
        x="60"
        y="139"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="4.8"
        letterSpacing="1.2"
        fill="#1DB954"
      >
        SPOTIFY TITLES
      </text>
    </Plate>
  );
}

function PipelineVisualizerCard() {
  // one node colour per pipeline it maps: the gunfight's sunset, the splat street, the whale's sea
  return (
    <Plate bg="#1B1D22" frame="#33363D">
      <NodeGraph edge="#4A4F57" nodes={["#D9A06B", "#B8A48A", "#3188A4"]} end="#F5F1E7" />
      <MonoLabel fill="#D9D4CA">NODE GRAPH</MonoLabel>
    </Plate>
  );
}

function CreativeSkills() {
  // a colour-theory swatch card: one muted hue per skill row
  const rows: [string, number, string][] = [
    ["COLOR", 0, "#D9A06B"],
    ["BRAND", 21, "#C48BB5"],
    ["VIDEO", 42, "#7FA7C9"],
    ["PROMPT", 63, "#9FBF8F"],
  ];
  return (
    <Plate bg="#22252B" frame="#3A3E46">
      <g transform="translate(24 40)">
        {rows.map(([label, y, fill]) => (
          <g key={label} transform={`translate(0 ${y})`}>
            <rect width="72" height="14" fill={fill} />
            <text
              x="8"
              y="9.5"
              fontFamily="var(--font-mono)"
              fontSize="4.8"
              letterSpacing="0.8"
              fill="#1B1D22"
            >
              {label}
            </text>
            <circle cx="63" cy="7" r="2.2" fill="#F5F1E7" />
          </g>
        ))}
      </g>
      <MonoLabel fill="#D9D4CA">CREATIVE SKILLS</MonoLabel>
    </Plate>
  );
}

function QcByMeasurement() {
  // the gunfight contact sheet: dusk-brown frames, one sunlit, and the cut spikes
  const spikes = [30, 44, 52, 61, 70, 76, 84];
  return (
    <Plate bg="#28211C" frame="#4A3D33">
      <g transform="translate(24 36)">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={(i % 3) * 25} y={Math.floor(i / 3) * 16} width="22" height="13" fill={i === 4 ? "#E0B57F" : "#8C694D"} stroke="#AE8B6A" strokeWidth="0.6" />
        ))}
      </g>
      <line x1="24" y1="112" x2="96" y2="112" stroke="#6B5F50" strokeWidth="0.6" />
      {spikes.map((x, i) => (
        <g key={x}>
          <line x1={x} y1="112" x2={x} y2={i % 2 ? 90 : 82} stroke="#EBDECC" strokeWidth="0.9" />
          <circle cx={x} cy={i % 2 ? 90 : 82} r="1.6" fill="none" stroke="#E0B57F" strokeWidth="0.8" />
        </g>
      ))}
      <MonoLabel fill="#EBDECC">QC BY NUMBERS</MonoLabel>
    </Plate>
  );
}

// A four-slot Geneva wheel: slots at 45° + 90°·k, locking arcs centred a·√2 out between them.
function genevaPath(cx: number, cy: number, a: number, half: number) {
  const pts: string[] = [];
  const c = a * Math.SQRT2;
  const inner = c - a;
  const lock = a - half;
  const at = (x: number, y: number) => pts.push(`${(cx + x).toFixed(2)} ${(cy - y).toFixed(2)}`);
  for (let q = 0; q < 4; q++) {
    const slot = Math.PI / 4 + (q * Math.PI) / 2;
    const cs = Math.cos(slot);
    const sn = Math.sin(slot);
    const rot = (u: number, v: number) => at(u * cs - v * sn, u * sn + v * cs);
    rot(a, -half);
    rot(inner, -half);
    for (let i = 1; i < 8; i++) {
      const t = (i / 8) * Math.PI;
      rot(inner - half * Math.sin(t), -half * Math.cos(t));
    }
    rot(inner, half);
    rot(a, half);
    const mid = slot + Math.PI / 4;
    const mx = c * Math.cos(mid);
    const my = c * Math.sin(mid);
    const start = Math.atan2(a * sn + half * cs - my, a * cs - half * sn - mx);
    let end = start - Math.PI / 2;
    end = Math.atan2(Math.sin(end), Math.cos(end));
    let span = end - start;
    while (span > 0) span -= Math.PI * 2;
    for (let i = 1; i < 10; i++) at(mx + lock * Math.cos(start + (span * i) / 10), my + lock * Math.sin(start + (span * i) / 10));
  }
  return `M${pts.join("L")}Z`;
}

const GENEVA = genevaPath(64, 82, 18, 2.5);

function ProjectorAnatomy() {
  // the anatomy figure's paper and its graphite projector body
  return (
    <Plate bg="#F2F0E5" frame="#D6D3C6">
      <g stroke="#2B2F33" strokeWidth="1">
        <rect x="24" y="44" width="15" height="80" fill="#FBFAF4" />
        {Array.from({ length: 10 }, (_, i) => (
          <g key={i}>
            <rect x="26" y={46.5 + i * 8} width="2.2" height="3" fill="#C9C7BD" stroke="none" />
            <rect x="34.8" y={46.5 + i * 8} width="2.2" height="3" fill="#C9C7BD" stroke="none" />
          </g>
        ))}
        {[0, 1, 2].map((i) => (
          <line key={i} x1="24" y1={44 + 32 + i * 32 - 32} x2="39" y2={44 + 32 + i * 32 - 32} />
        ))}
        <rect x="28.8" y="80" width="5.4" height="24" fill="#2B2F33" stroke="none" />
        <circle cx="89.5" cy="82" r="15.5" fill="#9FA19F" />
        <path d={GENEVA} fill="#4A5055" stroke="#2B2F33" />
        <circle cx="64" cy="82" r="3.2" fill="#F2F0E5" />
        <circle cx="76.7" cy="69.3" r="2.3" fill="#2B2F33" stroke="none" />
        <circle cx="89.5" cy="82" r="1.9" fill="#2B2F33" stroke="none" />
      </g>
      <MonoLabel fill="#5F625F">GENEVA · 24 FPS</MonoLabel>
    </Plate>
  );
}

function Slopocalypse() {
  // the title screen: sepia slop, a hellfire sky and a red reticle
  return (
    <Plate bg="#2B1A12" frame="#5F3C28">
      <g stroke="#8C7257" strokeWidth="0.9" fill="none">
        <rect x="20" y="34" width="80" height="80" />
        <rect x="46" y="60" width="28" height="28" />
        <line x1="20" y1="34" x2="46" y2="60" />
        <line x1="100" y1="34" x2="74" y2="60" />
        <line x1="20" y1="114" x2="46" y2="88" />
        <line x1="100" y1="114" x2="74" y2="88" />
      </g>
      <g stroke="#5F3C28" strokeWidth="0.9" fill="#C4A78E">
        {[51, 55, 59, 63, 67, 71, 75].map((x, i) => (
          <rect key={x} x={x - 1.4} y={68 - (i % 3) * 2} width="2.8" height={12 + (i % 3) * 2} rx="1.4" />
        ))}
        <rect x="50" y="78" width="26" height="8" rx="2" />
      </g>
      <g stroke="#E8603A" strokeWidth="1.1" fill="none">
        <circle cx="60" cy="74" r="7" strokeDasharray="9 2" />
      </g>
      <circle cx="60" cy="74" r="0.9" fill="#E8603A" />
      <MonoLabel fill="#D8A878">SLOP SHOOTER</MonoLabel>
    </Plate>
  );
}

function BioBay() {
  // the night beach: moon and its path, a glowing wave at the shore, a jellyfish, footprints lit in the sand
  const steps = [[34, 131], [41, 125], [43, 118], [50, 113], [51, 107], [57, 103], [58, 98]];
  return (
    <Plate bg="#0b1220" frame="#34456a">
      {[[24, 26], [36, 40], [52, 22], [94, 28], [100, 46], [64, 44], [88, 54]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="0.55" fill="#c9d4e6" />
      ))}
      <circle cx="78" cy="36" r="10" fill="#f2efe6" opacity="0.08" />
      <circle cx="78" cy="36" r="5" fill="#f2efe6" />
      <line x1="12" y1="62" x2="108" y2="62" stroke="#34456a" strokeWidth="0.7" />
      <g stroke="#f2efe6" strokeLinecap="round">
        {[[66, 2.6, 0.7], [70, 3.4, 0.55], [74, 2.2, 0.45], [78, 3.8, 0.35]].map(([y, w, o]) => (
          <line key={y} x1={78 - w} y1={y} x2={78 + w} y2={y} strokeWidth="0.8" opacity={o} />
        ))}
      </g>
      <g transform="translate(38 74)">
        <path d="M -6 0 A 6 4.6 0 0 1 6 0 Z" fill="#9b7be0" />
        <g stroke="#9b7be0" strokeWidth="0.5" strokeLinecap="round" opacity="0.8">
          <path d="M -3.5 0 q -0.8 3 0.4 6" fill="none" /><path d="M 0 0 q 0.8 3.2 -0.2 6.6" fill="none" /><path d="M 3.5 0 q 0.9 2.6 -0.3 5.6" fill="none" />
        </g>
      </g>
      <path d="M 12 92 Q 46 84 70 88 T 108 82 L 108 146 L 12 146 Z" fill="#121a29" />
      <path d="M 12 92 Q 46 84 70 88 T 108 82" fill="none" stroke="#46d6ff" strokeWidth="3" opacity="0.18" />
      <path d="M 12 92 Q 46 84 70 88 T 108 82" fill="none" stroke="#7fe8ff" strokeWidth="0.9" />
      {steps.map(([x, y], i) => (
        <g key={i} opacity={1 - i * 0.11}>
          <ellipse cx={x} cy={y} rx="3.4" ry="2.2" fill="#46d6ff" opacity="0.22" />
          <ellipse cx={x} cy={y} rx={1.5 - i * 0.07} ry={2.3 - i * 0.12} fill="#8ff0ff" transform={`rotate(-38 ${x} ${y})`} />
        </g>
      ))}
      <MonoLabel fill="#8fdcf0">GLOWING BAY</MonoLabel>
    </Plate>
  );
}

function PortalWorlds() {
  // a castle hall: arched windows, a floor running to the fireplace, and a torn bubble portal opening on a forest
  const rim = "M 80.2 78.0 L 79.2 81.7 L 80.4 86.0 L 76.6 88.3 L 76.2 92.7 L 73.1 94.9 L 69.5 95.8 L 67.2 99.3 L 63.3 98.2 L 60.0 100.4 L 56.7 98.3 L 53.4 97.5 L 49.7 97.3 L 45.6 96.6 L 45.2 91.4 L 42.9 88.7 L 39.7 86.0 L 37.4 82.3 L 38.7 78.0 L 39.8 74.1 L 38.3 69.5 L 43.5 67.7 L 42.7 62.3 L 47.1 61.4 L 50.3 59.8 L 53.4 58.4 L 56.5 56.6 L 60.0 53.8 L 63.4 57.2 L 67.3 56.3 L 70.8 57.8 L 73.1 61.1 L 76.2 63.3 L 76.5 67.7 L 77.9 71.0 L 79.4 74.3 Z";
  const sparks = [[50.3, 55.5, 0.39], [40.1, 65.2, 0.38], [66.9, 52.2, 0.36], [38.9, 66.5, 0.64], [57.2, 54.4, 0.69], [76.9, 94.7, 0.59], [73.5, 98.6, 0.27], [47.5, 54.2, 0.51], [75.7, 61.1, 0.56], [40.0, 63.5, 0.46], [74.3, 53.7, 0.46], [49.5, 59.1, 0.57], [43.8, 54.8, 0.62], [55.1, 101.9, 0.55], [83.0, 81.5, 0.33], [75.1, 92.8, 0.60], [74.9, 95.0, 0.43], [74.2, 61.9, 0.45], [35.1, 69.4, 0.62], [74.4, 60.1, 0.44], [43.5, 99.9, 0.68], [72.4, 96.6, 0.35], [62.4, 103.1, 0.52], [58.4, 99.6, 0.44], [43.7, 96.9, 0.68], [51.4, 54.3, 0.53]];
  return (
    <Plate bg="#e9dcc3" frame="#cdb894">
      {[22, 98].map((x) => (
        <path key={x} d={`M ${x - 4} 66 L ${x - 4} 44 Q ${x} 36 ${x + 4} 44 L ${x + 4} 66 Z`} fill="#f8f1e2" stroke="#b9a582" strokeWidth="0.6" />
      ))}
      <path d="M 12 112 L 46 96 L 74 96 L 108 112 L 108 146 L 12 146 Z" fill="#cdb894" />
      <g stroke="#b9a582" strokeWidth="0.5">
        <line x1="12" y1="124" x2="108" y2="124" /><line x1="30" y1="104" x2="22" y2="146" /><line x1="60" y1="96" x2="60" y2="146" /><line x1="90" y1="104" x2="98" y2="146" />
      </g>
      <defs>
        <clipPath id="portal-worlds-inside"><path d={rim} /></clipPath>
      </defs>
      <g clipPath="url(#portal-worlds-inside)">
        <rect x="30" y="50" width="60" height="60" fill="#3f6b2f" />
        <rect x="30" y="50" width="60" height="22" fill="#a9c97a" />
        <path d="M 30 92 Q 60 84 90 92 L 90 112 L 30 112 Z" fill="#5f8f3a" />
        <rect x="44" y="58" width="3.4" height="34" fill="#4a3424" />
        <rect x="70" y="56" width="4" height="36" fill="#4a3424" />
        <circle cx="45.5" cy="60" r="9" fill="#2f5524" />
        <circle cx="72" cy="58" r="10" fill="#2f5524" />
      </g>
      <path d={rim} fill="none" stroke="#c98bff" strokeWidth="4.5" opacity="0.35" />
      <path d={rim} fill="none" stroke="#fff6ff" strokeWidth="1.2" />
      {sparks.map(([x, y, r]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#ffffff" />
      ))}
      <MonoLabel fill="#6b5a40">PORTAL WORLDS</MonoLabel>
    </Plate>
  );
}

function CarWash() {
  // the Colorfigures tunnel: coral gantry, teal brushes, a yellow car in the rinse
  return (
    <Plate bg="#CFE9F0" frame="#9CC7F0">
      <g stroke="#1D2A26" strokeWidth="0.9">
        <rect x="24" y="46" width="72" height="6" fill="#FF6B5E" />
        <rect x="24" y="52" width="5" height="62" fill="#FBFAF3" />
        <rect x="91" y="52" width="5" height="62" fill="#FBFAF3" />
        <rect x="34" y="60" width="9" height="46" rx="4.5" fill="#5FC9C0" />
        <rect x="77" y="60" width="9" height="46" rx="4.5" fill="#5FC9C0" />
      </g>
      <g stroke="#3A7FC0" strokeWidth="0.6" strokeLinecap="round" strokeDasharray="2 2.5">
        {[50, 56, 62, 68].map((x) => (
          <line key={x} x1={x} y1="54" x2={x} y2="80" />
        ))}
      </g>
      <g stroke="#1D2A26" strokeWidth="0.9">
        <path d="M46 102 L46 92 L52 86 L68 86 L74 92 L74 102 Z" fill="#F6D06A" />
        <rect x="53" y="88.5" width="14" height="5" fill="#FBFAF3" />
      </g>
      <g fill="#1D2A26">
        <circle cx="50.5" cy="104" r="2.6" />
        <circle cx="69.5" cy="104" r="2.6" />
      </g>
      <line x1="20" y1="114" x2="100" y2="114" stroke="#1D2A26" strokeWidth="0.9" />
      <MonoLabel fill="#1D2A26">TUNNEL WASH</MonoLabel>
    </Plate>
  );
}

function SushiScramble() {
  // the sushi bar at night: dark wood, lantern bokeh, the salmon hero and a neon-blue drone
  return (
    <Plate bg="#200F0A" frame="#452818">
      {[[30, 34, 5], [48, 28, 3.5], [92, 36, 4.5]].map(([cx, cy, r]) => (
        <circle key={cx} cx={cx} cy={cy} r={r} fill="#F5C48A" opacity="0.35" />
      ))}
      <g stroke="#885D44" strokeWidth="0.9" fill="none">
        <ellipse cx="60" cy="96" rx="40" ry="15" />
        <ellipse cx="60" cy="96" rx="30" ry="9.5" />
      </g>
      <g fill="#CDA78B" stroke="#61402C" strokeWidth="0.7">
        <ellipse cx="29" cy="94" rx="5.5" ry="2" />
        <ellipse cx="88" cy="101" rx="5.5" ry="2" />
      </g>
      <g transform="translate(60 99)">
        <rect x="-5.5" y="-2" width="3" height="5" fill="#CDA78B" />
        <rect x="2.5" y="-2" width="3" height="5" fill="#CDA78B" />
        <ellipse cx="0" cy="-7" rx="9" ry="6.5" fill="#F3E6D6" stroke="#61402C" strokeWidth="0.7" />
        <path d="M-10.5 -8 Q0 -19 10.5 -8 Q0 -12 -10.5 -8Z" fill="#F08A5D" />
        <circle cx="0" cy="-6" r="2" fill="#200F0A" />
      </g>
      <g stroke="#C99A62" strokeWidth="1.1" strokeLinecap="round">
        <line x1="70" y1="52" x2="88" y2="44" />
        <line x1="71" y1="56" x2="89" y2="50" />
      </g>
      <circle cx="69" cy="54" r="2.2" fill="#5B6FC2" />
      <MonoLabel fill="#F5C48A">SUSHI SHOOTER</MonoLabel>
    </Plate>
  );
}

function PromptStoryboard() {
  // colour pencil on warm paper: graphite panels, the first one shaded in ochre
  return (
    <Plate bg="#E9D9C2" frame="#C7B59F">
      <g transform="translate(22 38)">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect
            key={i}
            x={(i % 2) * 41}
            y={Math.floor(i / 2) * 27}
            width="34"
            height="20"
            fill={i === 0 ? "#C98F5A" : i === 3 ? "#AAC0CC" : "#F6EEE2"}
            stroke="#7A6F62"
          />
        ))}
      </g>
      <MonoLabel fill="#5C5248">6 PANEL DEMO</MonoLabel>
    </Plate>
  );
}

function EquinoxCampaign() {
  // the spot's grey studio, a dark figure and the white title card
  return (
    <Plate bg="#332825" frame="#5F5455">
      <FilmFrame bg="#6C686D" edge="#484549" holes="#B4ACAF">
        <rect x="14" y="14" width="56" height="46" fill="#8B878C" />
        <ellipse cx="42" cy="30" rx="9" ry="12" fill="#B4ACAF" opacity="0.86" />
        <path d="M 34 43 C 40 35, 47 35, 53 43 L 58 58 H 29 Z" fill="#1A1414" />
        <rect x="18" y="35" width="48" height="6" fill="#F4F1EE" />
        <rect x="22" y="47" width="40" height="5" fill="#F4F1EE" />
      </FilmFrame>
      <MonoLabel y={136} fill="#B4ACAF">EQUINOX SPOT</MonoLabel>
    </Plate>
  );
}

function TheGunfight() {
  // dusk on main street: a low white sun behind the false fronts
  return (
    <Plate bg="#3A2320" frame="#684B41">
      <FilmFrame bg="#916B58" edge="#492C28" holes="#DFCCBE">
        <circle cx="42" cy="34" r="9" fill="#F5F1E7" opacity="0.9" />
        <g fill="#492C28">
          <rect x="8" y="30" width="16" height="22" />
          <rect x="26" y="34" width="12" height="18" />
          <rect x="48" y="32" width="12" height="20" />
          <rect x="62" y="26" width="14" height="26" />
        </g>
        <rect x="8" y="52" width="68" height="16" fill="#7E5343" />
        <g fill="#1E1311">
          <rect x="15" y="44" width="3" height="11" />
          <rect x="66" y="44" width="3" height="11" />
        </g>
        <circle cx="42" cy="58" r="3.4" fill="none" stroke="#DFCCBE" strokeWidth="0.8" />
      </FilmFrame>
      <MonoLabel y={136} fill="#DFCCBE">THE GUNFIGHT</MonoLabel>
    </Plate>
  );
}

function CodeAnimation() {
  // the north wind and the sun: slate sky, the wind's curl, a gold sun and the traveller's red cloak
  return (
    <Plate bg="#575F68" frame="#768086">
      <FilmFrame bg="#8898A2" edge="#616E78" holes="#E9EEF0">
        <path d="M 14 58 C 24 40, 34 64, 44 46 S 62 30, 70 42" fill="none" stroke="#E9EEF0" strokeWidth="1.1" />
        <path d="M 30 34 A 12 10 0 0 1 54 34 Z" fill="#C0A848" />
        <circle cx="37" cy="29" r="1.8" fill="#F2E6B8" />
        <circle cx="46" cy="27" r="1.4" fill="#F2E6B8" />
        <rect x="40" y="34" width="4" height="7" fill="#A81818" stroke="#5A0F0F" strokeWidth="0.4" />
        <text x="16" y="20" fontFamily="var(--font-mono)" fontSize="5" letterSpacing="0.6" fill="#E9EEF0">
          f(t)
        </text>
      </FilmFrame>
      <MonoLabel y={136} fill="#E9EEF0">CODE ANIMATION</MonoLabel>
    </Plate>
  );
}

function EnvironmentSwap() {
  return (
    <Plate bg="#19140F" frame="#4C3A29">
      {/* left half: the real golden-hour coast road */}
      <rect x="12" y="14" width="48" height="106" fill="#E1C193" />
      <rect x="12" y="86" width="48" height="34" fill="#B36928" />
      <circle cx="34" cy="48" r="8" fill="#F7DAAC" opacity="0.92" />
      <circle cx="34" cy="48" r="8" fill="none" stroke="#D98A3D" strokeWidth="0.8" />
      {/* right half: the swapped crystal world */}
      <rect x="60" y="14" width="48" height="106" fill="#0e2742" />
      <g fill="#4ea7d6" opacity="0.9">
        <polygon points="71,120 77,66 83,120" />
        <polygon points="85,120 91,80 97,120" />
        <polygon points="62,120 67,90 72,120" />
      </g>
      {/* swap seam */}
      <line x1="60" y1="14" x2="60" y2="120" stroke="#F7DAAC" strokeWidth="1" opacity="0.85" />
      {/* preserved first-person dashboard arc */}
      <path d="M 12 120 Q 60 103 108 120 L 108 146 L 12 146 Z" fill="#19140F" />
      <path d="M 12 120 Q 60 103 108 120" fill="none" stroke="#4C3A29" strokeWidth="0.8" />
      <text
        x="60"
        y="139"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="4.8"
        letterSpacing="1.2"
        fill="#F1D2A3"
      >
        ENV SWAP
      </text>
    </Plate>
  );
}

function NeuralSetCapture() {
  const splats: [number, number, number, number][] = [
    [34, 96, 2.2, 0.9],
    [44, 88, 3.4, 0.8],
    [52, 92, 1.8, 0.7],
    [60, 82, 2.8, 0.95],
    [70, 90, 2.2, 0.6],
    [80, 84, 3.2, 0.85],
    [40, 76, 1.6, 0.55],
    [56, 70, 2.4, 0.9],
    [66, 74, 1.8, 0.65],
    [76, 66, 2.6, 0.8],
    [48, 60, 2.0, 0.7],
    [62, 56, 1.6, 0.5],
    [86, 72, 2.0, 0.6],
    [30, 84, 1.6, 0.5],
    [72, 52, 1.4, 0.45],
  ];
  return (
    <Plate bg="#291B13" frame="#4A3A2E">
      <line x1="16" y1="100" x2="104" y2="100" stroke="#72553D" strokeWidth="0.5" />
      {splats.map(([cx, cy, r, o], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={i % 4 === 0 ? "#E0C49A" : "#9C7959"} opacity={o} />
      ))}
      <text
        x="60"
        y="139"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="4.8"
        letterSpacing="1.2"
        fill="#D9B98F"
      >
        GAUSSIAN SPLAT
      </text>
    </Plate>
  );
}

function HumpbackAr() {
  // open blue water and a dark humpback with its long white pectoral fin
  return (
    <Plate bg="#2A7590" frame="#4F93AA">
      <ellipse cx="60" cy="104" rx="36" ry="9" fill="none" stroke="#BFE6F2" strokeWidth="0.8" strokeDasharray="2.5 2.5" />
      <g fill="#16303D">
        <path d="M94 74 C 92 66, 72 62, 54 66 C 44 68, 37 72, 31 76 L 22 69 L 25 77 L 19 84 L 31 80 C 42 85, 64 87, 82 83 C 90 81, 95 78, 94 74 Z" />
        <path d="M47 67 L 44 62 L 52 66 Z" />
      </g>
      <path d="M68 82 L 60 100 L 64 101 L 72 84 Z" fill="#E6F1F4" />
      <circle cx="88" cy="73" r="1" fill="#BFE6F2" />
      <MonoLabel y={139} fill="#EAF6FA">AR · 1:1</MonoLabel>
    </Plate>
  );
}

function HammerSite() {
  return (
    <Plate>
      <Browser>
        <g transform="translate(11 20)">
          <text x="0" y="18" fontFamily="var(--font-display)" fontSize="18" fontWeight="300" fill="var(--ink-0)">
            h
          </text>
          <circle cx="12" cy="16" r="2" fill="var(--cinnamon)" />
        </g>
        <line x1="12" y1="46" x2="68" y2="46" stroke="var(--ink-3)" />
      </Browser>
      <MonoLabel>THIS SITE</MonoLabel>
    </Plate>
  );
}

function KiraSite() {
  // onlykira.ai: near-black page, the red-lit portrait, paper type and the signal orange
  return (
    <Plate bg="#0F0F0F" frame="#2A2424">
      <Browser colors={{ screen: "#161414", bar: "#262222", accent: "#FF6D1F", dot: "#52504C" }}>
        <rect x="12" y="18" width="20" height="28" fill="#A30F1E" />
        <rect x="38" y="18" width="28" height="4" fill="#F7F3EC" />
        <rect x="38" y="29" width="22" height="4" fill="#B4673A" />
        <rect x="12" y="52" width="54" height="4" fill="#F7F3EC" />
      </Browser>
      <MonoLabel fill="#FF6D1F">ONLYKIRA.AI</MonoLabel>
    </Plate>
  );
}

function AgentifySite() {
  return (
    <Plate bg="#14132A" frame="rgba(232,223,208,0.22)">
      <Browser colors={{ screen: "#0C0D16", bar: "#1E1C3A", accent: "#8B6CFF", dot: "#4A4766" }}>
        <rect x="0" y="8" width="80" height="54" fill="#0C0D16" />
        <g opacity="0.9">
          <path d="M 8 46 C 22 16, 39 10, 54 21 S 69 42, 76 17" fill="none" stroke="#C7A66A" strokeWidth="1.1" />
          <path d="M 8 50 C 29 36, 48 35, 72 50" fill="none" stroke="#4EC6DA" strokeWidth="0.75" opacity="0.75" />
        </g>
        <AgentifyLedgerGate x={10} y={11} scale={0.18} />
        <text
          x="28"
          y="28"
          fontFamily="var(--font-serif), Georgia, serif"
          fontStyle="italic"
          fontSize="10"
          letterSpacing="-0.4"
          fill="#E8DFD0"
        >
          revenue
        </text>
        <text
          x="28"
          y="39"
          fontFamily="var(--font-serif), Georgia, serif"
          fontStyle="italic"
          fontSize="10"
          letterSpacing="-0.4"
          fill="#E8DFD0"
        >
          from agents
        </text>
      </Browser>
      <text
        x="60"
        y="139"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="4.8"
        letterSpacing="1.2"
        fill="#E8DFD0"
      >
        AGENTIFY.NEXUS
      </text>
    </Plate>
  );
}

function CoefficientSite() {
  // coefficient's charcoal dashboard with its lavender scorecard type
  return (
    <Plate bg="#1B1B1E" frame="#34343A">
      <Browser colors={{ screen: "#0F0F11", bar: "#2A2A2D", accent: "#B0B0D8", dot: "#55555C" }}>
        <g fill="#F0F0F0" opacity="0.85">
          <rect x="10" y="16" width="26" height="3" />
          <rect x="10" y="22" width="16" height="2" opacity="0.5" />
        </g>
        <g transform="translate(10 54)">
          {[14, 22, 9, 28, 18, 24, 12].map((h, i) => (
            <rect key={i} x={i * 9} y={-h} width="5" height={h} fill={i === 3 ? "#B0B0D8" : "#6A6A72"} opacity={i === 3 ? 1 : 0.8} />
          ))}
        </g>
        <line x1="10" y1="54.5" x2="70" y2="54.5" stroke="#3A3A40" strokeWidth="0.5" />
      </Browser>
      <MonoLabel y={139} fill="#B0B0D8">COEFFICIENT.MYTHX.ART</MonoLabel>
    </Plate>
  );
}

function NodeGraph({
  edge = "var(--ink-3)",
  nodes: fills = ["var(--ink-0)"],
  end = "var(--cinnamon)",
}: {
  edge?: string;
  nodes?: string[];
  end?: string;
}) {
  const nodes = [
    [32, 50],
    [60, 42],
    [88, 50],
    [45, 82],
    [75, 82],
    [60, 112],
  ];

  return (
    <g>
      <g stroke={edge} strokeWidth="0.8">
        <line x1="32" y1="50" x2="45" y2="82" />
        <line x1="60" y1="42" x2="45" y2="82" />
        <line x1="60" y1="42" x2="75" y2="82" />
        <line x1="88" y1="50" x2="75" y2="82" />
        <line x1="45" y1="82" x2="60" y2="112" />
        <line x1="75" y1="82" x2="60" y2="112" />
      </g>
      {nodes.map(([cx, cy], i) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r={i === nodes.length - 1 ? 5 : 4}
          fill={i === nodes.length - 1 ? end : fills[i % fills.length]}
        />
      ))}
    </g>
  );
}

function DefaultSpecimen() {
  return (
    <Plate>
      <NodeGraph />
      <MonoLabel>ASSET SLOT</MonoLabel>
    </Plate>
  );
}
