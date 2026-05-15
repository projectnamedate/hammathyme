# Rive puppet completion audit

Updated: 2026-05-15T09:46:32-0700

## Objective

Use the Rive brief to make the puppet, rig it, animate it, export it for the
Hammer site, and integrate it only after the design and runtime assets are
verified.

## Success criteria

- Rive brief is used as the source of truth.
- Premium puppet design is created for approval.
- Jeff approves the character read.
- The approved character is revised into a T-pose/no-storyboard production
  reference.
- Jeff approves the T-pose/no-storyboard production reference.
- Approved production reference is rebuilt as Rive-native vector artwork.
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
| Preserve approval gate | `content/work/rive-puppet-current-gate.md` says the T-pose/no-storyboard production reference must be approved before rigging | Complete |
| Premium design candidate 01 | `public/work/animation/source/hammer-puppet-premium-concept-01.png` exists | Complete |
| Premium design candidate 02 | `public/work/animation/source/hammer-puppet-premium-concept-02.png` exists | Complete |
| Character read approval | Jeff approved candidate 01 in chat: `wow these 2 puppets look good approved candidate 1` | Complete |
| Production correction | Jeff requested T-pose/no-storyboard before rigging | Complete |
| Revised T-pose production reference | Not created yet | Missing |
| Jeff approval of revised production reference | Not granted yet | Missing |
| Approval manifest | `content/work/rive-puppet-approval-manifest.json` exists and is back to `approvalStatus: pending` until the T-pose reference is approved | Complete |
| Approval gate verifier | `npm run verify:rive-puppet` passes in the current pending state | Complete |
| Repo agent guardrail | `AGENTS.md` requires the verifier and manifest before any Rive rebuild, rigging, animation, runtime install, or site integration | Complete |
| Post-approval build packet | `content/work/rive-premium-build-packet.md` exists and now targets T-pose/no-storyboard production work | Complete |
| Vector extraction map candidate 01 | `content/work/rive-premium-vector-extraction-map.md` exists | Complete |
| Vector extraction map candidate 02 | `content/work/rive-premium-vector-extraction-map-02.md` exists | Complete |
| Rive Early Access app | Installed at `/Applications/Rive Early Access.app` | Complete |
| Rive MCP bridge | `http://127.0.0.1:9791/sse` returned an MCP session and tool list while Rive Early Access was open | Complete |
| Rive Cadet plan | Jeff will sign up next session | Pending external action |
| Rive-native vector rebuild | Not started; wait for T-pose production reference approval | Blocked |
| Rive rig | `public/work/animation/hammer-puppet-rig.riv` does not exist | Blocked |
| Poster export | `public/work/animation/hammer-puppet-rig-poster.png` does not exist | Blocked |
| Site Rive runtime integration | Not started because `.riv` and poster do not exist | Blocked |

## Validation log

- `npm run verify:rive-puppet`: passed and reports
  `Rive puppet gate ok: pending; recommended=candidate-02`.
- `git diff --check`: passed.
- `find public/work/animation -maxdepth 2 \( -name 'hammer-puppet-rig.riv' -o -name 'hammer-puppet-rig-poster.png' \) -print`:
  no output; exports are absent.
- Rive Early Access install verified earlier in this session at
  `/Applications/Rive Early Access.app`.
- Rive MCP SSE endpoint and tool list verified earlier in this session while
  the app was open.

## Current answer

The goal is not complete. Candidate 01 is the approved character identity, but
the production reference must be redesigned into a T-pose with no
storyboard/shot-board or held prop. Next session starts with Jeff signing up
for Rive Cadet, then we create and approve the T-pose reference, build the
Rive-native vector puppet, rig/animate it, export the `.riv` and poster, and
integrate the verified runtime into the Hammer site.
