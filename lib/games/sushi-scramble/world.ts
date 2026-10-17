import * as THREE from "three";
import type { Assets } from "./assets";
import { LOOK, WORLD } from "./tuning";

const R = WORLD.beltRadius;
const HALF = WORLD.beltWidth / 2;
// The belt turns clockwise seen from above.
export const BELT_OMEGA = -WORLD.beltSpeed / R;

// Carry velocity of a point riding the belt (omega x p, about +Y).
export function beltVelocity(p: THREE.Vector3, out: THREE.Vector3) {
  return out.set(BELT_OMEGA * p.z, 0, -BELT_OMEGA * p.x);
}

export type Plate = { root: THREE.Object3D; angle: number; radius: number; height: number };

export type World = {
  root: THREE.Group;
  belt: THREE.Group;
  plates: Plate[];
  lanterns: THREE.Vector3[];
  colliders: THREE.Object3D[]; // what the camera must not pass through, and what shots splat on
  diner: THREE.Mesh;
  setHungry: (hungry: boolean) => void;
  update: (time: number) => void;
};

// A closed profile turned around Y: rims, the counter, the island, lanterns, plates.
function lathe(points: [number, number][], segments: number) {
  return new THREE.LatheGeometry(points.map(([r, y]) => new THREE.Vector2(r, y)), segments);
}

function ormMaterial(set: Assets["wood"], repeat: [number, number], extra: THREE.MeshPhysicalMaterialParameters) {
  const tex = (t: THREE.Texture) => {
    const c = t.clone();
    c.wrapS = c.wrapT = THREE.RepeatWrapping;
    c.repeat.set(...repeat);
    c.needsUpdate = true;
    return c;
  };
  const arm = tex(set.arm);
  return new THREE.MeshPhysicalMaterial({
    map: tex(set.map),
    normalMap: tex(set.normal),
    aoMap: arm,
    roughnessMap: arm,
    metalnessMap: arm,
    ...extra,
  });
}

export function buildWorld(assets: Assets): World {
  const root = new THREE.Group();
  const belt = new THREE.Group();
  root.add(belt);

  // Belt: steel slats on a dark bed, between two polished rims.
  const slatCount = Math.round((Math.PI * 2 * R) / WORLD.slatLength);
  const slatGeo = new THREE.BoxGeometry(WORLD.slatLength * 0.94, 0.08, WORLD.beltWidth);
  // Brushed stainless: the plate's normal detail only; its rusty colour map stays off.
  const slatNormal = assets.metal.normal.clone();
  slatNormal.wrapS = slatNormal.wrapT = THREE.RepeatWrapping;
  slatNormal.repeat.set(0.5, 3);
  slatNormal.needsUpdate = true;
  const slatMat = new THREE.MeshPhysicalMaterial({ color: 0x8a8884, metalness: 0.8, roughness: 0.5, envMapIntensity: 0.5, normalMap: slatNormal, normalScale: new THREE.Vector2(0.3, 0.3), anisotropy: 0.7 });
  const slats = new THREE.InstancedMesh(slatGeo, slatMat, slatCount);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  for (let i = 0; i < slatCount; i++) {
    const a = (i / slatCount) * Math.PI * 2;
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -(a + Math.PI / 2));
    m.compose(new THREE.Vector3(R * Math.cos(a), -0.04, R * Math.sin(a)), q, new THREE.Vector3(1, 1, 1));
    slats.setMatrixAt(i, m);
  }
  slats.receiveShadow = true;
  belt.add(slats);

  const bed = new THREE.Mesh(lathe([[R - HALF - 0.05, -0.1], [R + HALF + 0.05, -0.1]], 256), new THREE.MeshStandardMaterial({ color: 0x15130f, roughness: 0.6, metalness: 0.6, side: THREE.DoubleSide }));
  const steel = new THREE.MeshPhysicalMaterial({ color: 0xc9c6c0, metalness: 1, roughness: 0.22, clearcoat: 0.4 });
  const rimProfile = (r0: number, r1: number): [number, number][] => [[r0, -0.3], [r0, WORLD.rimHeight], [r1, WORLD.rimHeight], [r1, -0.3]];
  const innerRim = new THREE.Mesh(lathe(rimProfile(R - HALF - 0.22, R - HALF), 256), steel);
  const outerRim = new THREE.Mesh(lathe(rimProfile(R + HALF + 0.22, R + HALF), 256), steel);
  [bed, innerRim, outerRim].forEach((o) => {
    o.receiveShadow = true;
    root.add(o);
  });

  // The customers' counter outside the belt and the chef's island inside it: hinoki under a lacquer.
  // Seen nearly edge-on from the belt, any gloss mirrors the room's bright HDRI; keep the lacquer faint.
  const wood = ormMaterial(assets.wood, [48, 2], { metalness: 0, roughness: 1, clearcoat: 0.12, clearcoatRoughness: 0.5, envMapIntensity: 0.12, color: 0xb88a5a });
  // Tops are hinoki; the faces that look onto the belt are dark lacquer, as in a real kaiten bar.
  const lacquer = new THREE.MeshPhysicalMaterial({ color: 0x24150e, roughness: 0.35, clearcoat: 1, clearcoatRoughness: 0.12 });
  const counter = new THREE.Mesh(lathe([[R + HALF + 0.22, WORLD.counterTop], [WORLD.counterOuter, WORLD.counterTop], [WORLD.counterOuter, -3]], 256), wood);
  const counterFace = new THREE.Mesh(lathe([[R + HALF + 0.22, -0.3], [R + HALF + 0.22, WORLD.counterTop]], 256), lacquer);
  const island = new THREE.Mesh(lathe([[WORLD.islandInner, WORLD.islandTop], [R - HALF - 0.22, WORLD.islandTop]], 256), wood);
  const islandFace = new THREE.Mesh(lathe([[R - HALF - 0.22, WORLD.islandTop], [R - HALF - 0.22, -0.3]], 256), lacquer);
  [counter, counterFace, island, islandFace].forEach((o) => {
    o.receiveShadow = true;
    o.castShadow = true;
    root.add(o);
  });
  // A brass lip on the counter's outer edge: past it is the drop to the floor, and it catches the light.
  const lip = new THREE.Mesh(new THREE.TorusGeometry(WORLD.counterOuter, 0.035, 8, 256).rotateX(Math.PI / 2), new THREE.MeshPhysicalMaterial({ color: 0xc9a14a, metalness: 1, roughness: 0.25 }));
  lip.position.y = WORLD.counterTop + 0.02;
  root.add(lip);
  const floor = new THREE.Mesh(new THREE.CircleGeometry(60, 64), new THREE.MeshStandardMaterial({ color: 0x0d0b10, roughness: 0.8 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -3;
  root.add(floor);

  // Paper lanterns over the counter and the island; the lights follow the nearest ones (see update in engine).
  const paper = new THREE.MeshStandardMaterial({ color: 0xfff1dc, emissive: LOOK.lanternColor, emissiveIntensity: LOOK.lanternGlow, roughness: 0.9 });
  const cap = new THREE.MeshStandardMaterial({ color: 0x17120e, roughness: 0.5, metalness: 0.3 });
  const body = lathe(Array.from({ length: 17 }, (_, i): [number, number] => {
    const t = i / 16;
    return [0.12 + 0.58 * Math.sin(Math.PI * t), -0.75 + 1.5 * t];
  }), 32);
  const capGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.12, 24);
  const lanterns: THREE.Vector3[] = [];
  const ring = (count: number, radius: number, height: number, offset: number) => {
    for (let i = 0; i < count; i++) {
      const a = offset + (i / count) * Math.PI * 2;
      const p = new THREE.Vector3(radius * Math.cos(a), height, radius * Math.sin(a));
      const l = new THREE.Group();
      l.position.copy(p);
      l.add(new THREE.Mesh(body, paper));
      [0.78, -0.78].forEach((y) => {
        const c = new THREE.Mesh(capGeo, cap);
        c.position.y = y;
        l.add(c);
      });
      const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 8, 6), cap);
      cord.position.y = 4.8;
      l.add(cord);
      root.add(l);
      lanterns.push(p);
    }
  };
  ring(14, WORLD.lanternRadius, WORLD.lanternHeight, 0);
  ring(7, 12.4, WORLD.lanternHeight + 0.6, Math.PI / 7);
  ring(18, R, 4.3, Math.PI / 18); // a string over the belt itself: the bokeh above the action

  // Indigo noren hung in a ring around the room.
  const norenTex = assets.noren.clone();
  norenTex.wrapS = THREE.RepeatWrapping;
  norenTex.repeat.set(14, 1);
  norenTex.needsUpdate = true;
  const noren = new THREE.Mesh(
    new THREE.CylinderGeometry(WORLD.norenRadius, WORLD.norenRadius, 5.5, 160, 1, true),
    new THREE.MeshStandardMaterial({ map: norenTex, roughness: 0.95, side: THREE.BackSide }),
  );
  noren.position.y = 6.2;
  root.add(noren);
  // The dark wood wall the noren hang in front of; it closes the gap above the counter.
  const wallWood = ormMaterial(assets.wood, [36, 3], { metalness: 0, roughness: 1, envMapIntensity: 0.1, color: 0x3a2516, side: THREE.BackSide });
  const backWall = new THREE.Mesh(new THREE.CylinderGeometry(WORLD.norenRadius + 0.4, WORLD.norenRadius + 0.4, 10, 160, 1, true), wallWood);
  backWall.position.y = 2;
  root.add(backWall);

  // The diner: a photographic plate on a curved screen, already out of focus.
  // It looms above the noren: the plate's lower edge hides behind them, the face fills the sky beyond.
  const dinerMat = new THREE.MeshBasicMaterial({ map: assets.diner, alphaMap: featherMask(), transparent: true, depthWrite: false, toneMapped: false, color: 0x8a8580, side: THREE.BackSide });
  const span = Math.PI / 2.2;
  const dinerHeight = (WORLD.dinerRadius * span * 1150) / 2048;
  const diner = new THREE.Mesh(new THREE.CylinderGeometry(WORLD.dinerRadius, WORLD.dinerRadius, dinerHeight, 64, 1, true, -span / 2, span), dinerMat);
  diner.position.y = 4 + dinerHeight / 2;
  diner.rotation.y = Math.PI / 2;
  root.add(diner);

  // Kaiten plates riding the belt, each carrying a cover sushi.
  const glaze = new THREE.MeshPhysicalMaterial({ color: 0xf6f2ea, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.08 });
  const plateRims = [0x2f4c9a, 0xb8322b, 0xc9a23a, 0x2f4c9a, 0xf6f2ea].map((c) => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.2, clearcoat: 1 }));
  const plateGeo = lathe([[0, 0.02], [0.32, 0.02], [0.36, 0.0], [0.42, 0.03], [0.74, 0.1], [0.8, 0.14], [0.78, 0.155], [0.7, 0.12], [0.4, 0.07], [0, 0.07]], 48);
  const rimGeo = new THREE.TorusGeometry(0.775, 0.022, 8, 48);
  const plates: Plate[] = [];
  for (let i = 0; i < WORLD.plateCount; i++) {
    const angle = (i / WORLD.plateCount) * Math.PI * 2 + 0.13;
    const p = new THREE.Group();
    p.position.set(R * Math.cos(angle), 0, R * Math.sin(angle));
    p.rotation.y = -angle;
    const dish = new THREE.Mesh(plateGeo, glaze);
    const rim = new THREE.Mesh(rimGeo, plateRims[i % plateRims.length]);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.145;
    dish.castShadow = dish.receiveShadow = true;
    p.add(dish, rim);
    const sushi = assets.models.sushi[i % Math.max(1, assets.models.sushi.length)];
    let height = 0.16;
    if (sushi) {
      const s = sushi.clone(true);
      fitTo(s, 1.15);
      s.position.y = 0.1;
      s.rotation.y = (i * 1.7) % (Math.PI * 2);
      p.add(s);
      height = 0.1 + new THREE.Box3().setFromObject(s).getSize(new THREE.Vector3()).y;
    }
    belt.add(p);
    plates.push({ root: p, angle, radius: 0.8, height });
  }

  return {
    root,
    belt,
    plates,
    lanterns,
    colliders: [counter, counterFace, island, islandFace, innerRim, outerRim, backWall, slats],
    diner,
    setHungry: (hungry) => {
      dinerMat.map = hungry ? assets.dinerOpen : assets.diner;
      dinerMat.needsUpdate = true;
    },
    update: (time) => {
      belt.rotation.y = BELT_OMEGA * time;
    },
  };
}

// An alpha mask that fades a plate's edges to nothing, so the diner melts into the dark room.
function featherMask() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 144;
  const g = c.getContext("2d")!;
  const img = g.createImageData(c.width, c.height);
  for (let y = 0; y < c.height; y++) {
    for (let x = 0; x < c.width; x++) {
      const u = x / (c.width - 1);
      const v = y / (c.height - 1);
      const edge = Math.min(u, 1 - u, v * 0.7, 1 - v) * 4.5;
      const a = Math.round(255 * Math.min(1, Math.max(0, edge)) ** 1.6);
      const i = (y * c.width + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = a;
      img.data[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  return new THREE.CanvasTexture(c);
}

// Scale a model so its largest horizontal extent is `size`, standing on y = 0 at its own centre.
export function fitTo(obj: THREE.Object3D, size: number) {
  const box = new THREE.Box3().setFromObject(obj);
  const dim = box.getSize(new THREE.Vector3());
  const s = size / Math.max(dim.x, dim.z, 1e-6);
  obj.scale.multiplyScalar(s);
  const b2 = new THREE.Box3().setFromObject(obj);
  const c = b2.getCenter(new THREE.Vector3());
  obj.position.x -= c.x;
  obj.position.z -= c.z;
  obj.position.y -= b2.min.y;
  return obj;
}
