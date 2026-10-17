import * as THREE from "three";
import { resolve } from "./arena";
import type { InputFrame } from "./input";
import { PLAYER, WORLD } from "./tuning";
import { beltVelocity, type Plate } from "./world";

export type Player = {
  pos: THREE.Vector3; // feet
  vel: THREE.Vector3; // relative to whatever it stands on
  facing: number; // yaw of the hero model
  grounded: boolean;
  shield: number;
  health: number;
  lastHit: number;
  soakedUntil: number;
  slowedUntil: number;
  alive: boolean;
  stride: number;
};

export function createPlayer(): Player {
  const a = Math.PI * 0.5;
  return {
    pos: new THREE.Vector3(WORLD.beltRadius * Math.cos(a), 0, WORLD.beltRadius * Math.sin(a)),
    vel: new THREE.Vector3(),
    facing: -a + Math.PI,
    grounded: true,
    shield: PLAYER.shieldMax,
    health: PLAYER.healthMax,
    lastHit: -99,
    soakedUntil: 0,
    slowedUntil: 0,
    alive: true,
    stride: 0,
  };
}

const wish = new THREE.Vector3();
const carry = new THREE.Vector3();

// One fixed step of movement. `yaw` is the camera's; movement is relative to where the camera looks.
export function stepPlayer(p: Player, input: InputFrame, yaw: number, dt: number, time: number, plates: Plate[], aiming: boolean) {
  if (!p.alive) return;
  const fwdX = -Math.sin(yaw);
  const fwdZ = -Math.cos(yaw);
  wish.set(fwdX * input.moveY + Math.cos(yaw) * input.moveX, 0, fwdZ * input.moveY - Math.sin(yaw) * input.moveX);
  const len = wish.length();
  if (len > 1) wish.multiplyScalar(1 / len);
  let speed = input.sprint && !aiming ? PLAYER.sprintSpeed : PLAYER.walkSpeed;
  if (aiming) speed *= 0.7;
  if (time < p.slowedUntil) speed *= 0.5;
  wish.multiplyScalar(speed);

  // Accelerate the ground-relative velocity toward the wish; slower to change course in the air.
  const accel = (p.grounded ? PLAYER.accel : PLAYER.airAccel) * dt;
  const dx = wish.x - p.vel.x;
  const dz = wish.z - p.vel.z;
  const dl = Math.hypot(dx, dz);
  const k = dl > accel ? accel / dl : 1;
  p.vel.x += dx * k;
  p.vel.z += dz * k;

  if (p.grounded && input.jump) {
    p.vel.y = PLAYER.jumpSpeed;
    p.grounded = false;
  }
  p.vel.y -= PLAYER.gravity * dt;

  // The belt (or a plate riding it) carries whatever stands on it.
  const before = resolve(p.pos.clone(), PLAYER.radius, plates, time);
  carry.set(0, 0, 0);
  if (p.grounded && (before.onBelt || before.onPlate)) beltVelocity(p.pos, carry);

  p.pos.x += (p.vel.x + carry.x) * dt;
  p.pos.z += (p.vel.z + carry.z) * dt;
  p.pos.y += p.vel.y * dt;

  let after = resolve(p.pos, PLAYER.radius, plates, time);
  // A ledge taller than a step is a wall from below: down on the floor, the counter can't be walked back onto.
  if (after.ground - p.pos.y > PLAYER.stepHeight) {
    p.pos.x -= (p.vel.x + carry.x) * dt;
    p.pos.z -= (p.vel.z + carry.z) * dt;
    p.vel.x = p.vel.z = 0;
    after = resolve(p.pos, PLAYER.radius, plates, time);
  }
  if (p.pos.y <= after.ground) {
    // Step up anything below the step height; the walls above it are handled radially in resolve().
    p.pos.y = after.ground;
    p.vel.y = 0;
    p.grounded = true;
  } else if (p.pos.y - after.ground > 0.05) {
    p.grounded = false;
  }

  // Face the aim when aiming or firing; otherwise turn toward the direction of travel.
  const moving = Math.hypot(p.vel.x, p.vel.z);
  const target = aiming || input.fire ? Math.atan2(fwdX, fwdZ) : moving > 0.4 ? Math.atan2(p.vel.x, p.vel.z) : p.facing;
  let d = target - p.facing;
  d = Math.atan2(Math.sin(d), Math.cos(d));
  p.facing += d * Math.min(1, dt * (aiming || input.fire ? 18 : 10));
  p.stride += (Math.min(1, moving / PLAYER.sprintSpeed) - p.stride) * Math.min(1, dt * 8);
}

export function damagePlayer(p: Player, amount: number, time: number) {
  if (!p.alive) return { shieldBroke: false, died: false };
  p.lastHit = time;
  const hadShield = p.shield > 0;
  const absorbed = Math.min(p.shield, amount);
  p.shield -= absorbed;
  p.health -= amount - absorbed;
  const died = p.health <= 0;
  if (died) {
    p.health = 0;
    p.alive = false;
  }
  return { shieldBroke: hadShield && p.shield <= 0, died };
}

export function regenShield(p: Player, dt: number, time: number) {
  if (!p.alive || time < p.soakedUntil) return;
  if (time - p.lastHit > PLAYER.shieldRegenDelay) p.shield = Math.min(PLAYER.shieldMax, p.shield + PLAYER.shieldRegenRate * dt);
}
