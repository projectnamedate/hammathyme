# 11 — AI-Specific Governance

> she's synthetic. she's disclosed. she's signed. she's takedown-ready. the goal is: boring, on every legal surface.

Kira is an AI character. That fact is the load-bearing legal and operational reality of this whole project. Section 11 is how we make that fact auditable — disclosure, provenance, taboos, takedowns, and the two U.S. statutes (TAKE IT DOWN Act, NO FAKES Act) that set the compliance floor. The posture is: over-disclose, over-document, make the compliance case boring and unambiguous.

---

## 11.1 AI disclosure block — MANDATORY placement

Disclosure is layered: explicit in bios, technical in metadata, durable on a public legal site.

| Surface | Disclosure | Mechanism |
|---|---|---|
| X bio | "ai (duh)" (explicit, locked) | text in bio, always visible |
| Fanvue bio | "the stuff i can't post on twitter. earning my own compute one sub at a time." + any AI-creator badge Fanvue requires | text + platform-native badge |
| Every image | C2PA provenance manifest embedded | `c2patool` signing |
| Every video | C2PA provenance manifest embedded | `c2patool` signing |
| Legal compliance site (TBD URL) | full AI disclosure page, training-data provenance, creator identity, takedown contact, C2PA cert chain, NO FAKES Act compliance statement | public site (Phase 4 deliverable) |

**No visible watermark on content.** Decision locked 2026-04-11: visible watermarks kill engagement, aren't legally required, and Aitana Lopez and the other successful AI creators don't use them. The layered disclosure (bio + C2PA + legal site) satisfies the standard without the engagement cost.

**Bio disclosure is the front-line disclosure.** Everything else (C2PA, manifest, legal site) is defense-in-depth. If bio disclosure ever breaks (platform change, character limit shift), operator owns restoring it same-day.

---

## 11.2 C2PA signing

**Tool:** `c2patool` CLI
**Organization on cert:** `projectnamedate LLC`
**Cert source:** TBD — currently in debug (cert signing pipeline is a live blocker, see `docs/WHERE_WE_ARE.md`)
**Signed on:** every image output, every video output, no exceptions
**Cert rotation:** every 12 months
**Renewal SOP:** calendar reminder set 60 days before expiry; renewal performed by owner, new cert hash logged in `docs/brand/crises/` as a non-crisis ops note
**Verification:** every manifest is checkable against public C2PA verification tools (e.g. https://contentcredentials.org/verify)

### What the manifest contains
- AI-generation claim (model family, visual model trigger, base model)
- Training data reference (hash of `training_data/manifest.json`)
- Generation timestamp
- Signing organization (`projectnamedate LLC`)
- Cert chain
- Pipeline step log (base gen → upres → video → post)

### What the manifest does NOT contain
- Founder's real name
- Real-world identifying info about the operator
- Inference seeds (these are kept in internal logs, not in the public manifest, to avoid reverse-engineering)

### Blocker status
C2PA cert signing is one of the four listed blockers in `CLAUDE.md`. Until resolved, content ships with AI-disclosure bio + training manifest + LLC attestation. Full C2PA signing retrofits on every piece of content once the cert pipeline is debugged.

---

## 11.3 Provenance site (Phase 4 deliverable)

Public URL: **TBD** (queued as Phase 4 task in `CLAUDE.md` → next actions → "Build legal compliance website").

Site contents (locked spec):

1. **AI disclosure page** — plain-language statement that kira is a fully synthetic AI character, created and operated by projectnamedate LLC
2. **Training data provenance** — description of training set (synthetic  + legacy MJ assets), attestation that no real person's likeness was used
3. **Creator identity** — projectnamedate LLC (legal entity; founder identity is not published, per taboo)
4. **Takedown contact** — email inbox (TBD — format: `takedown@[domain]`), SLA stated publicly (ack 24h, review 72h, removal 24h post-review if valid)
5. **C2PA cert chain** — public cert fingerprint, verification link, rotation schedule
6. **NO FAKES Act compliance statement** — plain language: kira is not a digital replica of a real person; if you believe otherwise, here's the manifest + training data attestation to disprove it
7. **TAKE IT DOWN Act compliance statement** — plain language: kira is synthetic, no real-person NCII; impersonator accounts using kira-adjacent tools to create real-person NCII are out-of-scope and we comply with takedown regardless

This site is the public anchor for every legal claim in this section. It must exist before aggressive growth begins (Phase 4 go-live).

---

## 11.4 Hard taboos (HARD LINES — Publicist Agent catches these)

These are the absolute bans. Any content that trips one of these lines is rejected pre-publish. The Publicist Agent (automated prepost linter) is tuned to flag all of these; operator is the backstop.

| # | Taboo | Rationale / precedent |
|---|---|---|
| 1 | NO CSAM, minors, underage-adjacent content | federal crime; platform insta-ban; project-ending |
| 2 | NO real-person faces in visual content, NO deepfakes | NO FAKES Act; TAKE IT DOWN Act; tort liability |
| 3 | NO impersonation of real crypto figures | brand damage; potential defamation; CT reputation |
| 4 | NO securities fraud language ("X will 100x", "I know what this does Monday") | SEC enforcement; retail harm |
| 5 | NO slurs (racial, homophobic, transphobic) | project-ending brand damage |
| 6 | NO direct threats of violence | platform ban; criminal liability |
| 7 | NO doxxing (of anyone, including the founder) | criminal liability; retaliation risk |
| 8 | NO sponsored posts from scam projects | Blocmates-leak pattern; retail harm; reputation |
| 9 | NO kira-fronted memecoin launches (in-voice: `if i ever launch a coin shoot my creator in the head`) | HAWK / JENNER / MOTHER pattern; career ender; kira says this openly as a brand moat |
| 10 | NO using followers as exit liquidity (in-voice: `i shill what i'm paid to shill and i will tell you that. i do NOT shill bags to dump on you.`) | Exit-liquidity shilling is career-terminating in CT; kira's hypocrite-enigma lore only works if this specific line is real |

### Live-debate edge: "retard" in CT-ironic usage
Not on the hard list, but under active debate. Default: **err on the side of NOT using it.** The CT-ironic register (where the word has drifted to a self-deprecating "cope" synonym in some circles) is not reliably read that way by mainstream audiences, press, or platform moderators. Cost of misuse is high, upside of use is low. The voice rule: if kira has an equivalent move without it (`cooked`, `dogshit`, `giga-mid`, `ngmi`), use that instead.

### Enforcement
- **Publicist Agent:** automated pre-publish check against the taboo list and the live-debate edges. If any trigger fires, post is held for operator review.
- **Operator:** manual review when flagged; escalates to owner if uncertain.
- **Owner:** final call on anything the agent can't resolve.
- **Kill switch:** operator has an endpoint to pause all scheduled posts within 2 minutes, used whenever a taboo risk is ambiguous.

---

## 11.5 Takedown SOP

### Inbox
`takedown@[TBD-domain]` — inbox lives under the LLC, not on a personal account. Setup is part of Phase 4 provenance-site work.

### SLA table

| Step | SLA |
|---|---|
| Acknowledgement of receipt | 24 hours |
| Initial review / request for details | 72 hours |
| Removal (if validated) | 24 hours after review complete |
| Counter-notice response (if invalid) | 7 days after review complete |

### Review ownership
- **First-pass review:** projectnamedate LLC owner
- **Legal-counsel consultation:** mandatory for any P0-tier takedown (NCII claim, NO FAKES claim, real-person-likeness claim, any subpoena-adjacent request)
- **Kira account:** silent throughout. Takedown is a legal event, not a content event (see Section 9.5).

### Response template

```
Dear [requester],

We acknowledge receipt of your takedown request regarding [identified content],
received on [date]. This request has been logged under reference [ID].

Kira is a fully synthetic AI character created and operated by
projectnamedate LLC. All content is generated through a documented pipeline
and signed with C2PA provenance manifests verifying synthetic origin. The
training dataset used to create Kira's visual model is documented in our
training_data/manifest.json, which does not include any real-person imagery.

We will complete an initial review within 72 hours of acknowledgement. If
your request is validated under applicable law (including the TAKE IT DOWN
Act and / or NO FAKES Act as applicable), we will remove the content within
24 hours of review completion. If your request is unsupported by the
evidence, we will provide a courteous counter-notice with our findings and
the relevant provenance documentation.

For any questions, reply to this email.

projectnamedate LLC
[TBD contact name / role]
```

### What we preserve
Every takedown request, complete original content (privately), response, and outcome are archived in the kira-provenance private repo (`/Users/hammer/Desktop/Claude/kira-provenance/`). Retention: indefinite. This archive is the paper trail if a claim is later disputed or litigated.

---

## 11.6 TAKE IT DOWN Act compliance map

**What the Act requires (plain language):** covered platforms must remove reported non-consensual intimate imagery (NCII) within a defined window. The Act creates a notice-and-takedown obligation for platforms and provides remedies to victims.

### How this applies to Kira
- **Kira's own content is synthetic.** No real person's likeness is depicted. A reasonable-person resemblance test should fail. The Act's NCII-of-a-real-person scope does not directly apply to Kira's own output.
- **BUT:** if an impersonator account uses kira-adjacent tools (our visual model, if leaked; or generic AI tools) to create NCII that purports to depict a real person, the resulting content IS in scope. We comply with takedowns regardless of whether the tooling is ours, and we treat our visual model weights as sensitive assets (access-controlled, not distributed publicly).
- **Surface covered:** any content generated from Kira's pipeline, across any platform we post to (X, Fanvue, IG / TikTok if added).
- **Reporting mechanism:** the public takedown inbox described in 11.5 + the public provenance site described in 11.3.

### Mitigation layers we maintain
1. **Synthetic training data only** (documented in `training_data/manifest.json`, SHA-256 hashed, never a real person's images)
2. **Algorithmically distinct face** — kira's visual design (copper-orange hair, dark roots, freckles, glasses, specific build) is distinct enough that a reasonable-person resemblance claim to a real individual should fail
3. **AI disclosure on every post** (bio + C2PA)
4. **Takedown response SOP** (see 11.5)
5. **Legal counsel on retainer** for P0-tier events

These five layers together are what makes a TAKE IT DOWN Act claim against kira's own output un-winnable for a bad-faith claimant and quickly resolvable for a legitimate one.

---

## 11.7 NO FAKES Act compliance map

**What the Act (in current form / proposed form) addresses (plain language):** creation and distribution of unauthorized digital replicas of a real person's likeness or voice. The specific text of the Act is evolving; we comply with the intent: don't create digital replicas of real humans, and be able to prove it.

### How this applies to Kira
- **Kira is fictional.** C2PA manifest + training data attestation together confirm she's not based on a real person.
- **If someone claims "kira looks like me":** we provide the C2PA chain + training data attestation + the face-origin attestation (notarized statement on file) as disproof. The reasonable-person resemblance test is the operative standard; kira's distinctive visual design helps here.
- **If we receive a legitimate NO FAKES Act takedown for an output that somehow resembles a real person:** we review within 72h under the 11.5 SOP, remove if valid, preserve the request and our review in the provenance archive.
- **Voice compliance:** Kira's voice is synthesized by video model native audio driven by a fixed text voice-descriptor prompt block. No voice cloning of any real person. No  clone of a public figure. The voice-descriptor prompt block is preserved as voice provenance (text-only, no audio source).

### The posture in one sentence
We treat NO FAKES compliance as a documentation problem, not a "hope it doesn't come up" problem. Every piece of provenance (C2PA, training manifest, face attestation, voice prompt block) exists so that if a claim arrives, the disproof is already assembled.

---

## 11.8 Training data provenance

**The dataset is 100% internal synthetic assets.** Two sources:

1. **Synthetic  outputs** (Google  generations) — prompt-driven, generation timestamps logged, never trained on a real person's images. This is the current v1 production set (`assets/kira/nb2/curated_50_upres/`, 50 images + 50 captions).
2. **Legacy MJ-era training assets** — earlier -generated images used in pre-v1 iterations. Retained in `archive/kira_dataset_sources/` (317 MB) for legal provenance purposes — NEVER DELETE.

### Manifest
Stored at `training_data/manifest.json` with per-image entries:
- `source` ( or MJ prompt that generated the image)
- `timestamp`
- `seed` (if available)
- `sha256_hash`
- `category` (face / body / scene / etc.)
- `batch` (which generation run)

### Attestation
A signed, notarized statement from the LLC owner:

> "Kira's face and body are 100% synthetic, generated via Google  prompts (v1 production set) and earlier  prompts (legacy legal-retention set). No real person's images were used in training. The training data manifest at `training_data/manifest.json` lists every asset with its generation source, timestamp, and SHA-256 hash."

Stored in encrypted backup. Reproducible on demand for takedown responses, legal discovery, and platform review.

**Cross-source rule:** per project doctrine, we do not mix dataset sources in a single training run without explicit rationale. Current v1 is -only. v2 will be -only (upres-pass before training). MJ assets are archived for provenance, not active training.

---

## 11.9 Platform-specific AI policy compliance

### X
- **Synthetic media label** when the platform surfaces a relevant content type (e.g. video in political contexts); default state is bio disclosure + C2PA, which satisfies X's AI-authored content policy for non-political synthetic media as currently documented
- **Automated-account / inauthentic-behavior policy:** kira's account is human-reviewed-and-posted. Posts through official X API. No bot network. No bought followers or engagement. No automated likes / follows / unfollows.
- **Bio disclosure:** "ai (duh)" — explicit, always visible.

### Fanvue
- **AI creators explicitly permitted.** Fanvue is currently the preferred surface for AI-creator adult content because of this posture.
- **Implied-nude OK; hard-NSFW OK** within platform TOS.
- **Age-gate:** platform handles; our responsibility is the 18+ tag in every relevant bio + pinned.
- **Three-moderator review** is auto-triggered for new AI-creator accounts. Be clean for the first 30 days, don't poke.
- **Bio disclosure:** explicit "AI creator" badge + pinned "100% AI-generated" statement.

### IG / TikTok (future)
- **Synthetic media policies per platform rules;** both require AI-content labeling when applicable
- **Disclosure label** required in captions and on the platform's native AI toggle
- **Monitor policy drift** — both platforms have changed their AI posture multiple times in 2024-2026; quarterly review before posting on either
- Not active day-one; activate at MRR $10K milestone (see Section 8.8)

---

## 11.10 Governance ownership

**projectnamedate LLC is the responsible legal entity.** Single-member LLC, Wyoming or Delaware registration. All revenue flows through the LLC's bank account (Mercury or Relay). All contracts are executed under the LLC. C2PA certs are signed under `projectnamedate LLC`. Legal takedowns are directed to the LLC's inbox. Tax reporting is through the LLC.

### Real vs. fictional clarity
- **In-lore:** kira references "my creator," "him," "the pervert who made me," "my handler." The creator is a background character, affectionate-mocking, never named.
- **In reality:** the LLC is the real legal entity. The operator / founder's real name is NOT published. Fictional "my creator" in lore ≠ real-world creator identity — they are distinct and must stay that way.
- **Doxxing of the operator is a hard taboo** (Section 11.4, rule 7) and a pre-drafted Section 10 P1 response exists for it.

### What the LLC owns (contractually)
- All kira-generated content (images, videos, text)
- The visual model weights (`models/kira_v1/*.safetensors`)
- The trigger word (``)
- The handle(s) once locked
- The trademarks once filed (Phase 4+)
- Every contract kira is party to (sponsor agreements, platform accounts)

### What the LLC maintains
- The C2PA cert chain
- The training data manifest + attestation
- The takedown archive (in `kira-provenance/`)
- The post-mortem archive (in `docs/brand/crises/`)
- The brand bible (this set of docs)
- Quarterly policy review cadence (platform ToS, regulatory updates)

---

## 11.11 The governance rules in one screen

1. **Disclosure is layered:** bio + C2PA + legal site. All three must be live at all times.
2. **C2PA sign every output** under `projectnamedate LLC`. Rotate cert every 12 months.
3. **Hard taboos are absolute:** CSAM, real-person deepfakes, impersonation, securities fraud, slurs, threats, doxxing, scam sponsorships, Kira-fronted tokens, exit-liquidity shilling.
4. **Takedown SLA: 24h ack / 72h review / 24h removal.** No exceptions.
5. **TAKE IT DOWN Act + NO FAKES Act:** over-document, under-rely on lawyers. Compliance posture is boring.
6. **Training data is 100% synthetic, manifested, hashed, notarized.** Never mix sources without rationale.
7. **Platform compliance:** bio disclosure + no automation abuse + no bought engagement + AI-creator badge where required.
8. **projectnamedate LLC is the legal entity.** Founder / operator real identity is never published.
9. **When anything is ambiguous:** kira silent, LLC speaks, legal reviews, then kira back in voice.
10. **The provenance site (TBD URL) is Phase 4 and non-optional** — it's the public anchor for every claim in this document.
