import Link from "next/link";

export const metadata = { title: "design system" };

const COLORS = [
  { token: "--cream-0", role: "page" },
  { token: "--cream-1", role: "card" },
  { token: "--cream-2", role: "deep cream" },
  { token: "--ink-0", role: "primary text" },
  { token: "--ink-1", role: "secondary" },
  { token: "--ink-2", role: "muted" },
  { token: "--ink-3", role: "subtle" },
  { token: "--ink-4", role: "hairline" },
  { token: "--cinnamon", role: "live accent" },
  { token: "--cinnamon-h", role: "hover" },
  { token: "--bloodlust", role: "deep accent" },
];

const TYPE_SCALE = [
  { px: 12, label: "fs-1 · caption" },
  { px: 14, label: "fs-2 · small body" },
  { px: 16, label: "fs-3 · body" },
  { px: 20, label: "fs-4 · lede" },
  { px: 24, label: "fs-5 · h5" },
  { px: 32, label: "fs-6 · h4" },
  { px: 48, label: "fs-7 · h3" },
  { px: 72, label: "fs-8 · h2" },
  { px: 112, label: "fs-9 · h1" },
];

const EASINGS = [
  { name: "cinema", value: "cubic-bezier(0.65, 0, 0.35, 1)" },
  { name: "shutter", value: "cubic-bezier(0.85, 0, 0.15, 1)" },
  { name: "soft", value: "cubic-bezier(0.25, 0.1, 0.25, 1)" },
  { name: "spring", value: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
];

const DURATIONS = [
  { name: "instant", ms: 100 },
  { name: "quick", ms: 200 },
  { name: "standard", ms: 400 },
  { name: "slow", ms: 600 },
  { name: "cinematic", ms: 1000 },
];

export default function DesignSystem() {
  return (
    <main className="min-h-screen px-6 py-10 md:px-20 md:py-16">
      <header className="mb-24 flex items-baseline justify-between">
        <Link href="/" className="kw text-[clamp(28px,3vw,40px)]" aria-label="hammer · home">
          <span>h</span><span>a</span><span>m</span><span>m</span><span>e</span><span>r</span>
          <span className="dot">.</span>
        </Link>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">
          /design-system · phase 1 verification
        </span>
      </header>

      <section className="mb-32">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--cinnamon)]">
          01 · wordmark
        </p>
        <h1 className="kw text-[clamp(96px,18vw,260px)] leading-[0.84] text-[var(--ink-0)]">
          <span>h</span><span>a</span><span>m</span><span>m</span><span>e</span><span>r</span>
          <span className="dot">.</span>
        </h1>
        <p className="mt-6 max-w-[60ch] font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-2)]">
          outfit black · hand-kerned · 7.8px ink-gap target · cinnamon brand mark
        </p>
      </section>

      <section className="mb-32 border-t border-[var(--ink-4)] pt-12">
        <p className="mb-12 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--cinnamon)]">
          02 · color
        </p>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {COLORS.map((c) => (
            <div key={c.token} className="border border-[var(--ink-4)]">
              <div
                className="aspect-[4/3] w-full"
                style={{ background: `var(${c.token})` }}
                aria-hidden
              />
              <div className="border-t border-[var(--ink-4)] p-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-0)]">
                  {c.token}
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-3)]">
                  {c.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-32 border-t border-[var(--ink-4)] pt-12">
        <p className="mb-12 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--cinnamon)]">
          03 · type scale
        </p>
        <ul className="space-y-3">
          {TYPE_SCALE.map((t) => (
            <li key={t.px} className="flex items-baseline gap-8 border-b border-[var(--ink-4)] pb-3">
              <span className="w-24 shrink-0 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ink-3)]">
                {t.label}
              </span>
              <span className="font-display lowercase text-[var(--ink-0)] tracking-[-0.04em]" style={{ fontSize: t.px, fontWeight: 700, lineHeight: 1 }}>
                hammer · {t.px}px
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-32 border-t border-[var(--ink-4)] pt-12">
        <p className="mb-12 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--cinnamon)]">
          04 · type families
        </p>
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">display · outfit</div>
            <div className="font-display text-[64px] font-light lowercase leading-none tracking-[-0.04em] text-[var(--ink-0)]">aa bb cc</div>
            <div className="mt-3 font-display text-[16px] font-light leading-relaxed text-[var(--ink-1)]">the quick brown fox jumps over the lazy dog. 0123456789.</div>
          </div>
          <div>
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">body · geist</div>
            <div className="font-[var(--font-body)] text-[48px] font-medium leading-none tracking-[-0.025em] text-[var(--ink-0)]">Aa Bb Cc</div>
            <div className="mt-3 font-[var(--font-body)] text-[16px] leading-relaxed text-[var(--ink-1)]">The quick brown fox jumps over the lazy dog. 0123456789.</div>
          </div>
          <div>
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">mono · geist mono</div>
            <div className="font-mono text-[32px] leading-none tracking-[0] text-[var(--ink-0)]">Aa Bb Cc</div>
            <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-1)]">the quick brown fox · 0123456789</div>
          </div>
        </div>
        <div className="mt-12 border-t border-[var(--ink-4)] pt-6">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">italic motif · instrument serif</div>
          <p className="font-display text-[clamp(28px,4vw,56px)] font-light lowercase leading-tight tracking-[-0.04em] text-[var(--ink-0)]">
            a producer who treats <em className="font-serif italic font-normal text-[var(--bloodlust)]">machines</em> like crew.
          </p>
        </div>
      </section>

      <section className="mb-32 border-t border-[var(--ink-4)] pt-12">
        <p className="mb-12 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--cinnamon)]">
          05 · motion easings
        </p>
        <div className="grid gap-6 md:grid-cols-4">
          {EASINGS.map((e) => (
            <div key={e.name} className="border border-[var(--ink-4)] p-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">{e.name}</div>
              <div className="mt-1 break-all font-mono text-[10px] text-[var(--ink-3)]">{e.value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-32 border-t border-[var(--ink-4)] pt-12">
        <p className="mb-12 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--cinnamon)]">
          06 · duration scale
        </p>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
          {DURATIONS.map((d) => (
            <div key={d.name} className="border border-[var(--ink-4)] p-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">{d.name}</div>
              <div className="mt-2 font-display text-[40px] font-light leading-none tracking-[-0.04em] text-[var(--ink-0)] tabular-nums">
                {d.ms}<span className="font-serif italic text-[var(--cinnamon)] text-[24px]">ms</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[var(--ink-0)] pt-12 font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-2)]">
        brand tokens compiled from BRAND_GUIDE.md · phase 1 verification gate
      </footer>
    </main>
  );
}
