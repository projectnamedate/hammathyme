# Rive MCP animation brief

Status: research refreshed, collaborative build pending
Owner: Jeff + agent
Site category: `/work/animation`
Target piece: `puppet-rig-character`

## Goal

Create one Hammer-native Rive animation that proves the animation category:
a rigged 2D cartoon character controlled by a small state machine, ready to
show inside Hammer as a portfolio illustration.

The character should read as an actual cartoon performer, not an abstract rig
diagram or generic mascot. It needs to demonstrate repeatable episodic output:
pose control, expression control, timeline states, and a clean web embed path.

Design quality correction: the approval design must not look like cheap flat
Flash animation. Build the character from a premium model sheet and style
frame first, then translate it into Rive-native planes. The early SVG rig
sketch is only a technical layer map, not the final visual bar.

See `content/work/rive-premium-character-art-direction.md` for the current
premium target.

## Current tooling note

Rive's current docs mark the old MCP integration as deprecated in favor of the
built-in Rive AI Agent. Treat MCP as a bridge for editor control only if the
local Rive Early Access app exposes it. The durable runtime contract should be
Rive Data Binding / View Models, not legacy state-machine inputs.

For Codex, the current local setup does not include a Rive MCP server. If we
test the local Rive editor bridge, keep it temporary until the endpoint and
transport are verified.

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
- Main cartoon character centered on a loose 12-column museum-plate grid.
- Bottom label strip reserved for a mono state readout.
- Safe area: keep critical motion within 10 percent of each edge.

Character construction:

- Head, torso, neck, upper/lower arms, hands, upper/lower legs, feet, hair,
  eyes, lids, brows, mouth shapes, and prop hands should be separable layers.
- The design can be stylized, but it must preserve premium animated-character
  cues: distinctive silhouette, appealing eyes, shaped hands, layered clothing,
  controlled lighting planes, and asymmetry.
- Use visible rig accents only as a secondary production detail; the character
  should be the hero.

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

## Rive state machine and control contract

State machine name: `HammerPuppet`

View model name: `HammerPuppetVM`

Runtime properties:

- `hover` boolean: raises attention, brightens active joints, slight head turn.
- `focus` boolean: keyboard-accessible equivalent to hover.
- `mode` number:
  - `0` idle
  - `1` wake
  - `2` produce
  - `3` lockup
- `reducedMotion` boolean: disables camera-like movement and keeps only the
  static hero pose plus a single opacity change.
- `lookX` number: normalized eye/head target from `-1` to `1`.
- `lookY` number: normalized eye/head target from `-1` to `1`.
- `expression` number:
  - `0` neutral
  - `1` focused
  - `2` surprised
  - `3` pleased
- `mouth` number:
  - `0` closed
  - `1` small
  - `2` open
  - `3` smile
- `gesture` number:
  - `0` rest
  - `1` point
  - `2` present frame
  - `3` wave

Legacy-input fallback:

- If the editor/MCP path can only create state-machine inputs quickly, mirror
  the property names above as inputs during prototyping, then migrate the
  runtime-facing contract back to View Models before marking the piece live.

Animations:

- `idle_loop`
- `wake_signal`
- `produce_frame`
- `lockup_land`
- `blink`
- `mouth_cycle`
- `gesture_point`
- `gesture_wave`
- `reduced_idle`

Acceptance rule: the animation must still read as a finished portfolio asset
when `reducedMotion` is true.

## Rive MCP build checklist

- Create artboard, View Model, and state machine with the names above.
- Use a reference image only as a design guide. Rebuild the character as
  vector-native, layer-separated Rive artwork for rigging.
- Use named groups for `puppet`, `rig`, `frame`, `state_label`, and `dot`.
- Bind control properties exactly as listed so the site embed can be simple.
- Use bones for limbs/spine, constraints for eyes/head/hand targets, Solos or
  nested groups for face/mouth swaps, and IK for any planted feet or hand-target
  beats.
- Export `.riv` to `public/work/animation/hammer-puppet-rig.riv`.
- Export static poster to `public/work/animation/hammer-puppet-rig-poster.png`.
- Add source notes or screenshots next to the exported asset if Rive AI Agent
  or MCP gives us a durable artifact log.

## Agent-assisted editor workflow

Preferred path:

1. Generate or draw a cartoon character sheet with front pose, expression
   variants, hand poses, and a simple prop frame.
2. Rebuild the selected design as clean, layer-separated Rive vector artwork.
3. Use Rive's built-in AI Agent to scaffold the artboard, named groups,
   View Model, and state-machine shell.
4. Manually refine the character rig, bone weighting, constraints, face swaps,
   and timing inside the Rive editor.
5. If Rive MCP is available locally, use it for repetitive structure edits and
   inspection only after confirming the endpoint and transport in Codex.
6. Export `.riv` and poster assets, then integrate and verify in Hammer.

Codex/Rive MCP candidate:

- Rive's deprecated MCP docs show a local SSE endpoint at
  `http://localhost:9791/sse` while Rive Early Access is open.
- Codex currently supports stdio and streamable HTTP MCP servers. If the Rive
  endpoint is SSE-only, test an SSE-to-stdio bridge in a temporary setup before
  adding any durable `~/.codex/config.toml` block.

## Site integration checklist

- Add `/work/animation/puppet-rig-character` to ready detail routes only after
  the `.riv` and poster exist.
- Keep the category card live status unchanged until the detail route has a
  working embed and fallback.
- Use a client component for the Rive runtime, isolated from server components.
- Respect `prefers-reduced-motion` by setting `reducedMotion`.
- Add `@rive-app/react-webgl2` only when the `.riv` file is ready to embed.
- Card fallback: poster image.
- Detail fallback: poster image plus a short note if Rive runtime fails.

## Verification gate

Before marking the animation piece live:

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- Local production smoke at desktop and mobile.
- Browser check that the Rive canvas is nonblank.
- Browser check that hover/focus/look properties change the state machine.
- Browser check that reduced motion produces the static fallback behavior.
- Confirm no horizontal overflow on `/work/animation` or the detail route.

## Decisions to make together

- Character identity: Hammer producer character, Kira-adjacent cartoon, literal
  dog/pupper character, or another original cartoon performer.
- Whether the shot-board prop should show a real Hammer work frame.
- Whether the final lockup includes the full `hammer.` wordmark or just the
  controlled cinnamon dot.
- Whether the detail page should show Rive controls or keep controls hidden.
- Whether this becomes a Rive-only piece or a Rive plus Remotion rendered clip.
