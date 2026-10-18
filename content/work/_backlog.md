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

Priority order (Jeff 2026-10-17): AR piece, splat cleanup, code animation, Breakwater, world model (Chisel), then the anime and 3D shorts. Solaris waits on access.

| # | piece | category | status |
|---|---|---|---|
| 18 | Blender piece (AR?) | vfx-cgi | Jeff 2026-10-17 roadmap: a new Blender piece, maybe AR (USDZ/GLB quick look). Replaces the blender look-dev pipeline, which sits last on vfx + cgi until then. **Next session (Jeff 2026-10-17): build the AR piece in vfx-cgi** |
| 26 | Fix the neural set capture splat | vfx-cgi | Jeff 2026-10-17: "theres like a weird thing in the distance" in the live gaussian splat (/work/vfx-cgi/neural-set-capture). Not yet diagnosed; pipeline in `splat/`. Next session |
| 21 | 5 min code animation | film-animation | Jeff 2026-10-17 roadmap: in production in the animation repo (`films/stones-that-drink`); joins the code animation piece |
| 22 | Breakwater, claymation in Blender? | film-animation | Jeff 2026-10-17 roadmap (tentative): restart Breakwater as a Blender claymation film |
| 25 | World model piece: World Labs Chisel | new world-model subcategory | Jeff 2026-10-17: build it with Chisel (Atlas beta, "from 3D layout to world": block a layout at metric scale, place cameras, generate the finished world; modes for game environments, film, architecture and robotics). Tutorial https://www.youtube.com/watch?v=3s10wcyy3Ik, API https://atlas-beta.worldlabs.ai/docs/api-reference/atlas-chisel. Give world model work its own subcategory (where it sits in the category model is decided at build) |
| 23 | Anime short | film-animation | Jeff 2026-10-11 roadmap |
| 24 | 3D short | film-animation | Jeff 2026-10-11 roadmap |
| 17 | Runway Solaris generative interface piece | interactive-playable | keep (Jeff 2026-10-17: spin something up once access exists): Runway's Interface World Model (announced 2026-08-31) renders interactive UIs frame-by-frame with no code; early access only, no public API. Build a generative-interface demo piece when access exists |
| 15 | External SEO follow-up | launch | repo-side SEO is done (metadata, JSON-LD, sitemaps, robots, llms, agents.json). Open: GSC URL inspection/indexing requests for the priority sitemap set, Rich Results validation, Lighthouse mobile SEO. 2026-05-25 GSC showed `Discovered - currently not indexed`. Needs Jeff's access + explicit approval |

Shipped 2026-10-17: row 19 (Chain Reaction reel), row 20 (Sushi Scramble).

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
