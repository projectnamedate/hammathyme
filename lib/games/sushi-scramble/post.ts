import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { LOOK, TIERS, type Tier } from "./tuning";

// A food-ad grade in linear light: warm the shadows a touch and darken the corners. No grain.
const GradeShader = {
  uniforms: { tDiffuse: { value: null }, uVignette: { value: LOOK.vignette }, uLift: { value: new THREE.Vector3(0.012, 0.006, 0.0) } },
  vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform float uVignette; uniform vec3 uLift; varying vec2 vUv;
    void main() {
      vec4 c = texture2D(tDiffuse, vUv);
      c.rgb += uLift * (1.0 - clamp(dot(c.rgb, vec3(0.333)), 0.0, 1.0));
      vec2 d = vUv - 0.5;
      c.rgb *= 1.0 - uVignette * smoothstep(0.25, 0.85, dot(d, d) * 2.2);
      gl_FragColor = c;
    }`,
};

export type Post = {
  composer: EffectComposer;
  render: () => void;
  setFocus: (distance: number) => void;
  setSize: (w: number, h: number) => void;
  dispose: () => void;
};

export function buildPost(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, tier: Tier): Post {
  const t = TIERS[tier];
  const size = renderer.getDrawingBufferSize(new THREE.Vector2());
  const target = new THREE.WebGLRenderTarget(size.x, size.y, { type: THREE.HalfFloatType, samples: tier === "low" ? 0 : 4 });
  const composer = new EffectComposer(renderer, target);
  composer.addPass(new RenderPass(scene, camera));

  const gtao = t.gtao ? new GTAOPass(scene, camera, size.x, size.y) : null;
  if (gtao) {
    gtao.blendIntensity = 0.75;
    composer.addPass(gtao);
  }
  // The macro lens: the arena around the hero stays sharp, the room and the diner melt into bokeh.
  const bokeh = t.dof ? new BokehPass(scene, camera, { focus: 3, aperture: LOOK.dof.aperture, maxblur: LOOK.dof.maxBlur }) : null;
  if (bokeh) composer.addPass(bokeh);
  const bloom = new UnrealBloomPass(new THREE.Vector2(size.x / 2, size.y / 2), LOOK.bloom.strength, LOOK.bloom.radius, LOOK.bloom.threshold);
  composer.addPass(bloom);
  composer.addPass(new ShaderPass(GradeShader));
  composer.addPass(new OutputPass());

  return {
    composer,
    render: () => composer.render(),
    setFocus: (distance) => {
      if (bokeh) (bokeh.uniforms as Record<string, THREE.IUniform>).focus.value = distance;
    },
    setSize: (w, h) => {
      composer.setSize(w, h);
      gtao?.setSize(w, h);
    },
    dispose: () => {
      composer.passes.forEach((p) => (p as { dispose?: () => void }).dispose?.());
      composer.dispose();
      target.dispose();
    },
  };
}
