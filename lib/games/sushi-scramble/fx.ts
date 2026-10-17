import * as THREE from "three";
import { groundAt } from "./arena";

export type ParticleKind = "rice" | "wasabi" | "petal" | "splinter" | "soy";

const KIND: Record<ParticleKind, { color: number; scale: [number, number, number]; gravity: number; life: number; emissive?: boolean }> = {
  rice: { color: 0xf7f1e6, scale: [0.6, 1.3, 0.6], gravity: 9, life: 1.1 },
  wasabi: { color: 0x9bd23a, scale: [1.2, 1.2, 1.2], gravity: 7, life: 0.7, emissive: true },
  petal: { color: 0xffa8bd, scale: [1.6, 0.25, 1.1], gravity: 2.5, life: 1.6 },
  splinter: { color: 0x7a2d1d, scale: [0.35, 0.35, 2.2], gravity: 11, life: 1.2 },
  soy: { color: 0x2a120a, scale: [0.9, 0.9, 0.9], gravity: 10, life: 0.8 },
};

type Particle = { alive: boolean; pos: THREE.Vector3; vel: THREE.Vector3; spin: THREE.Vector3; rot: THREE.Euler; life: number; max: number; kind: ParticleKind; size: number };
type Debris = { obj: THREE.Object3D; vel: THREE.Vector3; spin: THREE.Vector3; life: number; bounced: boolean };
type Tracer = { mesh: THREE.Mesh; life: number };
type Flash = { light: THREE.PointLight; life: number; max: number; peak: number };

export type Fx = {
  burst: (kind: ParticleKind, at: THREE.Vector3, count: number, speed: number, up?: number) => void;
  splat: (at: THREE.Vector3, normal: THREE.Vector3, onBelt: boolean) => void;
  tracer: (from: THREE.Vector3, to: THREE.Vector3) => void;
  debris: (obj: THREE.Object3D, vel: THREE.Vector3, spin: THREE.Vector3) => void;
  flash: (at: THREE.Vector3, color: number, peak: number, life: number) => void;
  update: (dt: number) => void;
  dispose: () => void;
};

function splatTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  // A wasabi splat: one wet blob and a few satellite drops, glossy at the centre.
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  g.fillStyle = "#8fcf2e";
  g.beginPath();
  for (let i = 0; i <= 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    const r = 34 + rnd() * 14;
    g[i ? "lineTo" : "moveTo"](64 + Math.cos(a) * r, 64 + Math.sin(a) * r);
  }
  g.fill();
  for (let i = 0; i < 9; i++) {
    const a = rnd() * Math.PI * 2;
    const d = 46 + rnd() * 14;
    g.beginPath();
    g.arc(64 + Math.cos(a) * d, 64 + Math.sin(a) * d, 3 + rnd() * 5, 0, Math.PI * 2);
    g.fill();
  }
  g.fillStyle = "rgba(220,255,160,0.55)";
  g.beginPath();
  g.ellipse(56, 54, 14, 9, -0.5, 0, Math.PI * 2);
  g.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function createFx(scene: THREE.Scene, belt: THREE.Object3D): Fx {
  const MAX = 700;
  const geo = new THREE.IcosahedronGeometry(0.05, 1);
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.45, metalness: 0, emissive: 0x000000 });
  const mesh = new THREE.InstancedMesh(geo, mat, MAX);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.frustumCulled = false;
  mesh.count = 0;
  const color = new THREE.Color();
  for (let i = 0; i < MAX; i++) mesh.setColorAt(i, color.set(0xffffff));
  scene.add(mesh);
  const particles: Particle[] = Array.from({ length: MAX }, () => ({
    alive: false,
    pos: new THREE.Vector3(),
    vel: new THREE.Vector3(),
    spin: new THREE.Vector3(),
    rot: new THREE.Euler(),
    life: 0,
    max: 1,
    kind: "rice" as ParticleKind,
    size: 1,
  }));
  let cursor = 0;

  const splatTex = splatTexture();
  const splatMat = new THREE.MeshPhysicalMaterial({ map: splatTex, transparent: true, depthWrite: false, roughness: 0.25, clearcoat: 1, polygonOffset: true, polygonOffsetFactor: -4, emissive: 0x3a5a10, emissiveIntensity: 0.4 });
  const splatGeo = new THREE.PlaneGeometry(1, 1);
  const splats: THREE.Mesh[] = [];

  const tracerMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xb6ff5a).multiplyScalar(4), transparent: true, depthWrite: false, toneMapped: false });
  const tracerGeo = new THREE.CylinderGeometry(0.012, 0.012, 1, 6, 1, true).rotateX(Math.PI / 2).translate(0, 0, 0.5);
  const tracers: Tracer[] = [];

  const flashes: Flash[] = Array.from({ length: 4 }, () => {
    const light = new THREE.PointLight(0xffffff, 0, 7, 2);
    scene.add(light);
    return { light, life: 0, max: 1, peak: 0 };
  });
  let flashCursor = 0;
  const debris: Debris[] = [];
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const s = new THREE.Vector3();
  const z = new THREE.Vector3(0, 0, 1);

  return {
    burst: (kind, at, count, speed, up = 1.5) => {
      for (let i = 0; i < count; i++) {
        const slot = cursor;
        const p = particles[slot];
        cursor = (cursor + 1) % MAX;
        p.alive = true;
        p.kind = kind;
        p.pos.copy(at);
        p.vel.set((Math.random() - 0.5) * 2, Math.random() * up, (Math.random() - 0.5) * 2).normalize().multiplyScalar(speed * (0.4 + Math.random() * 0.8));
        p.spin.set(Math.random() * 12 - 6, Math.random() * 12 - 6, Math.random() * 12 - 6);
        p.max = p.life = KIND[kind].life * (0.6 + Math.random() * 0.6);
        p.size = 0.7 + Math.random() * 0.7;
        mesh.setColorAt(slot, color.set(KIND[kind].color).multiplyScalar(KIND[kind].emissive ? 1.6 : 1));
      }
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    },
    splat: (at, normal, onBelt) => {
      // The oldest splat is reused once 40 are down; one that lands on the belt rides with it.
      const m = splats.length < 40 ? new THREE.Mesh(splatGeo, splatMat) : splats.shift()!;
      m.position.copy(at).addScaledVector(normal, 0.01);
      m.quaternion.setFromUnitVectors(z, normal);
      m.rotateZ(Math.random() * Math.PI * 2);
      const size = 0.35 + Math.random() * 0.3;
      m.scale.set(size, size, size);
      if (onBelt) {
        belt.worldToLocal(m.position);
        m.quaternion.premultiply(q.copy(belt.quaternion).invert());
      }
      (onBelt ? belt : scene).add(m);
      splats.push(m);
    },
    tracer: (from, to) => {
      let t = tracers.find((x) => x.life <= 0);
      if (!t) {
        t = { mesh: new THREE.Mesh(tracerGeo, tracerMat), life: 0 };
        scene.add(t.mesh);
        tracers.push(t);
      }
      t.mesh.position.copy(from);
      t.mesh.lookAt(to);
      t.mesh.scale.set(1, 1, from.distanceTo(to));
      t.mesh.visible = true;
      t.life = 0.05;
    },
    debris: (obj, vel, spin) => {
      scene.add(obj);
      debris.push({ obj, vel, spin, life: 2.2, bounced: false });
    },
    flash: (at, c, peak, life) => {
      const f = flashes[flashCursor];
      flashCursor = (flashCursor + 1) % flashes.length;
      f.light.position.copy(at);
      f.light.color.set(c);
      f.peak = peak;
      f.max = f.life = life;
    },
    update: (dt) => {
      let n = 0;
      for (let i = 0; i < MAX; i++) {
        const p = particles[i];
        if (!p.alive) {
          m4.makeScale(0, 0, 0);
          mesh.setMatrixAt(i, m4);
          continue;
        }
        p.life -= dt;
        if (p.life <= 0) {
          p.alive = false;
          m4.makeScale(0, 0, 0);
          mesh.setMatrixAt(i, m4);
          continue;
        }
        const k = KIND[p.kind];
        p.vel.y -= k.gravity * dt;
        if (p.kind === "petal") p.vel.multiplyScalar(1 - dt * 1.8);
        p.pos.addScaledVector(p.vel, dt);
        const floor = groundAt(Math.hypot(p.pos.x, p.pos.z)) + 0.02;
        if (p.pos.y < floor) {
          p.pos.y = floor;
          p.vel.set(p.vel.x * 0.4, Math.abs(p.vel.y) * 0.25, p.vel.z * 0.4);
        }
        p.rot.x += p.spin.x * dt;
        p.rot.y += p.spin.y * dt;
        p.rot.z += p.spin.z * dt;
        const fade = Math.min(1, p.life / (p.max * 0.35));
        s.set(k.scale[0], k.scale[1], k.scale[2]).multiplyScalar(p.size * fade);
        m4.compose(p.pos, q.setFromEuler(p.rot), s);
        mesh.setMatrixAt(i, m4);
        n = i + 1;
      }
      mesh.count = Math.max(n, 0);
      mesh.instanceMatrix.needsUpdate = true;
      for (const t of tracers) {
        if (t.life <= 0) continue;
        t.life -= dt;
        if (t.life <= 0) t.mesh.visible = false;
      }
      for (const f of flashes) {
        if (f.life <= 0) {
          f.light.intensity = 0;
          continue;
        }
        f.life -= dt;
        f.light.intensity = f.peak * Math.max(0, f.life / f.max) ** 2;
      }
      for (let i = debris.length - 1; i >= 0; i--) {
        const d = debris[i];
        d.life -= dt;
        d.vel.y -= 14 * dt;
        d.obj.position.addScaledVector(d.vel, dt);
        d.obj.rotation.x += d.spin.x * dt;
        d.obj.rotation.y += d.spin.y * dt;
        d.obj.rotation.z += d.spin.z * dt;
        const floor = groundAt(Math.hypot(d.obj.position.x, d.obj.position.z)) + 0.04;
        if (d.obj.position.y < floor) {
          d.obj.position.y = floor;
          d.vel.multiplyScalar(d.bounced ? 0 : 0.35);
          d.vel.y = d.bounced ? 0 : 2;
          d.spin.multiplyScalar(d.bounced ? 0 : 0.4);
          d.bounced = true;
        }
        if (d.life < 0.4) d.obj.scale.setScalar(Math.max(0.001, d.life / 0.4));
        if (d.life <= 0) {
          d.obj.removeFromParent();
          debris.splice(i, 1);
        }
      }
    },
    dispose: () => {
      geo.dispose();
      mat.dispose();
      splatTex.dispose();
      splatMat.dispose();
      splatGeo.dispose();
      tracerGeo.dispose();
      tracerMat.dispose();
      flashes.forEach((f) => f.light.removeFromParent());
    },
  };
}
