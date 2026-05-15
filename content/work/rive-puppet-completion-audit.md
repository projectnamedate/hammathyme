# Rive puppet completion audit

Updated: 2026-05-14T23:16:00-0700

## Objective

Use the Rive brief to make the puppet, rig it, and animate it. Jeff must
approve the design before the Rive rigging phase starts.

## Success criteria

- Rive brief is used as the source of truth.
- Premium puppet design is created for approval.
- Jeff approves the design.
- Approved design is rebuilt as Rive-native vector artwork.
- Puppet is rigged with bones, constraints, expression swaps, mouth swaps, and
  gesture swaps.
- Puppet is animated with the planned idle, wake, produce, react, lockup, and
  reduced-motion states.
- `.riv` export exists at `public/work/animation/hammer-puppet-rig.riv`.
- Poster export exists at
  `public/work/animation/hammer-puppet-rig-poster.png`.
- Site integration is implemented only after verified `.riv` and poster assets
  exist.
- Validation passes: lint, typecheck, build, browser smoke checks.

## Evidence checklist

| Requirement | Evidence | Status |
| --- | --- | --- |
| Use the Rive brief | `content/work/rive-mcp-animation-brief.md` updated with premium character direction, View Model, state machine, motion, and verification gates | Complete |
| Preserve approval gate | `content/work/rive-puppet-current-gate.md` says Jeff approval is required before rigging | Complete |
| Premium design candidate 01 | `public/work/animation/source/hammer-puppet-premium-concept-01.png` exists | Complete |
| Premium design candidate 02 | `public/work/animation/source/hammer-puppet-premium-concept-02.png` exists | Complete |
| Approval board | `public/work/animation/source/hammer-puppet-approval-board.html` exists | Complete |
| Post-approval build packet | `content/work/rive-premium-build-packet.md` exists | Complete |
| Vector extraction map candidate 01 | `content/work/rive-premium-vector-extraction-map.md` exists | Complete |
| Vector extraction map candidate 02 | `content/work/rive-premium-vector-extraction-map-02.md` exists | Complete |
| Post-approval agent prompt | `content/work/rive-post-approval-agent-prompt.md` exists | Complete |
| Jeff design approval | No explicit approval received in chat | Blocked |
| Rive-native vector rebuild | Not started because approval is pending | Blocked |
| Rive rig | `public/work/animation/hammer-puppet-rig.riv` does not exist | Blocked |
| Poster export | `public/work/animation/hammer-puppet-rig-poster.png` does not exist | Blocked |
| Site Rive runtime integration | Not started because `.riv` and poster do not exist | Blocked |
| Rive editor bridge | No listener on `localhost:9791` in current checks | Blocked |

## Current answer

The goal is not complete. The next required action is Jeff approving candidate
01, approving candidate 02, or giving design changes.

Approval board:

`public/work/animation/source/hammer-puppet-approval-board.html`

Candidate image:

`public/work/animation/source/hammer-puppet-premium-concept-01.png`

`public/work/animation/source/hammer-puppet-premium-concept-02.png`
