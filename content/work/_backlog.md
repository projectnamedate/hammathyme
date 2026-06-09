# /content/work — backlog

Pieces Jeff plans to make as case studies after launch. Each links to its
parent capability tag. Discuss approach with Jeff *when its category becomes
the focus* — he has ideas per item.

| # | piece | category | status |
|---|---|---|---|
| 1 | Episodic Kira series (5 eps) | autonomous-characters | placeholder |
| 2 | Fictional Hammer soda hero-shot commercial | visual-media | placeholder |
| 3 | Hedra avatar of Jeff explaining AI Producer | visual-media | placeholder |
| 4 | Documentary opener / broadcast cold open | visual-media | placeholder |
| 5 | Hammer brand build = Case Study #1 | brand-systems | live dossier |
| 6 | 90-second broadcast-grade short | visual-media | placeholder |
| 7 | AI sound design reel | visual-media (audio sub-cat?) | placeholder |
| 8 | Pipeline visualizer detail page | pipelines-tools | live |
| 9 | Rive + Remotion puppet animation reel | animation | candidate 01 character read approved; pending Rive Cadet, T-pose/no-storyboard redesign, rig, animation, export |
| 10 | Motion graphics reel | motion-graphics | live; final card has no email |
| 11 | ICM teaser, lower thirds + title package | motion-graphics | live detail page |
| 12 | Audio-reactive overlays with electronic track | motion-graphics | live detail page; needs a real rebuild so it reads as obviously audio-reactive, not a static infographic |
| 13 | Animated short | animation | placeholder |
| 14 | Prompt library walkthrough | pipelines-tools | live |
| 15 | Creative skills library | pipelines-tools | live |
| 16 | Interactive + playable demos | interactive-playable | live detail routes: storyboard, consistency, Kira chat, dot discipline |
| 17 | Canonical domain wiring: `hammer.ad` | launch | done, live |
| 18 | Technical SEO audit | launch | local implementation: per-route metadata, structured data, canonical URLs, AI-crawler robots, sitemap stability, priority sitemap, llms-full, and agent manifest. next: Search Console sitemap submission, URL inspection/indexing requests, Lighthouse mobile SEO, and Rich Results validation |

**Note (2026-05-04):** /notes route + `editorial-writing` capability tag dropped.
Jeff: "everyone can use ai to write things, its looked down upon. really i am
a visual ai producer." The site is now visual-only — 8 capability categories,
no blog. SEO is carried by portfolio copy, detail pages, /about metadata, and
structured metadata rather than editorial writing.

**Note (2026-05-13):** Category pages are gallery-first. Ready work opens in
detail routes, currently `/work/motion-graphics/{reel,internet-capital-markets,audio-reactive-overlays}`,
`/work/pipelines-tools/{pipeline-visualizer,prompt-library,creative-skills}`, `/work/agents/kira`,
`/work/interactive-playable/{prompt-to-storyboard,consistency-lab,talk-to-character,dot-discipline}`,
`/work/websites/{hammer,kira,opencrawl,agentify}`, and
`/work/brand-systems/{hammer,kira,effigy,agentify}`.

**Note (2026-05-13):** Brand-system detail pages summarize the guide inside
Hammer and link to the standalone guide artifact. Motion/video and production
artifacts can live directly inside Hammer as portfolio illustrations. Website
pieces use Hammer detail pages for the summary/preview, then link out to the
live public websites.

**Note (2026-05-13):** Category piece grids have Hammer-native SVG card assets
via `components/PieceArt.tsx`. These are portfolio plates, not substitutes for
finished case studies. The Rive MCP animation remains a collaborative build
before the animation category should be marked live.

**Note (2026-05-13):** Root social preview assets now generate from
`app/opengraph-image.tsx` and `app/twitter-image.tsx` using the Hammer wordmark
composition, cream/ink/cinnamon palette, and portfolio capability line.

**Note (2026-05-13):** The Rive MCP animation has a build brief at
`content/work/rive-mcp-animation-brief.md`. It defines the Hammer-branded
composition, state-machine inputs, export targets, site integration checklist,
and the decisions Jeff still needs to make during the collaborative Rive pass.

**Note (2026-05-15):** Rive puppet approval assets are prepared. The current
approval board is `public/work/animation/source/hammer-puppet-approval-board.html`
with desktop/mobile PNG snapshots beside it. Candidate 02 is visibly marked as
recommended. Run `npm run verify:rive-puppet` before any Rive work; do not
create the `.riv`, poster export, rig, animation, runtime install, or site
integration until Jeff explicitly approves a candidate.

**Note (2026-05-15):** Jeff approved candidate 01's character read, then
requested the production model be redesigned into a clean T-pose with no
storyboard/shot-board or held prop. Next session: Jeff signs up for Rive Cadet,
then create/approve the T-pose reference before rigging, animation, `.riv`
export, poster export, and Hammer site integration.

**Note (2026-05-14):** The public brand is always Hammer / `hammer`, regardless
of which final domain is purchased. The domain should appear only where the
actual URL matters: metadata/SEO, sitemap/robots, redirects, email/contact, and
agent-readable docs such as `llms.txt`.

**Note (2026-05-14):** Jeff purchased `hammer.ad`; it is now the canonical URL
for metadata, sitemap/robots, website-detail links, social images, Vercel
project domain wiring, host redirects, and `llms.txt`. Keep the public-facing
brand as Hammer. `www.hammer.ad` and `hammathyme.vercel.app` redirect to the
apex host.

**Note (2026-05-18):** Motion reel v3 was rebuilt and redeployed with the final
thank-you card stripped of the old email line. The Hammer contact surface now
uses `jeff@projectname.date` in `/contact`, mailto links, the console/LLM note,
pipeline-config mailto, `public/llms.txt`, and `public/memories/jeff.md`.

**Note (2026-05-21):** Deep SEO/agent-readability pass added a central
`lib/seo.ts` contract, JSON-LD on public pages, canonical metadata, explicit
AI crawler rules in robots, stable sitemap dates, `/llms-full.txt`, and
`/.well-known/agents.json`. Keep these surfaces in sync with route, contact,
and portfolio-readiness changes.

**Note (2026-05-25):** Search Console showed most Hammer pages as
`Discovered - currently not indexed` with one `Page with redirect`. Keep the
full sitemap as the canonical route inventory, and use `/sitemap-priority.xml`
as the compact Search Console submission/validation set for the highest-value
HTML pages: `/`, `/about`, `/contact`, `/work`, `/work/agents/kira`,
`/work/motion-graphics/reel`, `/work/motion-graphics/internet-capital-markets`,
`/work/pipelines-tools/pipeline-visualizer`,
`/work/brand-systems/hammer`, and `/work/websites/hammer`.

**Note (2026-05-25):** The audio-reactive video was rebuilt as a designed
response-overlay piece. The public page now uses the rendered 64s h264 asset
and poster. Labels avoid fake instrument language, and the final hammer lockup
was removed.

**Note (2026-05-24):** Run a simplification audit across the site detail
sub-pages. Reduce the massive amount of wording, preserve the strongest proof
and receipts, and make each page feel more visual, faster to scan, and more
Hammer-branded.

See `~/.claude/projects/-Users-hammer-Desktop-Claude-aiprod/memory/project_portfolio_categories.md` for fuller context.
