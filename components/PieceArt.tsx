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
  children,
}: {
  bg?: string;
  children: ReactNode;
}) {
  return (
    <g>
      <rect width="120" height="160" fill={bg} />
      <rect x="12" y="14" width="96" height="132" fill="none" stroke="var(--ink-4)" strokeWidth="0.7" />
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

function Browser({
  dark = false,
  children,
}: {
  dark?: boolean;
  children: ReactNode;
}) {
  const fill = dark ? "var(--ink-deepest)" : "var(--cream-0)";
  const stroke = dark ? "var(--cinnamon)" : "var(--ink-3)";
  return (
    <g transform="translate(20 44)">
      <rect width="80" height="62" fill={fill} stroke={stroke} strokeWidth="0.8" />
      <rect width="80" height="8" fill={dark ? "var(--ink-0)" : "var(--ink-4)"} />
      <circle cx="5" cy="4" r="1.2" fill="var(--cinnamon)" />
      <circle cx="9" cy="4" r="1.2" fill={dark ? "var(--ink-3)" : "var(--ink-2)"} />
      <circle cx="13" cy="4" r="1.2" fill={dark ? "var(--ink-3)" : "var(--ink-2)"} />
      {children}
    </g>
  );
}

function FilmFrame({ children, bg = "var(--ink-deepest)" }: { children: ReactNode; bg?: string }) {
  return (
    <g transform="translate(18 32)">
      <rect width="84" height="74" fill={bg} stroke="var(--ink-3)" strokeWidth="0.8" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <rect x="4" y={6 + i * 11} width="5" height="5" fill="var(--cream-1)" opacity="0.75" />
          <rect x="75" y={6 + i * 11} width="5" height="5" fill="var(--cream-1)" opacity="0.75" />
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
    <Plate bg="var(--cream-2)">
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
      <MonoLabel>CHARACTER BIBLE</MonoLabel>
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
    <Plate bg="#0C0D16">
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
  return (
    <Plate bg="var(--bloodlust)">
      <FilmFrame>
        <rect x="15" y="18" width="54" height="34" fill="var(--cinnamon)" />
        <path d="M 24 42 L 36 28 L 48 38 L 58 24" fill="none" stroke="var(--cream-0)" strokeWidth="1.2" />
      </FilmFrame>
      <MonoLabel y={136} fill="var(--cream-1)">MOTION REEL</MonoLabel>
    </Plate>
  );
}

function InternetCapitalMarkets() {
  return (
    <Plate>
      <g transform="translate(24 46)" stroke="var(--ink-0)" strokeWidth="0.9" fill="none">
        <path d="M 0 54 C 18 18, 34 18, 46 34 S 62 48, 72 4" />
        <line x1="0" y1="54" x2="72" y2="54" stroke="var(--ink-3)" />
        <line x1="0" y1="10" x2="0" y2="54" stroke="var(--ink-3)" />
      </g>
      <circle cx="89" cy="50" r="4" fill="var(--cinnamon)" />
      <MonoLabel>ICM TEASER</MonoLabel>
    </Plate>
  );
}

function SpringHealthMotion() {
  return (
    <Plate bg="#01382E">
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
      <MonoLabel y={136} fill="var(--cream-1)">SPRING HEALTH</MonoLabel>
    </Plate>
  );
}

function SpotifyTitles() {
  return (
    <Plate bg="#121212">
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
  return (
    <Plate>
      <NodeGraph />
      <MonoLabel>NODE GRAPH</MonoLabel>
    </Plate>
  );
}

function CreativeSkills() {
  return (
    <Plate>
      <g transform="translate(24 40)">
        {[
          ["COLOR", 0],
          ["BRAND", 21],
          ["VIDEO", 42],
          ["PROMPT", 63],
        ].map(([label, y], i) => (
          <g key={label} transform={`translate(0 ${y})`}>
            <rect width="72" height="14" fill={i === 1 ? "var(--cinnamon)" : "var(--cream-0)"} stroke="var(--ink-3)" strokeWidth="0.6" />
            <text
              x="8"
              y="9.5"
              fontFamily="var(--font-mono)"
              fontSize="4.8"
              letterSpacing="0.8"
              fill="var(--ink-0)"
            >
              {label}
            </text>
            <circle cx="63" cy="7" r="2.2" fill={i === 1 ? "var(--cream-0)" : "var(--cinnamon)"} />
          </g>
        ))}
      </g>
      <MonoLabel>CREATIVE SKILLS</MonoLabel>
    </Plate>
  );
}

function QcByMeasurement() {
  const spikes = [30, 44, 52, 61, 70, 76, 84];
  return (
    <Plate>
      <g transform="translate(24 36)">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={(i % 3) * 25} y={Math.floor(i / 3) * 16} width="22" height="13" fill={i === 4 ? "var(--cinnamon)" : "var(--cream-0)"} stroke="var(--ink-3)" strokeWidth="0.6" />
        ))}
      </g>
      <line x1="24" y1="112" x2="96" y2="112" stroke="var(--ink-3)" strokeWidth="0.6" />
      {spikes.map((x, i) => (
        <g key={x}>
          <line x1={x} y1="112" x2={x} y2={i % 2 ? 90 : 82} stroke="var(--ink-0)" strokeWidth="0.9" />
          <circle cx={x} cy={i % 2 ? 90 : 82} r="1.6" fill="none" stroke="var(--cinnamon)" strokeWidth="0.8" />
        </g>
      ))}
      <MonoLabel>QC BY NUMBERS</MonoLabel>
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
  return (
    <Plate>
      <g stroke="var(--ink-3)" strokeWidth="1">
        <rect x="24" y="44" width="15" height="80" fill="var(--cream-0)" />
        {Array.from({ length: 10 }, (_, i) => (
          <g key={i}>
            <rect x="26" y={46.5 + i * 8} width="2.2" height="3" fill="var(--ink-4)" stroke="none" />
            <rect x="34.8" y={46.5 + i * 8} width="2.2" height="3" fill="var(--ink-4)" stroke="none" />
          </g>
        ))}
        {[0, 1, 2].map((i) => (
          <line key={i} x1="24" y1={44 + 32 + i * 32 - 32} x2="39" y2={44 + 32 + i * 32 - 32} />
        ))}
        <rect x="28.8" y="80" width="5.4" height="24" fill="var(--ink-0)" stroke="none" />
        <circle cx="89.5" cy="82" r="15.5" fill="var(--cream-0)" />
        <path d={GENEVA} fill="var(--cinnamon)" stroke="var(--ink-1)" />
        <circle cx="64" cy="82" r="3.2" fill="var(--cream-0)" />
        <circle cx="76.7" cy="69.3" r="2.3" fill="var(--ink-0)" stroke="none" />
        <circle cx="89.5" cy="82" r="1.9" fill="var(--ink-2)" stroke="none" />
      </g>
      <MonoLabel>GENEVA · 24 FPS</MonoLabel>
    </Plate>
  );
}

function SushiScramble() {
  return (
    <Plate>
      <g stroke="var(--ink-3)" strokeWidth="0.9" fill="none">
        <ellipse cx="60" cy="96" rx="40" ry="15" />
        <ellipse cx="60" cy="96" rx="30" ry="9.5" />
      </g>
      <g fill="var(--cream-0)" stroke="var(--ink-3)" strokeWidth="0.7">
        <ellipse cx="29" cy="94" rx="5.5" ry="2" />
        <ellipse cx="88" cy="101" rx="5.5" ry="2" />
      </g>
      <g transform="translate(60 99)">
        <rect x="-5.5" y="-2" width="3" height="5" fill="var(--ink-1)" />
        <rect x="2.5" y="-2" width="3" height="5" fill="var(--ink-1)" />
        <ellipse cx="0" cy="-7" rx="9" ry="6.5" fill="var(--cream-0)" stroke="var(--ink-3)" strokeWidth="0.7" />
        <path d="M-10.5 -8 Q0 -19 10.5 -8 Q0 -12 -10.5 -8Z" fill="var(--cinnamon)" />
        <circle cx="0" cy="-6" r="2" fill="var(--ink-0)" />
      </g>
      <g stroke="var(--ink-1)" strokeWidth="1.1" strokeLinecap="round">
        <line x1="70" y1="52" x2="88" y2="44" />
        <line x1="71" y1="56" x2="89" y2="50" />
      </g>
      <circle cx="69" cy="54" r="2.2" fill="var(--ink-2)" />
      <MonoLabel>SUSHI SHOOTER</MonoLabel>
    </Plate>
  );
}

function PromptStoryboard() {
  return (
    <Plate>
      <g transform="translate(22 38)">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect
            key={i}
            x={(i % 2) * 41}
            y={Math.floor(i / 2) * 27}
            width="34"
            height="20"
            fill={i === 0 ? "var(--cinnamon)" : "var(--cream-0)"}
            stroke="var(--ink-3)"
          />
        ))}
      </g>
      <MonoLabel>6 PANEL DEMO</MonoLabel>
    </Plate>
  );
}

function EquinoxCampaign() {
  return (
    <Plate bg="var(--cream-1)">
      <FilmFrame bg="#6F6C70">
        <rect x="14" y="14" width="56" height="46" fill="#8B878C" />
        <ellipse cx="42" cy="30" rx="9" ry="12" fill="var(--cream-0)" opacity="0.86" />
        <path d="M 34 43 C 40 35, 47 35, 53 43 L 58 58 H 29 Z" fill="var(--ink-0)" />
        <rect x="18" y="35" width="48" height="6" fill="var(--cream-0)" />
        <rect x="22" y="47" width="40" height="5" fill="var(--cream-0)" />
      </FilmFrame>
      <MonoLabel y={136}>EQUINOX SPOT</MonoLabel>
    </Plate>
  );
}

function TheGunfight() {
  return (
    <Plate bg="var(--bloodlust)">
      <FilmFrame bg="#C98B5E">
        <circle cx="42" cy="34" r="9" fill="var(--cream-0)" opacity="0.9" />
        <g fill="var(--ink-deepest)">
          <rect x="8" y="30" width="16" height="22" />
          <rect x="26" y="34" width="12" height="18" />
          <rect x="48" y="32" width="12" height="20" />
          <rect x="62" y="26" width="14" height="26" />
        </g>
        <rect x="8" y="52" width="68" height="16" fill="#8A5A3C" />
        <g fill="var(--ink-0)">
          <rect x="15" y="44" width="3" height="11" />
          <rect x="66" y="44" width="3" height="11" />
        </g>
        <circle cx="42" cy="58" r="3.4" fill="none" stroke="var(--ink-0)" strokeWidth="0.8" />
      </FilmFrame>
      <MonoLabel y={136} fill="var(--cream-1)">THE GUNFIGHT</MonoLabel>
    </Plate>
  );
}

function CodeAnimation() {
  return (
    <Plate bg="var(--cinnamon)">
      <FilmFrame bg="var(--cream-0)">
        <path d="M 14 58 C 24 40, 34 64, 44 46 S 62 30, 70 42" fill="none" stroke="var(--ink-0)" strokeWidth="1.1" />
        <path d="M 30 34 A 12 10 0 0 1 54 34 Z" fill="var(--cinnamon)" />
        <circle cx="37" cy="29" r="1.8" fill="var(--cream-0)" />
        <circle cx="46" cy="27" r="1.4" fill="var(--cream-0)" />
        <rect x="40" y="34" width="4" height="7" fill="var(--cream-1)" stroke="var(--ink-3)" strokeWidth="0.4" />
        <text x="16" y="20" fontFamily="var(--font-mono)" fontSize="5" letterSpacing="0.6" fill="var(--ink-2)">
          f(t)
        </text>
      </FilmFrame>
      <MonoLabel y={136} fill="var(--ink-0)">CODE ANIMATION</MonoLabel>
    </Plate>
  );
}

function EnvironmentSwap() {
  return (
    <Plate bg="var(--ink-0)">
      {/* left half: warm desert world */}
      <rect x="12" y="14" width="48" height="106" fill="#3b2535" />
      <rect x="12" y="86" width="48" height="34" fill="#6e3f2c" />
      <circle cx="34" cy="48" r="8" fill="var(--cinnamon)" opacity="0.92" />
      {/* right half: cool crystal world */}
      <rect x="60" y="14" width="48" height="106" fill="#0e2742" />
      <g fill="#4ea7d6" opacity="0.9">
        <polygon points="71,120 77,66 83,120" />
        <polygon points="85,120 91,80 97,120" />
        <polygon points="62,120 67,90 72,120" />
      </g>
      {/* swap seam */}
      <line x1="60" y1="14" x2="60" y2="120" stroke="var(--cinnamon)" strokeWidth="1" opacity="0.85" />
      {/* preserved first-person dashboard arc */}
      <path d="M 12 120 Q 60 103 108 120 L 108 146 L 12 146 Z" fill="var(--ink-0)" />
      <path d="M 12 120 Q 60 103 108 120" fill="none" stroke="var(--ink-3)" strokeWidth="0.8" />
      <text
        x="60"
        y="139"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="4.8"
        letterSpacing="1.2"
        fill="var(--cream-1)"
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
    <Plate bg="var(--ink-0)">
      <line x1="16" y1="100" x2="104" y2="100" stroke="var(--ink-3)" strokeWidth="0.5" />
      {splats.map(([cx, cy, r, o], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={i % 4 === 0 ? "var(--cinnamon)" : "var(--cream-1)"} opacity={o} />
      ))}
      <text
        x="60"
        y="139"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="4.8"
        letterSpacing="1.2"
        fill="var(--cream-1)"
      >
        GAUSSIAN SPLAT
      </text>
    </Plate>
  );
}

function HumpbackAr() {
  return (
    <Plate bg="#0B3A4E">
      <ellipse cx="60" cy="104" rx="36" ry="9" fill="none" stroke="var(--cinnamon)" strokeWidth="0.8" strokeDasharray="2.5 2.5" />
      <g fill="var(--cream-1)">
        <path d="M94 74 C 92 66, 72 62, 54 66 C 44 68, 37 72, 31 76 L 22 69 L 25 77 L 19 84 L 31 80 C 42 85, 64 87, 82 83 C 90 81, 95 78, 94 74 Z" />
        <path d="M68 82 L 60 100 L 64 101 L 72 84 Z" />
        <path d="M47 67 L 44 62 L 52 66 Z" />
      </g>
      <circle cx="88" cy="73" r="1" fill="#0B3A4E" />
      <MonoLabel y={139} fill="var(--cream-1)">AR · 1:1</MonoLabel>
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
  return (
    <Plate bg="var(--cream-2)">
      <Browser dark>
        <rect x="12" y="18" width="20" height="28" fill="var(--cinnamon)" />
        <rect x="38" y="18" width="28" height="4" fill="var(--cream-0)" />
        <rect x="38" y="29" width="22" height="4" fill="var(--ink-3)" />
        <rect x="12" y="52" width="54" height="4" fill="var(--cream-0)" />
      </Browser>
      <MonoLabel>ONLYKIRA.AI</MonoLabel>
    </Plate>
  );
}

function AgentifySite() {
  return (
    <Plate bg="#14132A">
      <Browser dark>
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
  return (
    <Plate bg="#161A2B">
      <Browser dark>
        <rect x="0" y="8" width="80" height="54" fill="#0E1120" />
        <g fill="var(--cream-0)" opacity="0.85">
          <rect x="10" y="16" width="26" height="3" />
          <rect x="10" y="22" width="16" height="2" opacity="0.5" />
        </g>
        <g transform="translate(10 54)">
          {[14, 22, 9, 28, 18, 24, 12].map((h, i) => (
            <rect key={i} x={i * 9} y={-h} width="5" height={h} fill={i === 3 ? "var(--cinnamon)" : "var(--cream-1)"} opacity={i === 3 ? 1 : 0.55} />
          ))}
        </g>
        <line x1="10" y1="54.5" x2="70" y2="54.5" stroke="var(--ink-3)" strokeWidth="0.5" />
      </Browser>
      <MonoLabel y={139} fill="var(--cream-1)">COEFFICIENT.MYTHX.ART</MonoLabel>
    </Plate>
  );
}

function NodeGraph() {
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
      <g stroke="var(--ink-3)" strokeWidth="0.8">
        <line x1="32" y1="50" x2="45" y2="82" />
        <line x1="60" y1="42" x2="45" y2="82" />
        <line x1="60" y1="42" x2="75" y2="82" />
        <line x1="88" y1="50" x2="75" y2="82" />
        <line x1="45" y1="82" x2="60" y2="112" />
        <line x1="75" y1="82" x2="60" y2="112" />
      </g>
      {nodes.map(([cx, cy], i) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={i === nodes.length - 1 ? 5 : 4} fill={i === nodes.length - 1 ? "var(--cinnamon)" : "var(--ink-0)"} />
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
