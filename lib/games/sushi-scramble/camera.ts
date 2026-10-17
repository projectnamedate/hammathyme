import * as THREE from "three";
import { CAMERA } from "./tuning";

export type CameraRig = {
  camera: THREE.PerspectiveCamera;
  yaw: number;
  pitch: number;
  look: (dx: number, dy: number) => void;
  kick: (amount: number) => void;
  shake: (amount: number) => void;
  update: (pivot: THREE.Vector3, aiming: boolean, dt: number) => void;
  forward: (out: THREE.Vector3) => THREE.Vector3;
};

export function createCameraRig(colliders: THREE.Object3D[], reducedMotion: boolean, startYaw: number): CameraRig {
  const camera = new THREE.PerspectiveCamera(CAMERA.fov, 1, 0.05, 220);
  const ray = new THREE.Raycaster();
  const desired = new THREE.Vector3();
  const head = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const offset = new THREE.Vector3();
  const euler = new THREE.Euler(0, 0, 0, "YXZ");
  let recoil = 0;
  let trauma = 0;
  let shakeTime = 0;
  let aimBlend = 0;
  const rig: CameraRig = {
    camera,
    yaw: startYaw,
    pitch: -0.08,
    look: (dx, dy) => {
      rig.yaw += dx;
      rig.pitch = Math.min(CAMERA.pitchMax, Math.max(CAMERA.pitchMin, rig.pitch + dy));
    },
    kick: (amount) => {
      recoil = Math.min(0.08, recoil + amount);
    },
    shake: (amount) => {
      if (!reducedMotion) trauma = Math.min(1, trauma + amount);
    },
    forward: (out) => out.set(0, 0, -1).applyEuler(euler.set(rig.pitch + recoil, rig.yaw, 0, "YXZ")),
    update: (pivot, aiming, dt) => {
      aimBlend += ((aiming ? 1 : 0) - aimBlend) * Math.min(1, dt * 12);
      recoil *= Math.exp(-dt * 14);
      const s = {
        x: THREE.MathUtils.lerp(CAMERA.shoulder.x, CAMERA.aimShoulder.x, aimBlend),
        y: THREE.MathUtils.lerp(CAMERA.shoulder.y, CAMERA.aimShoulder.y, aimBlend),
        z: THREE.MathUtils.lerp(CAMERA.shoulder.z, CAMERA.aimShoulder.z, aimBlend),
      };
      euler.set(rig.pitch + recoil, rig.yaw, 0, "YXZ");
      head.copy(pivot);
      head.y += s.y;
      offset.set(s.x, 0, s.z).applyEuler(euler);
      desired.copy(head).add(offset);
      // Looking up swings the arm down; it skims along above the floor instead of tunnelling under the belt.
      desired.y = Math.max(desired.y, pivot.y + 0.32);
      // The spring arm pulls in rather than pass through the island, the counter or the walls.
      dir.subVectors(desired, head);
      const len = dir.length();
      ray.set(head, dir.normalize());
      ray.far = len;
      const hit = ray.intersectObjects(colliders, false)[0];
      if (hit) desired.copy(head).addScaledVector(dir, Math.max(0.3, hit.distance - 0.18));
      camera.position.lerp(desired, Math.min(1, dt * CAMERA.follow));
      camera.quaternion.setFromEuler(euler);
      if (trauma > 0) {
        shakeTime += dt * 40;
        const m = trauma * trauma * 0.05;
        camera.rotateX(Math.sin(shakeTime * 1.3) * m);
        camera.rotateY(Math.sin(shakeTime * 1.7 + 1) * m);
        trauma = Math.max(0, trauma - dt * 2.2);
      }
      const fov = THREE.MathUtils.lerp(CAMERA.fov, CAMERA.aimFov, aimBlend);
      if (Math.abs(camera.fov - fov) > 0.01) {
        camera.fov = fov;
        camera.updateProjectionMatrix();
      }
    },
  };
  return rig;
}
