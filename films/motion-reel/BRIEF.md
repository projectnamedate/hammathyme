---
workflow: general-video
flow: companion
storyboard: yes
message: "Motion design where every piece sets off the next"
destination: website
aspect: 1920x1080
language: en
audience: creative directors and studios browsing the hammer portfolio
length: 64s
angle: showcase reel
---

## Intent

Chain Reaction: the new hammer motion graphics reel, replacing the May v3 reel at
/work/motion-graphics/reel. A motion-graphics Rube Goldberg machine: each technique
physically sets off the next, one continuous chain, no hard cuts. Jeff (2026-10-17):
"truly incredible awe inspiring fun and unique, and have its own colors different from
the aesthetic of the hammer brand, using the color theory skill".

## Customizations

- Own palette, risograph triadic, 60-30-10: newsprint #EEF0EA (60), riso blue #3255A4 (30),
  fluoro pink #FF48B0 + riso yellow #FFE800 (10). Overprints by multiply.
- Misregistered riso print: plate offsets 2-4 px, paper grain, halftone on fills.
- One MiniMax H3 generated shot inside the chain, graded into the riso look.
- Suno instrumental bed, playful and percussive, with hit points for impacts.

## Notes

- Contrast (computed): blue on newsprint 6.16:1 (type OK); yellow on blue 5.65:1;
  pink on newsprint 2.69:1 and yellow on newsprint 1.09:1, so pink/yellow never carry text on newsprint.
- Hammer appears only as a small sign-off at the end.
- No em-dashes in on-screen copy; no BRAND_GUIDE banned words.
- Spend cap for the run: under $5 (Suno + one H3 shot).
- Jeff 2026-10-17: plan approved, build in one go (no sketch board). Sign-off dot stays riso pink (the ball becomes the dot), a deliberate one-off exception to the cinnamon-dot rule for this reel.
- Jeff 2026-10-17 (v2 notes): more capability copy; more 3D; the end dot too big and off the baseline; the H3 take hallucinated (ball rolled back), not a real Rube Goldberg; aim for a million-view X post (reference: voxyz_ai post of the motion-prompt gallery). Decisions: Rube Goldberg built in three.js (no AI video), ~24 named moves tagged on screen from the motion-prompt dictionary, apricot stock #FAD5B0 instead of newsprint (complement of the blue ink; blue type 5.12:1).
- Jeff 2026-10-17 (v2 audit): the rewind and the bottom-row wall were things the film never actually shows. Rule: everything on screen is something the chain did. Cut the rewind (world time now just stops at the overview); cut the wall of motion-prompt demo tiles (panels 7 and 9); the overview frames the six panels that ran; the catapult ball leaves the machine through the lens and falls back out of it as the full stop. Every tag checked against the picture: #014 motion trail got a real trail behind the "1"; the vertical camera move is #026 tilt, not #025 pan; the idle cursor in the interfaces panel was removed.
- Audit loop 2 (draft render qc-v02, frame-level): the "1" now hops gravity → bounce → chaos so each switch it lands on is the one that flips; the speed-slider handle stays on its track, flies off the end into GO (moved to track height), and settles on the floor; the move counter moved to bottom-right off the crop/registration marks; overview tags are pushed off the panel headings and the counter; #038's anchor pulled in so it stays in frame through the zoom. Mix -14.9 LUFS, true peak -1.2 dBTP.
- Jeff 2026-10-17 (after the v01 master): the music was "incredibly bad taste ... like some bad dog commercial"; make it cool and technical. The apricot stock was bad; no grain. Decisions: new Suno bed (v6-wild, minimal techno/IDM, 118 BPM) take chain-bed-v08, cut to the grid by scripts/edit-bed.mjs (0.27 s lead, bar 18 repeated so the take's break sits on the hammer's hang and the drop on the smash, one outro bar dropped) into chain-bed-edit-v01.wav; SFX re-voiced from toy sounds (woodblock, boing, bell) to digital ticks, a zap and a clean ping (sfx v05). Stock: lilac #DAD4EE with #F8F6FD surfaces (Jeff picked it from steel / mint / lilac / graphite; blue type 4.9:1). Grain overlay removed; the 3D shader is flat ink with a smooth second-ink shadow (Jeff chose flat over halftone). Rube Goldberg geometry fixed: the marble sat under the right-to-left ramp (normal flipped) and clipped out of a funnel whose hole was smaller than the marble; ramps now have posts at both ends, backstops at the two turnarounds, a funnel post, and the marble spirals one radius inside the cone and drops through the hole.
- Master: renders/chain-reaction-v04.mp4 = v02 render (24p, CRF 10, delivery) with +2.1 dB static gain and a peak limiter: -14.0 LUFS, LRA 5.1, true peak -0.8 dBTP, 66.000 s.
