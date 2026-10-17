// The 3D layers of Chain Reaction: the hammer, the domino chart, the globe and the Rube Goldberg machine behind the
// tear. Every pose is a pure function of world time (CR.worldTime).
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.181.2/+esm";

await document.fonts.ready;
const CR = window.CR, T = CR.T;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, u) => a + (b - a) * u;
const seg = (t, t0, t1, e = "none") => gsap.parseEase(e)(clamp((t - t0) / (t1 - t0)));
const rgb = (r, g, b) => new THREE.Vector3(r / 255, g / 255, b / 255);
const PAPER = rgb(218, 212, 238), PAPER_HI = rgb(248, 246, 253), BLUE = rgb(50, 85, 164), PINK = rgb(255, 72, 176), YELLOW = rgb(255, 232, 0);

// Flat ink with a smooth shadow in a second ink (multiplied like an overprint), paper showing through the highlight.
function riso(ink, shade, bias = 0) {
  return new THREE.ShaderMaterial({
    uniforms: { uInk: { value: ink }, uShade: { value: shade }, uPaper: { value: PAPER_HI }, uBias: { value: bias } },
    vertexShader: `varying vec3 vN; void main() { vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `
      uniform vec3 uInk; uniform vec3 uShade; uniform vec3 uPaper; uniform float uBias; varying vec3 vN;
      void main() {
        vec3 n = normalize(vN);
        vec3 l = normalize(vec3(-0.45, 0.75, 0.5));
        float lam = clamp(dot(n, l), 0.0, 1.0);
        float tone = clamp((1.0 - lam) * 1.15 - 0.08 - uBias, 0.0, 1.0);
        vec3 col = uInk * mix(vec3(1.0), uShade, 0.75 * smoothstep(0.0, 1.0, tone));
        float spec = pow(clamp(dot(reflect(-l, n), vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 18.0);
        col = mix(col, uPaper, smoothstep(0.55, 0.75, spec));
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
}
const flat = (hex) => new THREE.MeshBasicMaterial({ color: hex });

function renderer(id, w, h, clear) {
  const r = new THREE.WebGLRenderer({ canvas: document.getElementById(id), alpha: clear == null, antialias: true });
  r.setPixelRatio(1);
  r.setSize(w, h, false);
  if (clear == null) r.setClearColor(0x000000, 0); else r.setClearColor(clear, 1);
  return r;
}
// Canvas px (css size cw x ch) of a 3D point, offset into world px.
function toWorld(v, cam, cw, ch, ox, oy) {
  const p = v.clone().project(cam);
  return { x: ox + (p.x + 1) / 2 * cw, y: oy + (1 - p.y) / 2 * ch };
}

// ---------------------------------------------------------------- hammer (shared by the flight and the machine)
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
  return pivot;
}
const HEAD = riso(BLUE, PINK), HANDLE = riso(YELLOW, BLUE), PLATE = flat(0xff48b0);

// ---------------------------------------------------------------- A. the hammer's flight (world 0..4320 x 1080..2160)
const hR = renderer("hammer3d", 6480, 1620);
const hScene = new THREE.Scene();
const hCam = new THREE.PerspectiveCamera(30, 4, 10, 10000);
hCam.position.set(0, 0, 540 / Math.tan(THREE.MathUtils.degToRad(15)));
hCam.lookAt(0, 0, 0);
const flyer = buildHammer(HEAD, HANDLE), flyerPlate = buildHammer(PLATE, PLATE);
flyer.scale.setScalar(0.85); flyerPlate.scale.setScalar(0.85);
hScene.add(flyerPlate, flyer);
function renderFlight(wt) {
  const st = CR.hammerState(wt);
  for (const [g, dx, dy, dz] of [[flyer, 0, 0, 0], [flyerPlate, 7, -6, -30]]) {
    g.visible = st.vis;
    g.position.set(st.x + dx, st.y + dy, st.z + dz);
    g.rotation.set(st.rx, st.ry, st.rz);
  }
  hR.render(hScene, hCam);
}

// ---------------------------------------------------------------- B. dominoes that become a 3D bar chart (panel 2)
const F = [0.18, 0.27, 0.38, 0.52, 0.66, 0.83, 0.97];
const dR = renderer("p2-3d", 2880, 1620);
const dScene = new THREE.Scene();
const dCam = new THREE.OrthographicCamera(-960, 960, 540, -540, -6000, 6000);
dCam.zoom = 0.85;
{
  const az = THREE.MathUtils.degToRad(-28), el = THREE.MathUtils.degToRad(22), target = new THREE.Vector3(-60, 190, 0);
  dCam.position.copy(target).add(new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)).multiplyScalar(2500));
  dCam.lookAt(target);
  dCam.updateProjectionMatrix();
}
const stage = new THREE.Mesh(new THREE.BoxGeometry(1240, 24, 360), riso(PAPER_HI, BLUE));
stage.position.set(-240, -12, 0);
dScene.add(stage);
const DOM_X = (i) => -660 + i * 140;
const doms = F.map((_, i) => {
  const pivot = new THREE.Group();
  pivot.position.set(DOM_X(i) + 35, 0, 0);
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(70, 420, 150), riso(i % 3 === 2 ? PINK : BLUE, i % 3 === 2 ? BLUE : PINK));
  mesh.position.set(-35, 210, 0);
  const plate = new THREE.Mesh(new THREE.BoxGeometry(70, 420, 150), flat(0xff48b0));
  plate.position.set(-29, 205, -14);
  pivot.add(plate, mesh);
  dScene.add(pivot);
  return pivot;
});
const LEAN = Math.asin(70 / 420);
const tops = F.map((f, i) => new THREE.Vector3(DOM_X(i), 420 * f + 26, 0));
const trend = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(tops), 120, 7, 8), flat(0xff48b0));
const trendCount = trend.geometry.index.count;
dScene.add(trend);
function renderDominoes(wt) {
  doms.forEach((p, i) => {
    const t0 = T.domino + i * 0.19;
    const fall = i === doms.length - 1 ? 0.42 : LEAN;
    let rz = -fall * seg(wt, t0, t0 + 0.22, "power2.in");
    const up = seg(wt, T.chart + i * 0.05, T.chart + 0.55 + i * 0.05, "back.out(1.6)");
    rz = lerp(rz, 0, clamp(up));
    p.rotation.set(0, Math.PI * 2 * up, rz);
    p.scale.y = lerp(1, F[i], up);
  });
  const prog = seg(wt, 13.8, 14.7, "power2.inOut");
  trend.visible = prog > 0;
  trend.geometry.setDrawRange(0, Math.floor((trendCount * prog) / 6) * 6);
  dR.render(dScene, dCam);
}

// ---------------------------------------------------------------- C. the globe (panel 3)
const gR = renderer("p3-3d", 2880, 1620);
const gScene = new THREE.Scene();
const gCam = new THREE.PerspectiveCamera(30, 16 / 9, 0.1, 100);
gCam.position.set(0, 0, 6.0);
gCam.lookAt(0, 0, 0);
const globe = new THREE.Group();
globe.position.set(0.6, -0.34, 0);
gScene.add(globe);
const spin = new THREE.Group();
globe.add(spin);
const plateBall = new THREE.Mesh(new THREE.SphereGeometry(0.995, 64, 48), flat(0xff48b0));
plateBall.position.set(0.035, -0.03, -0.06);
globe.add(plateBall);
spin.add(new THREE.Mesh(new THREE.SphereGeometry(0.995, 72, 54), riso(PAPER_HI, BLUE)));
const ll = (lon, lat, r = 1) => { const a = THREE.MathUtils.degToRad(lon), b = THREE.MathUtils.degToRad(lat); return new THREE.Vector3(Math.cos(b) * Math.sin(a) * r, Math.sin(b) * r, Math.cos(b) * Math.cos(a) * r); };
{
  const pts = window.CR_MAP.globe;
  const dots = new THREE.InstancedMesh(new THREE.CircleGeometry(0.0105, 8), flat(0x3255a4), pts.length);
  const m = new THREE.Object3D();
  pts.forEach(([lon, lat], i) => { const p = ll(lon, lat, 1.002); m.position.copy(p); m.lookAt(p.clone().multiplyScalar(2)); m.updateMatrix(); dots.setMatrixAt(i, m.matrix); });
  spin.add(dots);
}
const NAMES = ["SFO", "NYC", "LDN", "CAI", "TYO"];
const CITY = NAMES.map((k) => ll(...window.CR_MAP.cityLL[k]));
function textSprite(text, font, w, h, draw) {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  draw(c.getContext("2d"), text, font);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  return new THREE.Sprite(new THREE.SpriteMaterial({ map: tex }));
}
const oneSprite = textSprite("1", "196px 'Archivo Black'", 256, 256, (g, s, f) => {
  g.font = f; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillStyle = "#ff48b0"; g.fillText(s, 134, 138);
  g.fillStyle = "#3255a4"; g.fillText(s, 128, 132);
});
oneSprite.scale.set(0.3, 0.3, 1);
// Motion trail: fading pink copies of the "1" at earlier points on the route.
const trailMap = textSprite("1", "196px 'Archivo Black'", 256, 256, (g, s, f) => {
  g.font = f; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#ff48b0"; g.fillText(s, 128, 132);
}).material.map;
const TRAIL_DT = 0.06;
const trail = [...Array(7)].map((_, k) => {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: trailMap, transparent: true, opacity: 0.6 * (1 - k / 7) }));
  s.scale.set(0.3 * (1 - k * 0.07), 0.3 * (1 - k * 0.07), 1);
  gScene.add(s);
  return s;
});
gScene.add(oneSprite);
const pins = CITY.map((p, i) => {
  const g = new THREE.Group();
  g.position.copy(p);
  g.lookAt(p.clone().multiplyScalar(2));
  const body = new THREE.Group();
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.13, 8), flat(0x3255a4));
  stem.rotation.x = Math.PI / 2; stem.position.z = 0.065;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.036, 20, 14), riso(PINK, BLUE));
  head.position.z = 0.15;
  body.add(stem, head);
  g.add(body);
  const label = textSprite(NAMES[i], "bold 44px 'Space Mono'", 200, 80, (c, s, f) => {
    c.fillStyle = "#3255a4"; c.fillRect(6, 6, 188, 68);
    c.fillStyle = "#f8f6fd"; c.font = f; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(s, 100, 42);
  });
  label.scale.set(0.2, 0.08, 1);
  label.position.set(0.13, 0, 0.17);
  g.add(label);
  spin.add(g);
  return { g, body, label };
});
const arcs = CITY.slice(0, -1).map((a, i) => {
  const b = CITY[i + 1], pts = [];
  for (let k = 0; k <= 64; k++) {
    const u = k / 64, p = a.clone().lerp(b, u).normalize();
    pts.push(p.multiplyScalar(1 + 0.16 * Math.sin(Math.PI * u)));
  }
  const curve = new THREE.CatmullRomCurve3(pts);
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 96, 0.009, 8), flat(0xff48b0));
  spin.add(mesh);
  return { curve, mesh, count: mesh.geometry.index.count };
});
const LON_KEYS = [[18.0, -150], [T.legs[0], -112], [T.legs[1], -72], [T.legs[2], -22], [T.legs[3], 14], [T.legs[4], 118], [T.fling, 126]];
function globeLon(wt) {
  if (wt <= LON_KEYS[0][0]) return LON_KEYS[0][1];
  for (let i = 1; i < LON_KEYS.length; i++) {
    if (wt <= LON_KEYS[i][0]) return lerp(LON_KEYS[i - 1][1], LON_KEYS[i][1], seg(wt, LON_KEYS[i - 1][0], LON_KEYS[i][0], "sine.inOut"));
  }
  return LON_KEYS[LON_KEYS.length - 1][1];
}
// Where the "1" is on the route, in the spinning frame; null before it lands on SFO or after Tokyo throws it.
function oneOnRoute(wt) {
  if (wt < T.legs[0] || wt >= T.fling) return null;
  if (wt >= T.legs[4]) {
    const squash = 0.06 * seg(wt, T.legs[4], T.legs[4] + 0.3, "power2.out");
    return CITY[4].clone().multiplyScalar(1 + 0.29 - squash);
  }
  let i = 0;
  while (wt >= T.legs[i + 1]) i++;
  const u = seg(wt, T.legs[i], T.legs[i + 1], "sine.inOut");
  const p = arcs[i].curve.getPointAt(u);
  return p.clone().add(p.clone().normalize().multiplyScalar(0.13));
}
function poseGlobe(wt) {
  spin.rotation.set(THREE.MathUtils.degToRad(34), THREE.MathUtils.degToRad(-globeLon(wt)), 0);
  pins.forEach((p, i) => {
    const s = gsap.parseEase("back.out(2.4)")(clamp((wt - (T.legs[i] - 0.12)) / 0.45));
    p.g.visible = s > 0.001;
    p.g.scale.setScalar(Math.max(s, 0.001));
    if (i === 4) p.body.scale.z = 1 - 0.4 * seg(wt, T.legs[4], T.legs[4] + 0.3, "power2.out") + 0.4 * seg(wt, T.fling, T.fling + 0.25, "elastic.out(1.2, 0.35)");
  });
  arcs.forEach((a, i) => {
    const prog = clamp((wt - T.legs[i]) / (T.legs[i + 1] - T.legs[i]));
    const e = gsap.parseEase("sine.inOut")(prog);
    a.mesh.visible = e > 0;
    a.mesh.geometry.setDrawRange(0, Math.floor((a.count * e) / 6) * 6);
  });
  const p = oneOnRoute(wt);
  oneSprite.visible = !!p;
  if (p) { globe.updateMatrixWorld(); oneSprite.position.copy(p.clone().applyMatrix4(spin.matrixWorld)); }
  trail.forEach((s, k) => {
    const tk = wt - (k + 1) * TRAIL_DT, q = p && tk < T.legs[4] ? oneOnRoute(tk) : null;
    s.visible = !!q;
    if (q) s.position.copy(q.applyMatrix4(spin.matrixWorld));
  });
}
function renderGlobe(wt) { poseGlobe(wt); gR.render(gScene, gCam); }

// ---------------------------------------------------------------- D. the Rube Goldberg machine behind the tear
const rR = renderer("rg", 2304, 1368, 0xdad4ee);
const rScene = new THREE.Scene();
const rCam = new THREE.PerspectiveCamera(40, 1280 / 760, 0.1, 200);
const table = new THREE.Mesh(new THREE.BoxGeometry(34, 0.4, 12), riso(PAPER_HI, BLUE));
table.position.set(1, -0.2, -1);
const wall = new THREE.Mesh(new THREE.PlaneGeometry(60, 24), riso(PAPER, PINK, 0.32));
wall.position.set(1, 8, -7);
rScene.add(table, wall);
function box(w, h, d, mat, x, y, z, rz = 0) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); m.rotation.z = rz; rScene.add(m); return m; }
function plated(mesh, dx = 0.05, dy = -0.04) { const p = new THREE.Mesh(mesh.geometry, PLATE); p.position.copy(mesh.position).add(new THREE.Vector3(dx, dy, -0.06)); p.rotation.copy(mesh.rotation); rScene.add(p); return p; }
const SEE = { x: -7, y: 0.8, half: 2.2 };
box(0.9, 0.8, 0.9, riso(BLUE, PINK), SEE.x, 0.4, 0, Math.PI / 4);
const seesaw = new THREE.Group(); seesaw.position.set(SEE.x, SEE.y, 0); rScene.add(seesaw);
seesaw.add(new THREE.Mesh(new THREE.BoxGeometry(SEE.half * 2, 0.16, 0.8), riso(YELLOW, BLUE)));
// Three ramps, each [high end, low end]; the marble runs along z = 0, so the posts stand behind the ramps (z -0.55).
const RAMPS = [[[-4.2, 4.6], [1.8, 3.9]], [[2.3, 3.1], [-3.4, 2.4]], [[-3.7, 1.65], [1.6, 1.2]]];
RAMPS.forEach(([a, b], i) => {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]), ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const m = box(len, 0.12, 0.9, riso(i === 1 ? PINK : BLUE, i === 1 ? BLUE : PINK), (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 0.06, 0, ang);
  plated(m);
  for (const [p, q] of [[a, b], [b, a]]) box(0.12, p[1] - 0.1, 0.12, riso(BLUE, PINK), p[0] + 0.15 * Math.sign(q[0] - p[0]), (p[1] - 0.1) / 2, -0.55);
});
// Backstops where the run turns round: the marble flies off one ramp's end, hits the stop and drops onto the next.
box(0.12, 1.12, 0.9, riso(BLUE, PINK), 2.64, 3.62, 0);
box(0.12, 1.2, 0.9, riso(BLUE, PINK), -4.04, 2.2, 0);
// The funnel's hole is wider than the marble, so it drops through.
const FUN = { x: 2.8, top: 1.25, bot: 0.7, rTop: 0.9, rBot: 0.34 };
{
  const cone = new THREE.Mesh(new THREE.CylinderGeometry(FUN.rTop, FUN.rBot, FUN.top - FUN.bot, 40, 1, true), riso(PINK, BLUE));
  cone.material.side = THREE.DoubleSide;
  cone.position.set(FUN.x, (FUN.top + FUN.bot) / 2, 0);
  rScene.add(cone);
  box(0.12, FUN.top, 0.12, riso(BLUE, PINK), FUN.x, FUN.top / 2, -FUN.rTop - 0.06);
}
const RDX = (i) => 3.95 + i * 0.5;
const rdoms = [...Array(8)].map((_, i) => {
  const pivot = new THREE.Group(); pivot.position.set(RDX(i) + 0.07, 0, 0); rScene.add(pivot);
  const inks = [[BLUE, PINK], [YELLOW, BLUE], [PINK, BLUE]][i % 3];
  const m = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.1, 0.6), riso(inks[0], inks[1])); m.position.set(-0.07, 0.55, 0);
  pivot.add(m);
  return pivot;
});
const CAT = { x: 8.9, y: 0.75, half: 1.3 };
box(0.5, 0.75, 0.6, riso(BLUE, PINK), CAT.x, 0.375, 0);
const arm = new THREE.Group(); arm.position.set(CAT.x, CAT.y, 0); rScene.add(arm);
arm.add(new THREE.Mesh(new THREE.BoxGeometry(CAT.half * 2, 0.12, 0.5), riso(YELLOW, BLUE)));
const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.3, 0.3, 24, 1, true), riso(BLUE, PINK)); cup.material.side = THREE.DoubleSide; cup.position.set(CAT.half - 0.2, 0.2, 0); arm.add(cup);
const marble = new THREE.Mesh(new THREE.SphereGeometry(0.28, 32, 24), riso(PINK, BLUE)); rScene.add(marble);
const bigBall = new THREE.Mesh(new THREE.SphereGeometry(0.55, 40, 30), riso(PINK, BLUE)); rScene.add(bigBall);
const rgHammer = buildHammer(HEAD, HANDLE); rgHammer.scale.setScalar(0.0062); rScene.add(rgHammer);

const MR = 0.28, SIT = MR + 0.08; // marble radius; centre height above the seesaw plank's centre line
// The marble's centre on ramp i at u (0 = high end): one radius off the top face, along the upward normal.
function onRamp(i, u) {
  const [a, b] = RAMPS[i], len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  let nx = -(b[1] - a[1]) / len, ny = (b[0] - a[0]) / len;
  if (ny < 0) { nx = -nx; ny = -ny; }
  return new THREE.Vector3(lerp(a[0], b[0], u) + nx * MR, lerp(a[1], b[1], u) + ny * MR, 0);
}
function arc(p0, p1, h, u) { return new THREE.Vector3(lerp(p0.x, p1.x, u), lerp(p0.y, p1.y, u) + 4 * h * u * (1 - u), lerp(p0.z, p1.z, u)); }
// Off a ramp's end: carries on sideways and stops (a backstop or the funnel wall) while it falls.
function fall(p0, p1, u) { return new THREE.Vector3(lerp(p0.x, p1.x, gsap.parseEase("power2.out")(u)), lerp(p0.y, p1.y, u * u), lerp(p0.z, p1.z, u)); }
// Spiralling down inside the cone, one radius in from its wall, to the hole.
const funR = (y) => FUN.rBot + (FUN.rTop - FUN.rBot) * (y - FUN.bot) / (FUN.top - FUN.bot);
function inFunnel(u) {
  const y = lerp(FUN.top - 0.02, FUN.bot, u), rad = Math.max(0, funR(y) - MR * 1.1), ang = Math.PI + u * Math.PI * 3.5;
  return new THREE.Vector3(FUN.x + Math.cos(ang) * rad, y, Math.sin(ang) * rad);
}
const seeAngle = (rt) => lerp(-0.28, 0.33, seg(rt, 0.35, 0.47, "power4.out"));
const seeEnd = (rt, side) => { const a = seeAngle(rt); return new THREE.Vector3(SEE.x + side * SEE.half * Math.cos(a), SEE.y + side * SEE.half * Math.sin(a), 0); };
const R = { launch: 0.37, r1: [1.0, 1.75], r2: [1.88, 2.6], r3: [2.72, 3.34], fun: [3.42, 4.0], dom: 4.32, cat: 5.32, fill: 6.1 };
function marblePos(rt) {
  if (rt < R.launch) return seeEnd(0, 1).add(new THREE.Vector3(0, SIT, 0));
  if (rt < R.r1[0]) return arc(seeEnd(R.launch, 1).add(new THREE.Vector3(0, SIT, 0)), onRamp(0, 0), 1.2, seg(rt, R.launch, R.r1[0]));
  const runs = [R.r1, R.r2, R.r3];
  for (let k = 0; k < 3; k++) {
    if (k > 0 && rt < runs[k][0]) return fall(onRamp(k - 1, 1), onRamp(k, 0), seg(rt, runs[k - 1][1], runs[k][0]));
    if (rt < runs[k][1]) return onRamp(k, seg(rt, runs[k][0], runs[k][1], "power1.in"));
  }
  if (rt < R.fun[0]) return fall(onRamp(2, 1), inFunnel(0), seg(rt, R.r3[1], R.fun[0]));
  if (rt < R.fun[1]) return inFunnel(seg(rt, R.fun[0], R.fun[1], "power1.in"));
  const land = R.fun[1] + 0.12, floor = new THREE.Vector3(FUN.x, MR, 0), hit = new THREE.Vector3(RDX(0) - 0.07 - MR, MR, 0);
  if (rt < land) return inFunnel(1).lerp(floor, seg(rt, R.fun[1], land, "power2.in"));
  if (rt < R.dom) return floor.clone().lerp(hit, seg(rt, land, R.dom));
  return hit.clone().add(new THREE.Vector3(-0.25 * seg(rt, R.dom, R.dom + 0.4, "power2.out"), 0, 0));
}
const catAngle = (rt) => lerp(-0.22, 0.6, seg(rt, R.cat, R.cat + 0.12, "power4.out"));
const RKEYS = [
  [0.0, [-7.5, 2.6, 8.5], [-7.2, 1.6, 0]], [0.5, [-7.0, 3.2, 8.0], [-6.4, 2.4, 0]], [1.0, [-4.4, 5.2, 7.2], [-3.4, 4.4, 0]],
  [1.75, [0.8, 4.6, 6.6], [1.0, 3.7, 0]], [2.6, [-2.2, 3.3, 6.4], [-2.6, 2.4, 0]], [3.35, [1.0, 2.4, 6.0], [1.6, 1.3, 0]],
  [4.0, [2.4, 1.6, 4.6], [2.9, 0.6, 0]], [4.6, [3.6, 0.8, 2.6], [6.0, 0.5, 0]], [5.2, [7.6, 1.4, 5.0], [9.2, 1.0, 0]],
  [5.7, [9.0, 1.7, 6.0], [9.6, 1.3, 0]], [6.1, [9.2, 1.7, 6.2], [9.8, 1.4, 0]], [7.1, [3.0, 6.5, 19.0], [1.6, 2.0, 0]],
  [8.14, [2.0, 7.0, 20.5], [1.4, 2.2, 0]],
];
function camKey(rt, idx) {
  if (rt <= RKEYS[0][0]) return new THREE.Vector3(...RKEYS[0][idx]);
  let i = 0;
  while (i < RKEYS.length - 2 && rt >= RKEYS[i + 1][0]) i++;
  const k = (j) => RKEYS[Math.max(0, Math.min(RKEYS.length - 1, j))][idx];
  const u = clamp((rt - RKEYS[i][0]) / (RKEYS[i + 1][0] - RKEYS[i][0]));
  const cm = (a, b, c, d, t) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t);
  return new THREE.Vector3(...[0, 1, 2].map((c) => cm(k(i - 1)[c], k(i)[c], k(i + 1)[c], k(i + 2)[c], u)));
}
function renderMachine(wt) {
  const rt = wt - T.smash;
  rCam.position.copy(camKey(rt, 1));
  rCam.lookAt(camKey(rt, 2));
  seesaw.rotation.z = seeAngle(rt);
  // The hammer comes through the paper and lands on the high end of the seesaw.
  rgHammer.visible = rt > -0.02;
  const land = seeEnd(0.35, -1).add(new THREE.Vector3(0, 0.95, 0));
  if (rt < 0.35) rgHammer.position.copy(land.clone().add(new THREE.Vector3(0.6 * (1 - rt / 0.35), 7 * (1 - seg(rt, 0, 0.35, "power2.in")), 3 * (1 - rt / 0.35))));
  else rgHammer.position.copy(seeEnd(rt, -1).add(new THREE.Vector3(0, 0.95, 0)));
  rgHammer.rotation.set(0, 0.3, Math.PI + 0.2 + seeAngle(rt));
  marble.position.copy(marblePos(rt));
  marble.rotation.z = -rt * 9;
  rdoms.forEach((p, i) => {
    const t0 = R.dom + i * 0.11, last = i === rdoms.length - 1;
    p.rotation.z = -(last ? 1.12 : Math.asin(0.36 / 1.1)) * seg(rt, t0, t0 + (last ? 0.3 : 0.16), "power2.in");
  });
  arm.rotation.z = catAngle(rt);
  const cupW = new THREE.Vector3(CAT.x + Math.cos(catAngle(rt)) * (CAT.half - 0.2), CAT.y + Math.sin(catAngle(rt)) * (CAT.half - 0.2) + 0.5, 0);
  // The catapult throws the ball out through the lens; it leaves the machine for good.
  bigBall.visible = rt < R.fill;
  if (rt < R.cat + 0.05) bigBall.position.copy(cupW);
  else if (rt < R.fill) {
    const camAt = new THREE.Vector3(...RKEYS[10][1]).add(new THREE.Vector3(0.05, -0.02, -0.45));
    bigBall.position.copy(arc(cupW, camAt, 0.6, seg(rt, R.cat + 0.05, R.fill - 0.02, "power1.in")));
  }
  rR.render(rScene, rCam);
}

// ---------------------------------------------------------------- anchors, then render on every seek
const anchors = {};
{
  const c0 = new THREE.Vector3(DOM_X(0) - 35, 0, 0);
  dScene.updateMatrixWorld(); dCam.updateMatrixWorld(); gCam.updateMatrixWorld();
  anchors.contact = toWorld(c0, dCam, 1920, 1080, 1920, 0);
  anchors.barTops = tops.map((p) => toWorld(p, dCam, 1920, 1080, 1920, 0));
  anchors.values = F.map((f) => Math.round(f * 100));
  poseGlobe(T.legs[0]); gScene.updateMatrixWorld();
  anchors.sfo = toWorld(oneSprite.position.clone(), gCam, 1920, 1080, 3840, 0);
  poseGlobe(T.fling - 0.001); gScene.updateMatrixWorld();
  anchors.tyo = toWorld(oneSprite.position.clone(), gCam, 1920, 1080, 3840, 0);
  poseGlobe(20.1); gScene.updateMatrixWorld();
  const tr = toWorld(trail[3].position.clone(), gCam, 1920, 1080, 3840, 0);
  anchors.trail = { x: tr.x - 330, y: tr.y - 40 };
}

function renderAll(t) {
  const wt = CR.worldTime(t);
  renderFlight(wt);
  renderDominoes(wt);
  renderGlobe(wt);
  renderMachine(wt);
}
window.addEventListener("hf-seek", (e) => renderAll(e.detail.time));
renderAll(window.__hfThreeTime || 0);
window.CR3D = { anchors };
CR.ready3d();
