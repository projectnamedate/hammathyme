import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { ASSET_BASE } from "./tuning";

export type Models = {
  hero: THREE.Group | null;
  handOpen: THREE.Group | null;
  handFist: THREE.Group | null;
  sushi: THREE.Group[];
};

export type Assets = {
  env: THREE.Texture;
  wood: { map: THREE.Texture; normal: THREE.Texture; arm: THREE.Texture };
  metal: { normal: THREE.Texture };
  noren: THREE.Texture;
  diner: THREE.Texture;
  dinerOpen: THREE.Texture;
  models: Models;
  dispose: () => void;
};

const url = (name: string) => `${ASSET_BASE}/${name}`;

export async function loadAssets(renderer: THREE.WebGLRenderer, onProgress: (share: number) => void): Promise<Assets> {
  const manager = new THREE.LoadingManager();
  manager.onProgress = (_item, loaded, total) => onProgress(total ? loaded / total : 0);
  const textures = new THREE.TextureLoader(manager);
  const gltf = new GLTFLoader(manager);
  gltf.setMeshoptDecoder(MeshoptDecoder);
  const made: { dispose: () => void }[] = [];

  const tex = async (name: string, color = false, repeat?: [number, number]) => {
    const t = await textures.loadAsync(url(name));
    t.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    if (repeat) {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(...repeat);
    }
    made.push(t);
    return t;
  };
  // A model that hasn't been made yet loads as null, so the set still renders around it.
  const model = async (name: string) => {
    try {
      const g = await gltf.loadAsync(url(name));
      g.scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        made.push(mesh.geometry);
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m) => made.push(m));
      });
      return g.scene;
    } catch {
      return null;
    }
  };

  const pmrem = new THREE.PMREMGenerator(renderer);
  const hdrPromise = new HDRLoader(manager).loadAsync(url("env/warm_restaurant_1k.hdr")).then((hdr) => {
    hdr.mapping = THREE.EquirectangularReflectionMapping;
    const env = pmrem.fromEquirectangular(hdr).texture;
    made.push(env, hdr);
    return env;
  });

  const [env, woodMap, woodNormal, woodArm, metalNormal, noren, diner, dinerOpen, hero, handOpen, handFist, tuna, tamago, ikura] =
    await Promise.all([
      hdrPromise,
      tex("tex/wood_diff.webp", true),
      tex("tex/wood_nor.webp"),
      tex("tex/wood_arm.webp"),
      tex("tex/metal_nor.webp"),
      tex("tex/noren.webp", true),
      tex("plates/diner.webp", true),
      tex("plates/diner-open.webp", true),
      model("models/hero.glb"),
      model("models/hand-open.glb"),
      model("models/hand-fist.glb"),
      model("models/tuna.glb"),
      model("models/tamago.glb"),
      model("models/ikura.glb"),
    ]);
  pmrem.dispose();

  return {
    env,
    wood: { map: woodMap, normal: woodNormal, arm: woodArm },
    metal: { normal: metalNormal },
    noren,
    diner,
    dinerOpen,
    models: { hero, handOpen, handFist, sushi: [tuna, tamago, ikura].filter((m): m is THREE.Group => m !== null) },
    dispose: () => made.forEach((m) => m.dispose()),
  };
}
