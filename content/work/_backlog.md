# /content/work — backlog

Pieces Jeff plans to make as case studies. Each links to its parent category in
`lib/works.ts` (the canonical model: 7 categories, `DETAIL_READY_KEYS` = live
detail routes). Discuss approach with Jeff *when its category becomes the
focus* — he has ideas per item.

Category model (atrium order, 2026-10-18): `film-animation`, `vfx-cgi`,
`interactive-playable`, `motion-graphics`, `brand-systems`, `websites`,
`pipelines-tools`. `agents-digital-twins` was removed 2026-10-11. Older dated notes below
are kept as history and may use pre-rename names.

## Open items

Renumbered 2026-10-21 (Jeff: "starts with 1 again"). Old numbers: 21→1, 22→2, 25→3, 23→4, 24→5, 28→6, 17→7, 15→8, 29→9; lab L2→L1, L8→L2, L5→L3, L6→L4, L7→L5.

Priority order for pieces (Jeff 2026-10-17, updated 2026-10-21): 1 code animation, 2 Breakwater, 3 world model (Chisel), then 4–5 the anime and 3D shorts. 6 is a someday restyle, 7 waits on Solaris access, 8 needs Jeff's GSC access. 9 lives in its own repo.

| # | piece | category | status |
|---|---|---|---|
| 1 | 5 min code animation | film-animation | Jeff 2026-10-17 roadmap: in production in the animation repo (`films/stones-that-drink`); joins the code animation piece |
| 2 | Breakwater, claymation in Blender? | film-animation | Jeff 2026-10-17 roadmap (tentative): restart Breakwater as a Blender claymation film |
| 3 | World model piece: World Labs Chisel | new world-model subcategory | Jeff 2026-10-17: build it with Chisel (Atlas beta, "from 3D layout to world": block a layout at metric scale, place cameras, generate the finished world; modes for game environments, film, architecture and robotics). Tutorial https://www.youtube.com/watch?v=3s10wcyy3Ik, API https://atlas-beta.worldlabs.ai/docs/api-reference/atlas-chisel. Give world model work its own subcategory (where it sits in the category model is decided at build) |
| 4 | Anime short | film-animation | Jeff 2026-10-11 roadmap |
| 5 | 3D short | film-animation | Jeff 2026-10-11 roadmap |
| 6 | Precise isometric card plates on every card (anatomy-asset) | all categories | Jeff 2026-10-21: keep today's flat plates for now; "eventually maybe precise isometric would be cool on all the cards". Picked from a six-style mockup (flat, isometric, Colorfigures, risograph, soft 3D, gouache). Reference card: `figures/card-mocks/car-wash-anatomy/` (cream with a cinnamon subject, quiet CSS motion). Each of the 23 cards needs its own object; polish the mock first (6 floating line ends) |
| 7 | Runway Solaris generative interface piece | interactive-playable | keep (Jeff 2026-10-17: spin something up once access exists): Runway's Interface World Model (announced 2026-08-31) renders interactive UIs frame-by-frame with no code; early access only, no public API. Build a generative-interface demo piece when access exists |
| 8 | External SEO follow-up | launch | repo-side SEO is done (metadata, JSON-LD, sitemaps, robots, llms, agents.json). Open: GSC URL inspection/indexing requests for the priority sitemap set, Rich Results validation, Lighthouse mobile SEO. 2026-05-25 GSC showed `Discovered - currently not indexed`. Needs Jeff's access + explicit approval |
| 9 | slopocalypse: DOOM-style browser shooter where the demons are AI slop (working title) | interactive-playable (optional) | Separate project, not a hammer priority (Jeff 2026-10-21): the AI slop twist, built as **its own project**: repo `~/Desktop/vibe/slopocalypse` (private, github.com/projectnamedate/slopocalypse), plan in its `docs/PLAN.md`. Built in a separate session. A hammer.ad card is welcome later but not a priority |
| 10 | 3D RPG or adventure game (no shooters) | interactive-playable | Jeff 2026-10-24. **Unity 6** for a build that plays on hammer.ad (WebGL 2, Brotli headers in `vercel.json`); an **Unreal 5.8** version only as a trailer plus download (no web export). Engines installed and smoke-tested first in `~/Desktop/vibe/games/engine-tests/`; how-to and bridge recipes in the skills repo's `game-dev` skill. Not started |
| 11 | Pixel RPG or adventure game (no shooters) | interactive-playable | Jeff 2026-10-24: test **Phaser 4** and **Godot 4.7** before choosing. Smoke tests passed 2026-10-24: Phaser 284 KB brotli, 0.45 s load; Godot 6.9 MB brotli wasm, about 6.6 s load (`game-dev` skill). Art: code-drawn pixels or Retro Diffusion (output licence unread). Not started |

## Lab track (Jeff 2026-10-20)

Tests and tool upgrades from the 2026-10-20 link triage (skills repo `a547dcb`/`2cb090c`). Each feeds a pipeline or a future piece; nothing here becomes a public page until Jeff says so. Facts and how-to live in the named skills. L1 waits on Jeff's ears; L2 is ready to build; L3–L5 each wait on one input from Jeff.

| # | item | feeds | status |
|---|---|---|---|
| L1 | ACE-Step 1.5 local music vs a Suno cue, judged blind | film scores without Suno's reseller-rights caveat | **ran 2026-10-20, waiting on Jeff's ears**: two 60 s takes of the gunfight standoff brief in 45 s on this Mac; blind pack `~/Desktop/vibe/studioly/projects/the-gunfight/07-score/blind-acestep-v01/` (X1–X4, two Suno v6 and two ACE-Step, loudness-matched; key in `key-open-after-listening.json`). Measured: ACE hit 60 s exactly (Suno gave 160/80 s), more dynamic range. `suno` skill |
| L2 | Nested worlds: portals between splat worlds, each world inside an object of the last | item 3 (world model piece) | handoff `~/Desktop/vibe/atlas/docs/nested-worlds-test.md`; worlds from Marble, Viggle and our own Blender sets, A/B'd. After Ian Curtis's portal demo (World Labs, 2026-10-19). **Research step done 2026-10-20:** scale carries through `SparkPortals`, shrinking renders soft because the behind pass reuses the front LoD (18.4 vs 7.95 baseline pixel difference); fixes listed in the handoff |
| L3 | Genjutsu restyle: Jeff's own 6–8 s prop clip → depth map + face mesh → Seedance 2.5 edit (about $3–5) | a film-animation or vfx-cgi piece candidate ("same moves, new world") | needs Jeff's clip; depth on fal `fal-ai/depth-anything-video`, face mesh via MediaPipe. `seedance-master`, "Restyle a real clip through a depth map" **Ran 2026-10-25 (method test, not a page):** an 1898 public-domain dance film moved onto a dawn cliff on Sunra at 480p, three arms ($2.03, studioly `genjutsu-probe`); edit mode works there. A portfolio version still needs Jeff's own clip at 1080p. |
| L4 | Viggle world-model test (about $0.85, inside the 100 free credits) | mocap for blender previz, $0.06 splat worlds, cheap H3 | Jeff signed up 2026-10-20, no key yet. `viggle-api` skill, `references/world-model-test.md` |
| L5 | VirtuCamera phone camera for previz ($19.99 Standard) | handheld moves in Seedance previs | Jeff buys the app; not virtucam.app (a camera spoofer). `blender-previz` `references/camera.md` |
| L6 | Previz keyframe sheet vs video ref for Seedance (PJ Ace's Nexus method) | less stiff previz-driven takes | Jeff 2026-10-24 allowed grey previz sheets (never called storyboards). Tool `blender-previz/scripts/keyframe_sheet.py` (tested on R4); A/B designed in `blender-previz` `references/seedance-handoff.md`: R4 s03, 5 s, 1080p, about $7.40. Not run |
| L7 | Rigging A/B on our own Hunyuan character: Tencent Hunyuan Auto Rigging vs Meshy on fal vs Blender auto-weights vs Mixamo; plus Motion2MixamoRig accuracy on a known clip | rigged characters for games and previz | Jeff 2026-10-24: "Motion2mixamo or hunyuan auto rig sound like they could be useful". Motion2MixamoRig installed (`~/Desktop/vibe/blender/tools/motion2mixamorig`), waits on Jeff's SMPL-X download and a Mixamo FBX; Hunyuan rig runner `3d-pipeline/scripts/tencent_autorig.py` waits on a Tencent Cloud account (about $0.20/job). Plan: Blender `ROADMAP.md` items 1 and 6 **Motion2MixamoRig accuracy done 2026-10-25:** 5.5 cm joint error on a known dance, foot lock keeps slide at the source's level (blender `tests/m2mr_accuracy/`). The rigging A/B is still open. |

Done 2026-10-20 (old lab numbers): L1 Spark 2.3.1 → 2.4.0 on the site (`fbf0586`, live; adds `SparkPortals`, SPZ v4, paged LoD); L3 Pi3 camera solve, 0.205 m path RMS vs `track_camera.py`'s 3.45 m on R4 s02, research only (CC BY-NC weights), `~/Desktop/vibe/blender/tests/pi3_compare/`.
Moved 2026-10-21: L4 (Sunra) to Studioly ROADMAP Next item 1, no paired test (Jeff: move every model Sunra carries).
Removed 2026-10-21: row 27 (brand isometric illustrations), Jeff's call after the look-into; card plate restyles are being mocked up instead.
Shipped 2026-10-21: car wash, a playable Colorfigures tunnel wash at `/work/interactive-playable/car-wash` (source `figures/car-wash/`, built page in `public/work/interactive-playable/car-wash/`).
Shipped 2026-10-17: row 19 (Chain Reaction reel), row 20 (Sushi Scramble).
Shipped 2026-10-18 (later): pipeline visualizer gained short film, film to splat, and still to ar; creative skills adds composition, shotlist cinematography, video check; new qc by measurement piece. Jeff declined a public spend page and the prompt-to-AR demo (too expensive).
Shipped 2026-10-18: row 18 (humpback in AR, `/work/vfx-cgi/humpback-ar`; blender look-dev deleted, 308s to /work/vfx-cgi; vfx order is neural set capture, humpback in ar, environment swap), row 26 (splat hillside blob fixed by retraining with the viewer's own low views, `gunfight-street-v03.sog`).

## Live inventory (for orientation, 2026-10-21)

24 live detail routes across the 7 categories; the authoritative list is `DETAIL_READY_KEYS` in `lib/works.ts`. In category order:

- film-animation: equinox, the-gunfight, code-animation
- vfx-cgi: neural-set-capture, humpback-ar, environment-swap
- interactive-playable: sushi-scramble, 35mm-projector, car-wash, prompt-to-storyboard
- motion-graphics: internet-capital-markets, reel, spring-health, spotify-titles
- brand-systems: hammer, kira, agentify
- websites: hammer, kira, agentify, coefficient
- pipelines-tools: pipeline-visualizer, creative-skills, qc-by-measurement

Removed 2026-10-11: comfyui outfit morph, the applicant, animated short placeholder, audio reactive
overlays, prompt library, consistency lab, and talk to a character (each 308s
to its category), plus the whole agents + digital twins category (kira detail,
bradley, live sensor twin), which 308s to /work. Removed later: blender look-dev (2026-10-18), dot discipline (2026-10-17).

## Historical notes

**Note (2026-05-04):** /notes route + `editorial-writing` capability tag dropped.
Jeff: "everyone can use ai to write things, its looked down upon. really i am
a visual ai producer." The site is now visual-only — 8 capability categories,
no blog. SEO is carried by portfolio copy, detail pages, /about metadata, and
structured metadata rather than editorial writing.

**Note (2026-05-13):** Category pages are gallery-first. Ready work opens in
detail routes. (Route list superseded by `DETAIL_READY_KEYS` in `lib/works.ts`.)

**Note (2026-05-13):** Brand-system detail pages summarize the guide inside
Hammer and link to the standalone guide artifact. Motion/video and production
artifacts can live directly inside Hammer as portfolio illustrations. Website
pieces use Hammer detail pages for the summary/preview, then link out to the
live public websites.

**Note (2026-05-13):** Category piece grids have Hammer-native SVG card assets
via `components/PieceArt.tsx`. These are portfolio plates, not substitutes for
finished case studies.

**Note (2026-05-13):** Root social preview assets generate from
`app/opengraph-image.tsx` and `app/twitter-image.tsx` using the Hammer wordmark
composition, cream/ink/cinnamon palette, and portfolio capability line.

**Note (2026-05-13/15):** Rive puppet history: build brief at
`content/work/rive-mcp-animation-brief.md`; approval board at
`public/work/animation/source/hammer-puppet-approval-board.html` (board
recommends candidate 02). Jeff then approved candidate 01's character read and
requested a clean T-pose production redesign (no storyboard/held prop). Next:
Jeff signs up for Rive Cadet, then create/approve the T-pose reference before
rigging, animation, `.riv` export, poster export, and site integration.

**Note (2026-05-14):** The public brand is always Hammer / `hammer`. The domain
appears only where the actual URL matters: metadata/SEO, sitemap/robots,
redirects, email/contact, and agent-readable docs such as `llms.txt`.
`hammer.ad` is the canonical URL; `www.hammer.ad` and `hammathyme.vercel.app`
redirect to the apex host.

**Note (2026-05-21):** Deep SEO/agent-readability pass added a central
`lib/seo.ts` contract, JSON-LD on public pages, canonical metadata, explicit
AI crawler rules in robots, stable sitemap dates, `/llms-full.txt`, and
`/.well-known/agents.json`. Keep these surfaces in sync with route, contact,
and portfolio-readiness changes.

**Note (2026-05-24):** Standing wish: keep detail sub-pages visual and
scannable; reduce wording, preserve the strongest proof and receipts.

**Note (2026-06-25):** Public contact email is `hammer@hammer.ad` (Namecheap
forward → `jeff@projectname.date`). All live-facing surfaces updated.

**Note (2026-07-16):** Resume removed from `/about` (commit `84687da`):
employer timeline, education, memberships deleted; employers scrubbed from all
SEO/agent surfaces; curated clients + agencies lists remain.
