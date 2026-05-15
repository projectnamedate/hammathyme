# Rive premium vector extraction map

## Status

Prepared from candidate 01. This is a translation map only. It does not mean
the design is approved.

Source candidate:

`public/work/animation/source/hammer-puppet-premium-concept-01.png`

## Trace priority

Trace these first because they define the expensive read at card size:

1. Hair mass and outer silhouette.
2. Head and jaw shape.
3. Glasses, eyes, lids, brows, and catchlights.
4. High collar and jacket shell.
5. Presenting hand and board hand.
6. Shot-board prop.
7. Shoe and stance silhouette.

Only after those read correctly should smaller details be added.

## Simplification strategy

The concept art has painterly detail that would be too heavy if traced
literally. Convert it into clean Rive planes:

- Hair: 5 to 8 large locks plus 2 highlight planes.
- Face: base skin shape, cheek plane, nose plane, chin shadow, rim light.
- Eyes: whites, pupils, iris shade, upper lid, lower lid, catchlight.
- Brows: separate thick shapes, not strokes.
- Glasses: two lens rings, bridge, arms, small highlight strokes.
- Headset: ear cup, mic boom, mic dot, cable/strap if needed.
- Jacket: shell, inner lining, collar left, collar right, zipper strip, cuff
  shapes, pocket, badge, soft shadow planes.
- Hands: palm, thumb, index, grouped fingers, knuckle accent, nail/edge accent.
- Board: frame, paper face, panel grid, tape tabs, inset artwork blocks, dot.

## Layer-to-rig mapping

| Concept region | Rive layer/group | Rig behavior |
| --- | --- | --- |
| Hair silhouette | `hair_base`, `hair_lock_01` to `hair_lock_08` | Follows head bone; optional subtle secondary motion |
| Glasses | `glasses` | Follows head; no deformation |
| Eyes | `eye_L`, `eye_R`, `eye_L_highlight`, `eye_R_highlight` | Aim constrained by `lookX` and `lookY` |
| Lids | `lid_L`, `lid_R` | Blink timeline and expression swaps |
| Brows | `brow_L`, `brow_R` | Expression swaps and focused pose |
| Mouth set | `mouth_closed`, `mouth_small`, `mouth_open`, `mouth_smile`, `mouth_side_talk` | Mouth View Model swap |
| Head planes | `head`, `head_shadow`, `cheek_plane_L`, `cheek_plane_R`, `rim_light` | Follows head bone |
| Jacket body | `jacket_shell`, `shirt`, `torso_shadow` | Follows torso/spine bone |
| Collar | `jacket_collar_L`, `jacket_collar_R` | Follows torso with tiny idle offset |
| Lanyard/badge | `lanyard`, `badge` | Follows torso, optional small lag |
| Arms | `arm_L_upper`, `arm_L_lower`, `arm_R_upper`, `arm_R_lower` | Shoulder/elbow/wrist bones |
| Hands | `hand_*` groups | Hand targets and gesture swaps |
| Board prop | `frame_prop_*` | Presented by right hand, lockup target |
| Dot | `dot`, `frame_prop_dot` | Final lockup accent |

## Shapes that should remain vector-stable

These must be manually cleaned after tracing:

- Eye rings and glasses must stay circular enough to avoid shimmer.
- Hands must use broad shapes, not tiny finger strokes.
- Board edges should be straight enough to feel intentional.
- Jacket zipper and collar should not become noisy sketch texture.
- Hair locks should keep a readable silhouette without strand clutter.

## Rive acceptance checks

- At 360 px tall, the silhouette still reads as the premium candidate.
- Eyes still feel alive after simplification.
- Hands still read as real hands in rest and present poses.
- Jacket depth remains visible after flattening to vector planes.
- The board prop still feels integrated with the character.
- No moustache-like shadows or face-center rig lines are introduced.
