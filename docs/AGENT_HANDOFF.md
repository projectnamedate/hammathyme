# Hammer Agent Handoff - 2026-07-02

## Status
Hammer was clean and live after the first ComfyUI work. The older proof-page commit was `8c455ad Tighten ComfyUI gate proof page` on `main`, pushed to `origin/main`. A later correction reframed the item as a ComfyUI outfit morph.

2026-07-02 follow-up: Jeff correctly flagged that the page read like operational proof, not a portfolio item. The public framing is now **comfyui outfit morph**: the AIVFX Wan VACE ComfyUI graph for an outfit morph, with the workflow JSON available for download.

## What Shipped
- Live route: `https://hammer.ad/work/vfx-cgi/comfyui-production-backend`
- Downloadable public workflow file: `https://hammer.ad/work/vfx-cgi/comfyui-production-backend/outfit-morph-comfyui-workflow.json`
- The page should say what the portfolio item is: a real ComfyUI graph for an outfit morph.
- Do not call the public file a receipt. Call it workflow JSON or JSON.
- Keep defensive no-spend/no-render language off the public page.
- Machine-readable surfaces were updated: `public/llms.txt`, `public/llms-full.txt`, and `public/.well-known/agents.json`.

## Critical Boundary
The downloadable file is the AIVFX outfit-morph ComfyUI API workflow JSON copied from the approved morph source. It references local ComfyUI input media paths, so a third party may need matching media/model files to run it directly.

AIVFX state:
- AIVFX repo path: `/Users/hammer/Desktop/vibe/aivfx`
- Branch: `portfolio-projects-setup`
- Local-only HEAD at time of this handoff: `1345da6 Complete ComfyUI Gate checkpoint`
- AIVFX was not pushed.
- Treat any AIVFX runtime, model download, or paid GPU/provider work as approval-gated.
- Do not turn those internal gates into public copy for this Hammer portfolio item.

If Jeff asks for "the actual ComfyUI file," the next honest improvement is to create a downloadable workflow bundle from AIVFX, not to rewrite copy. Start in AIVFX with `check-aivfx`, pin the production node rows, and only then export/commit a real workflow artifact after approval.

## Files Touched In Hammer
- `app/work/[slug]/[piece]/page.tsx` - ComfyUI outfit morph detail renderer and download link.
- `lib/works.ts` - `comfyui-production-backend` live card copy.
- `public/work/vfx-cgi/comfyui-production-backend/outfit-morph-comfyui-workflow.json` - public workflow JSON.
- `public/llms.txt`, `public/llms-full.txt`, `public/.well-known/agents.json` - agent-readable route wording.
- `app/sitemap-priority.xml/route.ts` and `public/memories/jeff.md` were updated in the initial ship.

## Verification Already Run
- Local: `npm run verify:seo`, `npm run lint`, `npm run typecheck`, `npm run build`, `git diff --check`.
- Local production check: workflow JSON link and JSON route returned expected content.
- Mobile screenshot check: fixed the small `repo / report / blocked` row so it does not clip.
- Live production check: page, JSON route, agents manifest, and `llms-full.txt` returned `200`.
- Vercel protection readback: `passwordProtection: null`, `ssoProtection: null`.

## Next Agent Startup
1. Read `AGENTS.md`, the vault note, this handoff, and run the Hammer startup check.
2. Verify `git status --porcelain=v1 -b` before editing.
3. If changing public routes or copy, update `lib/works.ts`, SEO/sitemap surfaces, `llms.txt`, `llms-full.txt`, and `agents.json` together.
4. Keep the ComfyUI page portfolio-readable: outfit morph graph first, workflow JSON second.

## Open Items
- Optional: run a web performance check for the new route if Jeff asks.
- Optional: add a workflow bundle with input media/model notes if Jeff wants the download to be runnable out of the box.
- Do not change Vercel settings beyond the standard post-deploy protection readback unless explicitly asked.
