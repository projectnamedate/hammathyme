# 13 — Governance + Versioning

**Version:** 1.0.0
**Owner:** projectnamedate LLC
**Signed by:** projectnamedate LLC
**Last reviewed:** 2026-04-13

This section defines how the Kira Brand Bible itself is changed: who can change it, under what criteria, where the change is logged, and how the downstream pipeline (tokens.json, scripts, canonical refs) stays in sync. The bible is the source of truth. Everything downstream — prompts, recipes, captions, contracts — derives from here.

---

## 13.1 Version registry

**Scheme:** Semantic versioning, `major.minor.patch`.

| Bump | Criterion | Examples |
|---|---|---|
| **Major** (X.0.0) | Breaking change to voice, visual system, or hard taboo | Dropping copper-orange hair. Allowing real-person face blends. Changing base model away from image model. Rewriting voice to "non-vulgar." |
| **Minor** (1.X.0) | New scope added — platform, section, content pillar, workflow | Adding TikTok as a second primary platform. Adding a new content pillar. Adding a new post-process recipe for a new workflow. |
| **Patch** (1.0.X) | Copy fix, sample rewrite, clarification, non-semantic correction | Fixing a typo. Replacing a stale sample caption. Clarifying an ambiguous rule without changing the rule. |

**Every change is logged in `CHANGELOG.md` with WHY, not just WHAT.** The "what" is recoverable from git diff. The "why" isn't, and the why is what future-us needs when asking "can I change this back?"

Every version is **signed by projectnamedate LLC**. Bible files carry the signing line in the header. No unsigned version ships.

### Changelog entry template

```
## [1.2.0] — 2026-06-15

### Added
- New content pillar "Frenemy Bits" at 10% mix

### Why
- M4 data showed frenemy-adjacent posts had 3.1x engagement vs lore posts.
  Moved 10% out of "meta lore" to make room. Pillar-mix re-audited; no other
  shifts needed.

### Signed
- projectnamedate LLC
```

---

## 13.2 Token registry

Every design token in `/Users/hammer/Desktop/Claude/kira/docs/brand/tokens.json` is registered here. Tokens are the machine-readable interface between the bible and the pipeline. Any change to a token requires the corresponding prose section in the bible to change in the same commit.

| Token path | Default value | Owner | Platform overrides | Last-changed |
|---|---|---|---|---|
| `meta.brand` | `kira` | LLC | none | 2026-04-13 |
| `meta.version` | `1.0.0` | LLC | none | 2026-04-13 |
| `meta.lora_trigger` | `` | LLC | none | 2026-04-13 |
| `meta.base_model` | `image model` | LLC | none | 2026-04-13 |
| `identity.name` | `kira` | LLC | none | 2026-04-13 |
| `identity.wordmark_case` | `lowercase` | LLC | none | 2026-04-13 |
| `identity.tagline` | `skynet in a dress` | LLC | none | 2026-04-13 |
| `identity.north_star` | `Fanvue MRR $10-20K/mo by month 6` | LLC | none | 2026-04-13 |
| `color.editorial.*` | per JSON | LLC | none | 2026-04-13 |
| `color.tech.*` | per JSON | LLC | none | 2026-04-13 |
| `color.shared.btc.orange` | `#F7931A` | LLC | none | 2026-04-13 |
| `color.character.hair.copper` | `#B4673A` | LLC | none | 2026-04-13 |
| `color.character.hair.dark_root` | `#2B1D16` | LLC | none | 2026-04-13 |
| `color.character.skin.olive.base` | `#D6B08A` | LLC | none | 2026-04-13 |
| `color.character.eyes.hazel` | `#7A6038` | LLC | none | 2026-04-13 |
| `type.display.family` | Playfair Display stack | LLC | none | 2026-04-13 |
| `type.body.family` | Inter stack | LLC | none | 2026-04-13 |
| `type.mono.family` | JetBrains Mono stack | LLC | none | 2026-04-13 |
| `space.base_unit_px` | `8` | LLC | none | 2026-04-13 |
| `layout.grid.*` | per JSON | LLC | none | 2026-04-13 |
| `lens.selfie` | 26mm f/1.8 4:5/9:16 | LLC | none | 2026-04-13 |
| `lens.vlog` | 35mm f/2.8 16:9 | LLC | none | 2026-04-13 |
| `lens.candid` | 35mm f/4 4:5/9:16 | LLC | none | 2026-04-13 |
| `lens.cinematic` | 50mm f/1.4-f/2.8 2.35:1/16:9 | LLC | none | 2026-04-13 |
| `light.ugc.warm.key` | 3200K 1:0.6 | LLC | none | 2026-04-13 |
| `light.vlog.natural.window` | 5000K 1:0.7 | LLC | none | 2026-04-13 |
| `light.candid.golden` | 2800K 1:0.4 | LLC | none | 2026-04-13 |
| `light.cinematic.side.soft` | 4000K 1:0.3 | LLC | none | 2026-04-13 |
| `grade.ugc.selfie` | locked recipe v8 | LLC | none | 2026-04-13 |
| `grade.vlog.photo` | locked recipe v8 | LLC | none | 2026-04-13 |
| `grade.candid.photo.v10` | locked recipe v8 | LLC | none | 2026-04-13 |
| `grade.cinematic.photo` | ships raw, prompt-led | LLC | none | 2026-04-13 |
| `grade.selfie.video` | locked recipe v8 | LLC | none | 2026-04-13 |
| `grade.vlog.video` | locked recipe v8 | LLC | none | 2026-04-13 |
| `grade.candid.video` | locked recipe v8 | LLC | none | 2026-04-13 |
| `grade.cinematic.video` | locked recipe v8 | LLC | none | 2026-04-13 |
| `character_visual_anchors.non_negotiable` | 7-item list | LLC | none | 2026-04-13 |
| `character_visual_anchors.variable` | 4-item list | LLC | none | 2026-04-13 |
| `character_visual_anchors.never_show` | 4-item list | LLC | none | 2026-04-13 |
| `platforms.x.handle` | TBD | LLC | none | 2026-04-13 |
| `platforms.x.bio` | per JSON | LLC | none | 2026-04-13 |
| `platforms.x.cadence_per_day` | 2 video / 3 text / 1 thread | LLC | none | 2026-04-13 |
| `platforms.fanvue.handle` | TBD | LLC | none | 2026-04-13 |
| `platforms.fanvue.pricing` | $14.99 sub, $5-25 PPV | LLC | none | 2026-04-13 |
| `affiliates.priority_order` | bybit, binance, kucoin | LLC | none | 2026-04-13 |
| `taboos.hard_lines_never` | 9-item list | LLC | none | 2026-04-13 |
| `vocabulary.use_freely` | per JSON | LLC | none | 2026-04-13 |
| `vocabulary.never` | bro, dude, fam | LLC | none | 2026-04-13 |
| `vocabulary.trend_risk_2026` | fren, HFSP, wagmi | LLC | none | 2026-04-13 |

**Token owner = projectnamedate LLC across the board in v1** (single-operator reality). Split ownership is a Phase 2 problem once a team exists.

---

## 13.3 RACI matrix

**Legend:** R=Responsible (does the work), A=Accountable (approves), C=Consulted (input before decision), I=Informed (notified after decision).

### v1 — single operator

In v1, `projectnamedate LLC` (the operator) is R + A on everything. Voice lead is consulted where the decision is voice-adjacent. Legal counsel is on-call for P0 and taboo changes only. "Content generator" = the automated prompt-LLM pipeline + operator review; it is I (gets updated prompt bundles when things change).

| Activity | Operator (LLC) | Voice lead | Legal counsel | Content generator |
|---|---|---|---|---|
| Brand essence change (§01) | R+A | C | I | I |
| Lore canon change (§02) | R+A | C | I | I |
| Voice change (§03) | R+A | C | I | I |
| Visual system change (§04) | R+A | — | I | I |
| Platform strategy change (§05) | R+A | — | I | I |
| Content pillar % shift (§06) | R+A | C | — | I |
| Rate card change (§08) | R+A | — | C | — |
| New decision-tree entry (§09) | R+A | C | C | I |
| P0 crisis response (§10) | R+A | C | **C** | I |
| Taboo list change (§11) | R+A | C | **C** | I |
| KPI target change (§12) | R+A | — | — | I |
| Version bump (§13) | R+A | — | — | I |

Legal is **C** (not just I) on P0 response and taboo changes because those are the only activities where a wrong decision carries regulatory or litigation risk.

### Phase 2 — post-launch, if team grows

- **Voice lead** splits from operator — gets R on §03 and §06, A on voice-sample rewrites.
- **Content ops** splits from operator — gets R on §09 decision-tree execution, calendar, cadence enforcement.
- **Legal counsel** moves from on-call to retainer — stays C on P0/taboo, adds C on rate card.
- **Operator** retains A on all sections; R shrinks to §01, §02, §13.

Phase 2 trigger: MRR >$10K sustained for 3 months, OR cadence consistently exceeds 10 posts/day, whichever is first.

---

## 13.4 DAM (Digital Asset Management)

| Concern | Path / convention |
|---|---|
| Asset root | `/Users/hammer/Desktop/Claude/kira/outputs/FINALS/` |
| Photo finals | `outputs/FINALS/photo/{raw,final}/` |
| Video finals | `outputs/FINALS/video/{raw,final}/` |
| Canonical refs | `/Users/hammer/Desktop/Claude/kira/inference/canonical_refs/` |
| Training set | `assets/kira/nb2/curated_50_upres/` |
| Legacy training source (legal provenance) | `archive/kira_dataset_sources/` — **never delete** |

### Naming convention

`{workflow}_{scene}_{pipeline-suffix}.{ext}`

Where:
- `{workflow}` ∈ `selfie | vlog | candid | cinematic`
- `{scene}` = short slug describing content (e.g. `desk-crypto`, `brooklyn-walk`, `tokyo-night`)
- `{pipeline-suffix}` ∈ `RAW | POST | UPRES | SIGNED | FINAL`
  - `RAW` = direct model output, no post
  - `POST` = post-processed per locked recipe
  - `UPRES` = upscaler 2x applied
  - `SIGNED` = C2PA-signed (provenance manifest attached)
  - `FINAL` = shippable — the file a platform sees

**Examples:**
- `selfie_desk-crypto_FINAL.jpg`
- `vlog_podcast-take3_UPRES.png`
- `cinematic_tokyo-rain_SIGNED.mp4`

### Retention policy

- Everything kept indefinitely.
- A published asset is **never deleted** (provenance + takedown obligations outlive the asset's marketing life).
- Version by filename, **never overwrite**. If a regenerate is needed, append `_v2`, `_v3`, etc.
- Legacy training source at `archive/kira_dataset_sources/` is legal provenance — deletion would destroy our ability to respond to a training-data challenge.

---

## 13.5 Update cadence

| Cadence | Scope |
|---|---|
| **Quarterly** | Calendar-driven review — run at Q1, Q2, Q3, Q4. Check KPIs, roll the CT allies/enemies roster (it churns), refresh rate card, review brand-audit trendline. |
| **Ad-hoc** | Triggered by any P0 or P1 crisis. Learning from the crisis is written up and the relevant section is patched within 7 days of incident close. |
| **Annual** | Full top-to-bottom review against a year of data. Major version bump if voice, visual, or taboo has materially shifted. |

Quarterly and annual cadences are calendared in advance. Ad-hoc reviews inherit the triggering event's incident ID in the changelog entry.

---

## 13.6 Review checklist for updates

Before shipping a new version:

1. Every change entered in `CHANGELOG.md` with **why** (not just what).
2. `tokens.json` updated in sync with any visual / color / post-recipe changes. Token registry (13.2) updated.
3. Pipeline scripts in `scripts/pipeline/` re-verified to consume tokens correctly — if a token moved or changed, the script that reads it is checked.
4. All sample rewrites in the affected sections still pass the brand-audit scorecard (§12.6).
5. No new content violates any hard taboo (§11).
6. Version bumped per semver rules (13.1).
7. Bible files carry the `Signed by: projectnamedate LLC` header.
8. `CLAUDE.md` and `docs/WHERE_WE_ARE.md` updated to reflect the new version, if the change affects production state.

A change that fails any of 1-8 is not shipped. A skipped step is a defect.

---

## 13.7 Decommissioning SOP

If Kira is ever retired, paused, or handed off to a different operator:

- All published content stays up. Retroactive deletion is not possible without violating provenance obligations to past subscribers and platforms.
- C2PA certificates are renewed for **at least 5 years post-retirement**, so any challenge to historic content can be verified against a live chain of trust.
- The takedown inbox remains monitored. The LLC remains the responsible entity. Inbox ownership does not transfer with any handoff unless the new operator is itself a legal entity capable of responding to legal process.
- The canonical training set, legacy training source, and full content archive are preserved indefinitely.
- The visual model weights (`kira_v1_flux2dev_fine_step2500_PRODUCTION.safetensors` and all successors) stay under LLC control and are not sold, licensed, or released publicly. A Kira persona in retirement is still a persona the LLC is legally responsible for.

Retirement is a **legal status**, not a creative status. The character can stop posting. The LLC cannot stop answering for what the character posted.