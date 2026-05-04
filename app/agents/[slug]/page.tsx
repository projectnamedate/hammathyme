import Link from "next/link";
import { WallPlate } from "@/components/WallPlate";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: `agents · ${slug}` };
}

export default async function AgentRoom({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <main className="relative min-h-[100svh] w-screen px-6 pt-32 pb-24 md:px-24 md:pt-40">
      <div className="grid w-full grid-cols-1 gap-16 md:grid-cols-12">
        <aside className="md:col-span-5">
          <div
            className="aspect-[3/4] w-full overflow-hidden border border-[var(--ink-4)]"
            style={{ background: "var(--cream-2)" }}
            aria-hidden
          />
          <div className="mt-6">
            <WallPlate
              index={1}
              title={slug.replace(/-/g, " ")}
              year="feb 2026"
              medium="autonomous character"
              client="hammer studios"
              className="!gap-2"
            />
          </div>
        </aside>

        <section className="md:col-span-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--cinnamon)]">
            iv · roster wall
          </p>
          <h1 className="mt-6 font-display text-[clamp(48px,8vw,128px)] font-light lowercase leading-[0.88] tracking-[-0.04em] text-[var(--ink-0)]">
            {slug.replace(/-/g, " ")}
          </h1>
          <p className="mt-8 max-w-[44ch] font-display font-light text-[var(--fs-4)] leading-relaxed text-[var(--ink-1)]">
            placeholder character page. agent stack, posting cadence, latest posts, talk-to-character link land phase 7.
          </p>

          <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-3">
            {["bio", "stack", "cadence"].map((k) => (
              <div key={k} className="border-t border-[var(--ink-3)] pt-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">{k}</p>
                <p className="mt-3 font-display text-[var(--fs-4)] font-light leading-snug text-[var(--ink-0)]">
                  —
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="mt-32 flex items-center justify-between border-t border-[var(--ink-4)] pt-8">
        <Link href="/agents" data-cursor="link" className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)] underline decoration-[var(--ink-3)] underline-offset-4 hover:text-[var(--cinnamon)]">
          ← back to roster
        </Link>
        <Link href="/contact" data-cursor="link" className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-1)] hover:text-[var(--cinnamon)]">
          get in touch →
        </Link>
      </footer>
    </main>
  );
}
