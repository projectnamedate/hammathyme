import Link from "next/link";

const NAV = [
  { href: "/work", label: "work" },
  { href: "/lab", label: "lab" },
  { href: "/agents", label: "agents" },
  { href: "/notes", label: "notes" },
  { href: "/about", label: "about" },
  { href: "/process", label: "process" },
  { href: "/contact", label: "contact" },
];

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-10 md:px-20 md:py-16">
      <header className="mb-24 flex items-baseline justify-between">
        <Link href="/" className="kw text-[clamp(28px,3vw,40px)]" aria-label="hammer · home">
          <span>h</span><span>a</span><span>m</span><span>m</span><span>e</span><span>r</span>
          <span className="dot">.</span>
        </Link>
        <nav className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">
          phase 1 · scaffold
        </nav>
      </header>

      <section className="mb-24">
        <h1 className="kw text-[clamp(96px,18vw,260px)] leading-[0.84] text-[var(--ink-0)]">
          <span>h</span><span>a</span><span>m</span><span>m</span><span>e</span><span>r</span>
          <span className="dot">.</span>
        </h1>
        <p className="mt-12 max-w-[40ch] font-serif italic text-[clamp(20px,2.4vw,32px)] leading-tight text-[var(--ink-1)]">
          a producer who treats machines <em className="text-[var(--bloodlust)]">like crew</em>.
        </p>
      </section>

      <section className="border-t border-[var(--ink-4)] pt-12">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">
          routes scaffolded
        </h2>
        <ul className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
          {NAV.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                className="block border-b border-[var(--ink-4)] pb-2 font-display text-[var(--fs-5)] lowercase text-[var(--ink-1)] transition-colors hover:text-[var(--cinnamon)]"
              >
                {n.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/design-system"
              className="block border-b border-[var(--ink-4)] pb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-3)] transition-colors hover:text-[var(--cinnamon)]"
            >
              /design-system
            </Link>
          </li>
        </ul>
      </section>

      <footer className="mt-24 border-t border-[var(--ink-0)] pt-12 font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-2)]">
        v 0.1.0 · phase 1 foundation · vinaceous cinnamon · polished bloodlust
      </footer>
    </main>
  );
}
