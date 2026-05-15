# Rive puppet current gate

Updated: 2026-05-15T09:46:32-0700

## Objective

Use the Rive brief to make the puppet, rig it, animate it, export it for the
Hammer site, and integrate it only after the `.riv` and poster are verified.

## Current gate

Jeff approved the candidate 01 character read in chat:

`wow these 2 puppets look good approved candidate 1`

Jeff then clarified the production model needs to be redesigned into a T-pose
and should not include the storyboard/shot-board prop:

`while the design of the character is great, i think yes the character will need to be in a T pose and not have the storyboard as well`

Current status: candidate 01 is approved as the visual identity reference, but
the production Rive reference is pending until the T-pose/no-storyboard
revision is created and approved.

Character reference:

`public/work/animation/source/hammer-puppet-premium-concept-01.png`

Original review board:

`public/work/animation/source/hammer-puppet-approval-board.html`

Approval manifest:

`content/work/rive-puppet-approval-manifest.json`

## Current status

- Premium design candidates: created.
- Character read: candidate 01 approved.
- Production reference: pending T-pose/no-storyboard revision.
- Approval manifest: set to `approvalStatus: pending` until the revised
  production reference is approved.
- Rive Early Access desktop app: installed at
  `/Applications/Rive Early Access.app`.
- Rive MCP bridge: verified live while Rive Early Access is open. The local SSE
  endpoint returned an MCP session and listed Rive tools.
- Rive account plan: Jeff will sign up for Rive Cadet next session to unlock
  Early Access/export access.
- Rive `.riv` rig: not created.
- Rive poster export: not created.
- Site runtime embed: not created.

## Next session pickup

1. Jeff signs up for Rive Cadet and opens Rive Early Access.
2. Redesign candidate 01 into a clean front-facing T-pose production model:
   preserve the character identity, hair, glasses, headset, jacket, hands, and
   premium planes; remove storyboard/shot-board/clapperboard/clipboard/held
   props.
3. Get explicit approval of the T-pose production reference.
4. Build the Rive-native vector puppet, rig it, animate it, export
   `public/work/animation/hammer-puppet-rig.riv` and
   `public/work/animation/hammer-puppet-rig-poster.png`.
5. Install/wire the Rive runtime into the Hammer animation page and verify the
   site.

## Do not bypass

- Do not build the Rive rig from the old action pose with the board prop.
- Do not import the bitmap as the puppet body.
- Do not include a storyboard, shot-board, clapperboard, clipboard, or held prop
  in the production reference unless Jeff reverses this correction.
- Do not add `@rive-app/react-webgl2` before the `.riv` and poster exist.
- Do not add `components/RiveCartoonPuppet.tsx` before verified `.riv`/poster
  exports.
- Do not publish the animation piece before the Rive runtime and poster are
  verified.

## Gate check

Run before any Rive work:

```bash
npm run verify:rive-puppet
```
