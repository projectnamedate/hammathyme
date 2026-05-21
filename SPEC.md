# HAMMER — AI Producer Portfolio & Showcase

> **⚠️ HISTORICAL DOCUMENT — DO NOT TRUST FOR LIVE ARCHITECTURE**
>
> This is the phase-1 planning spec. The site has since diverged in ways this
> doc does NOT reflect:
>
> - `/notes` was dropped 2026-05-04 (no blog, visual-only)
> - `/process` was dropped 2026-05-08 (canned waterfall didn't match reality)
> - `/lab` was dropped 2026-05-08 (overlapped /work pipelines-tools category)
> - top-level `/agents` was collapsed into `/work/agents` 2026-05-09
> - Capability taxonomy is now 8 (added `websites`); see `AGENTS.md`
> - Slugs match titles (e.g. `/work/brand-systems`, not `/work/hammer-brand-build`)
>
> **For live architecture, taxonomy, and routes, read `AGENTS.md` and the
> code itself.** This doc is kept for context on early decisions only.

**Brand:** Hammer
**Owner:** Jeff Hammer ([linkedin.com/in/jeff-hammer1985](https://www.linkedin.com/in/jeff-hammer1985/))
**Spec version:** 2.0 (phase-1 planning, archived)
**Target handoff:** Claude Code (primary) / Codex (secondary)
**Date:** May 2026

---

## 0. How to use this spec

This document is the single source of truth for an autonomous coding agent (Claude Code or Codex) building this site. Read top-to-bottom, then execute Phase by Phase. Each phase has gates — do not proceed past a gate without verification.

**Critical:** Phase 0 is the **Brand Guide**, not code. The agent must produce and get approval on a complete brand guide artifact before writing a single component. The brand guide is the persistent design contract every subsequent phase compiles against.

**Recommended agent invocation pattern (Claude Code):**

```
/model opusplan          # Opus plans, Sonnet implements
# Drop SPEC.md, AGENTS.md, and BRAND_GUIDE.md (once created) in repo root, then:
"Read SPEC.md. Enter plan mode. We start with Phase 0: produce the BRAND_GUIDE.md
artifact per §5. Do not write any application code until the brand guide is approved."
```

**Codex equivalent:** Open in a new workspace, attach this spec as system context, and use Plan → Apply with the same Phase 0 gating.

---

## 1. Strategic context

Jeff is moving from traditional video production (Discovery, Turner, Comcast — 15+ years) into the explosively growing AI Producer space. Hiring managers at Amazon, agencies, and AI-native companies, plus freelance/consulting clients, are all hunting for the same profile: **a filmmaker who treats AI like a crew, not a magic button.**

This site has **four equally weighted purposes**, and every page must serve all four:

1. **Convert hiring managers** for full-time AI Producer / AI Creative Producer / AI Video Producer roles
2. **Convert freelance & consulting leads** for studios, brands, agencies, startups
3. **Establish the Hammer personal brand** in the AI creative space — make Jeff a known name
4. **Function as a living lab** that demonstrates Jeff's AI content-creation range — the site itself is portfolio

The site is named "Hammer." The visual brief is **editorial / cinematic — dark, moody, film-studio energy.** Think A24, Daniel Wolfe directors' reels, Stink Studios, ManvsMachine, Pentagram's darker work. Production-house gravitas with selective AI/tech cues. **Animation quality must be Awwwards Site-of-the-Day caliber** — this is non-negotiable.

---

## 2. What the research says hiring managers and clients want

Synthesized from current AI Producer / AI Creative Producer / AI Video Producer / AI Content Creator listings at Amazon (AWS Training & Certification), agency boards, Cassidy, Curious Refuge, Upwork, and Virtual Vocations (Feb–Apr 2026):

**Universal requirements appearing in nearly every listing:**
- Traditional production fundamentals (shots, framing, lighting, story) — bar is "filmmaker who happens to use AI"
- Adobe Premiere / After Effects fluency
- Multi-model AI video orchestration (Veo 3.1, Kling 3.0, Runway Gen-4.5, Seedance 2.0)
- Image generation art direction (Midjourney, Nano Banana 2, Flux, ControlNet)
- Prompt engineering at the **system** level — prompt libraries, structured blueprints, version logs
- Iteration efficiency — knowing when to fix in post vs re-prompt vs regenerate
- Brand-consistent character/identity across generations
- Workflow design — the producer/orchestrator angle, not just the artist angle
- Performance metrics — scrap rate, first-pass usable %, turnaround time

**Differentiators where Jeff already has unique edge:**
- Autonomous AI characters running their own socials (Hermes agent + LLM stack — almost nobody else is shipping this end-to-end)
- 3D / Blender alongside generative AI
- Interactive web experiences
- 15+ years at Tier 1 broadcast networks — production discipline at scale that AI-native juniors simply don't have

**The site must broadcast all of these in the first 10 seconds and prove every one across the rest of the experience.**

---

## 3. SEO strategy (built-in from day one)

SEO is a first-class concern. The agent treats this as core architecture, not a launch checklist.

### 3.1 Primary target keywords

Tier 1 — must rank top 10:
- `AI Producer`
- `AI Creative Producer`
- `AI Video Producer`
- `Jeff Hammer`
- `Hammer AI Producer`

Tier 2 — must rank top 30:
- `Hire AI Producer`
- `AI Producer freelance`
- `Autonomous AI characters`
- `AI character producer`
- `AI video pipeline producer`
- `AI Content Producer for hire`
- `AI Producer portfolio`

Tier 3 — long-tail content targets (each gets its own MDX article in `/content/notes`):
- `How to produce video with AI`
- `Veo 3.1 vs Kling 3.0 vs Runway for [use case]`
- `How to build an autonomous AI character`
- `AI video pipeline workflow`
- `From video producer to AI producer career change`
- `What does an AI Producer actually do`

### 3.2 SEO architecture requirements

The agent must implement, not just plan:

- **Server-rendered Next.js App Router** — never SPA-only; every page returns full HTML to crawlers
- **Per-page metadata** via Next `generateMetadata` — title, description, Open Graph, Twitter Card, canonical URL
- **JSON-LD structured data** on every page:
  - `Person` schema on home and `/about` (with `jobTitle: "AI Producer"`, `knowsAbout: [...]`)
  - `CreativeWork` schema on every case study
  - `WebSite` schema with `SearchAction` and sitelinks search box
  - `BreadcrumbList` on nested pages
  - `VideoObject` for every embedded video (with `thumbnailUrl`, `uploadDate`, `description`)
  - `BlogPosting` for every `/notes/*` article
- **Auto-generated `sitemap.xml`** with `lastmod` dates and priority weighting (home > work > notes > legal)
- **`robots.txt`** that explicitly allows `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `CCBot`. Jeff *wants* to show up in AI search — this is non-negotiable.
- **Open Graph images** auto-generated per page via `next/og` from a templated React component (cinematic dark template with the page title in serif)
- **`og:type` correct per page** (`profile` for /about, `article` for notes, `website` default)
- **Heading hierarchy** strict — exactly one `<h1>` per page, with the primary keyword for that page
- **Internal linking** — every page links to at least 3 others; case studies cross-link by capability tag; notes link to relevant case studies
- **Image alt text** mandatory and descriptive on every `<Image>` (no "image of...", no decorative AI fluff)
- **Semantic HTML** — `<article>`, `<section>`, `<nav>`, `<aside>` used correctly
- **Performance as ranking signal** — see Phase 6 perf budget; agent gates each phase on Lighthouse pass
- **Hreflang ready** even if launching English-only (clean architecture for future)
- **Clean URL slugs** — kebab-case, no IDs, no query params for canonical content
- **404 page** that's actually useful (suggested links, search box) — improves crawl signals

### 3.3 Content SEO plan

The site ships with these long-form indexable assets at launch (in addition to case studies):
1. `/notes/from-broadcast-to-ai-producer` — Jeff's career arc, naturally hits "video producer to AI producer" search intent
2. `/notes/what-an-ai-producer-actually-does` — definitional piece, hits "what is an AI producer"
3. `/notes/the-autonomous-character-stack` — technical write-up, hits "autonomous AI character" intent
4. `/notes/ai-video-model-comparison-2026` — Veo/Kling/Runway head-to-head with Jeff's actual test results
5. `/notes/ai-video-pipeline-workflow` — the orchestration playbook

Each note is 1,200–2,500 words, original, with embedded video examples and pull-quote schema markup.

Post-launch, target one new note per 2 weeks. Topics tracked in `/content/notes/_backlog.md`.

### 3.4 Off-page SEO

The agent doesn't do this work but the site is built to support:
- Author bio block at the bottom of every note (re-used as guest-post bio)
- Easy "Save this to LinkedIn" share buttons (Jeff posts these to drive backlinks)
- An RSS feed at `/feed.xml` for the notes
- An RSS feed at `/agents/feed.xml` for the autonomous-character outputs (gets picked up by AI/creator newsletters)

---

## 4. Information architecture

```
/                       Hero + manifesto + capability strip + featured work
/work                   Case-study grid (filterable by capability)
/work/[slug]            Individual case study (long-form, video-heavy)
/lab                    Live experiments + interactive demos
/lab/[slug]             Individual experiment page
/agents                 The autonomous AI characters showcase
/agents/[slug]          Individual character page (with live feed if possible)
/process                How Hammer produces with AI (the orchestration angle)
/notes                  Long-form articles (SEO-driven content marketing)
/notes/[slug]           Individual article
/about                  Bio + experience timeline + résumé download
/contact                Hire / collaborate / chat
/feed.xml               Notes RSS
/sitemap.xml            Auto-generated
/robots.txt             AI-crawler-friendly
```

**Global elements:**
- Sticky minimal nav (Hammer wordmark left, 5 links right [Work, Lab, Agents, Notes, About], "Get in touch" CTA far right)
- Custom cursor (subtle, cinematic — small light dot with trailing motion blur on hover; respects `prefers-reduced-motion`)
- Page transitions: cross-fade with a brief "shutter" effect (8–12 frames, like a cinema curtain) — disabled for users with reduced-motion preference
- Background: deep near-black (`#0A0A0B`) with film-grain noise overlay (animated, subtle, GPU-cheap)
- Audio: optional ambient drone toggle in nav corner (off by default, never autoplays)
- Search: `cmd+K` palette opens global search across notes + work + lab (Pagefind or similar static-site search)

---

## 5. Phase 0: Brand Guide (mandatory before any code)

This is the agent's first deliverable and a hard gate. The agent produces `BRAND_GUIDE.md` (and supporting assets) and Jeff approves before Phase 1 begins.

### 5.1 What the brand guide must contain

```
BRAND_GUIDE.md
├── 1. Brand essence
│   ├── Mission (one sentence)
│   ├── Voice (5 adjectives + 3 voice rules)
│   ├── Tagline options (3 candidates)
│   └── Elevator pitch (50 words)
├── 2. Logo / wordmark
│   ├── Primary wordmark (SVG)
│   ├── Mark-only icon (SVG, for favicon/social)
│   ├── Usage rules (clear space, min size, what not to do)
│   └── Light/dark variants
├── 3. Color system
│   ├── Primary palette with hex/rgb/oklch values
│   ├── Surface scale (5 steps from bg to elevated)
│   ├── Accent colors with usage rules ("max 1 element per fold")
│   ├── Semantic colors (success/error/info — even if rarely used)
│   └── Contrast verification table (WCAG AA/AAA pass results)
├── 4. Typography
│   ├── Display font with rationale + fallback chain
│   ├── Body font with rationale + fallback chain
│   ├── Mono font
│   ├── Type scale (1.25 modular, 9 steps)
│   ├── Heading rules (italic motif, line-height per size)
│   └── Link styling (default, hover, visited, focus)
├── 5. Motion language
│   ├── Easing curves (named, 4 total)
│   ├── Duration scale (instant/quick/standard/slow/cinematic)
│   ├── Animation primitives (FadeIn, StaggerChildren, ScrollReveal, Shutter, Marquee)
│   ├── Motion principles (5 rules — "earn every animation," etc.)
│   └── Reduced-motion fallbacks for every primitive
├── 6. Imagery & video direction
│   ├── Color grade reference (LUT or descriptive)
│   ├── Aspect ratio policy (2.39:1 hero, 16:9 case study, 9:16 vertical)
│   ├── Letterboxing rules
│   ├── Film-grain overlay specs
│   └── Do/don't reference grid (10 examples)
├── 7. Component design tokens
│   ├── Spacing scale (4/8/12/16/24/32/48/64/96/128)
│   ├── Border radius scale (0/2/4/8/16, default = 2)
│   ├── Shadow elevation (5 levels)
│   ├── Border weights (1px hairline default; accent uses 2px)
│   └── Z-index scale (named layers)
├── 8. Voice & copy guidelines
│   ├── Banned words list ("unleash", "harness", "revolutionize", "supercharge",
│   │   "game-changing", "next-level", "leverage", "synergy", any em-dash overuse)
│   ├── Sentence length target (avg 12 words, max 25)
│   ├── Number formatting rules
│   ├── Capitalization rules (sentence case for UI, title case for headings)
│   └── 5 sample headlines + 5 sample paragraphs in correct voice
├── 9. SEO content voice
│   ├── How notes differ in tone from marketing copy (more technical, more useful)
│   ├── Heading structure rules for SEO
│   └── Meta description formula
└── 10. Implementation contract
    ├── Tailwind config token mapping
    ├── CSS custom property names
    └── How the brand guide compiles into the codebase
```

### 5.2 Tokens (starting point for the agent — refine in BRAND_GUIDE.md)

```
/* Surface scale — warm-shifted neutrals */
--bg-0:          #0A0A0B    /* page background, near-black */
--bg-1:          #131316    /* card/section surface */
--bg-2:          #1C1C20    /* hover/elevated surface */
--bg-3:          #26262C    /* modal/overlay surface */
--bg-4:          #303038    /* highest elevation */

/* Foreground scale — warm off-whites */
--fg-0:          #F4F2EE    /* primary text, film-stock white */
--fg-1:          #C9C5BD    /* secondary text */
--fg-2:          #8A8780    /* muted */
--fg-3:          #5C5A55    /* subtle, captions */
--fg-4:          #3A3935    /* hairline borders, backgrounds */

/* Accents — used SPARINGLY */
--accent-warm:   #E8553D    /* burnt cinema red — max 1 element per fold */
--accent-cool:   #4A6FA5    /* steel blue — secondary, often for focus rings */
--accent-glow:   #F4F2EE    /* pure highlight, used for selected states */

/* Semantic */
--border:        rgba(244, 242, 238, 0.08)
--border-strong: rgba(244, 242, 238, 0.16)
--focus-ring:    rgba(74, 111, 165, 0.6)
```

Film grain overlay: animated SVG noise at 4% opacity, fixed-position, `pointer-events: none`, layered above all content except modals. GPU-accelerated. Disabled for `prefers-reduced-motion: reduce`.

### 5.3 Typography (starting point)

- **Display:** GT Sectra (paid) OR PP Editorial New (free, recommended) OR Tiempos Headline
- **Body:** Söhne (paid) OR Inter Tight (free, recommended)
- **Mono:** JetBrains Mono

Type scale (1.25 ratio): 12 / 14 / 16 / 20 / 24 / 32 / 48 / 72 / 112

Headlines always use serif. **Recurring motif: a single italic word in a sans/serif headline** (e.g., "I produce *stories* with machines").

### 5.4 Motion language (starting point — agent must expand in BRAND_GUIDE.md)

```
--ease-cinema:   cubic-bezier(0.65, 0, 0.35, 1)   /* default */
--ease-shutter:  cubic-bezier(0.85, 0, 0.15, 1)   /* page transitions */
--ease-soft:     cubic-bezier(0.25, 0.1, 0.25, 1) /* UI feedback */
--ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1)/* playful, used rarely */

--duration-instant:   100ms
--duration-quick:     200ms
--duration-standard:  400ms
--duration-slow:      600ms
--duration-cinematic: 1000ms
```

**Five motion principles the agent enforces:**
1. **Earn every animation.** If it doesn't aid comprehension or set tone, cut it.
2. **Cinematic over snappy.** This site moves like film, not like a productivity app.
3. **Composed, not choreographed.** Stagger reveals; never have everything bloom at once.
4. **Scroll is the camera.** The user is the operator; the page reacts.
5. **Reduced-motion is a real audience, not an afterthought.** Every animation has a still, dignified fallback.

### 5.5 Animation requirements (Awwwards-tier)

The agent must implement these specific techniques across the site:

- **Custom cursor** with magnetic snap on interactive elements
- **Smooth scroll via Lenis** (calibrated — not too smooth, no nausea)
- **Scroll-driven scrubbing video** on hero (frame ranges tied to scroll position)
- **Hover-scrub on case study tiles** (mouse-x scrubs through video)
- **Staggered word-by-word text reveals** on key headlines (split via GSAP SplitText alternative or Framer Motion)
- **Marquee strips** for client logos (continuous, pause on hover)
- **Page transitions** with a cinematic shutter effect (radial mask wipe)
- **3D parallax depth** on hero — multiple layers moving at different rates on mouse-look
- **WebGL shader moments** — at minimum a noise/grain shader, ideally a hero treatment with displacement
- **Image-reveal masks** — clip-path animations as images enter viewport
- **Number counters** — animated stats (years, projects, scrap rate %)
- **Tilt-on-hover 3D cards** for capability strip
- **Sticky scroll sequences** — case study sections that pin and crossfade content

All of the above must respect `prefers-reduced-motion`.

### 5.6 Inspiration references for the agent

The agent should study (NOT copy) the *vibe* of:
- Daniel Wolfe (director site)
- ManvsMachine
- Stink Studios
- Bureau Mirko Borsche
- Active Theory (motion benchmarks)
- Pentagram (editorial discipline)
- Linear.app (UI restraint)
- Recent Awwwards SOTD winners (April 2026): Wonder Makers, Yan Liu portfolio, Kluster Collectif

### 5.7 Phase 0 deliverable

When Phase 0 is complete, the repo contains:
- `BRAND_GUIDE.md` (per §5.1)
- `/brand/wordmark.svg`, `/brand/icon.svg`, light + dark variants
- `/brand/grain.svg` (the film-grain overlay)
- `/brand/og-template.tsx` (the OG image generator template)
- A signed-off design system that Phase 1 will compile into Tailwind config + CSS vars

**Gate:** Jeff reviews and approves `BRAND_GUIDE.md`. No code is written until this passes.

---

## 6. Page-by-page spec

### 6.1 Home (`/`)

**Above the fold:**
- Full-bleed looping hero — a 6–10 second cinematic piece (Veo 3.1 / Kling 3.0 generated, see §8 content plan). Letterboxed 2.39:1.
- Overlay: large editorial wordmark `HAMMER` and tagline (one of the three candidates from BRAND_GUIDE.md)
- Scroll cue: a small frame counter (`001 / 247`) in the corner that increments as you scroll the page

**SEO H1:** `Hammer — AI Producer` (visible or screen-reader-only depending on design)

**Manifesto block (scroll 1):**
A short, punchy paragraph (draft in §11). Slow stagger reveal on scroll.

**Capability strip (scroll 2):**
Six tilt-3D cards, each opens to a relevant `/work` filter:
1. Autonomous AI Characters
2. AI Video & Cinema
3. Motion & Animation
4. 3D / Blender
5. Interactive Experiences
6. AI Pipelines & Orchestration

**Featured work carousel (scroll 3):**
3 hand-picked case studies. Horizontal scroll on desktop, vertical stack on mobile. Each card auto-plays a muted 4s loop on hover/visible.

**Selected clients band (scroll 4):**
Logos: Discovery, Turner, Comcast, [add as appropriate]. Desaturated, hover-color-restore. Marquee animation.

**Latest from the lab (scroll 5):**
Three most recent items pulled from `/agents/feed.json` and `/notes`. Mixed grid.

**Footer:**
Contact CTA (huge type), social links, RSS for the notes and agents feeds, copyright, "Built with Claude Code" easter egg link.

### 6.2 Work (`/work`)

- Editorial grid: 12-col, asymmetric (Brutalist–editorial hybrid like Pentagram or Bureau Mirko Borsche)
- Filter bar at top: All / Autonomous Agents / Video / Motion / 3D / Interactive / Pipelines
- Each tile: hover scrubs through the source video (poster frame → frame 50% → end frame, on mouse-x position)
- 6–10 case studies at launch (see §8 for content plan)

### 6.3 Case study (`/work/[slug]`)

Long-form, vertical scroll, Apple-product-page energy:
- Hero loop (full-bleed)
- Project meta: client / role / year / tools used / runtime
- The Brief (one paragraph)
- The Approach (process, with embedded mini-clips of intermediate generations — *show the failed takes*; this is a unique honesty signal)
- Before/After or A/B sliders where applicable
- Pipeline diagram (auto-generated SVG showing the tool chain — **this is the AI Producer signal**)
- Selected stills (gallery)
- Closing reflection / metrics if any (turnaround time, scrap rate, etc.)
- "Next project" navigation footer
- **SEO:** structured data `CreativeWork`, with `creator: Person(Jeff Hammer)` and `keywords` matching tier 2/3 targets

### 6.4 Lab (`/lab`)

The experimental playground. Items here are interactive, not linear.

Launch with at least 4 demos:
1. **Prompt-to-Storyboard generator** — visitor types a logline; Claude API generates a 6-shot storyboard with prompts ready to paste into Runway/Veo
2. **Character Consistency Lab** — three reference images of an autonomous character; user requests "put them in [scene]" and watches the consistency hold
3. **Pipeline visualizer** — interactive node graph showing Jeff's autonomous agents end-to-end
4. **Live render gallery** — feed of latest images/videos from Jeff's autonomous agents in past 24 hours

### 6.5 Agents (`/agents`)

The differentiator section. This is where Hammer's autonomous AI characters live.

- Roster grid — each character: portrait, name, "born" date, follower count, last-post timestamp
- Click → individual character page with: bio, the agent stack diagram (Hermes / LLM / posting layer), embedded latest social posts, optional "talk to them" demo
- **SEO:** each character has its own indexable page targeting "autonomous AI character" + character name

### 6.6 Process (`/process`)

The producer-mind page. Walks through:
- How Hammer briefs an AI project
- How prompt libraries / style bibles are built
- How iteration is tracked (versioning, scrap-rate measurement)
- How human/AI handoff points are decided
- How outputs are QC'd before ship

This page exists specifically because hiring listings keep saying "we want someone who knows when to re-prompt vs fix in post." This page proves it.

### 6.7 Notes (`/notes`)

- Indexable list of long-form articles
- Filter by tag
- Each article: long-form MDX with embedded video, code snippets, pipeline diagrams, pull-quotes
- Author bio block at end
- Related articles
- **SEO:** `BlogPosting` schema, OG images auto-generated, RSS feed

### 6.8 About (`/about`)

- Editorial portrait (one good photo; can be subtly AI-enhanced)
- Two-paragraph bio
- Experience timeline (Discovery → Turner → Comcast → present-day AI work) — animated SVG timeline
- Skills matrix grouped by: Production, AI Models, Code/Tooling, 3D/Motion
- Résumé download (PDF, generated from a single source-of-truth markdown — see §10)
- **SEO:** `Person` schema with `jobTitle`, `worksFor` (current), `alumniOf` (past employers), `knowsAbout` array

### 6.9 Contact (`/contact`)

- One large headline: "Tell me what you're trying to make."
- Form: name, email, project type (FT role / Freelance / Consulting / Press / Just curious), budget range (optional), message
- Submission: Resend serverless function → email to Jeff + auto-reply
- Calendly embed for "book a 20-min intro" below the form

---

## 7. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | Best SSR/SEO, streaming, well-known by agents |
| Hosting | Vercel | Zero-config, fast, agent-friendly |
| Styling | Tailwind CSS v4 | Industry default, no token translation overhead |
| Animation | Framer Motion + GSAP (ScrollTrigger, SplitText) | Component motion + scroll cinema |
| Smooth scroll | Lenis | Standard for Awwwards-tier sites |
| 3D | React Three Fiber + drei | Three.js wrapped cleanly |
| WebGL shaders | raw GLSL via R3F | For hero treatments and grain |
| Video hosting | Mux OR Cloudflare Stream | HLS, adaptive bitrate; never serve raw MP4 |
| CMS | Local MDX in `/content` | Simplest, agent-editable, version-controlled, SEO-friendly |
| Forms | Resend + Vercel serverless | Lightweight |
| Search | Pagefind | Static-site search, builds at deploy |
| Analytics | Vercel Analytics + Plausible | Privacy-respecting |
| Image opt | Next/Image + Cloudflare R2 for originals | Standard |
| AI APIs | Anthropic (Claude), FAL.AI (router for video/image models) | One key, ~600 models |
| Domain | TBD (Jeff figuring out — agent uses placeholder until decided) | |

**Do not use:**
- localStorage / sessionStorage in any interactive demo (Anthropic API in Artifacts pattern requires in-memory state)
- jQuery, Bootstrap, or any imposed-opinion UI library (Material, Chakra)
- Animated background videos that can't be paused
- Any tracking that violates GDPR/CCPA defaults

---

## 8. Content production plan

The site is also a portfolio, so it needs content. Some Jeff has, some the agent helps generate. Each capability needs at least 1 strong demo at launch.

### 8.1 Must-have launch content

| # | Asset | Source | Capability proven |
|---|---|---|---|
| 1 | 8s hero loop | Veo 3.1 or Kling 3.0; Jeff briefs, agent generates options | Cinematic AI video |
| 2 | "[Character 1]" autonomous AI character case study | Existing Hermes-agent character; doc the stack | Autonomous agents (THE differentiator) |
| 3 | Motion graphics reel (60s) | After Effects + Runway Gen-4.5 stylization; existing | Motion graphics |
| 4 | 3D character turntable (Blender → ControlNet) | Existing or new; agent helps render | 3D + AI hybrid |
| 5 | Interactive prompt-to-storyboard tool | Built into the site (Claude API) | Interactive + orchestration |
| 6 | "Performance ad pipeline" case study | Document a workflow turning 1 brief into 12 ad variants across Veo/Kling/Runway | Producer/orchestration angle |
| 7 | "Talk to [Character]" demo | Persistent character chat, in-character, served from Anthropic API | Character consistency + tech depth |
| 8 | Process explainer video (90s, animated) | Jeff scripts, AI animates | Process / pedagogy |

### 8.2 Capabilities to demo that Jeff hasn't tried yet

Content gaps to fill that prove range:

1. **AI music video** — Suno/Udio for music, Veo/Kling for visuals, lip-sync via Hedra or Pikaformance
2. **AI-driven brand identity sprint** — generate a logo + brand system for a fictional brand in <2 hours, document the process
3. **Synthetic actor performance** — single reference photo → multi-shot scene with Higgsfield motion transfer
4. **Real-time interactive AI character** — voice-input live conversation with one of the autonomous characters, in-browser
5. **AI documentary pipeline** — script + research docs in, documentary-style edit out (AI B-roll, AI VO, AI music)
6. **Live AI VJ set** — generative visuals reacting to audio in browser (Tone.js + WebGL shaders)
7. **AI-powered explainer animations** — for the `/process` and `/notes` pages

The agent should suggest more during plan mode.

### 8.3 SEO content (`/notes`) at launch

Five articles, drafted by the agent, refined by Jeff:
1. `from-broadcast-to-ai-producer` — career arc
2. `what-an-ai-producer-actually-does` — definitional
3. `the-autonomous-character-stack` — technical deep-dive
4. `ai-video-model-comparison-2026` — Veo/Kling/Runway/Seedance head-to-head
5. `ai-video-pipeline-workflow` — the orchestration playbook

---

## 9. Interactive demos — technical spec

### 9.1 Prompt-to-Storyboard (`/lab/storyboard`)

User enters 1–3 sentence logline. Site:
1. POSTs to a serverless function
2. Function calls Claude (Sonnet 4 via Anthropic API) with structured-output prompt requesting JSON: `{ shots: [ { number, description, camera, lighting, mood, suggested_prompt_runway, suggested_prompt_veo } ] }`
3. UI renders 6 shots as storyboard with prompt-copy buttons
4. Each shot is a Card with copy-to-clipboard for each model variant

Constraints:
- No browser storage; in-memory React state only
- Rate-limit by IP (10 req/hr) — Vercel Edge Middleware
- Loading state with cinematic copy ("Director is thinking...", "Setting up the shot...")
- Graceful API-failure fallback with example output

### 9.2 Character Consistency Lab (`/lab/consistency`)

- Pre-loaded with one of Jeff's autonomous characters (3 ref images)
- Dropdown of 6 pre-approved scenes (no NSFW, no real-person impersonation)
- On submit: Claude rewrites request into controlled prompt → dispatches via FAL.AI to chosen video model
- Returns 2–3 generations side-by-side
- Daily cost cap (env var); disable when hit

### 9.3 Pipeline Visualizer (`/lab/pipeline`)

- React Flow OR custom SVG with D3
- Node types: Brief → Reference → Prompt → Model → QC → Output
- Click any node for sliding detail panel
- Sample pipelines pre-loaded; read-only demo

### 9.4 Live Render Gallery (`/lab/feed`)

- Pulls from JSON manifest at `/content/agents/feed.json`
- Updated by separate cron the autonomous agents post to (Cloudflare Worker + KV, TBD)
- Infinite scroll, masonry layout
- Each item: image/video, character name, timestamp, "open in agent's feed" link

### 9.5 Talk-to-Character demo (`/agents/[slug]/talk`)

- Anthropic API endpoint via serverless function
- System prompt = persona + lore + content guardrails
- Streaming response
- Conversation history in React state only (no persistence)
- Hard message cap (15 turns) with graceful "[Character] returns to the shadows..." copy
- Aggressive abuse filtering — refuse breaks-of-character or jailbreaks

---

## 10. Résumé / About data

Distill Jeff's LinkedIn into `content/resume.md`:

```yaml
---
name: Jeff Hammer
brand: Hammer
title: AI Producer
location: TBD
links:
  linkedin: https://www.linkedin.com/in/jeff-hammer1985/
  email: TBD
roles:
  - company: Comcast
    title: TBD
    years: TBD-TBD
    bullets: [...]
  - company: Turner
    title: TBD
    years: TBD-TBD
    bullets: [...]
  - company: Discovery
    title: TBD
    years: TBD-TBD
    bullets: [...]
skills:
  production: [Premiere, After Effects, Avid, multi-cam, live]
  ai_video: [Veo 3.1, Kling 3.0, Runway Gen-4.5, Sora 2 (legacy), Seedance, Pika, Luma]
  ai_image: [Midjourney, Nano Banana 2, Flux, ControlNet]
  ai_audio: [Suno, Udio, ElevenLabs, Hedra]
  agents: [Hermes, Claude API, OpenAI API, custom orchestration]
  3d: [Blender, ControlNet-3D, Marigold]
  code: [TypeScript, Next.js, Python, basic Three.js]
---
```

Build script (`scripts/build-resume.ts`) that produces:
- `/about` page content
- Downloadable PDF résumé via Puppeteer print-to-PDF of hidden `/resume-print` route
- `Person` schema for SEO

---

## 11. Copy direction (drafts the agent refines with Jeff)

**Hero tagline candidates (BRAND_GUIDE.md will lock one):**
- *"Hammer. AI Producer."*
- *"I produce stories with machines."*
- *"Crew of one. Output of fifty."*

**Manifesto draft (~70 words):**
> Fifteen years in broadcast taught me how to ship. Discovery, Turner, Comcast — the discipline of a real crew, real deadlines, real audiences. The last eighteen months I've been building autonomous AI characters who run their own social feeds, directing AI video pipelines that turn one brief into a dozen variants, and treating language models like department heads. Same job. New tools. Same standard.

**Voice rules (also enforced in BRAND_GUIDE.md):**
- Short sentences. Cinematic.
- Banned words: "unleash," "harness," "revolutionize," "supercharge," "game-changing," "next-level," "leverage," "synergy"
- Producer voice — confident, specific, light on hype
- Always favor a concrete number or name over a vague claim

---

## 12. Performance budget

- LCP < 2.0s on 4G
- CLS < 0.05
- TBT < 200ms
- All hero videos: HLS, max 8MB initial, lazy-loaded poster frame
- Lighthouse mobile score ≥ 90 (perf), ≥ 95 (a11y), 100 (best practices), ≥ 95 (SEO)
- Core Web Vitals all green for ranking

---

## 13. Accessibility

- All video has captions or is decorative-only with `aria-hidden`
- `prefers-reduced-motion` respected throughout
- Keyboard nav tested for every interactive demo
- Focus rings visible (subtle but present — accent-cool color)
- Color contrast min AA on all body text, AAA on interactive elements
- Skip-to-main-content link
- All form inputs labelled

---

## 14. Phased build plan

### Phase 0 — Brand Guide (1–2 days)
- Produce `BRAND_GUIDE.md` per §5.1
- Generate wordmark, icon, OG template
- Lock tokens, type, motion language, voice
- **Gate: Jeff approves `BRAND_GUIDE.md`. No code until approved.**

### Phase 1 — Foundation (4–6 hrs)
- Init Next.js 15 + TypeScript + Tailwind v4
- Configure ESLint, Prettier, Husky pre-commit
- Compile `BRAND_GUIDE.md` tokens into `tailwind.config.ts` and CSS vars
- Set up `/content` directory structure
- Drop `AGENTS.md` and this `SPEC.md` in repo root
- Stub all routes with placeholder pages
- Push to GitHub, connect Vercel, get preview deploy live
- **Gate:** preview URL works, all routes return 200, brand tokens render correctly

### Phase 2 — Design system & motion primitives (1 day)
- Build core components: `<Container>`, `<Heading>`, `<Body>`, `<Button>`, `<Card>`, `<FilmGrain>`, `<Cursor>`, `<Marquee>`, `<TiltCard>`
- Build motion primitives: `<FadeIn>`, `<StaggerChildren>`, `<ScrollReveal>`, `<Shutter>`, `<SplitText>`
- Build shared layout (nav + footer)
- Implement Lenis smooth scroll, custom cursor, page transitions
- **Gate:** internal `/design-system` route displays every component, motion respects reduced-motion

### Phase 3 — Static pages (1–2 days)
- Home (with hero video, capability strip, all sections per §6.1)
- About, Process, Contact (with form action)
- All without final case study content yet (placeholders OK)
- File-grain overlay, custom cursor, page transitions, all the cinema motion
- **Gate:** Lighthouse mobile perf ≥ 90 on these pages with placeholders; SEO ≥ 95

### Phase 4 — Work / case studies (1–2 days)
- `/work` grid + filter
- `/work/[slug]` template
- 3 case studies stubbed in MDX with placeholder content + media
- Hover-scrub video behavior
- Pipeline diagram component (SVG-based, data-driven from MDX frontmatter)
- **Gate:** 3 case studies render with real video posters; structured data validates in Google's Rich Results Test

### Phase 5 — Notes (SEO content) (1 day)
- `/notes` index + `/notes/[slug]` template
- 5 launch articles in MDX
- RSS feed
- BlogPosting schema
- Related articles algorithm (tag-based)
- **Gate:** all 5 articles indexable, Lighthouse SEO ≥ 95, schema validates

### Phase 6 — Lab / interactive demos (2–3 days)
Independently shippable, in this order:
1. Pipeline Visualizer (no API)
2. Live Render Gallery (reads JSON manifest)
3. Prompt-to-Storyboard (Claude API)
4. Talk-to-Character (Claude API + persona)
5. Character Consistency (last; depends on FAL.AI access)
- **Gate per demo:** end-to-end on preview, has loading/error states, has rate-limiting

### Phase 7 — Agents pages (4–6 hrs)
- `/agents` roster
- `/agents/[slug]` individual pages
- Embedded social feeds (official embeds or screenshot fallback)
- **Gate:** at least one fully populated character page live

### Phase 8 — SEO finalization (4–6 hrs)
- All meta tags, OG images, structured data verified across every page
- Sitemap regenerated and submitted to Google Search Console
- robots.txt verified
- Performance pass (image lazy-load audit, font subsetting, JS bundle analysis)
- Internal linking audit (every page links to ≥ 3 others)
- 301s set up if Jeff has an old domain
- **Gate:** Lighthouse all categories ≥ 95 on mobile; structured data passes Rich Results Test for every relevant page

### Phase 9 — Content polish & launch (1 day)
- Real copy throughout (Jeff approves)
- Real videos uploaded to Mux/Cloudflare Stream
- Analytics installed and verified
- Search Console + Bing Webmaster Tools verified
- Final Lighthouse + a11y pass
- **Gate:** Jeff signs off, DNS cut over, indexing requested in Search Console

---

## 15. Things the agent must ASK Jeff before starting

Plan mode should produce this clarifying-question list:

1. **Domain** — placeholder until Jeff decides? Recommend buying both `jeffhammer.com` and `hammer.[tld]` and pointing both at site
2. **Email** — what address routes to Jeff for the contact form?
3. **Existing assets** — Dropbox/Drive of finished work to ingest? Path/link?
4. **Character names** — how many autonomous agents, names + lore one-liners?
5. **Logo / wordmark** — does Jeff have a Hammer wordmark concept, or does the agent generate options?
6. **Photography** — does Jeff have a portrait? Need one shot or AI-generated?
7. **API keys** — who provisions: Anthropic, FAL.AI, Mux/Cloudflare Stream, Resend?
8. **Cost cap** — daily $ ceiling for live API demos? (Recommend $5–10/day to start)
9. **Hand-off level** — review every component, or only milestone-end?
10. **CMS** — confirm "edit MDX in repo" is fine vs Sanity/Contentful (recommend MDX)
11. **Voice character demo** — text-only or include real-time voice input? (Voice is high cool factor + high cost)

---

## 16. Agent instructions

This archived phase-1 spec originally carried a `CLAUDE.md` template. That
template is no longer live guidance. The canonical current repo instructions
are in `AGENTS.md`; `CLAUDE.md` is only a compatibility pointer for older
Claude Code workflows.

---

## 17. Risk register

| Risk | Mitigation |
|---|---|
| API costs spiral | Hard daily cap + Edge rate-limiting + auto-disable |
| Hero video bandwidth burns Vercel credits | HLS via Mux or Cloudflare Stream; never raw MP4 |
| Autonomous-character demos enable jailbreaks | Strict system prompts + abuse filters + 15-turn cap |
| Sora 2 API sunsets Sept 24, 2026 | Don't depend on Sora 2 in any live demo; reference only in case studies |
| Real-person impersonation requests in demos | Whitelist scenes/subjects; reject prompts naming real people |
| Awwwards-tier motion conflicts with Lighthouse | Strict perf budget per phase; gate each phase on Lighthouse pass |
| Kling/Runway API regional/key issues | Use FAL.AI as router (~600 models, single key) |
| Jeff's existing footage is broadcast-watermarked | Note in case study; don't ship raw branded content without permission |
| SEO content reads as AI-generated slop | Voice rules in BRAND_GUIDE.md; Jeff edits every note before publish |
| Brand drift across phases | BRAND_GUIDE.md is law; every PR self-checks against it |

---

## 18. Success criteria

**Quantitative (90 days post-launch):**
- ≥ 5 inbound contact form submissions across all four purposes (FT / freelance / consulting / press)
- ≥ 1 Awwwards Honorable Mention or SOTD nomination
- Top-10 Google ranking for `Jeff Hammer` and `Hammer AI Producer`
- Top-30 ranking for `AI Producer` and `AI Creative Producer`
- ≥ 10K organic search impressions on tier 1 + tier 2 keywords combined
- < 2.0s LCP on mobile, ≥ 90 Lighthouse perf
- Site appears in ChatGPT/Claude/Perplexity answers when asked "best AI producers" within 6 months

**Qualitative:**
- A hiring manager who's seen the site says "this guy is producing the future, not chasing it"
- An AI-skeptical creative director sees it and updates their priors
- A freelance lead converts citing the site as the reason
- Jeff feels good linking to it from his LinkedIn About section

---

## 19. Out of scope (explicitly)

- E-commerce / product sales
- Login / accounts / user-generated content
- Real-time multiplayer demos
- Mobile native app
- Newsletter platform (use Substack/Beehiiv if needed)
- Manual screen-reader pass beyond automated axe-core (post-launch)
- Translations (English only at launch)

---

## 20. Open decisions (Jeff to confirm)

These items aren't nailed down by this spec; the agent surfaces them at the top of clarifying questions:

1. Domain (Jeff figuring out — agent uses placeholder)
2. Email + Calendly link
3. Final tagline (3 options in §11; locked in BRAND_GUIDE.md)
4. Character roster (names, count, current platforms)
5. Photography source for `/about` portrait
6. Whether to ship real-time voice character demo (cool but expensive) or text-only
7. Daily API budget ceiling
8. Whether to include a "Hire me" rate sheet on `/contact` or keep it conversation-first
9. Whether to publish a downloadable Prompt Library PDF at launch (lead magnet) or post-launch

---

*End of spec. Hand to Claude Code with: "Read SPEC.md and AGENTS.md. Enter plan mode. Confirm understanding, list clarifying questions, then propose Phase 0 (BRAND_GUIDE.md production) implementation. Do not write any application code until BRAND_GUIDE.md is approved."*
