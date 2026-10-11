import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../anatomy-kit/kit/iso-kit.mjs";
import * as G from "../anatomy-kit/kit/lathe.mjs";
import { tubePieces, tubeSvg, crossingsOf } from "../anatomy-kit/kit/tube.mjs";
import * as A from "../anatomy-kit/kit/audit.mjs";
import { glCamera } from "../anatomy-kit/kit/gl.mjs";
import { kitScript, glScript } from "../anatomy-kit/scripts/inline-kit.mjs";
import * as M from "./model.mjs";
import { makeParts } from "./parts.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const SITE = join(HERE, "..", "..", "components", "figures", "projector");
const THEME = process.argv.includes("--dark") ? "dark" : "light";
const TAU = Math.PI * 2;

// ---- world (units of 1 mm; x along the beam, y toward the operator side, z up) ----
const W = 960;
const H = 860;
const AZIMUTH = 130;
const ELEVATION = 28;
const ZA = 500;
const AY = 27.5;
const F0 = 10;
const F1 = F0 + M.FILM.width;
const BASE = { x: -390, y: -120, w: 830, d: 290, r: 12 };
const BASE_H = 16;
const FOOT_H = 8;
const SCREEN_X = 380;
const PIC = { w: 176, h: 176 * (M.APERTURE.h / M.APERTURE.w) };
const LENS = { x0: 12, x1: 104, r: 18, pupil: 14 };
const SH = { x0: 118, x1: 120, y: AY, z: ZA - M.SHUTTER.beamOffset, r: 126, hub: 30 };

const P = k.fitProjection(
  [...k.boxCorners(BASE, -BASE_H - FOOT_H, 0), [-24, 50, 852], [-104, 10, 760], [SCREEN_X, -98, 600], [SCREEN_X, 153, 600], [-330, 85, 600], [SH.x0, 153, SH.z]],
  W,
  H,
  { pad: 28, azimuth: AZIMUTH, elevation: ELEVATION },
);
const V = G.viewOf(P);
const KS = G.scaleOf(P);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const Ln = (d, style) => k.lineSvg(d, style);
const Dots = (points, style) => k.dotsSvg(points, style);
const path3 = (points, closed = false) => k.pathOf(points.map(at), closed);

const D = {
  uid: "pj",
  frameLength: M.FRAME_LENGTH,
  win: { w: M.APERTURE.w, h: M.APERTURE.h },
  film: { y0: F0, y1: F1, pitch: M.FILM.pitch, perfW: M.FILM.perfW, perfH: M.FILM.perfH, edge: M.FILM.edge },
  blade: M.BLADE,
  crossing: M.CROSSING,
};

// The shutter's beam numbers in the model must be this drawing's beam.
{
  const t = (SH.x0 - LENS.x1) / (SCREEN_X - LENS.x1);
  const halfY = LENS.pupil + (PIC.w / 2 - LENS.pupil) * t;
  const halfZ = LENS.pupil + (PIC.h / 2 - LENS.pupil) * t;
  if (Math.abs(halfY - M.SHUTTER.beamHalfY) > 0.25 || Math.abs(halfZ - M.SHUTTER.beamHalfZ) > 0.25 || Math.abs(ZA - SH.z - M.SHUTTER.beamOffset) > 1e-9) throw new Error(`shutter beam ${halfY.toFixed(2)} × ${halfZ.toFixed(2)} ≠ model ${M.SHUTTER.beamHalfY} × ${M.SHUTTER.beamHalfZ}`);
}

// ---- explode: assemblies and their real directions off the machine ----
const PIECES = {
  shutter: { name: "shutter", say: "shutter · one turn a frame, a blade over every pull-down", move: [72, 0, 0] },
  movement: { name: "geneva movement", say: "geneva cross · a quarter turn a frame, still for the rest", move: [0, 88, 46] },
  lens: { name: "lens", say: "lens · turns the upside-down frame upright on the screen", move: [64, 0, 0] },
  gate: { name: "gate", say: "gate · pads hold the frame flat in the aperture", move: [0, 56, 0] },
  rollers: { name: "pad rollers", say: "pad rollers · keep the film on the sprocket teeth", move: [0, 46, 0] },
  lampcore: { name: "lamp", say: "xenon lamp · its mirror focuses the arc on the gate", move: [0, 0, 0] },
  lamp: { name: "lamp house", say: "lamp house · lifts off the lamp and its mirror", move: [0, 0, 205] },
  film: { name: "film path", say: "film path · steady at the sprockets, stepped at the gate", move: [0, 0, 0] },
  reels: { name: "reels", say: "reels · 90 ft of film a minute at 24 fps", move: [0, 0, 0] },
  head: { name: "Head", say: "", move: [0, 0, 0] },
  stand: { name: "Stand", say: "", move: [0, 0, 0] },
};
const STAGGER = ["shutter", "movement", "lens", "gate", "rollers", "lamp", "lampcore", "film", "reels", "head", "stand"];
const SPRING = { stagger: 0.04, stiffness: 64, damping: 14.2, substeps: 4 };
const ORDER = ["lamp", "gate", "film", "movement", "shutter", "lens", "rollers", "reels"];

const R = A.recorder(P, { order: STAGGER, spring: SPRING });
const record = R.solid;
function put(piece, name, ref, svg, shapes = [], { bias = 0, attrs = "", key } = {}) {
  return R.put({ piece, name: R.nameFor(name), at: ref, bias, svg, shapes, move: PIECES[piece].move, attrs, ...(key !== undefined ? { key } : {}) });
}

const PARTS = makeParts(k, G, P, D);
// The drawing rests half a frame in: the cross locked, the pin across from it.
const REST_C = 0.5;
const REST_I = M.intermittentOf(REST_C);
const { planeMatrix } = PARTS;

// Frames: FY turns about y (s = y), FX about x (s = x), FZ about z.
const FY = (x, z) => G.frameOf([x, 0, z], [0, 1, 0], [1, 0, 0], [0, 0, 1]);
const FX = (y, z) => G.frameOf([0, y, z], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
const FZ = (x, y) => G.frameOf([x, y, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0]);
const PRISM_Y = G.frameOf([0, 0, 0], [0, 1, 0], [1, 0, 0], [0, 0, 1]);

function box(piece, name, [x0, y0, z0], [x1, y1, z1], style = {}, { r = 0.8, steps = 3, bevel = 0.4, extra = "", inner = "", bias = 0, ground = false } = {}) {
  const plan = { x: x0, y: y0, w: x1 - x0, d: y1 - y0, r };
  const shape = record(A.slab(plan, z0, z1 - z0, { name, ground }, steps));
  put(piece, name, [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], S(k.slabOf(plan, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style, inner }) + extra, [shape], { bias });
  return shape;
}
function disc(piece, name, F, s0, s1, r, style = {}, { extra = "", inner = "", bias = 0, steps, bevel = 0, attrs = "" } = {}) {
  const shape = record(A.disc(F, s0, s1, r, { name }));
  const body = S(G.disc(s0, s1, r, F, P, { ...(steps ? { steps } : {}), bevel }), { tone: "mid", ...style, inner });
  put(piece, name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), body + extra, [shape], { bias, attrs });
  return shape;
}
function turned(piece, name, F, profile, style = {}, { extra = "", inner = "", bias = 0, smooth } = {}) {
  const paths = G.solidOf(profile, F, P, smooth !== undefined ? { smooth } : {});
  const shape = record(A.solid(F, profile, { name }));
  const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
  put(piece, name, G.add3(F.o, G.mul3(F.a, mid)), S(paths, { tone: "mid", ...style, inner }) + extra, [shape], { bias });
  return shape;
}
function prismY(piece, name, polygon, y0, y1, style = {}, { extra = "", bias = 0 } = {}) {
  const shape = record(A.prism(PRISM_Y, polygon, y0, y1, { name }));
  const cx = polygon.reduce((a, p) => a + p[0], 0) / polygon.length;
  const cz = polygon.reduce((a, p) => a + p[1], 0) / polygon.length;
  put(piece, name, [cx, (y0 + y1) / 2, cz], S(G.prismOf(PRISM_Y, polygon, y0, y1, P), { tone: "mid", ...style }) + extra, [shape], { bias });
  return shape;
}
// A flat link between two pins, as the hull of two circles in the x–z plane.
function linkPolygon(a, b, r, n = 14) {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = ang + Math.PI / 2 + (i / n) * Math.PI;
    pts.push([a[0] + r * Math.cos(t), a[1] + r * Math.sin(t)]);
  }
  for (let i = 0; i <= n; i++) {
    const t = ang - Math.PI / 2 + (i / n) * Math.PI;
    pts.push([b[0] + r * Math.cos(t), b[1] + r * Math.sin(t)]);
  }
  return pts;
}
const screwOn = (F, s, r, n, style = { size: 0.5, tone: "mid" }) => Dots(G.dotsOf(F, s, r, n, P, { all: true }), style);
const faceRing = (F, s, r) => Ln(G.circleOf(F, s, r, P, 48), { tone: "faint" });

// ================================================================== stand: base and pedestal
const back = [];
back.push(`<path class="iso-halo" d="${k.haloOf(BASE, -BASE_H - FOOT_H, BASE_H, P)}"/>`);
const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
for (const [x, y] of byDepth(k.corners(BASE, 26))) {
  back.push(S(k.cylinder(x, y, 9, -BASE_H - FOOT_H, 2, P, 32), { tone: "lo" }));
  back.push(S(k.cylinder(x, y, 7, -BASE_H - FOOT_H + 2, FOOT_H - 2, P, 32), { tone: "mid" }));
}
back.push(S(k.slabOf(BASE, -BASE_H, BASE_H, P, 8, 1.6), { tone: "mid", inner: Ln(k.sideSeam(BASE, -6, P, 8), { tone: "faint" }) }));
back.push(Ln(k.planOutline(k.insetPlan(BASE, 6), 0, P), { tone: "lo" }));
const baseScrews = k.corners(BASE, 12);
back.push(Ln(baseScrews.map(([x, y]) => k.ring(x, y, 2.4, 0, P, 16)).join(""), { tone: "lo" }));
back.push(Dots(baseScrews.map(([x, y]) => at([x, y, 0])), { size: 0.55 }));
record(A.slab(BASE, -BASE_H, BASE_H, { name: "stand.base", ground: true }, 8));
{
  const STRIP = { x: BASE.x + 40, y: BASE.y + BASE.d - 16, w: 640, d: 7, r: 1 };
  back.push(S(k.slabOf(STRIP, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const t = k.topTicks(STRIP.x + 4, STRIP.x + STRIP.w - 4, 5, 5, STRIP.y, 0.6, [2, 3.8], P);
  back.push(Ln(t.minor, { tone: "lo" }), Ln(t.major, { tone: "mid" }));
  const LABEL = { x: 250, y: BASE.y + BASE.d - 44, w: 54, d: 20, r: 1.4 };
  back.push(S(k.slabOf(LABEL, 0, 0.8, P, 3), { tone: "lo", crease: "none" }));
  back.push(Ln(k.planOutline(k.insetPlan(LABEL, 1.8), 0.8, P, 3), { tone: "faint" }));
  back.push(Ln([34, 24, 29].map((w, i) => k.lineOnTop([LABEL.x + 6, LABEL.y + 5 + i * 4.6], [LABEL.x + 6 + w, LABEL.y + 5 + i * 4.6], 0.8, P)).join(""), { tone: "lo", free: true }));
  back.push(Dots([at([LABEL.x + LABEL.w - 3.4, LABEL.y + 3.4, 0.8]), at([LABEL.x + LABEL.w - 3.4, LABEL.y + LABEL.d - 3.4, 0.8])], { size: 0.45 }));
}

// ---- screen: two uprights on feet, a frame, black masking and the surface ----
const SCR = { y0: -98, y1: 153, z0: 410, z1: 590 };
const screenBack = [];
for (const y of [SCR.y0 - 8, SCR.y1 + 8]) {
  screenBack.push({ d: G.dot3([SCREEN_X + 4, y, 0], V), svg: S(k.slabOf({ x: SCREEN_X - 22, y: y - 9, w: 52, d: 18, r: 3 }, 0, 5, P, 3, 0.4), { tone: "lo" }) });
  screenBack.push({ d: G.dot3([SCREEN_X + 4, y, 100], V), svg: S(k.cylinder(SCREEN_X + 4, y, 4.5, 5, SCR.z1 + 6 - 5, P, 24), { tone: "mid" }) + Ln(k.sideArc(SCREEN_X + 4, y, 4.5, 300, P, 16), { tone: "faint" }) });
  screenBack.push({ d: G.dot3([SCREEN_X + 4, y, SCR.z1 + 7], V) + 0.1, svg: S(k.cylinder(SCREEN_X + 4, y, 5.5, SCR.z1 + 6, 3, P, 24, 0.3), { tone: "mid" }) });
  for (const z of [SCR.z0 + 20, SCR.z1 - 20]) screenBack.push({ d: G.dot3([SCREEN_X + 4, y, z], V) + 0.2, svg: S(k.cylinder(SCREEN_X + 4, y, 6, z - 4, 8, P, 24, 0.3), { tone: "hi" }) });
  record(A.slab({ x: SCREEN_X - 22, y: y - 9, w: 52, d: 18, r: 3 }, 0, 5, { name: "stand.screen.foot" }, 3));
  record(A.cylinder(SCREEN_X + 4, y, 4.5, 5, SCR.z1 + 1, { name: "stand.screen.upright" }));
}
const frameSlab = { x: SCREEN_X, y: SCR.y0, w: 8, d: SCR.y1 - SCR.y0, r: 1.2 };
screenBack.push({ d: G.dot3([SCREEN_X + 4, AY, (SCR.z0 + SCR.z1) / 2], V), svg: S(k.slabOf(frameSlab, SCR.z0, SCR.z1 - SCR.z0, P, 3, 0.6), { tone: "mid" }) });
for (const y of [SCR.y0, SCR.y1]) screenBack.push({ d: G.dot3([SCREEN_X + 4, y, 500], V) + 0.3, svg: S(k.slabOf({ x: SCREEN_X + 1, y: y + (y < 0 ? -4.2 : 0), w: 6, d: 4.2, r: 0.6 }, SCR.z0 + 14, 12, P, 2), { tone: "lo" }) + S(k.slabOf({ x: SCREEN_X + 1, y: y + (y < 0 ? -4.2 : 0), w: 6, d: 4.2, r: 0.6 }, SCR.z1 - 26, 12, P, 2), { tone: "lo" }) });
record(A.slab(frameSlab, SCR.z0, SCR.z1 - SCR.z0, { name: "stand.screen.frame" }, 3));
screenBack.sort((a, b) => a.d - b.d);
back.push(...screenBack.map((entry) => entry.svg));
// The picture face, as the camera sees it: u along +y, v down (−z); the build checks it is not mirrored.
const FACE_U = [0, 1, 0];
{
  const o = at([SCREEN_X, AY, ZA]);
  const u = at(G.add3([SCREEN_X, AY, ZA], FACE_U));
  const v = at([SCREEN_X, AY, ZA - 1]);
  if ((u[0] - o[0]) * (v[1] - o[1]) - (u[1] - o[1]) * (v[0] - o[0]) <= 0) throw new Error("the screen's face plane mirrors the picture");
}
const SCREEN_M = planeMatrix([SCREEN_X - 0.05, AY, ZA], FACE_U, [0, 0, -1]);
const maskW = SCR.y1 - SCR.y0 - 12;
const maskH = SCR.z1 - SCR.z0 - 12;
back.push(
  `<g class="pj-screen" transform="${SCREEN_M}"><rect class="pj-mask" x="${(-maskW / 2).toFixed(1)}" y="${(-maskH / 2).toFixed(1)}" width="${maskW.toFixed(1)}" height="${maskH.toFixed(1)}" rx="1.5"/><rect class="pj-surface" x="${(-PIC.w / 2 - 4).toFixed(1)}" y="${(-PIC.h / 2 - 4).toFixed(1)}" width="${(PIC.w + 8).toFixed(1)}" height="${(PIC.h + 8).toFixed(1)}"/><g class="pj-picture" data-part="picture">${PARTS.leaderSvg(M.leaderAt(Math.floor(REST_I)), PIC.w, PIC.h)}</g><rect class="pj-picture-edge" x="${(-PIC.w / 2).toFixed(1)}" y="${(-PIC.h / 2).toFixed(1)}" width="${PIC.w.toFixed(1)}" height="${PIC.h.toFixed(1)}"/><rect class="pj-surface-edge" x="${(-PIC.w / 2 - 4).toFixed(1)}" y="${(-PIC.h / 2 - 4).toFixed(1)}" width="${(PIC.w + 8).toFixed(1)}" height="${(PIC.h + 8).toFixed(1)}"/></g>`,
);

// The beam is nearer the viewer than the screen's frame and posts, so it lies over them and
// ends on the stroked edge of the picture it makes.
{
  const pupil = Array.from({ length: 48 }, (_, n) => at([LENS.x1, AY + LENS.pupil * Math.cos((n / 48) * TAU), ZA + LENS.pupil * Math.sin((n / 48) * TAU)]));
  const corners = [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([sy, sz]) => [SCREEN_X - 0.1, AY + (sy * PIC.w) / 2, ZA + (sz * PIC.h) / 2]);
  const ends = corners.map(at);
  const hull = G.hullOf([...pupil, ...ends]);
  const isEnd = (p) => ends.some((q) => Math.hypot(p[0] - q[0], p[1] - q[1]) < 1e-6);
  const edges = hull.flatMap((p, n) => {
    const q = hull[(n + 1) % hull.length];
    return isEnd(p) !== isEnd(q) ? [k.pathOf([p, q])] : [];
  });
  if (edges.length !== 2) throw new Error(`the beam's outline should have 2 lens-to-picture edges, found ${edges.length}`);
  back.push(`<g class="pj-light-beam" data-part="light-beam"><path class="pj-beam-fill" d="${k.pathOf(hull, true)}"/><path class="iso-line pj-beam-edge" data-tone="faint" d="${edges.join("")}"/></g>`);
}

// ---- pedestal ----
box("stand", "stand.pedestal.foot", [-112, -106, 0], [64, 12, 8], { tone: "lo" }, { r: 6, steps: 6, bevel: 0.8, extra: Dots([[-104, -98], [56, -98], [-104, 4], [56, 4]].map(([x, y]) => at([x, y, 8])), { size: 0.55 }) });
box("stand", "stand.pedestal.column", [-80, -90, 8], [32, -14, 300], { tone: "mid" }, { r: 8, steps: 8, bevel: 1, inner: Ln(k.sideSeam({ x: -80, y: -90, w: 112, d: 76, r: 8 }, 40, P, 8) + k.sideSeam({ x: -80, y: -90, w: 112, d: 76, r: 8 }, 270, P, 8), { tone: "faint" }) });
box("stand", "stand.pedestal.saddle", [-100, -96, 300], [60, 0, 316], { tone: "lo" }, { r: 3, steps: 3, bevel: 0.6, extra: Dots([[-94, -4], [54, -4]].map(([x, y]) => at([x, y, 316])), { size: 0.5 }) });
{
  const KF = FY(-20, 308);
  disc("stand", "stand.tilt.knob", KF, 0, 6, 6, { tone: "hi" }, { extra: Ln(k.pathOf([at([-23.5, 6.05, 308]), at([-16.5, 6.05, 308])]), { tone: "lo", free: true }) + k.fadedSvg(G.ribsOf(KF, 0, 6, 6, 28, P, { fade: [0.1, 0.55], seams: true }), { tone: "lo" }) });
}

{
  const door = { y0: -80, y1: -24, z0: 70, z1: 250 };
  box("stand", "stand.pedestal.door", [-82.4, door.y0, door.z0], [-80, door.y1, door.z1], { tone: "mid" }, { r: 2, steps: 3, bevel: 0.4, extra: Dots([[door.y0 + 5, door.z0 + 5], [door.y1 - 5, door.z0 + 5], [door.y0 + 5, door.z1 - 5], [door.y1 - 5, door.z1 - 5]].map(([y, z]) => at([-82.42, y, z])), { size: 0.5 }) });
  disc("stand", "stand.pedestal.door.handle", G.frameAlong([-82.4, -52, 170], [-1, 0, 0]), 0, 5, 2.6, { tone: "mid" });
  put("stand", "stand.pedestal.door.vents", [-82.42, -52, 222], Ln(Array.from({ length: 4 }, (_, i) => path3([[-82.42, -68, 212 + i * 7], [-82.42, -36, 212 + i * 7], [-82.42, -36, 215 + i * 7], [-82.42, -68, 215 + i * 7]], true)).join(""), { tone: "lo" }), [record(A.box([-82.5, -68, 212], [-82.4, -36, 236], { name: "stand.pedestal.door.vents" }))], { bias: 0.05 });
}

// ================================================================== head
box("head", "head.body", [-90, -84, 316], [58, -12, 640], { tone: "mid" }, { r: 6, steps: 6, bevel: 0.8, inner: Ln(k.sideSeam({ x: -90, y: -84, w: 148, d: 72, r: 6 }, 600, P, 6), { tone: "faint" }) });
const plateScrews = [[-90, 324], [58, 324], [-90, 632], [58, 632], [-16, 324], [-16, 632]];
box("head", "head.plate", [-96, -12, 316], [64, 0, 640], { tone: "mid" }, { r: 3, steps: 3, bevel: 0.6 });
put("head", "head.plate.screws", [-16, 0.05, 478], Dots(plateScrews.map(([x, z]) => at([x, 0.05, z])), { size: 0.55, tone: "mid" }) + Ln(plateScrews.map(([x, z]) => G.circleOf(FY(x, z), 0.05, 2.3, P, 16)).join(""), { tone: "lo" }), [record(A.box([-96, 0, 316], [64, 0.05, 640], { name: "head.plate.screws" }))], { bias: 0.05 });

// sprockets: boss on the plate, the toothed drum, a hub cap
const SPROCKETS = {
  feed: { x: -52, z: 612, r: M.FEED.root / 2, teeth: M.FEED.teeth },
  inter: { x: -M.INTERMITTENT.root / 2, z: 430, r: M.INTERMITTENT.root / 2, teeth: M.INTERMITTENT.teeth },
  hold: { x: -30, z: 350, r: M.FEED.root / 2, teeth: M.FEED.teeth },
};
const DRUM = { y0: AY - 15.3, y1: AY + 15.3 };
for (const [id, s] of Object.entries(SPROCKETS)) {
  const F = FY(s.x, s.z);
  s.toothY = DRUM.y1;
  disc("head", `head.boss.${id}`, F, 0, DRUM.y0, Math.max(8, s.r * 0.62), { tone: "lo" }, { extra: faceRing(F, DRUM.y0, Math.max(8, s.r * 0.62) - 1.6) });
  const turn = id === "inter" ? -(REST_I * M.FRAME_LENGTH) / s.r : (REST_C * M.FRAME_LENGTH) / s.r;
  const teeth = `<g data-part="teeth-${id}">${PARTS.teethSvg(s, (-turn * 180) / Math.PI)}</g>`;
  disc("head", `head.sprocket.${id}`, F, DRUM.y0, DRUM.y1, s.r, { tone: "hi" }, { inner: Ln(G.arcOf(F, DRUM.y0 + 3.4, s.r, P) + G.arcOf(F, DRUM.y1 - 3.4, s.r, P), { tone: "faint" }), extra: teeth + faceRing(F, DRUM.y1, s.r - 2.2) });
  const capR = id === "inter" ? 4.2 : 5.6;
  const capTo = id === "inter" ? F1 + 2 : F1 + 3;
  disc("head", `head.hub.${id}`, F, DRUM.y1, capTo, capR, { tone: "mid" }, { extra: screwOn(F, capTo, capR * 0.55, 3) });
}

// gate: aperture plate on the lamp side, the film, the pressure door on the lens side
const GATE = { z0: 466, z1: 534 };
const WIN = { w: M.APERTURE.w, h: M.APERTURE.h };
const AP = { x0: -5, x1: -0.15 };
{
  const shape = record(A.slab({ x: AP.x0, y: 0, w: AP.x1 - AP.x0, d: 52, r: 0.6 }, GATE.z0, GATE.z1 - GATE.z0, { name: "head.aperture" }, 2));
  // The plate's lamp-side face with the aperture cut in it, and the window's walls.
  const faceM = planeMatrix([AP.x0 - 0.02, AY, ZA], FACE_U, [0, 0, -1]);
  const winRect = `M${(-WIN.w / 2).toFixed(2)} ${(-WIN.h / 2).toFixed(2)}H${(WIN.w / 2).toFixed(2)}V${(WIN.h / 2).toFixed(2)}H${(-WIN.w / 2).toFixed(2)}Z`;
  const walls = [];
  const corner = (u, v, x) => [x, AY + u, ZA - v];
  const edges = [
    [[-WIN.w / 2, -WIN.h / 2], [WIN.w / 2, -WIN.h / 2], [0, 0, -1]],
    [[WIN.w / 2, -WIN.h / 2], [WIN.w / 2, WIN.h / 2], [0, -1, 0]],
    [[WIN.w / 2, WIN.h / 2], [-WIN.w / 2, WIN.h / 2], [0, 0, 1]],
    [[-WIN.w / 2, WIN.h / 2], [-WIN.w / 2, -WIN.h / 2], [0, 1, 0]],
  ];
  for (const [a, b, n] of edges) {
    if (G.dot3(n, V) <= 0) continue;
    walls.push(`<path class="iso-shade" data-shade="${Math.min(3, G.toneOf(n, P))}" d="${path3([corner(a[0], a[1], AP.x0), corner(b[0], b[1], AP.x0), corner(b[0], b[1], AP.x1), corner(a[0], a[1], AP.x1)], true)}"/>`);
  }
  const filmM = planeMatrix([0 - 0.1, AY, ZA], FACE_U, [0, 0, -1]);
  const winClip = path3([corner(-WIN.w / 2, -WIN.h / 2, AP.x0), corner(WIN.w / 2, -WIN.h / 2, AP.x0), corner(WIN.w / 2, WIN.h / 2, AP.x0), corner(-WIN.w / 2, WIN.h / 2, AP.x0)], true);
  const backClip = path3([corner(-WIN.w / 2, -WIN.h / 2, -0.1), corner(WIN.w / 2, -WIN.h / 2, -0.1), corner(WIN.w / 2, WIN.h / 2, -0.1), corner(-WIN.w / 2, WIN.h / 2, -0.1)], true);
  const win = `<clipPath id="pj-win"><path d="${winClip}"/></clipPath><clipPath id="pj-win-back"><path d="${backClip}"/></clipPath><g clip-path="url(#pj-win)"><g clip-path="url(#pj-win-back)"><g transform="${filmM}"><g class="pj-gate-frame" data-part="gate-frame">${PARTS.gateFrameSvg(REST_I, M.leaderAt)}</g></g></g>${walls.join("")}</g>`;
  const plate = S(k.slabOf({ x: AP.x0, y: 0, w: AP.x1 - AP.x0, d: 52, r: 0.6 }, GATE.z0, GATE.z1 - GATE.z0, P, 2, 0.3), { tone: "mid" });
  const cut = `<g transform="${faceM}"><path class="iso-line" data-tone="lo" d="${winRect}"/><path class="iso-line" data-tone="faint" d="M${(-WIN.w / 2 - 3).toFixed(2)} ${(-WIN.h / 2 - 3).toFixed(2)}H${(WIN.w / 2 + 3).toFixed(2)}V${(WIN.h / 2 + 3).toFixed(2)}H${(-WIN.w / 2 - 3).toFixed(2)}Z"/></g>`;
  const screws = Dots([[6, GATE.z0 + 5], [46, GATE.z0 + 5], [6, GATE.z1 - 5], [46, GATE.z1 - 5]].map(([y, z]) => at([AP.x0 - 0.02, y, z])), { size: 0.5 });
  put("head", "head.aperture", [AP.x0, 26, ZA], plate + `<path class="pj-void" d="${winClip}"/>` + win + cut + screws, [shape], { bias: 0.4 });
}
box("gate", "gate.door", [0.0, 6, GATE.z0 + 4], [9, F1 + 6, GATE.z1 - 4], { tone: "mid" }, { r: 0.8, steps: 2, bevel: 0.3 });
{
  const KF = FY(4.5, ZA + 22);
  disc("gate", "gate.latch", KF, F1 + 6, F1 + 10, 3.4, { tone: "hi" }, { extra: k.fadedSvg(G.ribsOf(KF, F1 + 6, F1 + 10, 3.4, 18, P, { fade: [0.1, 0.55], seams: true }), { tone: "lo" }) });
  disc("gate", "gate.hinge", FY(4.5, ZA - 30), F1 + 6, F1 + 8.4, 2.2, { tone: "lo" });
}

// lens: holder collar on a bracket, barrel with a knurled focus ring
{
  const LF = FX(AY, ZA);
  box("head", "head.lens.bracket", [24, 0, ZA - 10], [38, AY - 24 + 0.0, ZA + 10], { tone: "lo" }, { r: 0.6, steps: 2 });
  const collar = record(A.ring(LF, 24, 38, LENS.r, 24, { name: "lens.collar" }));
  put("lens", "lens.collar", [31, AY, ZA], S(G.ringBand(24, 38, LENS.r, 24, LF, P), { tone: "mid" }) + screwOn(LF, 24, 21, 6), [collar], { bias: 0.3 });
  const knurl = k.fadedSvg(G.ribsOf(LF, 62, 78, LENS.r + 1.2, 64, P, { fade: [0.1, 0.55], seams: true }), { tone: "lo" });
  turned("lens", "lens.mount", LF, [[LENS.x0, LENS.r], [24, LENS.r]], { tone: "mid" }, { inner: Ln(G.arcOf(LF, 18, LENS.r, P), { tone: "faint" }) });
  turned("lens", "lens.barrel", LF, [[38, LENS.r], [62, LENS.r], [62, LENS.r + 1.2], [78, LENS.r + 1.2], [78, LENS.r], [96, LENS.r], [96, LENS.r + 0.6], [LENS.x1, LENS.r + 0.6]], { tone: "mid" }, { extra: knurl, inner: Ln(G.arcOf(LF, 50, LENS.r, P) + G.arcOf(LF, 88, LENS.r, P), { tone: "faint" }) });
}

// gearbox, the shaft out to the shutter, the driver shaft out to the movement
const GB = { x0: 14, x1: 62, y0: 0, y1: 52, z0: 388, z1: 458 };
box("head", "head.gearbox", [GB.x0, GB.y0, GB.z0], [GB.x1, GB.y1, GB.z1], { tone: "mid" }, { r: 3, steps: 3, bevel: 0.6, inner: Ln(k.sideSeam({ x: GB.x0, y: GB.y0, w: GB.x1 - GB.x0, d: GB.y1 - GB.y0, r: 3 }, GB.z1 - 8, P, 3), { tone: "faint" }), extra: Dots([[GB.x0 + 4, GB.y1 - 4], [GB.x1 - 4, GB.y1 - 4], [GB.x0 + 4, 6], [GB.x1 - 4, 6]].map(([x, y]) => at([x, y, GB.z1])), { size: 0.5 }) });
{
  const glass = FY(50, 404);
  disc("head", "head.gearbox.sightglass", glass, GB.y1, GB.y1 + 1.6, 4.2, { tone: "lo" }, { extra: faceRing(glass, GB.y1 + 1.6, 2.6) });
  disc("head", "head.gearbox.filler", FZ(24, 14), GB.z1, GB.z1 + 3, 3.2, { tone: "hi" }, { extra: Ln(k.lineOnTop([21.6, 14], [26.4, 14], GB.z1 + 3, P), { tone: "lo", free: true }) });
}
const GW = { a: 28, slot: 7.2, hub: 4.2, pin: 3.2, clear: 0.4, relief: 12, reliefAt: 1.0 };
GW.c = GW.a * Math.SQRT2;
GW.lock = GW.a - GW.slot / 2;
GW.rim = GW.a;
GW.slotAt = Math.PI / 4;
GW.x = SPROCKETS.inter.x;
GW.z = SPROCKETS.inter.z;
GW.dx = GW.x + GW.c;
GW.y0 = 76;
GW.y1 = 80;
GW.dy0 = 70;
D.geneva = GW;
{
  const SF = FY(GW.x, GW.z);
  disc("head", "head.shaft.inter", SF, F1 + 2, GW.y0, 3.5, { tone: "mid" });
  const DF = FY(GW.dx, GW.z);
  disc("head", "head.shaft.driver.seal", DF, GB.y1, GB.y1 + 1.4, 6, { tone: "lo" });
  disc("head", "head.shaft.driver", DF, GB.y1 + 1.4, GW.dy0, 3.5, { tone: "mid" });
  const XF = FX(AY, SH.z);
  disc("head", "head.shaft.shutter.seal", XF, GB.x1, GB.x1 + 1.4, 6.5, { tone: "lo" });
  disc("head", "head.shaft.shutter", XF, GB.x1 + 1.4, 100, 3.5, { tone: "mid" });
  disc("head", "head.pulley.shutter", XF, 100, 108, 12, { tone: "mid" }, { inner: Ln(G.arcOf(XF, 104, 12, P), { tone: "lo" }), extra: screwOn(XF, 100, 8, 4) });
  disc("head", "head.shaft.shutter.end", XF, 108, SH.x0 - 1.4, 3.5, { tone: "mid" });
}
// the movement: crank and locking disc on the driver, the Geneva wheel, the outboard bridge
{
  const REST = (3 * Math.PI) / 4 + TAU * REST_C;
  const world = (pts, cx, cz) => pts.map(([x, z]) => [cx + x, cz + z]);
  const pinAt = [GW.dx + GW.a * Math.cos(REST), GW.z + GW.a * Math.sin(REST)];
  put("movement", "movement.crank", [GW.dx, GW.dy0 + 1.5, GW.z], `<g data-part="crank">${PARTS.plateSvg(PARTS.crankDef(), -360 * REST_C)}</g>`, [record(A.disc(FY(GW.dx, GW.z), GW.dy0, GW.dy0 + 3, GW.a + 5, { name: "movement.crank" }))]);
  put("movement", "movement.lock", [GW.dx, (GW.dy0 + 3 + GW.y1) / 2, GW.z], `<g data-part="lock">${PARTS.plateSvg(PARTS.lockDef(), -360 * REST_C)}</g>`, [record(A.prism(PRISM_Y, world(PARTS.lockContour(REST), GW.dx, GW.z), GW.dy0 + 3, GW.y1, { name: "movement.lock" }))]);
  put("movement", "movement.cross", [GW.x, (GW.y0 + GW.y1) / 2, GW.z], `<g data-part="cross">${PARTS.plateSvg(PARTS.crossDef(), 90 * REST_I)}</g>`, [record(A.prism(PRISM_Y, PARTS.crossContour(-(Math.PI / 2) * REST_I).map(([u, v]) => [GW.x + u, GW.z - v]), GW.y0, GW.y1, { name: "movement.cross" }))]);
  put("movement", "movement.pin", [pinAt[0], (GW.dy0 + 3 + GW.y1 + 1.2) / 2, pinAt[1]], `<g data-part="pin" transform="${PARTS.pinShift(REST)}">${PARTS.pinSvg()}</g>`, [record(A.disc(FY(pinAt[0], pinAt[1]), GW.dy0 + 3, GW.y1 + 1.2, GW.pin, { name: "movement.pin" }))], { bias: 0.3 });
}

// shutter: two blades on the shaft in front of the lens
D.shutter = SH;
put("shutter", "shutter.disc", [(SH.x0 + SH.x1) / 2, SH.y, SH.z], `<g data-part="shutter">${PARTS.shutterDefs(2).map((def) => PARTS.plateSvg(def, 360 * (REST_C - 0.125))).join("")}</g>`, [record(A.disc(FX(SH.y, SH.z), SH.x0 - 1.4, SH.x1, SH.r, { name: "shutter.disc" }))]);

// motor below the gearbox, belted to the shutter shaft
{
  const MY = 32;
  const MZ = 350;
  const MF = FX(MY, MZ);
  const ribs = k.fadedSvg(G.ribsOf(MF, 30, 76, 30, 40, P, { fade: [0.1, 0.55], seams: true }), { tone: "lo" });
  turned("head", "head.motor", MF, [[14, 0], [14, 22], [16, 26, 1], [22, 26], [22, 30], [84, 30], [84, 26], [90, 22, 1], [92, 14], [92, 0]], { tone: "mid" }, { extra: ribs });
  // Rear face: a fan cover of closed slots round a small reduction box for the hand crank,
  // which turns once every eight frames (two turns a second at 16 fps).
  const grille = FX(MY, MZ);
  const slots = Array.from({ length: 12 }, (_, n) => {
    const a = (n / 12) * TAU;
    const pts = [];
    for (let j = 0; j <= 6; j++) pts.push([14.5 + 6.5 * (j / 6), -0.9]);
    for (let j = 6; j >= 0; j--) pts.push([14.5 + 6.5 * (j / 6), 0.9]);
    return k.pathOf(pts.map(([r, w]) => at([13.95, MY + r * Math.cos(a) - w * Math.sin(a), MZ + r * Math.sin(a) + w * Math.cos(a)])), true);
  }).join("");
  put("head", "head.motor.grille", [13.9, MY, MZ], Ln(slots + G.circleOf(grille, 13.95, 22.5, P, 64), { tone: "lo" }), [record(A.disc(grille, 13.8, 14, 23, { name: "head.motor.grille" }))], { bias: 0.1 });
  const HC = { o: [2, MY, MZ], arm: 24, t: 2.4 };
  D.handCrank = HC;
  D.crankRatio = 1 / 8;
  const boxF = G.frameAlong([14, MY, MZ], [-1, 0, 0]);
  disc("head", "head.crank.box", boxF, 0, 8, 12.5, { tone: "mid" }, { bevel: 0.4, extra: Dots(G.dotsOf(boxF, 8, 10, 4, P, { all: true }), { size: 0.5 }) });
  disc("head", "head.crank.shaft", G.frameAlong([6, MY, MZ], [-1, 0, 0]), 0, 1.6, 3, { tone: "lo" });
  const armDef = PARTS.handCrankDef();
  put("head", "head.crank.arm", [HC.o[0] + 1, MY + HC.arm / 2, MZ], `<g data-part="handcrank">${PARTS.plateSvg(armDef, 0)}</g>`, [record(A.prism(G.frameOf([0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]), armDef.contours[0].map(([u, v]) => [MY + u, MZ - v]), HC.o[0], HC.o[0] + HC.t, { name: "head.crank.arm" }))]);
  put("head", "head.crank.handle", [HC.o[0] - 6, MY + HC.arm, MZ], `<g data-part="handle">${PARTS.handleSvg()}</g>`, [record(A.disc(G.frameAlong([HC.o[0], MY + HC.arm, MZ], [-1, 0, 0]), 0, 16, 3.6, { name: "head.crank.handle" }))], { bias: 0.2 });
  disc("head", "head.motor.shaft", MF, 92, 100, 3, { tone: "mid" });
  disc("head", "head.pulley.motor", MF, 100, 108, 7, { tone: "mid" }, { inner: Ln(G.arcOf(MF, 104, 7, P), { tone: "lo" }) });
  box("head", "head.motor.foot", [26, 0, MZ - 10], [80, 2, MZ + 10], { tone: "lo" }, { r: 0.6, steps: 2 });
  box("head", "head.motor.terminal", [24, MY - 8, MZ + 30], [40, MY + 8, MZ + 38], { tone: "lo" }, { r: 1, steps: 2, extra: Dots([at([28, MY + 8, MZ + 34]), at([36, MY + 8, MZ + 34])], { size: 0.45 }) });
  // the belt: one closed loop over both pulleys in the plane x = 104
  const belt = [];
  const top = { y: AY, z: SH.z, r: 12.6 };
  const bot = { y: MY, z: MZ, r: 7.6 };
  const tan = PARTS.tangent({ c: [top.y, top.z], r: top.r, sense: 1 }, { c: [bot.y, bot.z], r: bot.r, sense: 1 });
  const tan2 = PARTS.tangent({ c: [bot.y, bot.z], r: bot.r, sense: 1 }, { c: [top.y, top.z], r: top.r, sense: 1 });
  const a1 = PARTS.arc({ c: [top.y, top.z], r: top.r, sense: 1 }, PARTS.angleOf([top.y, top.z], tan2.pb), PARTS.angleOf([top.y, top.z], tan.pa), 1.2);
  const a2 = PARTS.arc({ c: [bot.y, bot.z], r: bot.r, sense: 1 }, PARTS.angleOf([bot.y, bot.z], tan.pb), PARTS.angleOf([bot.y, bot.z], tan2.pa), 1.2);
  for (const [y, z] of [...a1, ...PARTS.straight(tan.pa, tan.pb, 2).slice(1), ...a2.slice(1), ...PARTS.straight(tan2.pa, tan2.pb, 2).slice(1, -1)]) belt.push([104, y, z]);
  R.route("head.belt", belt, 0.6, { closed: true, limp: true, touch: ["head.pulley.*"], piece: "head", move: [0, 0, 0] });
  tubePieces(belt, 0.6, P, { closed: true, maxLength: 14, spacing: 0.8 }).forEach((piece, index) => put("head", `head.belt:${index}`, piece.mid, tubeSvg(piece, { tone: "mid" }), [A.tube(piece.points, piece.radii)], { bias: 0.15 }));
}

// ---- the head's own fittings: name plate, framing knob, oil cups, inspection door ----
{
  const plate = { x0: -92, x1: -62, z0: 552, z1: 570 };
  box("head", "head.nameplate", [plate.x0, 0, plate.z0], [plate.x1, 0.8, plate.z1], { tone: "lo" }, { r: 0.6, steps: 2, bevel: 0 });
  const rules = [24, 17, 21].map((w, i) => path3([[plate.x0 + 4, 0.82, plate.z1 - 5 - i * 4], [plate.x0 + 4 + w, 0.82, plate.z1 - 5 - i * 4]])).join("");
  put("head", "head.nameplate.rules", [plate.x0 + 14, 0.85, plate.z0 + 9], Ln(rules, { tone: "lo", free: true }) + Dots([at([plate.x1 - 2.6, 0.82, plate.z0 + 2.6]), at([plate.x1 - 2.6, 0.82, plate.z1 - 2.6])], { size: 0.45 }), [record(A.box([plate.x0, 0.8, plate.z0], [plate.x1, 0.85, plate.z1], { name: "head.nameplate.rules" }))], { bias: 0.05 });
  const KF = FY(-80, 470);
  disc("head", "head.framing.boss", KF, 0, 3, 6.5, { tone: "lo" });
  disc("head", "head.framing.knob", KF, 3, 10, 8, { tone: "hi" }, { extra: k.fadedSvg(G.ribsOf(KF, 3, 10, 8, 32, P, { fade: [0.1, 0.55], seams: true }), { tone: "lo" }) + Ln(path3([[-80, 10.05, 466], [-80, 10.05, 474]]), { tone: "lo", free: true }) });
  for (const [x, y] of [[-70, -48], [36, -48]]) {
    const OF = FZ(x, y);
    disc("head", "head.oilcup", OF, 640, 647, 3.2, { tone: "mid" });
    disc("head", "head.oilcup.lid", OF, 647, 649, 4, { tone: "hi" }, { bevel: 0.3 });
  }
  const door = { y0: -76, y1: -20, z0: 380, z1: 600 };
  box("head", "head.door", [-92.4, door.y0, door.z0], [-90, door.y1, door.z1], { tone: "mid" }, { r: 2, steps: 3, bevel: 0.4, extra: Dots([[door.y0 + 5, door.z0 + 5], [door.y1 - 5, door.z0 + 5], [door.y0 + 5, door.z1 - 5], [door.y1 - 5, door.z1 - 5]].map(([y, z]) => at([-92.42, y, z])), { size: 0.5 }) });
  disc("head", "head.door.handle", G.frameAlong([-92.4, -48, 490], [-1, 0, 0]), 0, 5, 2.6, { tone: "mid" });
  put("head", "head.door.vents", [-92.42, -48, 560], Ln(Array.from({ length: 5 }, (_, i) => path3([[-92.42, -64, 548 + i * 6], [-92.42, -32, 548 + i * 6], [-92.42, -32, 550.6 + i * 6], [-92.42, -64, 550.6 + i * 6]], true)).join(""), { tone: "lo" }), [record(A.box([-92.5, -64, 548], [-92.4, -32, 575], { name: "head.door.vents" }))], { bias: 0.05 });
}
// ---- pedestal: the motor switch and its pilot lamp ----
{
  box("stand", "stand.switch", [-6, -14, 214], [26, -9, 262], { tone: "mid" }, { r: 1.2, steps: 2, bevel: 0.4, extra: Dots([[-2, 218], [22, 218], [-2, 258], [22, 258]].map(([x, z]) => at([x, -8.98, z])), { size: 0.45 }) });
  disc("stand", "stand.switch.toggle.base", FY(10, 246), -9, -7, 4, { tone: "lo" });
  disc("stand", "stand.switch.toggle", G.frameAlong([10, -7, 246], G.unit3([0, 1, 0.45])), 0, 9, 1.2, { tone: "hi" });
  put("stand", "stand.switch.pilot", [10, -8.9, 226], `<g class="pj-pilot">${S(G.disc(-9, -7.4, 3, FY(10, 226), P, { steps: 24 }), { tone: "hi" })}</g>`, [record(A.disc(FY(10, 226), -9, -7.4, 3, { name: "stand.switch.pilot" }))], { bias: 0.1 });
}
// ---- a tape splicer on the bench: a channel with register pins, a hinged blade ----
{
  const SP = { x: 70, y: 96, w: 92, d: 34 };
  box("stand", "stand.splicer", [SP.x, SP.y, 0], [SP.x + SP.w, SP.y + SP.d, 9], { tone: "mid" }, { r: 3, steps: 3, bevel: 0.6, extra: Dots([[SP.x + 4, SP.y + 4], [SP.x + SP.w - 4, SP.y + 4], [SP.x + 4, SP.y + SP.d - 4], [SP.x + SP.w - 4, SP.y + SP.d - 4]].map(([x, y]) => at([x, y, 9])), { size: 0.45 }) });
  const CH0 = SP.y + (SP.d - M.FILM.width) / 2;
  put("stand", "stand.splicer.channel", [SP.x + SP.w / 2, CH0 + 17, 9.02], Ln(k.planOutline({ x: SP.x + 3, y: CH0, w: SP.w - 6, d: M.FILM.width, r: 0.6 }, 9.02, P, 2), { tone: "lo" }) + Dots(Array.from({ length: 14 }, (_, n) => at([SP.x + 10 + n * M.FILM.pitch * 1.4, CH0 + 3.4, 9.02])), { size: 0.4, tone: "mid" }), [record(A.box([SP.x + 3, CH0, 9], [SP.x + SP.w - 3, CH0 + M.FILM.width, 9.05], { name: "stand.splicer.channel" }))], { bias: 0.05 });
  box("stand", "stand.splicer.leader", [SP.x + 6, CH0 + 0.4, 9.05], [SP.x + 52, CH0 + M.FILM.width - 0.4, 9.3], { tone: "hi" }, { r: 0.3, steps: 2, bevel: 0 });
  box("stand", "stand.splicer.hinge", [SP.x + 60, SP.y + SP.d - 3, 9], [SP.x + 84, SP.y + SP.d, 14], { tone: "lo" }, { r: 0.6, steps: 2 });
  box("stand", "stand.splicer.blade", [SP.x + 60, SP.y + 4, 14], [SP.x + 84, SP.y + SP.d, 17], { tone: "mid" }, { r: 1, steps: 2, bevel: 0.4 });
  disc("stand", "stand.splicer.knob", FZ(SP.x + 72, SP.y + 10), 17, 21, 3.2, { tone: "hi" });
}

// ---- a film can on the bench ----
{
  const CF = FZ(300, 108);
  disc("stand", "stand.can", CF, 0, 13, 62, { tone: "mid" }, { inner: Ln(G.arcOf(CF, 4, 62, P), { tone: "faint" }) });
  disc("stand", "stand.can.lid", CF, 13, 17, 64, { tone: "mid" }, { bevel: 0.6, extra: Ln(G.circleOf(CF, 17, 50, P, 96), { tone: "faint" }) });
  const LBL = { x: 280, y: 84, w: 40, d: 16, r: 1 };
  put("stand", "stand.can.label", [300, 92, 17.1], S(k.slabOf(LBL, 17, 0.4, P, 2), { tone: "lo", crease: "none" }) + Ln([30, 22].map((w, i) => k.lineOnTop([LBL.x + 4, LBL.y + 5 + i * 5], [LBL.x + 4 + w, LBL.y + 5 + i * 5], 17.4, P)).join(""), { tone: "lo", free: true }), [record(A.slab(LBL, 17, 0.4, { name: "stand.can.label" }, 2))], { bias: 0.1 });
}

// ================================================================== lamp house on its stand
const LH = { x0: -330, x1: -160, y0: -30, y1: 85, z0: 420, z1: 585 };
{
  const LHplan = { x: LH.x0, y: LH.y0, w: LH.x1 - LH.x0, d: LH.y1 - LH.y0, r: 10 };
  box("stand", "stand.lamp.foot", [-282, -12, 0], [-208, 67, 6], { tone: "lo" }, { r: 4, steps: 4, bevel: 0.6, extra: Dots([[-276, -6], [-214, -6], [-276, 61], [-214, 61]].map(([x, y]) => at([x, y, 6])), { size: 0.5 }) });
  const col = FZ(-245, AY);
  disc("stand", "stand.lamp.collar", col, 6, 16, 14, { tone: "lo" });
  for (const [z0, z1] of [[16, 158], [162, 278], [282, 400]]) disc("stand", "stand.lamp.column", col, z0, z1, 10, { tone: "mid" });
  box("stand", "stand.lamp.saddle", [LH.x0 - 2, LH.y0 - 2, 404], [LH.x1 + 2, LH.y1 + 2, 420], { tone: "lo" }, { r: 10, steps: 8, bevel: 0.6, extra: Dots([[LH.x0 + 4, LH.y1 - 2], [LH.x1 - 4, LH.y1 - 2]].map(([x, y]) => at([x, y + 3.98, 412])), { size: 0.5 }) });
  box("stand", "stand.lamp.junction", [-269, AY - 8, 360], [-255, AY + 8, 394], { tone: "mid" }, { r: 0.2, steps: 2, extra: Dots([at([-269.02, AY - 5, 390]), at([-269.02, AY + 5, 364])], { size: 0.45 }) });
  // The house is a shell with no floor: it sits on the saddle and lifts off the lamp.
  const T = 2;
  const walls = [
    A.box([LH.x0, LH.y0, LH.z0], [LH.x0 + T, LH.y1, LH.z1], { name: "lamp.body", owner: "lamp.body" }),
    A.box([LH.x1 - T, LH.y0, LH.z0], [LH.x1, LH.y1, LH.z1], { name: "lamp.body", owner: "lamp.body" }),
    A.box([LH.x0, LH.y0, LH.z0], [LH.x1, LH.y0 + T, LH.z1], { name: "lamp.body", owner: "lamp.body" }),
    A.box([LH.x0, LH.y1 - T, LH.z0], [LH.x1, LH.y1, LH.z1], { name: "lamp.body", owner: "lamp.body" }),
    A.box([LH.x0, LH.y0, LH.z1 - T], [LH.x1, LH.y1, LH.z1], { name: "lamp.body", owner: "lamp.body" }),
  ].map(record);
  const vents = Ln(Array.from({ length: 9 }, (_, i) => k.planOutline({ x: LH.x0 + 22 + i * 15, y: LH.y0 + 22, w: 6, d: LH.y1 - LH.y0 - 44, r: 3 }, LH.z1, P, 3)).join(""), { tone: "lo" });
  put("lamp", "lamp.body", [(LH.x0 + LH.x1) / 2, (LH.y0 + LH.y1) / 2, (LH.z0 + LH.z1) / 2], S(k.slabOf(LHplan, LH.z0, LH.z1 - LH.z0, P, 8, 1), { tone: "mid", inner: Ln(k.sideSeam(LHplan, LH.z0 + 14, P, 8) + k.sideSeam(LHplan, LH.z1 - 12, P, 8), { tone: "faint" }) }) + vents, walls);
  // inside: the mirror focuses the arc on the gate; the bulb runs along the axis
  {
    const LF = FX(AY, ZA);
    const mirror = [[-318, 8], [-312, 30, 1], [-304, 44, 1], [-296, 52, 1], [-290, 54], [-290, 51], [-296, 49, 1], [-304, 41, 1], [-312, 27, 1], [-316, 8]];
    const mirrorShape = record(A.lathe(LF, mirror, { name: "lampcore.mirror" }));
    put("lampcore", "lampcore.mirror", [-302, AY, ZA], S(G.lathe(mirror, LF, P, { smooth: true }), { tone: "mid" }), [mirrorShape]);
    box("lampcore", "lampcore.mirror.post", [-296, AY - 7, 420], [-288, AY + 7, ZA - 54], { tone: "lo" }, { r: 0.8, steps: 2 });
    turned("lampcore", "lampcore.socket", LF, [[-326, 4.6], [-318, 4.6], [-318, 3.2], [-316, 3.2]], { tone: "lo" });
    box("lampcore", "lampcore.socket.post", [-326, AY - 3, 420], [-320, AY + 3, ZA - 4.6], { tone: "lo" }, { r: 0.6, steps: 2 });
    const bulb = (s) => (s < -300 ? 2.6 : s > -278 ? 2.6 : 2.6 + 6.6 * Math.sin(((s + 300) / 22) * Math.PI));
    turned("lampcore", "lampcore.bulb", LF, [[-316, 2.6], ...Array.from({ length: 23 }, (_, n) => [-300 + n, bulb(-300 + n), 1]), [-268, 2.6], [-268, 4], [-264, 4]], { tone: "hi" }, { smooth: { slope: (s) => (s < -300 || s > -278 ? 0 : 6.6 * (Math.PI / 22) * Math.cos(((s + 300) / 22) * Math.PI)) } });
    box("lampcore", "lampcore.bulb.post", [-268, AY - 2, 420], [-264, AY + 2, ZA - 4], { tone: "lo" }, { r: 0.4, steps: 2 });
  }
  // door with a dark viewing glass on the operator side
  const door = { x0: LH.x0 + 34, x1: LH.x1 - 28, z0: LH.z0 + 26, z1: LH.z1 - 26 };
  box("lamp", "lamp.door", [door.x0, LH.y1, door.z0], [door.x1, LH.y1 + 2.4, door.z1], { tone: "mid" }, { r: 3, steps: 3, bevel: 0.4, extra: Dots([[door.x0 + 5, door.z0 + 5], [door.x1 - 5, door.z0 + 5], [door.x0 + 5, door.z1 - 5], [door.x1 - 5, door.z1 - 5]].map(([x, z]) => at([x, LH.y1 + 2.42, z])), { size: 0.5 }) });
  const portM = planeMatrix([-245, LH.y1 + 2.42, ZA + 8], [1, 0, 0], [0, 0, -1]);
  const portScrews = [[-19, -9], [19, -9], [-19, 9], [19, 9]].map(([u, v]) => `<circle cx="${u}" cy="${v}" r="0.8"/>`).join("");
  put(
    "lamp",
    "lamp.port",
    [-245, LH.y1 + 2.45, ZA + 8],
    `<g transform="${portM}" data-part="port"><rect class="pj-bezel" x="-23" y="-12" width="46" height="24" rx="3"/><rect class="iso-line" data-tone="mid" x="-23" y="-12" width="46" height="24" rx="3" fill="none"/><rect class="pj-port-wall" x="-15.6" y="-6.4" width="31" height="13" rx="2"/><rect class="pj-port" x="-14.6" y="-5.4" width="30" height="12" rx="1.6"/><ellipse class="pj-port-core" cx="0.6" cy="0.4" rx="7" ry="2.8"/><path class="pj-port-glare" d="M-9 5.6L-3 -4.4L0 -4.4L-6 5.6Z"/><rect class="iso-line" data-tone="lo" x="-15.6" y="-6.4" width="31" height="13" rx="2" fill="none"/><g class="iso-dots" data-tone="mid">${portScrews}</g></g>`,
    [record(A.box([-268, LH.y1 + 2.4, ZA - 4], [-222, LH.y1 + 2.5, ZA + 20], { name: "lamp.port" }))],
    { bias: 0.2 },
  );
  const HF = FY(door.x1 - 10, (door.z0 + door.z1) / 2);
  disc("lamp", "lamp.door.handle", HF, LH.y1 + 2.4, LH.y1 + 7, 2.6, { tone: "hi" });
  for (const [y, z] of [[2, 470], [53, 470]]) {
    const AF = G.frameAlong([LH.x0, y, z], [-1, 0, 0]);
    disc("lamp", "lamp.adjust.boss", AF, 0, 2.4, 6, { tone: "lo" });
    disc("lamp", "lamp.adjust.knob", AF, 2.4, 9, 7, { tone: "hi" }, { extra: k.fadedSvg(G.ribsOf(AF, 2.4, 9, 7, 28, P, { fade: [0.1, 0.55], seams: true }), { tone: "lo" }) });
  }
  // chimney with a cap
  const CH = FZ(-212, AY);
  disc("lamp", "lamp.chimney", CH, LH.z1, LH.z1 + 46, 15, { tone: "mid" }, { inner: Ln(G.arcOf(CH, LH.z1 + 14, 15, P), { tone: "faint" }) });
  disc("lamp", "lamp.chimney.cap", CH, LH.z1 + 52, LH.z1 + 56, 22, { tone: "mid" }, { bevel: 0.4 });
  for (const t of [0, 1, 2, 3]) {
    const a = (t / 4) * TAU + Math.PI / 4;
    disc("lamp", "lamp.chimney.stay", FZ(-212 + 13 * Math.cos(a), AY + 13 * Math.sin(a)), LH.z1 + 46, LH.z1 + 52, 1.2, { tone: "lo" });
  }
  // condenser tube at the front
  const CF = FX(AY, ZA);
  turned("lamp", "lamp.condenser", CF, [[LH.x1, 34], [LH.x1 + 6, 34], [LH.x1 + 6, 30], [LH.x1 + 18, 30], [LH.x1 + 18, 32], [LH.x1 + 22, 32]], { tone: "mid" }, { extra: screwOn(CF, LH.x1 + 22, 27, 8, { size: 0.45, tone: "mid" }) });
  const glassPts = Array.from({ length: 64 }, (_, n) => at(G.pointOf(CF, LH.x1 + 22.05, 25, (n / 64) * TAU)));
  put("lamp", "lamp.condenser.glass", [LH.x1 + 22.05, AY, ZA], `<path class="pj-glass" data-part="condenser" d="${k.pathOf(glassPts, true)}"/>` + Ln(k.pathOf([...glassPts, glassPts[0]]), { tone: "lo" }), [record(A.disc(CF, LH.x1 + 22, LH.x1 + 22.1, 25, { name: "lamp.condenser.glass" }))], { bias: 0.1 });
}
// rectifier on the bench and its cable to the junction box on the lamp stand
{
  const RB = { x0: -360, x1: -282, y0: 78, y1: 148, z0: 0, z1: 66 };
  box("stand", "stand.rectifier", [RB.x0, RB.y0, RB.z0], [RB.x1, RB.y1, RB.z1], { tone: "mid" }, {
    r: 4,
    steps: 4,
    bevel: 0.8,
    extra: Ln(Array.from({ length: 6 }, (_, i) => k.planOutline({ x: RB.x0 + 10 + i * 10, y: RB.y0 + 12, w: 4, d: 30, r: 2 }, RB.z1, P, 3)).join(""), { tone: "lo" }),
  });
  const dialM = planeMatrix([-321, RB.y1 + 0.05, 40], [1, 0, 0], [0, 0, -1]);
  const ticks = Array.from({ length: 11 }, (_, i) => {
    const a = Math.PI * (1.15 + (0.7 * i) / 10);
    const r0 = i % 5 === 0 ? 8.6 : 10;
    return `M${(r0 * Math.cos(a)).toFixed(2)} ${(r0 * Math.sin(a)).toFixed(2)}L${(11.2 * Math.cos(a)).toFixed(2)} ${(11.2 * Math.sin(a)).toFixed(2)}`;
  }).join("");
  put("stand", "stand.rectifier.meter", [-321, RB.y1 + 0.1, 40], `<g transform="${dialM}"><rect class="pj-dial" x="-15" y="-12" width="30" height="20" rx="2"/><rect class="iso-line" data-tone="lo" x="-15" y="-12" width="30" height="20" rx="2" fill="none"/><path class="iso-line" data-tone="mid" d="M-9.98 -5.08A11.2 11.2 0 0 1 9.98 -5.08"/><path class="iso-line" data-tone="lo" d="${ticks}"/><path class="iso-line pj-needle" data-part="ammeter" data-tone="lit" data-free="end" d="M0 4L0 -9"/><circle class="pj-hub" r="1.2" cy="4"/></g>`, [record(A.box([-336, RB.y1, 28], [-306, RB.y1 + 0.1, 52], { name: "stand.rectifier.meter" }))], { bias: 0.2 });
  const KF = FY(-296, 24);
  disc("stand", "stand.rectifier.knob", KF, RB.y1, RB.y1 + 5, 5, { tone: "hi" }, { extra: k.fadedSvg(G.ribsOf(KF, RB.y1, RB.y1 + 5, 5, 24, P, { fade: [0.1, 0.55], seams: true }), { tone: "lo" }) + Ln(k.pathOf([at([-296, RB.y1 + 5.05, 24]), at([-296, RB.y1 + 5.05, 28.6])]), { tone: "hi", free: "end" }) });
  const GL = FZ(-296, 100);
  disc("stand", "stand.rectifier.gland", GL, RB.z1, RB.z1 + 6, 4.2, { tone: "lo" });
  const route = G.fillet([[-296, 100, RB.z1 + 6], [-296, 100, 86], [-261, AY, 86], [-261, AY, 360]], 12, 10, { P, tube: 2.2 });
  // A band round the post at each clip, a lug, and a P-clip that wraps the cable; the cable
  // is cut where the clip wraps it so each piece ends on a face of the clip.
  const CLIPS = [160, 280];
  const gaps = CLIPS.flatMap((z) => crossingsOf(route, [-261, AY, z], [0, 0, 1], 4).map((at) => [at - 2, at + 2]));
  R.route("stand.cable.lamp", route, 2.2, { piece: "stand", move: [0, 0, 0], limp: true, rims: [4.2, 2.2], gaps, touch: ["stand.lamp.clamp*", "stand.cable.lamp.clip*"] });
  tubePieces(route, 2.2, P, { maxLength: 18, spacing: 1.2, gaps }).forEach((piece, index) => put("stand", `stand.cable.lamp:${index}`, piece.mid, tubeSvg(piece, { tone: "mid" }), [A.tube(piece.points, piece.radii)], { bias: 0.05 }));
  for (const z of CLIPS) {
    disc("stand", "stand.lamp.clamp", FZ(-245, AY), z - 2, z + 2, 10.8, { tone: "lo" });
    box("stand", "stand.lamp.clamp.lug", [-257.6, AY - 2, z - 2], [-255.6, AY + 2, z + 2], { tone: "lo" }, { r: 0.4, steps: 2 });
    const CF3 = FZ(-261, AY);
    const clip = record(A.ring(CF3, z - 2, z + 2, 2.2, 3.6, { name: "stand.cable.lamp.clip", owner: "stand.cable.lamp" }));
    put("stand", "stand.cable.lamp.clip", [-261, AY, z], S(G.ringBand(z - 2, z + 2, 2.2, 3.6, CF3, P), { tone: "mid" }), [clip], { bias: 0.1 });
  }
}

// ================================================================== reels on their arms
const REELS = {
  feed: { x: -24, z: 772, pack: 62, r: 80, hub: 14, sense: -1 },
  take: { x: -24, z: 175, pack: 48, r: 80, hub: 14, sense: -1 },
};
box("head", "head.reel.arm", [-38, -12, 640], [-10, 4, 782], { tone: "mid" }, { r: 3, steps: 3, bevel: 0.6, inner: Ln(k.sideSeam({ x: -38, y: -12, w: 28, d: 16, r: 3 }, 652, P, 3), { tone: "faint" }), extra: Dots([at([-34, 4.02, 646]), at([-14, 4.02, 646])], { size: 0.5 }) });
box("stand", "stand.reel.arm", [-34, -14, 160], [-14, -8, 190], { tone: "lo" }, { r: 1.2, steps: 2 });
for (const [id, reel] of Object.entries(REELS)) {
  const F = FY(reel.x, reel.z);
  const from = id === "feed" ? 4 : -8;
  disc(id === "feed" ? "head" : "stand", `${id === "feed" ? "head" : "stand"}.spindle.${id}`, F, from, 6, 5.2, { tone: "mid" });
  reel.y0 = 6;
  reel.y1 = F1 + 4.6;
  disc("reels", `reels.${id}.far`, F, reel.y0, reel.y0 + 1.6, reel.r, { tone: "lo" }, { extra: faceRing(F, reel.y0 + 1.6, reel.r - 3.2) });
  disc("reels", `reels.${id}.core`, F, reel.y0 + 1.6, F0, reel.hub, { tone: "mid" });
  disc("reels", `reels.${id}.core`, F, F1, reel.y1 - 1.6, reel.hub, { tone: "mid" });
  const rings = Array.from({ length: 5 }, (_, i) => G.circleOf(F, F1, reel.hub + 4 + ((reel.pack - reel.hub - 6) * (i + 1)) / 6, P, 72)).join("");
  disc("reels", `reels.${id}.pack`, F, F0, F1, reel.pack, { tone: "mid" }, { extra: Ln(rings, { tone: "faint" }) });
  put("reels", `reels.${id}.near`, [reel.x, reel.y1 - 0.8, reel.z], `<g data-part="flange-${id}">${PARTS.plateSvg(PARTS.flangeDef(id, reel), ((REST_C * M.FRAME_LENGTH) / reel.pack) * (180 / Math.PI))}</g>`, [record(A.disc(F, reel.y1 - 1.6, reel.y1, reel.r, { name: `reels.${id}.near` }))], { bias: 0.4 });
  disc("reels", `reels.${id}.nut`, F, reel.y1, reel.y1 + 4, 6.2, { tone: "hi" }, { steps: 6, extra: Dots([at([reel.x, reel.y1 + 4.02, reel.z])], { size: 0.9, tone: "lo" }) });
  // The take-up spindle turns through a friction clutch, so the reel can wind slower as it fills.
  if (id === "take") disc("reels", "reels.take.clutch", F, reel.y1 + 4, reel.y1 + 7.4, 9.5, { tone: "mid" }, { bevel: 0.3, extra: k.fadedSvg(G.ribsOf(F, reel.y1 + 4, reel.y1 + 7.4, 9.5, 36, P, { fade: [0.1, 0.55], seams: true }), { tone: "lo" }) });
}
D.reels = REELS;

// ================================================================== the threaded film path
const C = (s, sense) => ({ c: [s.x, s.z], r: (s.teeth * M.FILM.pitch) / TAU, sense });
const packFeed = { c: [REELS.feed.x, REELS.feed.z], r: REELS.feed.pack, sense: -1 };
const packTake = { c: [REELS.take.x, REELS.take.z], r: REELS.take.pack, sense: -1 };
const S1 = C(SPROCKETS.feed, 1);
const SI = C(SPROCKETS.inter, -1);
const S2 = C(SPROCKETS.hold, 1);
const t1 = PARTS.tangent(packFeed, S1);
const t3 = PARTS.tangent(S2, packTake);
const runs = [];
const ang = PARTS.angleOf;
runs.push({ id: "a1", drive: "c", pts: PARTS.straight(t1.pa, t1.pb, 3) });
// The film leaves the feed sprocket rising, so the upper loop arches over into the gate.
const U_EXIT = (7 * Math.PI) / 4;
runs.push({ id: "a2", drive: "c", pts: PARTS.arc(S1, ang(S1.c, t1.pb), U_EXIT, 1.5), wrap: 1, centre: S1.c });
const loopU = { p0: [S1.c[0] + S1.r * Math.cos(U_EXIT), S1.c[1] + S1.r * Math.sin(U_EXIT)], t0: [-Math.sin(U_EXIT), Math.cos(U_EXIT)], p1: [0, 552], t1: [0, -1] };
runs.push({ id: "b1", drive: "i", pts: PARTS.straight([0, 552], [0, SI.c[1]], 2) });
const L_EXIT = -Math.PI / 3;
runs.push({ id: "b2", drive: "i", pts: PARTS.arc(SI, 0, L_EXIT, 1.2), wrap: 1, centre: SI.c });
const loopL = { p0: [SI.c[0] + SI.r * Math.cos(L_EXIT), SI.c[1] + SI.r * Math.sin(L_EXIT)], t0: [Math.sin(L_EXIT), -Math.cos(L_EXIT)], p1: [S2.c[0] - S2.r, S2.c[1]], t1: [0, -1] };
runs.push({ id: "c1", drive: "c", pts: PARTS.arc(S2, Math.PI, ang(S2.c, t3.pa), 1.5), wrap: 1, centre: S2.c });
runs.push({ id: "c2", drive: "c", pts: PARTS.straight(t3.pa, t3.pb, 3) });
const L0U = 125;
const L0L = 110;
// Each run's film coordinate at its start, along the path at rest.
let along = 0;
const startOf = {};
for (const id of ["a1", "a2", "U", "b1", "b2", "L", "c1", "c2"]) {
  startOf[id] = along;
  if (id === "U") along += L0U;
  else if (id === "L") along += L0L;
  else along += PARTS.lengthOf(runs.find((r) => r.id === id).pts);
}
for (const run of runs) run.m0 = startOf[run.id];
for (const run of runs) {
  if (!run.wrap) continue;
  const faces = (i) => {
    const [p, q] = [run.pts[i], run.pts[i + 1]];
    const mid = [(p[0] + q[0]) / 2 - run.centre[0], 0, (p[1] + q[1]) / 2 - run.centre[1]];
    return G.dot3(G.unit3(mid), V) > 0.02;
  };
  const shown = run.pts.slice(0, -1).map((_, i) => faces(i));
  const i0 = shown.indexOf(true);
  const i1 = shown.lastIndexOf(true);
  if (i0 < 0) {
    run.hidden = true;
    continue;
  }
  if (shown.slice(i0, i1 + 1).includes(false)) throw new Error(`${run.id}: the visible wrap is not one run`);
  run.m0 += PARTS.lengthOf(run.pts.slice(0, i0 + 1));
  run.pts = run.pts.slice(i0, i1 + 2);
}
const APERTURE_S = 552 - ZA;
D.frameLine = (((startOf.b1 + APERTURE_S - M.FRAME_LENGTH / 2) % M.FRAME_LENGTH) + M.FRAME_LENGTH) % M.FRAME_LENGTH;
D.loops = {
  U: { ...loopU, L0: L0U, m0: startOf.U, drive: "c", sign: 1 },
  L: { ...loopL, L0: L0L, m0: startOf.L, drive: "i", sign: -1 },
};
D.runs = runs.filter((run) => !run.hidden).map(({ id, drive, pts, wrap, centre, m0 }) => ({ id, drive, wrap: wrap ?? 0, centre: centre ?? null, m0, pts: pts.map(([x, z]) => [Math.round(x * 100) / 100, Math.round(z * 100) / 100]) }));
const thin = (pts) => {
  const out = [];
  const back = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    const t = G.unit3([b[0] - a[0], 0, b[1] - a[1]]);
    const n = [-t[2], t[0]];
    out.push([pts[i][0] + n[0] * 0.075, pts[i][1] + n[1] * 0.075]);
    back.push([pts[i][0] - n[0] * 0.075, pts[i][1] - n[1] * 0.075]);
  }
  return [...out, ...back.reverse()];
};
function filmItem(id, pts, options, extraPart) {
  const marks = PARTS.marks(pts, options.m0 ?? 0, options);
  const svg = PARTS.ribbonSvg(pts, options) + `<g data-part="marks-${id}"><path class="pj-perfs" d="${marks.holes}"/><path class="iso-line pj-framelines" data-tone="lo" d="${marks.lines}"/></g>`;
  const mid = pts[Math.floor(pts.length / 2)];
  const shapes = [];
  for (let i = 0; i < pts.length - 1; i += 6) shapes.push(record(A.prism(PRISM_Y, thin(pts.slice(i, Math.min(pts.length, i + 7))), F0, F1, { name: `film.${id}`, owner: "film" })));
  put("film", `film.${id}`, [mid[0], AY, mid[1]], `<g data-part="${extraPart ?? `run-${id}`}">${svg}</g>`, shapes, { bias: options.wrap ? 0.6 : 0 });
}
for (const run of runs.filter((r) => !r.hidden)) filmItem(run.id, run.pts, { wrap: run.wrap, centre: run.centre, m0: run.m0 - (run.drive === "c" ? REST_C : REST_I) * M.FRAME_LENGTH, tone: "hi" });
for (const [id, loop] of Object.entries(D.loops)) {
  const pts = PARTS.loopOf(loop, loop.L0 + loop.sign * (REST_C - REST_I) * M.FRAME_LENGTH);
  const marks = PARTS.marks(pts, loop.m0 - (loop.drive === "c" ? REST_C : REST_I) * M.FRAME_LENGTH, {});
  const shapes = [];
  for (let i = 0; i < pts.length - 1; i += 4) shapes.push(record(A.prism(PRISM_Y, thin(pts.slice(i, Math.min(pts.length, i + 5))), F0, F1, { name: `film.loop${id}`, owner: "film" })));
  const mid = pts[Math.floor(pts.length / 2)];
  put("film", `film.loop${id}`, [mid[0], AY, mid[1]], `<g data-part="loop-${id}">${PARTS.ribbonSvg(pts, { tone: "hi", loop: true })}<path class="pj-perfs" d="${marks.holes}"/><path class="iso-line pj-framelines" data-tone="lo" d="${marks.lines}"/></g>`, shapes);
}

// pad rollers: an arm on a stud for each sprocket, the roller holding the film to the teeth
const ROLLERS = [
  { id: "feed", s: SPROCKETS.feed, angle: (200 * Math.PI) / 180, r: 4.5, pivot: [-84, 632] },
  { id: "inter", s: SPROCKETS.inter, angle: -Math.PI / 6, r: 3.5, pivot: [8, 404] },
  { id: "hold", s: SPROCKETS.hold, angle: (Math.PI + ((ang(S2.c, t3.pa) % TAU) + TAU) % TAU) / 2, r: 4.5, pivot: [-70, 326] },
];
for (const roller of ROLLERS) {
  const d = roller.s.r + 0.15 + roller.r + 0.05;
  const c = [roller.s.x + d * Math.cos(roller.angle), roller.s.z + d * Math.sin(roller.angle)];
  const RF = FY(c[0], c[1]);
  disc("rollers", `rollers.${roller.id}`, RF, F0 - 1, F1 + 1, roller.r, { tone: "hi" }, { inner: Ln(G.arcOf(RF, F0 + 1.5, roller.r, P) + G.arcOf(RF, F1 - 1.5, roller.r, P), { tone: "faint" }) });
  disc("rollers", `rollers.${roller.id}.axle`, RF, F1 + 1, F1 + 4.2, 1.4, { tone: "mid" });
  const PF = FY(roller.pivot[0], roller.pivot[1]);
  disc("head", `head.stud.${roller.id}`, PF, 0, F1 + 4.2, 2.6, { tone: "lo" });
  prismY("rollers", `rollers.${roller.id}.arm`, linkPolygon(roller.pivot, c, 3.4), F1 + 4.2, F1 + 6.6, { tone: "mid" }, { extra: Dots([at([roller.pivot[0], F1 + 6.62, roller.pivot[1]]), at([c[0], F1 + 6.62, c[1]])], { size: 0.6, tone: "hi" }) });
}

// ================================================================== settle, assemble, emit
A.settle(R, P);
// The pin rides in a slot with its tip proud of the wheel's face, so it always draws after
// the wheel; at rest they don't overlap, so the measured keys can't say so on their own.
{
  const pin = R.items.find((item) => item.name === "movement.pin");
  const wheel = R.items.find((item) => item.name === "movement.cross");
  pin.key = Math.max(pin.key, wheel.key + 0.05);
}
R.items.sort((a, b) => a.key - b.key);
const groups = R.items.map((item, index) => {
  const [mx, my, mz] = item.move;
  return `<g class="it" data-piece="${item.piece}" data-k="${item.key.toFixed(2)}" data-m="${mx.toFixed(1)},${my.toFixed(1)},${mz.toFixed(1)}" data-i="${index}">${item.svg}</g>`;
});

const LABEL_TEXT =
  "A 35 mm film projector on a bench, threaded and running: a lamp house on its stand throws light through the gate, where a Geneva cross on an outboard shaft pulls the film down one frame at a time. A two-bladed shutter spins in front of the lens, and a small screen at the far end shows the countdown leader. Feed and take-up reels sit above and below the head, and the film loops between steady sprockets and the stepping one.";

const unit = (vector) => {
  const o = at([0, 0, 0]);
  const p = at(vector);
  return [p[0] - o[0], p[1] - o[1]];
};
Object.assign(D, {
  W,
  H,
  V,
  EX: unit([1, 0, 0]),
  EY: unit([0, 1, 0]),
  EZ: unit([0, 0, 1]),
  camera: glCamera(P),
  P,
  ZA,
  AY,
  sprockets: SPROCKETS,
  pic: PIC,
  win: WIN,
  screenX: SCREEN_X,
  lens: LENS,
  lamp: LH,
  aperture: AP,
  frameLength: M.FRAME_LENGTH,
  pieces: Object.fromEntries(Object.entries(PIECES).map(([id, piece]) => [id, { name: piece.name, say: piece.say }])),
  stagger: STAGGER,
  spring: SPRING,
  order: ORDER,
});

const backSvg = k.figureSvg({ width: W, height: H, label: LABEL_TEXT, body: back, className: "pj-back" });
const frontSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="iso-svg pj-front" viewBox="0 0 ${W} ${H}" aria-hidden="true"><g class="pj-machine">${groups.join("")}</g></svg>`;
const partButtons = ORDER.map((id, index) => `<button type="button" class="pj-part" data-part="${id}" data-cursor="dot"><span class="pj-num">${String(index + 1).padStart(2, "0")}</span>${PIECES[id].name}</button>`).join("");
const corners = `<div class="iso-plate-corners" aria-hidden="true"><span class="iso-plate-corner" data-corner="fig">Fig 1</span><span class="iso-plate-corner" data-corner="title">35mm projector</span><span class="iso-plate-corner" data-corner="readout" data-readout>${M.readoutOf(0, 2)}</span></div>`;
const speedButtons = [["0", "stop"], ["1", "1"], ["16", "16"], ["18", "18"], ["24", "24"]].map(([v, l]) => `<button type="button" class="pj-chip" data-speed="${v}" data-cursor="dot" aria-label="${v === "0" ? "stop" : `${v} frame${v === "1" ? "" : "s"} a second`}">${l}</button>`).join("");
const bladeButtons = [1, 2, 3].map((n) => `<button type="button" class="pj-chip" data-blades="${n}" data-cursor="dot" aria-label="${n} shutter blade${n === 1 ? "" : "s"}">${n}</button>`).join("");
const controls = `<div class="pj-controls"><span class="pj-group" role="group" aria-label="Speed in frames per second"><span class="pj-label">fps</span>${speedButtons}</span><span class="pj-group" role="group" aria-label="Shutter blades"><span class="pj-label">blades</span>${bladeButtons}</span><span class="pj-group"><button type="button" class="pj-chip" data-step data-cursor="dot" aria-label="Step one frame">step</button><button type="button" class="pj-chip" data-apart data-cursor="dot">take apart</button><button type="button" class="pj-chip" data-sound data-cursor="dot" aria-pressed="false">sound</button></span><span class="pj-hint">drag to crank · click a part</span><span class="pj-live" aria-live="polite" data-live></span></div>`;
const STAGE_INNER = `${backSvg}<canvas class="pj-beam" aria-hidden="true"></canvas>${frontSvg}`;
const stageOpen = `<div class="pj-stage" tabindex="0" role="group" style="aspect-ratio:${W}/${H}" data-cursor data-cursor-label="crank ↔" aria-label="35mm projector. Drag sideways to crank it by hand. Arrow keys change the speed, Home and End stop it or run it at 24. B changes the shutter blades, period and comma step a frame on or back, space takes it apart, and clicking a part shows it working.">`;
const stage = `${stageOpen}${STAGE_INNER}</div>`;
const caption =
  "A Geneva cross on the intermittent sprocket's shaft makes a quarter turn: four perforations, one frame. It turns only while the driver's pin is in a slot, 90° of the driver's turn. For the other 270° the cross is locked and the frame sits still in the 0.825 × 0.602 in aperture. The shutter turns once a frame. One blade covers every pull-down and the others cut the still frame. So two blades flash each frame twice: 48 Hz at 24 fps. The loops above and below the gate take up the difference between the steady sprockets and the stepping one.";
const plateWith = (inner) => `<figure class="iso-figure pj"><div class="iso-plate">${corners}${inner}${controls}</div><figcaption class="iso-legend"><span class="pj-parts">${partButtons}</span><span class="iso-caption">${caption}</span></figcaption></figure>`;
const plate = plateWith(stage);
const shell = plateWith(`${stageOpen}</div>`);

const CSS = readFileSync(join(HERE, "projector.css"), "utf8");
const latheSource = readFileSync(join(HERE, "..", "anatomy-kit", "kit", "lathe.mjs"), "utf8").replace(/^import .*$/m, "").replace(/^export /gm, "");
const latheScript = `const G = (() => {${latheSource}\nreturn { viewOf, scaleOf, frameAlong, frameOf, pointOf, disc, circleOf, arcOf, dot3, add3, sub3, mul3, unit3, cross3, len3, lightOf, toneOf, dotsOf };})();\n`;
const modelScript = `const M = (() => {${readFileSync(join(HERE, "model.mjs"), "utf8").replace(/^export /gm, "")}\nreturn { FRAME_LENGTH, crossOf, intermittentOf, shutterOpen, lightShare, flickerHz, screenLight, leaderAt, readoutOf, phaseOf, openPhase, feetPerMinute, LEADER, SOUND_FPS };})();\n`;
const partsScript = readFileSync(join(HERE, "parts.mjs"), "utf8").replace(/^export /gm, "");
const liveBody = readFileSync(join(HERE, "live.js"), "utf8");
// The live code is one function body, so it runs the same on the standalone page and in Next.
const LIVE = `${kitScript()}\n${glScript()}\n${latheScript}${modelScript}${partsScript}\n${liveBody}`;

const DATA_JSON = JSON.stringify(D);
const MOUNT = `function mountProjector(root, D) {\n${LIVE}\n}`;
const page = k.pageHtml({
  title: "35mm projector",
  theme: THEME,
  body: `<style>${CSS}</style>${plate}`,
  script: `${MOUNT}\nwindow.__projector = mountProjector(document.querySelector(".pj"), ${DATA_JSON});`,
  width: 1000,
});
const name = THEME === "light" ? "projector-light.html" : "projector.html";
writeFileSync(join(HERE, name), page);
// The site gets three files: the drawing as HTML for the server to render, the styles, and
// the live code as a module the bundler minifies.
mkdirSync(SITE, { recursive: true });
const NOTE = "Generated by figures/projector/build.mjs. Rebuild with `node figures/projector/build.mjs`.";
writeFileSync(join(SITE, "projector.shell.ts"), `// ${NOTE}\nexport const PROJECTOR_SHELL = ${JSON.stringify(shell)};\n`);
writeFileSync(join(SITE, "projector.stage.ts"), `// ${NOTE}\nexport const PROJECTOR_STAGE = ${JSON.stringify(STAGE_INNER)};\n`);
const LICENSE = "/*! Drawn with the Anatomy kit (github.com/wheresryan22/anatomy), MIT License, Copyright (c) 2026 Ryan. */";
writeFileSync(join(SITE, "projector.css"), `/* ${NOTE} */\n${LICENSE}\n${k.ISO_CSS}\n${CSS}`);
writeFileSync(join(SITE, "projector.live.js"), `// ${NOTE}\n${LICENSE}\n/* eslint-disable */\nexport const PROJECTOR_DATA = ${DATA_JSON};\nexport ${MOUNT}\n`);
writeFileSync(join(SITE, "projector.live.d.ts"), `// ${NOTE}\nexport declare const PROJECTOR_DATA: Record<string, unknown>;\nexport declare function mountProjector(root: HTMLElement, data: Record<string, unknown>): (() => void) & { snapshot: () => Record<string, unknown> };\n`);
console.log("wrote", name, `${(page.length / 1024).toFixed(0)} KB`, `${R.items.length} items`, `scale ${KS.toFixed(3)}`);

A.auditOrExit(R, P, {});
