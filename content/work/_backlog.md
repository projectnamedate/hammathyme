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

Jeff 2026-10-20: the Lab track below runs next (L4–L8, each waiting on one input from Jeff; L2 waits on his listen). Priority order for pieces (Jeff 2026-10-17, updated 2026-10-18): first the brand illustration look-into (row 27), then code animation, Breakwater, world model (Chisel), then the anime and 3D shorts. Solaris waits on access.

| # | piece | category | status |
|---|---|---|---|
| 27 | Hammer brand isometric illustrations (anatomy-asset skill) | brand-systems | Jeff 2026-10-18: "im confused on this, lets not do it now", **top of next session: look into it**. The idea: detailed isometric spot illustrations in Hammer colours for the Hammer brand dossier (options raised: a seven-object category set, a studio-tools trio, or one hero object). Explain it with a quick visual before building |
| 21 | 5 min code animation | film-animation | Jeff 2026-10-17 roadmap: in production in the animation repo (`films/stones-that-drink`); joins the code animation piece |
| 22 | Breakwater, claymation in Blender? | film-animation | Jeff 2026-10-17 roadmap (tentative): restart Breakwater as a Blender claymation film |
| 25 | World model piece: World Labs Chisel | new world-model subcategory | Jeff 2026-10-17: build it with Chisel (Atlas beta, "from 3D layout to world": block a layout at metric scale, place cameras, generate the finished world; modes for game environments, film, architecture and robotics). Tutorial https://www.youtube.com/watch?v=3s10wcyy3Ik, API https://atlas-beta.worldlabs.ai/docs/api-reference/atlas-chisel. Give world model work its own subcategory (where it sits in the category model is decided at build) |
| 23 | Anime short | film-animation | Jeff 2026-10-11 roadmap |
| 24 | 3D short | film-animation | Jeff 2026-10-11 roadmap |
| 17 | Runway Solaris generative interface piece | interactive-playable | keep (Jeff 2026-10-17: spin something up once access exists): Runway's Interface World Model (announced 2026-08-31) renders interactive UIs frame-by-frame with no code; early access only, no public API. Build a generative-interface demo piece when access exists |
| 15 | External SEO follow-up | launch | repo-side SEO is done (metadata, JSON-LD, sitemaps, robots, llms, agents.json). Open: GSC URL inspection/indexing requests for the priority sitemap set, Rich Results validation, Lighthouse mobile SEO. 2026-05-25 GSC showed `Discovered - currently not indexed`. Needs Jeff's access + explicit approval |

## Lab track (Jeff 2026-10-20)

New tools and tests from the 2026-10-20 link triage (skills repo `a547dcb`/`2cb090c`). Jeff's order: the small items first (L1–L3), then L4, then L5–L8. Each row is a test or tool upgrade that feeds a pipeline or a future piece; nothing here becomes a public page until Jeff says so. Facts and how-to live in the named skills.

| # | item | feeds | status |
|---|---|---|---|
| L1 | Bump Spark 2.3.1 → 2.4.0 on the site | neural set capture (`components/SplatViewer.tsx`), row 25 | **shipped 2026-10-20** (`fbf0586`, deploy READY): splat renders at 1440 and 390 locally, reaches its live state on hammer.ad. 2.4.0 adds portals (`SparkPortals`), SPZ v4, paged LoD and XR fixes. `threejs` skill `references/gaussian-splats-spark.md` |
| L2 | ACE-Step 1.5 local music vs a Suno cue, judged blind | film scores without Suno's reseller-rights caveat | **ran 2026-10-20, waiting on Jeff's ears**: two 60 s takes of the gunfight standoff brief in 45 s on this Mac; blind pack `~/Desktop/vibe/studioly/projects/the-gunfight/07-score/blind-acestep-v01/` (X1–X4, two Suno v6 and two ACE-Step, loudness-matched; key in `key-open-after-listening.json`). Measured: ACE hit 60 s exactly (Suno gave 160/80 s), more dynamic range. `suno` skill |
| L3 | Pi3 camera solve vs `track_camera.py` | blender previz camera tracking (research) | **done 2026-10-20**: on R4 s02 Pi3 scored 0.205 m path RMS (worst 0.62 m) against `track_camera.py`'s 3.45 m (worst 13.7 m); 49 frames in 92 s on this Mac (helsinki has no GPU). Weights CC BY-NC, so research only. `~/Desktop/vibe/blender/tests/pi3_compare/` |
| L4 | Sunra paired Seedance 2.5 take vs Evolink (about $5–9) | every Seedance 1080p take (paper rate about $0.57/s vs our measured $0.74/s) | needs a Sunra account and `SUNRA_KEY`. `sunra-api` skill, "First test" |
| L5 | Genjutsu restyle: Jeff's own 6–8 s prop clip → depth map + face mesh → Seedance 2.5 edit (about $3–5) | a film-animation or vfx-cgi piece candidate ("same moves, new world") | needs Jeff's clip; depth on fal `fal-ai/depth-anything-video`, face mesh via MediaPipe. `seedance-master`, "Restyle a real clip through a depth map" |
| L6 | Viggle world-model test (about $0.85, inside the 100 free credits) | mocap for blender previz, $0.06 splat worlds, cheap H3 | Jeff signed up 2026-10-20, no key yet. `viggle-api` skill, `references/world-model-test.md` |
| L7 | VirtuCamera phone camera for previz ($19.99 Standard) | handheld moves in Seedance previs | Jeff buys the app; not virtucam.app (a camera spoofer). `blender-previz` `references/camera.md` |
| L8 | Nested worlds: portals between splat worlds, each world inside an object of the last | row 25 (world model piece) | handoff `~/Desktop/vibe/atlas/docs/nested-worlds-test.md`; worlds from Marble, Viggle and our own Blender sets, A/B'd. After Ian Curtis's portal demo (World Labs, 2026-10-19). **Research step done 2026-10-20:** scale carries through `SparkPortals`, shrinking renders soft because the behind pass reuses the front LoD (18.4 vs 7.95 baseline pixel difference); fixes listed in the handoff |

Shipped 2026-10-17: row 19 (Chain Reaction reel), row 20 (Sushi Scramble).
Shipped 2026-10-18 (later): pipeline visualizer gained short film, film to splat, and still to ar; creative skills adds composition, shotlist cinematography, video check; new qc by measurement piece. Jeff declined a public spend page and the prompt-to-AR demo (too expensive).
Shipped 2026-10-18: row 18 (humpback in AR, `/work/vfx-cgi/humpback-ar`; blender look-dev deleted, 308s to /work/vfx-cgi; vfx order is neural set capture, humpback in ar, environment swap), row 26 (splat hillside blob fixed by retraining with the viewer's own low views, `gunfight-street-v03.sog`).

## Live inventory (for orientation, 2026-10-11)

22 live detail routes across the 7 categories; the authoritative list is
`DETAIL_READY_KEYS` in `lib/works.ts`. Per category: film (equinox, the
gunfight, code animation), vfx-cgi (environment swap, neural set capture,
blender look-dev), motion graphics (ICM teaser, reel, Spring Health, spotify
titles), brand dossiers (hammer/kira/agentify), the four
website previews (hammer, kira, agentify, coefficient), interactive (35mm
projector, prompt to storyboard, dot discipline), pipelines (visualizer,
creative skills).

Removed 2026-10-11: comfyui outfit morph, the applicant, animated short placeholder, audio reactive
overlays, prompt library, consistency lab, and talk to a character (each 308s
to its category), plus the whole agents + digital twins category (kira detail,
bradley, live sensor twin), which 308s to /work.

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
