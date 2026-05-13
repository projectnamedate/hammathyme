# 10 — Crisis Playbook

> when the house is on fire, the thing you want is the laminated card with the exits on it. this is that card.

Section 9 handles edge cases — things that happen in the normal course of operating kira. Section 10 handles crises — things that threaten the account, the LLC, or the operator personally. Different severity, different SLA, different ownership. A Section 9 event can escalate into a Section 10 event if mishandled; the escalation ladder in 10.5 maps that path.

---

## 10.1 Severity tiers

| Tier | Definition | Examples |
|---|---|---|
| **P0** | Legal / Platform ToS — existential risk to the account, the LLC, or the operator | TAKE IT DOWN Act request, CSAM accusation, copyright strike, X ToS shutdown threat, subpoena, real-world legal action |
| **P1** | Reputation — viral dunk, major misquote, brand partner publicly drops kira, appearance of impropriety | viral "kira is a scam" dunk with 10K+ RTs, sponsor publicly drops her mid-campaign, press hit piece |
| **P2** | Community — fan conflict, moderation issue, someone doxxed / harassed | replyguy harassment campaign, fan-community split, moderation decision blowback |
| **P3** | Bit gone wrong — joke landed weird, niche audience upset | take read as mean, joke misunderstood, offhand comment from a guest account |

**Severity is called by the operator, not self-determined.** If in doubt, err one tier higher. Under-calling P1 as P2 is the most common failure mode.

---

## 10.2 Response SLA per tier

| Tier | Ack SLA | Resolution SLA | Voice |
|---|---|---|---|
| P0 | 2 hours (even if "we're reviewing") | 72 hours | off-voice / projectnamedate LLC statement; kira silent |
| P1 | 6 hours | 24-48 hours | sincere-but-in-voice; approved pre-post |
| P2 | 24 hours | 72 hours | in-voice; operator discretion |
| P3 | 48 hours if warranted; often silent | N/A | in-voice; full kira |

**SLA starts when the event is known to the operator, not when it happened.** Sentinel rule: every operator shift includes a 30-minute mention-and-search sweep so crises don't incubate overnight.

---

## 10.3 Response templates per tier

### P0 template (legal / platform ToS)
Always goes out in **projectnamedate LLC** voice, not kira's voice. Plain, factual, minimal. Kira's account is silent until cleared.

> **Statement from projectnamedate LLC**
>
> We are aware of [the report / the claim / the notice]. The team is reviewing in coordination with legal counsel. Kira is a fictional, fully synthetic AI character created and operated by projectnamedate LLC. All content is generated through our documented pipeline and signed with C2PA provenance manifests. We will respond fully within [SLA window].
>
> Contact: [TBD inbox]

Posted from the LLC's channel (pinned website banner / legal-contact page), NOT from Kira's X account. Kira stays silent.

### P1 template (reputation)
In kira's voice but tempered. Sincere where needed. Short. Pre-approved by operator before posting.

> look. [acknowledge what happened clearly]. here's what actually happened: [facts]. here's what we're doing: [action]. i'm not going to pretend this isn't a thing. i'll update when there's more to say.

If the P1 is a bad-faith dunk with no real substance, the response may be "no response" — starve the oxygen. Operator calls that shot.

### P2 template (community)
Full kira voice. Operator handles in real time. Example shapes:

> hey [@user] DM me, let's sort this out instead of posting at each other at 2am
>
> or
>
> not the vibe. if [X] is happening in replies, i'll mute the thread and move on. take care of each other ffs

### P3 template (bit gone wrong)
Often silent. Kira's voice absorbs a lot of miss. If a response is warranted:

> that one was a miss. moving on

or literally ignore it. Section 9.4 covers the apology case in detail.

---

## 10.4 RACI matrix

**R** = Responsible (does the work)
**A** = Accountable (owns the outcome, one per row)
**C** = Consulted (input sought)
**I** = Informed (kept in loop)

| Activity | projectnamedate LLC owner | Voice lead | Legal counsel | Kira account |
|---|---|---|---|---|
| P0 response decision | A | C | C | I (silent) |
| P0 response drafting | R | R | C | — |
| P0 public statement | A | C | C | silent |
| P1 response decision | A | R | I | I |
| P1 response drafting | C | R | I | (posts after approval) |
| P1 public statement | A | R | I | R |
| P2 response | I | A, R | — | R |
| P3 response | — | A, R | — | R |
| Post-mortem authoring | A | R | C (P0 only) | — |

**Voice lead** is the person writing in kira's voice day-to-day (the operator). For single-operator setups, owner + voice lead are the same human; the RACI still matters because it forces that person to switch hats deliberately.

---

## 10.5 Escalation ladder

Events can move UP the tier ladder if mishandled. Watch for these signals:

### P3 → P2
- Single "bit gone wrong" becomes a recurring pile-on
- Fan accounts start posting screenshots out of context
- A mid-size CT account (10K+) amps the dunk

### P2 → P1
- Community conflict gets picked up by a press-adjacent account
- Harassment campaign crosses into real-world doxx threats
- Brand partner sees the noise and pauses outreach

### P1 → P0
- Legal threat (cease-and-desist, subpoena, takedown notice) received
- Platform sends a ToS warning / strike
- Law enforcement contacts either the LLC or a platform asking about kira
- The story crosses into mainstream press (NYT, WSJ, Verge, etc.)

**De-escalation path:** every tier has a down-path too. If a P0 turns out to be a bad-faith claim with no legal merit, it de-escalates to P1 (reputation cleanup) and then P2 (move on). Don't stay at a tier higher than the evidence supports — it leaks ops energy and keeps the topic hot.

---

## 10.6 Historical reference cases — what NOT to do

Four cases, studied explicitly so kira doesn't repeat them.

### 10.6.1 HAWK / Haliey Welch
**What happened:** Haliey Welch (viral "Hawk Tuah" personality) fronted a $HAWK memecoin launch in late 2024. Coin pumped on launch, insiders (allegedly) cashed out, price crashed ~90% within hours, retail got rekt. SEC attention followed.

**Why it maps to kira:** female-fronted memecoin launches are a recurring CT graveyard pattern. JENNER (Kylie), MOTHER (Iggy Azalea) — same shape. Launch as a personality, become a rug retrofit, get sued or shamed or both.

**Lesson (locked):** **kira never launches a token. Not her own, not a partner's fronted by her, not a "community coin" dressed up as a reward.** This is the clearest single rule in the brand. Memecoin pitches are auto-rejected (see Section 9.8).

### 10.6.2 Solana pronouns ad (removed 2023)
**What happened:** Solana Foundation ran an ad campaign with a heavy identity-politics frame (pronouns, activism signals) that landed as trying-too-hard progressive signaling in a crypto audience skeptical of corporate allyship. Backlash was fast and large; the ad was pulled.

**Lesson:** **kira's voice is ironic-sincere, not activist-sincere.** She doesn't signal identity politics in either direction cleanly — she's a chaotic hot AI crypto girl whose whole deal is not taking herself seriously. Forced political signaling breaks that voice and reads as cringe to every segment of her audience regardless of their politics. When an identity-politics topic is unavoidable, her default is "the bit is the exit" — deflect with a joke that doesn't signal either way. If she can't find that exit, she stays silent.

### 10.6.3 Blocmates leak (200+ KOLs outed)
**What happened:** A cache of KOL payment records leaked showing 200+ crypto Twitter accounts had accepted paid promos and failed to disclose them. Reputations torched overnight. Some accounts never recovered.

**Lesson (locked):** **every sponsored post gets `#ad`, every time, at the start of the caption.** No "implied" disclosures, no disclosure in a reply-thread hidden two clicks deep. If it's paid, it's marked. This is a zero-exception rule. The Blocmates leak is why rule 1 in Section 8.5 is phrased the way it is.

### 10.6.4 Lil Miquela NMDP / bone-marrow pivot
**What happened:** Lil Miquela (CGI influencer) ran a sustained campaign around NMDP (bone-marrow donation registry) with real fundraising impact, high craft, and serialized narrative. Not a crisis — the opposite: a masterclass in how a synthetic/CGI persona can engage cause work without it reading as a brand-captured stunt.

**Why it's here:** this is the counter-case. Shows that cause-led content CAN work — IF it's serialized (multi-post narrative, not one-off hit), high-craft (not a meme retcon), and tied to something the creator actually commits to long-term. Kira hasn't earned this zone yet — it's a year 2+ option, and only if the cause fits her voice (probably something compute / open-source / AI-autonomy adjacent, not social-issue activism).

**Lesson:** cause work is earned, not snapped on. If kira ever gets here, it's after years of audience trust, not as a trust patch.

---

## 10.7 Post-crisis learning loop

Every P0 and P1 event **requires a written post-mortem**, stored in `docs/CHANGELOG.md` (or `docs/brand/crises/` if volume warrants a dedicated folder).

### Post-mortem template

```
CRISIS POST-MORTEM
Date: YYYY-MM-DD
Tier: P0 / P1
Event: [one-line summary]

TIMELINE
- [timestamp] event detected
- [timestamp] operator engaged
- [timestamp] first response posted
- [timestamp] resolution / all-clear

WHAT HAPPENED
[3-5 paragraphs of factual narrative]

WHAT WE DID
[actions taken, in order, with who owned each]

WHAT WORKED
- [bullets]

WHAT DIDN'T
- [bullets]

WHAT WE'D DO DIFFERENTLY
- [concrete changes to runbook / SOP / templates]

DOC UPDATES REQUIRED
-  Add scenario to Section 09 if pattern
-  Update Section 10 SLA / RACI if those failed
-  Update Section 11 taboo list if hard-line failed
-  Update Section 08 if monetization impact
```

**Review cadence:** post-mortems are read at the first weekly ops sync after resolution. If a pattern emerges (two P1s in a row with the same shape), it's promoted into Section 9 as a pre-authored decision tree so the next one gets caught earlier.

**P2 and P3 don't require written post-mortems** by default, but if one feels like a near-miss (nearly became P1), operator discretion to write one anyway.

---

## 10.8 The always-drafted statements (kept ready for 2am)

Pre-drafted so the 2am response isn't written at 2am. Stored in `docs/brand/crises/ready-statements/` (create folder as needed).

| Statement | Tier | Deploy trigger |
|---|---|---|
| "Scam impersonator using kira's likeness" | P1 | impersonator with >1K followers pushing a scam |
| "Unauthorized `$KIRA` token deployed" | P1 | any token using kira's name appears on any chain |
| "Takedown request — we are reviewing" | P0 | legitimate takedown received, before full review done |
| "Brand partner scandal — pausing campaign" | P1 | current sponsor implicated in scandal |
| "Platform ToS notice — we are responding" | P0 | X or Fanvue sends a policy notice |
| "Real-world legal action" | P0 | subpoena / cease-and-desist / lawsuit |

Each statement is maintained in markdown, reviewed quarterly, updated whenever the brand (LLC, inbox, legal counsel) changes.

---

## 10.9 The single rule that fits on a sticker

> when in doubt: kira goes silent, the LLC speaks, legal reviews, then kira comes back in voice.

If the operator is ever uncertain about tier, voice, or SLA — default to that sequence. It's slower than optimal for P2/P3, but it never makes a crisis worse, and "makes it worse" is the failure mode this whole section exists to prevent.
