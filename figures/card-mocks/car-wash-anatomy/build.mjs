// Card plate mockup: a car half way through a car-wash brush frame, on a conveyor slab.
// Front of the car (−x) has passed the brushes and is clean; the rear still carries foam.
//   node build.mjs  → card-anatomy.svg, card-anatomy.html (kit read from ~/.claude/skills/anatomy-asset)
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const KIT = "/Users/hammer/.claude/skills/anatomy-asset/kit/";
const k = await import(KIT + "iso-kit.mjs");
const a = await import(KIT + "asset.mjs");
const G = await import(KIT + "lathe.mjs");

const HERE = dirname(fileURLToPath(import.meta.url));
const PAPER = "#F2DDD4";
const W = 480, H = 640;

// ---------- world ----------
// The car drives toward +y (toward the viewer, screen lower left) out of the brush frame.
const SLAB = { x: -42, y: -58, w: 84, d: 104, r: 7 };
const SZ = 6;
const CAR = { x: -15, y: -32, w: 30, d: 60, r: 5 };      // y −32..28, nose at +y
const CAB = { x: -13, y: -14, w: 26, d: 26, r: 5 };      // y −14..12
const B0 = SZ + 5, B1 = SZ + 15, C1 = B1 + 10;
const ARCH_Y = -16;
const BAR = [56, 61];
const LEG_X = 34;
const BRUSH_X = 22, BRUSH_Y = -20, BRUSH_R = 6.5;
const TOP_Y = -27, TOP_Z = B1 + 6.4, TOP_R = 6;

const P = a.fitInto([...k.boxCorners(SLAB, 0, BAR[1] + 2)], { x: 0, y: 0, w: W, h: H }, { pad: 30, azimuth: 58 });

const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (pts, style) => k.dotsSvg(pts, style);
const brand = (s) => `<g class="ac-brand">${s}</g>`;
const ebony = (s) => `<g class="ac-ebony">${s}</g>`;
const led = (s) => `<g class="ac-led">${s}</g>`;
const halo = (plan, z) => `<path class="iso-halo" d="${k.haloOf(plan, z, 0.1, P)}"/>`;
function faceRect(face, c, u0, u1, z0, z1, r = 0, steps = 4) {
  const ring = k.roundedPlan({ x: u0, y: z0, w: u1 - u0, d: z1 - z0, r }, steps);
  return k.pathOf(ring.map(([u, v]) => at(face === "y" ? [u, c, v] : [c, u, v])), true);
}
const facePt = (face, c, u, z) => at(face === "y" ? [u, c, z] : [c, u, z]);

// ---------- base ----------
function base() {
  const out = [halo(k.insetPlan(SLAB, -6), 0)];
  out.push(S(k.slabOf(SLAB, 0, SZ, P, 8, 1), { tone: "mid", inner: L(k.sideSeam(SLAB, 2.2, P, 8), { tone: "faint" }) }));
  for (const x of [-34, 34]) for (let y = -50; y < 40; y += 14) out.push(L(k.planOutline({ x: x - 0.8, y, w: 1.6, d: 8, r: 0.6 }, SZ, P, 2), { tone: "lo" }));
  // conveyor channel under the near (+x) wheels, rollers riding toward +y
  const CH = { x: 10, y: -54, w: 8, d: 96, r: 2 };
  out.push(S(k.slabOf(CH, SZ - 1.2, 1.2, P, 3), { tone: "lo", crease: "none" }));
  const rollers = [];
  for (let y = -62; y < 46; y += 12) rollers.push(L(k.ring(14, y, 1.6, SZ, P, 14), { tone: "mid" }) + D([at([14, y, SZ])], { size: 0.4 }));
  out.push(`<clipPath id="cw-ch"><path d="${k.pathOf(k.roundedPlan(k.insetPlan(CH, 0.4), 3).map(([x, y]) => at([x, y, SZ])), true)}"/></clipPath>`);
  out.push(`<g clip-path="url(#cw-ch)">${a.amLoop(rollers.join(""), [0, 12, 0], P, { period: 1800 })}</g>`);
  out.push(D(k.corners(SLAB, 5).map(([x, y]) => at([x, y, SZ])), { size: 0.45 }));
  return out.join("");
}
function drums() {
  const one = (cx, cy, wrap) => wrap([
    S(k.cylinder(cx, cy, 5.5, SZ, 15, P, 36, 0.5), { tone: "hi", inner: L(k.sideArc(cx, cy, 5.5, SZ + 4, P, 24), { tone: "faint" }) + L(k.sideArc(cx, cy, 5.5, SZ + 11, P, 24), { tone: "faint" }) }),
    S(k.cylinder(cx, cy, 1.5, SZ + 15, 1.4, P, 14), { tone: "mid" }),
  ].join(""));
  return one(-32, -48, (s) => s) + one(-32, -34, brand);
}

// ---------- the frame ----------
const legPlan = (x) => ({ x: x - 3, y: ARCH_Y - 3, w: 6, d: 6, r: 1 });
const leg = (x) => S(k.slabOf({ x: x - 5, y: ARCH_Y - 5, w: 10, d: 10, r: 1.5 }, SZ, 2, P, 2), { tone: "lo" })
  + S(k.slabOf(legPlan(x), SZ + 2, BAR[0] - SZ - 2, P, 2, 0.4), { tone: "mid", inner: L(k.sideSeam(legPlan(x), SZ + 10, P, 2), { tone: "faint" }) })
  + D([at([x - 3.6, ARCH_Y + 3.6, SZ + 2]), at([x + 3.6, ARCH_Y + 3.6, SZ + 2])], { size: 0.4 });
function crossbar() {
  const plan = { x: -LEG_X - 3.5, y: ARCH_Y - 3.5, w: 2 * LEG_X + 7, d: 7, r: 1 };
  return S(k.slabOf(plan, BAR[0], BAR[1] - BAR[0], P, 2, 0.5), { tone: "hi", inner: L(k.sideSeam(plan, BAR[0] + 2.5, P, 2), { tone: "faint" }) })
    + D([-24, -12, 0, 12, 24].map((x) => at([x, ARCH_Y, BAR[1]])), { size: 0.4 });
}
function controlBox() {
  const box = { x: LEG_X - 4, y: ARCH_Y + 3, w: 8, d: 4, r: 0.8 };
  let s = S(k.slabOf(box, 26, 14, P, 2, 0.4), { tone: "mid" });
  s += L(faceRect("y", ARCH_Y + 7, LEG_X - 2.6, LEG_X + 2.6, 29, 36, 0.6, 2), { tone: "lo" });
  s += a.amBlink(led(D([facePt("y", ARCH_Y + 7, LEG_X, 38)], { size: 0.8, tone: "lit" })), { period: 2200 });
  return s;
}
function sideBrush(x) {
  const out = [];
  out.push(S(k.cylinder(x, BRUSH_Y, 1.2, 49, BAR[0] - 49, P, 12), { tone: "mid" }));
  out.push(S(k.cylinder(x, BRUSH_Y, 4, 45, 4, P, 24, 0.4), { tone: "hi" }));
  out.push(S(k.cylinder(x, BRUSH_Y, BRUSH_R, SZ + 3, 45 - SZ - 3, P, 40, 0.5), { tone: "hi", inner: L(k.sideArc(x, BRUSH_Y, BRUSH_R, SZ + 6, P, 24) + k.sideArc(x, BRUSH_Y, BRUSH_R, 42, P, 24), { tone: "faint" }) }));
  out.push(L(k.knurl(x, BRUSH_Y, BRUSH_R, SZ + 6, 42, 18, P, 0.4), { tone: "lo" }));
  return out.join("");
}
function topBrushHanger(x) {
  return S(k.slabOf({ x: x - 1, y: TOP_Y - 1.2, w: 2, d: ARCH_Y - TOP_Y + 1.2, r: 0.5 }, BAR[0] - 2.5, 2.5, P, 2), { tone: "mid" })
    + S(k.slabOf({ x: x - 1, y: TOP_Y - 1.2, w: 2, d: 2.4, r: 0.5 }, TOP_Z, BAR[0] - 2.5 - TOP_Z, P, 2), { tone: "mid" });
}
function topBrush() {
  const F = G.frameAlong([-19, TOP_Y, TOP_Z], [1, 0, 0]);
  return S(G.disc(0, 38, TOP_R, F, P), { tone: "hi" }) + k.fadedSvg(G.ribsOf(F, 0, 38, TOP_R, 22, P, { fade: [0.05, 0.5] }), { tone: "lo" });
}

// ---------- the car ----------
function wheel(x, y, side) {
  const F = G.frameAlong([x, y, B0 + 1], [side, 0, 0]);
  return ebony(S(G.disc(0, 4, 6, F, P), { tone: "hi" })) + S(G.disc(4, 4.6, 3.2, F, P), { tone: "mid" }) + D([at(G.pointOf(F, 4.6, 0, 0))], { size: 0.5 });
}
function foamCluster(cx, cy, z) {
  const puffs = [[0, 0, 2], [2.4, 1, 1.5], [-2.2, 1.2, 1.6], [0.8, -2.2, 1.4], [-1.2, -1.8, 1.2], [1.6, 2.6, 1.1]];
  return puffs.map(([dx, dy, r]) => [cx + dx, cy + dy, z + r * 0.7, r]).sort((p, q) => k.depthOf(p, P) - k.depthOf(q, P))
    .map(([x, y, zz, r]) => S(G.sphereOf([x, y, zz], r, P), { tone: "hi" })).join("");
}
function car() {
  const out = [];
  out.push(wheel(-15, -20, -1), wheel(-15, 16, -1));
  out.push(brand(S(k.slabOf(CAR, B0, B1 - B0, P, 5, 0.8), { tone: "hi", inner: L(k.sideSeam(CAR, B0 + 4, P, 5), { tone: "faint" }) })));
  // nose (+y): headlights and grille; near side (+x): door seams and handles
  const NY = CAR.y + CAR.d;
  out.push(ebony(L(faceRect("y", NY, -12, -6, B1 - 4.5, B1 - 1.8, 0.8, 2) + faceRect("y", NY, 6, 12, B1 - 4.5, B1 - 1.8, 0.8, 2), { tone: "mid" })));
  out.push(S(k.slabOf({ x: -5, y: NY, w: 10, d: 0.6, r: 0.3 }, B0 + 2, 4, P, 2), { tone: "hi", crease: "none" }));
  out.push(brand(L(k.segment([15, -2, B0 + 4], [15, -2, B1], P) + k.segment([15, 10, B0 + 4], [15, 10, B1], P), { tone: "lo" })));
  out.push(brand(L(faceRect("x", 15, 2, 6, B1 - 3, B1 - 2.2, 0.4, 2) + faceRect("x", 15, -12, -8, B1 - 3, B1 - 2.2, 0.4, 2), { tone: "lo" })));
  // cabin with glass on the near side and the windscreen
  out.push(brand(S(k.slabOf(CAB, B1, C1 - B1, P, 5, 0.6), { tone: "hi" })));
  out.push(ebony(S(k.slabOf({ x: CAB.x + CAB.w - 0.2, y: CAB.y + 3, w: 0.6, d: 10, r: 0.3 }, B1 + 2, 6, P, 2), { tone: "hi", crease: "none" })));
  out.push(ebony(S(k.slabOf({ x: CAB.x + CAB.w - 0.2, y: CAB.y + 15, w: 0.6, d: 8, r: 0.3 }, B1 + 2, 6, P, 2), { tone: "hi", crease: "none" })));
  out.push(ebony(S(k.slabOf({ x: CAB.x + 3, y: CAB.y + CAB.d - 0.2, w: CAB.w - 6, d: 0.6, r: 0.3 }, B1 + 2, 6, P, 2), { tone: "hi", crease: "none" })));
  out.push(brand(S(k.slabOf({ x: 15, y: 9, w: 2.6, d: 2.4, r: 0.6 }, B1 + 1, 2.4, P, 2), { tone: "hi" })));
  // the back hasn't left the brushes yet: foam on the boot
  out.push(foamCluster(-6, -26, B1), foamCluster(6, -24, B1), foamCluster(0, -18, C1));
  out.push(wheel(15, -20, 1), wheel(15, 16, 1));
  return out.join("");
}

// ---------- assemble, back to front ----------
const body = [
  base(),
  drums(),
  leg(-LEG_X),
  sideBrush(-BRUSH_X),
  topBrushHanger(-21),
  topBrush(),
  car(),
  topBrushHanger(21),
  crossbar(),
  sideBrush(BRUSH_X),
  leg(LEG_X),
  controlBox(),
].join("");

const svg = a.assetSvg({
  width: W, height: H,
  label: "An isometric car driving out of a car-wash brush frame on a conveyor slab: clean at the front, foam still on the boot.",
  body, paper: PAPER,
  accents: { brand: "#F28E86", ebony: "#3D1413", led: { hex: "#F28E86", mode: "ink" } },
  weight: 0.7, id: "card-anatomy",
});
writeFileSync(join(HERE, "card-anatomy.svg"), svg);
writeFileSync(join(HERE, "card-anatomy.html"), a.previewHtml({ title: "card-anatomy", svg, paper: PAPER, width: 480 }));
console.log(`wrote card-anatomy.svg (${(svg.length / 1024).toFixed(0)} KB)`);
