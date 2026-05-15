# Rive cartoon character prompts

## Character sheet prompt

Original 2D cartoon character sheet for a premium AI producer portfolio, clean
vector-animation style, warm cream background, deep maroon linework, cinnamon
accent details, compact filmmaker slash producer character, soft auburn hair,
round glasses, headset mic, utility work jacket, small lanyard badge, readable
hands, friendly but work-focused, not childish, not mascot-like, front pose,
three-quarter pose, neutral expression, focused expression, surprised
expression, pleased expression, closed mouth, small mouth, open mouth, smile
mouth, clean front-facing T-pose, arms extended horizontally, relaxed open
hands, hand shape set, separated parts clearly visible for rigging, flat
colors, clean shape language, no text, no logo, no complex background, no black
side-part hair, no moustache, no uniform silhouette, no central shadow under
the nose, no storyboard, no shot-board, no clapperboard, no clipboard, no held
prop

## Rive AI Agent scaffold prompt

Create a 1200x1600 artboard named HammerPuppet. Build the file structure for a
2D cartoon character puppet, not an abstract rig diagram. Create named groups:
character, head, neck, torso, arm_L_upper, arm_L_lower, hand_L_rest,
hand_L_point, hand_L_present, arm_R_upper, arm_R_lower, hand_R_rest,
hand_R_wave, leg_L_upper, leg_L_lower, foot_L, leg_R_upper, leg_R_lower,
foot_R, hair, glasses, headset, eye_L, eye_R, lid_L, lid_R, brow_L, brow_R,
mouth_closed, mouth_small, mouth_open, mouth_smile, dot, state_label.

Create a View Model named HammerPuppetVM with boolean properties hover, focus,
reducedMotion; number properties mode, lookX, lookY, expression, mouth, gesture.
Create a state machine named HammerPuppet with timelines idle_loop, wake_signal,
produce_frame, lockup_land, blink, mouth_cycle, gesture_point, gesture_wave,
reduced_idle. Bind transitions to HammerPuppetVM.mode and
HammerPuppetVM.reducedMotion. Use warm cream #FAEEE9, deep maroon #1F0707, and
cinnamon #F28E86 for rig accents.

## Manual Rive build prompt

Use the selected character sheet as reference only. Rebuild the character as
Rive-native vector shapes with separated body parts. Add bones for the spine,
arms, and legs. Use constraints for eye/head tracking and hand target beats.
Use Solos or nested groups for expression, mouth, and hand swaps. Keep rig
accents subtle so the cartoon performer remains the hero. Start from the
T-pose/no-storyboard production reference, not the earlier prop/action pose.
