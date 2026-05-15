# Rive cartoon character spec

## Direction

Build a Hammer-native 2D cartoon character puppet that feels like a working
animation production asset. The first version should be original, readable at
card size, and simple enough to rig cleanly in Rive.

The character should read as a cartoon performer first. Rig accents can appear
as subtle production detail, but the visible body, face, hands, and posture are
the hero.

## Recommended character

Hammer producer character: a compact cartoon filmmaker / AI producer with a
strong head silhouette, expressive brows, simple jacket shape, visible hands,
clean T-pose production stance, and no storyboard/shot-board prop. This avoids
Kira continuity risk while still feeling like a real character.

## Approval gate

Jeff must approve the visual character design before any Rive rigging or site
runtime integration proceeds. Approval should be based on a finished-looking
design sheet and motion prototype, not only the implementation plan.

The first SVG approval candidate is demoted to a technical rig sketch. It is
not premium enough for approval because it reads too much like cheap flat web
animation. Use `content/work/rive-premium-character-art-direction.md` as the
new design target before creating the final Rive puppet.

Post-approval correction: Jeff likes the candidate 01 character design, but the
production reference must be revised into a T-pose with no storyboard or held
prop before Rive rigging starts.

Design audit constraint: avoid any historical-dictator read. Do not use black
side-part hair, toothbrush-moustache shapes, a central shadow under the nose,
or a vertical rig line through the face. Use producer/artist cues such as round
glasses, soft auburn hair, a headset, or a beanie instead.

## Alternate character paths

- Literal dog / pupper character: use if Jeff means "pupper" literally.
- Kira-adjacent cartoon: defer until the Rive pipeline works, because identity
  continuity raises the difficulty.

## Required character sheet

- Front-facing neutral pose
- Clean T-pose production pose with arms extended horizontally
- Three-quarter pose
- Neutral, focused, surprised, pleased expressions
- Closed, small, open, smile mouth shapes
- Rest hand, pointing hand, presenting hand, wave hand
- Relaxed open hands suitable for rigging
- One finished premium style frame showing the character in a cinematic pose
- Rive simplification notes showing which painterly details become vector
  planes

## Rive layer map

- `character`
- `head`
- `head_shadow`
- `cheek_plane_L`
- `cheek_plane_R`
- `neck`
- `torso`
- `torso_shadow`
- `shirt`
- `jacket_shell`
- `jacket_collar_L`
- `jacket_collar_R`
- `lanyard`
- `badge`
- `arm_L_upper`
- `arm_L_lower`
- `sleeve_L_cuff`
- `hand_L_rest`
- `hand_L_point`
- `hand_L_present`
- `hand_L_highlight`
- `arm_R_upper`
- `arm_R_lower`
- `sleeve_R_cuff`
- `hand_R_rest`
- `hand_R_wave`
- `hand_R_highlight`
- `leg_L_upper`
- `leg_L_lower`
- `foot_L`
- `leg_R_upper`
- `leg_R_lower`
- `foot_R`
- `hair`
- `glasses`
- `headset`
- `rim_light`
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
- `dot`
- `state_label`

## Rive control contract

- `hover`: boolean
- `focus`: boolean
- `mode`: number, 0 idle, 1 wake, 2 produce, 3 lockup
- `reducedMotion`: boolean
- `lookX`: number, -1 to 1
- `lookY`: number, -1 to 1
- `expression`: number, 0 neutral, 1 focused, 2 surprised, 3 pleased
- `mouth`: number, 0 closed, 1 small, 2 open, 3 smile
- `gesture`: number, 0 rest, 1 point, 2 present, 3 wave

## Rigging notes

- Spine/head can be one short bone chain so the character has a clean attention
  pose without over-deforming the body.
- Arms should be bone-driven, with separate hand swaps for point, present, and
  wave.
- Face should use discrete brows, lids, eyes, and mouth shapes, not a single
  flattened face drawing.
- Eye/head tracking should be driven by targets bound to `lookX` and `lookY`.
- IK should be used only for target beats: planted feet, hand targets, pointing,
  or a wave gesture. Do not build a storyboard/shot-board prop target.

## Acceptance criteria

- Reads as an actual cartoon character at 360 px tall.
- All required layer names exist before rigging.
- Static poster looks finished even if the Rive runtime fails.
- Reduced-motion state still feels intentional.
- Rive runtime control can be mapped from React without bespoke per-shape code.
