import * as THREE from "three";
import { applyFood } from "./food";

export type Hero = {
  root: THREE.Group; // stands at the feet, faces +Z
  torso: THREE.Object3D;
  muzzle: THREE.Object3D; // the blaster's mouth, for tracers
  // stride: 0 standing .. 1 full run; aimPitch tilts the torso a little toward the aim
  animate: (time: number, dt: number, stride: number, airborne: boolean, aimPitch: number) => void;
  fade: (opacity: number) => void; // see-through when the camera looks steeply up past the hero
  dispose: () => void;
};

export function buildHero(model: THREE.Group | null): Hero {
  const root = new THREE.Group();
  const made: { dispose: () => void }[] = [];
  let torso: THREE.Object3D;
  let legs: THREE.Object3D[] = [];
  if (model) {
    const m = model.clone(true);
    made.push(...applyFood(m, 0.18));
    torso = m.getObjectByName("torso") ?? m;
    legs = ["legL", "legR"].map((n) => m.getObjectByName(n)).filter((o): o is THREE.Object3D => !!o);
    root.add(m);
  } else {
    const geo = new THREE.CapsuleGeometry(0.4, 0.3, 8, 16);
    const mat = new THREE.MeshStandardMaterial({ color: 0xff8a5c, roughness: 0.4 });
    made.push(geo, mat);
    torso = new THREE.Mesh(geo, mat);
    torso.position.y = 0.55;
    root.add(torso);
  }
  const torsoRest = torso.position.clone();
  const legRest = legs.map((l) => l.position.clone());
  // The blaster sits across the front of the torso, barrel toward the hero's right.
  const muzzle = new THREE.Object3D();
  muzzle.position.set(0.42, 0.5, 0.3);
  root.add(muzzle);

  let phase = 0;
  return {
    root,
    torso,
    muzzle,
    animate: (time, dt, stride, airborne, aimPitch) => {
      phase += dt * (6 + 7 * stride) * (stride > 0.02 ? 1 : 0);
      // Negative rotation about X swings a foot toward +Z, the way the hero faces: the lifted foot steps forward.
      const swing = airborne ? 0 : -Math.sin(phase) * 0.55 * stride;
      legs.forEach((leg, i) => {
        const s = i === 0 ? swing : -swing;
        leg.rotation.x = airborne ? 0.35 : s;
        leg.position.y = legRest[i].y + Math.max(0, (i === 0 ? 1 : -1) * Math.sin(phase)) * 0.05 * stride;
      });
      // A stubby waddle: the body bobs twice per stride and rolls side to side; at rest it breathes.
      const bob = Math.abs(Math.sin(phase)) * 0.045 * stride + Math.sin(time * 2.1) * 0.006 * (1 - stride);
      torso.position.y = torsoRest.y + bob;
      torso.rotation.z = Math.sin(phase) * 0.08 * stride;
      torso.rotation.x = -aimPitch * 0.25 + 0.06 * stride;
    },
    fade: (opacity) => {
      const see = opacity < 0.99;
      root.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        const m = mesh.material as THREE.Material;
        if (m.transparent !== see) {
          m.transparent = see;
          m.depthWrite = !see;
          m.needsUpdate = true;
        }
        m.opacity = opacity;
      });
    },
    dispose: () => made.forEach((m) => m.dispose()),
  };
}
