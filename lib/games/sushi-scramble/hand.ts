import * as THREE from "three";
import { groundAt } from "./arena";
import { fitTo } from "./world";

export const HAND = {
  hp: 600,
  length: 5.2, // the hand's longest extent, in hero heights
  hover: 6.4,
  offset: 4.6, // while tracking it hangs out over the counter beside the hero, where you can see and shoot it
  slamY: 0.35,
  track: 2.2,
  telegraph: 0.9,
  slam: 0.2,
  hold: 1.4, // the fist rests on the belt at eye level: the window to punish it
  rise: 0.9,
  grabs: 3,
  radius: 1.9, // the slam's reach on the belt
  damage: 60,
  // Turns the generated mesh so the palm faces down and the fingers point along -Z (set by eye in the lab).
  orient: new THREE.Euler(0, 0, 0),
};

type State = "idle" | "enter" | "track" | "telegraph" | "slam" | "hold" | "rise" | "retreat" | "defeated";
export type HandEvent = { type: "slam"; hit: boolean; at: THREE.Vector3 } | { type: "defeated" } | { type: "gone" } | { type: "telegraph" };

export type Hand = {
  root: THREE.Group;
  active: () => boolean;
  start: (target: THREE.Vector3) => void;
  hit: (damage: number) => boolean; // true when it is defeated
  hitSphere: () => THREE.Sphere | null;
  hp: () => number;
  update: (target: THREE.Vector3, dt: number) => HandEvent[];
  dispose: () => void;
};

function shadowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 4, 64, 64, 62);
  grad.addColorStop(0, "rgba(0,0,0,0.85)");
  grad.addColorStop(0.6, "rgba(0,0,0,0.55)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

export function createHand(scene: THREE.Scene, open: THREE.Group | null, fist: THREE.Group | null): Hand {
  const root = new THREE.Group();
  const pose = (model: THREE.Group | null) => {
    const holder = new THREE.Group();
    if (model) {
      const m = model.clone(true);
      m.rotation.copy(HAND.orient);
      fitTo(m, HAND.length);
      // Centre it on the palm so the hand hangs from its middle.
      const box = new THREE.Box3().setFromObject(m);
      m.position.y -= (box.max.y + box.min.y) / 2;
      holder.add(m);
    } else {
      holder.add(new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.8, 4), new THREE.MeshStandardMaterial({ color: 0xd9a07a })));
    }
    // Warm the generated skin a little so it doesn't read grey in the dark room.
    holder.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      const m = mesh.material as THREE.MeshStandardMaterial;
      if (m.color) m.color.multiply(new THREE.Color(1.08, 0.94, 0.86));
      if (m.roughness !== undefined) m.roughness = Math.max(m.roughness, 0.55);
    });
    return holder;
  };
  const openPose = pose(open);
  const fistPose = pose(fist);
  fistPose.visible = false;
  root.add(openPose, fistPose);
  root.visible = false;
  scene.add(root);

  const shadowTex = shadowTexture();
  const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0 });
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(HAND.radius * 1.15, 40).rotateX(-Math.PI / 2), shadowMat);
  scene.add(shadow);

  let state: State = "idle";
  let timer = 0;
  let hp = HAND.hp;
  let grabs = 0;
  const pos = new THREE.Vector3();
  const aim = new THREE.Vector3();
  const spin = new THREE.Vector3();
  const set = (s: State) => {
    state = s;
    timer = 0;
  };
  const ease = (t: number) => t * t * (3 - 2 * t);

  return {
    root,
    active: () => state !== "idle",
    hp: () => hp,
    start: (target) => {
      hp = HAND.hp;
      grabs = 0;
      pos.set(target.x, 18, target.z);
      aim.copy(target);
      root.visible = true;
      openPose.visible = true;
      fistPose.visible = false;
      root.rotation.set(0, Math.atan2(target.x, target.z), 0);
      set("enter");
    },
    hit: (damage) => {
      if (state === "idle" || state === "defeated" || state === "retreat") return false;
      hp -= damage;
      if (hp <= 0) {
        set("defeated");
        spin.set(2, 4, 1);
        return true;
      }
      return false;
    },
    hitSphere: () => (state === "idle" || state === "defeated" || state === "retreat" ? null : new THREE.Sphere(pos.clone(), HAND.length * 0.36)),
    update: (target, dt) => {
      const events: HandEvent[] = [];
      if (state === "idle") return events;
      timer += dt;
      const groundY = groundAt(Math.hypot(aim.x, aim.z));
      if (state === "enter") {
        const r = Math.hypot(target.x, target.z) || 1;
        pos.x += ((target.x * (r + HAND.offset)) / r - pos.x) * Math.min(1, dt * 2);
        pos.z += ((target.z * (r + HAND.offset)) / r - pos.z) * Math.min(1, dt * 2);
        pos.y += (HAND.hover - pos.y) * Math.min(1, dt * 2.5);
        if (timer > 1.2) set("track");
      } else if (state === "track") {
        // Hang out over the counter beside the hero, following it round the ring.
        const r = Math.hypot(target.x, target.z) || 1;
        const k = (r + HAND.offset) / r;
        pos.x += (target.x * k - pos.x) * Math.min(1, dt * 2.5);
        pos.z += (target.z * k - pos.z) * Math.min(1, dt * 2.5);
        pos.y = HAND.hover + Math.sin(timer * 2) * 0.25;
        if (timer > HAND.track) {
          set("telegraph");
          events.push({ type: "telegraph" });
        }
      } else if (state === "telegraph") {
        // Swing over where the hero is now and rear up; the shadow on the belt is the warning.
        aim.lerp(target, Math.min(1, dt * 4));
        pos.x += (aim.x - pos.x) * Math.min(1, dt * 6);
        pos.z += (aim.z - pos.z) * Math.min(1, dt * 6);
        pos.y = HAND.hover + ease(Math.min(1, timer / HAND.telegraph)) * 1.4;
        if (timer > HAND.telegraph) set("slam");
      } else if (state === "slam") {
        const k = Math.min(1, timer / HAND.slam);
        pos.y = THREE.MathUtils.lerp(HAND.hover + 1.4, groundY + HAND.slamY + 1.0, k * k);
        if (k >= 1) {
          openPose.visible = false;
          fistPose.visible = true;
          const d = Math.hypot(target.x - pos.x, target.z - pos.z);
          events.push({ type: "slam", hit: d < HAND.radius && target.y < groundY + 1.2, at: new THREE.Vector3(pos.x, groundY, pos.z) });
          set("hold");
        }
      } else if (state === "hold") {
        if (timer > HAND.hold) set("rise");
      } else if (state === "rise") {
        aim.copy(target);
        pos.y += (HAND.hover - pos.y) * Math.min(1, dt * 3);
        if (timer > HAND.rise) {
          openPose.visible = true;
          fistPose.visible = false;
          grabs += 1;
          set(grabs >= HAND.grabs ? "retreat" : "track");
        }
      } else if (state === "retreat" || state === "defeated") {
        pos.y += dt * (state === "defeated" ? 16 : 9);
        if (state === "defeated") {
          root.rotation.x += spin.x * dt;
          root.rotation.z += spin.z * dt;
        }
        if (pos.y > 24) {
          if (state === "defeated") events.push({ type: "defeated" });
          events.push({ type: "gone" });
          root.visible = false;
          set("idle");
        }
      }
      root.position.copy(pos);
      shadow.position.set(pos.x, groundAt(Math.hypot(pos.x, pos.z)) + 0.03, pos.z);
      const near = THREE.MathUtils.clamp(1 - (pos.y - 1) / (HAND.hover + 2), 0, 1);
      const hidden = !root.visible || state === "retreat" || state === "defeated";
      shadowMat.opacity = hidden ? 0 : 0.25 + near * 0.6 + (state === "telegraph" ? 0.15 : 0);
      shadow.scale.setScalar(0.6 + near * 0.6);
      return events;
    },
    dispose: () => {
      root.removeFromParent();
      shadow.removeFromParent();
      shadowTex.dispose();
      shadowMat.dispose();
      shadow.geometry.dispose();
    },
  };
}
