// The hammer: a riso-printed 3D claw hammer. Its pose comes from CR.hammerState(world time), so it rewinds with the sheet.
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.181.2/+esm";

const W = 6480, H = 1620; // canvas buffer: 1.5x its 4320 x 1080 world-px box
const canvas = document.getElementById("hammer3d");
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(1);
renderer.setSize(W, H, false);
renderer.setClearColor(0x000000, 0);

const scene = new THREE.Scene();
// One unit = one world px on the z = 0 plane: half-height 540 at fov 30.
const camera = new THREE.PerspectiveCamera(30, W / H, 10, 10000);
camera.position.set(0, 0, 540 / Math.tan(THREE.MathUtils.degToRad(15)));
camera.lookAt(0, 0, 0);

const rgb = (r, g, b) => new THREE.Vector3(r / 255, g / 255, b / 255);
const PAPER = rgb(238, 240, 234), BLUE = rgb(50, 85, 164), PINK = rgb(255, 72, 176), YELLOW = rgb(255, 232, 0);

// Flat ink, halftone shading in a second ink (multiplied like an overprint), paper showing through the highlight.
function risoMaterial(ink, shade) {
  return new THREE.ShaderMaterial({
    uniforms: { uInk: { value: ink }, uShade: { value: shade }, uPaper: { value: PAPER }, uCell: { value: 13.0 } },
    vertexShader: `
      varying vec3 vN;
      void main() {
        vN = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      uniform vec3 uInk; uniform vec3 uShade; uniform vec3 uPaper; uniform float uCell;
      varying vec3 vN;
      void main() {
        vec3 n = normalize(vN);
        vec3 l = normalize(vec3(-0.45, 0.75, 0.5));
        float lam = clamp(dot(n, l), 0.0, 1.0);
        float tone = clamp((1.0 - lam) * 1.15 - 0.08, 0.0, 1.0);
        float a = radians(15.0);
        mat2 R = mat2(cos(a), -sin(a), sin(a), cos(a));
        vec2 f = fract(R * gl_FragCoord.xy / uCell) - 0.5;
        float rad = 0.68 * sqrt(tone);
        float dotOn = 1.0 - smoothstep(rad - 0.06, rad + 0.06, length(f));
        vec3 col = uInk * mix(vec3(1.0), uShade, dotOn);
        float spec = pow(clamp(dot(reflect(-l, n), vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 18.0);
        col = mix(col, uPaper, smoothstep(0.55, 0.75, spec));
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
}

// Local frame: handle along +y, head across the top. Model offset puts the centre of mass at the origin.
function buildHammer(headMat, handleMat) {
  const model = new THREE.Group();
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(20, 25, 440, 28), handleMat);
  handle.position.set(0, -50, 0);
  const head = new THREE.Mesh(new THREE.BoxGeometry(230, 84, 84), headMat);
  head.position.set(10, 200, 0);
  const face = new THREE.Mesh(new THREE.CylinderGeometry(50, 50, 70, 36), headMat);
  face.rotation.z = Math.PI / 2;
  face.position.set(150, 200, 0);
  model.add(handle, head, face);
  for (const z of [-22, 22]) {
    const claw = new THREE.Mesh(new THREE.TorusGeometry(80, 14, 12, 28, Math.PI * 0.6), headMat);
    claw.rotation.z = Math.PI / 2;
    claw.position.set(-105, 120, z);
    model.add(claw);
  }
  model.position.set(-30, -110, 0);
  const pivot = new THREE.Group();
  pivot.add(model);
  pivot.scale.setScalar(0.85);
  return pivot;
}

const hammer = buildHammer(risoMaterial(BLUE, PINK), risoMaterial(YELLOW, BLUE));
const plateMat = new THREE.MeshBasicMaterial({ color: 0xff48b0 });
const plate = buildHammer(plateMat, plateMat);
scene.add(plate, hammer);

function renderAt(time) {
  const st = window.CR.hammerState(window.CR.worldTime(time));
  for (const [g, dx, dy, dz] of [[hammer, 0, 0, 0], [plate, 7, -6, -30]]) {
    g.visible = st.vis;
    g.position.set(st.x + dx, st.y + dy, st.z + dz);
    g.rotation.set(st.rx, st.ry, st.rz);
  }
  renderer.render(scene, camera);
}

window.addEventListener("hf-seek", (event) => renderAt(event.detail.time));
renderAt(window.__hfThreeTime || 0);
