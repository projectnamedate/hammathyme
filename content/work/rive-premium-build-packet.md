# Rive premium build packet

## Status

Prepared for post-approval work. Do not execute this build packet until Jeff
approves candidate 01 or candidate 02 from the approval board. Candidate 02 is
the recommended direction.

## Source references

- Design approval board:
  `public/work/animation/source/hammer-puppet-approval-board.html`
- Premium concept candidate 01:
  `public/work/animation/source/hammer-puppet-premium-concept-01.png`
- Premium concept candidate 02, recommended:
  `public/work/animation/source/hammer-puppet-premium-concept-02.png`
- Vector extraction map candidate 01:
  `content/work/rive-premium-vector-extraction-map.md`
- Vector extraction map candidate 02:
  `content/work/rive-premium-vector-extraction-map-02.md`
- Technical rig sketch:
  `public/work/animation/source/hammer-puppet-design-approval.svg`
- Motion sketch:
  `public/work/animation/source/hammer-puppet-motion-prototype.html`

The approved concept art is the visual quality target. The SVG and HTML
sketches are only technical references for naming, state, and motion logic.
Use candidate 02 if Jeff approves the recommended direction.

## Artboard

- Artboard: `HammerPuppet`
- Size: `1200 x 1600`
- Background: `#FAEEE9`
- Safe area: 10 percent inset
- Poster export: `public/work/animation/hammer-puppet-rig-poster.png`
- Runtime export: `public/work/animation/hammer-puppet-rig.riv`

## Rive groups

Top-level groups:

- `character`
- `rig`
- `frame`
- `state_label`
- `dot`

Character subgroups:

- `head`
- `head_shadow`
- `cheek_plane_L`
- `cheek_plane_R`
- `neck`
- `hair_base`
- `hair_lock_01`
- `hair_lock_02`
- `hair_lock_03`
- `hair_lock_04`
- `hair_lock_05`
- `glasses`
- `headset`
- `eye_L`
- `eye_R`
- `eye_L_highlight`
- `eye_R_highlight`
- `lid_L`
- `lid_R`
- `brow_L`
- `brow_R`
- `mouth_closed`
- `mouth_small`
- `mouth_open`
- `mouth_smile`
- `mouth_side_talk`
- `torso`
- `torso_shadow`
- `shirt`
- `jacket_shell`
- `jacket_collar_L`
- `jacket_collar_R`
- `jacket_cuff_L`
- `jacket_cuff_R`
- `lanyard`
- `badge`
- `arm_L_upper`
- `arm_L_lower`
- `hand_L_palm`
- `hand_L_thumb`
- `hand_L_index`
- `hand_L_fingers`
- `hand_L_highlight`
- `arm_R_upper`
- `arm_R_lower`
- `hand_R_palm`
- `hand_R_thumb`
- `hand_R_index`
- `hand_R_fingers`
- `hand_R_highlight`
- `leg_L_upper`
- `leg_L_lower`
- `foot_L`
- `leg_R_upper`
- `leg_R_lower`
- `foot_R`
- `rim_light`

Prop subgroups:

- `frame_prop`
- `frame_prop_shadow`
- `frame_prop_board`
- `frame_prop_panel_01`
- `frame_prop_panel_02`
- `frame_prop_panel_03`
- `frame_prop_tape_01`
- `frame_prop_tape_02`
- `frame_prop_dot`

## Vector translation rules

- Do not import the concept image as the puppet body.
- Rebuild as Rive-native vectors with simplified premium planes.
- Preserve big readable shapes first: hair mass, collar, glasses, jacket,
  hands, prop board.
- Convert painterly texture into 2 to 4 clean shadow/highlight planes per major
  region.
- Keep fingers as grouped shapes so they can deform slightly without becoming
  rubber noodles.
- Keep the headset as a separate readable silhouette, but reduce call-center
  detail if it distracts from the producer read.

## Rig plan

Bone chains:

- Spine: pelvis, torso, neck, head.
- Left arm: shoulder, elbow, wrist, hand target.
- Right arm: shoulder, elbow, wrist, hand target.
- Left leg: hip, knee, ankle.
- Right leg: hip, knee, ankle.

Constraints:

- Head aim target bound to `lookX` and `lookY`.
- Eye aim target bound to `lookX` and `lookY`.
- Present-frame hand target for the prop gesture.
- Optional planted-foot IK for the loop settle.

Solo or swap groups:

- `expression`: neutral, focused, surprised, pleased.
- `mouth`: closed, small, open, smile, side-talk.
- `gesture`: rest, point, present-frame, wave.

## View Model

View Model: `HammerPuppetVM`

- `hover`: boolean
- `focus`: boolean
- `reducedMotion`: boolean
- `mode`: number, `0` idle, `1` wake, `2` produce, `3` lockup
- `lookX`: number, `-1` to `1`
- `lookY`: number, `-1` to `1`
- `expression`: number, `0` neutral, `1` focused, `2` surprised, `3` pleased
- `mouth`: number, `0` closed, `1` small, `2` open, `3` smile, `4` side-talk
- `gesture`: number, `0` rest, `1` point, `2` present frame, `3` wave

## State machine

State machine: `HammerPuppet`

Timelines:

- `idle_loop`
- `wake_signal`
- `produce_frame`
- `react_track`
- `lockup_land`
- `blink`
- `mouth_cycle`
- `gesture_point`
- `gesture_wave`
- `reduced_idle`

Timing:

- Total loop: 6 to 8 seconds.
- Idle: slow breathing, small hair/collar drift, no bounce.
- Wake: cinnamon signal moves through rig points in one clear pass.
- Produce: right hand presents the board, head and eyes track it.
- React: expression changes once, then settles.
- Lockup: board becomes a clean Hammer plate; cinnamon dot lands on baseline.
- Return: settle back to idle without a hard snap.

## Rive AI Agent prompt

Use after design approval:

```txt
Create a Rive file for a premium 2D animated character puppet named
HammerPuppet. Use the approved concept image as visual reference only; rebuild
the puppet as Rive-native vectors. Do not import the bitmap as the final
puppet.

Artboard: HammerPuppet, 1200 x 1600, background #FAEEE9.

Create top-level groups: character, rig, frame, state_label, dot.

Inside character, create clean vector groups for head, cheek planes, hair lock
groups, glasses, headset, eyes, lids, brows, mouth shapes, neck, jacket shell,
shirt, collars, lanyard, badge, arms, cuffs, hands, legs, feet, rim light, and
shadow planes. Preserve the premium model-sheet read: expressive eyes,
appealing hands, layered jacket, cinematic lighting planes, and the shot-board
prop. Avoid a flat web mascot look.

Create View Model HammerPuppetVM with properties: hover, focus, reducedMotion,
mode, lookX, lookY, expression, mouth, gesture.

Create state machine HammerPuppet with timelines: idle_loop, wake_signal,
produce_frame, react_track, lockup_land, blink, mouth_cycle, gesture_point,
gesture_wave, reduced_idle.

Use bones for spine, head, arms, and legs. Use constraints for head and eye
tracking, and a hand target for the present-frame gesture. Use Solos or nested
groups for expression, mouth, and gesture swaps.

Keep rig accents subtle. The character must remain the hero. Reduced motion
must still show a polished static character and a restrained dot/state change.
```

## Acceptance before site integration

- Jeff has approved the design.
- `.riv` export exists at `public/work/animation/hammer-puppet-rig.riv`.
- Poster exists at `public/work/animation/hammer-puppet-rig-poster.png`.
- Rive file exposes `HammerPuppetVM`.
- Rive file includes `HammerPuppet` state machine.
- Poster reads premium at card size.
- Reduced-motion state is intentional.
- Site integration has passed `npm run lint`, `npm run typecheck`, and
  `npm run build`.
- Browser check confirms the Rive canvas is nonblank and state changes work.
