# CLAUDE.md — hammer (hammathyme)

This is Jeff Hammer's portfolio site. AI Producer positioning. The site itself is a portfolio piece.

## Source-of-truth files (read before any work)

- `BRAND_GUIDE.md` — token contract. Color, type, motion, voice, banned words. **Edit this first; mirror into `app/globals.css` and `tailwind.config.ts` in the same change.**
- `BRAND.html` — canonical visual reference. Open it to see how a section should *feel*.
- `RESEARCH.md` — May 2026 market refresh. Current model name-drops, hiring framing, awwwards refs.
- `~/.claude/projects/-Users-hammer-Desktop-Claude-aiprod/memory/` — auto-memory. Visual taste, kerning recipe, portfolio categories, voice rules, roadmap.

> **Note:** `SPEC.md` is a phase-1 planning document and is now historical. It still references `/notes`, `/process`, `/lab`, and a top-level `/agents` route — none of which exist. Trust this CLAUDE.md and the live code over SPEC.md for architecture / IA / route questions.

## Brand contract (non-negotiable)

- **Light only.** Warm cream `#FAEEE9` page, deep maroon ink ramp, vinaceous cinnamon `#F28E86` as the single live accent. No dark mode.
- **Lowercase wordmark.** The canonical `hammer.` visual reference is Motion Reel `01 — cold open` and the fixed Remotion `15 — signature`: Outfit Black lowercase `hammer` built with the cold-open per-letter kerning recipe, plus the cinnamon period as a controlled circular mark on the baseline. Avoid native-run substitutes, faux depth, fallback-looking shadows, or alternate title tracking that makes the `a` read like a different font.
- **Dot system.** The cinnamon dot is protected for `hammer.` and may appear as a controlled circular display punctuation motif on bold Outfit/Geist title lockups only. Do not attach it to Instrument Serif italic words, all-italic lines, metadata separators, repeated item labels, or bloodlust punctuation.
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

## Launch TODOs

- Search for a short portfolio domain. Preferred direction is something as direct
  as `hammer.ai` or `hammer.dev`, but those appear taken; find similarly short,
  memorable alternatives before final launch wiring.

## Rules of engagement for Claude

- Don't add features, refactors, or abstractions beyond what the task asks. A bug fix doesn't need surrounding cleanup.
- Don't write comments that restate WHAT the code does. Only WHY (non-obvious constraints, workarounds, invariants).
- Edit existing files; only create new ones when required.
- Time estimates: divide by 10 vs. instinct. "1 day" usually means under an hour.
- Vercel post-deploy: always PATCH project to clear `ssoProtection` per global rule.
- For SPA fetches: WebFetch first, Playwright fallback if content is empty/JS-rendered.

## Routes

```
/                    entry hall
/work                atrium — 8 category tiles (Swiss wall, fixed; mobile = vertical snap)
/work/[category]     category index — editorial header + pieces grid
/about               anteroom — bio, experience timeline, clients, education, memberships
/contact             vestibule — poster split layout, contact lines, status indicator
```

Top nav: `work · about` (with `get in touch` CTA top-right). Home is reachable
via the wordmark; /contact via the CTA. Per-piece case studies (`/work/[category]/[piece]`)
are not yet built; live pieces link to `#anchor` placeholders for now.

## Repo structure

```
/app                 routes (App Router)
/components          UI (PascalCase) — AtriumCanvas, CardArt, PipelineVisualizer, Plinth, etc.
/components/motion   FadeIn, MaskReveal, ScrollReveal, SplitText, StaggerChildren
/content/work        category-index MDX (one per category, slug matches lib/works.ts)
/lib                 works.ts (case studies + pieces), pipelines.ts (visualizer data),
                     rooms.ts, view-transitions.ts, etc.
/public/brand        compiled wordmark, icon, grain, og template
/brand               source design assets
BRAND_GUIDE.md       token contract
BRAND.html           visual reference
RESEARCH.md          market refresh
SPEC.md              historical phase-1 spec (do not trust for live architecture)
```

## Capability taxonomy (filter chips on /work)

8 categories, each with a slug that matches the URL and the popup title:

1. brand-systems · 2. agents · 3. motion-graphics · 4. animation ·
5. pipelines-tools · 6. interactive-playable · 7. visual-media · 8. websites.

(Internal capability tag for category 2 is `autonomous-characters` — drives
CardArt SPECIMENS — but the slug, label, and popup title are all `agents`.)

**The site is visual-only.** /notes was dropped 2026-05-04 (Jeff: "i am a visual
ai producer"); /process was dropped 2026-05-08 ("every project is different");
/lab was dropped 2026-05-08 (overlapped pipelines-tools). SEO carried by
case-study copy + /about metadata + structured data, not a blog.

Each category is a *collection* — multiple pieces inside. The category page is
an editorial portfolio index; live pieces will eventually link to per-piece
case-study pages at `/work/[category]/[piece]`.
