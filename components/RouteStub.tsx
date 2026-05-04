import Link from "next/link";

export function RouteStub({ title, slug, kicker }: { title: string; slug: string; kicker?: string }) {
  return (
    <main className="min-h-screen px-6 py-10 md:px-20 md:py-16">
      <header className="mb-24 flex items-baseline justify-between">
        <Link href="/" className="kw text-[clamp(28px,3vw,40px)]" aria-label="hammer · home">
          <span>h</span><span>a</span><span>m</span><span>m</span><span>e</span><span>r</span>
          <span className="dot">.</span>
        </Link>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">
          {slug}
        </span>
      </header>

      <section>
        {kicker ? (
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--cinnamon)]">
            {kicker}
          </p>
        ) : null}
        <h1 className="font-display text-[clamp(56px,9vw,128px)] font-light lowercase leading-[0.9] text-[var(--ink-0)] tracking-[-0.04em]">
          {title}
        </h1>
        <p className="mt-12 max-w-[48ch] font-display font-light text-[var(--fs-5)] text-[var(--ink-1)]">
          phase 1 placeholder. content lands phase 3–9.
        </p>
      </section>

      <footer className="mt-24 border-t border-[var(--ink-4)] pt-8 font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-3)]">
        ← <Link href="/" className="underline hover:text-[var(--cinnamon)]">home</Link>
      </footer>
    </main>
  );
}
