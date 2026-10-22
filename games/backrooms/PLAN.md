# Backrooms shooter: plan (2026-10-21, not built; shelved)

**Shelved the same day.** Jeff: "maybe Backrooms is played out" (Steam search lists 659 "backrooms" results). The DOOM-style shooter stays item 1 with a different twist. The research below (horror design, naming and IP, the tech stack) still applies.

Jeff, 2026-10-21: "make a game, DOOM but in the Backrooms. So Backrooms is actually scary. Do deep research and plan that out and make it item 1. Don't build yet." Backlog row 29, item 1 in the pieces order. Category: interactive + playable.

## The idea in one line

A fast, DOOM-feel shooter in the Backrooms, where the scare comes from the place. You have a gun, and in a silent office maze every shot is loud.

## Name

- **Not "DOOM".** ZeniMax holds the Doom trademark and enforces it: it sent DoomRL a cease-and-desist on 2 December 2016, and the game was renamed DRL on 7 December ([Wikipedia](https://en.wikipedia.org/wiki/DRL_(video_game)), verified). "Doom" can't be in the title, the logo or the page title.
- **"Backrooms" as a word is usable.** It's a 2019 4chan concept ([Wikipedia](https://en.wikipedia.org/wiki/The_Backrooms)). A24 "makes no claim of ownership over the yellow wallpaper" and told Kotaku "a firm no" on striking new Backrooms creator work ([Kotaku, 17 July 2026](https://kotaku.com/backrooms-director-kane-parsons-a24-copyright-strike-wallpaper-2000717053)). Both are verified.
- **What we don't use:**
  - Kane Parsons' or A24's own story and creatures (Async, anything from the film).
  - Backrooms Wiki entities. Wiki text is CC BY-SA 3.0, which would bind us to share-alike; for example, the Partygoers are the wiki's Entity 67 (both verified on backrooms-wiki.wikidot.com).
  - So every entity, lore line and name is our own.
- **Working titles (Jeff picks):**
  - **noclip**: the term from the original post, about slipping out of reality into the Backrooms.
  - **level zero**
  - **hum**
  - **yellow**

## What makes the Backrooms scary (evidence)

- **Familiar but wrong, and empty.** Built places become uncanny through "deviations from familiar configural patterns". Human presence made distorted public spaces *less* uncanny. Diel & Lewis, *Journal of Environmental Psychology* 82 (2022); both quotes verified in the abstract. Emptiness and wrong layouts do the work, not monsters.
- **Monster-heavy Backrooms games read as not scary; the empty ones rate highest.** Steam, English, all purchase types, fetched 2026-10-21, verified:

  | Game | Rating | Reviews |
  |---|---|---|
  | POOLS (no creatures) | Overwhelmingly Positive | 3,434 / 157 |
  | The Complex: Found Footage | Very Positive | 5,625 / 436 |
  | Escape the Backrooms | Very Positive | 50,502 / 6,815 |
  | Inside the Backrooms | Mostly Positive | 10,244 / 2,902 |

  - Escape the Backrooms reviewers complain of "repetitive monster encounters" and "keep dying until you memorize the maze".
  - Inside the Backrooms: "scripted events make it a whole lot less scary".
  - This pattern comes from a small sample of reviews, so treat it as a signal, not a study.
- **Restraint and the analogue look.** Kane Parsons' series sells the place through camcorder footage and a creature kept blurred (Dazed and Fangoria via the research agent; quotes unverified).
- **Death kills fear.** "So when a death occurs, the situation has lost its sense of fear and the unknown." Thomas Grip, Frictional Games (verified).
- **Light versus gun.** Original Doom 3: "the player must choose between holding a weapon and holding the flashlight". The BFG Edition gave in and added an armour-mounted light (verified). It's a real lever, and players resented it, so use a softer version.
- **Enemies that seem to think.** F.E.A.R.: "Having A.I. speak to each other allows us to cue the player in to the fact that the coordination is intentional" (Orkin, GDC 2006; verified in the PDF).
- **Prior art for the tech.** [vackrooms](https://github.com/pablostanley/vackrooms) (MIT; Next.js, three.js, a stalker, a VHS look) is a Backrooms *walker*, not a shooter, and shows the endless streamed maze works in a browser (verified; repo and architecture doc read).

## Design pillars

1. **Silence first.**
   - The first 2–3 minutes have no enemies: hum, carpet, wrong geometry. A room that's longer than the one you just walked through; a door into a wall.
   - The first gunshot is an event.
2. **Noise is the cost of power.**
   - The gun is DOOM-loud in a silent maze. Every shot carries through the maze and pulls things toward you.
   - The fluorescent hum is the safety signal. When something is near, the nearest lights cut out and the hum stops.
3. **Two kinds of enemy, not a bestiary.**
   - **The crawlers.** A few fast things that die to bullets: the DOOM catharsis. They come in short bursts, never a stream, and their clicks carry before you see them.
   - **The tenant.** One thing you never kill. Bullets only stun it. It's only seen blurred, far away or in a flash. It has one sound of its own (a dragging, office-chair roll), never a scream.
4. **Light and ammo share one battery.**
   - A camcorder light runs off the same cell as the gun. You're always a little short.
   - Batteries turn up in desk drawers and vending machines.
5. **No game over until the end.**
   - When the tenant reaches you, you don't die. The tape glitches and you "fall" one level deeper; the maze re-links around you.
   - Death only ends a run at the bottom.
6. **The camcorder frame.**
   - Low internal resolution, tape grain, chromatic offset, scanlines, a REC timestamp.
   - No scripted jump scares: every scare comes from a system (lights cutting, sound, the tenant's route).

## A run (10–15 minutes)

1. **Level 0, the yellow office.** You noclip in with nothing; the clock reads REC 00:00:00. Explore. A camcorder is on a desk (the light). A pistol is in a desk drawer around minute 2–3.
2. **First contact.** Distant clicks, then crawlers. The first fight is short and loud. Afterwards, silence, and one light down the corridor goes out.
3. **The tenant.** It starts stalking. It's never seen clearly, just the chair-roll sound and lights failing along its route.
4. **Descend.** An exit sign leads to Level 1 (wet concrete, a parking structure), and contact with the tenant also drops you there. Level 2, the pipe rooms, is v2.
5. **End.** Find the exit on the deepest level, or the tape runs out. The score is depth reached plus REC time, and the tape name is the share seed (as vackrooms does with `?tape=`).

## Tech

Reuse Sushi Scramble's shape (all verified in the repo):
- dynamic import after Play behind a WebGL2 check (`components/games/sushi-scramble/SushiScrambleGame.tsx:22,29`)
- a fixed 1/60 s step in `setAnimationLoop` (`lib/games/sushi-scramble/engine.ts:23,444-458`)
- quality tiers stepped by median frame time
- its own input: pointer lock plus twin-stick touch
- EffectComposer post
- synthesized audio

New code goes in `lib/games/<title>/`, `components/games/<title>/` and `games/<title>/`.

| Part | Choice | Status |
|---|---|---|
| Maze | Chunks as a pure function of `hash(cx, cz, seed)`: a seeded depth-first maze, then extra openings so it loops, with doorways hashed from the shared edge so neighbours agree. A 3×3 window streams and disposes. | vackrooms does exactly this, verified in its ARCHITECTURE.md. We write our own. |
| Walls etc. | About 4 `InstancedMesh` per chunk: wall, floor, ceiling, light panel. That's about 40 draw calls. | `setColorAt` and `BatchedMesh.perObjectFrustumCulled` exist in r180 (verified). |
| Light | Emissive panels that flicker via `setColorAt`. Lambert walls with falloff baked into vertex colour. 2–4 real PointLights moved to the nearest panels, no shadows. FogExp2 hides the window edge. | Approach is inferred; `lightMap` on Lambert verified. |
| Camcorder look | Render at low internal resolution; one custom ShaderPass for grain, RGB offset, scanlines, vignette and tape wobble. No new dependency. | r180's FilmShader has only intensity and grayscale, no scanlines (verified), hence the custom pass. pmndrs postprocessing 6.39.5 also supports r180 (peer `>=0.168 <0.187`, verified) if we want it. |
| Collision | Circle against the wall segments in each cell's bitmask. Flat floors, no physics engine. | Rapier's wasm is about 1.2 MB gzipped (agent-measured, unverified); not needed. |
| Enemy AI | One flow field from the player over the grid, recomputed when the player changes cell. The tenant uses its own route and listens for gunshots. | Standard technique. The agent's Red Blob quote didn't match on recheck, so it's unverified. |
| Enemy look | DOOM-style billboard sprites in 8 rotations, from one atlas through one InstancedMesh. They read well under the low-res tape. | DOOM's source confirms the 8-rotation scheme (`r_things.c`, verified). Concept only; the code is GPL. |
| Audio | Web Audio, HRTF panning (three's PositionalAudio sets it, verified). A synthesized 120 Hz mains hum (US: double 60 Hz) on the 4 nearest panels. Lowpass "occlusion" scaled by the walls a grid ray crosses. The AudioContext starts on the Play gesture. | Approach is inferred. |

**Budget** (guesses until measured):
- Draw calls: at most 60.
- Triangles: at most 150k.
- Lights: at most 4, none casting shadows.
- Textures: at most 32 MB.
- Device pixel ratio: 1 on phones.
- Game code: about 40 KB on top of three.

## Assets and spend

- **Surfaces:** yellow wallpaper, damp carpet and ceiling tiles.
  - Option 1 is GPT Image 2.5 flare, made tileable.
  - Option 2 is Poly Haven CC0, which Sushi already uses.
  - Either way, add a grime and stain pass.
- **Crawlers and the tenant:**
  - Design stills in GPT Image 2.5 (load `gpt-image-2-5` and `color-theory` first).
  - Turn them into a mesh with Hunyuan 3D 3.1 (`3d-pipeline`).
  - Render 8 rotations plus a few animation frames in Blender, so the sprites stay on model.
- **The gun:** a first-person weapon sprite, made the same way.
- **Sound:**
  - The hum and the tape noise are synthesized.
  - Footsteps, the crawlers' clicks and the tenant's chair roll are made with ElevenLabs sound effects.
  - No music bed, or one low drone at most (Jeff's taste: no toy or jingle sound).
- **Route:** image and 3D calls go through Sunra once the account and `SUNRA_KEY` exist (the 2026-10-21 Sunra move); until then Evolink and fal as now.
- **Estimate:** about $10–20, under the $25 line.

## Build order (each step verified before the next)

1. **Walk.** Endless Level 0, movement, collision, hum, camcorder pass.
   - verify: 1440 and 390 screenshots; at least 50 fps on a mid phone tier; chunk seams agree when walked in any order.
2. **Light and the gun.** Battery meter, camcorder light, pistol, noise events.
   - verify: shots raise the noise map; ammo and light drain the same cell.
3. **Crawlers.** Flow field, sprites, a short burst.
   - verify: they reach you through the maze, never through walls.
4. **The tenant.** Stalking, lights failing on its route, stun, contact drops you a level.
   - verify: a scripted run log shows it never spawns in your line of sight.
5. **Level 1 and the exit, then the site page.**
   - verify: route, card, llms, agents.json, gates, live.

## Open questions for Jeff

- The title. Pick one, or something else.
- How violent: is DOOM-style gore OK, or keep it to tape glitches?
- Should phones get the full game, or should the card say desktop-first?
