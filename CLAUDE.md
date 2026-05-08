# CLAUDE.md — hammer (hammathyme)

This is Jeff Hammer's portfolio site. AI Producer positioning. The site itself is a portfolio piece.

## Source-of-truth files (read before any work)

- `BRAND_GUIDE.md` — token contract. Color, type, motion, voice, banned words. **Edit this first; mirror into `app/globals.css` and `tailwind.config.ts` in the same change.**
- `BRAND.html` — canonical visual reference. Open it to see how a section should *feel*.
- `SPEC.md` — IA, content plan, page-by-page copy direction, phase gates.
- `RESEARCH.md` — May 2026 market refresh. Use for current model name-drops, hiring framing, awwwards refs.
- `~/.claude/projects/-Users-hammer-Desktop-Claude-aiprod/memory/` — auto-memory. Visual taste, kerning recipe, portfolio categories.

## Brand contract (non-negotiable)

- **Light only.** Warm cream `#FAEEE9` page, deep maroon ink ramp, vinaceous cinnamon `#F28E86` as the single live accent. No dark mode.
- **Lowercase wordmark.** Always render `hammer.` via the `.kw` class with per-letter spans. The cinnamon period is the brand mark.
- **Outfit Black for display.** Geist for body. Geist Mono for captions/code. Instrument Serif **italic only** for the single-italic-word motif inside headlines.
- **Sentence case body.** Lowercase headings and chips. No ALL CAPS except mono captions where intentional.
- **Banned words (CI-enforce):** unleash · harness · revolutionize · supercharge · game-changing · next-level · leverage · synergy · cutting-edge · seamless · robust · empower · disrupt · tap into · the power of AI.
- **Sentence target:** avg 12 words, hard cap 25.

## Motion budget

Every animation has a `prefers-reduced-motion` fallback. Easings: `--ease-cinema`, `--ease-shutter`, `--ease-soft`, `--ease-spring`. Durations: instant 100, quick 200, standard 400, slow 600, cinematic 1000ms.

## Phase gates (Lighthouse mobile)

Each phase ships only after: ≥ 90 perf · ≥ 95 a11y · 100 best-practices · ≥ 95 SEO. Structured data validates in Google Rich Results Test before Phase 8 closes. Reduced-motion tested every phase that adds animation.

## Cost guardrails

Live API demos go through `/api/*` routes with edge-middleware rate-limiting and a `DAILY_API_BUDGET_USD` env-var hard cap. Demos auto-disable when cap hit.

## Rules of engagement for Claude

- Don't add features, refactors, or abstractions beyond what the task asks. A bug fix doesn't need surrounding cleanup.
- Don't write comments that restate WHAT the code does. Only WHY (non-obvious constraints, workarounds, invariants).
- Edit existing files; only create new ones when required.
- Time estimates: divide by 10 vs. instinct. "1 day" usually means under an hour.
- Vercel post-deploy: always PATCH project to clear `ssoProtection` per global rule.
- For SPA fetches: WebFetch first, Playwright fallback if content is empty/JS-rendered.

## Repo structure

```
/app                 routes (App Router)
/components          UI (PascalCase)
/components/motion   <FadeIn>, <ScrollReveal>, <Shutter>, <SplitText>, etc.
/components/lab      live-demo components
/content/work        case-study MDX
/content/agents      character MDX
/content/notes       essay MDX
/lib                 anthropic, fal, seo, rate-limit helpers
/public/brand        compiled wordmark, icon, grain, og template
/brand               source design assets (kept for design reference, not built)
BRAND_GUIDE.md       token contract
BRAND.html           visual reference
SPEC.md              IA + content plan
RESEARCH.md          market refresh
```

## Capability taxonomy (filter chips on /work)

1. autonomous-characters · 2. motion-graphics · 3. animation · 4. pipelines-tools ·
5. interactive-playable · 6. brand-systems · 7. visual-media.

**The site is visual-only.** /notes was dropped 2026-05-04 — Jeff explicitly
rejected having a blog because (a) AI-written content is a 2026 anti-signal in
visual circles and (b) "i am a visual ai producer." No `editorial-writing`
capability. SEO carried by case-study approach blocks + /about
metadata + structured data, not a blog.

Tag every case study with one or more capability slug. See
`memory/project_portfolio_categories.md` for backlog.
