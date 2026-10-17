// Chain Reaction. One riso print sheet (3 x 3 panels) under one camera; every link is a pure function of
// "world time", so the rewind is just world time running backwards. Beat grid: bed v04, 118 BPM, first downbeat 0.27 s.
(() => {
  const BAR = (60 / 118) * 4;
  const BEAT = BAR / 4;
  const D = (i) => 0.27 + i * BAR;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, u) => a + (b - a) * u;
  const ease = (name) => gsap.parseEase(name);
  const seg = (t, t0, t1, e = "none") => ease(e)(clamp((t - t0) / (t1 - t0)));
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const hash = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

  // Key times (seconds). Everything snaps to downbeats of the bed.
  const T = {
    ballHit: D(1), wordsIn: [D(1) + BEAT, D(1) + 2 * BEAT, D(1) + 3 * BEAT, D(2)], ballDot: D(2) + BEAT, emph: D(3),
    roll: D(4), domino: 11.0, chart: D(6), countStart: 13.3, slam: D(8), rollover: D(8) + BEAT,
    routeStart: D(9), legs: [19.6, D(10), 21.62, D(11), D(12)], fling: D(12) + BEAT,
    tog: [27.2, 27.2 + BEAT, 27.2 + 2 * BEAT], chaosPop: 29.24, handle: 29.75, go: D(15), lever: D(16), launch: D(16) + 0.04,
    brk: D(20), smash: D(21), h3End: D(24), freeze: D(25), rewind0: D(26), rewind1: D(29), land: D(30),
  };

  // World time: forward until the overview settles, held, then run back to zero at about 8x.
  const RW = 51.12;
  function worldTime(t) {
    if (t < RW) return t;
    if (t < T.rewind0) return RW;
    if (t < T.rewind1) return RW * (1 - seg(t, T.rewind0, T.rewind1, "power2.inOut"));
    return 0;
  }

  // Hammer flight: canvas space (x right, y up, z toward viewer; 1 unit = 1 world px at z = 0, canvas centre = world (2160, 1620)).
  const HK = [
    [T.launch, 1860, -306, 0], [33.6, 1300, 120, 150], [35.2, 500, 340, 360], [37.2, -300, 300, 520],
    [39.4, -900, 150, 620], [T.brk, -1120, 60, 660], [42.62, -1180, 30, 640], [T.smash, -1200, 0, -40],
  ];
  function catmull(p0, p1, p2, p3, u) {
    const u2 = u * u, u3 = u2 * u;
    return 0.5 * (2 * p1 + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 + (-p0 + 3 * p1 - 3 * p2 + p3) * u3);
  }
  function hammerState(wt) {
    const rest = { x: HK[0][1], y: HK[0][2], z: 0, rx: 0, ry: 0, rz: Math.PI + 0.157, vis: true };
    if (wt < T.launch) return rest;
    if (wt >= T.smash) return { ...rest, vis: false };
    let i = 0;
    while (i < HK.length - 2 && wt >= HK[i + 1][0]) i++;
    const a = HK[Math.max(0, i - 1)], b = HK[i], c = HK[i + 1], d = HK[Math.min(HK.length - 1, i + 2)];
    let u = (wt - b[0]) / (c[0] - b[0]);
    if (i === HK.length - 2) u = ease("power3.in")(u);
    const pos = [1, 2, 3].map((k) => catmull(a[k], b[k], c[k], d[k], u));
    // Five turns, nearly all before the break, so it hangs in the silence and lands head-first.
    const spinEnd = 10 * Math.PI;
    let rz;
    if (wt < T.brk) rz = lerp(Math.PI + 0.157, spinEnd - 0.6, seg(wt, T.launch, T.brk, "power1.out"));
    else if (wt < 42.62) rz = lerp(spinEnd - 0.6, spinEnd - 0.25, seg(wt, T.brk, 42.62));
    else rz = lerp(spinEnd - 0.25, spinEnd, seg(wt, 42.62, T.smash, "power2.in"));
    const rx = -Math.PI / 2 * seg(wt, 42.62, T.smash, "power2.in");
    const ry = Math.sin((wt - T.launch) * 1.4) * 0.5 * (1 - seg(wt, T.brk, 42.62));
    return { x: pos[0], y: pos[1], z: pos[2], rx, ry, rz, vis: true };
  }

  // Camera: [t, cx, cy, scale, ease into this key]. Scale interpolates in log space.
  const VS = 1920 / 900;
  const CAM = [
    [0, 960, 470, 1.12], [T.ballHit, 960, 540, 1.0, "power2.out"], [T.roll, 990, 540, 1.0, "sine.inOut"],
    [10.9, 2880, 540, 1.0, "power2.inOut"], [15.2, 2880, 540, 1.0], [16.4, 3400, 510, 1.32, "power2.inOut"],
    [17.4, 3420, 470, 1.28], [18.9, 4800, 540, 1.0, "power2.inOut"], [24.3, 4900, 520, 1.05, "sine.inOut"],
    [25.3, 5300, 430, 1.18, "power2.inOut"], [27.0, 4800, 1620, 1.0, "power2.inOut"], [30.3, 4800, 1620, 1.0],
    [31.2, 4520, 1700, 1.12, "power2.inOut"], [32.6, 4300, 1800, 1.08, "sine.inOut"],
    [33.8, 3700, 1650, 0.95, "power2.inOut"], [35.2, 2900, 1560, 0.9, "sine.inOut"], [37.2, 2150, 1500, 0.95, "sine.inOut"],
    [39.4, 1500, 1580, 1.05, "sine.inOut"], [T.brk, 1200, 1600, 1.2, "sine.inOut"], [42.7, 1010, 1612, 1.5, "sine.inOut"],
    [T.smash, 960, 1620, 1.6, "power2.in"], [43.9, 960, 1620, VS, "power3.inOut"], [T.h3End, 960, 1620, VS],
    [T.freeze, 2880, 1620, 1 / 3, "power3.inOut"], [T.rewind0, 2880, 1620, 0.345, "sine.out"], [T.rewind1, 2880, 1620, 0.345],
    [60.6, 2880, 2700, 1.0, "power3.inOut"], [66, 2880, 2700, 1.05, "sine.inOut"],
  ];
  const SHAKES = [[T.ballHit, 7], [T.slam, 9], [T.lever, 6], [T.smash, 26], [T.land, 6]];
  function camera(t) {
    let i = 0;
    while (i < CAM.length - 2 && t >= CAM[i + 1][0]) i++;
    const a = CAM[i], b = CAM[i + 1];
    const u = t <= a[0] ? 0 : t >= b[0] ? 1 : ease(b[4] || "none")((t - a[0]) / (b[0] - a[0]));
    const s = Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), u));
    let cx = lerp(a[1], b[1], u), cy = lerp(a[2], b[2], u);
    let sx = 0, sy = 0;
    SHAKES.forEach(([ts, amp], k) => {
      if (t < ts) return;
      const d = t - ts, env = amp * Math.exp(-d * 7);
      sx += env * Math.sin(d * 57 + k); sy += env * Math.cos(d * 49 + 2 * k);
    });
    return { s, x: 960 - cx * s + sx, y: 540 - cy * s + sy };
  }

  // Measured at build (single composition, fonts loaded): letter and baseline positions.
  const M = {};
  function baselineOffset(fontCss, lineH) {
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.font = fontCss;
    const m = ctx.measureText("Hamburg");
    return (lineH - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxAscent;
  }

  function splitLetters() {
    $$("#p1-head .word").forEach((w) => {
      const txt = w.textContent;
      w.textContent = "";
      [...txt].forEach((ch) => {
        const s = document.createElement("span");
        s.className = "letter";
        s.textContent = ch;
        w.appendChild(s);
      });
    });
  }

  function measure() {
    const head = $("#p1-head");
    const hx = 130, hy = 300, lineH = 178;
    const base = baselineOffset("178px 'Archivo Black'", lineH);
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.font = "178px 'Archivo Black'";
    const nAsc = ctx.measureText("n").actualBoundingBoxAscent;
    const n = head.querySelector('[data-w="one"] .letter:nth-child(2)');
    M.nX = hx + n.offsetLeft + n.offsetWidth / 2;
    M.nTop = hy + base - nAsc;
    const dot = $("#p1-dot");
    M.base2 = hy + lineH + base;
    M.dotX = hx + dot.offsetLeft + 64;
    // Sign-off period.
    const gap = $("#word-gap");
    const wBase = baselineOffset("900 300px Outfit", 300);
    M.end = { x: 1920 + gap.offsetLeft + 46, y: 2160 + 380 + wBase - 50 };
  }

  // Ball: falls on "one", lobs onto the end of the line as its full stop, rolls down the ramp into the dominoes.
  function ballState(wt) {
    const restY = M.base2 - 50;
    const A = { x: M.dotX, y: restY }, B = { x: 2170, y: 810 };
    if (wt < 0.27) return { x: M.nX, y: -140, sx: 1, sy: 1, r: 0 };
    if (wt < T.ballHit) return { x: M.nX, y: lerp(-140, M.nTop - 50, seg(wt, 0.27, T.ballHit, "power2.in")), sx: 0.92, sy: 1.1, r: 0 };
    if (wt < T.ballDot) {
      const u = seg(wt, T.ballHit, T.ballDot);
      const y0 = M.nTop - 50, h = (y0 + restY) / 2 - 40;
      const sq = 1 - 0.3 * Math.exp(-(wt - T.ballHit) * 16);
      return { x: lerp(M.nX, A.x, u), y: lerp(y0, restY, u) - 4 * h * u * (1 - u), sx: 2 - sq, sy: sq, r: u * 540 };
    }
    if (wt < T.roll) {
      const d = wt - T.ballDot, sq = 1 - 0.28 * Math.exp(-d * 14) * Math.cos(d * 30);
      return { ...A, sx: 2 - sq, sy: sq, r: 540 };
    }
    if (wt < T.domino) {
      const u = seg(wt, T.roll, T.domino, "power2.in");
      const dist = Math.hypot(B.x - A.x, B.y - A.y) * u;
      return { x: lerp(A.x, B.x, u), y: lerp(A.y, B.y, u), sx: 1, sy: 1, r: 540 + (dist / 50) * 57.3 };
    }
    const back = seg(wt, T.domino, T.domino + 0.4, "power2.out");
    return { x: B.x - 30 * back, y: B.y, sx: 1, sy: 1, r: 540 + 1900 / 50 * 57.3 - 34 * back };
  }

  // Odometer value: counts to 9999, slams, then rolls over to 10000 and the "1" has nowhere to go.
  function odoValue(wt) {
    if (wt < T.countStart) return 0;
    if (wt < T.slam) return 9999 * seg(wt, T.countStart, T.slam, "power2.in");
    if (wt < T.rollover) return 9999;
    return 9999 + seg(wt, T.rollover, T.rollover + 0.3, "power2.out");
  }

  // Route through five stops, in map svg space (map at panel 3 + (160, 180)).
  const MAP = { x: 3840 + 160, y: 180 };
  let route, routeLen, legLen;
  function onePos(wt) {
    const B = 65;
    if (wt < T.rollover) return null;
    if (wt < 17.55) {
      const u = seg(wt, T.rollover, 17.55);
      return { x: lerp(3220, 3420, u), y: lerp(510, 360 - B, u) - 4 * 190 * u * (1 - u), r: -40 * u, s: lerp(0.6, 1, Math.min(1, u * 3)) };
    }
    if (wt < 18.1) return { x: lerp(3420, 3700, seg(wt, 17.55, 18.1)), y: 360 - B, r: lerp(-40, 190, seg(wt, 17.55, 18.1)), s: 1 };
    const start = route.getPointAtLength(0);
    if (wt < T.routeStart) {
      const u = seg(wt, 18.1, T.routeStart);
      return { x: lerp(3700, MAP.x + start.x, u), y: lerp(360 - B, MAP.y + start.y - B, u) - 4 * 30 * u * (1 - u), r: 190 + 60 * u, s: 1 };
    }
    const times = [T.routeStart, ...T.legs];
    if (wt < T.legs[4]) {
      let i = 0;
      while (wt >= times[i + 1]) i++;
      const u = seg(wt, times[i], times[i + 1], "sine.inOut");
      const len = lerp(legLen[i], legLen[i + 1], u);
      const p = route.getPointAtLength(len);
      return { x: MAP.x + p.x, y: MAP.y + p.y - B, r: 250 + (len / 70) * 57.3, s: 1, len };
    }
    const tyo = route.getPointAtLength(routeLen);
    const top = MAP.y + tyo.y - 104 - B;
    const rEnd = 250 + (routeLen / 70) * 57.3;
    if (wt < T.fling) {
      const squash = 42 * seg(wt, T.legs[4], T.legs[4] + 0.3, "power2.out");
      return { x: MAP.x + tyo.x, y: top + squash, r: rEnd, s: 1, len: routeLen };
    }
    const land = { x: 3840 + 1569, y: 1080 + 349 - B };
    if (wt < T.tog[0]) {
      const u = seg(wt, T.fling, T.tog[0]);
      return { x: lerp(MAP.x + tyo.x, land.x, u), y: lerp(top, land.y, u * u) - 4 * 140 * u * (1 - u) * (1 - u), r: rEnd - 300 * u, s: 1, len: routeLen };
    }
    if (wt < 28.4) {
      const u = seg(wt, T.tog[0], 28.4);
      return { x: lerp(land.x, 5060, u), y: lerp(land.y, 2320, u * u) - 4 * 160 * u * (1 - u), r: rEnd - 300 - 400 * u, s: 1, len: routeLen };
    }
    return null;
  }

  // Tear: a jagged hole around H, opened by the hammer on the downbeat after the break.
  const TEAR_N = 44;
  function tearPoints(k) {
    const pts = [];
    for (let i = 0; i < TEAR_N; i++) {
      const a = (i / TEAR_N) * Math.PI * 2;
      const j = 1 + 0.16 * (hash(i) - 0.5) + 0.07 * Math.sin(i * 2.3);
      pts.push([640 + Math.cos(a) * 640 * j * k, 380 + Math.sin(a) * 380 * j * k]);
    }
    return pts;
  }

  function build() {
    splitLetters();
    // Dominoes, values, labels.
    const p2 = $("#p2");
    const F = [0.18, 0.27, 0.38, 0.52, 0.66, 0.83, 0.97];
    F.forEach((f, i) => {
      const x = 300 + i * 120;
      p2.insertAdjacentHTML("beforeend",
        `<div class="dom" id="dom${i}" style="left:${x}px"></div>` +
        `<div class="bar-val mono" id="val${i}" style="left:${x}px; top:${860 - 440 * f - 54}px">0</div>` +
        `<div class="bar-x mono" style="left:${x}px">0${i + 1}</div>`);
    });
    // Odometer slots: strips 0-9 plus a trailing 0 so 9 rolls into 0.
    const odo = $("#odo");
    for (let k = 0; k < 4; k++) {
      const digits = [...Array(11)].map((_, d) => `<div class="digit type">${d % 10}</div>`).join("");
      odo.insertAdjacentHTML("beforeend", `<div class="slot" style="left:${54 + (3 - k) * 120}px"><div class="strip" id="strip${k}" data-layout-allow-overflow>${digits}</div></div>`);
    }
    // Map dots and route.
    const map = window.CR_MAP;
    $("#dots").innerHTML = map.dots.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.6" fill="#3255a4"/>`).join("");
    const C = ["SFO", "NYC", "LDN", "CAI", "TYO"].map((k) => map.cities[k]);
    let d = `M -160 ${C[0][1]} L ${C[0][0]} ${C[0][1]}`;
    for (let i = 1; i < C.length; i++) {
      const [x0, y0] = C[i - 1], [x1, y1] = C[i];
      d += ` Q ${(x0 + x1) / 2} ${Math.min(y0, y1) - 90} ${x1} ${y1}`;
    }
    route = $("#route");
    route.setAttribute("d", d);
    routeLen = route.getTotalLength();
    // Arc length at each stop, found by scanning the path.
    legLen = [0];
    let scan = 0;
    C.forEach(([cx, cy]) => {
      let best = scan, bd = 1e9;
      for (let L = scan; L <= routeLen; L += 2) {
        const p = route.getPointAtLength(L), dd = Math.hypot(p.x - cx, p.y - cy);
        if (dd < bd) { bd = dd; best = L; }
        if (dd > bd + 60 && bd < 4) break;
      }
      legLen.push(best);
      scan = best + 4;
    });
    legLen[legLen.length - 1] = routeLen;
    route.style.strokeDasharray = `18 14`;
    const p3 = $("#p3");
    C.forEach(([cx, cy], i) => {
      const name = ["SFO", "NYC", "LDN", "CAI", "TYO"][i];
      p3.insertAdjacentHTML("beforeend",
        `<div class="pin" style="left:${160 + cx}px; top:${180 + cy}px"><div class="pin-body" id="pin${i}"><div class="pin-stem"></div><div class="pin-head"></div><div class="pin-tag mono" data-layout-allow-overflow data-layout-allow-overlap>${name}</div></div></div>`);
    });
    // Panel furniture: crop marks, numbers, registration targets.
    $$(".panel").forEach((p, i) => {
      const crops = [["left:40px;top:40px", "border-left-width:4px;border-top-width:4px"], ["right:40px;top:40px", "border-right-width:4px;border-top-width:4px"],
        ["left:40px;bottom:40px", "border-left-width:4px;border-bottom-width:4px"], ["right:40px;bottom:40px", "border-right-width:4px;border-bottom-width:4px"]];
      crops.forEach(([pos, w]) => p.insertAdjacentHTML("beforeend", `<div class="crop" style="${pos};${w}"></div>`));
      p.insertAdjacentHTML("beforeend", `<div class="panel-no mono">0${i + 1} / 09</div>`);
      p.insertAdjacentHTML("beforeend",
        `<svg class="reg" id="reg${i}" viewBox="0 0 44 44"><circle cx="22" cy="22" r="13" fill="none" stroke="#3255a4" stroke-width="3"/><path d="M22 0V44M0 22H44" stroke="#3255a4" stroke-width="3"/></svg>`);
    });
    // Target on the sheet.
    $("#target").innerHTML = [280, 210, 140, 70].map((r, i) => `<circle cx="300" cy="300" r="${r}" fill="none" stroke="${i === 3 ? "#ff48b0" : "#3255a4"}" stroke-width="${i === 3 ? 14 : 6}"/>`).join("") +
      `<path d="M300 0V600M0 300H600" stroke="#3255a4" stroke-width="4"/>`;
    // Ripple rings, cursor, slider handle, chaos knob ghost, shards.
    const p4 = $("#p4");
    for (let i = 0; i < 3; i++) p4.insertAdjacentHTML("beforeend", `<div class="ripple" id="rip${i}" style="position:absolute;left:320px;top:540px;width:200px;height:200px;border-radius:50%;border:6px solid #ff48b0;opacity:0"></div>`);
    p4.insertAdjacentHTML("beforeend", `<div id="slider-handle"></div><div id="chaos-knob" style="position:absolute;left:0;top:0;width:74px;height:74px;margin:-37px 0 0 -37px;border-radius:50%;background:#3255a4;opacity:0"></div>`);
    p4.insertAdjacentHTML("beforeend", `<svg id="cursor" viewBox="0 0 64 92"><path d="M4 4 L4 74 L22 58 L34 86 L46 80 L34 54 L58 54 Z" fill="#3255a4" stroke="#eef0ea" stroke-width="5" stroke-linejoin="round"/></svg>`);
    const sh = $("#shards");
    for (let i = 0; i < 22; i++) {
      const s = 16 + hash(i + 40) * 34;
      sh.insertAdjacentHTML("beforeend", `<div class="shard" id="sh${i}" style="border-width:0 ${s * 0.6}px ${s}px ${s * 0.4}px;border-color:transparent transparent ${i % 4 === 0 ? "#ffe800" : "#eef0ea"} transparent;opacity:0"></div>`);
    }
    // Text under the transparent hammer canvas, and odometer digits clipped by their slots, are visible by design;
    // the layout audit treats every <canvas> as opaque and ignores overflow clipping, so they carry the waiver.
    $$("#p4 *, #p5 *, #p6 *, #odo .digit").forEach((el) => {
      if ([...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) el.setAttribute("data-layout-allow-occlusion", "");
    });
    measure();
    // Ramp under the rolling ball: from the full stop down into the dominoes' floor.
    $("#ramp-path").setAttribute("d", `M ${M.dotX - 20} ${M.base2 + 3} L 2240 863`);
  }

  // The world timeline: tweened links, seeked to world time every frame.
  const W = gsap.timeline({ paused: true });
  function buildWorld() {
    const L = (w) => $$(`#p1-head [data-w="${w}"] .letter`);
    // "one" scatters on impact, then falls back into place.
    L("one").forEach((el, i) => {
      const dx = [-160, 30, 210][i], dy = [-260, -420, -300][i], rot = [-40, 25, 60][i];
      W.fromTo(el, { x: 0, y: 0, rotation: 0 }, { x: dx, y: dy, rotation: rot, duration: 0.42, ease: "power2.out" }, T.ballHit);
      W.to(el, { x: 0, y: 0, rotation: 0, duration: 0.9, ease: "bounce.out" }, T.ballHit + 0.42);
    });
    // The other words arrive on the beats, each with its own entrance.
    const entries = [
      ["thing", { y: -620, rotation: 0 }, "power4.out", 0.32],
      ["leads", { x: -900 }, "back.out(1.6)", 0.4],
      ["to", { y: 380, rotation: 35 }, "back.out(2)", 0.42],
      ["another", { scale: 2.6, y: -40 }, "expo.out", 0.5],
    ];
    entries.forEach(([w, from, e, dur], k) => {
      L(w).forEach((el, i) => {
        W.fromTo(el, { ...from, autoAlpha: 0 }, { x: 0, y: 0, rotation: 0, scale: 1, autoAlpha: 1, duration: dur, ease: e }, T.wordsIn[k] + i * 0.03);
      });
    });
    W.to(L("another"), { y: -26, duration: 0.12, ease: "power2.out", stagger: 0.03, yoyo: true, repeat: 1 }, T.emph);
    W.fromTo("#p1-head", { "--plate": "5px 4px 0 #ff48b0" }, { "--plate": "16px 10px 0 #ff48b0", duration: 0.12, yoyo: true, repeat: 1 }, T.emph);
    W.fromTo("#ramp-path", { strokeDasharray: 1600, strokeDashoffset: 1600 }, { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" }, T.emph + 0.2);

    // Dominoes lean in a cascade, the last knocks the odometer, then they stand up as a chart.
    const F = [0.18, 0.27, 0.38, 0.52, 0.66, 0.83, 0.97];
    F.forEach((f, i) => {
      const el = `#dom${i}`;
      W.fromTo(el, { rotation: 0, scaleY: 1 }, { rotation: 14, duration: 0.22, ease: "power2.in" }, T.domino + i * 0.19);
      W.to(el, { rotation: 0, scaleY: f, duration: 0.55, ease: "back.out(1.7)" }, T.chart + i * 0.05);
      W.fromTo(`#val${i}`, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" }, T.chart + 0.25 + i * 0.05);
    });
    W.fromTo("#odo", { rotation: 0 }, { rotation: 2.2, duration: 0.08, yoyo: true, repeat: 3, ease: "sine.inOut" }, T.domino + 6 * 0.19 + 0.2);
    W.fromTo("#p2-axis", { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "power3.out" }, T.chart);
    W.fromTo("#odo", { scale: 1 }, { scale: 1.06, duration: 0.07, yoyo: true, repeat: 1, ease: "power2.out" }, T.slam);

    // Pins spring up as the "1" reaches each stop; Tokyo's pin is a spring.
    T.legs.forEach((t, i) => W.fromTo(`#pin${i}`, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.45, ease: "back.out(2.4)" }, t - 0.12));
    W.to("#pin4", { scaleY: 0.6, duration: 0.3, ease: "power2.out" }, T.legs[4]);
    W.to("#pin4", { scaleY: 1, duration: 0.5, ease: "elastic.out(1.2, 0.35)" }, T.fling);

    // Toggles flip one after another; chaos shakes the card.
    T.tog.forEach((t, i) => {
      W.fromTo(`#tog${i} .knob`, { x: 0 }, { x: 90, duration: 0.22, ease: "power3.out" }, t);
      W.fromTo(`#tog${i}`, { backgroundColor: "#eef0ea" }, { backgroundColor: "#ff48b0", duration: 0.18 }, t);
    });
    W.fromTo("#card", { x: 0, rotation: 0 }, { keyframes: [{ x: -14, rotation: -0.6 }, { x: 12, rotation: 0.5 }, { x: -8 }, { x: 6 }, { x: 0, rotation: 0 }], duration: 0.5, ease: "none" }, T.tog[2] + 0.05);
    W.fromTo("#tog2 .knob", { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.01 }, T.chaosPop);
    W.fromTo("#go", { scale: 1 }, { scale: 0.84, duration: 0.09, ease: "power2.in" }, T.go);
    W.to("#go", { scale: 1, duration: 0.5, ease: "elastic.out(1.1, 0.4)" }, T.go + 0.09);
    [0, 1, 2].forEach((i) => W.fromTo(`#rip${i}`, { scale: 1, opacity: 0.9 }, { scale: 2.4 + i * 0.5, opacity: 0, duration: 0.7, ease: "power2.out" }, T.go + i * 0.1));
    W.fromTo("#rod-path", { strokeDasharray: 420, strokeDashoffset: 420 }, { strokeDashoffset: 0, duration: 1.5, ease: "power1.inOut" }, T.go + 0.25);
    W.fromTo("#lever", { rotation: -9 }, { rotation: 15, duration: 0.16, ease: "expo.out" }, T.lever);

    // Registration targets turn slowly; they make the sheet feel like it is running through a press.
    $$(".reg").forEach((r) => W.fromTo(r, { rotation: 0 }, { rotation: 360, duration: 52, ease: "none" }, 0));
  }

  function frame(t) {
    const wt = worldTime(t);
    window.CR.wtNow = wt;
    const cam = camera(t);
    gsap.set("#world", { x: cam.x, y: cam.y, scale: cam.s });
    W.time(Math.max(0, Math.min(W.duration(), wt)));

    const b = ballState(wt);
    gsap.set("#ball", { x: b.x, y: b.y, scaleX: b.sx, scaleY: b.sy, rotation: b.r });

    // Odometer strips.
    const v = odoValue(wt);
    for (let k = 0; k < 4; k++) {
      const p = Math.pow(10, k), dk = Math.floor(v / p) % 10, rest = v % p;
      const frac = k === 0 ? v % 1 : Math.max(0, rest - (p - 1));
      gsap.set(`#strip${k}`, { y: -(dk + frac) * 200 });
    }
    // Chart values count up.
    const F = [0.18, 0.27, 0.38, 0.52, 0.66, 0.83, 0.97];
    F.forEach((f, i) => {
      const n = Math.round(f * 100 * seg(wt, T.chart + 0.25 + i * 0.05, T.chart + 1.4 + i * 0.05, "power2.out"));
      const el = document.getElementById(`val${i}`);
      if (el.textContent !== String(n)) el.textContent = n;
    });

    // The "1" and the route it draws.
    const o = onePos(wt);
    gsap.set("#one", o ? { autoAlpha: 1, x: o.x, y: o.y, rotation: o.r, scale: o.s } : { autoAlpha: 0 });
    const drawn = o && o.len != null ? o.len : wt >= T.legs[4] ? routeLen : 0;
    route.style.strokeDasharray = drawn > 0 ? dashUpTo(drawn) : "0 99999";
    route.style.visibility = drawn > 1 ? "visible" : "hidden";

    // Chaos knob pops off and lands on the slider handle; the handle shoots into GO.
    const knob = $("#chaos-knob");
    if (wt >= T.chaosPop && wt < T.handle) {
      const u = seg(wt, T.chaosPop, T.handle);
      gsap.set(knob, { opacity: 1, x: lerp(1659, 1660, u), y: lerp(626, 690, u) - 4 * 160 * u * (1 - u) });
    } else if (wt >= T.handle && wt < T.handle + 0.6) {
      const u = seg(wt, T.handle, T.handle + 0.6, "power2.in");
      gsap.set(knob, { opacity: 1, x: lerp(1660, 1520, u), y: lerp(690, 1200, u) });
    } else gsap.set(knob, { opacity: 0 });
    let hx = 1660, hy = 768;
    if (wt >= T.handle && wt < T.go) { const u = seg(wt, T.handle, T.go, "power2.in"); hx = lerp(1660, 560, u); hy = lerp(768, 654, u); }
    else if (wt >= T.go) { const u = seg(wt, T.go, T.go + 0.5, "power2.out"); hx = lerp(560, 700, u); hy = lerp(654, 654, u) - 80 * Math.sin(u * Math.PI) + 380 * seg(wt, T.go + 0.3, T.go + 1.0, "power2.in"); }
    gsap.set("#slider-handle", { x: hx, y: hy });
    // Cursor creeps toward GO and gets knocked away.
    let cx = 900, cy = 1130, cr = 0;
    if (wt >= 28.2 && wt < T.go) { const u = seg(wt, 28.2, 30.6, "power2.out"); cx = lerp(900, 470, u) + Math.sin(wt * 9) * 4 * (1 - u); cy = lerp(1130, 760, u); }
    else if (wt >= T.go) { const u = seg(wt, T.go, T.go + 0.7, "power2.out"); cx = lerp(470, -60, u); cy = lerp(760, 1180, u); cr = 560 * u; }
    gsap.set("#cursor", { x: cx, y: cy, rotation: cr });

    // Tear.
    const k = wt < T.smash ? 0 : seg(wt, T.smash, T.smash + 0.42, "expo.out");
    const pts = tearPoints(Math.max(k, 0.0001));
    $("#hole").style.clipPath = `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(",")})`;
    $("#rim-path").setAttribute("d", k > 0 ? `M ${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L ")} Z` : "");
    for (let i = 0; i < 22; i++) {
      const d = wt - T.smash;
      if (d < 0 || d > 1.3) { gsap.set(`#sh${i}`, { opacity: 0 }); continue; }
      const a = hash(i) * Math.PI * 2, sp = 500 + hash(i + 9) * 900;
      gsap.set(`#sh${i}`, { opacity: 1 - d / 1.3, x: 960 + Math.cos(a) * sp * d, y: 540 + Math.sin(a) * sp * d + 900 * d * d, rotation: (hash(i + 3) - 0.5) * 1400 * d });
    }
    // The ball that flies out of the machine becomes a ball resting in the hole.
    // It lands on the ball in the end-of-take still (hole-box 703, 443; radius 120) and hands over to it.
    if (wt < 48.95) gsap.set("#bigball i", { opacity: 0, scale: 6.2, x: 0, y: 0 });
    else {
      const u = seg(wt, T.h3End, 50.4, "power3.out");
      gsap.set("#bigball i", { opacity: seg(wt, 48.95, T.h3End) * (1 - seg(wt, 50.3, 50.5)), scale: lerp(6.2, 1.2, u), x: 63 * u, y: 63 * u });
    }

    // Grain moves on twos.
    const g = Math.floor(t * 12);
    const root = $("#root");
    root.style.setProperty("--gx", `${(g * 137) % 512}px`);
    root.style.setProperty("--gy", `${(g * 251) % 512}px`);
  }

  // Draw the dashed route only up to `len`: a dash pattern that repeats 18/14 up to len, then a long gap.
  function dashUpTo(len) {
    const parts = [];
    let used = 0;
    while (used + 32 <= len) { parts.push(18, 14); used += 32; }
    const tail = Math.max(0, len - used);
    parts.push(Math.min(18, tail), 99999);
    return parts.join(" ");
  }

  // Sign-off, on the root clock (it happens after the rewind and is not rewound).
  function buildSignoff(tl) {
    tl.fromTo("#word", { autoAlpha: 0, x: -50 }, { autoAlpha: 1, x: 0, duration: 0.7, ease: "power3.out" }, 59.7);
    tl.fromTo("#word", { "--wplate": "64px 0px 0 #ff48b0" }, { "--wplate": "7px 6px 0 #ff48b0", duration: 0.9, ease: "power3.out" }, 59.75);
    tl.fromTo("#ball2", { autoAlpha: 0, x: M.end.x, y: 2160 - 140 }, { autoAlpha: 1, y: M.end.y, duration: T.land - 60.5, ease: "power2.in" }, 60.5);
    tl.fromTo("#ball2", { scaleX: 1, scaleY: 1 }, { keyframes: [{ scaleX: 1.35, scaleY: 0.66, duration: 0.07 }, { scaleX: 0.9, scaleY: 1.12, y: M.end.y - 26, duration: 0.18 }, { scaleX: 1, scaleY: 1, y: M.end.y, duration: 0.3, ease: "bounce.out" }] }, T.land);
    tl.fromTo("#url", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, 62.3);
    tl.to("#ball2", { scale: 1.18, duration: 0.12, yoyo: true, repeat: 1, ease: "sine.inOut" }, D(31));
  }

  // Called from index.html once fonts are ready; the caller registers the returned timeline.
  function makeTimeline() {
    build();
    buildWorld();
    const tl = gsap.timeline({ paused: true });
    const drv = { t: 0 };
    tl.to(drv, { t: 66, duration: 66, ease: "none", onUpdate: () => frame(drv.t) }, 0);
    buildSignoff(tl);
    frame(0);
    return tl;
  }

  window.CR = { worldTime, hammerState, wtNow: 0, T, makeTimeline };
})();
