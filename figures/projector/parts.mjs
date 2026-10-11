// Drawing for everything that moves: shared by build.mjs (the rest pose) and the live page
// (every frame), so the static art and the animation can't drift apart.
export function makeParts(k, G, P, D) {
  const V = G.viewOf(P);
  const at = (p) => k.iso(p, P);
  const f1 = (v) => Math.round(v * 10) / 10;
  const ptxt = ([x, y]) => `${f1(x)} ${f1(y)}`;
  const poly = (pts) => (pts.length ? `M${pts.map(ptxt).join("L")}Z` : "");
  const line = (pts) => (pts.length > 1 ? `M${pts.map(ptxt).join("L")}` : "");
  const depth = (p) => G.dot3(p, V);
  const TAU = Math.PI * 2;

  // A face plane: local (u, v) in world units mapped onto the plane through o along ex, ey.
  function planeMatrix(o, ex, ey) {
    const p0 = at(o);
    const px = at(G.add3(o, ex));
    const py = at(G.add3(o, ey));
    const v = (x) => x.toFixed(4);
    return `matrix(${v(px[0] - p0[0])} ${v(px[1] - p0[1])} ${v(py[0] - p0[0])} ${v(py[1] - p0[1])} ${p0[0].toFixed(2)} ${p0[1].toFixed(2)})`;
  }

  // ---- film path in the x–z plane, film between y = F0 and y = F1 ----
  const F0 = D.film.y0;
  const F1 = D.film.y1;
  const xz = (x, z, y) => [x, y, z];

  function tangent(a, b) {
    const dx = b.c[0] - a.c[0];
    const dz = b.c[1] - a.c[1];
    const dist = Math.hypot(dx, dz);
    const kk = b.r * b.sense - a.r * a.sense;
    const psi = Math.atan2(dz, dx);
    const phi = psi + Math.asin(-kk / dist);
    const d = [Math.cos(phi), Math.sin(phi)];
    const m = [d[1], -d[0]];
    const pa = [a.c[0] + a.r * a.sense * m[0], a.c[1] + a.r * a.sense * m[1]];
    const pb = [b.c[0] + b.r * b.sense * m[0], b.c[1] + b.r * b.sense * m[1]];
    return { pa, pb, d };
  }
  const angleOf = (c, p) => Math.atan2(p[1] - c[1], p[0] - c[0]);
  function arc(circle, from, to, step = 2) {
    let a0 = from;
    let a1 = to;
    if (circle.sense > 0) while (a1 < a0) a1 += TAU;
    else while (a1 > a0) a1 -= TAU;
    const n = Math.max(2, Math.ceil((Math.abs(a1 - a0) * circle.r) / step));
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const a = a0 + ((a1 - a0) * i) / n;
      pts.push([circle.c[0] + circle.r * Math.cos(a), circle.c[1] + circle.r * Math.sin(a)]);
    }
    return pts;
  }
  function straight(p, q, step = 3) {
    const n = Math.max(1, Math.ceil(Math.hypot(q[0] - p[0], q[1] - p[1]) / step));
    return Array.from({ length: n + 1 }, (_, i) => [p[0] + ((q[0] - p[0]) * i) / n, p[1] + ((q[1] - p[1]) * i) / n]);
  }
  function lengthOf(pts) {
    let s = 0;
    for (let i = 1; i < pts.length; i++) s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    return s;
  }
  const join = (...runs) => runs.reduce((all, run) => (all.length ? [...all, ...run.slice(1)] : [...run]), []);

  // A loop runs from p0 (heading t0) out to an apex beside the chord, then on to p1 (heading
  // t1): two cubics meeting square to the chord. The apex's distance is solved so the curve holds
  // exactly the film the sprockets have fed it; the bend never folds into a crease.
  function cubic(a, ta, b, tb, arm, n, pts) {
    const c0 = [a[0] + ta[0] * arm, a[1] + ta[1] * arm];
    const c1 = [b[0] - tb[0] * arm, b[1] - tb[1] * arm];
    for (let i = pts.length ? 1 : 0; i <= n; i++) {
      const t = i / n;
      const s = 1 - t;
      pts.push([
        s * s * s * a[0] + 3 * s * s * t * c0[0] + 3 * s * t * t * c1[0] + t * t * t * b[0],
        s * s * s * a[1] + 3 * s * s * t * c0[1] + 3 * s * t * t * c1[1] + t * t * t * b[1],
      ]);
    }
    return pts;
  }
  function bulge(spec, h, n) {
    const { p0, t0, p1, t1 } = spec;
    const span = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
    const d = [(p1[0] - p0[0]) / span, (p1[1] - p0[1]) / span];
    const side = -d[1] * t0[0] + d[0] * t0[1] < 0 ? -1 : 1;
    const apex = [(p0[0] + p1[0]) / 2 - d[1] * side * h, (p0[1] + p1[1]) / 2 + d[0] * side * h];
    const pts = cubic(p0, t0, apex, d, 0.55 * Math.hypot(apex[0] - p0[0], apex[1] - p0[1]), n, []);
    return cubic(apex, d, p1, t1, 0.55 * Math.hypot(p1[0] - apex[0], p1[1] - apex[1]), n, pts);
  }
  function loopOf(spec, length) {
    let lo = 0;
    let hi = 300;
    for (let i = 0; i < 30; i++) {
      const mid = (lo + hi) / 2;
      if (lengthOf(bulge(spec, mid, 10)) < length) lo = mid;
      else hi = mid;
    }
    return bulge(spec, (lo + hi) / 2, 14);
  }

  // ---- the film as a ribbon ----
  const normalOf = (p, q) => {
    const t = G.unit3([q[0] - p[0], 0, q[1] - p[1]]);
    return [-t[2], 0, t[0]];
  };
  // wrap: +1 the outward side is the only one that can show (film on a sprocket or a pack)
  function ribbon(pts, { wrap = 0, centre = null } = {}) {
    const faces = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const p = pts[i];
      const q = pts[i + 1];
      let n = normalOf(p, q);
      if (centre) {
        const mid = [(p[0] + q[0]) / 2 - centre[0], 0, (p[1] + q[1]) / 2 - centre[1]];
        if (G.dot3(n, mid) < 0) n = G.mul3(n, -1);
      }
      let facing = G.dot3(n, V);
      if (wrap && facing <= 0) continue;
      if (facing < 0) {
        n = G.mul3(n, -1);
        facing = -facing;
      }
      faces.push({ i, quad: [at(xz(p[0], p[1], F1)), at(xz(q[0], q[1], F1)), at(xz(q[0], q[1], F0)), at(xz(p[0], p[1], F0))], tone: G.toneOf(n, P), d: depth(xz((p[0] + q[0]) / 2, (p[1] + q[1]) / 2, (F0 + F1) / 2)) });
    }
    return faces;
  }
  function ribbonSvg(pts, options = {}) {
    const faces = ribbon(pts, options);
    if (!faces.length) return "";
    const tone = options.tone ?? "hi";
    // A run on a sprocket or a straight span can't cross itself on screen: one path per tone
    // and its two edges.
    if (!options.loop) {
      const buckets = [[], [], [], [], []];
      for (const f of faces) buckets[Math.min(4, f.tone)].push(poly(f.quad));
      const runs = [];
      let run = null;
      for (const f of faces) {
        if (!run || f.i !== run.last + 1) runs.push((run = { pts: [pts[f.i]], last: f.i - 1 }));
        run.pts.push(pts[f.i + 1]);
        run.last = f.i;
      }
      const edges = runs.map((r) => line(r.pts.map(([x, z]) => at(xz(x, z, F1)))) + line(r.pts.map(([x, z]) => at(xz(x, z, F0))))).join("");
      const shades = buckets.slice(0, 4).map((b, n) => (b.length ? `<path class="iso-shade" data-shade="${n}" d="${b.join("")}"/>` : "")).join("");
      return `<g class="iso-solid pj-film" data-seamless=""><path class="iso-fill" d="${faces.map((f) => poly(f.quad)).join("")}"/>${shades}${buckets[4].length ? `<path class="iso-top" d="${buckets[4].join("")}"/>` : ""}<path class="iso-line iso-edge" data-tone="${tone}" d="${edges}"/></g>`;
    }
    // A loop can cross itself on screen, so faces go back to front, each with its own two
    // edge segments, and a nearer face covers a farther face's edges.
    const sorted = [...faces].sort((a, b) => a.d - b.d);
    const body = sorted
      .map((f) => {
        const cls = f.tone >= 4 ? `class="iso-top"` : `class="iso-shade" data-shade="${f.tone}"`;
        const [a, b, c, d] = f.quad;
        const ends = [];
        if (f.i === 0 && options.caps) ends.push(line([a, d]));
        if (f.i === pts.length - 2 && options.caps) ends.push(line([b, c]));
        return `<path ${cls} d="${poly(f.quad)}"/><path class="iso-line iso-edge" data-tone="${tone}" d="${line([a, b])}${line([d, c])}${ends.join("")}"/>`;
      })
      .join("");
    return `<g class="iso-solid pj-film" data-seamless=""${options.lit ? " data-lit" : ""}>${body}</g>`;
  }

  // Perforations and frame lines sit on the film by its own coordinate m, so they travel
  // with the material: m = offset + s − drive × frame length.
  const ROWS = [F1 - D.film.edge - D.film.perfW / 2, F0 + D.film.edge + D.film.perfW / 2];
  function marks(pts, m0, { wrap = 0, centre = null } = {}) {
    const holes = [];
    const lines = [];
    let s = 0;
    const pitch = D.film.pitch;
    const frame = pitch * 4;
    for (let i = 0; i < pts.length - 1; i++) {
      const p = pts[i];
      const q = pts[i + 1];
      const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
      if (len < 1e-6) continue;
      let n = normalOf(p, q);
      if (centre) {
        const mid = [(p[0] + q[0]) / 2 - centre[0], 0, (p[1] + q[1]) / 2 - centre[1]];
        if (G.dot3(n, mid) < 0) n = G.mul3(n, -1);
      }
      const facing = G.dot3(n, V);
      const visible = wrap ? facing > 0.05 : Math.abs(facing) > 0.05;
      if (visible) {
        const ma = m0 + s;
        const mb = ma + len;
        const tx = (q[0] - p[0]) / len;
        const tz = (q[1] - p[1]) / len;
        const lift = 0.06 * (facing > 0 ? 1 : -1);
        const off = (x, z, along, y) => at(xz(x + tx * along + n[0] * lift, z + tz * along + n[2] * lift, y));
        const po = D.frameLine + pitch / 2;
        for (let j = Math.ceil((ma - po) / pitch); j * pitch + po <= mb; j++) {
          const c = j * pitch + po - ma;
          const h = D.film.perfH / 2;
          if (c - h < 0 || c + h > len) continue;
          for (const y of ROWS) holes.push([off(p[0], p[1], c - h, y - D.film.perfW / 2), off(p[0], p[1], c + h, y - D.film.perfW / 2), off(p[0], p[1], c + h, y + D.film.perfW / 2), off(p[0], p[1], c - h, y + D.film.perfW / 2)]);
        }
        for (let j = Math.ceil((ma - D.frameLine) / frame); j * frame + D.frameLine <= mb; j++) {
          const c = j * frame + D.frameLine - ma;
          if (c < 0 || c > len) continue;
          lines.push([off(p[0], p[1], c, F0), off(p[0], p[1], c, F1)]);
        }
      }
      s += len;
    }
    return {
      holes: holes.map(poly).join(""),
      lines: lines.map(line).join(""),
    };
  }

  // ---- a flat part that turns in its own plane ----
  // Drawn once: a back copy (the far face, offset by the plate's thickness; it stands in for
  // the side walls) and the front face, both in the plane's local coordinates. Turning it
  // is two rotate() transforms plus the short silhouette lines where a wall turns away.
  function planeInfo(plane) {
    const { o, ex, ey, back } = plane;
    const s0 = at(o);
    const sx = [at(G.add3(o, ex))[0] - s0[0], at(G.add3(o, ex))[1] - s0[1]];
    const sy = [at(G.add3(o, ey))[0] - s0[0], at(G.add3(o, ey))[1] - s0[1]];
    const sb = [at(G.add3(o, back))[0] - s0[0], at(G.add3(o, back))[1] - s0[1]];
    const det = sx[0] * sy[1] - sx[1] * sy[0];
    const L = [(sb[0] * sy[1] - sb[1] * sy[0]) / det, (sx[0] * sb[1] - sx[1] * sb[0]) / det];
    const faceTone = Math.min(4, G.toneOf(G.mul3(G.unit3(back), -1), P));
    return { L, m: planeMatrix(o, ex, ey), faceTone };
  }
  function connectors(def, deg) {
    const { L } = planeInfo(def.plane);
    const a = (deg * Math.PI) / 180;
    const c = Math.cos(a);
    const sn = Math.sin(a);
    const rot = ([u, v]) => [u * c - v * sn, u * sn + v * c];
    const out = [];
    for (const ring0 of def.contours) {
      const ring = ring0.map(rot);
      let area = 0;
      for (let i = 0; i < ring.length; i++) {
        const p = ring[i];
        const q = ring[(i + 1) % ring.length];
        area += p[0] * q[1] - q[0] * p[1];
      }
      const turn = Math.sign(area) * (ring0.hole ? -1 : 1);
      const n = ring.length;
      const facing = ring.map((p, i) => {
        const q = ring[(i + 1) % n];
        const du = q[0] - p[0];
        const dv = q[1] - p[1];
        const world = G.add3(G.mul3(def.plane.ex, dv * turn), G.mul3(def.plane.ey, -du * turn));
        return G.dot3(world, V) > 1e-6;
      });
      for (let i = 0; i < n; i++) if (facing[i] !== facing[(i + n - 1) % n]) out.push(line([ring[i], [ring[i][0] + L[0], ring[i][1] + L[1]]]));
    }
    return out.join("");
  }
  function plateTurn(def, deg) {
    const { L } = planeInfo(def.plane);
    return { back: `translate(${L[0].toFixed(3)} ${L[1].toFixed(3)}) rotate(${deg.toFixed(2)})`, front: `rotate(${deg.toFixed(2)})`, conn: connectors(def, deg) };
  }
  function plateSvg(def, deg = 0) {
    const { m, faceTone } = planeInfo(def.plane);
    const face = def.contours.map(poly).join("");
    const t = plateTurn(def, deg);
    const tone = def.tone ?? "hi";
    const shownTone = def.face ?? faceTone;
    const faceClass = shownTone === 4 ? `class="iso-top"` : `class="iso-shade" data-shade="${shownTone}"`;
    return `<g class="iso-solid pj-plate" data-plate="${def.id}" transform="${m}"><g data-turn="back" transform="${t.back}"><path class="iso-fill" fill-rule="evenodd" d="${face}"/><path class="iso-shade" data-shade="${def.wall ?? 1}" fill-rule="evenodd" d="${face}"/><path class="iso-line iso-edge" data-tone="${tone}" d="${face}"/></g><path class="iso-line iso-edge" data-tone="${tone}" data-turn="conn" d="${t.conn}"/><g data-turn="front" transform="${t.front}"><path class="iso-fill" fill-rule="evenodd" d="${face}"/><path ${faceClass} fill-rule="evenodd" d="${face}"/>${def.extra ?? ""}<path class="iso-line iso-edge" data-tone="${tone}" d="${face}"/></g></g>`;
  }

  // ---- the Geneva wheel: four slots, four locking arcs ----
  function crossContour(turn) {
    const GW = D.geneva;
    const pts = [];
    const a = GW.a;
    const w = GW.slot / 2;
    const inner = GW.c - a;
    for (let q = 0; q < 4; q++) {
      const slot = turn + GW.slotAt + q * (TAU / 4);
      const cs = Math.cos(slot);
      const sn = Math.sin(slot);
      const rot = (u, v) => [u * cs - v * sn, u * sn + v * cs];
      pts.push(rot(GW.rim, -w));
      for (let s = GW.rim; s > inner; s -= 2) pts.push(rot(s, -w));
      for (let i = 0; i <= 8; i++) {
        const t = (i / 8) * Math.PI;
        pts.push(rot(inner - w * Math.sin(t), -w * Math.cos(t)));
      }
      for (let s = inner + 2; s <= GW.rim; s += 2) pts.push(rot(s, w));
      pts.push(rot(GW.rim, w));
      const mid = slot + TAU / 8;
      const cx = GW.c * Math.cos(mid);
      const cz = GW.c * Math.sin(mid);
      const start = Math.atan2(GW.rim * Math.sin(slot) + w * Math.cos(slot) - cz, GW.rim * Math.cos(slot) - w * Math.sin(slot) - cx);
      const next = slot + TAU / 4;
      const end = Math.atan2(GW.rim * Math.sin(next) - w * Math.cos(next) - cz, GW.rim * Math.cos(next) + w * Math.sin(next) - cx);
      let a0 = start;
      let a1 = end;
      while (a1 > a0) a1 -= TAU;
      for (let i = 1; i < 14; i++) {
        const t = a0 + ((a1 - a0) * i) / 14;
        pts.push([cx + GW.lock * Math.cos(t), cz + GW.lock * Math.sin(t)]);
      }
    }
    return pts.map(([x, z]) => [x, -z]);
  }
  function crossDef() {
    const GW = D.geneva;
    const ring = circlePts(0, 0, GW.hub + 2.2, 28);
    const nut = circlePts(0, 0, GW.hub, 6);
    const dotsAt = [0, 1, 2, 3].map((q) => {
      const t = GW.slotAt + TAU / 8 + q * (TAU / 4);
      return [(GW.hub + 6) * Math.cos(t), -(GW.hub + 6) * Math.sin(t)];
    });
    const extra = `<path class="iso-line" data-tone="lo" d="${poly(ring)}"/><path class="iso-line" data-tone="mid" d="${poly(nut)}"/><g class="iso-dots" data-tone="mid">${dotsAt.map(([u, v]) => `<circle cx="${f1(u)}" cy="${f1(v)}" r="0.7"/>`).join("")}</g>`;
    return { id: "cross", contours: [crossContour(0)], plane: { o: [GW.x, GW.y1, GW.z], ex: [1, 0, 0], ey: [0, 0, -1], back: [0, -(GW.y1 - GW.y0), 0] }, tone: "mid", extra };
  }
  function circlePts(cu, cv, r, n) {
    return Array.from({ length: n }, (_, i) => [cu + r * Math.cos((i / n) * TAU), cv + r * Math.sin((i / n) * TAU)]);
  }

  // The driver: a locking disc with its relief cut toward the pin, and the pin on its crank.
  function lockContour(angle) {
    const GW = D.geneva;
    const lockR = GW.lock - GW.clear;
    const pinAt = [GW.a * Math.cos(angle), GW.a * Math.sin(angle)];
    const cx = pinAt[0] * GW.reliefAt;
    const cz = pinAt[1] * GW.reliefAt;
    const disc = [];
    const n = 96;
    for (let i = 0; i < n; i++) {
      const t = (i / n) * TAU;
      let p = [lockR * Math.cos(t), lockR * Math.sin(t)];
      if (Math.hypot(p[0] - cx, p[1] - cz) < GW.relief) {
        const dir = Math.atan2(p[1] - cz, p[0] - cx);
        p = [cx + GW.relief * Math.cos(dir), cz + GW.relief * Math.sin(dir)];
      }
      disc.push(p);
    }
    return disc;
  }
  const DRIVER_REST = (3 * Math.PI) / 4;
  function crankDef() {
    const GW = D.geneva;
    const bolt = [0, 1, 2].map((q) => {
      const t = DRIVER_REST + Math.PI + (q - 1) * 0.5;
      return [(GW.a - 1) * Math.cos(t), -(GW.a - 1) * Math.sin(t)];
    });
    return { id: "crank", contours: [circlePts(0, 0, GW.a + 5, 64)], plane: { o: [GW.dx, GW.dy0 + 3, GW.z], ex: [1, 0, 0], ey: [0, 0, -1], back: [0, -3, 0] }, tone: "mid", extra: `<g class="iso-dots" data-tone="mid">${bolt.map(([u, v]) => `<circle cx="${f1(u)}" cy="${f1(v)}" r="0.7"/>`).join("")}</g>` };
  }
  function lockDef() {
    const GW = D.geneva;
    const hub = circlePts(0, 0, 2.2, 20);
    return { id: "lock", contours: [lockContour(DRIVER_REST).map(([x, z]) => [x, -z])], plane: { o: [GW.dx, GW.y1, GW.z], ex: [1, 0, 0], ey: [0, 0, -1], back: [0, -(GW.y1 - GW.dy0 - 3), 0] }, tone: "mid", extra: `<path class="iso-line" data-tone="lo" d="${poly(hub)}"/>` };
  }
  function pinSvg() {
    const GW = D.geneva;
    const pinF = G.frameAlong([GW.dx + GW.a * Math.cos(DRIVER_REST), GW.dy0 + 3, GW.z + GW.a * Math.sin(DRIVER_REST)], [0, 1, 0]);
    return k.solidSvg(G.disc(0, GW.y1 - GW.dy0 - 3 + 1.2, GW.pin, pinF, P, { steps: 20 }), { tone: "hi" });
  }
  // The pin keeps its picture as it circles, so it only moves: the screen shift from rest.
  function pinShift(angle) {
    const GW = D.geneva;
    const a = at([GW.dx + GW.a * Math.cos(DRIVER_REST), GW.dy0 + 3, GW.z + GW.a * Math.sin(DRIVER_REST)]);
    const b = at([GW.dx + GW.a * Math.cos(angle), GW.dy0 + 3, GW.z + GW.a * Math.sin(angle)]);
    return `translate(${(b[0] - a[0]).toFixed(2)} ${(b[1] - a[1]).toFixed(2)})`;
  }

  // ---- the hand crank: an arm in the plane of the motor's rear face, a handle at its end ----
  function handCrankDef() {
    const H = D.handCrank;
    const pts = [];
    for (let i = 0; i <= 14; i++) {
      const t = Math.PI / 2 + (i / 14) * Math.PI;
      pts.push([6 * Math.cos(t), 6 * Math.sin(t)]);
    }
    for (let i = 0; i <= 14; i++) {
      const t = -Math.PI / 2 + (i / 14) * Math.PI;
      pts.push([H.arm + 4.4 * Math.cos(t), 4.4 * Math.sin(t)]);
    }
    return { id: "handcrank", contours: [pts], plane: { o: H.o, ex: [0, 1, 0], ey: [0, 0, -1], back: [H.t, 0, 0] }, tone: "mid", extra: `<g class="iso-dots" data-tone="mid"><circle cx="0" cy="0" r="1.1"/></g>` };
  }
  function handleSvg() {
    const H = D.handCrank;
    const F = G.frameAlong([H.o[0], H.o[1] + H.arm, H.o[2]], [-1, 0, 0]);
    return k.solidSvg(G.solidOf([[0, 2], [2.6, 2], [2.6, 3.2, 1], [12, 3.6, 1], [15, 2.9, 1], [16, 0]], F, P, { smooth: true }), { tone: "hi" });
  }
  function handleShift(deg) {
    const H = D.handCrank;
    const a = (deg * Math.PI) / 180;
    const rest = at([H.o[0], H.o[1] + H.arm, H.o[2]]);
    const now = at([H.o[0], H.o[1] + H.arm * Math.cos(a), H.o[2] - H.arm * Math.sin(a)]);
    return `translate(${(now[0] - rest[0]).toFixed(2)} ${(now[1] - rest[1]).toFixed(2)})`;
  }

  // ---- shutter: n blades, each a quarter turn plus the beam crossing ----
  function bladeContours(turn, blades) {
    const SH = D.shutter;
    const half = ((D.blade + D.crossing) / 2) * TAU;
    const out = [];
    for (let b = 0; b < blades; b++) {
      const centre = turn + (b / blades) * TAU;
      const pts = [];
      const n = 40;
      for (let i = 0; i <= n; i++) {
        const t = centre - half + (2 * half * i) / n;
        pts.push([SH.r * Math.sin(t), -SH.r * Math.cos(t)]);
      }
      for (let i = n; i >= 0; i--) {
        const t = centre - half + (2 * half * i) / n;
        pts.push([SH.hub * Math.sin(t), -SH.hub * Math.cos(t)]);
      }
      out.push(pts);
    }
    const hub = circlePts(0, 0, SH.hub + 0.5, 48);
    return { blades: out, hub };
  }
  function shutterDefs(blades) {
    const SH = D.shutter;
    const plane = { o: [SH.x0, SH.y, SH.z], ex: [0, 1, 0], ey: [0, 0, -1], back: [SH.x1 - SH.x0, 0, 0] };
    const { blades: shapes, hub } = bladeContours(0, blades);
    const bore = circlePts(0, 0, 2.6, 18);
    bore.hole = true;
    const rivets = shapes.flatMap((_, b) => {
      const centre = (b / blades) * TAU;
      return [-0.18, 0.18].map((da) => [(SH.hub + 3) * Math.sin(centre + da), -(SH.hub + 3) * Math.cos(centre + da)]);
    });
    const half = ((D.blade + D.crossing) / 2) * TAU;
    const ribs = shapes
      .map((_, b) => {
        const centre = (b / blades) * TAU;
        return [SH.r - 6, SH.hub + 9]
          .map((r) => line(Array.from({ length: 33 }, (_, i) => {
            const t = centre - half + (2 * half * i) / 32;
            return [r * Math.sin(t), -r * Math.cos(t)];
          })))
          .join("");
      })
      .join("");
    return [
      { id: "shutter", contours: [...shapes, bore], plane, tone: "mid", face: 1, extra: `<path class="iso-line" data-tone="faint" d="${ribs}"/>` },
      { id: "shutter-hub", contours: [hub, bore], plane: { ...plane, o: [SH.x0 - 1.4, SH.y, SH.z], back: [1.4, 0, 0] }, tone: "mid", extra: `<g class="iso-dots" data-tone="mid">${rivets.map(([u, v]) => `<circle cx="${f1(u)}" cy="${f1(v)}" r="0.65"/>`).join("")}</g>` },
    ];
  }

  // ---- teeth on a sprocket rim, turning with it ----
  function teethSvg(s, deg = 0) {
    const m = planeMatrix([s.x, s.toothY, s.z], [1, 0, 0], [0, 0, -1]);
    const ticks = [];
    for (let i = 0; i < s.teeth; i++) {
      const t = (i / s.teeth) * TAU;
      const c = Math.cos(t);
      const sn = Math.sin(t);
      ticks.push([[s.r * c, -s.r * sn], [(s.r + 1.27) * c, -(s.r + 1.27) * sn]]);
    }
    return `<g transform="${m}"><g data-turn="front" transform="rotate(${deg.toFixed(2)})"><path class="iso-line pj-teeth" data-tone="mid" d="${ticks.map(line).join("")}"/></g></g>`;
  }

  // ---- spokes and windows of a reel flange ----
  function flangeDef(id, reel) {
    const plane = { o: [reel.x, reel.y1, reel.z], ex: [1, 0, 0], ey: [0, 0, -1], back: [0, -1.6, 0] };
    const rim = circlePts(0, 0, reel.r, 120);
    const windows = [];
    for (let w = 0; w < 4; w++) {
      const c = (w / 4) * TAU;
      const pts = [];
      const r0 = reel.hub + 6;
      const r1 = reel.r - 9;
      const span = 0.52;
      for (let i = 0; i <= 14; i++) pts.push([r1 * Math.cos(c - span + (2 * span * i) / 14), -r1 * Math.sin(c - span + (2 * span * i) / 14)]);
      const s0 = 0.42;
      for (let i = 14; i >= 0; i--) pts.push([r0 * Math.cos(c - s0 + (2 * s0 * i) / 14), -r0 * Math.sin(c - s0 + (2 * s0 * i) / 14)]);
      pts.hole = true;
      windows.push(pts);
    }
    const bore = circlePts(0, 0, reel.hub - 3, 24);
    bore.hole = true;
    const ring = circlePts(0, 0, reel.r - 3.2, 96);
    return { id: `flange-${id}`, contours: [rim, ...windows, bore], plane, tone: "mid", extra: `<path class="iso-line" data-tone="faint" d="${poly(ring)}"/>` };
  }

  // ---- the SMPTE universal leader frame, drawn in a face plane (u right, v down) ----
  function leaderSvg(frame, w, h, { mirror = false } = {}) {
    const n = frame.number;
    const r0 = Math.min(w, h) * 0.42;
    const r1 = r0 * 0.82;
    const sweep = frame.sweep;
    let wedge = "";
    if (n && sweep > 0.001) {
      const a1 = -Math.PI / 2 + sweep * TAU;
      const big = sweep > 0.5 ? 1 : 0;
      const R = Math.hypot(w, h);
      wedge = `<path class="pj-sweep" d="M0 0L0 ${f1(-R)}A${f1(R)} ${f1(R)} 0 ${big} 1 ${f1(R * Math.cos(a1))} ${f1(R * Math.sin(a1))}Z"/>`;
    }
    const flip = mirror ? ` transform="scale(-1 -1)"` : "";
    const art = n
      ? `<g${flip}><clipPath id="pj-clip-${D.uid}-${mirror ? "m" : "s"}"><rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}"/></clipPath><g clip-path="url(#pj-clip-${D.uid}-${mirror ? "m" : "s"})">${wedge}</g><circle class="pj-ring" r="${f1(r0)}"/><circle class="pj-ring" r="${f1(r1)}"/><path class="pj-cross" d="M${f1(-w / 2)} 0H${f1(w / 2)}M0 ${f1(-h / 2)}V${f1(h / 2)}"/><text class="pj-number" x="0" y="${f1(r1 * 0.36)}" font-size="${f1(r1 * 1.05)}" text-anchor="middle">${n}</text></g>`
      : "";
    return `<rect class="${n ? "pj-frame-bg" : "pj-frame-black"}" x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}"/>${art}`;
  }

  // The gate as the lamp sees it through the aperture: the leader upside down, frame n
  // settled in the window, sliding one frame down during each pull-down.
  function gateFrameSvg(i, leaderAt) {
    const FL = D.frameLength;
    const n = Math.floor(i + 1e-9);
    const slide = i - n;
    const w = D.win.w;
    const frames = [-1, 0, 1].map((j) => {
      const v = (slide - j) * FL;
      return `<g transform="translate(0 ${v.toFixed(2)})"><g transform="rotate(180)">${leaderSvg(leaderAt(n + j), w + 0.5, FL - 1.2)}</g><path class="pj-frameline" d="M${f1(-w)} ${f1(FL / 2)}H${f1(w)}"/></g>`;
    });
    return `<rect class="pj-film-face" x="${f1(-w)}" y="${f1(-FL * 2)}" width="${f1(w * 2)}" height="${f1(FL * 4)}"/>${frames.join("")}`;
  }

  return { handCrankDef, handleSvg, handleShift, crossContour, lockContour, planeMatrix, tangent, angleOf, arc, straight, lengthOf, join, loopOf, ribbonSvg, marks, plateSvg, plateTurn, crossDef, crankDef, lockDef, pinSvg, pinShift, shutterDefs, teethSvg, flangeDef, leaderSvg, gateFrameSvg, circlePts, poly, line, depth };
}
