# Rive puppet current gate

Updated: 2026-05-15T03:37:38-0700

## Objective

Use the Rive brief to make the puppet, rig it, and animate it. Jeff must
approve the design before Rive rigging starts.

## Current gate

Awaiting Jeff approval or redirect on one of:

`public/work/animation/source/hammer-puppet-premium-concept-01.png`

`public/work/animation/source/hammer-puppet-premium-concept-02.png`

Review board:

`public/work/animation/source/hammer-puppet-approval-board.html`

Static board snapshot:

`public/work/animation/source/hammer-puppet-approval-board.png`

Mobile board snapshot:

`public/work/animation/source/hammer-puppet-approval-board-mobile.png`

Recommended choice: candidate 02, because it has the stronger stylized
feature-animation silhouette and cleaner mascot read.

Approval manifest:

`content/work/rive-puppet-approval-manifest.json`

## Current status

- Premium design candidates: created.
- Approval board: created with candidate 02 visibly marked as recommended.
- Approval board snapshots: desktop and mobile created.
- Approval manifest: created with `approvalStatus: pending`.
- Approval gate verifier: created at `scripts/verify-rive-puppet-gate.mjs`.
- Repo agent guardrail: created at `AGENTS.md`.
- Post-approval Rive build packet: created.
- Completion audit: created at
  `content/work/rive-puppet-completion-audit.md`.
- Post-approval agent prompt: created with candidate 02 first at
  `content/work/rive-post-approval-agent-prompt.md`.
- Rive `.riv` rig: not created.
- Rive poster export: not created.
- Site runtime embed: not created.

## Next action

Jeff replies with one of:

- `approved candidate 01`: proceed to rebuild candidate 01 as Rive-native
  vector art, rig, animate, export `.riv` and poster, then integrate into the
  site.
- `approved candidate 02`: proceed to rebuild candidate 02 as Rive-native
  vector art, rig, animate, export `.riv` and poster, then integrate into the
  site.
- Specific design changes: revise the model-sheet candidate before any rigging.

## Do not do yet

- Do not import the bitmap as the puppet body.
- Do not create the final `.riv` before design approval.
- Do not add `@rive-app/react-webgl2` before the `.riv` exists.
- Do not add `components/RiveCartoonPuppet.tsx` before design approval and
  verified `.riv`/poster exports.
- Do not publish the animation piece before the Rive runtime and poster are
  verified.

## Gate check

Run before any Rive work:

```bash
npm run verify:rive-puppet
```
