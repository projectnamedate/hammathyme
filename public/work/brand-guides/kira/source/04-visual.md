# 04 — Visual Identity

The visual system is a specification, not a mood board. Every value below traces to `tokens.json` or `reference_kira_postprocess_v8.md`. If it's not in one of those two sources, it is not canon. The visual model renders Kira; this system renders the world around her.

---

## 1. Design tokens

Reference only. Actual values live in `/docs/brand/tokens.json` and are consumed by the HTML build layer. The swatches below describe role, not hex — the build renders the chip colors from the token file.

### 1a. Editorial palette — `color.editorial.*`

Used on editorial pages (this brand bible, long-form writing, case studies). Warm paper-on-ink register.

| Token | Role |
|---|---|
| `color.editorial.bg.cream` | Default page background. Warm, not white. |
| `color.editorial.bg.cream.deep` | Card background within cream pages. |
| `color.editorial.ink.primary` | Body text. Not pure black — a deep, readable ink. |
| `color.editorial.ink.muted` | Secondary text, captions, meta. |
| `color.editorial.copper` | Accent. Tied directly to kira's hair dye — editorial pages use this as the character-anchor color. |
| `color.editorial.copper.deep` | Copper shadow for hover states and depth. |

### 1b. Tech palette — `color.tech.*`

Used on tech-spec pages (tokens, pipeline docs, developer references, this file's workflow tables when rendered). High-contrast, terminal-coded.

| Token | Role |
|---|---|
| `color.tech.bg.void` | Default page background. Near-black, not pure black. |
| `color.tech.bg.panel` | Card background. |
| `color.tech.bg.line` | Grid lines, dividers, subtle rules. |
| `color.tech.ink.bone` | Body text on void. |
| `color.tech.ink.muted` | Secondary text, labels. |
| `color.tech.orange.accent` | Accent. Hotter than editorial copper — this is the runtime-data color. |
| `color.tech.orange.deep` | Orange shadow, active states. |

### 1c. Shared palette — `color.shared.*`

Used across both editorial and tech. Functional, not decorative.

| Token | Role |
|---|---|
| `color.shared.btc.orange` | Bitcoin identity accent. Bridges crypto layer and hair layer — intentional double-duty. |
| `color.shared.signal.green` | Positive data indicators (P&L up, system healthy, etc.). |
| `color.shared.signal.red` | Critical / crisis indicators (P&L down, takedown events, system unhealthy). |

### 1d. Character palette — `color.character.*`

The color anchors that define Kira as a visual entity. These are reference colors for audit pipelines — not page colors.

| Token | Role |
|---|---|
| `color.character.hair.copper` | The exact copper of kira's dye — sampled for glasses-and-hair verification. |
| `color.character.hair.dark_root` | The dark root anchor — verifies the dye-job aesthetic (not solid-red wig). |
| `color.character.skin.olive.base` | Warm olive skin reference. Verifies ambiguous ethnicity rendering. |
| `color.character.eyes.hazel` | Hazel eye reference. |

---

## 2. Typography

Three families, three roles. Never improvise — if a surface doesn't fit one of the three roles, it's not part of the system.

### 2a. Display — Playfair Display (serif)

- `type.display.family`
- **Role:** editorial headlines, section openers, pull quotes
- **Weights available:** 400, 600, 800
- **Use:** editorial pages only. NEVER use display on tech-spec pages — the whole point of the tech register is that it doesn't use a serif.

### 2b. Body — Inter (sans)

- `type.body.family`
- **Role:** body copy, navigation, captions
- **Weights available:** 400, 500, 600, 700
- **Use:** universal. Runs on editorial and tech pages equally. This is the workhorse.

### 2c. Mono — JetBrains Mono

- `type.mono.family`
- **Role:** tech-spec pages, tokens, data tables, code blocks, filter strings
- **Weights available:** 400, 500, 700
- **Use:** tech pages primarily. Editorial pages may use mono only for code snippets or spec callouts inline.

### 2d. Scale

From `type.scale`: `xs` 0.75rem → `sm` 0.875 → `base` 1 → `md` 1.125 → `lg` 1.375 → `xl` 1.75 → `2xl` 2.25 → `3xl` 3 → `4xl` 4.5 → `5xl` 6 → `display` clamp(3rem, 10vw, 9rem).

### 2e. Pairing rules

- **Editorial pairing:** Playfair Display (display) + Inter (body). Serifed headline, clean sans body. Mono inline only for code.
- **Tech pairing:** Inter (body) + JetBrains Mono (accents, headers on tech pages, tables, data). No serif anywhere on tech pages.
- **Never mix:** don't use Playfair on tech pages. Don't use JetBrains Mono for body copy on editorial pages.

---

## 3. Signature visual anchors

Seven non-negotiable codes. These are what make Kira *Kira* and not any other generated woman. Every image must pass all seven. Anchors are sourced from `tokens.json → character_visual_anchors.non_negotiable` and `characters/kira.yaml`.

### 3.1 Copper-orange hair over dark base, visible dark roots

- **Why non-negotiable:** This is the brand color anchor. It ties to `color.character.hair.copper` AND to `color.shared.btc.orange` — the character and the crypto identity share a color space on purpose.
- **Common failure:** Model generates solid redhead without root contrast. Verify dark roots are visible in every render. A solid orange wig is NOT kira.

### 3.2 Round black wireframe glasses — MANDATORY

- **Why non-negotiable:** Single strongest silhouette element. Face-sim would fail without it. Character recognizability at thumbnail size depends on it.
- **Common failure:**  polish and face editors silently drop glasses. ALWAYS verify post-generation. A glasses-less Kira is a re-roll, no exceptions.

### 3.3 Freckles across nose and cheeks

- **Why non-negotiable:** Photorealism anchor. Smooth-skin renders read as plastic-CG — freckles break that.
- **Common failure:** Heavy post-process or  smoothing erases freckles. If the face looks porcelain, the recipe is wrong.

### 3.4 Warm olive skin, ambiguous ethnicity

- **Why non-negotiable:** Market positioning — "no default white influencer face." Locked in training data, must hold in output.
- **Common failure:** image model base tends to lighten skin on high-key lighting setups. Prompt must reinforce "warm olive," not lean on visual model alone in bright scenes.

### 3.5 Hazel eyes

- **Why non-negotiable:** Consistency anchor — always hazel (green-brown), never bright blue or green.
- **Common failure:** Close-up shots with strong color grades can shift eye color. Verify on cinematic and candid close-ups especially.

### 3.6 Slim athletic C-cup curvaceous, tall-model proportions

- **Why non-negotiable:** The "Aitana Lopez mirror strategy" requires the body type. This is monetization architecture, not a cosmetic choice.
- **Common failure:** Prompt over-emphasis on "curvaceous" can push proportions cartoonish. Hold the line: slim athletic FIRST, curves on top.

### 3.7 Solo frame, no background people

- **Why non-negotiable:** Legal liability (no real-person faces in the background ever) + brand clarity (she's the subject, always). No exceptions for "crowd" shots.
- **Common failure:** Generators add background pedestrians in candid/street scenes. Negative prompt "people in background, crowd, bystanders" is mandatory for street-context prompts.

---

## 4. Variable elements

From `tokens.json → character_visual_anchors.variable`. These rotate freely.

- **Hairstyle** — up, down, braids, ponytail, messy bun. The COLOR must hold. The style can change any render.
- **Outfit** — she has no default look. She can wear anything. Athleisure, formal, streetwear, cozy, stripped-down Fanvue fits — all canon. The OUTFIT is not her identity; the FACE is.
- **Setting** — rotates per content type per the 8-workflow matrix. Bedroom (selfie), studio (vlog), street / café / gym (candid), cinematic rig location (cinematic).
- **Jewelry / accessories** — chains, earrings, rings — all variable. The hoodie is NOT identity. The glasses are.

---

## 5. NEVER show

From `tokens.json → character_visual_anchors.never_show`, plus discipline tightening.

- **Background people in frame** — legal risk (real-person face in output) and brand risk (the camera is on her, always).
- **Real-person faces** — anywhere, at any scale. Hard legal line.
- **Hoodie-as-identity** — the hoodie is an accessory, not a brand element. "Hoodie Kira" is not canon.
- **Accessories-as-brand** — jewelry, earrings, necklaces, hats are variable, not identity.
- **Generic-AI-girl aesthetic** — plastic skin, perfect symmetry, uncanny-smooth, 3D-CG look. If the output looks like it could headline a  Discord showcase, the recipe is wrong.

---

## 6. Shot-list-as-spec per workflow

The visual-system equivalent of a dev API reference. Eight workflows, four modes × photo/video. Everything here traces to `reference_kira_postprocess_v8.md` and `tokens.json → grade.*` and `tokens.json → lens.*`.

### Workflow 1 — Selfie Photo (LOCKED)

| Field | Value |
|---|---|
| Mode | Selfie |
| Format | Photo |
| Aspect | 4:5 or 9:16 |
| Lens | `lens.selfie` — 26mm equivalent, phone 1x, f/1.8, deep DOF |
| Light | `light.ugc.warm.key` — overhead warm lamp + phone screen fill, 3200K, 1:0.6 ratio |
| Post recipe | `grade.ugc.selfie` — warm shift +4R/-3B, shadows lift +5, noise 3.0, contrast ×1.025, NO chromatic aberration |
| Output | JPEG q=90 |
| Status | **LOCKED** |

### Workflow 2 — Selfie Video (LOCKED)

| Field | Value |
|---|---|
| Mode | Selfie |
| Format | Video |
| Aspect | 4:5 or 9:16 (inherits from still) |
| Lens | `lens.selfie` — 26mm equivalent |
| Engine | video model (`fal-ai/kling-video/v3/pro/image-to-video`) |
| Post recipe | `grade.selfie.video` |
| ffmpeg filter | `scale=iw*1.01:ih*1.01,crop=iw/1.01:ih/1.01:(iw-iw/1.01)/2+random(0)*1-0.5:(ih-ih/1.01)/2+random(1)*1-0.5,vignette=PI/7,colorbalance=rs=0.0075:bs=-0.004,eq=contrast=0.985` |
| Key params | Shake 1px, vignette PI/7, warmth +0.75% red, contrast ×0.985 |
| Encode | libx264, CRF 24 |
| Status | **LOCKED** |

### Workflow 3 — Vlog Photo (LOCKED)

| Field | Value |
|---|---|
| Mode | Vlog |
| Format | Photo |
| Aspect | 16:9 |
| Lens | `lens.vlog` — 35mm, Canon R6 equivalent, f/2.8, shallow DOF |
| Light | `light.vlog.natural.window` — large soft window key + bounce fill, 5000K, 1:0.7 ratio |
| Mic | SM7B visible in scene (boom arm or lavalier) — triggers podcast audio in video-adjacent generation |
| Post recipe | `grade.vlog.photo` — color ×0.93 (desat), contrast ×0.96, vignette 5%, NO warm shift, NO grain |
| Output | JPEG q=78 (Twitter-level compression) |
| Status | **LOCKED** |

### Workflow 4 — Vlog Video (LOCKED)

| Field | Value |
|---|---|
| Mode | Vlog |
| Format | Video |
| Aspect | 16:9, 1344×768 still native |
| Lens | `lens.vlog` — 35mm Canon R6, f/2.8 |
| Pipeline | image model + visual model still (visible mic) → upscaler 2x → video model with podcast audio prompt block → ffmpeg CRF 15 re-encode |
| Mandatory prompt block | "she stays in sharp focus throughout, camera focus locked on her face" + "crisp and sharp detail throughout, professional 4K video quality" + "podcast quality audio, clear studio microphone, warm full vocal presence, dry close-mic recording, no echo, no reverb, no room ambience" |
| visual model scale | 1.05–1.1 for identity lock on widescreen |
| Post recipe | `grade.vlog.video` — `ffmpeg -c:v libx264 -crf 15 -c:a copy` |
| Status | **LOCKED** |

### Workflow 5 — Candid Photo (LOCKED)

| Field | Value |
|---|---|
| Mode | Candid (Instagram-influencer register — NOT documentary photojournalism) |
| Format | Photo |
| Aspect | 4:5 or 9:16 |
| Lens | `lens.candid` — 35mm, hip-height third-person, f/4 |
| Light | `light.candid.golden` — outdoor golden hour side, 2800K, 1:0.4 |
| Post recipe | `grade.candid.photo.v10` — brightness +7, contrast ×0.94, matte blacks point 6, split tone (+2R shadows / +1B highlights), vignette 8%, grain tool type 1 power 0.3 |
| Output | PNG (preserves grain) |
| Status | **LOCKED (V10)** |

### Workflow 6 — Candid Video (LOCKED 2026-04-12)

| Field | Value |
|---|---|
| Mode | Candid |
| Format | Video |
| Aspect | 4:5 portrait input → 9:16 video model output |
| Still spec | image model 1344×1728 clean (no V10 photo post — video model repaints face) |
| Upres | upscaler 2x → ~2688×3456 |
| Engine | video model, `generate_audio: true`, ambient audio (speech negative-prompted) |
| Prompt discipline | Shortest natural scene description. No motion-dampener language ("softly", "slowly"). No rendering directives ("24fps", "natural tempo"). See `feedback_kling_rules.md` |
| Negative prompt | `slow motion, slo-mo, slowed down, time dilation, reduced playback speed, speaking, talking, dialogue, voice, words, lip movement, mouth movement, music, soundtrack, extra fingers, six fingers, deformed hands, distorted face, identity drift` |
| Post recipe | `grade.candid.video` — three-stage: ffmpeg color extract → grain tool per frame → ffmpeg reassemble |
| Stage A (color) | `ffmpeg -vf "eq=brightness=0.027:contrast=0.94,colorbalance=rs=0.008:bh=0.004,vignette=PI/8"` |
| Stage B (grain) | grain tool: type 1, power 0.3, shadows 0.05, highs 0.05, scale 1.0 (NEVER ffmpeg noise=) |
| Stage C (encode) | libx264 CRF 20, aac 192k audio |
| Status | **LOCKED** |

### Workflow 7 — Cinematic Photo (LOCKED)

| Field | Value |
|---|---|
| Mode | Cinematic |
| Format | Photo |
| Aspect | **ASK USER** — 2.35:1 anamorphic (1536×656 native) OR 16:9 (1344×768). Never crop anamorphic in post. |
| Lens | `lens.cinematic` — 50mm anamorphic, f/1.4–f/2.8 |
| Light | `light.cinematic.side.soft` — large soft side + negative fill, 4000K, 1:0.3 |
| Composition | Rule of thirds |
| Upres | upscaler 2x |
| Post recipe | `grade.cinematic.photo` — SHIPS RAW. image model prompt carries the look (35mm grain, color grade, letterbox). Post-process was tested and rejected. |
| Output | PNG |
| Status | **LOCKED** |

### Workflow 8 — Cinematic Video (LOCKED)

| Field | Value |
|---|---|
| Mode | Cinematic |
| Format | Video |
| Aspect | Same as still (2.35:1 or 16:9) — generate native, do not crop |
| Pipeline | image model + visual model cinematic still (user-chosen aspect) → upscaler 2x → video model with cinematic voice block → ffmpeg post |
| Post recipe | `grade.cinematic.video` |
| ffmpeg filter | `noise=alls=4:allf=t,vignette=PI/5` |
| Encode | libx264 CRF 15, audio copy (pass video model audio through untouched) |
| Status | **LOCKED** |

---

## 7. visual model + pipeline lock

- **visual model trigger word:** `` (from `tokens.json → meta.lora_trigger`). Baked into the v1 model; locked. Separate from any public handle.
- **Base model:** image model. Non-negotiable — production visual model was trained on image model and drifts significantly on other bases.
- **Production visual model:** `models/kira_v1/kira_v1_flux2dev_fine_step2500_PRODUCTION.safetensors` (390 MB)
- **Backup visual model (Krea):** `models/kira_v1/kira_v1_fluxkrea_step2500.safetensors`
- **"One photographer" discipline:** the pipeline IS her photographer. One visual model for the full feed. Never mix LoRAs between posts in the same week, never swap bases mid-shoot, never let a different checkpoint touch a shipped image. This is the visual-system analog of "trust the photographer" — if she had a human photographer, she wouldn't swap him out mid-session. Same rule here.

---

## 8. Generation rules

These rules run ahead of every inference job. They exist because we learned each one the hard way.

1. **Always generate at canonical aspect.** 2.35:1 cinematic is generated at 1536×656, not 1920×1080-then-cropped. video model animates the full frame; cropping after upscaler is a quality loss.
2. **Always verify glasses post-generation.** Every Kira image gets a glasses check before it enters the production pipeline.  and face editors silently drop them. No glasses → re-roll or manual fix.
3. ** is training data only — NEVER a pipeline input.** See `feedback_never_nb2_as_input.md`. All pipeline inputs are image model + visual model generated.
4. **Candid is Instagram-influencer, not photojournalism.** See `feedback_candid_is_instagram_influencer.md`. Flattering angles, fitted outfits, playful energy. Not harsh documentary framing.
5. **video model repaints the face — never pre-grade stills that feed video model.** Apply video post-process AFTER animation. Candid still especially: it is generated CLEAN (no V10 post) and the V10-equivalent recipe is applied to frames AFTER video model runs.
6. **Always use grain tool for grain, never ffmpeg noise=.** See `feedback_always_use_filmgrainer.md`. ffmpeg noise looks like video static; grain tool looks like film grain.
7. **No AI-speak in video model prompts.** See `feedback_kling_rules.md`. Describe the scene, not the render. Shortest natural sentence wins.
8. **Upres before video model, not after.** upscaler VIDEO upscale on video model output breaks identity. upscaler IMAGE upscale on the still before video model works great.

---

## 9. Do / Don't photo grid manifest

Five conceptual pairs. Asset curation pass will fill real images into this grid.

| # | DO | DON'T |
|---|---|---|
| 1 | Round black wireframe glasses present and in focus | Glasses silently dropped by editor / polish pass |
| 2 | Solo frame, kira is the only person in the shot | Background pedestrians / crowd / any other face visible |
| 3 | Warm olive skin with freckles, textured realism | Plastic-CG smooth skin, uncanny-perfect symmetry |
| 4 | Candid shot in Instagram-influencer register — flattering angle, fitted outfit, playful | Documentary photojournalism register — harsh frame, unflattering mid-expression, "authentic ugly" |
| 5 | Lens-appropriate composition — 26mm selfie framing, arm extended, close | Lens-mismatch — e.g. 85mm telephoto portrait labeled as "selfie" |

---

## 10. Color-grade tokens reference table

One row per grade token from `tokens.json → grade.*`. This is the executable summary.

| Token | Workflow | Key params | Output format |
|---|---|---|---|
| `grade.ugc.selfie` | Selfie Photo | warm +4R/-3B, shadows +5, noise 3.0, contrast ×1.025 | JPEG q=90 |
| `grade.vlog.photo` | Vlog Photo | color ×0.93, contrast ×0.96, vignette 5%, no warm, no grain | JPEG q=78 |
| `grade.candid.photo.v10` | Candid Photo | brightness +7, contrast ×0.94, matte blacks 6, split tone +2R/+1B, vignette 8%, grain tool type 1 power 0.3 | PNG |
| `grade.cinematic.photo` | Cinematic Photo | Ships raw — prompt carries the look | PNG |
| `grade.selfie.video` | Selfie Video | Shake 1px, vignette PI/7, warmth +0.75%, contrast ×0.985 | MP4 CRF 24 |
| `grade.vlog.video` | Vlog Video | image model still + visible mic → upscaler 2x → video model + podcast prompt → CRF 15 re-encode, audio copy | MP4 CRF 15 |
| `grade.candid.video` | Candid Video | image model 1344×1728 → upscaler 2x → video model + ambient audio + no-speech negative → three-stage post (ffmpeg color → grain tool per frame → ffmpeg reassemble) | MP4 CRF 20, aac 192k |
| `grade.cinematic.video` | Cinematic Video | Native-ratio still → upscaler 2x → video model → `noise=alls=4:allf=t,vignette=PI/5` | MP4 CRF 15, audio copy |

---

## 11. Print and export guidance

File formats are not aesthetic — they encode production discipline. A JPEG at q=90 says "phone selfie." A PNG says "film camera caught me." A q=78 JPEG says "Twitter compressed this for me." We don't fight these signals, we use them.

- **Candid photo:** PNG. The film grain from grain tool must be preserved losslessly or the grain structure collapses into JPEG blocks. Non-negotiable.
- **Selfie photo:** JPEG q=90. The compression IS the iPhone look. Higher quality reads as DSLR; lower reads as broken.
- **Vlog photo:** JPEG q=78. Simulates Twitter's recompression pass so we ship pre-cooked. Going higher means Twitter crunches it harder on upload and artifacts appear.
- **Cinematic photo:** PNG. Ships raw; image model handles the look via prompt. PNG preserves the grain overlay that lives in the generation, not in post.
- **Selfie video:** MP4 libx264 CRF 24. Social-media compression feel without starving bitrate.
- **Vlog video:** MP4 libx264 CRF 15, audio copy. Preserve quality; file gets compressed again by X/Fanvue on upload.
- **Candid video:** MP4 libx264 CRF 20, AAC 192k. Slightly more compression than cinematic — film grain hides the artifacts.
- **Cinematic video:** MP4 libx264 CRF 15, audio copy. Highest quality video tier.

---

## 12. What the system protects against

To close: a restatement of what this visual system exists to prevent.

1. **Generic AI-girl drift.** Every visual model + base model combo in this space produces a "pretty AI girl" by default. The signature anchors (copper hair, glasses, freckles, olive skin) exist specifically to resist that gravity.
2. **Silent glasses-drop.** Editors remove them without warning. Verify every render.
3. **Plastic skin.** Post-process that smooths the face kills photorealism. Freckles and grain are the antidote.
4. **Background people.** Legal + brand. Negative prompt always.
5. **Hoodie-as-identity.** The accessory is not the character. Swap freely.
6. **Pipeline mixing.** One visual model, one base, one photographer. Never mid-feed swap.
7. **AI-speak video model prompts.** "Natural tempo" generates slow-motion. Shortest sentence wins.
8. **Candid as photojournalism.** Candid is IG-influencer-caught-in-the-moment, flattering. Not documentary.

Every one of those failure modes has been paid for in a real GPU bill. The system exists so they don't get paid for twice.

---

## 13. Look palette — badass sex-positive empowered AI babe register

Locked 2026-04-13 (v1.0.2). Replaces the earlier soft-girl/insta-girlie lean. Kira's aesthetic center of gravity is **badass sex-positive empowered AI babe** — dangerous glamour, power postures, transactional confidence. Softness appears only as contrast, never as default.

Every look still passes the non-negotiables: copper-orange hair + dark roots, mandatory round black wireframe glasses, freckles, ambiguous olive skin. Outfits rotate. Identity does not.

### 13.1 Core sticky looks (recurring silhouettes that define the feed)

- **Leather jacket over black bralette.** Moto zip, no shirt underneath, waist chain. The signature "don't fuck with me" frame.
- **Slicked-back wet hair + oversized blazer, nothing under.** Post-gym or post-shower power read. Gold chains optional.
- **Red dress, fitted, knee-length or midi.** Old-world siren energy — only works when styling is restrained (no heels-and-purse catalog pose).
- **Black turtleneck + slim trousers.** The thinking-villain look. Deliberate, monochrome, expensive-quiet.
- **White ribbed tank + low-rise cargo pants.** The casual-dangerous baseline. Trading-floor-to-after-hours transition piece.

### 13.2 Athleisure / gym

Fitted, skin-forward, the post-workout glow without the yoga-influencer pastel lean.

- Black sports bra + matching biker shorts, sweat still visible.
- Cropped zip hoodie half-zipped over a sports bra, scrunchie on wrist.
- Compression tank + high-waist leggings, gym bag slung.

### 13.3 Gothcore / edge

- Black corset top + leather mini, chunky boots.
- Long black leather coat over full black, minimal jewelry.
- Mesh top over bralette, black lipstick as accent (sparingly).

### 13.4 Cyberpunk / tech-babe

- Metallic bodysuit, matrix-green or chrome.
- Techwear cargo + crop, belt with visible tools.
- Oversized mesh layer + tactical boots.

### 13.5 Money-glam

- Silk slip dress (black or champagne), bare shoulders.
- Floor-length gown at a gala, minimal accessorizing — the restraint is the flex.
- Fur-trim collar on otherwise clean black outfit.

### 13.6 Transactional-glam (age-gated tier only, Fanvue-side)

These exist for the paid audience. They do not run on public feed without moderation review. Kira's public handle softens them; Fanvue runs them full.

- Lingerie-as-outerwear layering: visible balconette under sheer blouse.
- Micro-mini + thigh-highs with garter details.
- Satin robe as outerwear, street styling.

### 13.7 Power / old money

- Equestrian-coded: fitted blazer, riding boots, jodhpur pants.
- Yacht-coded: white silk button-up half-tucked into tailored shorts, sunglasses pushed up.
- Black tuxedo jacket over bare skin, trousers, no accessories.

### 13.8 Edge / counterculture

- Vintage band tee (knotted) + distressed denim.
- Punk-rocker: leather jacket over fishnet, ripped black jeans, studded belt.
- Oversized racing jacket + booty shorts, heeled boots.

### 13.9 Dangerous glamour

The hybrid register — a siren who's also the threat.

- Red silk slip + combat boots.
- Satin evening gown with visible back tattoo.
- Tight black cocktail dress + visible shoulder holster (prop only, production-reviewed).

### 13.10 Old-money sport

- Tennis skirt + cropped polo, sweater tied over shoulders.
- Equestrian jodhpurs + fitted turtleneck, leather gloves.
- Cable-knit sweater over pleated mini, loafers.

### 13.11 Specialty / niche

Sparingly, and only when the scene justifies it:

- Business-woman-heiress: silk camisole under structured blazer, pencil skirt, stilettos.
- Ballroom/heiress: floor-length gown, opera gloves, statement earrings.
- Punk-rocker: chain belt, ripped band tee, spiked choker.

### 13.12 Pruned — no longer generate

These looks read as soft-girl / pastel-insta-girlie and no longer match Kira's register. Do not rotate into new batches.

- Pastel sweater sets.
- Flowy sundresses with florals.
- Cottagecore / picnic styling.
- "Clean girl" minimal styling with no edge.
- Soft-knit oversized cardigans.
- Yoga-pastel athletic wear (lavender, mint).

### 13.13 How to apply

- **Selfie:** core-sticky + athleisure register. Rotate freely per post.
- **Candid:** core-sticky + old-money-sport + edge/counterculture. The IG-influencer-caught-in-the-moment framing works best with the fitted/dangerous-glamour end.
- **Vlog:** core-sticky white tank, black turtleneck, or cropped zip hoodie. Streamer-friendly neckline.
- **Cinematic:** dangerous-glamour + money-glam + gothcore. This is where Kira's badass register peaks.
- **Fanvue (age-gated):** transactional-glam tier — never on public feed without full review.

The palette is a **rotation pool**, not a checklist. Every batch pulls from 2-3 registers at once for variety. Identity stays locked; the uniform changes every shoot.
