# AGENTS.md — hammer

This is Jeff Hammer's portfolio site. Creative Technologist positioning. The site itself
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
- `docs/AGENT_HANDOFF.md` — current short handoff for the next Hammer agent.
  Read it after the startup-check/vault pass and before changing active work.
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

Live API demos go through `/api/*` routes. Per-visitor limits are a Vercel
Firewall rate-limit rule ("storyboard per ip": `POST /api/demos/storyboard`,
2 requests per IP per 10 minutes, 429 past that), so blocked requests never
reach the function. There is no daily dollar cap (Jeff, 2026-10-17); Redis was
removed. Hobby allows one rate-limit rule per project. Manage it with
`npx vercel firewall rules list|inspect|edit`.

Required runtime surface:

- Evolink storyboard render (GPT Image 2.5 Sunburst, colour pencil):
  `EVOLINK_API_KEY`, server-side only
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
- Media (video, audio, images) may always be committed and pushed in this
  repo (operator rule 2026-10-11), overriding the global no-media rule. Git
  push is the deploy path; `.gitignore` un-ignores `public/` media
  (mp4, webm, mp3, m4a, jpg, png, webp, gif). Add a `!public/**/*.<ext>` line
  for any new media type; the global ignore blocks it otherwise, and the file
  404s live without an error. Check with `git check-ignore -v <file>`.
- Global element resets in `app/globals.css` (`button`, `a`, …) go inside
  `@layer base`. Unlayered CSS beats every Tailwind v4 utility, so a bare
  `button { background: none; border: 0 }` silently strips buttons' own
  `bg-*`/`border` classes (found 2026-10-17 on the splat and game buttons).
- The Artlist × Sony pitch is permanently do-not-publish (operator rule
  2026-09-10). Do not surface it in any page, asset, metadata, or
  agent-readable file.
- Do not put current-employer information on any public site surface
  (operator rule 2026-09-10). The about page, metadata, JSON-LD, and
  agent-readable files carry role and craft only, never an employer name.

## Routes

```
/                    entry hall
/work                atrium: 7 category tiles
/work/[category]     category index: editorial header + pieces grid
/work/[category]/[piece]
                     detail view for ready pieces
/about               anteroom: bio, currently, selected clients, agencies (no resume: employer timeline, education, and memberships were removed 2026-07-16)
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
/content/work        _backlog.md only; category content lives in lib/works.ts
/lib                 works.ts, pipelines.ts, view-transitions.ts, seo.ts
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

7 categories, in atrium order, each with a slug that matches the URL and the
popup title:

1. film-animation
2. vfx-cgi
3. interactive-playable
4. motion-graphics
5. brand-systems
6. websites
7. pipelines-tools

The order of `CASE_STUDIES` in `lib/works.ts` is the atrium order. The
`agents-digital-twins` category was removed 2026-10-11 (its routes 308 to
`/work`); Kira survives only as the brand-systems and websites pieces.
Internal capability tag for film-animation is `visual-media`; it drives the
CardArt specimen.

The site is visual-only. `/notes` was dropped 2026-05-04 because Jeff is a
visual creative technologist. `/process` was dropped 2026-05-08 because every project is
different. `/lab` was dropped 2026-05-08 because it overlapped the
`pipelines-tools` category. SEO is carried by case-study copy, `/about`
metadata, and structured data, not a blog.

Each category is a collection with multiple pieces inside. The category page is
an editorial portfolio index only: header, plinth grid, footer. Long demos and
case-study surfaces live behind detail pages. Current ready detail routes are:
`/work/film-animation/{equinox,the-gunfight,code-animation}`,
`/work/vfx-cgi/{bioluminescent-bay,portal-worlds,neural-set-capture,humpback-ar,environment-swap}`,
`/work/interactive-playable/{sushi-scramble,35mm-projector,slopocalypse,car-wash,prompt-to-storyboard}`,
`/work/motion-graphics/{chrome-hammer,internet-capital-markets,reel,spring-health,spotify-titles}`,
`/work/pipelines-tools/{pipeline-visualizer,creative-skills,qc-by-measurement}`,
`/work/websites/{hammer,kira,agentify,coefficient}`, and
`/work/brand-systems/{hammer,kira,agentify}`.

Portfolio artifact rule: most finished artifacts live inside Hammer as the
portfolio illustration itself, including videos, brand guides, brand books, and
pipeline visuals. Brand-system pages show a Hammer summary first, then link to
the standalone guide artifact instead of embedding the full guide. Website
pieces are the exception: Hammer shows a summary and preview first, then links
out to the live public site.

Category piece cards use `components/PieceArt.tsx` for flat SVG plates. Each
plate wears its own piece's colours, sampled from its poster, build or live
site (Jeff, 2026-10-30); only `brand-systems/hammer` and `websites/hammer` stay
on the Hammer cream + cinnamon. Set the plate's `frame` and `MonoLabel` fill
from the same palette (label at least 4.5:1 against the plate), and set the
piece's `tint` in `lib/works.ts` to the plate background.

When a piece moves category, its route moves but its asset folder can stay:
compiled builds such as `public/work/interactive-playable/portal-worlds/`
hardcode their own path. Add a 308 from the old route. `public/work/**` is
excluded from eslint because it holds compiled game builds.
