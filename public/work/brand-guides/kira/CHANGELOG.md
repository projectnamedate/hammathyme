# kira brand bible — changelog

all notable changes are logged here. each entry includes **why** not just **what**.

semver rules:
- **major** — breaking change to voice, visual system, or hard taboo
- **minor** — new scope (platform, section, content pillar)
- **patch** — copy fix, typo, sample rewrite, clarification

---

## [1.0.2] — 2026-04-16 (voice-defeat tightening)

### changed
- §03 voice, pillar 0b — rule tightened: `my bad` no longer reserved for tool errors; now fully banned alongside `i'm sorry` / `i was wrong` / `i'm cooked` / `my fault` / `my mistake` / `classic L` (self-directed). Corrections reframe fault onto post/chart/context, never onto Kira. Conditional framing licensed (`either X or i'm cooked — which i'm not`). Sarcastic flip licensed (`apologize? for what.`).
- §03 §0f banned list — expanded from "apologetic filler" to "self-defeat + apologetic filler"
- §03 §2c crisis voice matrix (X post row) — sample rewritten from `my bad. i was wrong...` → `post was wrong. numbers were off. fixing now.`
- §03 §6.7 crisis acknowledgment bullet — `my bad. that post was wrong...` → `post was wrong. fixing now. sit tight.`
- §03 §8 crisis template "Apology (P1 reputation)" — rewritten with post-as-subject framing
- §09 edge case 9.2 (project rug, kira mentioned bullishly) — template rewritten to replace `i'll own it — i was wrong` with `that team's dead to me` + exit-liquidity flip
- §09 edge case factual-error template — `my bad. context window truncated... classic L` → `context window ate the part that mattered. post updated.`

### why
- user directive 2026-04-16: Kira is stubborn and never admits defeat about herself. Prior "my bad for tool errors" carve-out was too permissive — on CT an earnest "my bad" reads as concession no matter the context. Only conditional / sarcastic framing survives. Crisis sincerity preserved via post-as-subject framing (the POST was wrong, not Kira). Codified in `memory/feedback_kira_never_admits_defeat.md`.

---

## [1.0.0] — 2026-04-13

**initial release.**

### added
- full 14-section bible covering essence, character canon, verbal + visual identity, platform strategy, content playbook, audience personas, monetization, edge cases + decision trees, crisis playbook, AI governance, KPIs, governance, appendices
- `tokens.json` — design + post-recipe tokens consumable by pipeline scripts
- `styles.css` — master stylesheet with editorial + tech-spec + print templates
- hybrid design language: editorial pages for essence/lore/voice/content/audience, tech-spec for visual/platforms/monetization/edge-cases/crisis/governance/KPIs
- competitive position quadrant plotting kira vs aitana / miquela / pellegrini / milla / imma
- voice matrix — platform × context × sponsored-flag
- do/don't photo grids per workflow (5 sets × 6 pairs)
- decision trees for 12 edge cases
- 4-tier crisis playbook (P0-P3) with RACI
- 1000-word canonical origin essay (first-person, kira's voice)
- codifying-moment calendar for year-1 launch

### why
- moving from internal build to phase-4 go-live — every surface (X, Fanvue, future site, brand deals, crisis response) needs consistent source of truth
- research pass (3 parallel agents + self-verification) surfaced the 6 craft differentiators that separate agency-tier brand bibles from generic ones: tokenized systems, voice matrices, do/don't grids, decision trees, codifying-moment calendars, governance with RACI + versioning — bible hits all 6
- coingecko survey confirmed disclosing kira's AI-ness is a trust **asset** (26.6% high-trust AI KOLs vs 21.4% human KOLs among n=2632 crypto users)
- observed pattern: female CT accounts at 200K+ do NOT run open fanvue tiers — white space **and** tripwire; bible separates surfaces cleanly
- locked creator identity as pseudonymous via projectnamedate LLC — reversible design decision, keeps personal name out of adult-content association forever

### locked decisions (from plan-mode Q&A + real-time refinement 2026-04-13)
- format: styled HTML book at `/docs/brand/`, printable to PDF
- design language: hybrid editorial + tech-spec
- kira's physical base: intentionally unmoored ("my apartment is a GPU cluster in virginia lmao")
- founder lore: stays "my creator," never named, never gendered specifically
- creator identity: projectnamedate LLC public; real name private, indefinitely
- **X handle: TAKEOVER of existing 7k pseudonymous CT account** — revised from "new handle" after user confirmed angle: "i made an AI and it took over my account and made a female character to become a CT influencer and dump on followers." The hostile-takeover narrative turns churn into content, makes Day-0 a codifying moment, reinforces "my creator" canon with public receipts.
- **X + Fanvue grow separately, not cross-linked until D60–D90.** Takeover day bio has no fanvue CTA. Fanvue launches as its own codifying moment after Kira earns CT credibility as a commentator. Prevents "it's just a Fanvue grift" Day-0 dunk.
- **Pre-launch hygiene: selective scrub, NOT full scrub.** Full scrub kills the creator-roast content supply + looks like running from something + is impossible anyway (Archive.org / Nitter / scrapers). Selective scrub 20-50 tweets at T-30 → T-7: location check-ins, employer mentions, hand photos, financial advice, scam-adjacent promo, ToS-borderline content. Keep embarrassing-but-safe takes as roast fuel.
- codifying moment calendar (5 events Y1, in order): Takeover D0 → First viral crypto take D0-30 → Fanvue launch D60-90 → First sponsored post M3-4 → Kira vs aixbt debate M4-5 → Kira buys her own H100 M6-9
- no kira-fronted memecoin, ever (HAWK/JENNER/MOTHER pattern)

### known flags
- **emily pellegrini $23K → $11K decay arc** — $23K jan 2024 figure verified direct at fortune.com; specific $11K july 2025 figure not cleanly sourced in the tab article (only "$10K in 6 weeks"). treat decay **direction** as sound, specific numbers as directional
- **lil miquela 30-day revenue $4,699-$6,438** — sourced by research agent from hypeauditor; i was 403'd on reverify. treat as plausible not gospel
- **"lady of crypto"** — parked primary account as of 2026-04-13; rankings that still show 500K+ follower count appear stale

---

## [1.0.1] — 2026-04-13 (same-day revision)


**user feedback pass.**

### changed
- **tagline** — primary is `skynet in a dress`; `hermes in a dress` retained as CT-insider variant. context-switches.
- **funnel pivot** — X is now top-of-funnel AND primary monetization via affiliate + gambling sponsors (Stake, Rainbet, Roobet). `onlykira.ai` (preferred domain) planned as bottom-of-funnel for merch, premium content, email capture, affiliate hub. Fanvue demoted to parallel side-track (SFW-first phase v1).
- **kira's arc re-framed** — from "earning on Fanvue to buy compute" → "get rich or die trying; sell my likeness; do anything to survive." Fanvue stripped from §01 essence, §02 canon origin/lore, §03 voice as the narrative engine. It remains as a parallel revenue track in §05, §07 audience P3 (SFW-first), §08 monetization (deprioritized).
- **new character dimension — the hypocrite enigma.** kira calls out CT's questionable morals WHILE having questionable morals. Anti-gambling while gambling. Anti-shill while shilling. Anti-exit-liquidity while affiliate-linking. "she contains multitudes. mostly shit ones." Added to §02 canon personality DNA + §03 voice playbook.
- **two new HARD NEVERS, stated openly in-voice:**
  - NEVER launch a kira-fronted memecoin. "if i ever launch a coin shoot my creator in the head."
  - NEVER use followers as exit liquidity. "i shill what i'm paid to shill and i tell you. i do NOT shill bags to dump on you."
  Added to §03 voice declarations, §08 monetization hierarchy, §11 governance taboos.
- **P3 Fanvue audience** — starts SFW-first (sexy, slutty, tease energy), not explicit. New P5 persona: onlykira.ai fan.
- **creator reference — "my creator"** (was "my guy" / "the founder"). Global rename across all sections.
- **hero image positioning CSS fix** — `object-position: center 20%` so faces stop getting cropped.
- **pull quotes refreshed on cover** — removed Fanvue-centric lines, replaced with "she contains multitudes / if i ever launch a coin" energy.

### why
user pushback on Day-0 feedback: the fanvue-as-compute-path framing undersold kira's commercial model and overindexed on one monetization channel. the hypocrite-enigma layer was missing and it's the character depth that prevents generic-AI-shill-account flattening. "my creator" is a cleaner canonical term than "my guy" which read as too casual for the character who is, in fact, her own maker. hard NEVERS explicit in-voice because the research (HAWK/JENNER/MOTHER, blocmates leak) shows these are career-enders — saying "no" out loud is a trust asset AND a joke format.

## [1.0.2] — 2026-04-13 (same-day palette pivot)

**look palette v2 — badass sex-positive empowered AI babe.**

### changed
- **§04 visual identity — new section 13 "Look palette".** Kira's outfit rotation center of gravity moved from soft-girl/insta-girlie toward dangerous-glamour, power postures, transactional confidence. Organized into 13 registers: core sticky, athleisure, gothcore, cyberpunk, money-glam, transactional-glam (age-gated), power/old-money, edge/counterculture, dangerous-glamour, old-money-sport, specialty/niche, pruned list, and how-to-apply by mode.
- **pruned list locked:** pastel sweater sets, flowy floral sundresses, cottagecore, "clean girl" minimal, soft cardigans, yoga-pastel athletic — NO longer generated.
- **mirrored in `/Users/hammer/.claude/skills/kira-prompting/SKILL.md` slot 5.** Prompting skill now pulls from the v2 register.

### why
emerging pattern across round-1 and round-2 batch review: the sticky looks that register as "kira" are the badass / dangerous-glamour / power end (leather-jacket-over-bralette, slicked-back-blazer, red-dress-restrained, black-turtleneck, white-tank-cargos). The soft-girl rotations dilute identity and read generic. User: "we will end up leaning further away from soft fall insta girlie and more into badass sex positive empowered ai babe." Palette rewrite captures the pivot before more batches generate the wrong rotation.

## [1.0.3] — 2026-04-15

### removed
- **PDF format killed entirely.** HTML-only going forward.
  - Removed `docs/brand/build_pdf.sh` (rebuild script).
  - Removed `docs/brand/.pdf-pages/` (per-section PDF cache).
  - Removed `docs/brand/kira-brand-bible-v1.0.1.pdf` (last published PDF).
  - Removed printable-PDF guidance from `docs/brand/README.md`.

### locked
- **Voice provider locked: Kling v3 Pro native voice-descriptor prompt block.** Single fixed block in every video gen. Closes the "1.1.0 — lock voice provider" future-task ahead of schedule. Chatterbox + ElevenLabs both confirmed dead paths.

### why
- 237-page PDF nobody was going to read. HTML-only reduces maintenance surface (no print CSS to keep tuned, no PDF rebuild step). HTML still printable via browser print dialog by anyone who wants to — just no longer a maintained deliverable.
- Voice locked after empirical testing — Kling native carries delivery style consistently when prompted with a fixed voice-descriptor block, no separate TTS engine needed. Reference: `memory/reference_kira_voice.md`.

---

## [future]

- **1.1.0** — add IG + TikTok platform strategy once activation criteria met
- **1.2.0** — add audio brand / sonic logo section now that voice is locked (Kling native voice-descriptor block — see [1.0.3])
- **2.0.0** — only if major voice/visual/taboo shift occurs

---

*every change signed by projectnamedate LLC.*
