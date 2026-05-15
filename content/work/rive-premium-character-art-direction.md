# Rive premium character art direction

## Correction

The current SVG puppet direction is not the approval target. It reads like a
cheap Flash-era rig sketch: flat fills, simple circles, stiff limbs, symbolic
hands, and no material depth. Keep it only as a technical layer-map prototype.

The approval design should feel like a premium animated feature character
adapted for Rive, not a web mascot.

## Premium target

Create an original Hammer producer character with:

- A distinctive silhouette readable in one second.
- A head shape that is not a generic circle.
- Asymmetry in hair, clothing, props, and pose.
- Large expressive eyes with lids, catchlights, and brow shapes.
- Appealing hand shapes with clear fingers and squashable palms.
- Layered clothing with visible construction: collar, seams, pockets, lanyard,
  jacket folds, soft undershirt, and production-tool details.
- Painterly lighting translated into vector-friendly shapes: soft cheek planes,
  warm rim light, ambient occlusion under chin/arms, and restrained highlights.
- A believable prop frame/shot-board that feels like part of the character's
  job, not a pasted rectangle.
- A body posture with intent: relaxed producer confidence, one hand presenting,
  one hand ready to cue the next shot.

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

## Design pipeline

1. Create a premium concept-art sheet first.
2. Choose the design only after Jeff approves the character read.
3. Convert the approved design into a Rive-native vector layer plan.
4. Preserve the premium read by building separate shaded planes, not only flat
   body-part cutouts.
5. Rig with bones, constraints, and Solos after the art direction is approved.

## Current candidate

Candidate 01:

`public/work/animation/source/hammer-puppet-premium-concept-01.png`

Candidate 02:

`public/work/animation/source/hammer-puppet-premium-concept-02.png`

Notes:

- These are the current design approval candidates.
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
utility jacket with soft undershirt, lanyard badge, headset mic, production
shot-board prop, confident relaxed pose, asymmetrical hair shape, large
expressive eyes with eyelids and catchlights, sculpted cheeks, clear brows,
appealing hands with fingers, subtle painterly shading translated into clean
vector-friendly shapes, front view, three-quarter view, expression set,
gesture hand set, mouth shape set, premium animation model sheet, not mascot,
not corporate clip art, not Flash animation, no black side-part hair, no
moustache, no uniform, no flat circle head, no circle hands, no text, no logo.

## Rive translation rule

The Rive version can be simpler than the concept, but it cannot collapse into
flat clip art. Every major shape needs at least one supporting plane:

- Head: base shape, cheek plane, brow plane, hair/headwear plane, rim accent.
- Eyes: whites, pupils, lids, catchlights, brow controls.
- Torso: jacket shell, inner shirt, collar, pocket/badge, shadow plane.
- Arms: upper/lower shapes plus sleeve cuff and elbow shadow.
- Hands: palm, thumb, finger groups, highlight plane.
- Prop: board body, inner panel, lines, dot accent, shadow plane.
