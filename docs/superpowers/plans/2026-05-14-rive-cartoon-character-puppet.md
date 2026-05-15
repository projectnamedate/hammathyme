# Rive Cartoon Character Puppet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Hammer-native 2D cartoon character puppet in Rive, control it through a clean View Model contract, and embed it in the Hammer animation portfolio only after the `.riv` and poster assets are verified.

**Architecture:** Treat Rive as the source of truth for character artwork, rigging, state machine behavior, and exported runtime asset. Treat Codex as the planning, prompt, integration, and verification layer. Use Rive AI Agent for editor scaffolding; use Rive MCP only if the local editor endpoint is available and verified.

**Tech Stack:** Rive Editor, Rive AI Agent, optional local Rive MCP endpoint, Rive Data Binding / View Models, `@rive-app/react-webgl2`, Next.js 16, Playwright/browser smoke checks.

---

## Execution Status

- Task 1: complete.
- Task 2: complete with a first vector reference asset saved as
  `public/work/animation/source/character-sheet-01.svg` and
  `public/work/animation/source/character-sheet-01.png`.
- Design approval gate: active. Jeff must approve the puppet design before
  Task 3 starts.
- Current approval candidate has been revised after design audit to avoid the
  bad historical-dictator read: no black side-part hair, no face-center rig
  line, no nose/mouth shadow, no suit/tie silhouette. The current direction is
  a soft auburn-haired creative producer with round glasses, headset, utility
  jacket, lanyard badge, and sneakers.
- Design quality gate updated: the current SVG remains a technical sketch only.
  It is not premium enough for final approval. The next approval artifact must
  be a high-budget model sheet/style frame based on
  `content/work/rive-premium-character-art-direction.md`.
- Premium candidate 01 created:
  `public/work/animation/source/hammer-puppet-premium-concept-01.png`.
  Awaiting Jeff approval before Rive rigging.
- Premium candidate 02 created:
  `public/work/animation/source/hammer-puppet-premium-concept-02.png`.
  Awaiting Jeff approval before Rive rigging.
- Approval board created:
  `public/work/animation/source/hammer-puppet-approval-board.html`.
- Approval manifest created:
  `content/work/rive-puppet-approval-manifest.json`, currently set to
  `approvalStatus: pending`.
- Approval gate verifier created:
  `npm run verify:rive-puppet`.
- Post-approval build packet prepared:
  `content/work/rive-premium-build-packet.md`.
- Current gate handoff saved:
  `content/work/rive-puppet-current-gate.md`.
- Completion audit saved:
  `content/work/rive-puppet-completion-audit.md`.
- Vector extraction map prepared:
  `content/work/rive-premium-vector-extraction-map.md`.
- Vector extraction map for candidate 02 prepared:
  `content/work/rive-premium-vector-extraction-map-02.md`.
- Post-approval agent prompt prepared:
  `content/work/rive-post-approval-agent-prompt.md`.
- Tasks 3-7: blocked until Rive Editor is installed/open and a `.riv` file can
  be created/exported.
- Local Rive MCP bridge check: `http://localhost:9791/sse` is not currently
  listening, so editor automation cannot start from Codex yet.

## Validation Log

- `git diff --check`: passed.
- `npm run verify:rive-puppet`: passed.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- `public/work/animation/source/character-sheet-01.png`: 1800 x 1200 PNG.
- `public/work/animation/source/hammer-puppet-design-approval.png`: 1800 x
  1200 PNG.
- `public/work/animation/source/hammer-puppet-motion-prototype.html`: checked
  in browser at 1440 x 900.
- `public/work/animation/source/hammer-puppet-premium-concept-01.png`: 1536 x
  1024 PNG.
- `public/work/animation/source/hammer-puppet-premium-concept-02.png`: 1536 x
  1024 PNG.
- `public/work/animation/source/hammer-puppet-approval-board.html`: checked in
  browser at 1440 x 900 and 390 x 844.

---

## File Map

- Modify: `content/work/rive-mcp-animation-brief.md`
  - Keep the canonical creative and technical contract for the animation piece.
- Create: `content/work/rive-cartoon-character-spec.md`
  - Character design, rig layers, expression set, gesture set, and control map.
- Create: `content/work/rive-cartoon-character-prompts.md`
  - Reusable prompts for character-sheet generation and Rive AI Agent scaffolding.
- Create: `content/work/rive-premium-character-art-direction.md`
  - Premium design target and model-sheet prompt after rejecting the cheap
    Flash-animation read.
- Create: `content/work/rive-premium-character-approval-01.md`
  - Audit notes, approval questions, and Rive translation notes for candidate
    01.
- Create: `content/work/rive-premium-character-approval-02.md`
  - Audit notes, comparison, and Rive translation notes for candidate 02.
- Create: `content/work/rive-premium-build-packet.md`
  - Exact post-approval Rive layer plan, rig plan, View Model mapping, state
    machine plan, and Rive AI Agent prompt.
- Create: `content/work/rive-premium-vector-extraction-map.md`
  - Candidate-to-Rive tracing priorities, simplification strategy, layer map,
    and vector acceptance checks.
- Create: `content/work/rive-premium-vector-extraction-map-02.md`
  - Candidate 02 tracing priorities, simplification strategy, layer map, and
    vector acceptance checks.
- Create: `content/work/rive-post-approval-agent-prompt.md`
  - Copy/paste prompt for the next agent once Jeff approves candidate 01 or
    candidate 02.
- Create: `content/work/rive-puppet-current-gate.md`
  - Current approval gate, next action, and do-not-start-yet constraints.
- Create: `content/work/rive-puppet-completion-audit.md`
  - Prompt-to-artifact checklist with evidence for complete, blocked, and
    missing objective requirements.
- Create: `public/work/animation/source/hammer-puppet-design-approval.svg`
  - User-facing design approval sheet with the selected puppet direction,
    expression set, gesture set, and rig map.
- Create: `public/work/animation/source/hammer-puppet-motion-prototype.html`
  - Browser preview of the intended motion beats before Rive build.
- Export later: `public/work/animation/hammer-puppet-rig.riv`
  - Final Rive runtime file.
- Export later: `public/work/animation/hammer-puppet-rig-poster.png`
  - Static fallback image.
- Create later: `components/RiveCartoonPuppet.tsx`
  - Client-only Rive runtime wrapper.
- Modify later: `app/work/[slug]/[piece]/page.tsx`
  - Add the live embed only after verified assets exist.
- Modify later: `package.json`
  - Add `@rive-app/react-webgl2` only when the `.riv` is ready.

---

## Task 1: Lock Character Direction

**Files:**
- Modify: `content/work/rive-mcp-animation-brief.md`
- Create: `content/work/rive-cartoon-character-spec.md`

- [x] **Step 1: Replace abstract-puppet language with cartoon-character language**

Use this direction:

```md
The character should read as an actual 2D cartoon performer, not an abstract rig diagram or generic mascot. The rig accents can be visible as secondary production detail, but the character is the hero.
```

- [x] **Step 2: Create the character spec**

Create `content/work/rive-cartoon-character-spec.md` with:

```md
# Rive cartoon character spec

## Direction

Build a Hammer-native 2D cartoon character puppet that feels like a working animation production asset. The first version should be original, readable at card size, and simple enough to rig cleanly in Rive.

## Recommended character

Hammer producer character: a compact cartoon filmmaker / AI producer with a strong head silhouette, expressive brows, simple jacket shape, visible hands, and a small shot-board prop. This avoids Kira continuity risk while still feeling like a real character.

## Alternate character paths

- Literal dog / pupper character: use if Jeff means "pupper" literally.
- Kira-adjacent cartoon: defer until the Rive pipeline works, because identity continuity raises the difficulty.

## Required character sheet

- Front-facing neutral pose
- Three-quarter pose
- Neutral, focused, surprised, pleased expressions
- Closed, small, open, smile mouth shapes
- Rest hand, pointing hand, presenting hand, wave hand
- Shot-board prop

## Rive layer map

- `character`
- `head`
- `neck`
- `torso`
- `arm_L_upper`
- `arm_L_lower`
- `hand_L_rest`
- `hand_L_point`
- `hand_L_present`
- `arm_R_upper`
- `arm_R_lower`
- `hand_R_rest`
- `hand_R_wave`
- `leg_L_upper`
- `leg_L_lower`
- `foot_L`
- `leg_R_upper`
- `leg_R_lower`
- `foot_R`
- `hair`
- `eye_L`
- `eye_R`
- `lid_L`
- `lid_R`
- `brow_L`
- `brow_R`
- `mouth_closed`
- `mouth_small`
- `mouth_open`
- `mouth_smile`
- `frame_prop`
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
- `gesture`: number, 0 rest, 1 point, 2 present frame, 3 wave
```

- [x] **Step 3: Verify docs**

Run:

```bash
git diff --check
```

Expected: no output.

---

## Task 2: Generate Character Sheet Reference

**Files:**
- Create: `content/work/rive-cartoon-character-prompts.md`
- Asset later: `public/work/animation/source/character-sheet-reference.png`

- [x] **Step 1: Save the character-sheet prompt**

Create `content/work/rive-cartoon-character-prompts.md` with:

```md
# Rive cartoon character prompts

## Character sheet prompt

Original 2D cartoon character sheet for a premium AI producer portfolio, clean vector-animation style, warm cream background, deep maroon linework, cinnamon accent details, compact filmmaker slash producer character, expressive head silhouette, simple jacket, readable hands, friendly but work-focused, not childish, not mascot-like, front pose, three-quarter pose, neutral expression, focused expression, surprised expression, pleased expression, closed mouth, small mouth, open mouth, smile mouth, pointing hand, presenting hand, waving hand, small shot-board prop, separated parts clearly visible for rigging, flat colors, clean shape language, no text, no logo, no complex background
```

- [x] **Step 2: Generate first reference**

Use the existing image generation workflow available in the session. Save
candidates under:

```txt
public/work/animation/source/
```

First saved reference:

```txt
character-sheet-01.svg
character-sheet-01.png
```

Recommended filenames for additional candidates:

```txt
character-sheet-02.svg
character-sheet-02.png
character-sheet-03.svg
character-sheet-03.png
```

- [x] **Step 3: Select one design**

Pick the design with:

- Strong silhouette at small size
- Simple limbs that can be separated cleanly
- Eyes and brows with clear expression potential
- Hands readable enough for point/present/wave gestures
- No fragile painterly texture that would be hard to rebuild in Rive

- [ ] **Step 4: Get Jeff design approval**

Create and present a finished-looking approval artifact before Rive work:

```txt
public/work/animation/source/hammer-puppet-design-approval.svg
public/work/animation/source/hammer-puppet-design-approval.png
public/work/animation/source/hammer-puppet-motion-prototype.html
public/work/animation/source/hammer-puppet-premium-concept-01.png
public/work/animation/source/hammer-puppet-premium-concept-02.png
public/work/animation/source/hammer-puppet-approval-board.html
```

Expected: Jeff explicitly approves or redirects the character design. Do not
start Task 3 until this approval happens.

Current note: the first SVG candidate is not the approval target. Premium
candidates 01 and 02 are the approval options on the board, with candidate 02
recommended as the stronger feature-animation direction.

---

## Task 3: Rebuild the Character as Rive-Native Vector Art

**Files:**
- Rive editor file
- Export later: `public/work/animation/hammer-puppet-rig.riv`
- Export later: `public/work/animation/hammer-puppet-rig-poster.png`

- [ ] **Step 1: Create the Rive artboard**

In Rive:

```txt
Artboard: HammerPuppet
Size: 1200 x 1600
Background: #FAEEE9
```

- [ ] **Step 2: Import the selected character sheet as a locked reference**

Use the selected sheet only as a tracing/design reference. Do not use it as the final rigged body.

- [ ] **Step 3: Rebuild each body part as separate vector layers**

Create the exact layer names from `content/work/rive-cartoon-character-spec.md`.

- [ ] **Step 4: Add face swap groups**

Use Solos or nested groups so runtime control can switch:

```txt
expression: neutral, focused, surprised, pleased
mouth: closed, small, open, smile
gesture: rest, point, present frame, wave
```

- [ ] **Step 5: Export a temporary poster**

Export:

```txt
public/work/animation/hammer-puppet-rig-poster.png
```

Expected: a finished static cartoon character, even before animation.

---

## Task 4: Rig the Cartoon Puppet in Rive

**Files:**
- Rive editor file
- Export later: `public/work/animation/hammer-puppet-rig.riv`

- [ ] **Step 1: Add bones**

Create bone chains:

```txt
spine_root -> chest -> neck -> head
shoulder_L -> elbow_L -> wrist_L
shoulder_R -> elbow_R -> wrist_R
hip_L -> knee_L -> ankle_L
hip_R -> knee_R -> ankle_R
```

- [ ] **Step 2: Bind limbs**

Bind each vector limb to its closest bone. Keep hands as separate swappable groups unless deformation is required.

- [ ] **Step 3: Add eye/head targets**

Create target groups:

```txt
look_target
hand_target_L
hand_target_R
foot_target_L
foot_target_R
```

- [ ] **Step 4: Add constraints**

Use:

```txt
Translation / transform constraints for eye tracking
IK constraints for arm target beats
IK constraints for planted feet only if legs are visible
Rotation constraints for head follow
```

- [ ] **Step 5: Keep the rig inspectable**

Use cinnamon `#F28E86` for optional rig accents, but keep them subtle. The visible character should still dominate.

---

## Task 5: Build the Rive View Model and State Machine

**Files:**
- Rive editor file

- [ ] **Step 1: Create View Model**

Create:

```txt
View Model: HammerPuppetVM
```

Properties:

```txt
hover: boolean
focus: boolean
mode: number
reducedMotion: boolean
lookX: number
lookY: number
expression: number
mouth: number
gesture: number
```

- [ ] **Step 2: Create timelines**

Create:

```txt
idle_loop
wake_signal
produce_frame
lockup_land
blink
mouth_cycle
gesture_point
gesture_wave
reduced_idle
```

- [ ] **Step 3: Create state machine**

Create:

```txt
State machine: HammerPuppet
```

Bind transitions to `HammerPuppetVM.mode` and `HammerPuppetVM.reducedMotion`.

- [ ] **Step 4: Test controls in Rive**

Manually change each View Model property and confirm:

```txt
hover/focus change attention
lookX/lookY move eyes/head
expression swaps face
mouth swaps mouth
gesture swaps or triggers hand pose
mode changes animation beat
reducedMotion shows static hero pose
```

---

## Task 6: Test Rive MCP Only If Local Editor Supports It

**Files:**
- No repo files unless endpoint is verified
- Optional later: `~/.codex/config.toml`

- [ ] **Step 1: Open Rive Early Access**

Rive must be open with the file loaded.

- [ ] **Step 2: Probe the old MCP endpoint**

Run:

```bash
curl -sS -m 2 -I http://localhost:9791/sse
```

Expected if available: an HTTP response from a local Rive service.

- [ ] **Step 3: Do not add durable config if the endpoint is closed**

Expected if unavailable:

```txt
curl: (7) Failed to connect
```

Stop and use Rive AI Agent/manual editor workflow.

- [ ] **Step 4: If endpoint works, test temporary Codex bridge**

Try direct streamable HTTP only if Codex accepts the endpoint:

```bash
codex mcp add rive-local --url http://localhost:9791/sse
codex mcp get rive-local
```

If direct setup fails because the endpoint is SSE-only, test an SSE-to-stdio bridge in a disposable session before editing `~/.codex/config.toml`.

---

## Task 7: Integrate Into Hammer After Assets Exist

**Files:**
- Modify: `package.json`
- Create: `components/RiveCartoonPuppet.tsx`
- Modify: `app/work/[slug]/[piece]/page.tsx`
- Asset: `public/work/animation/hammer-puppet-rig.riv`
- Asset: `public/work/animation/hammer-puppet-rig-poster.png`

- [ ] **Step 1: Install runtime**

Run only after `.riv` exists:

```bash
npm install @rive-app/react-webgl2@4.28.4
```

- [ ] **Step 2: Create client wrapper**

Create `components/RiveCartoonPuppet.tsx` as a client-only Rive wrapper that:

- Loads `/work/animation/hammer-puppet-rig.riv`
- Plays state machine `HammerPuppet`
- Sets reduced motion from `prefers-reduced-motion`
- Maps pointer position to `lookX` and `lookY`
- Sets `hover` and `focus`
- Falls back to poster if runtime fails

- [ ] **Step 3: Add the embed to the detail page**

Only make `/work/animation/puppet-rig-character` ready after the Rive canvas renders nonblank and controls respond.

---

## Task 8: Verification

**Files:**
- Full repo

- [ ] **Step 1: Run static checks**

```bash
npm run lint
npm run typecheck
npm run build
```

Expected: all pass.

- [ ] **Step 2: Run local production smoke**

```bash
npm run start -- --port 3003
```

Check:

```txt
http://localhost:3003/work/animation
http://localhost:3003/work/animation/puppet-rig-character
```

- [ ] **Step 3: Browser checks**

Verify:

- Rive canvas is nonblank
- Hover changes attention state
- Keyboard focus changes attention state
- Pointer movement changes eye/head target
- Reduced motion switches to static hero behavior
- Poster fallback displays if `.riv` fails
- No horizontal overflow on mobile

---

## Recommended First Decision

Start with the Hammer producer character, not Kira. If "pupper" means a literal dog character, use the same pipeline but change the character sheet prompt and layer map to dog anatomy.
