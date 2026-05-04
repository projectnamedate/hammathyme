import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: `notes · ${slug}` };
}

/**
 * Library article — the one route that scrolls vertically (prose convention).
 * Even here, scroll is bounded to the article frame; chrome stays fixed.
 */
export default async function Note({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = slug.replace(/-/g, " ");
  return (
    <main className="relative min-h-[100svh] w-screen px-6 pt-32 pb-32 md:px-24 md:pt-40">
      <div className="mx-auto max-w-[60ch]">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--cinnamon)]">
          v · library
        </p>
        <h1 className="mt-6 font-display text-[clamp(40px,7vw,96px)] font-light lowercase leading-[0.95] tracking-[-0.04em] text-[var(--ink-0)]">
          {title}
        </h1>
        <div className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">
          <span className="block h-px w-8 bg-[var(--ink-3)]" />
          <span>essay · placeholder · phase 5</span>
        </div>
        <article className="mt-16 space-y-8 font-display font-light text-[var(--fs-4)] leading-[1.6] text-[var(--ink-1)]">
          <p>
            placeholder essay body. real prose lands phase 5. the article frame is
            the one place on the site where vertical scroll is welcome — long-form
            wants to read top to bottom.
          </p>
          <p>
            chapter markers, figure-numbered images, and a custom reading caret
            arrive in phase 5.
          </p>
        </article>

        <div className="mt-24 border-t border-[var(--ink-4)] pt-8 flex items-center justify-between">
          <Link
            href="/notes"
            data-cursor="link"
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)] underline decoration-[var(--ink-3)] underline-offset-4 hover:text-[var(--cinnamon)]"
          >
            ← back to library
          </Link>
          <Link
            href="/contact"
            data-cursor="link"
            data-cursor-label="say hi"
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-1)] hover:text-[var(--cinnamon)]"
          >
            get in touch →
          </Link>
        </div>
      </div>
    </main>
  );
}
