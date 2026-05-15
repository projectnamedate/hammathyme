# Rive premium vector extraction map candidate 02

## Status

Prepared from candidate 02. This is a translation map only. It does not mean
the design is approved.

Source candidate:

`public/work/animation/source/hammer-puppet-premium-concept-02.png`

## Trace priority

Trace these first because they define candidate 02:

1. Hair/cap silhouette with the auburn sweep and sage side mass.
2. Large eyes, glasses, lids, and brows.
3. High collar, green jacket shell, and orange trim.
4. Headset and mic silhouette.
5. Presenting/pointing hands.
6. Board prop and lanyard/badge details.
7. Stance, shoes, and lower-body shape.

## Simplification strategy

- Hair/cap: 4 to 6 large auburn locks, sage side mass, 1 rim highlight.
- Face: base shape, cheek plane, nose plane, chin shadow, warm rim edge.
- Eyes: whites, pupils, lids, catchlights, brow controls, glasses rings.
- Mouth: closed, smile, small open, wide open, small o, half-smile.
- Jacket: green shell, high collar, orange lining/trim, zipper strip, cuffs,
  pocket/badge, lanyard.
- Hands: palm, thumb, index, grouped fingers, knuckle accents.
- Prop: board frame, panel paper, tape corners, inner thumbnail blocks, dot.

## Layer-to-rig mapping

| Concept region | Rive layer/group | Rig behavior |
| --- | --- | --- |
| Hair/cap silhouette | `hair_base`, `hair_lock_01` to `hair_lock_06`, `cap_sage_side` | Follows head; optional subtle secondary motion |
| Glasses and eyes | `glasses`, `eye_L`, `eye_R`, highlights and lids | Eye/head aim via `lookX` and `lookY` |
| Headset | `headset`, `mic_boom`, `mic_dot` | Follows head; no deformation |
| Face planes | `head`, `head_shadow`, `cheek_plane_L`, `cheek_plane_R`, `rim_light` | Follows head bone |
| Jacket | `jacket_shell`, `shirt`, `jacket_collar_L`, `jacket_collar_R`, `jacket_trim` | Follows torso/spine |
| Lanyard and badge | `lanyard`, `badge` | Follows torso with small lag if needed |
| Arms and hands | arm, cuff, palm, thumb, index, fingers groups | Bone chains, gesture swaps |
| Board prop | `frame_prop_*` groups | Present-frame hand target, lockup target |

## Rive acceptance checks

- Candidate remains more stylized than candidate 01 after simplification.
- Hair/cap silhouette is still distinctive at card size.
- Eyes and glasses keep the premium character read.
- Hands retain clear finger shapes.
- Jacket depth remains visible without noisy over-tracing.
- Headset does not overpower the face.
