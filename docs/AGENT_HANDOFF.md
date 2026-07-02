# Hammer Agent Handoff - 2026-07-02

## Status
Hammer is clean and live after the ComfyUI Gate work. The latest public site-change commit before this handoff is `8c455ad Tighten ComfyUI gate proof page` on `main`, pushed to `origin/main`. Production deploy `dpl_FJ1DFMt8hphdSMbrQrVm8buk1iXw` reached Ready and is aliased to `https://hammer.ad`.

## What Shipped
- Live route: `https://hammer.ad/work/vfx-cgi/comfyui-production-backend`
- Downloadable public proof file: `https://hammer.ad/work/vfx-cgi/comfyui-production-backend/gate-proof.json`
- The page now says exactly what exists: AIVFX repo command, graph hash, node counts, paid-render block status, and no GPU render.
- The vague "control layer" language was removed after Jeff called it out.
- Machine-readable surfaces were updated: `public/llms.txt`, `public/llms-full.txt`, and `public/.well-known/agents.json`.

## Critical Boundary
The downloadable file is a proof JSON receipt, not a rendered ComfyUI output and not a full ComfyUI workflow bundle. Do not imply Modal/ComfyUI was launched.

AIVFX state:
- AIVFX repo path: `/Users/hammer/Desktop/vibe/aivfx`
- Branch: `portfolio-projects-setup`
- Local-only HEAD at time of this handoff: `1345da6 Complete ComfyUI Gate checkpoint`
- AIVFX was not pushed.
- No Modal app was launched.
- No model was downloaded.
- No paid GPU/provider call was made.
- Paid render remains blocked until 9 production node commits are pinned and Jeff explicitly approves runtime/spend.

If Jeff asks for "the actual ComfyUI file," the next honest improvement is to create a downloadable workflow/proof bundle from AIVFX, not to rewrite copy. Start in AIVFX with `check-aivfx`, pin the production node rows, and only then export/commit a real workflow artifact after approval.

## Files Touched In Hammer
- `app/work/[slug]/[piece]/page.tsx` - ComfyUI Gate detail renderer and download link.
- `lib/works.ts` - `comfyui-production-backend` live card copy.
- `public/work/vfx-cgi/comfyui-production-backend/gate-proof.json` - public proof receipt.
- `public/llms.txt`, `public/llms-full.txt`, `public/.well-known/agents.json` - agent-readable route wording.
- `app/sitemap-priority.xml/route.ts` and `public/memories/jeff.md` were updated in the initial ship.

## Verification Already Run
- Local: `npm run verify:seo`, `npm run lint`, `npm run typecheck`, `npm run build`, `git diff --check`.
- Local production check: proof link text and proof JSON returned expected content.
- Mobile screenshot check: fixed the small `repo / report / blocked` row so it does not clip.
- Live production check: page, proof JSON, agents manifest, and `llms-full.txt` returned `200` and contained the new proof wording.
- Vercel protection readback: `passwordProtection: null`, `ssoProtection: null`.

## Next Agent Startup
1. Read `AGENTS.md`, the vault note, this handoff, and run the Hammer startup check.
2. Verify `git status --porcelain=v1 -b` before editing.
3. If changing public routes or copy, update `lib/works.ts`, SEO/sitemap surfaces, `llms.txt`, `llms-full.txt`, and `agents.json` together.
4. Keep the ComfyUI page blunt: file exists, render not run, paid render blocked. Do not add broad AI marketing language.

## Open Items
- Optional: run a web performance check for the new route if Jeff asks.
- Optional: strengthen the proof by adding an actual downloadable ComfyUI workflow/proof bundle, but only after AIVFX-side approval and verification.
- Do not change Vercel settings beyond the standard post-deploy protection readback unless explicitly asked.
