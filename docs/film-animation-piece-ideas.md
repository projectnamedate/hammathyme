# film + animation — parked piece ideas

**Status: TABLED 2026-06-24.** Saved for a later decision, not building yet.

**Why this exists:** the `film + animation` category currently ships three pieces —
**equinox** (live, high-energy commercial spot), **animated-short** (narrative
animation), and **looping-social-bumpers** (short brand-tunable social loops). We
want **one more** finished-film piece to round out the range. We researched
options across three "boldness" tiers and tabled the pick. This is the menu.

**Constraints for any pick:** solo-feasible (one operator + coding agents + cloud
GPU + AI video/3D + free/indie software); a finished, shippable artifact that
renders on a `/work/film-animation/<piece>` detail page; and **distinct** from the
`motion-graphics` category (programmatic/broadcast design), the `vfx-cgi` category
(pipeline/orchestration craft), and the existing animated short. Use **fictional
brands** for any product/commercial work (real logos = trademark exposure).

Tool landscape this was researched against (mid-2026): video — **Veo 3.1**
(realism/reference-control king), **Kling 3.0 / Omni** (native 4K/60, 15-20s
shots, multi-shot, native audio), **Seedance 2.0** (multi-shot + synced audio,
phoneme lip-sync), **Runway Gen-4.5 + Act-Two** (control surface + performance
capture); audio — **Suno v5.5** + **ElevenLabs**; CGI — **Blender 4.5/5.1 Cycles +
OptiX/OIDN denoise**. A short AI film runs ~$60-250 + hours-to-days of solo work.

---

## Tier A — outside-the-box (what a traditional studio structurally *cannot* make)

These lean on Hammer being **code-native**, not just an AI-video user. Most differentiated.

### A1. Film-as-software — a short that recuts itself every visit *(top rec when we revisit)*
- **Concept:** pre-generate a pool of on-model shots + score stems; the detail page runs an assembler that composes a fresh, coherent cut on every load (seeded by load time). Not interactive — you watch a film that's different every time. No two visitors see the same cut.
- **Signals:** the medium *is* the thesis — a film that is literally a program. A traditional studio ships one locked cut; only a code-native AI studio ships this.
- **Feasibility:** feasible-with-scoping. Challenge = keeping recombination coherent (scope to a mood/montage film, not a tight plot). Artifact lives in the Next.js page (shot pool in `public/`, JS assembler, a fixed MP4 fallback for crawlers/poster).
- **Distinctness:** not interactive-playable (no viewer input); it's generative *playback*.

### A2. The Impossible Oner — one unbroken shot morphing through scale/time/medium *(boldest pure film)*
- **Concept:** a single continuous push with no cuts — quantum→cosmic, stone-age→far-future, or oil-paint→photoreal→claymation→anime — a transformation no camera/rig could ever do.
- **Signals:** weaponizes the one thing AI video does that no crew can: seamless continuous morph. Hypnotic hero MP4.
- **Feasibility:** clearly feasible; mostly AI-video morph + stitching + edit craft (Kling/Runway/Veo). Lowest infra risk of Tier A.

### A3. The Living Spot — a brand film that re-renders to live signal
- **Concept:** the ad reads the viewer's local weather/time and serves the matching grade/world — different at dawn vs midnight, sunny vs storm. "Advertising that's alive."
- **Signals:** structurally bridges film + the digital-twin thesis (a creative driven by a live data feed).
- **Feasibility:** feasible-with-scoping. Pre-render N variants keyed to weather/time buckets, swap client-side via a weather API + local time (fallback to a default cut).

### A4. Infinite-variant campaign — one brief auto-exploded into a living wall of cuts
- **Concept:** a pipeline takes one creative concept and generates dozens of localized/personalized variants (languages, cities, colorways), shown as a grid that keeps producing.
- **Signals:** "ship 100 spots from one brief" — production-at-scale, impossible to fake. Closest to the pipeline thesis; keep the artifact a *wall of finished spots* so it reads as film, not a tool.

---

## Tier B — studio-grade (high production value, the "would traditionally need a studio" flag)

### B1. Photoreal CGI product commercial *(operator's lead; strong)*
- **Concept:** photoreal all-CGI spot for a **rigid hero product** (sneaker / watch / sealed bottle / can / headphones), **fictional brand**, hand-built in Blender/Cycles.
- **Feasibility:** **feasible-with-scoping** — the single most-achievable high-end CGI for one person. Discipline: rigid product only — **avoid cloth/liquid/skin sims** (where solo CGI visibly breaks); hand-model the hero (AI-3D meshes aren't clean enough for a lingering shot); Cycles + OptiX/OIDN denoise; AI helps at the *edges* (denoise, 2K→4K upscale, generative backgrounds/B-roll, sound) but **AI video can't be the hero product shot** (won't hold geometry/branding across a move).
- **Cost/time:** render ~$100-250 on cloud 4090s (~31 GPU-hr/pass, ~$11/pass); real budget ~**1.5-3 weeks of look-dev craft**.
- **Subject ladder (easiest→hardest):** watch/can/headphones → sneaker (material variety reads as craft, still rigid) → perfume+caustics → liquid pour (risky) → garment (avoid) → human/skin (avoid).
- **Deliverable:** hero MP4 (15-25s, 4K, sound design + grade) + a **wireframe-to-final breakdown strip** + the **bpy pipeline code**. Doubles as proof for the `vfx-cgi` category.
- **Acceptance:** grounded contact shadows, true studio reflections, micro-roughness/beveled edges (no razor edges), clean denoise, cinematic camera + grade, designed sound, coherent fictional brand.

### B2. Fictional film / game concept trailer
- **Concept:** 60-90s teaser for original IP that doesn't exist — world reveal, hero beat, title sting.
- **Feasibility:** clearly feasible. The shot-island structure is exactly what AI video does best (no long continuity). Veo 3.1 + Kling 3.0 + Seedance 2.0 per-shot, FLUX/Midjourney keyframes, Suno score, ElevenLabs VO. ~$120-250, 1-3 days.
- **Signals:** highest wow-per-shot; widest range in one piece (world-building + cinematography + score + edit).

### B3. Creature / VFX "impossible shot"
- **Concept:** 1-2 spectacle shots (kaiju surfacing, dragon over a city, colossal collapse) cut as one **finished cinematic moment**.
- **Feasibility:** feasible-with-scoping (keep shots 5-10s; dramatic lighting/atmosphere hides flaws). Runway Gen-4.5 motion brushes + Kling/Veo. ~$100-200.
- **Caveat:** ship as a finished scene, **NOT a breakdown**, or it collides with the `vfx-cgi` category.

### B4. Photoreal world / virtual-production beauty shot
- **Concept:** 30-60s atmospheric establishing film of one gorgeous world (alien vista, cyberpunk street, period city) via slow cinematic camera + rich sound.
- **Feasibility:** clearly feasible — safest photoreal route (no characters/product/dialogue). Veo 3.1 reference control + Kling. ~$80-140, ~1 day.
- **Risk:** can read as a "vibe reel" without a strong concept hook.

---

## Tier C — solid but safer (lower "studio" signal)

- **C1. AI music video** — full 2-3min video to an original Suno track; forgives surrealism. Clearly feasible, ~$60-130, ~1 day. Weakness: reads creative/indie, not high-CGI-production-value.
- **C2. Character performance / dialogue scene** — single dramatic scene, real lip-synced acting (Runway Act-Two, Kling Omni). Most differentiated capability flex but the **riskiest** (sustained identity + micro-expression). Overlaps the animated short's "narrative" lane somewhat.
- **C3. Vertical short-form series pilot** — episodic pilot with a recurring character; reinforces "repeatable episodic output." Feasible.
- **C4. Cinematic brand / fashion film** — atmospheric story-led brand film. Risk: closest to overlapping the existing equinox commercial.
- **C5. Stylized / anime sequence** — action/emotional set-piece in a distinct anime aesthetic. Clearly feasible but **overlaps the existing animated short** if that short is also stylized — only add as a deliberately different second animation style.

---

## When we revisit
Leading candidates were **A1 (film-as-software)** for the boldest/most-on-brand pick and **B1 (photoreal CGI product commercial)** for the operator's stated taste + doubling as `vfx-cgi` proof. Decide one, then build per the integration contract in `docs/portfolio-build-handoff.md` (works.ts status + DETAIL_READY_KEYS, detail renderer, assets, SEO, brand invariants).
