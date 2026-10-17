import * as THREE from "three";
import { loadAssets } from "./assets";
import { createAudio } from "./audio";
import { createCameraRig } from "./camera";
import { createDrones } from "./drones";
import { createFx } from "./fx";
import { createHand, HAND } from "./hand";
import { createHazards } from "./hazards";
import { buildHero } from "./hero";
import { createHud, type Tracked } from "./hud";
import { createInput, type InputFrame } from "./input";
import { createPlayer, damagePlayer, regenShield, stepPlayer } from "./player";
import { buildPost, type Post } from "./post";
import { CAMERA, LOOK, PLAYER, TIERS, WORLD, type Tier } from "./tuning";
import { createWaves } from "./waves";
import { createWeapons } from "./weapons";
import { buildWorld } from "./world";

export type SushiScrambleOptions = { tier?: Tier; onProgress?: (share: number) => void; debug?: boolean };
export type SushiScramble = { dispose: () => void };

type Mode = "title" | "playing" | "paused" | "dying" | "over";
const STEP = 1 / 60;
const BEST_KEY = "sushi-scramble-best";
const readBest = () => {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
};
const writeBest = (n: number) => {
  try {
    localStorage.setItem(BEST_KEY, String(n));
  } catch {}
};

export async function createSushiScramble(mount: HTMLElement, options: SushiScrambleOptions = {}): Promise<SushiScramble> {
  // Phones start a tier down; the first seconds of play step it down again if frames run slow.
  let tier: Tier = options.tier ?? (matchMedia("(pointer: coarse)").matches ? "medium" : "high");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, TIERS[tier].dpr));
  renderer.toneMapping = THREE.AgXToneMapping;
  renderer.toneMappingExposure = LOOK.exposure;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.className = "block h-full w-full touch-none";
  mount.appendChild(renderer.domElement);

  const assets = await loadAssets(renderer, options.onProgress ?? (() => {}));
  const scene = new THREE.Scene();
  // The HDRI lights and reflects; what you see beyond the set is the room's own darkness.
  scene.environment = assets.env;
  scene.environmentIntensity = LOOK.envIntensity;
  scene.background = new THREE.Color(0x0c0809);
  const world = buildWorld(assets);
  scene.add(world.root);

  // Light: a warm raking key with soft shadows that follow the hero, a cool rim, and lantern lights that move
  // to whichever lanterns are nearest the camera.
  const key = new THREE.DirectionalLight(LOOK.keyColor, LOOK.keyIntensity);
  key.castShadow = true;
  const s = key.shadow.camera;
  s.left = s.bottom = -9;
  s.right = s.top = 9;
  s.near = 1;
  s.far = 45;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  key.shadow.radius = 4;
  const setShadowSize = (n: number) => {
    key.shadow.mapSize.set(n, n);
    key.shadow.map?.dispose();
    key.shadow.map = null;
  };
  setShadowSize(TIERS[tier].shadows || 512);
  scene.add(key, key.target);
  const rim = new THREE.DirectionalLight(LOOK.rimColor, LOOK.rimIntensity);
  scene.add(rim, rim.target);
  const lanternLights = Array.from({ length: 8 }, () => {
    const l = new THREE.PointLight(LOOK.lanternColor, LOOK.lanternIntensity, 16, 2);
    scene.add(l);
    return l;
  });

  const hero = buildHero(assets.models.hero);
  scene.add(hero.root);
  let player = createPlayer();
  const rig = createCameraRig(world.colliders, reduced, player.facing + Math.PI);
  let post: Post = buildPost(renderer, scene, rig.camera, tier);
  const fx = createFx(scene, world.belt);
  const drones = createDrones(scene);
  const hand = createHand(scene, assets.models.handOpen, assets.models.handFist);
  const hazards = createHazards(world.belt);
  const weapons = createWeapons(scene, fx, drones, hand, world.colliders, world.belt);
  const waves = createWaves();
  const hud = createHud(mount, reduced);
  const input = createInput(renderer.domElement, CAMERA.lookSensitivity, hud.touchUi);
  const audio = createAudio();
  hud.touch(input.touch);

  let mode: Mode = "title";
  let time = 0;
  let score = 0;
  let best = readBest();
  let combo = 0;
  let comboUntil = 0;
  let dyingFor = 0;
  let cause: "eaten" | "dropped" = "eaten";
  let soakedShown = false;
  let lastSoy = false;
  let godMode = false;
  let aimingNow = false;
  let injected: Partial<InputFrame> = {};
  let injectedUntil = 0;
  hud.score(0, best);
  hud.card("start");

  const muzzle = new THREE.Vector3();
  const chest = new THREE.Vector3();
  const playerVel = new THREE.Vector3();
  const fwd = new THREE.Vector3();

  const addScore = (n: number) => {
    score += n;
    hud.score(score, best);
  };
  const angleOf = (p: THREE.Vector3) => Math.atan2(p.z, p.x);

  const begin = () => {
    drones.clear();
    hazards.clear();
    weapons.reset();
    player = createPlayer();
    rig.yaw = player.facing + Math.PI;
    rig.pitch = -0.08;
    score = 0;
    combo = 0;
    hud.score(0, best);
    hud.shield(1);
    hud.fish(1);
    hud.boss(null);
    hud.ammo(weapons.ammo(), 32, false);
    hud.ginger(weapons.ginger());
    world.setHungry(false);
    hero.root.visible = true;
    mode = "playing";
    hud.card(null);
    input.requestLock();
    void audio.start();
    handleWaves(waves.start());
  };
  const pause = () => {
    if (mode !== "playing") return;
    mode = "paused";
    hud.card("pause");
    audio.suspend();
  };
  const resume = () => {
    if (mode !== "paused") return;
    mode = "playing";
    hud.card(null);
    input.requestLock();
    audio.resume();
  };
  hud.onButton((action) => (action === "resume" ? resume() : begin()));

  const onCanvasClick = () => {
    if (mode === "playing" && !input.locked()) input.requestLock();
  };
  renderer.domElement.addEventListener("click", onCanvasClick);
  const onLock = () => {
    if (!input.touch && document.pointerLockElement !== renderer.domElement && mode === "playing") pause();
  };
  document.addEventListener("pointerlockchange", onLock);
  const onHidden = () => {
    if (document.hidden) pause();
  };
  document.addEventListener("visibilitychange", onHidden);
  window.addEventListener("blur", pause);

  function handleWaves(events: ReturnType<typeof waves.update>) {
    for (const e of events) {
      if (e.type === "announce") {
        hud.wave(e.wave);
        hud.banner(`wave ${e.wave}`, e.boss ? "the diner is hungry" : e.wave === 1 ? "chopstick drones inbound" : "", 2.4);
        audio.play("wave");
        hazards.place(Math.min(4, e.wave - 1), 1, angleOf(player.pos));
        weapons.refillGinger();
        hud.ginger(weapons.ginger());
      } else if (e.type === "spawn") {
        for (let i = 0; i < e.count; i++) {
          const a = angleOf(player.pos) + (Math.random() < 0.5 ? -1 : 1) * (0.45 + Math.random() * 0.55);
          const r = WORLD.beltRadius + (Math.random() - 0.5) * 4;
          drones.spawn(new THREE.Vector3(r * Math.cos(a), 5 + Math.random() * 1.5, r * Math.sin(a)), e.speed);
        }
      } else if (e.type === "boss") {
        hand.start(player.pos);
        world.setHungry(true);
        hud.boss(1);
        hud.banner("the hand", "it wants a bite", 2);
        audio.play("telegraph", 1.4);
      } else if (e.type === "cleared") {
        addScore(250 * e.wave);
        hud.banner(`wave ${e.wave} cleared`, `+${250 * e.wave}`, 2);
      }
    }
  }

  const hurt = (amount: number, from: THREE.Vector3) => {
    if (godMode || !player.alive) return;
    const hadShield = player.shield > 0;
    const r = damagePlayer(player, amount, time);
    fx.burst(hadShield ? "rice" : "soy", chest, hadShield ? 26 : 12, 3.2);
    audio.play(hadShield ? "shieldHit" : "fishHit");
    if (r.shieldBroke) {
      audio.play("shieldBreak");
      hud.flash();
      fx.burst("rice", chest, 50, 4.5, 2);
    }
    rig.shake(0.35);
    rig.forward(fwd);
    const dx = from.x - player.pos.x;
    const dz = from.z - player.pos.z;
    hud.damageFrom(Math.atan2(fwd.x * dz - fwd.z * dx, fwd.x * dx + fwd.z * dz));
    if (r.died) {
      mode = "dying";
      dyingFor = 0;
      cause = "eaten";
      audio.play("eaten");
      world.setHungry(true);
      hud.banner("eaten.", "", 1.4);
    }
  };

  const step = (dt: number) => {
    const raw = input.read();
    const f: InputFrame = time < injectedUntil ? { ...raw, ...injected } : raw;
    if (f.mute) {
      audio.setMuted(!audio.muted());
      hud.banner(audio.muted() ? "sound off" : "sound on", "", 0.8);
    }
    if (f.pause && mode === "playing") pause();
    else if (f.pause && mode === "paused") resume();
    if (mode === "paused" || mode === "over") return;
    time += dt;
    world.update(time);
    hazards.update(time);
    fx.update(dt);

    if (mode === "title") {
      // Attract loop: the hero walks against the belt and holds its place while the camera drifts round.
      rig.yaw += dt * 0.06;
      hero.root.position.copy(player.pos);
      hero.root.rotation.y = player.facing;
      hero.animate(time, dt, 0.45, false, 0);
      return;
    }
    if (mode === "dying") {
      dyingFor += dt;
      if (cause === "eaten") {
        // Picked up off the belt by the diner.
        hero.root.position.y += dt * (1 + dyingFor * 6);
        hero.root.rotation.y += dt * 6;
      } else {
        // Over the edge: it keeps falling, tumbling, out of sight below the counter.
        hero.root.position.y -= dt * (2 + dyingFor * 9);
        hero.root.rotation.x += dt * 3;
      }
      if (dyingFor > 1.8) {
        mode = "over";
        hero.root.visible = false;
        if (score > best) {
          best = score;
          writeBest(best);
        }
        hud.card("over", { score, best, wave: waves.wave(), cause });
        if (document.pointerLockElement === renderer.domElement) document.exitPointerLock();
      }
      return;
    }

    // Playing.
    rig.look(f.lookX, f.lookY);
    const aiming = f.aim;
    aimingNow = aiming;
    const before = player.pos.clone();
    stepPlayer(player, f, rig.yaw, dt, time, world.plates, aiming);
    // Off the counter's edge there is only the floor: falling below it ends the run.
    if (player.pos.y < -1 && player.alive && !godMode) {
      player.alive = false;
      mode = "dying";
      dyingFor = 0;
      cause = "dropped";
      audio.play("fishHit", 1.4);
      audio.play("boom", 0.5);
      hud.banner("dropped.", "", 1.4);
      return;
    }
    playerVel.subVectors(player.pos, before).divideScalar(dt);
    chest.copy(player.pos).add(new THREE.Vector3(0, 0.55, 0));

    const touching = hazards.touching(player.pos, time);
    if (touching.soy) {
      player.slowedUntil = time + 0.4;
      player.soakedUntil = time + 2;
      if (!lastSoy) {
        audio.play("splash");
        fx.burst("soy", player.pos.clone().add(new THREE.Vector3(0, 0.1, 0)), 14, 2.4);
      }
    }
    lastSoy = touching.soy;
    if (touching.fresh) {
      hazards.take(touching.fresh);
      player.health = Math.min(PLAYER.healthMax, player.health + 35);
      player.shield = PLAYER.shieldMax;
      audio.play("pickup");
      fx.burst("wasabi", chest, 20, 2.5);
      hud.banner("fresh plate", "+35 fish", 1.2);
    }
    regenShield(player, dt, time);
    const soaked = time < player.soakedUntil;
    if (soaked !== soakedShown) {
      hud.soaked(soaked);
      soakedShown = soaked;
    }

    // Weapons fire from the blaster's mouth toward whatever the crosshair covers.
    hero.root.updateMatrixWorld(true);
    hero.muzzle.getWorldPosition(muzzle);
    rig.forward(fwd);
    if (f.reload && weapons.reload(time)) audio.play("reload");
    if (f.fire) {
      const wasReloading = weapons.reloading();
      const shot = weapons.tryFire(time, muzzle, rig.camera.position, fwd, aiming);
      if (shot) {
        audio.play("shot");
        rig.kick(aiming ? 0.006 : 0.012);
        if (shot.kind === "drone") {
          hud.hit(shot.killed);
          audio.play("hit");
        } else if (shot.kind === "hand") {
          hud.hit(shot.defeated);
          audio.play("hit");
          hud.boss(hand.hp() / HAND.hp);
        }
      } else if (!wasReloading && weapons.reloading()) audio.play("reload");
    }
    if (f.grenade && weapons.throwGinger(muzzle, fwd)) {
      audio.play("throw");
      hud.ginger(weapons.ginger());
    }
    for (const blast of weapons.update(time, dt)) {
      audio.play("boom");
      rig.shake(Math.max(0.15, 0.7 - blast.at.distanceTo(player.pos) / 12));
      if (blast.hand) hud.boss(hand.hp() / HAND.hp);
    }

    for (const e of drones.update(chest, playerVel, dt, time)) {
      if (e.type === "windup") audio.play("windup", 0.6);
      else if (e.type === "pinch") {
        audio.play("pinch");
        if (e.hit) hurt(25, e.drone.pos);
      } else if (e.type === "died") {
        combo = time < comboUntil ? combo + 1 : 1;
        comboUntil = time + 2.2;
        addScore(100 * combo);
        if (combo > 1) hud.banner(`x${combo}`, "", 0.7);
        audio.play("kill");
        fx.burst("splinter", e.at, 16, 4);
        for (const piece of drones.stickDebris(e.drone)) {
          fx.debris(piece, new THREE.Vector3((Math.random() - 0.5) * 5, 3 + Math.random() * 2, (Math.random() - 0.5) * 5), new THREE.Vector3(Math.random() * 10, Math.random() * 10, Math.random() * 10));
        }
      }
    }

    for (const e of hand.update(player.pos, dt)) {
      if (e.type === "telegraph") audio.play("telegraph");
      else if (e.type === "slam") {
        audio.play("slam");
        rig.shake(0.8);
        fx.burst("rice", e.at, 30, 5, 1.2);
        if (e.hit) hurt(player.shield > 0 ? HAND.damage : 100, e.at);
      } else if (e.type === "defeated") {
        addScore(1500);
        hud.banner("the hand retreats", "+1500", 2);
      } else if (e.type === "gone") {
        hud.boss(null);
        world.setHungry(false);
      }
    }
    handleWaves(waves.update(dt, drones.alive().length, hand.active()));

    hero.root.position.copy(player.pos);
    hero.root.rotation.y = player.facing;
    hero.animate(time, dt, player.stride, !player.grounded, rig.pitch);
  };

  // Auto quality: measure the first seconds of real (visible) play and step the tier down if frames are slow.
  const samples: number[] = [];
  const setTier = (next: Tier) => {
    tier = next;
    post.dispose();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, TIERS[tier].dpr));
    post = buildPost(renderer, scene, rig.camera, tier);
    resize();
    setShadowSize(TIERS[tier].shadows || 512);
    lanternLights.forEach((l, i) => (l.visible = i < TIERS[tier].lanternLights));
  };

  const resize = () => {
    const { width, height } = mount.getBoundingClientRect();
    renderer.setSize(width, height, false);
    rig.camera.aspect = width / Math.max(height, 1);
    rig.camera.updateProjectionMatrix();
    post.setSize(renderer.domElement.width, renderer.domElement.height);
  };
  const observer = new ResizeObserver(resize);
  observer.observe(mount);
  resize();
  lanternLights.forEach((l, i) => (l.visible = i < TIERS[tier].lanternLights));

  let focus = 3;
  const focusRay = new THREE.Ray();
  const focusHit = new THREE.Vector3();
  const focusSphere = new THREE.Sphere();
  const crosshairDistance = () => {
    focusRay.set(rig.camera.position, rig.forward(fwd));
    let best = 14;
    for (const d of drones.alive()) {
      if (focusRay.intersectSphere(focusSphere.set(d.pos, 0.6), focusHit)) best = Math.min(best, focusHit.distanceTo(rig.camera.position));
    }
    const hs = hand.hitSphere();
    if (hs && focusRay.intersectSphere(hs, focusHit)) best = Math.min(best, focusHit.distanceTo(rig.camera.position));
    return best;
  };

  const timer = new THREE.Timer();
  let acc = 0;
  let trackerAt = 0;
  const pivot = new THREE.Vector3();
  const byDistance = (p: THREE.Vector3) => [...world.lanterns].sort((a, b) => a.distanceToSquared(p) - b.distanceToSquared(p));
  renderer.setAnimationLoop((now) => {
    timer.update(now);
    const frame = Math.min(timer.getDelta(), 0.1);
    if (mode === "playing" && !document.hidden && samples.length < 150) {
      samples.push(frame);
      if (samples.length === 150) {
        const median = [...samples].sort((a, b) => a - b)[75];
        if (median > 0.024 && tier !== "low") setTier(tier === "high" ? "medium" : "low");
        if (median > 0.024 && tier === "medium") samples.length = 0;
      }
    }
    acc += frame;
    while (acc >= STEP) {
      step(STEP);
      acc -= STEP;
    }
    pivot.copy(hero.root.position);
    rig.update(pivot, mode === "playing" && aimingNow, frame);
    hero.fade(1 - THREE.MathUtils.smoothstep(rig.pitch, 0.45, 0.85) * 0.7);
    const hp = hero.root.position;
    key.position.copy(hp).add(new THREE.Vector3(-9, 7, 5));
    key.target.position.copy(hp);
    rim.position.copy(hp).add(new THREE.Vector3(4, 5, -9));
    rim.target.position.copy(hp);
    byDistance(rig.camera.position)
      .slice(0, lanternLights.length)
      .forEach((p, i) => lanternLights[i].position.copy(p));
    // Rack focus: aiming pulls focus to whatever the crosshair covers; otherwise it rests on the hero.
    const focusTarget = aimingNow ? crosshairDistance() : rig.camera.position.distanceTo(hp) + 0.4;
    focus += (focusTarget - focus) * Math.min(1, frame * 7);
    post.setFocus(focus);

    if (mode === "playing") {
      hud.shield(player.shield / PLAYER.shieldMax);
      hud.fish(player.health / PLAYER.healthMax);
      hud.ammo(weapons.ammo(), 32, weapons.reloading());
      trackerAt -= frame;
      if (trackerAt <= 0) {
        trackerAt = 1 / 15;
        const sy = Math.sin(rig.yaw);
        const cy = Math.cos(rig.yaw);
        const items: Tracked[] = drones.alive().map((d) => {
          const dx = d.pos.x - player.pos.x;
          const dz = d.pos.z - player.pos.z;
          return { x: dx * cy - dz * sy, z: dx * sy + dz * cy };
        });
        const hs = hand.hitSphere();
        if (hs) {
          const dx = hs.center.x - player.pos.x;
          const dz = hs.center.z - player.pos.z;
          items.push({ x: dx * cy - dz * sy, z: dx * sy + dz * cy, big: true });
        }
        hud.tracker(items, 22);
      }
    }
    post.render();
  });

  if (options.debug) {
    const ray = new THREE.Raycaster();
    (window as unknown as { __sushi?: unknown }).__sushi = {
      renderer,
      scene,
      camera: rig.camera,
      post,
      info: () => renderer.info,
      state: () => ({ mode, time: +time.toFixed(2), score, wave: waves.wave(), drones: drones.alive().length, shield: Math.round(player.shield), health: Math.round(player.health), pos: player.pos.toArray().map((v) => +v.toFixed(2)), hand: hand.active(), tier }),
      play: () => begin(),
      god: (on = true) => (godMode = on),
      hurt: (amount: number) => hurt(amount, player.pos.clone().add(new THREE.Vector3(1, 0, 0))),
      // Hold an input for some seconds of game time, e.g. inject({ moveY: 1, fire: true }, 2).
      inject: (frame: Partial<InputFrame>, seconds: number) => {
        injected = frame;
        injectedUntil = time + seconds;
      },
      look: (dx: number, dy: number) => rig.look(dx, dy),
      handPos: () => hand.root.position.toArray().map((v) => +v.toFixed(2)),
      aimAt: (x: number, y: number, z: number) => {
        const cam = rig.camera.position;
        rig.yaw = Math.atan2(-(x - cam.x), -(z - cam.z));
        rig.pitch = Math.max(-0.55, Math.min(0.85, Math.atan2(y - cam.y, Math.hypot(x - cam.x, z - cam.z))));
      },
      aimAtNearest: () => {
        const cam = rig.camera.position;
        const target = drones.alive().sort((a, b) => a.pos.distanceTo(cam) - b.pos.distanceTo(cam))[0];
        if (!target) return false;
        const dx = target.pos.x - cam.x;
        const dz = target.pos.z - cam.z;
        rig.yaw = Math.atan2(-dx, -dz);
        rig.pitch = Math.atan2(target.pos.y - cam.y, Math.hypot(dx, dz));
        return true;
      },
      // Run the simulation for some seconds synchronously (a background tab's frame loop is throttled).
      advance: (seconds: number) => {
        for (let i = 0; i < Math.round(seconds / STEP); i++) {
          step(STEP);
          rig.update(hero.root.position, aimingNow, STEP);
        }
      },
      skipTo: (wave: number) => {
        drones.clear();
        handleWaves(waves.jumpTo(wave));
      },
      setTier,
      pick: (x: number, y: number) => {
        ray.setFromCamera(new THREE.Vector2(x, y), rig.camera);
        return ray.intersectObjects(scene.children, true).slice(0, 3).map((h) => ({ name: h.object.name || h.object.type, distance: +h.distance.toFixed(2) }));
      },
      frame: () => {
        post.setFocus(aimingNow ? crosshairDistance() : rig.camera.position.distanceTo(hero.root.position) + 0.4);
        post.render();
        return renderer.domElement.toDataURL("image/jpeg", 0.9);
      },
    };
  }

  return {
    dispose: () => {
      renderer.setAnimationLoop(null);
      observer.disconnect();
      renderer.domElement.removeEventListener("click", onCanvasClick);
      document.removeEventListener("pointerlockchange", onLock);
      document.removeEventListener("visibilitychange", onHidden);
      window.removeEventListener("blur", pause);
      input.dispose();
      audio.dispose();
      hud.dispose();
      weapons.dispose();
      drones.dispose();
      hand.dispose();
      hazards.dispose();
      fx.dispose();
      post.dispose();
      hero.dispose();
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.geometry.dispose();
        (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach((m) => m.dispose());
      });
      assets.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      if (options.debug) delete (window as unknown as { __sushi?: unknown }).__sushi;
    },
  };
}
