import * as THREE from "three";
import { groundAt, ISLAND_EDGE, OUTER_LIMIT } from "./arena";
import { DRONE, type Drone, type DroneKit } from "./drones";
import type { Fx } from "./fx";
import type { Hand } from "./hand";

export const BLASTER = { rate: 9, mag: 32, reload: 1.4, damage: 10, spread: 0.014, aimSpread: 0.003, range: 60 };
export const GINGER = { max: 2, speed: 11, lift: 4.2, fuse: 1.2, radius: 3.4, damage: 95, handDamage: 80 };

export type ShotResult = { kind: "drone"; drone: Drone; killed: boolean } | { kind: "hand"; defeated: boolean } | { kind: "world" } | { kind: "miss" };
export type BlastResult = { killed: Drone[]; hand: "hit" | "defeated" | null; at: THREE.Vector3 };

type Grenade = { mesh: THREE.Mesh; vel: THREE.Vector3; fuse: number };

export type Weapons = {
  ammo: () => number;
  reloading: () => boolean;
  ginger: () => number;
  refillGinger: () => void;
  tryFire: (time: number, from: THREE.Vector3, aimOrigin: THREE.Vector3, aimDir: THREE.Vector3, aiming: boolean) => ShotResult | null;
  reload: (time: number) => boolean;
  throwGinger: (from: THREE.Vector3, dir: THREE.Vector3) => boolean;
  update: (time: number, dt: number) => BlastResult[];
  reset: () => void;
  dispose: () => void;
};

export function createWeapons(scene: THREE.Scene, fx: Fx, drones: DroneKit, hand: Hand, colliders: THREE.Object3D[], belt: THREE.Object3D): Weapons {
  let ammo = BLASTER.mag;
  let nextShot = 0;
  let reloadUntil = 0;
  let ginger = GINGER.max;
  const grenades: Grenade[] = [];
  const gingerGeo = new THREE.SphereGeometry(0.2, 18, 10, 0, Math.PI * 2, 0, Math.PI * 0.35).scale(1, 0.4, 1.25);
  const gingerMat = new THREE.MeshPhysicalMaterial({ color: 0xffb1c3, roughness: 0.3, clearcoat: 1, sheen: 1, sheenColor: new THREE.Color(0xffe1ea), side: THREE.DoubleSide, emissive: 0x5a1a28, emissiveIntensity: 0.4 });

  const ray = new THREE.Ray();
  const caster = new THREE.Raycaster();
  const hitPoint = new THREE.Vector3();
  const sphere = new THREE.Sphere();
  const dir = new THREE.Vector3();

  const isOnBelt = (o: THREE.Object3D | null) => {
    for (let p = o; p; p = p.parent) if (p === belt) return true;
    return false;
  };

  return {
    ammo: () => ammo,
    reloading: () => reloadUntil > 0,
    ginger: () => ginger,
    refillGinger: () => {
      ginger = GINGER.max;
    },
    reload: (time) => {
      if (reloadUntil > 0 || ammo === BLASTER.mag) return false;
      reloadUntil = time + BLASTER.reload;
      return true;
    },
    tryFire: (time, from, aimOrigin, aimDir, aiming) => {
      if (reloadUntil > 0 || time < nextShot) return null;
      if (ammo <= 0) {
        reloadUntil = time + BLASTER.reload;
        return null;
      }
      ammo -= 1;
      nextShot = time + 1 / BLASTER.rate;
      const spread = aiming ? BLASTER.aimSpread : BLASTER.spread;
      dir.copy(aimDir).add(new THREE.Vector3((Math.random() - 0.5) * 2 * spread, (Math.random() - 0.5) * 2 * spread, (Math.random() - 0.5) * 2 * spread)).normalize();
      ray.set(aimOrigin, dir);
      // The nearest of: a drone, the hand, or the set itself.
      let best = BLASTER.range;
      let result: ShotResult = { kind: "miss" };
      let target: Drone | null = null;
      for (const d of drones.alive()) {
        sphere.set(d.pos, DRONE.hitRadius);
        if (ray.intersectSphere(sphere, hitPoint)) {
          const dist = hitPoint.distanceTo(aimOrigin);
          if (dist < best) {
            best = dist;
            target = d;
          }
        }
      }
      const hs = hand.hitSphere();
      let handHit = false;
      if (hs && ray.intersectSphere(hs, hitPoint)) {
        const dist = hitPoint.distanceTo(aimOrigin);
        if (dist < best) {
          best = dist;
          handHit = true;
          target = null;
        }
      }
      caster.set(aimOrigin, dir);
      caster.far = best;
      const wall = caster.intersectObjects(colliders, false)[0];
      const end = aimOrigin.clone().addScaledVector(dir, best);
      if (wall && wall.distance < best) {
        end.copy(wall.point);
        const n = wall.face ? wall.face.normal.clone().transformDirection(wall.object.matrixWorld) : new THREE.Vector3(0, 1, 0);
        fx.splat(wall.point, n, isOnBelt(wall.object));
        fx.burst("wasabi", wall.point, 5, 2.2);
        result = { kind: "world" };
      } else if (target) {
        const killed = drones.hit(target, BLASTER.damage, dir.clone().multiplyScalar(2));
        fx.burst("wasabi", end, 6, 2.6);
        if (killed) fx.burst("splinter", target.pos, 14, 4);
        result = { kind: "drone", drone: target, killed };
      } else if (handHit) {
        fx.burst("wasabi", end, 6, 2.6);
        result = { kind: "hand", defeated: hand.hit(BLASTER.damage) };
      }
      fx.tracer(from, end);
      fx.flash(from, 0xb6ff5a, 4, 0.05);
      return result;
    },
    throwGinger: (from, aimDir) => {
      if (ginger <= 0) return false;
      ginger -= 1;
      const mesh = new THREE.Mesh(gingerGeo, gingerMat);
      mesh.castShadow = true;
      mesh.position.copy(from);
      scene.add(mesh);
      const vel = aimDir.clone().multiplyScalar(GINGER.speed);
      vel.y += GINGER.lift;
      grenades.push({ mesh, vel, fuse: GINGER.fuse });
      return true;
    },
    update: (time, dt) => {
      if (reloadUntil > 0 && time >= reloadUntil) {
        reloadUntil = 0;
        ammo = BLASTER.mag;
      }
      const blasts: BlastResult[] = [];
      for (let i = grenades.length - 1; i >= 0; i--) {
        const g = grenades[i];
        g.fuse -= dt;
        g.vel.y -= 14 * dt;
        g.mesh.position.addScaledVector(g.vel, dt);
        g.mesh.rotation.x += dt * 9;
        g.mesh.rotation.z += dt * 5;
        const p = g.mesh.position;
        const r = Math.hypot(p.x, p.z);
        if (r < ISLAND_EDGE || r > OUTER_LIMIT) {
          // Bounce off the island and the room's edge.
          const nx = p.x / r;
          const nz = p.z / r;
          const vn = g.vel.x * nx + g.vel.z * nz;
          g.vel.x -= 1.6 * vn * nx;
          g.vel.z -= 1.6 * vn * nz;
          const k = THREE.MathUtils.clamp(r, ISLAND_EDGE, OUTER_LIMIT) / r;
          p.x *= k;
          p.z *= k;
        }
        const floor = groundAt(Math.hypot(p.x, p.z)) + 0.06;
        if (p.y < floor) {
          p.y = floor;
          g.vel.y = Math.abs(g.vel.y) * 0.35;
          g.vel.x *= 0.6;
          g.vel.z *= 0.6;
        }
        if (g.fuse > 0) continue;
        const at = p.clone();
        g.mesh.removeFromParent();
        grenades.splice(i, 1);
        fx.burst("petal", at, 60, 6, 2.2);
        fx.burst("splinter", at, 10, 5);
        fx.flash(at, 0xff9ab2, 14, 0.35);
        const killed: Drone[] = [];
        for (const d of drones.alive()) {
          const dist = d.pos.distanceTo(at);
          if (dist > GINGER.radius) continue;
          const dmg = GINGER.damage * (1 - dist / GINGER.radius) + 20;
          if (drones.hit(d, dmg, d.pos.clone().sub(at).normalize().multiplyScalar(6))) killed.push(d);
        }
        let handResult: BlastResult["hand"] = null;
        const hs = hand.hitSphere();
        if (hs && hs.center.distanceTo(at) < GINGER.radius + hs.radius) handResult = hand.hit(GINGER.handDamage) ? "defeated" : "hit";
        blasts.push({ killed, hand: handResult, at });
      }
      return blasts;
    },
    reset: () => {
      ammo = BLASTER.mag;
      reloadUntil = 0;
      ginger = GINGER.max;
      grenades.forEach((g) => g.mesh.removeFromParent());
      grenades.length = 0;
    },
    dispose: () => {
      grenades.forEach((g) => g.mesh.removeFromParent());
      gingerGeo.dispose();
      gingerMat.dispose();
    },
  };
}
