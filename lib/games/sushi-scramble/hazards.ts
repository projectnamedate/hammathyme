import * as THREE from "three";
import { WORLD } from "./tuning";
import { BELT_OMEGA } from "./world";

// Things that ride the belt and do something when the hero walks into them: soy dishes (slow, soak the rice)
// and fresh plates (a wasabi dollop that restores the fish).
type Rider = { root: THREE.Group; angle: number; kind: "soy" | "fresh"; taken: boolean };

export type Hazards = {
  place: (soyCount: number, freshCount: number, avoidAngle: number) => void;
  // Returns what the hero is touching at its world position this step.
  touching: (pos: THREE.Vector3, time: number) => { soy: boolean; fresh: Rider | null };
  take: (rider: Rider) => void;
  update: (time: number) => void;
  clear: () => void;
  dispose: () => void;
};

export function createHazards(belt: THREE.Group): Hazards {
  const R = WORLD.beltRadius;
  const ceramic = new THREE.MeshPhysicalMaterial({ color: 0x1d1b22, roughness: 0.25, clearcoat: 1 });
  const soy = new THREE.MeshPhysicalMaterial({ color: 0x1a0803, roughness: 0.04, clearcoat: 1, clearcoatRoughness: 0.02, metalness: 0 });
  const gold = new THREE.MeshPhysicalMaterial({ color: 0xd4a640, metalness: 1, roughness: 0.25 });
  const glaze = new THREE.MeshPhysicalMaterial({ color: 0xf6f2ea, roughness: 0.18, clearcoat: 1 });
  const wasabi = new THREE.MeshStandardMaterial({ color: 0x8fcf2e, emissive: 0x6fbf1a, emissiveIntensity: 1.6, roughness: 0.6 });
  const dishGeo = new THREE.LatheGeometry([[0, 0.01], [0.6, 0.01], [0.82, 0.07], [0.86, 0.1], [0.8, 0.1], [0.58, 0.04], [0, 0.04]].map(([r, y]) => new THREE.Vector2(r, y)), 40);
  const pool = new THREE.CircleGeometry(0.7, 32).rotateX(-Math.PI / 2);
  const plateGeo = new THREE.LatheGeometry([[0, 0.02], [0.4, 0.02], [0.74, 0.1], [0.8, 0.14], [0.7, 0.12], [0, 0.07]].map(([r, y]) => new THREE.Vector2(r, y)), 40);
  const rimGeo = new THREE.TorusGeometry(0.775, 0.025, 8, 40);
  const dollopGeo = new THREE.SphereGeometry(0.22, 18, 12);
  const riders: Rider[] = [];

  const make = (kind: Rider["kind"], angle: number): Rider => {
    const root = new THREE.Group();
    root.position.set(R * Math.cos(angle), 0, R * Math.sin(angle));
    if (kind === "soy") {
      const dish = new THREE.Mesh(dishGeo, ceramic);
      const liquid = new THREE.Mesh(pool, soy);
      liquid.position.y = 0.06;
      dish.receiveShadow = true;
      root.add(dish, liquid);
    } else {
      const plate = new THREE.Mesh(plateGeo, glaze);
      const rim = new THREE.Mesh(rimGeo, gold);
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 0.14;
      const dollop = new THREE.Mesh(dollopGeo, wasabi);
      dollop.scale.set(1, 0.7, 1);
      dollop.position.y = 0.25;
      dollop.name = "dollop";
      root.add(plate, rim, dollop);
    }
    belt.add(root);
    return { root, angle, kind, taken: false };
  };

  const world = new THREE.Vector3();
  return {
    place: (soyCount, freshCount, avoidAngle) => {
      riders.forEach((r) => r.root.removeFromParent());
      riders.length = 0;
      const total = soyCount + freshCount;
      for (let i = 0; i < total; i++) {
        // Spread them round the ring, away from where the hero is standing.
        const angle = avoidAngle + Math.PI * 0.35 + (i / Math.max(1, total)) * Math.PI * 1.3 + (Math.random() - 0.5) * 0.3;
        riders.push(make(i < soyCount ? "soy" : "fresh", angle));
      }
    },
    touching: (pos, time) => {
      let onSoy = false;
      let fresh: Rider | null = null;
      for (const r of riders) {
        if (r.taken) continue;
        const a = r.angle - BELT_OMEGA * time;
        world.set(R * Math.cos(a), 0, R * Math.sin(a));
        const d = Math.hypot(pos.x - world.x, pos.z - world.z);
        if (r.kind === "soy" && d < 0.75 && pos.y < 0.2) onSoy = true;
        if (r.kind === "fresh" && d < 0.9 && pos.y < 0.6) fresh = r;
      }
      return { soy: onSoy, fresh };
    },
    take: (rider) => {
      rider.taken = true;
      rider.root.getObjectByName("dollop")?.removeFromParent();
    },
    update: (time) => {
      for (const r of riders) {
        const d = r.root.getObjectByName("dollop");
        if (d) d.position.y = 0.25 + Math.sin(time * 3 + r.angle) * 0.03;
      }
    },
    clear: () => {
      riders.forEach((r) => r.root.removeFromParent());
      riders.length = 0;
    },
    dispose: () => {
      [ceramic, soy, gold, glaze, wasabi].forEach((m) => m.dispose());
      [dishGeo, pool, plateGeo, rimGeo, dollopGeo].forEach((g) => g.dispose());
    },
  };
}
