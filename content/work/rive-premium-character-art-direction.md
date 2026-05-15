# Rive premium character art direction

## Correction

The current SVG puppet direction is not the approval target. It reads like a
cheap Flash-era rig sketch: flat fills, simple circles, stiff limbs, symbolic
hands, and no material depth. Keep it only as a technical layer-map prototype.

The approval design should feel like a premium animated feature character
adapted for Rive, not a web mascot.

## Production correction

Jeff approved the candidate 01 character read, then clarified the production
model must be in a clean T-pose and must not include the storyboard/shot-board
prop. Preserve the character identity, face, hair, glasses, headset, jacket,
hands, and premium rendering language from candidate 01, but revise the
production reference before Rive rigging.

## Premium target

Create an original Hammer producer character with:

- A distinctive silhouette readable in one second.
- A head shape that is not a generic circle.
- Asymmetry in hair, clothing, and silhouette details while keeping the body in
  a rig-friendly T-pose.
- Large expressive eyes with lids, catchlights, and brow shapes.
- Appealing hand shapes with clear fingers and squashable palms.
- Layered clothing with visible construction: collar, seams, pockets, lanyard,
  jacket folds, soft undershirt, and production-tool details.
- Painterly lighting translated into vector-friendly shapes: soft cheek planes,
  warm rim light, ambient occlusion under chin/arms, and restrained highlights.
- A body posture that is neutral and rig-friendly: front-facing T-pose, arms
  extended horizontally, relaxed hands, straight spine, planted feet.
- Production-tool details should come from clothing, headset, lanyard, badge,
  and shape language, not from a storyboard prop.

## Avoid

- Flat circle heads.
- Black side-part hair.
- Nose/mouth shadows or any moustache-like mark.
- Suit/tie or uniform silhouettes.
- Generic mascot proportions.
- Dot eyes with no eyelids or highlights.
- Circle hands.
- Perfectly symmetrical front-facing posture.
- One-color maroon dominance.
- Visible rig overlays in the approval design.
- Storyboard, shot-board, frame-board, clapperboard, clipboard, or any held prop
  in the production reference.
- Hero action poses, presenting gestures, or hands occupied by props in the
  production reference.

## Design pipeline

1. Create a premium concept-art sheet first.
2. Choose the design only after Jeff approves the character read.
3. Revise the approved character into a clean T-pose production model sheet
   with no storyboard/shot-board prop.
4. Convert the revised design into a Rive-native vector layer plan.
5. Preserve the premium read by building separate shaded planes, not only flat
   body-part cutouts.
6. Rig with bones, constraints, and Solos after the production reference is
   approved.

## Current candidate

Candidate 01:

`public/work/animation/source/hammer-puppet-premium-concept-01.png`

Candidate 02:

`public/work/animation/source/hammer-puppet-premium-concept-02.png`

Notes:

- These are the current design approval candidates.
- Jeff approved the candidate 01 character read, but the production reference
  now needs a T-pose/no-storyboard revision before Rive rigging.
- Candidate 02 is the current recommended direction.
- They should be treated as concept/model-sheet references, not runtime assets.
- See `content/work/rive-premium-character-approval-01.md` for the approval
  audit and Rive translation notes.
- See `content/work/rive-premium-character-approval-02.md` for the second
  candidate audit and Rive translation notes.
- See `content/work/rive-premium-build-packet.md` for the post-approval Rive
  build packet.

## Model sheet prompt

Premium 2D animated feature-film character model sheet for an original creative
producer character, high-budget animation studio quality, expressive appealing
character design, distinctive non-generic silhouette, warm cinematic cream
background, auburn and muted sage accents, deep maroon linework, layered
utility jacket with soft undershirt, lanyard badge, headset mic, clean
front-facing T-pose, arms extended horizontally, relaxed open hands, straight
spine, planted feet, asymmetrical hair shape, large expressive eyes with
eyelids and catchlights, sculpted cheeks, clear brows, appealing hands with
fingers, subtle painterly shading translated into clean vector-friendly shapes,
front view, three-quarter view, expression set, hand shape set, mouth shape
set, premium animation model sheet, rig-friendly separated body parts, not
mascot, not corporate clip art, not Flash animation, no black side-part hair,
no moustache, no uniform, no flat circle head, no circle hands, no text, no
logo, no storyboard, no shot-board, no clapperboard, no clipboard, no held prop.

## Rive translation rule

The Rive version can be simpler than the concept, but it cannot collapse into
flat clip art. Every major shape needs at least one supporting plane:

- Head: base shape, cheek plane, brow plane, hair/headwear plane, rim accent.
- Eyes: whites, pupils, lids, catchlights, brow controls.
- Torso: jacket shell, inner shirt, collar, pocket/badge, shadow plane.
- Arms: upper/lower shapes plus sleeve cuff and elbow shadow.
- Hands: palm, thumb, finger groups, highlight plane.
- Do not include a storyboard/shot-board prop in the production Rive rig.
