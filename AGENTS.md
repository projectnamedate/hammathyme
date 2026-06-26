# AGENTS.md — hammer

This is Jeff Hammer's portfolio site. AI Producer positioning. The site itself
is a portfolio piece.

## Shared Obsidian AgentMemory

Hammer is ported to the shared vault at
`/Users/hammer/Obsidian/AgentMemory/Projects/hammer-ad/hammer-ad.md`. After
reading this file, read `/Users/hammer/Obsidian/AgentMemory/AGENTS.md` and the
Hammer project note before acting. Treat vault notes as durable cross-agent
memory, not a replacement for repo docs, project files, live site checks,
Vercel proof, or current repo state. At wrap-up, run the **end-session-sweep**
skill (Codex: `$end-session-sweep`) — it forces the vault session write and runs
the full per-project closeout: update the project note and append a dated
session summary. Never store secrets, env values, private credentials, provider
keys, or live tokens in the vault.

## Global Codex Defaults

- For underspecified coding tasks, normalize the request into goal, context,
  constraints, and done criteria before implementing. Infer from local docs and
  repo state when safe; ask only for blocking or high-risk ambiguity.
- Use `$codex-workflow-guardrails` for complex, ambiguous, multi-step,
  high-risk, live-runtime, repo-takeover, reusable-guidance, or
  verification-heavy work.
- Plan before editing when risk or ambiguity is real. For simple low-risk
  tasks, execute directly.
- Before finalizing code edits, run the most relevant validation available and
  inspect the diff. If validation cannot run, say exactly why.
- When a correction repeats, move it into the smallest durable surface:
  `AGENTS.md` for always-on behavior, a focused skill for repeatable workflows,
  MCP for changing external context, and automation only after the manual
  workflow is reliable.

## Source-of-truth files

Read these before changing the project:

- `AGENTS.md` — canonical agent instructions for this repo.
- `BRAND_GUIDE.md` — token contract. Color, type, motion, voice, banned words.
  Edit this first; mirror token changes into `app/globals.css` and any typed
  constants in the same change. Tailwind runs through the v4 CSS theme map, not
  a separate config file.
- `BRAND.html` — canonical visual reference. Open it to see how a section
  should feel.
- `RESEARCH.md` — May 2026 market refresh. Current model name-drops, hiring
  framing, awwwards refs.
- `hammer-startup-check` skill — resume audit workflow for roadmap, site drift,
  content state, and deploy truth. Codex reaches it via the repo symlink
  `.codex/skills/hammer-startup-check` →
  `~/.codex/skills.profiles/project/skills/hammer-startup-check/SKILL.md`; Claude
  Code uses the mirrored `check-hammer` skill. Both read the shared vault first.
- `~/.codex/memories/MEMORY.md` — prior decisions. Visual taste, kerning
  recipe, portfolio categories, voice rules, roadmap.

`SPEC.md` is a phase-1 planning document and is now historical. It still
references `/notes`, `/process`, `/lab`, and a top-level `/agents` route, none
of which exist. Trust `AGENTS.md` and the live code over `SPEC.md` for
architecture, IA, and route questions.

`CLAUDE.md` is a compatibility pointer for older Claude Code workflows. Do not
add new project rules there. Put durable guidance in `AGENTS.md`.

## Brand contract

- Brand name is always Hammer / `hammer`. Do not use the current or future
  domain as the public brand, case-study title, nav label, product name, or
  wordmark. Domains belong only in technical URL surfaces: canonical metadata,
  SEO, sitemap/robots, redirects, email/contact, and agent-readable docs where
  a real URL is needed.
- Light only. Warm cream `#FAEEE9` page, deep maroon ink ramp, vinaceous
  cinnamon `#F28E86` as the single live accent. No dark mode.
- Lowercase wordmark. The canonical `hammer.` recipe is a hybrid: Outfit Black
  lowercase `hammer` built with the Motion Reel cold-open per-letter
  construction and approved visual rhythm, plus the current website period
  placement as the approved controlled circular mark on the baseline. Avoid
  native-run substitutes, faux depth, fallback-looking shadows, mathematically
  equal ink-box spacing, or alternate title tracking that makes the `a` read
  like a different font.
- Dot system. The cinnamon dot is protected for `hammer.` and may appear as a
  controlled circular display punctuation motif on bold Outfit/Geist title
  lockups only. Do not attach it to Instrument Serif italic words, all-italic
  lines, metadata separators, repeated item labels, or bloodlust punctuation.
- Outfit Black for display. Geist for body. Geist Mono for captions/code.
  Instrument Serif italic only for the single-italic-word motif inside
  headlines.
- Sentence case body. Lowercase headings and chips. No ALL CAPS except mono
  captions where intentional.
- Banned words: unleash · harness · revolutionize · supercharge ·
  game-changing · next-level · leverage · synergy · cutting-edge · seamless ·
  robust · empower · disrupt · tap into · the power of AI.
- Sentence target: avg 12 words, hard cap 25.

## Motion budget

Every animation has a `prefers-reduced-motion` fallback. Easings:
`--ease-cinema`, `--ease-shutter`, `--ease-soft`, `--ease-spring`. Durations:
instant 100, quick 200, standard 400, slow 600, cinematic 1000ms.

## Phase gates

Each phase ships only after: >= 90 perf, >= 95 a11y, 100 best-practices, and
>= 95 SEO on Lighthouse mobile. Structured data validates in Google Rich
Results Test before Phase 8 closes. Reduced-motion is tested every phase that
adds animation.

## Agent-readable surfaces

Keep the site readable by crawlers and AI agents without requiring visual
interpretation. When routes, contact truth, or portfolio readiness changes,
update the canonical metadata/JSON-LD in `lib/seo.ts`, the sitemap/robots
surfaces, `public/llms.txt`, `public/llms-full.txt`, and
`public/.well-known/agents.json` in the same change.

`/llms.txt` is the short agent index. `/llms-full.txt` is the compact context
file. `/.well-known/agents.json` is the machine-readable route and crawl-policy
manifest. These complement standard HTML, JSON-LD, sitemap, and robots output;
they do not replace them.

## Cost guardrails

Live API demos go through `/api/*` routes with edge-middleware rate-limiting
and a `DAILY_API_BUDGET_USD` env-var hard cap. Demos auto-disable when the cap
is hit.

Interactive demo provider calls share a one-dollar daily cap. Required runtime
surface:

- `DAILY_API_BUDGET_USD=1` (values above 1 are clamped to 1 in code)
- Redis budget store: `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`
  (or Vercel KV-compatible `KV_REST_API_URL` + `KV_REST_API_TOKEN`)
- OpenRouter text/chat: `HAMMER_OPENROUTER_API_KEY` or
  `HAMMER_KIRA_WEB_CHAT_API_KEY`
- Fal consistency render: `HAMMER_FAL_KEY` + `HAMMER_KIRA_LORA_URL`
- `HAMMER_DEMOS_ENABLED=0` forces no-spend sample mode

If any paid-provider prerequisite is absent, the public demo stays usable in
sample mode and does not call the provider.

## Domain status

- Purchased canonical domain: `hammer.ad`.
- The public brand remains Hammer / `hammer`; do not use the domain as the
  brand, case-study title, nav label, product name, or wordmark.
- Domain surfaces are technical only: metadata/SEO, sitemap/robots, redirects,
  email/contact, Vercel domain config, and agent-readable URL docs such as
  `llms.txt`.
- Canonical redirect behavior lives in `proxy.ts`: `www.hammer.ad` and
  `hammathyme.vercel.app` redirect to `https://hammer.ad`.

## Rules of engagement

- Do not add features, refactors, or abstractions beyond what the task asks. A
  bug fix does not need surrounding cleanup.
- Do not write comments that restate what the code does. Only explain why for
  non-obvious constraints, workarounds, or invariants.
- Edit existing files; only create new ones when required.
- For public site changes, deploy to Vercel automatically after validation. Do
  not stop for approval unless Jeff explicitly asks for local-only or
  preview-only work.
- Vercel post-deploy: always PATCH project to clear `ssoProtection` per global
  rule.
- For SPA fetches: WebFetch first, Playwright fallback if content is empty or
  JS-rendered.

## Routes

```
/                    entry hall
/work                atrium: 8 category tiles
/work/[category]     category index: editorial header + pieces grid
/work/[category]/[piece]
                     detail view for ready pieces
/about               anteroom: bio, experience timeline, clients, education, memberships
/contact             vestibule: poster split layout, contact lines, status indicator
```

Top nav: `work · about` with `get in touch` CTA top-right. Home is reachable
via the wordmark; `/contact` via the CTA. Ready live pieces use detail pages at
`/work/[category]/[piece]`; in-production pieces keep hash placeholders until
the demo or case-study surface exists.

## Repo structure

```
/app                 routes (App Router)
/app/opengraph-image.tsx
/app/twitter-image.tsx
                     generated Hammer social-preview assets
/app/_fonts          subset Outfit/Geist/Geist Mono cuts for social image generation
/app/work/[slug]/[piece]
                     detail routes for ready pieces; modal-like page pattern
/components          UI: AtriumCanvas, CardArt, PipelineVisualizer, Plinth, etc.
/components/motion   FadeIn, MaskReveal, ScrollReveal, SplitText, StaggerChildren
/content/work        category-index MDX; one per category, slug matches lib/works.ts
/lib                 works.ts, pipelines.ts, rooms.ts, view-transitions.ts, seo.ts
/public/brand        compiled wordmark, icon, grain
/brand               source design assets
AGENTS.md            canonical agent instructions
CLAUDE.md            compatibility pointer only
BRAND_GUIDE.md       token contract
BRAND.html           visual reference
RESEARCH.md          market refresh
SPEC.md              historical phase-1 spec
```

## Capability taxonomy

8 categories, each with a slug that matches the URL and the popup title:

1. brand-systems
2. agents
3. motion-graphics
4. animation
5. pipelines-tools
6. interactive-playable
7. visual-media
8. websites

Internal capability tag for category 2 is `autonomous-characters`; it drives
CardArt specimens, but the slug, label, and popup title are all `agents`.

The site is visual-only. `/notes` was dropped 2026-05-04 because Jeff is a
visual AI producer. `/process` was dropped 2026-05-08 because every project is
different. `/lab` was dropped 2026-05-08 because it overlapped the
`pipelines-tools` category. SEO is carried by case-study copy, `/about`
metadata, and structured data, not a blog.

Each category is a collection with multiple pieces inside. The category page is
an editorial portfolio index only: header, plinth grid, footer. Long demos and
case-study surfaces live behind detail pages. Current ready detail routes are:
`/work/motion-graphics/{reel,internet-capital-markets,audio-reactive-overlays}`,
`/work/pipelines-tools/{pipeline-visualizer,prompt-library,creative-skills}`,
`/work/agents/kira`, `/work/interactive-playable/{prompt-to-storyboard,consistency-lab,talk-to-character,dot-discipline}`,
`/work/websites/{hammer,kira,opencrawl,agentify}`, and
`/work/brand-systems/{hammer,kira,effigy,agentify}`.

Portfolio artifact rule: most finished artifacts live inside Hammer as the
portfolio illustration itself, including videos, brand guides, brand books, and
pipeline visuals. Brand-system pages show a Hammer summary first, then link to
the standalone guide artifact instead of embedding the full guide. Website
pieces are the exception: Hammer shows a summary and preview first, then links
out to the live public site.

Category piece cards use `components/PieceArt.tsx` for Hammer-native SVG plates
while case studies are still in production. Keep these plates on the Hammer
token system.
