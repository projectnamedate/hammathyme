# /content/work — backlog

Pieces Jeff plans to make as case studies. Each links to its parent category in
`lib/works.ts` (the canonical model: 8 categories, `DETAIL_READY_KEYS` = live
detail routes). Discuss approach with Jeff *when its category becomes the
focus* — he has ideas per item.

Rewritten 2026-07-16 to the current category model (`brand-systems`,
`agents-digital-twins`, `motion-graphics`, `vfx-cgi`, `pipelines-tools`,
`interactive-playable`, `film-animation`, `websites`). Older dated notes below
are kept as history and may use pre-rename names.

## Open items

| # | piece | category | status |
|---|---|---|---|
| 1 | Bradley persona digital twin | agents-digital-twins | in-production in `lib/works.ts`; likeness locked, LoRA training next |
| 2 | Live sensor twin dashboard | agents-digital-twins | coming-soon card |
| 6 | Animated short | film-animation | coming-soon card |
| 8 | Episodic Kira series (5 eps) | agents-digital-twins | idea, no card |
| 9 | Hedra avatar of Jeff explaining the creative technologist role | film-animation | idea, no card |
| 10 | Documentary opener / broadcast cold open | film-animation | idea, no card |
| 11 | 90-second broadcast-grade short | film-animation | idea, no card |
| 12 | AI sound design reel | film-animation (audio sub-cat?) | idea, no card |
| 13 | Audio-reactive overlays rebuild | motion-graphics | live at `/work/motion-graphics/audio-reactive-overlays` but needs a real rebuild so it reads as obviously audio-reactive, not a static infographic |
| 14 | Rive + Remotion puppet animation reel | film-animation | HARD-GATED: candidate 01 character read approved, but production model must be redesigned into a clean T-pose with no storyboard/shot-board or held prop, then approved, before any rig/animation/`.riv`/runtime work. Run `npm run verify:rive-puppet` first; manifest is `approvalStatus: pending` |
| 15 | External SEO follow-up | launch | repo-side SEO is done (metadata, JSON-LD, sitemaps, robots, llms, agents.json). Open: GSC URL inspection/indexing requests for the priority sitemap set, Rich Results validation, Lighthouse mobile SEO. 2026-05-25 GSC showed `Discovered - currently not indexed`. Needs Jeff's access + explicit approval |
| 16 | Runnable ComfyUI workflow bundle | vfx-cgi | optional: bundle input media + model/custom-node notes so the public outfit-morph workflow JSON runs out of the box (see `docs/AGENT_HANDOFF.md`) |
| 17 | Runway Solaris generative interface piece | interactive-playable | idea, no card: Runway's Interface World Model (announced 2026-08-31) renders interactive UIs frame-by-frame with no code; early access only, no public API. Build a generative-interface demo piece when access exists |

## Live inventory (for orientation, 2026-10-09)

25 live detail routes across the 8 categories; the authoritative list is
`DETAIL_READY_KEYS` in `lib/works.ts`. Highlights per category: brand dossiers
(hammer/kira/agentify), `agents-digital-twins/kira`, motion graphics
(reel, ICM teaser, audio-reactive, Spring Health, spotify titles), vfx-cgi (environment-swap,
blender-lookdev-pipeline, comfyui-production-backend outfit morph),
pipelines-tools (visualizer, prompt library, creative skills), the four
interactive demos, `film-animation/equinox` + `film-animation/the-applicant`,
and the four website previews (hammer, kira, agentify, coefficient).

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
