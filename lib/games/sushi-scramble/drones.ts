import * as THREE from "three";
import { ISLAND_EDGE, OUTER_LIMIT } from "./arena";

export const DRONE = {
  hp: 30,
  orbit: 5.6,
  height: 1.9,
  speed: 4.2,
  accel: 9,
  windup: 0.6,
  lungeSpeed: 11,
  recover: 0.9,
  reach: 0.95,
  damage: 25,
  hitRadius: 0.5,
};

type State = "approach" | "windup" | "lunge" | "recover" | "dead";
export type Drone = {
  root: THREE.Group;
  sticks: [THREE.Object3D, THREE.Object3D];
  rotor: THREE.Mesh;
  eye: THREE.MeshStandardMaterial;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  hp: number;
  state: State;
  timer: number;
  cooldown: number;
  orbit: number;
  flash: number;
  lungeDir: THREE.Vector3;
  open: number;
};

export type DroneEvent = { type: "pinch"; drone: Drone; hit: boolean } | { type: "died"; drone: Drone; at: THREE.Vector3 } | { type: "windup"; drone: Drone };

export type DroneKit = {
  spawn: (at: THREE.Vector3, speedScale: number) => Drone;
  update: (target: THREE.Vector3, targetVel: THREE.Vector3, dt: number, time: number) => DroneEvent[];
  hit: (d: Drone, damage: number, impulse: THREE.Vector3) => boolean;
  alive: () => Drone[];
  clear: () => void;
  stickDebris: (d: Drone) => THREE.Object3D[];
  dispose: () => void;
};

export function createDrones(scene: THREE.Scene): DroneKit {
  const lacquer = new THREE.MeshPhysicalMaterial({ color: 0x6a1d12, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.08 });
  const band = new THREE.MeshPhysicalMaterial({ color: 0xc9a14a, metalness: 1, roughness: 0.28 });
  const brass = new THREE.MeshPhysicalMaterial({ color: 0xb38a3e, metalness: 1, roughness: 0.3 });
  const rotorMat = new THREE.MeshBasicMaterial({ color: 0xd9d4ca, transparent: true, opacity: 0.07, depthWrite: false, side: THREE.DoubleSide });
  const stickGeo = new THREE.CylinderGeometry(0.016, 0.03, 1.3, 10).rotateX(Math.PI / 2).translate(0, 0, 0.65);
  const bandGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.09, 10).rotateX(Math.PI / 2).translate(0, 0, 0.08);
  const hubGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.17, 18);
  const mastGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.16, 6).translate(0, 0.16, 0);
  const rotorGeo = new THREE.CircleGeometry(0.34, 32).rotateX(-Math.PI / 2);
  const eyeGeo = new THREE.SphereGeometry(0.045, 12, 8);
  const all: Drone[] = [];

  const build = () => {
    const root = new THREE.Group();
    const hub = new THREE.Mesh(hubGeo, brass);
    hub.rotation.z = Math.PI / 2;
    const mast = new THREE.Mesh(mastGeo, brass);
    const rotor = new THREE.Mesh(rotorGeo, rotorMat);
    rotor.position.y = 0.24;
    const eye = new THREE.MeshStandardMaterial({ color: 0x220d02, emissive: 0xff9a3a, emissiveIntensity: 3 });
    const eyeMesh = new THREE.Mesh(eyeGeo, eye);
    eyeMesh.position.set(0, 0, 0.11);
    const stick = (side: number) => {
      const pivot = new THREE.Group();
      pivot.position.set(side * 0.05, -0.02, 0.06);
      pivot.add(new THREE.Mesh(stickGeo, lacquer), new THREE.Mesh(bandGeo, band));
      root.add(pivot);
      return pivot;
    };
    const sticks: [THREE.Object3D, THREE.Object3D] = [stick(-1), stick(1)];
    root.add(hub, mast, rotor, eyeMesh);
    root.traverse((o) => ((o as THREE.Mesh).isMesh ? ((o as THREE.Mesh).castShadow = o !== rotor) : null));
    return { root, sticks, rotor, eye };
  };

  const tmp = new THREE.Vector3();
  const desired = new THREE.Vector3();
  const kit: DroneKit = {
    spawn: (at, speedScale) => {
      const parts = build();
      const d: Drone = {
        ...parts,
        pos: at.clone(),
        vel: new THREE.Vector3(),
        hp: DRONE.hp,
        state: "approach",
        timer: 0,
        cooldown: 1.5 + Math.random() * 1.5,
        orbit: Math.random() * Math.PI * 2,
        flash: 0,
        lungeDir: new THREE.Vector3(),
        open: 0,
      };
      d.root.userData.speed = speedScale;
      d.root.position.copy(at);
      scene.add(d.root);
      all.push(d);
      return d;
    },
    alive: () => all.filter((d) => d.state !== "dead"),
    hit: (d, damage, impulse) => {
      if (d.state === "dead") return false;
      d.hp -= damage;
      d.flash = 0.08;
      d.vel.addScaledVector(impulse, 0.6);
      if (d.hp <= 0) {
        d.state = "dead";
        return true;
      }
      return false;
    },
    stickDebris: (d) =>
      d.sticks.map((s) => {
        const c = s.clone(true);
        s.updateWorldMatrix(true, false);
        s.matrixWorld.decompose(c.position, c.quaternion, c.scale);
        return c;
      }),
    clear: () => {
      all.forEach((d) => {
        d.root.removeFromParent();
        d.eye.dispose();
      });
      all.length = 0;
    },
    update: (target, targetVel, dt, time) => {
      const events: DroneEvent[] = [];
      const alive = all.filter((d) => d.state !== "dead");
      for (const d of all) {
        if (d.state === "dead") {
          if (d.root.parent) {
            events.push({ type: "died", drone: d, at: d.pos.clone() });
            d.root.removeFromParent();
            d.eye.dispose();
          }
          continue;
        }
        const speed = DRONE.speed * (d.root.userData.speed as number);
        d.timer += dt;
        d.cooldown -= dt;
        d.flash = Math.max(0, d.flash - dt);
        const toPlayer = tmp.subVectors(target, d.pos);
        const dist = toPlayer.length();
        if (d.state === "approach") {
          d.orbit += dt * 0.35;
          desired.set(target.x + Math.cos(d.orbit) * DRONE.orbit, DRONE.height + Math.sin(time * 1.7 + d.orbit) * 0.35, target.z + Math.sin(d.orbit) * DRONE.orbit);
          desired.sub(d.pos).multiplyScalar(1.6).clampLength(0, speed);
          for (const o of alive) {
            if (o === d) continue;
            const sep = d.pos.distanceTo(o.pos);
            if (sep < 1.6) desired.addScaledVector(tmp.subVectors(d.pos, o.pos).normalize(), (1.6 - sep) * 3);
          }
          d.vel.lerp(desired, Math.min(1, dt * DRONE.accel * 0.3));
          d.open += (0.05 - d.open) * Math.min(1, dt * 6);
          if (d.cooldown <= 0 && dist < 8.5) {
            d.state = "windup";
            d.timer = 0;
            events.push({ type: "windup", drone: d });
          }
        } else if (d.state === "windup") {
          d.vel.multiplyScalar(Math.exp(-dt * 6));
          d.open += (0.42 - d.open) * Math.min(1, dt * 10);
          if (d.timer >= DRONE.windup) {
            // Commit to where the hero will be; the lunge lasts exactly long enough to get there, so moving dodges it.
            d.state = "lunge";
            d.timer = 0;
            d.lungeDir.copy(target).addScaledVector(targetVel, 0.25).sub(d.pos);
            d.root.userData.lungeTime = THREE.MathUtils.clamp(d.lungeDir.length() / DRONE.lungeSpeed, 0.18, 0.6);
            d.lungeDir.normalize();
          }
        } else if (d.state === "lunge") {
          d.vel.copy(d.lungeDir).multiplyScalar(DRONE.lungeSpeed);
          if (d.timer >= (d.root.userData.lungeTime as number) || dist < 0.55) {
            d.open = 0;
            events.push({ type: "pinch", drone: d, hit: dist < DRONE.reach });
            d.state = "recover";
            d.timer = 0;
            d.vel.copy(d.lungeDir).multiplyScalar(-3).add(new THREE.Vector3(0, 2.5, 0));
          }
        } else if (d.state === "recover") {
          d.vel.multiplyScalar(Math.exp(-dt * 2));
          d.open += (0.05 - d.open) * Math.min(1, dt * 6);
          if (d.timer >= DRONE.recover) {
            d.state = "approach";
            d.cooldown = 2.2 + Math.random() * 2;
          }
        }
        d.pos.addScaledVector(d.vel, dt);
        // Stay over the arena and off the floor.
        const r = Math.hypot(d.pos.x, d.pos.z);
        const clamped = Math.min(Math.max(r, ISLAND_EDGE - 1), OUTER_LIMIT + 1);
        if (clamped !== r) {
          d.pos.x *= clamped / r;
          d.pos.z *= clamped / r;
        }
        d.pos.y = Math.max(0.55, Math.min(5.5, d.pos.y));
        d.root.position.copy(d.pos);
        // Face the hero when attacking, otherwise the way it flies; bank into turns.
        const face = d.state === "approach" && d.vel.lengthSq() > 0.5 ? tmp.copy(d.pos).add(d.vel) : target;
        d.root.lookAt(face);
        d.root.rotateZ(THREE.MathUtils.clamp(-d.vel.x * 0.04, -0.3, 0.3));
        d.sticks[0].rotation.y = -d.open;
        d.sticks[1].rotation.y = d.open;
        d.rotor.rotation.y += dt * 40;
        d.eye.emissiveIntensity = d.flash > 0 ? 12 : d.state === "windup" ? 6 + Math.sin(d.timer * 40) * 3 : 3;
        d.eye.emissive.set(d.flash > 0 ? 0xffffff : 0xff9a3a);
      }
      for (let i = all.length - 1; i >= 0; i--) if (all[i].state === "dead" && !all[i].root.parent) all.splice(i, 1);
      return events;
    },
    dispose: () => {
      kit.clear();
      [lacquer, band, brass, rotorMat].forEach((m) => m.dispose());
      [stickGeo, bandGeo, hubGeo, mastGeo, rotorGeo, eyeGeo].forEach((g) => g.dispose());
    },
  };
  return kit;
}
