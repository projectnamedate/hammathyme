import * as THREE from "three";
import { WORLD } from "./tuning";
import { BELT_OMEGA, type Plate } from "./world";

const R = WORLD.beltRadius;
const HALF = WORLD.beltWidth / 2;
const RIM = 0.22;
export const ISLAND_EDGE = R - HALF - RIM;
export const OUTER_LIMIT = WORLD.counterOuter - 0.6; // drones and grenades stay over the counter
export const FLOOR = -3; // the restaurant floor, past the counter's outer edge: a fatal drop
const ROOM_LIMIT = WORLD.norenRadius - 0.6;

// Height of the surface at radius r. The island is a wall (too tall to step or jump onto); past the counter's
// outer edge there is only the floor far below.
export function groundAt(r: number) {
  if (r < ISLAND_EDGE) return WORLD.islandTop;
  if (r < R - HALF) return WORLD.rimHeight;
  if (r <= R + HALF) return 0;
  if (r <= R + HALF + RIM) return WORLD.rimHeight;
  if (r <= WORLD.counterOuter) return WORLD.counterTop;
  return FLOOR;
}

export const onBelt = (r: number) => r >= R - HALF && r <= R + HALF;

// Plates ride the belt: their world position follows its rotation.
export function plateCenter(plate: Plate, time: number, out: THREE.Vector3) {
  const a = plate.angle - BELT_OMEGA * time;
  return out.set(R * Math.cos(a), 0, R * Math.sin(a));
}

export type Resolved = { ground: number; onPlate: boolean; onBelt: boolean };

const tmp = new THREE.Vector3();
// Keep a body of radius `radius` out of walls and plates; returns the ground it stands on.
export function resolve(pos: THREE.Vector3, radius: number, plates: Plate[], time: number): Resolved {
  // Walls: the island face inside, the room's back wall far outside (the counter's edge is open).
  let r = Math.hypot(pos.x, pos.z);
  const minR = ISLAND_EDGE + radius;
  if (r < minR || r > ROOM_LIMIT) {
    const target = Math.min(Math.max(r, minR), ROOM_LIMIT);
    const k = target / Math.max(r, 1e-6);
    pos.x *= k;
    pos.z *= k;
    r = target;
  }
  let ground = groundAt(r);
  let standing = false;
  for (const plate of plates) {
    plateCenter(plate, time, tmp);
    const dx = pos.x - tmp.x;
    const dz = pos.z - tmp.z;
    const d = Math.hypot(dx, dz);
    const reach = plate.radius + radius * 0.6;
    if (d >= reach) continue;
    if (pos.y >= plate.height - 0.12) {
      // On top of the sushi: it's a moving platform.
      if (d < plate.radius) {
        ground = Math.max(ground, plate.height);
        standing = true;
      }
    } else {
      const push = (reach - d) / Math.max(d, 1e-4);
      pos.x += dx * push;
      pos.z += dz * push;
    }
  }
  return { ground, onPlate: standing, onBelt: onBelt(Math.hypot(pos.x, pos.z)) };
}

