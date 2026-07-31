# Hammer Agent Handoff - 2026-07-30

## Status
Two batches shipped this session, deployed to production and verified live.
Changes are validated but **uncommitted** in the working tree at wrap-up —
Jeff was told the diff is sitting for review. First pickup decision: commit
and push, or review first.

## What Shipped

### Batch 1 — audit hygiene + SEO fixes
- Deleted dead code: `components/EntryCurtain.tsx`, `components/IdleBreath.tsx`,
  `components/RoomWatermark.tsx`, `lib/rooms.ts`, the 7 stale `content/work/*.mdx`
  category files (kept `_backlog.md`), `content/agents/_drafts.md`.
- `AGENTS.md` repo-structure section updated to match (content/work is
  `_backlog.md` only; no more rooms.ts).
- `app/sitemap-priority.xml/route.ts`: added `/work/vfx-cgi/environment-swap`,
  home changefreq reconciled with `app/sitemap.ts` (monthly).
- `lib/seo.ts`: collection JSON-LD now keys detail URLs off `hasPieceDetail()`
  instead of `piece.status`; Equinox VideoObject URLs use
  `/work/film-animation/`; Person JSON-LD gained `areaServed` (LA / NY / remote).
- `app/robots.ts`: `Disallow: /api/`.
- Font contract: dropped JetBrains Mono + Playfair Display site loads
  (`app/layout.tsx`, `app/globals.css`); the two `components/PieceArt.tsx`
  usages now use Geist Mono / Instrument Serif. Brand is back to 4 faces.
- `noStore()` deduplicated into `lib/demo-guards.ts` (was copy-pasted in 3
  demo API routes).
- `public/work/visual-media/equinox/` renamed to `public/work/film-animation/`
  with the 4 code references updated. Known edge: externally indexed deep
  asset URLs under the old path 404 (single-segment legacy redirect);
  Jeff decided nobody links them — no `:path*` redirect needed.

### Batch 2 — coefficient websites piece (25th detail route)
- New piece: `/work/websites/coefficient` — coefficient.mythx.art Solana
  stake-pool health dashboard. Renders through the shared `WebsiteDetail`
  component, homogeneous with the other four website sub-pages.
- Screenshots captured from the live site:
  `public/work/websites/coefficient/{live,reach}.jpeg`.
- Synced in the same change: `lib/works.ts` (+ `DETAIL_READY_KEYS`),
  `public/llms.txt`, `public/llms-full.txt`, `public/.well-known/agents.json`,
  `public/memories/jeff.md` ("25 live"), `content/work/_backlog.md` counts.
- Sitemap + JSON-LD pick it up automatically from `lib/works.ts`.

## Jeff's content decisions (2026-07-30)
- Studioly finished films are NOT portfolio material. Breakwater will be
  restarted from scratch via GPT with film anchors — a future film-animation
  piece when it exists.
- Quill: no home on the site (undecided, leaning no).
- Coefficient: approved as a websites piece (shipped above).
- Artlist × Sony pitch: never ruled on — still needs Jeff's sensitivity call
  before any public use.

## Verification Already Run
- Local: `npm run lint`, `npm run typecheck`, `npm run verify:seo`,
  `npm run build` — all pass for both batches.
- Live: robots.txt serves `Disallow: /api/`; sitemap-priority includes
  environment-swap; `/work/visual-media/equinox` 308s correctly; renamed
  equinox assets 200; coefficient page live and visually compared against
  opencrawl (identical layout); coefficient in sitemap.xml and /work/websites.
- Vercel protection readback after both deploys: `ssoProtection: null`.

## Next Agent Startup
1. Read `AGENTS.md`, the vault note, this handoff, and run the Hammer startup check.
2. `git status` — if the two batches are still uncommitted, ask Jeff whether
   to commit + push before doing anything else.
3. If changing public routes or copy, update `lib/works.ts`, SEO/sitemap
   surfaces, `llms.txt`, `llms-full.txt`, and `agents.json` together.

## Open Items
- Commit + push the session's two batches (Jeff's call).
- Breakwater restart (GPT + film anchors) → future film-animation piece.
- Artlist × Sony pitch: sensitivity call pending.
- Deferred from the audit: 74 MB ICM video storage strategy, big-file
  consolidation (piece page 1.7k lines, PieceArt 886, InteractiveDemos 787),
  dependency bumps, per-piece OG images.
- Do not change Vercel settings beyond the standard post-deploy protection
  readback unless explicitly asked.
