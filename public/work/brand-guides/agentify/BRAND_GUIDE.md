# Agentify Brand Guide

Status: **LOCKED — v1.0**
Updated: 2026-05-19
Canonical source: `apps/marketing/app/brand-bible/page.tsx` (slide deck at `/brand-bible`)

## Principle

Agentify sells readiness for a world where software agents can discover, evaluate, negotiate, and buy. The brand has to feel like a working protocol surface, not an AI agency template.

The site should make a technical buyer think:

> These people understand agentic commerce because their own site behaves like agent-ready infrastructure.

## Brand State

Locked identity as of 2026-05-19. Use this as the default for every Agentify visual artifact going forward.

**Locked:**

- Name: `Agentify`
- Domain: `agentify.nexus`
- Direction: **Nocturne Ledger v2** — living sci-fi interface, agentic finance infrastructure.
- Logomark: **Ledger Gate** — two vertical posts + top crossbar + horizontal ledger cut through center. Recommended in monochrome; full-color variant uses Aurora Violet for the ledger cut and Ion Blue for the center node.
- Wordmark: **Rail Underline** — italic `Instrument Serif`, lowercase `agentify`, sitting on a thin dim-gold rail that overshoots the baseline and terminates in a gold node. Locked. Never uppercase, never paired with another typeface inside the lockup.
- Typography system: **Nocturne Ledger v2** — Instrument Serif italic (display + wordmark), Instrument Sans (body), Azeret Mono (protocol surfaces).
- Palette: **Nocturne Ledger v2** — Eclipse `#0C0D16`, Violet Smoke `#14132A`, Graphite `#1C1A36`, Moon Ash `#E8DFD0`, Aurora Violet `#8B6CFF`, Ion Blue `#4EC6DA`, Dim Gold `#C7A66A`. 70 / 20 / 10 usage split.
- Quality bar: MotionSites GitHub prompt-library craft level, with the Liquid Glass Agency structure as the base for the marketing site.

**Still open (next gates):**

- Marketing site final implementation (homepage + agent-readable surfaces).
- In-browser shader layer on top of the locked Kling clip (wave displacement on the floor reflection, bloom on the central node, brand color grade lock, film grain) — T3 of the roadmap.

**Now locked (2026-05-19):**

- Tagline / H1: *"Your next revenue stream will come from agents."* (Revenue Layer). See Positioning section.
- Hero still: Midjourney v8.1 frame stored at `siteoptions/hero-still-locked.png` (gitignored). Low-angle one-point perspective through a dark stone corridor, four parallel rails of muted mineral-gold light embedded in a polished slate floor converging on a single glowing node at the vanishing point. Color discipline holds — gold reads as antique brass, not lava. Architectural mass anchors both sides, clean negative space upper-left for headline overlay.
- Hero motion: two 4K 10s Kling I2V clips at `siteoptions/kling/` (gitignored), with `.loop.mp4` crossfaded variants for seamless `<video loop>` use:
  - `loop-1-agent-arrival` — a single warm-brass pulse travels the center rail from foreground to the distant node, dissolving into it. A second smaller pulse follows. Recommended hero.
  - `loop-2-ambient-traffic` — multiple staggered pulses traveling along all rails, ambient infrastructural traffic, node holds steady. Alternate / interior-page use.
  - Both: Kling Native 4K I2V, 10s, near-still camera (sub-pixel float), petrol-blue fog drift, no audio. Raw + crossfaded loop versions kept.

Brand bible takeover brief (now retired):

- `docs/CLAUDE_BRAND_BIBLE_HANDOFF.md`

## Positioning — locked

**Primary H1 (locked):** *"Your next revenue stream will come from agents."* (Revenue Layer)

**Campaign variants:**
- *"Make your business callable by autonomous buyers."* (Callable Company) — technical/MCP-flavored, use as subhead, on `/for-agents`, and in outbound to engineering buyers.
- *"Agent buyers can't buy what your stack can't expose."* (Payment Readiness) — most urgent, use as outbound subject lines and time-sensitive ad hooks.

**Primary CTA:** *"Book a free audit"*. Rotates with *"Run the agent-readiness check"* and *"Audit your agent surface"* on secondary pages.

Agentify prepares commerce and B2B companies for AI-agent buyers.

Primary offer:

- Agent-payment readiness for stores, platforms, and B2B sellers.
- Custom integration work after the audit identifies the exact system gap.

Do not position as:

- Generic AI consulting.
- Chatbot agency.
- Template automation shop.
- "AI employees."
- Guaranteed revenue machine.

## Voice

Plain, technical, current, slightly unnerving in a useful way.

Good:

- "Your checkout is built for humans. Your next buyer may not be one."
- "We make the payment, catalog, fraud, and order surfaces legible to agents."
- "One audit. A fixed build plan. Then your systems can be called by agents safely."

Bad:

- "Revolutionize your business with AI."
- "Unlock AI-powered synergy."
- "The future is here."
- "10x your revenue with autonomous agents."

Voice test:

If a senior engineer would not forward the page to their CTO, rewrite it.

## Reference Source

Website references come from `docs/WEBSITE_REFERENCE_SOURCES.md`, with the MotionSites GitHub prompt library as the primary quality bar:

- https://github.com/aayushsoam/motionsites.ai
- https://github.com/aayushsoam/motionsites.ai/tree/main/prompts
- https://github.com/aayushsoam/motionsites.ai/tree/main/Pro%20prompts

Use those prompts for their craft level and specificity. Do not treat the public gallery alone as the reference source, and do not copy another site's brand, layout, or copy.

## Visual Direction

Name: **Nocturne Ledger v2**

The visual system should feel like:

- A dark operations room.
- A payment network seen through machine vision.
- A premium technical studio, not a SaaS landing page.
- Slow cinematic motion, never busy startup confetti.

Core motifs:

- Contour fields.
- Payment routes.
- Agent paths.
- Checkout rails.
- Machine-readable annotations.
- Protocol manifests.
- Dense but controlled metadata.

Avoid:

- Purple-blue gradient SaaS blobs.
- Generic dashboard cards in a hero.
- Hero text inside cards.
- Stock photos of robots or people with headsets.
- Decorative orbs.
- Explainer illustrations that look like startup clip art.
- A plain static hero pretending to be final design.

## Composition

The first viewport is a full-bleed visual system. Text sits over the visual field, not next to it in a split layout and not inside a card.

Hero structure:

- Full viewport, but leave a hint of the next section visible on common desktop and mobile heights.
- Full-bleed shader or WebGL scene.
- Minimal top nav.
- One H1, one subhead, two CTAs.
- Small protocol/status strip anchored near the bottom.

Page structure:

- Sections should feel like full-width bands or open layouts.
- Repeated items can use cards, but do not nest cards.
- The marketing site should not become a dashboard.
- The dashboard should be quiet and operational, separate from public brand drama.

## Typography — locked

Locked stack:

- Display: `Instrument Serif`, italic. Doubles as the wordmark face — no second face inside the lockup.
- Body: `Instrument Sans`. Calm and readable for technical sales copy.
- Mono / Protocol: `Azeret Mono`. Used for protocol labels, endpoint paths, proof strips, and machine-readable artifacts.
- Display alt: `Syne`. Used only for uppercase moments where Instrument Serif italic feels wrong (chapter eyebrows in deck contexts, badge labels).
- Wordmark fallback: `Syncopate`. Reserved — the primary wordmark is the Instrument Serif italic Rail Underline treatment.

Rules:

- The wordmark is italic Instrument Serif, lowercase, never paired with another typeface inside the lockup.
- Tracking: -0.025em at display, -0.02em at nav, 0 at small sizes.
- Letter spacing on body is -0.005em. Uppercase mono labels may use positive tracking up to 0.22em.
- Use `clamp()` for fluid type; modular scale ratios 1.250 mobile / 1.333 desktop. Body never drops below 16px.
- Hero H1 can be large but must hold optical restraint: strong line breaks, enough leading, no cramped collisions on mobile.
- Italics are the default cut for display and the wordmark. The roman cut belongs to running text only.

## Color System — locked

Nocturne Ledger v2. Dark near-black base, soft moon-ash text, restrained accents. Pure black and pure white are forbidden.

Primitives:

```css
--ink-eclipse:    #0C0D16; /* surface · 70% */
--ink-panel:      #14132A; /* surface elevated */
--ink-raised:     #1C1A36; /* surface elevated 2 */
--text-primary:   #E8DFD0; /* moon ash — warm cream */
--text-secondary: rgba(232, 223, 208, 0.72);
--text-tertiary:  rgba(232, 223, 208, 0.48);

--accent-aurora:  #8B6CFF; /* primary energy */
--accent-ion:     #4EC6DA; /* secondary signal */
--accent-gold:    #C7A66A; /* mineral accent */
--accent-pink:    #FF4FB8; /* rare leak */

--status-ok:      #7CFFB2;
--status-warn:    #FFB547;
--status-risk:    #FF5A5F;

--line:           rgba(232, 223, 208, 0.10);
--line-strong:    rgba(232, 223, 208, 0.20);
--line-accent:    rgba(139, 108, 255, 0.32);
```

Usage — 70 / 20 / 10:

- 70 % Eclipse + Moon Ash as the dominant surface + text pair.
- 20 % Graphite structure, glass, lines, shadows.
- 10 % accent energy split across Aurora, Ion, and Gold.
- Status colors (green / amber / red) are reserved for semantic meaning — never decoration.

Accessibility:

- Body copy hits WCAG AA contrast at every required pair (Moon Ash on Eclipse = 13.2:1).
- Accent text on dark is contrast-audited before shipping.
- Status never relies on color alone — always paired with a label or shape.

## Per-page shader treatment

Every page on the marketing site carries its own distinct shader effect.
The hero's video-textured pipeline (`HeroVideoShader.tsx`) is the
flagship, not a template. Other routes get their own treatments —
ripples, scanlines, drifting lattices, dispatch animations — chosen to
fit each page's purpose. The brand pillar is *the site behaves like
agent-ready infrastructure*; distinct shaders per surface reinforce that
each page is purposeful, not template-stamped.

Sketch by route (refine when each page is built):

- `/` — locked: full Agent-Payment-Field cinematic shader on the Kling hero.
- `/for-agents` — protocol-readout shader (drifting Voronoi / typographic noise).
- `/services` — slow horizontal rails behind service section dividers.
- `/agent-ready/audit` — soft scanlines over the form ("you are being scanned").
- `/privacy`, `/terms` — quiet legal copy; minimal sub-2% fBM dust at most.
- `/unsubscribe` — "absorb" animation on successful suppression.
- `/data-requests` — "dispatch" animation when the request fires.

Always implement `prefers-reduced-motion` to a static frame.

## Motion

Motion is the brand proof.

Principles:

- Always-on but slow.
- The hero must be WebGL or shader-driven.
- Mouse movement can subtly bias the field but should not turn the page into a toy.
- Entrance choreography should be elegant: nav resolves first, protocol label second, headline words third, proof strip last.
- Scroll should reveal structure, not just fade sections in.
- Respect `prefers-reduced-motion`: shader freezes to a static frame, parallax disabled, opacity transitions only.

Target feeling:

- A protocol field idling.
- Payment paths resolving.
- Agents negotiating routes.
- A live system waiting for a call.

Motion anti-patterns:

- Random particles.
- Fast looping gradients.
- Bounce effects.
- Gratuitous scroll hijacking.
- Heavy scenes that drop frames on mobile.
- Animations that compete with reading the offer.

## Logo — locked

**Logomark: Ledger Gate.** Two vertical posts, a top crossbar, and a horizontal ledger cut through the center, anchored by a single center node. Reads as institutional and unmistakable in monochrome. Constructed on a 96 × 96 grid with a 6-unit stroke on the gate and a 4-unit stroke on the ledger cut. Holds at 16px favicon.

**Wordmark: Rail Underline.** Italic `Instrument Serif`, lowercase `agentify`, sitting on a thin Dim Gold rail that overshoots the baseline and terminates in a Dim Gold node. The wordmark uses the same face as the H1 — pairing them is what makes the system feel inevitable rather than assembled.

Lockup rules:

- Mark on the left, wordmark on the right, gap = mark cap-height × 0.35.
- Clearspace around the mark = cap-height × 1, on all sides.
- Minimum sizes: 16px favicon, 24px nav, 96px hero.
- Never: stretch or skew, re-color outside the locked accent set, place on a noisy hero shader without a scrim, box the mark inside a card, replace the wordmark with another typeface inside the lockup.
- Alternate marks (Rail Monogram, Aperture) live in the brand bible as historical context only — not recommended.

## Required Public Proof Surfaces

The brand promise is only credible if the site itself is agent-readable.

Required before launch:

- `/robots.txt`
- `/llms.txt`
- `/llms-full.txt`
- Markdown twin for every page.
- `/.well-known/agents.json`
- `/.well-known/mcp.json`
- `/.well-known/ai-plugin.json`
- `/.well-known/ucp` or a documented UCP readiness page if the spec changes.
- `/mcp`
- `/for-agents`
- `/privacy`
- `/unsubscribe`
- `/data-requests`

## Approval Gate

No final marketing UI implementation should happen until these are approved:

- This brand guide.
- `docs/WEBSITE_REFERENCE_SOURCES.md`.
- `docs/SHADER_PROTOTYPE_SPEC.md`.
- One visual direction screenshot or browser prototype.
- One reduced-motion fallback screenshot.
