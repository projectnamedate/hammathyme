# Hammer Agent Handoff - 2026-10-21

## Latest (2026-10-21): car wash, wordmark boards, row 27 look-into
- **Car wash live** (`3d68c4a`) at `/work/interactive-playable/car-wash`, third in the category: a playable
  Colorfigures tunnel wash. The steps are pay (basic or deluxe), pull in, wash and drive off, then next car.
  Each station changes the car only as it passes: foam, side and top brushes, rinse, wax, tire shine, blowers.
  - The source is `figures/car-wash/car-wash.html`, with the engine vendored in `core.js` (MIT, `/licenses/colorfigures.txt`).
  - Rebuild with `python3 ~/.claude/skills/colorfigures/scripts/build.py figures/car-wash/car-wash.html public/work/interactive-playable/car-wash/car-wash.html`.
  - The detail page frames the built page in `components/figures/car-wash/CarWashFrame.tsx`. The iframe grows to the figure's last element.
  - Screenshot states: `?stage=paid|loaded|wash&t=0.4|done|parked&wash=basic|deluxe`, plus `?press=Pay>Deluxe@300,...`.
- **Wordmark boards** (`f35554b`): the recommended badge no longer overlaps the meta label, and direction B now
  says technologist. Both pickup items are closed.
- **Row 27 look-into:** Jeff got an explainer page (scratchpad, not on the site). It shows the anatomy look vs
  the Colorfigures look and three sizes: seven category objects, a studio trio, or one hero object.
  Recommendation: one hero object in the anatomy look, in Hammer colours. Waiting on Jeff's pick.

## 2026-10-20: lab track
- New roadmap section "Lab track (Jeff 2026-10-20)" in `content/work/_backlog.md`, rows L1–L8, from a link
  triage in the skills repo (new `viggle-api` and `sunra-api` skills; Spark, cinetic and opuscar merges). Jeff's
  order: small items, then L4, then L5–L8. Jeff 2026-10-20: "we can continue in there with the next items on the
  roadmap".
- **L1 live** (`fbf0586`): `@sparkjsdev/spark` 2.4.0 on the splat viewer; local prod build renders at 1440 and 390,
  live viewer reaches its loaded state. Live WebGL screenshots hang in the Playwright browser; read pixels in the
  page (`canvas.toDataURL` with `preserveDrawingBuffer`) or check state instead.
- **L2:** ACE-Step blind pack waits on Jeff's listen
  (`~/Desktop/vibe/studioly/projects/the-gunfight/07-score/blind-acestep-v01/`).
- **L3 done:** Pi3 0.205 m vs `track_camera.py` 3.45 m on R4 s02; Pi3 weights are non-commercial, research only.
- **L8 research done:** scale carries through `SparkPortals`; shrinking renders soft (shared LoD). Plan and fixes:
  `~/Desktop/vibe/atlas/docs/nested-worlds-test.md`. Test page (git-ignored): `scratchpad/nested-portal-v01/`.
- **Next pickup:** whichever of these Jeff unblocks first: L4 Sunra paired take (needs `SUNRA_KEY`), L5 Genjutsu
  (needs his 6–8 s prop clip), L6 Viggle test (needs `VIGGLE_API_KEY`), L7 VirtuCamera (he buys it); or the L8 build
  (worlds from Marble export, Viggle or our Blender sets). Row 27 (brand illustrations) is still first in the main
  priority list once the lab track is set aside.

## 2026-10-18
- Later (`0d874e2`): pipeline visualizer adds short film, film to splat and
  still to ar (receipts from the project ledgers); creative skills shows six
  skills Jeff picked (never model-prompting skills, ask first); new
  `pipelines-tools/qc-by-measurement`; vfx summary mentions AR; storyboard is
  "rate-limited", not "capped". Next session starts with backlog row 27 (the
  Hammer brand illustration look-into). All visualizer tool labels now fit
  their node boxes.
- Atrium order (`951b965`): film-animation, vfx-cgi, interactive-playable,
  motion-graphics, brand-systems, websites, pipelines-tools.
- Splat v03 (`b4f441d`): the "thing in the distance" was a north-west
  hillside patch that only 3 of 234 training views saw; it trained black
  and yellow. `splat/scripts/render_views.py --viewer-shell` adds 70 views
  on the web viewer's own low orbit; live asset `gunfight-street-v03.sog`.
- Humpback in AR (`/work/vfx-cgi/humpback-ar`): GPT Image 2.5 reference,
  Hunyuan 3D mesh, procedural spine skin and swim in Blender
  (`ar/whale/whale_rig.py`), 15 m life-size and 0.6 m tabletop. Every iOS
  browser goes through `rel="ar"` links (Chrome on iPhone fails the
  `relList.supports("ar")` check), Android through a Scene Viewer intent,
  desktop shows a QR. Jeff confirmed on iPhone that the skinned USDZ swims
  in Quick Look. Hero loop from `ar/whale/render_loop.py`.
- Blender look-dev deleted (308 to /work/vfx-cgi). vfx + cgi order: neural set
  capture, humpback in ar, environment swap.
- Open: rig cleanup (spine
  joints sit below the centreline because slice medians include the fins,
  fin bones sit off the fins; v03 shipped as approved); a device retest of
  Chrome on iPhone against the live page.

## 2026-10-17 (live through ae2c6b1)
- Motion reel: Chain Reaction (`hammer-reel-v04`, 66 s, 24p) replaces v3 at
  `/work/motion-graphics/reel`. Source in `films/motion-reel`.
- Sushi Scramble (`ff7149a`): a three.js third-person sushi shooter, first in
  interactive + playable (`/work/interactive-playable/sushi-scramble`). Code
  in `lib/games/sushi-scramble`, `components/games/sushi-scramble`; source
  prompts, scripts and ledger in `games/sushi-scramble`. Dot discipline is
  deleted. Never call the game "Ringworld" (its working name).
- Storyboard demo (`ae2c6b1`): Evolink `gpt-image-2.5-sunburst`, 16:9,
  medium, about 21 s. `EVOLINK_API_KEY` is a sensitive Vercel production env
  var. Redis, the $1 daily cap and fal are gone. The per-IP limit is the
  Vercel Firewall rule "storyboard per ip" (2 POSTs per IP per 10 min, 429);
  see AGENTS.md "Cost guardrails". The old UPSTASH_*, DAILY_API_BUDGET_USD and
  HAMMER_FAL_KEY env vars were deleted.
- Open: Sushi Scramble untested by a human on a touch device; backlog rows 18
  and 21–25.

## 2026-10-11 (commit 136d82f, history)
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
- The storyboard demo ran on fal then; superseded 2026-10-17 (Evolink).
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
- Breakwater restart → future film-animation piece to replace the applicant
  sub.
- Deferred from earlier sessions: 74MB ICM video storage strategy, per-piece
  OG images, GSC indexing requests (needs Jeff's access).
