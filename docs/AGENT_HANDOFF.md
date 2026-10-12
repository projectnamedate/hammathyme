# Hammer Agent Handoff - 2026-10-11

## Latest (2026-10-11, commit 136d82f, live)
- Categories, in atrium order: film-animation, vfx-cgi, motion-graphics,
  brand-systems, websites, interactive-playable, pipelines-tools (7). The
  agents + digital twins category is gone and 308s to `/work`.
- New `film-animation/code-animation`: an 85s reel (all five films back to back, hard cuts) plus the five films from
  `~/Desktop/vibe/animation/finals` (web encodes in
  `public/work/film-animation/code-animation/`). The masters stay in the
  animation repo.
- Removed: the applicant, animated short, audio reactive overlays, prompt
  library, consistency lab, talk to a character. Kira lives on only as
  brand-systems/kira and websites/kira.
- The storyboard demo runs GPT Image 2.5 Sunburst on fal
  (`openai/gpt-image-2.5/sunburst/text-to-image`, medium, 16:9) and draws
  colour-pencil boards. It took 17.6s in testing.
- Media may always be committed in this repo (see AGENTS.md).
- Later the same day: comfyui outfit morph deleted (308 to `/work/vfx-cgi`),
  blender look-dev moved last on vfx + cgi, ICM teaser moved first on motion
  graphics. 22 detail routes.
- Open: a new Blender piece to replace the look-dev pipeline (backlog row 18);
  the unused Vercel env vars `HAMMER_OPENROUTER_API_KEY`,
  `HAMMER_KIRA_WEB_CHAT_API_KEY`, `HAMMER_KIRA_LORA_URL`,
  `HAMMER_KIRA_CHAT_MODEL` and `HAMMER_STORYBOARD_MODEL` can be deleted
  (Jeff's call).

The 2026-09-10 handoff below is history.

## 2026-09-10 handoff

## Status
Jeff retitled: **Creative Technologist** (was AI Producer). The retitle
shipped this session, deployed to production and verified live, then
**committed and pushed** (origin/main is current). Two standing operator
rules added to AGENTS.md: the Artlist × Sony pitch is permanently
do-not-publish, and no current-employer information appears on any public
site surface (about/metadata/JSON-LD carry role and craft only).

## What Shipped

### 1. Retitle: ai producer → creative technologist (every public surface)
- `lib/seo.ts`: SITE_TITLE, descriptions, keywords ("Creative Technologist"
  primary; "AI Producer"/"AI producer portfolio" kept as legacy secondary
  keywords), Person JSON-LD `jobTitle: "Creative Technologist"`, all route
  metadata templates. `SITE_LAST_MODIFIED` bumped to 2026-09-10 (was stale at
  2026-07-16). Hardcoded CreativeWork `datePublished: 2026-05-13` removed
  (real dates live in the VideoObject branches).
- UI: EntryHall h1/aria/tagline, HeroWordmark aria-label, about "currently"
  (now "creative technologist, building generative production pipelines..."),
  layout comments + console banner, social-image line, design-system
  WallPlate specimen, storyboard demo prompt.
- Agent surfaces: llms.txt, llms-full.txt (role, positioning terms, entity
  facts), agents.json, memories/jeff.md (recounted 97% - 2,138/2,200).
- Brand: BRAND_GUIDE.md + BRAND.html tagline "hammer. creative technologist."
  (+ compiled mirrors under public/work/brand-guides/hammer/), wordmark.svg
  caption "creative / technologist" + labels, direction-b desc.
- `scripts/verify-seo.mjs` expected string updated to match.
- AGENTS.md positioning line updated.
- SPEC.md and RESEARCH.md intentionally untouched (historical docs).

### 2. Runway Solaris backlog note
- `content/work/_backlog.md` row 17: future generative-interface piece under
  interactive-playable once Solaris (Interface World Model, announced
  2026-08-31, early access only) has access/API.

### 3. Audit fixes (full design/copy audit this session)
- Em-dashes removed from rendered prose: coefficient blurb, applicant strip,
  two VideoObject names (now colons).
- Over-25-word sentences split: agents-digital-twins + vfx-cgi category
  summaries, agentify description, DEFAULT_DESCRIPTION.
- Product-name casing normalized in prose: Spotify, GPT Image 2, Seedance 2.0,
  MiniMax H3, Kira, Studioly. ICM blurb anchored ("teaser for the ICM film").
  KiraAgentDetail aside rewritten to describe the work, not the page.
- Code hygiene: dead ternary in AtriumCanvas collapsed; dead
  `websites/hammathyme` PieceArt key removed; MotionReelDetail video gained
  aria-label; wordmark dot is now a real `<button>` (keyboard-accessible,
  cinnamon focus-visible ring via `.dot-trigger` in globals.css, zero visual
  change) in both Wordmark and HeroWordmark.

## Verification
- `lint`, `typecheck`, `verify:seo`, `build`, `git diff --check` — all pass.
- Headless spot-checks (local prod build): `/`, `/about`, `/contact`, `/work`,
  category + detail routes at desktop + 390px mobile, zero overflow; only
  console errors are local-only `_vercel/insights` 404s (expected off-Vercel).
- Production deploys verified live: title `hammer · creative technologist`,
  about "currently" line (no employer), Person JSON-LD Creative Technologist
  with no worksFor, llms.txt/llms-full.txt/agents.json new role, OG image
  200, all key routes 200. ssoProtection read back null after each deploy.
  Remaining live "ai producer" strings are only the intentional legacy SEO
  keywords.

## Open Items
- Deferred simplifications (real, need their own reviewed pass): consolidate
  the nine near-identical detail components in
  `app/work/[slug]/[piece]/page.tsx` into one data-driven renderer (~500
  lines); merge DetailMetaBar/DetailHeader; design-system-only components
  (WallPlate, Figure, SplitText, ScrollReveal, StaggerChildren) either delete
  with the page or mark internal-only; export brand hex constants shared by
  social-image.tsx/layout.tsx.
- Known pre-existing visual bug: in `public/brand/wordmark.svg` the top-right
  meta label overlaps the "★ recommended" badge (predates this session; the
  longer "the technologist" label hides ~4 more chars). Fix = move label or
  badge.
- `brand/wordmark-direction-b.svg` still has the old "The Producer" title/
  aria-label and "ai · producer" rendered caption — only its desc was
  updated. Source asset; update if it ever gets recompiled.
- Breakwater restart → future film-animation piece to replace the applicant
  sub.
- Deferred from earlier sessions: 74MB ICM video storage strategy, per-piece
  OG images, GSC indexing requests (needs Jeff's access).
