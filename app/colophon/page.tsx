import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { buildBreadcrumbJsonLd, colophonMetadata } from "@/lib/seo";

export const metadata = colophonMetadata;

const SHA = (process.env.VERCEL_GIT_COMMIT_SHA ?? "").slice(0, 7) || "dev";
const BUILD_DATE = process.env.VERCEL_GIT_COMMIT_AUTHOR_DATE ?? "";

export default function Colophon() {
  return (
    <main className="relative min-h-[100svh] w-screen px-6 pt-32 pb-16 md:px-24 md:pt-40 md:pb-24">
      <JsonLd
        jsonLd={buildBreadcrumbJsonLd([
          { name: "home", path: "/" },
          { name: "colophon", path: "/colophon" },
        ])}
      />
      <header className="mb-20 grid grid-cols-1 gap-10 md:mb-32 md:grid-cols-12 md:gap-x-12">
        <div className="md:col-span-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--cinnamon)]">
            back of book
          </p>
          <MaskReveal direction="up" delay={0.3}>
            <h1 className="mt-6 font-display text-[clamp(56px,11vw,200px)] font-light lowercase leading-[0.86] tracking-[-0.04em] text-[var(--ink-0)]">
              <em className="font-serif italic font-normal text-[var(--bloodlust)]">colophon</em>
              <span aria-hidden>.</span>
            </h1>
          </MaskReveal>
        </div>
        <aside className="flex items-end md:col-span-4">
          <p className="max-w-[40ch] font-display font-light text-[clamp(18px,1.5vw,22px)] leading-[1.5] tracking-[-0.015em] text-[var(--ink-1)]">
            the back-of-book. typefaces, models, hosting, license. nothing
            hidden — every tool that touched this site, listed below.
          </p>
        </aside>
      </header>

      <section className="grid grid-cols-1 gap-y-16 gap-x-12 md:grid-cols-12 md:gap-y-24">
        <Field label="typefaces" col={6}>
          <Line k="loading" v="next/font · self-hosted latin subsets" />
          <Line k="display" v="outfit · 200–900" />
          <Line k="body" v="geist · 300 / 400 / 500 / 600" />
          <Line k="mono" v="geist mono · 400 / 500" />
          <Line k="accent" v="instrument serif · italic only" />
        </Field>

        <Field label="engineering" col={6}>
          <Line k="framework" v="next.js 16 · app router · turbopack" />
          <Line k="ui" v="react 19 · tailwind v4 · motion / react" />
          <Line k="transitions" v="native view transitions api" />
          <Line k="hosting" v="vercel · cloudflare ssl" />
        </Field>

        <Field label="this site authored with" col={6}>
          <Line k="agent" v="claude code · cli" />
          <Line k="model" v="claude opus 4.7 · gpt-5.5 / codex" />
          <Line k="copy" v="jeff, with the model as editor" />
          <Line k="images" v="hand-drawn svg specimens · no genai stills" />
        </Field>

        <Field label="production stack" col={6}>
          <Line k="orchestration" v="hermes agent · nous research" />
          <Line k="stills" v="nano banana 2 · midjourney v7" />
          <Line k="video" v="kling 3.0" />
          <Line k="composition" v="remotion · hyperframes" />
        </Field>

        <Field label="interactive demos" col={6}>
          <Line k="text" v="openrouter · deepseek v4 flash" />
          <Line k="image" v="fal storyboard sheets · flux 2 lora Kira consistency" />
          <Line k="budget" v="upstash redis · $1 shared daily cap" />
          <Line k="fallback" v="public sample mode when capped or unconfigured" />
        </Field>

        <Field label="brand contract" col={6}>
          <Line k="palette" v="warm cream · maroon ink · vinaceous cinnamon" />
          <Line k="motif" v="protected wordmark period · governed display dot" />
          <Line k="motion" v="every animation has a reduced-motion fallback" />
          <Line k="voice" v="sentence-case body · italic only on one word" />
        </Field>

        <Field label="repo" col={6}>
          <a
            href="https://github.com/projectnamedate/hammathyme"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="link"
            data-cursor-label="open →"
            className="inline-flex items-baseline gap-3 font-display text-[clamp(18px,1.4vw,22px)] font-light lowercase tracking-[-0.02em] text-[var(--ink-0)] underline decoration-[var(--ink-3)] underline-offset-8 hover:text-[var(--cinnamon)]"
          >
            github.com / projectnamedate / hammathyme
          </a>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-3)]">
            commit · {SHA}
            {BUILD_DATE ? <> · {new Date(BUILD_DATE).toISOString().slice(0, 10)}</> : null}
          </p>
        </Field>

        <Field label="license" col={6}>
          <Line k="code" v="mit" />
          <Line k="words" v="© jeff hammer · 2026" />
          <Line k="images" v="all rights reserved" />
        </Field>
      </section>

      <footer className="mt-24 flex items-center justify-between border-t border-[var(--ink-4)] pt-8 md:mt-32">
        <Link
          href="/"
          data-cursor="link"
          className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)] underline decoration-[var(--ink-3)] underline-offset-4 hover:text-[var(--cinnamon)]"
        >
          ← entry hall
        </Link>
        <a
          href="/llms.txt"
          data-cursor="link"
          className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)] underline decoration-[var(--ink-3)] underline-offset-4 hover:text-[var(--cinnamon)]"
        >
          /llms.txt →
        </a>
      </footer>
    </main>
  );
}

function Field({
  label,
  col,
  children,
}: {
  label: string;
  col: number;
  children: React.ReactNode;
}) {
  return (
    <div className={col === 6 ? "md:col-span-6" : "md:col-span-12"}>
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">
        {label}
      </p>
      <div className="mt-5 flex flex-col gap-3 border-l border-[var(--ink-4)] pl-6">
        {children}
      </div>
    </div>
  );
}

function Line({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="min-w-[5rem] font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-3)]">
        {k}
      </span>
      <span aria-hidden className="block h-px flex-1 bg-[var(--ink-4)]" />
      <span className="font-display text-[clamp(15px,1.1vw,18px)] font-light lowercase tracking-[-0.015em] text-[var(--ink-0)]">
        {v}
      </span>
    </div>
  );
}
