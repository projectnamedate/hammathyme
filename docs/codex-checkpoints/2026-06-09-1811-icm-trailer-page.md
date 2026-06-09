# 2026-06-09 18:11 - ICM trailer page

## Status

The ICM trailer page is implemented, committed, pushed to `main`, and live on production at `https://hammer.ad/work/motion-graphics/internet-capital-markets`.

## Goal

Add `/Users/hammer/Desktop/Claude/ICM/260405_ICM The Movie Trailer_CW_v04_web.mp4` as its own Hammer portfolio detail page, opened from the ICM card on the motion graphics page, matching the existing sub-page layout.

## Completed

- Added the ICM trailer video and generated poster under `public/work/motion/icm/`.
- Added `internet-capital-markets` as a live motion graphics piece.
- Reused the existing `/work/[category]/[piece]` detail-page pattern, with video support and `VideoObject` structured data.
- Updated SEO, sitemap, `llms.txt`, `llms-full.txt`, and `/.well-known/agents.json` surfaces for the new route.
- Committed and pushed `3bb49ab` (`Add ICM trailer detail page`) to `main`.
- Production deploy `dpl_5Jfh5v6kVLfTcPSCjSHJ9GJKVBaC` is Ready and aliased to `hammer.ad`, `www.hammer.ad`, and `hammathyme.vercel.app`.

## Current State

- Repo: `/Users/hammer/Desktop/Claude/aiprod`
- Branch: `main`
- Git state before this checkpoint: clean against `origin/main`, except existing untracked `.codex/`.
- Vercel project: `hammathyme`
- Vercel production URL: `https://hammer.ad`
- New live route: `https://hammer.ad/work/motion-graphics/internet-capital-markets`
- Video asset: `https://hammer.ad/work/motion/icm/icm-the-movie-trailer-web.mp4`
- Screenshot captured at `/tmp/hammer-icm-live-after-push.png`

## Decisions

- The public page title is `icm teaser`.
- The route slug is `internet-capital-markets`.
- The ICM card in the motion graphics category now opens the live detail page instead of a hash placeholder.
- The MP4 is committed directly to Git. GitHub accepted it but warned that `74.41 MB` is above the recommended `50 MB` file size.
- `.vercelignore` excludes `.codex` so local Codex state is not uploaded with Vercel builds.

## Changed Files

- `.vercelignore` - excludes local `.codex`.
- `app/work/[slug]/[piece]/page.tsx` - renders video pieces and `VideoObject` JSON-LD.
- `lib/works.ts` - marks ICM live and points it to the new route/video/poster.
- `lib/seo.ts` - adds the route to SEO/agent-readable route metadata.
- `app/sitemap-priority.xml/route.ts` - includes the ICM detail route.
- `content/work/03-motion-graphics.mdx` - updates the motion graphics category content/link.
- `content/work/_backlog.md` - updates ICM readiness state.
- `public/llms.txt`, `public/llms-full.txt`, `public/.well-known/agents.json` - add the route for crawlers/agents.
- `public/work/motion/icm/icm-the-movie-trailer-web.mp4` - new video asset.
- `public/work/motion/icm/icm-the-movie-trailer-poster.jpg` - generated poster frame.

## Verification

- `npm run lint` - passed.
- `npm run typecheck` - passed.
- `npm run verify:seo` - passed.
- `npm run build` - passed.
- `git diff --check` - passed before commit.
- `curl -sI https://hammer.ad/work/motion-graphics/internet-capital-markets` - returned `200`.
- `curl -sI https://hammer.ad/work/motion/icm/icm-the-movie-trailer-web.mp4` - returned `200` and `content-type: video/mp4`.
- `curl` checks confirmed the new route appears in `sitemap-priority.xml` and `/.well-known/agents.json`.
- Vercel project API check confirmed `ssoProtection: null`.
- Playwright screenshot confirmed the live page renders with the video poster and matching sub-page styling.

## Risks / Open Items

- GitHub warns about the committed MP4 size. It is below GitHub's hard `100 MB` limit, but future large video assets should likely move to object storage or Git LFS.
- Existing untracked `.codex/` remains untouched.

## Resume Prompt

Resume in `/Users/hammer/Desktop/Claude/aiprod`. The ICM trailer page is live and deployed. Start by checking `git status -sb`; the expected only pre-existing untracked item is `.codex/`. If continuing polish, inspect the live page at `https://hammer.ad/work/motion-graphics/internet-capital-markets` and consider long-term handling for large portfolio video assets.
