# Rive MCP animation brief

Status: brief ready, collaborative build pending
Owner: Jeff + agent
Site category: `/work/animation`
Target piece: `puppet-rig-character`

## Goal

Create one Hammer-native Rive animation that proves the animation category:
a rigged character or production puppet controlled by a small state machine,
ready to show inside Hammer as a portfolio illustration.

The piece should feel like a compact production test, not a generic mascot.
It needs to demonstrate repeatable episodic output: pose control, expression
control, timeline states, and a clean web embed path.

## Brand frame

- Background: warm cream family, primarily `#FAEEE9` and `#F2DDD4`.
- Ink: deep maroon `#1F0707` for structure, rig lines, and type.
- Accent: cinnamon `#F28E86` for active joints, state changes, and the final
  controlled period moment.
- Deep accent: `#5A201D` only for held/pressed states or shadowed details.
- Type: Outfit for any display lockup, Geist Mono for state labels.
- No dark-mode pivot, purple/blue gradients, bokeh, or generic tech glow.
- The cinnamon dot should appear as a controlled circular brand mark or rig
  signal, never as random decorative punctuation.

## Composition

Primary artboard:

- `1200 x 1600`, matching the portfolio plinth ratio.
- Main puppet centered on a loose 12-column museum-plate grid.
- Bottom label strip reserved for a mono state readout.
- Safe area: keep critical motion within 10 percent of each edge.

Optional site detail crop:

- `1440 x 900` framing may be derived from the same Rive file for a future
  detail page, but the first acceptance target is the 3:4 plinth embed.

## Motion concept

Working title: `rig wakes up`.

Scene beats:

1. Idle pose: puppet stands quiet, joints dim, hairline rig visible.
2. Wake: cinnamon joint signals move from spine to shoulders to hands.
3. Produce: one hand pulls a small frame into view, like a shot board.
4. React: head and eyes track the frame, expression changes once.
5. Lockup: frame snaps into a clean Hammer plate, dot lands on baseline.
6. Loop: puppet settles back into idle without a hard jump.

Timing:

- Loop length: 6 to 8 seconds.
- Idle should breathe subtly, not bounce.
- State transitions use `--ease-cinema` or `--ease-soft` equivalents.
- No frantic motion. One meaningful accent beat per loop.

## Rive state machine

State machine name: `HammerPuppet`

Inputs:

- `hover` boolean: raises attention, brightens active joints, slight head turn.
- `focus` boolean: keyboard-accessible equivalent to hover.
- `mode` number:
  - `0` idle
  - `1` wake
  - `2` produce
  - `3` lockup
- `reducedMotion` boolean: disables camera-like movement and keeps only the
  static hero pose plus a single opacity change.

Animations:

- `idle_loop`
- `wake_signal`
- `produce_frame`
- `lockup_land`
- `reduced_idle`

Acceptance rule: the animation must still read as a finished portfolio asset
when `reducedMotion` is true.

## Rive MCP build checklist

- Create artboard and state machine with the names above.
- Keep shapes vector-native. Avoid embedded raster unless Jeff chooses a
  specific character reference.
- Use named groups for `puppet`, `rig`, `frame`, `state_label`, and `dot`.
- Expose inputs exactly as listed so the site embed can be simple.
- Export `.riv` to `public/work/animation/hammer-puppet-rig.riv`.
- Export static poster to `public/work/animation/hammer-puppet-rig-poster.png`.
- Add source notes or screenshots next to the exported asset if Rive MCP gives
  us a durable artifact log.

## Site integration checklist

- Add `/work/animation/puppet-rig-character` to ready detail routes only after
  the `.riv` and poster exist.
- Keep the category card live status unchanged until the detail route has a
  working embed and fallback.
- Use a client component for the Rive runtime, isolated from server components.
- Respect `prefers-reduced-motion` by setting `reducedMotion`.
- Card fallback: poster image.
- Detail fallback: poster image plus a short note if Rive runtime fails.

## Verification gate

Before marking the animation piece live:

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- Local production smoke at desktop and mobile.
- Browser check that the Rive canvas is nonblank.
- Browser check that hover/focus change the state machine.
- Browser check that reduced motion produces the static fallback behavior.
- Confirm no horizontal overflow on `/work/animation` or the detail route.

## Decisions to make together

- Puppet identity: abstract rig, Kira-adjacent character, or Jeff/producer
  silhouette.
- Whether the shot-board prop should show a real Hammer work frame.
- Whether the final lockup includes the full `hammer.` wordmark or just the
  controlled cinnamon dot.
- Whether the detail page should show Rive controls or keep controls hidden.
- Whether this becomes a Rive-only piece or a Rive plus Remotion rendered clip.
