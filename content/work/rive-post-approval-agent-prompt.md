# Rive post-approval agent prompt

Use this only after Jeff explicitly approves candidate 01 or candidate 02 and
then approves the revised production reference. Candidate 01's character read
is approved, but Jeff requested a T-pose/no-storyboard revision before Rive
rigging. Candidate 02 is the recommended direction. It remains the earlier
recommended alternate/reference from the original approval board.

## If Jeff approves candidate 02

```txt
Use the Rive brief and build packet to rebuild candidate 02 as a Rive-native
premium character puppet.

Approved design:
public/work/animation/source/hammer-puppet-premium-concept-02.png

Use these docs:
content/work/rive-mcp-animation-brief.md
content/work/rive-premium-build-packet.md
content/work/rive-premium-character-approval-02.md
content/work/rive-premium-vector-extraction-map-02.md

Do not import the bitmap as the puppet body. First revise the design into a
clean front-facing T-pose production reference with no storyboard, shot-board,
clapperboard, clipboard, or held prop. Rebuild the character as clean
Rive-native vector groups with premium planes for the auburn/sage hair-cap
silhouette, large eyes, glasses, lids, brows, mouth shapes, high-collar
jacket, hands, shadows, highlights, and rim light.

Create artboard HammerPuppet at 1200 x 1600. Create View Model
HammerPuppetVM and state machine HammerPuppet exactly as documented. Rig with
bones, constraints, face/mouth/gesture swaps, and reduced-motion behavior.
Export public/work/animation/hammer-puppet-rig.riv and
public/work/animation/hammer-puppet-rig-poster.png. Only after those exist,
wire the Rive runtime into the Hammer animation page and run lint, typecheck,
build, and browser smoke checks.
```

## If Jeff approves candidate 01

```txt
Use the Rive brief and build packet to rebuild candidate 01 as a Rive-native
premium character puppet.

Approved design:
public/work/animation/source/hammer-puppet-premium-concept-01.png

Use these docs:
content/work/rive-mcp-animation-brief.md
content/work/rive-premium-build-packet.md
content/work/rive-premium-character-approval-01.md
content/work/rive-premium-vector-extraction-map.md

Do not import the bitmap as the puppet body. First revise the design into a
clean front-facing T-pose production reference with no storyboard, shot-board,
clapperboard, clipboard, or held prop. Rebuild the character as clean
Rive-native vector groups with premium planes for head, hair, eyes, lids,
brows, mouth shapes, jacket, hands, shadows, highlights, and rim light.

Create artboard HammerPuppet at 1200 x 1600. Create View Model
HammerPuppetVM and state machine HammerPuppet exactly as documented. Rig with
bones, constraints, face/mouth/gesture swaps, and reduced-motion behavior.
Export public/work/animation/hammer-puppet-rig.riv and
public/work/animation/hammer-puppet-rig-poster.png. Only after those exist,
wire the Rive runtime into the Hammer animation page and run lint, typecheck,
build, and browser smoke checks.
```

## If Jeff asks for changes

```txt
Do not start Rive. Revise the premium design candidate first, update the
approval board, then wait for explicit approval.
```
