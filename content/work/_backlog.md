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
| 9 | Rive + Remotion puppet animation reel | animation | brief ready, collaborative build pending |
| 10 | Motion graphics reel | motion-graphics | live |
| 11 | ICM teaser, lower thirds + title package | motion-graphics | in production |
| 12 | Audio-reactive overlays with electronic track | motion-graphics | tomorrow build candidate |
| 13 | Animated short | animation | placeholder |
| 14 | Flux v2 LoRA training process | pipelines-tools | placeholder |
| 15 | Creative skills library | pipelines-tools | placeholder |
| 16 | Interactive + playable demos | interactive-playable | roadmap, after current motion/animation/site polish |
| 17 | Canonical domain wiring: `hammer.ad` | launch | done, live |

**Note (2026-05-04):** /notes route + `editorial-writing` capability tag dropped.
Jeff: "everyone can use ai to write things, its looked down upon. really i am
a visual ai producer." The site is now visual-only — 8 capability categories,
no blog. SEO is carried by portfolio copy, detail pages, /about metadata, and
structured metadata rather than editorial writing.

**Note (2026-05-13):** Category pages are gallery-first. Ready work opens in
detail routes, currently `/work/motion-graphics/reel`,
`/work/pipelines-tools/pipeline-visualizer`, `/work/agents/kira`,
`/work/websites/{hammer,kira,opencrawl,coefficient}`, and
`/work/brand-systems/{hammer,kira,effigy}`.

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

**Note (2026-05-14):** The public brand is always Hammer / `hammer`, regardless
of which final domain is purchased. The domain should appear only where the
actual URL matters: metadata/SEO, sitemap/robots, redirects, email/contact, and
agent-readable docs such as `llms.txt`.

**Note (2026-05-14):** Jeff purchased `hammer.ad`; it is now the canonical URL
for metadata, sitemap/robots, website-detail links, social images, Vercel
project domain wiring, host redirects, and `llms.txt`. Keep the public-facing
brand as Hammer. `www.hammer.ad` and `hammathyme.vercel.app` redirect to the
apex host.

See `~/.claude/projects/-Users-hammer-Desktop-Claude-aiprod/memory/project_portfolio_categories.md` for fuller context.
