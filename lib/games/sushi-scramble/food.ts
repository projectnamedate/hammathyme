import * as THREE from "three";

// The Hunyuan meshes carry one atlas each, so the food is found by colour in the shader: salmon-orange texels get
// a wet clearcoat, more gloss and a little glow standing in for light passing through the flesh; near-white,
// unsaturated texels (rice) get a matte sheen. Armour and everything else keep the baked metal-rough map.
export function foodMaterial(source: THREE.Material, { glow = 0.16 } = {}) {
  const src = source as THREE.MeshStandardMaterial;
  const mat = new THREE.MeshPhysicalMaterial({
    map: src.map,
    normalMap: src.normalMap,
    roughnessMap: src.roughnessMap,
    metalnessMap: src.metalnessMap,
    roughness: src.roughness,
    metalness: src.metalness,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
    sheen: 1,
    sheenRoughness: 0.55,
    sheenColor: new THREE.Color(0xfff6e8),
  });
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uGlow = { value: glow };
    shader.fragmentShader = shader.fragmentShader
      .replace("void main() {", "uniform float uGlow;\nvoid main() {\n  float salmonMask = 0.0; float riceMask = 0.0;")
      .replace(
        "#include <map_fragment>",
        `#include <map_fragment>
        {
          vec3 c = diffuseColor.rgb;
          float hi = max(c.r, max(c.g, c.b)), lo = min(c.r, min(c.g, c.b));
          float sat = (hi - lo) / max(hi, 1e-3);
          salmonMask = smoothstep(0.35, 0.6, sat) * smoothstep(0.08, 0.3, c.r - c.b) * step(c.g, c.r) * step(c.b, c.g + 0.02);
          riceMask = smoothstep(0.45, 0.7, hi) * (1.0 - smoothstep(0.1, 0.22, sat));
          // Richer, deeper salmon; AgX pales saturated highlights, so push it a little past the photo.
          diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(1.08, 0.72, 0.55), salmonMask);
        }`,
      )
      .replace(
        "#include <metalnessmap_fragment>",
        `#include <metalnessmap_fragment>
        // Painted armour: half metal, so the olive base colour shows under the reflections.
        metalnessFactor *= mix(0.55, 0.0, clamp(salmonMask + riceMask, 0.0, 1.0));`,
      )
      .replace(
        "#include <roughnessmap_fragment>",
        `#include <roughnessmap_fragment>
        roughnessFactor = mix(roughnessFactor, 0.3, salmonMask);
        roughnessFactor = mix(roughnessFactor, 0.62, riceMask);`,
      )
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
        totalEmissiveRadiance += diffuseColor.rgb * salmonMask * uGlow;`,
      )
      .replace(
        "#include <lights_physical_fragment>",
        `#include <lights_physical_fragment>
        material.clearcoat *= salmonMask;
        material.sheenColor *= riceMask;`,
      );
  };
  mat.customProgramCacheKey = () => "sushi-food";
  return mat;
}

// Swap every mesh material in a loaded model for the food material.
export function applyFood(root: THREE.Object3D, glow?: number) {
  const made: THREE.Material[] = [];
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const next = foodMaterial(mesh.material as THREE.Material, { glow });
    made.push(next);
    mesh.material = next;
  });
  return made;
}
