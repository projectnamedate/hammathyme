import Link from "next/link";

export const metadata = { title: "contact" };

export default function Vestibule() {
  return (
    <main className="relative flex min-h-[100svh] w-screen flex-col justify-center px-6 pt-32 pb-24 md:px-24 md:pt-40">
      <div className="max-w-[64ch]">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--cinnamon)]">
          viii · vestibule
        </p>
        <h1 className="mt-6 font-display text-[clamp(64px,12vw,200px)] font-light lowercase leading-[0.88] tracking-[-0.05em] text-[var(--ink-0)]">
          we should <em className="font-serif italic font-normal text-[var(--bloodlust)]">talk</em>.
        </h1>
        <p className="mt-12 max-w-[44ch] font-display font-light text-[clamp(20px,2vw,24px)] leading-[1.5] tracking-[-0.015em] text-[var(--ink-1)]">
          hiring, consulting, freelance, brand work, ai pipelines for broadcast — the room is open.
        </p>
      </div>

      {/* contact lines */}
      <div className="mt-24 grid grid-cols-1 gap-8 md:max-w-[60ch] md:grid-cols-2">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">email</p>
          <a
            href="mailto:hello@hammathyme.ai"
            data-cursor="link"
            data-cursor-label="copy →"
            className="mt-3 inline-block font-display text-[var(--fs-5)] font-light lowercase tracking-[-0.02em] text-[var(--ink-0)] underline decoration-[var(--ink-3)] underline-offset-8 transition-colors hover:text-[var(--cinnamon)]"
          >
            hello@hammathyme.ai
          </a>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">based</p>
          <p className="mt-3 font-display text-[var(--fs-5)] font-light lowercase tracking-[-0.02em] text-[var(--ink-0)]">
            new york · remote-friendly
          </p>
        </div>
      </div>

      <footer className="mt-32 flex items-center justify-between border-t border-[var(--ink-4)] pt-8">
        <Link href="/" data-cursor="link" className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)] underline decoration-[var(--ink-3)] underline-offset-4 hover:text-[var(--cinnamon)]">
          ← entry hall
        </Link>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-3)]">viii / viii</span>
      </footer>
    </main>
  );
}
