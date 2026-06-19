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
  "brand-systems/effigy": EffigyGuide,
  "brand-systems/agentify": AgentifyGuide,
  "agents/kira": KiraAgent,
  "agents/winston": WinstonAgent,
  "agents/bradley": BradleyAgent,
  "motion-graphics/reel": MotionReel,
  "motion-graphics/internet-capital-markets": InternetCapitalMarkets,
  "motion-graphics/audio-reactive-overlays": AudioReactiveOverlays,
  "motion-graphics/spring-health": SpringHealthMotion,
  "animation/puppet-rig-character": PuppetRig,
  "animation/looping-social-bumpers": LoopingBumpers,
  "animation/animated-short": AnimatedShort,
  "pipelines-tools/pipeline-visualizer": PipelineVisualizerCard,
  "pipelines-tools/prompt-library": PromptLibrary,
  "pipelines-tools/creative-skills": CreativeSkills,
  "interactive-playable/prompt-to-storyboard": PromptStoryboard,
  "interactive-playable/consistency-lab": ConsistencyLab,
  "interactive-playable/talk-to-character": TalkToCharacter,
  "interactive-playable/dot-discipline": DotDiscipline,
  "visual-media/equinox": EquinoxCampaign,
  "visual-media/short-film": ShortFilm,
  "visual-media/documentary-opener": DocumentaryOpener,
  "websites/hammer": HammerSite,
  "websites/hammathyme": HammerSite,
  "websites/kira": KiraSite,
  "websites/opencrawl": OpenCrawlSite,
  "websites/agentify": AgentifySite,
};

const CATEGORY_FALLBACKS: Record<string, () => ReactElement> = {
  "brand-systems": HammerGuide,
  agents: KiraAgent,
  "motion-graphics": MotionReel,
  animation: PuppetRig,
  "pipelines-tools": PipelineVisualizerCard,
  "interactive-playable": PromptStoryboard,
  "visual-media": EquinoxCampaign,
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

function MonoLabel({ children, y = 139 }: { children: string; y?: number }) {
  return (
    <text
      x="60"
      y={y}
      textAnchor="middle"
      fontFamily="var(--font-mono)"
      fontSize="4.8"
      letterSpacing="1.2"
      fill="var(--ink-2)"
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
          fontFamily="var(--font-playfair-display), var(--font-instrument-serif), Georgia, serif"
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

function EffigyGuide() {
  return (
    <Plate bg="#E8EEFF">
      <g transform="translate(42 28) scale(0.32)">
        <g transform="translate(16, 10)">
          <circle cx="40" cy="30" r="16" fill="#78A7FF" />
          <path d="M 34 50 L 46 50 L 48 58 L 32 58 Z" fill="#78A7FF" />
          <path d="M 24 58 L 56 58 L 66 180 L 14 180 Z" fill="#78A7FF" />
          <rect x="8" y="184" width="64" height="28" fill="#78A7FF" />
        </g>
        <circle cx="40" cy="30" r="16" fill="#0A1230" />
        <path d="M 34 50 L 46 50 L 48 58 L 32 58 Z" fill="#0A1230" />
        <path d="M 24 58 L 56 58 L 66 180 L 14 180 Z" fill="#0A1230" />
        <rect x="8" y="184" width="64" height="28" fill="#0A1230" />
      </g>
      <text
        x="60"
        y="112"
        textAnchor="middle"
        fontFamily="var(--font-jetbrains-mono), var(--font-geist-mono), ui-monospace, monospace"
        fontWeight="800"
        fontSize="13"
        letterSpacing="-0.85"
        fill="#0A1230"
      >
        effigy
      </text>
      <g stroke="#0A1230" strokeWidth="0.8" opacity="0.75">
        <line x1="32" y1="121" x2="88" y2="121" />
        <line x1="40" y1="130" x2="80" y2="130" />
      </g>
      <MonoLabel>PROVENANCE BOOK</MonoLabel>
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

function KiraAgent() {
  return (
    <Plate bg="var(--cream-2)">
      <rect x="22" y="32" width="76" height="34" fill="var(--ink-0)" />
      <circle cx="40" cy="66" r="13" fill="var(--cinnamon)" />
      <rect x="28" y="84" width="64" height="36" fill="var(--cream-0)" stroke="var(--ink-3)" />
      <line x1="36" y1="96" x2="84" y2="96" stroke="var(--ink-2)" strokeWidth="0.7" />
      <line x1="36" y1="106" x2="72" y2="106" stroke="var(--ink-3)" strokeWidth="0.7" />
      <MonoLabel>LIVE AGENT</MonoLabel>
    </Plate>
  );
}

function WinstonAgent() {
  return (
    <Plate>
      <rect x="28" y="44" width="64" height="80" fill="var(--cream-0)" stroke="var(--ink-3)" />
      <path d="M 40 68 C 48 54, 72 54, 80 68" fill="none" stroke="var(--ink-0)" strokeWidth="2" />
      <circle cx="48" cy="78" r="2" fill="var(--ink-0)" />
      <circle cx="72" cy="78" r="2" fill="var(--ink-0)" />
      <g stroke="var(--ink-3)" strokeWidth="0.7">
        <line x1="38" y1="101" x2="82" y2="101" />
        <line x1="38" y1="110" x2="70" y2="110" />
      </g>
      <MonoLabel>VOICE SHEET</MonoLabel>
    </Plate>
  );
}

function BradleyAgent() {
  return (
    <Plate bg="var(--bloodlust)">
      <rect x="26" y="38" width="68" height="88" fill="var(--cream-0)" />
      <circle cx="60" cy="68" r="20" fill="var(--ink-0)" />
      <rect x="43" y="92" width="34" height="16" fill="var(--cinnamon)" />
      <g stroke="var(--ink-3)" strokeWidth="0.8">
        <line x1="34" y1="116" x2="86" y2="116" />
        <line x1="42" y1="122" x2="78" y2="122" />
      </g>
      <MonoLabel y={140}>IDENTITY LOCK</MonoLabel>
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
      <MonoLabel y={136}>MOTION REEL</MonoLabel>
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

function AudioReactiveOverlays() {
  return (
    <Plate bg="var(--cinnamon)">
      <g transform="translate(24 50)" fill="var(--ink-0)">
        {[18, 34, 50, 28, 62, 40, 24, 54].map((h, i) => (
          <rect key={i} x={i * 9} y={68 - h} width="5" height={h} />
        ))}
      </g>
      <circle cx="60" cy="82" r="27" fill="none" stroke="var(--cream-0)" strokeWidth="0.8" />
      <MonoLabel>AUDIO OVERLAY</MonoLabel>
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
      <MonoLabel y={136}>SPRING HEALTH</MonoLabel>
    </Plate>
  );
}

function PuppetRig() {
  return (
    <Plate bg="var(--cinnamon)">
      <g transform="translate(60 76)" stroke="var(--cream-0)" strokeWidth="1" fill="var(--ink-0)">
        <line x1="0" y1="-28" x2="0" y2="10" />
        <line x1="-22" y1="-8" x2="22" y2="-8" />
        <line x1="0" y1="10" x2="-18" y2="36" />
        <line x1="0" y1="10" x2="18" y2="36" />
        {[
          [0, -32],
          [0, -8],
          [-22, -8],
          [22, -8],
          [0, 10],
          [-18, 36],
          [18, 36],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="4" />
        ))}
      </g>
      <MonoLabel>RIVE RIG</MonoLabel>
    </Plate>
  );
}

function LoopingBumpers() {
  return (
    <Plate>
      <g transform="translate(60 76)">
        <circle r="32" fill="none" stroke="var(--ink-3)" strokeWidth="0.8" />
        <path d="M -26 -4 C -14 -28, 18 -28, 28 -2 S 14 32, -14 22" fill="none" stroke="var(--ink-0)" strokeWidth="1.4" />
        <polygon points="30,-2 20,-8 22,5" fill="var(--cinnamon)" />
      </g>
      <MonoLabel>LOOP KIT</MonoLabel>
    </Plate>
  );
}

function AnimatedShort() {
  return (
    <Plate bg="var(--bloodlust)">
      <FilmFrame>
        <rect x="17" y="16" width="50" height="38" fill="var(--cream-0)" />
        <path d="M 24 45 C 30 28, 44 24, 56 38 L 66 22 L 70 54 L 20 54 Z" fill="var(--ink-0)" />
        <circle cx="34" cy="29" r="5" fill="var(--cinnamon)" />
        <path d="M 18 58 C 32 64, 50 64, 66 58" fill="none" stroke="var(--cinnamon)" strokeWidth="1" />
      </FilmFrame>
      <MonoLabel y={136}>ANIMATED SHORT</MonoLabel>
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

function PromptLibrary() {
  return (
    <Plate bg="var(--cream-2)">
      <g transform="translate(28 42)">
        {[0, 1, 2].map((i) => (
          <rect key={i} x={i * 8} y={i * 8} width="58" height="68" fill="var(--cream-0)" stroke="var(--ink-3)" />
        ))}
        <line x1="18" y1="28" x2="60" y2="28" stroke="var(--ink-2)" strokeWidth="0.8" />
        <line x1="18" y1="40" x2="52" y2="40" stroke="var(--ink-3)" strokeWidth="0.8" />
        <line x1="18" y1="52" x2="56" y2="52" stroke="var(--ink-3)" strokeWidth="0.8" />
      </g>
      <MonoLabel>PROMPT STACK</MonoLabel>
    </Plate>
  );
}

function CreativeSkills() {
  return (
    <Plate>
      <g transform="translate(24 40)">
        {[
          ["COLOR", 0],
          ["KIRA", 21],
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

function ConsistencyLab() {
  return (
    <Plate bg="var(--cream-2)">
      <g transform="translate(24 42)">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i} transform={`translate(${(i % 3) * 28} ${Math.floor(i / 3) * 38})`}>
            <rect width="20" height="28" fill="var(--cream-0)" stroke="var(--ink-3)" />
            <circle cx="10" cy="11" r="6" fill="var(--ink-0)" />
            <circle cx="10" cy="22" r="4" fill="var(--cinnamon)" opacity={i % 2 ? 0.5 : 1} />
          </g>
        ))}
      </g>
      <MonoLabel>LOCKED FACE</MonoLabel>
    </Plate>
  );
}

function TalkToCharacter() {
  return (
    <Plate bg="var(--cinnamon)">
      <g transform="translate(24 50)">
        <rect width="58" height="24" fill="var(--cream-0)" stroke="var(--ink-3)" />
        <path d="M 18 24 L 12 32 L 30 24" fill="var(--cream-0)" stroke="var(--ink-3)" />
        <rect x="16" y="44" width="58" height="24" fill="var(--ink-0)" />
        <path d="M 56 68 L 64 76 L 48 68" fill="var(--ink-0)" />
      </g>
      <MonoLabel>CHAT SURFACE</MonoLabel>
    </Plate>
  );
}

function DotDiscipline() {
  return (
    <Plate>
      <g transform="translate(21 66)">
        <text
          x="0"
          y="0"
          fontFamily="var(--font-display)"
          fontWeight="300"
          fontSize="26"
          letterSpacing="-1.2"
          fill="var(--ink-0)"
        >
          hammer
        </text>
        <circle cx="74" cy="-1.8" r="3.2" fill="var(--cinnamon)" />
        <line x1="2" y1="7" x2="84" y2="7" stroke="var(--ink-4)" strokeWidth="0.8" />
        <line x1="70" y1="-13" x2="78" y2="-13" stroke="var(--cinnamon)" strokeWidth="1.1" />
        <line x1="74" y1="-17" x2="74" y2="-9" stroke="var(--cinnamon)" strokeWidth="1.1" />
      </g>
      <g transform="translate(28 96)" stroke="var(--ink-3)" strokeWidth="0.8">
        <line x1="0" y1="0" x2="64" y2="0" />
        <line x1="0" y1="12" x2="64" y2="12" />
        <line x1="0" y1="24" x2="64" y2="24" />
        <circle cx="58" cy="0" r="2.4" fill="var(--cinnamon)" stroke="none" />
        <circle cx="47" cy="12" r="2.4" fill="var(--ink-0)" stroke="none" />
        <circle cx="52" cy="24" r="2.4" fill="var(--ink-0)" stroke="none" />
      </g>
      <MonoLabel>BRAND GAME</MonoLabel>
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

function ShortFilm() {
  return (
    <Plate>
      <FilmFrame bg="var(--cream-0)">
        <path d="M 18 52 L 38 22 L 52 40 L 62 28 L 72 52 Z" fill="var(--ink-0)" />
        <circle cx="62" cy="20" r="5" fill="var(--cinnamon)" />
      </FilmFrame>
      <MonoLabel>NARRATIVE SHORT</MonoLabel>
    </Plate>
  );
}

function DocumentaryOpener() {
  return (
    <Plate bg="var(--cinnamon)">
      <FilmFrame bg="var(--cream-0)">
        <rect x="16" y="14" width="52" height="25" fill="var(--ink-0)" />
        <circle cx="28" cy="26" r="5" fill="var(--cinnamon)" />
        <path d="M 36 32 L 46 20 L 57 32" fill="none" stroke="var(--cream-0)" strokeWidth="1.1" />
        <rect x="16" y="48" width="38" height="5" fill="var(--ink-0)" />
        <rect x="16" y="56" width="28" height="3" fill="var(--ink-3)" />
        <rect x="50" y="56" width="18" height="3" fill="var(--cinnamon)" />
      </FilmFrame>
      <g transform="translate(26 114)">
        <line x1="0" y1="0" x2="68" y2="0" stroke="var(--cream-0)" strokeWidth="1" opacity="0.9" />
      </g>
      <MonoLabel>DOC OPENER</MonoLabel>
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

function OpenCrawlSite() {
  return (
    <Plate bg="var(--bloodlust)">
      <Browser dark>
        <g fill="var(--cinnamon)">
          <rect x="14" y="18" width="8" height="8" />
          <rect x="24" y="28" width="8" height="8" />
          <rect x="34" y="38" width="8" height="8" />
        </g>
        <line x1="50" y1="20" x2="66" y2="20" stroke="var(--cream-0)" />
        <line x1="50" y1="32" x2="70" y2="32" stroke="var(--cream-0)" />
        <line x1="50" y1="44" x2="62" y2="44" stroke="var(--cream-0)" />
      </Browser>
      <MonoLabel y={139}>OPENCRAWL.GG</MonoLabel>
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
