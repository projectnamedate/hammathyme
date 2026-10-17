// Chain Reaction v2. One riso print sheet under one camera; every link is a pure function of "world time", which
// stops when the machine has run. 24 named moves (motion-prompt numbers) tag the chain.
// Beat grid: bed v04, 118 BPM, first downbeat 0.27 s.
(() => {
  let ready3d;
  window.CR3D_READY = new Promise((r) => (ready3d = r));

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

  const T = {
    ballHit: D(1), wordsIn: [D(1) + BEAT, D(1) + 2 * BEAT], land: D(2), ballDot: D(2) + BEAT, emph: D(3),
    roll: D(4), domino: 11.0, chart: D(6), countStart: 13.3, slam: D(8), rollover: D(8) + BEAT,
    routeStart: D(9), legs: [19.6, D(10), 21.62, D(11), D(12)], fling: D(12) + BEAT,
    tog: [27.2, 27.2 + BEAT, 27.2 + 2 * BEAT], chaosPop: 29.24, handle: 29.75, go: D(15), lever: D(16), launch: D(16) + 0.04,
    brk: D(20), smash: D(21), rgEnd: D(24), freeze: D(25), indexOut: 57.2, dot: D(30), sweep: D(30) + 0.35,
  };

  // World time: forward until the overview settles, then held.
  const RW = T.freeze;
  const worldTime = (t) => Math.min(t, RW);

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
    [10.9, 2880, 540, 1.0, "power2.inOut"], [15.2, 2880, 540, 1.0], [16.4, 3440, 540, 1.3, "power2.inOut"],
    [17.4, 3460, 500, 1.26], [18.9, 4800, 540, 1.0, "power2.inOut"], [24.3, 4880, 520, 1.04, "sine.inOut"],
    [25.3, 5040, 480, 1.12, "power2.inOut"], [27.0, 4800, 1620, 1.0, "power2.inOut"], [30.3, 4800, 1620, 1.0],
    [31.2, 4520, 1700, 1.12, "power2.inOut"], [32.6, 4300, 1800, 1.08, "sine.inOut"],
    [33.8, 3700, 1650, 0.95, "power2.inOut"], [35.2, 2900, 1560, 0.9, "sine.inOut"], [37.2, 2150, 1500, 0.95, "sine.inOut"],
    [39.4, 1500, 1580, 1.05, "sine.inOut"], [T.brk, 1200, 1600, 1.2, "sine.inOut"], [42.7, 1010, 1612, 1.5, "sine.inOut"],
    [T.smash, 960, 1620, 1.6, "power2.in"], [43.9, 960, 1620, VS, "power3.inOut"], [T.rgEnd, 960, 1620, VS],
    [T.freeze, 2880, 1080, 1 / 3, "power3.inOut"], [T.indexOut + 0.2, 2880, 1080, 0.345, "sine.out"],
    [60.6, 2880, 2700, 1.0, "power3.inOut"], [66, 2880, 2700, 1.05, "sine.inOut"],
  ];
  const SHAKES = [[T.ballHit, 7], [T.slam, 9], [T.lever, 6], [T.smash, 26], [T.dot, 5]];
  function camera(t) {
    let i = 0;
    while (i < CAM.length - 2 && t >= CAM[i + 1][0]) i++;
    const a = CAM[i], b = CAM[i + 1];
    const u = t <= a[0] ? 0 : t >= b[0] ? 1 : ease(b[4] || "none")((t - a[0]) / (b[0] - a[0]));
    const s = Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), u));
    const cx = lerp(a[1], b[1], u), cy = lerp(a[2], b[2], u);
    let sx = 0, sy = 0;
    SHAKES.forEach(([ts, amp], k) => {
      if (t < ts) return;
      const d = t - ts, env = amp * Math.exp(-d * 7);
      sx += env * Math.sin(d * 57 + k); sy += env * Math.cos(d * 49 + 2 * k);
    });
    return { s, x: 960 - cx * s + sx, y: 540 - cy * s + sy };
  }

  // The 24 named moves: motion-prompt id, name, the world point the tag hangs from, and the world time it pops.
  const TAGS = [
    [3, "burst", 760, 250, T.ballHit], [8, "kinetic typography", 150, 610, T.wordsIn[0]], [10, "overshoot", 820, 610, T.land],
    [11, "squash & stretch", 1420, 250, T.ballDot], [2, "stagger", 2220, 300, T.domino], [21, "flip", 2220, 990, T.chart],
    [7, "count-up", 3150, 780, T.countStart], [4, "line draw", 2600, 280, 13.8], [1, "pop-in", 3420, 300, T.rollover],
    [30, "orbit", 4560, 330, 18.9], [14, "motion trail", 5320, 940, 20.1], [26, "tilt", 4700, 900, T.fling],
    [59, "toggle switch", 4120, 1500, T.tog[0]], [56, "toast notification", 4990, 1310, T.tog[1]], [62, "range slider", 4840, 2060, T.handle],
    [85, "ripple effect", 4120, 1790, T.go], [29, "tracking shot", 3220, 1960, 34.4], [37, "slow motion", 1100, 1360, T.brk],
    [38, "speed ramp", 1100, 1760, 42.62], [24, "impact shake", 520, 1330, T.smash], [20, "zoom through", 600, 1440, 43.25],
    [35, "FPV drone shot", 600, 1800, 44.2], [31, "crane up", 1500, 1300, 49.6], [22, "light sweep", 2620, 2460, T.sweep],
  ];

  const M = {};
  const OV = []; // per-tag screen offsets that keep the 24 overview tags from overlapping
  let A3 = null; // anchors from the 3D module (world px)
  const P4Y = 1080, P4X = 3840;

  function buildWord3d(el) {
    [...el.dataset.text].forEach((ch) => {
      if (ch === " ") { el.appendChild(document.createTextNode(" ")); return; }
      const l = document.createElement("span");
      l.className = "l3";
      for (let i = 9; i >= 1; i--) {
        const d = document.createElement("span");
        d.className = "depth";
        d.textContent = ch;
        d.setAttribute("aria-hidden", "true");
        d.setAttribute("data-layout-allow-occlusion", "");
        d.setAttribute("data-layout-allow-overlap", "");
        const k = i / 9;
        d.style.color = `rgb(${Math.round(lerp(43, 24, k))},${Math.round(lerp(74, 42, k))},${Math.round(lerp(146, 92, k))})`;
        d.style.transform = `translateZ(${-i * 4}px)`;
        l.appendChild(d);
      }
      const f = document.createElement("span");
      f.className = "face";
      f.textContent = ch;
      f.style.transform = "translateZ(0.1px)";
      l.appendChild(f);
      el.appendChild(l);
    });
    if (el.dataset.gap) { const g = document.createElement("span"); g.className = "gap3d"; el.appendChild(g); }
    const probe = document.createElement("span");
    probe.style.cssText = "display:inline-block;width:0;height:0";
    el.appendChild(probe);
    return probe;
  }

  function measure(hookProbe, ktProbe) {
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.font = "220px 'Archivo Black'";
    const nAsc = ctx.measureText("n").actualBoundingBoxAscent;
    const hook = $("#hook"), kt = $("#kt");
    const n = hook.querySelectorAll(".l3")[1];
    M.nX = 130 + n.offsetLeft + n.offsetWidth / 2;
    M.hookBase = hook.offsetTop + hookProbe.offsetTop;
    M.nTop = M.hookBase - nAsc;
    M.ktBase = kt.offsetTop + ktProbe.offsetTop;
    M.dotX = 130 + kt.querySelector(".gap3d").offsetLeft + 64;
    // Sign-off: the full stop sits on the measured baseline, sized like a stroke of the wordmark.
    const word = $("#word"), probe = document.createElement("span");
    probe.style.cssText = "display:inline-block;width:0;height:0";
    word.appendChild(probe);
    const gap = $("#word-gap");
    M.end = { x: 1920 + gap.offsetLeft + gap.offsetWidth / 2 + 4, y: 2160 + word.offsetTop + probe.offsetTop - 32 };
  }

  // Ball: falls on "one shot.", lobs onto the end of "kinetic type" as its full stop, rolls down the ramp into the dominoes.
  function ballState(wt) {
    const restY = M.ktBase - 50;
    const A = { x: M.dotX, y: restY }, B = { x: A3.contact.x - 50, y: A3.contact.y - 50 };
    if (wt < 0.27) return { x: M.nX, y: -140, sx: 1, sy: 1, r: 0 };
    if (wt < T.ballHit) return { x: M.nX, y: lerp(-140, M.nTop - 50, seg(wt, 0.27, T.ballHit, "power2.in")), sx: 0.92, sy: 1.1, r: 0 };
    if (wt < T.ballDot) {
      const u = seg(wt, T.ballHit, T.ballDot);
      const y0 = M.nTop - 50, h = (y0 + restY) / 2 - 40;
      const sq = 1 - 0.3 * Math.exp(-(wt - T.ballHit) * 16);
      return { x: lerp(M.nX, A.x, u), y: lerp(y0, restY, u) - 4 * h * u * (1 - u), sx: 2 - sq, sy: sq, r: u * 540 };
    }
    if (wt < T.roll) {
      const d = wt - T.ballDot, sq = 1 - 0.3 * Math.exp(-d * 14) * Math.cos(d * 30);
      return { ...A, sx: 2 - sq, sy: sq, r: 540 };
    }
    if (wt < T.domino) {
      const u = seg(wt, T.roll, T.domino, "power2.in");
      const dist = Math.hypot(B.x - A.x, B.y - A.y) * u;
      return { x: lerp(A.x, B.x, u), y: lerp(A.y, B.y, u), sx: 1, sy: 1, r: 540 + (dist / 50) * 57.3 };
    }
    const back = seg(wt, T.domino, T.domino + 0.4, "power2.out");
    return { x: B.x - 30 * back, y: B.y, sx: 1, sy: 1, r: 2600 - 34 * back };
  }

  function odoValue(wt) {
    if (wt < T.countStart) return 0;
    if (wt < T.slam) return 9999 * seg(wt, T.countStart, T.slam, "power2.in");
    if (wt < T.rollover) return 9999;
    return 9999 + seg(wt, T.rollover, T.rollover + 0.3, "power2.out");
  }

  // The DOM "1": pops out of the odometer, rolls off the box, lands on San Francisco on the globe (the 3D "1" takes the
  // route), comes back off Tokyo's spring, and lands on the gravity toggle.
  function onePos(wt) {
    const B = 65;
    if (wt < T.rollover) return null;
    if (wt < 17.55) {
      const u = seg(wt, T.rollover, 17.55);
      return { x: lerp(3260, 3460, u), y: lerp(550, 400 - B, u) - 4 * 190 * u * (1 - u), r: -40 * u, s: lerp(0.6, 1, Math.min(1, u * 3)) };
    }
    if (wt < 18.1) return { x: lerp(3460, 3740, seg(wt, 17.55, 18.1)), y: 400 - B, r: lerp(-40, 190, seg(wt, 17.55, 18.1)), s: 1 };
    if (wt < T.legs[0]) {
      const u = seg(wt, 18.1, T.legs[0], "sine.inOut");
      return { x: lerp(3740, A3.sfo.x, u), y: lerp(400 - B, A3.sfo.y - B * 0.6, u) - 4 * 160 * u * (1 - u), r: 190 + 140 * u, s: lerp(1, 0.6, u) };
    }
    if (wt < T.fling) return null;
    // It hops down the three switches (gravity, bounce, chaos), flipping each one it lands on, then drops off the card.
    const land = (k) => ({ x: P4X + 1569, y: P4Y + 389 + 120 * k - B });
    if (wt < T.tog[0]) {
      const u = seg(wt, T.fling, T.tog[0]), a = land(0);
      return { x: lerp(A3.tyo.x, a.x, u), y: lerp(A3.tyo.y, a.y, u * u) - 4 * 140 * u * (1 - u) * (1 - u), r: 330 - 300 * u, s: lerp(0.6, 1, u) };
    }
    for (let k = 0; k < 2; k++) {
      if (wt < T.tog[k + 1]) {
        const u = seg(wt, T.tog[k], T.tog[k + 1]), a = land(k), b = land(k + 1);
        return { x: a.x, y: lerp(a.y, b.y, u * u) - 4 * 90 * u * (1 - u), r: 30 - 14 * Math.sin(Math.PI * u), s: 1 };
      }
    }
    if (wt < T.tog[2] + 0.8) {
      const u = seg(wt, T.tog[2], T.tog[2] + 0.8), a = land(2);
      return { x: lerp(a.x, P4X + 1880, u), y: lerp(a.y, P4Y + 1260, u * u) - 4 * 110 * u * (1 - u), r: 30 + 260 * u, s: 1 };
    }
    return null;
  }

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

  // Forward, each tag pops on its time and holds ~1.7 s. At the overview, all 24 come back at once.
  function tagScale(i, t) {
    const tt = TAGS[i][4];
    if (t >= RW + 0.3 && t < T.indexOut) {
      if (i === TAGS.length - 1) return 0; // the 24th move (the light sweep) hasn't happened yet
      const t0 = RW + 0.3 + i * 0.06;
      return ease("back.out(2.2)")(clamp((t - t0) / 0.35)) * (1 - seg(t, T.indexOut - 0.25, T.indexOut, "power2.in"));
    }
    if (t < tt) return 0;
    return ease("back.out(2.2)")(clamp((t - tt) / 0.35)) * (1 - seg(t, tt + 1.7, tt + 1.95, "power2.in"));
  }

  function build() {
    const hookProbe = buildWord3d($("#hook")), ktProbe = buildWord3d($("#kt"));
    const odo = $("#odo");
    for (let k = 0; k < 4; k++) {
      const digits = [...Array(11)].map((_, d) => `<div class="digit type" data-layout-allow-occlusion>${d % 10}</div>`).join("");
      odo.insertAdjacentHTML("beforeend", `<div class="slot" style="left:${54 + (3 - k) * 120}px"><div class="strip" id="strip${k}" data-layout-allow-overflow>${digits}</div></div>`);
    }
    const panels = $$(".panel");
    panels.forEach((p, i) => {
      [["left:40px;top:40px", "border-left-width:4px;border-top-width:4px"], ["right:40px;top:40px", "border-right-width:4px;border-top-width:4px"],
        ["left:40px;bottom:40px", "border-left-width:4px;border-bottom-width:4px"], ["right:40px;bottom:40px", "border-right-width:4px;border-bottom-width:4px"]]
        .forEach(([pos, w]) => p.insertAdjacentHTML("beforeend", `<div class="crop" style="${pos};${w}"></div>`));
      p.insertAdjacentHTML("beforeend", `<div class="panel-no mono">0${i + 1} / 0${panels.length}</div>`);
      p.insertAdjacentHTML("beforeend", `<svg class="reg" viewBox="0 0 44 44"><circle cx="22" cy="22" r="13" fill="none" stroke="#3255a4" stroke-width="3"/><path d="M22 0V44M0 22H44" stroke="#3255a4" stroke-width="3"/></svg>`);
    });
    $("#target").innerHTML = [280, 210, 140, 70].map((r, i) => `<circle cx="300" cy="300" r="${r}" fill="none" stroke="${i === 3 ? "#ff48b0" : "#3255a4"}" stroke-width="${i === 3 ? 14 : 6}"/>`).join("") +
      `<path d="M300 0V600M0 300H600" stroke="#3255a4" stroke-width="4"/>`;
    const p4 = $("#p4");
    for (let i = 0; i < 3; i++) p4.insertAdjacentHTML("beforeend", `<div id="rip${i}" style="position:absolute;left:460px;top:710px;width:200px;height:200px;border-radius:50%;border:6px solid #ff48b0;opacity:0"></div>`);
    p4.insertAdjacentHTML("beforeend", `<div id="slider-handle"></div><div id="chaos-knob" style="position:absolute;left:0;top:0;width:74px;height:74px;margin:-37px 0 0 -37px;border-radius:50%;background:#3255a4;opacity:0"></div>`);
    const sh = $("#shards");
    for (let i = 0; i < 22; i++) {
      const s = 16 + hash(i + 40) * 34;
      sh.insertAdjacentHTML("beforeend", `<div class="shard" id="sh${i}" style="border-width:0 ${s * 0.6}px ${s}px ${s * 0.4}px;border-color:transparent transparent ${i % 4 === 0 ? "#ffe800" : "#f8f6fd"} transparent;opacity:0"></div>`);
    }
    const p2 = $("#p2");
    A3.barTops.forEach((p, i) => p2.insertAdjacentHTML("beforeend", `<div class="bar-val mono" id="val${i}" style="left:${p.x - 1920}px;top:${p.y - 52}px">0</div>`));
    $("#tags").innerHTML = TAGS.map(([id, name], i) => `<div class="tag" id="tag${i}" data-layout-allow-overlap data-layout-allow-occlusion><b>#${String(id).padStart(3, "0")}</b> ${name}</div>`).join("");
    // Light sweep: a text-clipped twin of the wordmark carries the highlight, so it crosses only the letters.
    const word = $("#word"), sweep = word.cloneNode(true);
    sweep.id = "word-sweep";
    sweep.setAttribute("aria-hidden", "true");
    sweep.setAttribute("data-layout-allow-overlap", "");
    sweep.setAttribute("data-layout-allow-occlusion", "");
    sweep.style.cssText = "color:transparent;text-shadow:none;background:linear-gradient(105deg,transparent calc(var(--sweep,-30%) - 9%),rgba(248,246,253,.85) var(--sweep,-30%),transparent calc(var(--sweep,-30%) + 9%));-webkit-background-clip:text;background-clip:text";
    word.after(sweep);
    $$("#p2 *, #p3 *, #p4 *, #p5 *, #p6 *").forEach((el) => {
      if ([...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) el.setAttribute("data-layout-allow-occlusion", "");
    });
    layoutOverview();
    measure(hookProbe, ktProbe);
    $("#ramp-path").setAttribute("d", `M ${M.dotX - 20} ${M.ktBase + 3} L ${A3.contact.x + 20} ${A3.contact.y + 3}`);
  }

  // Relax the 24 overview tags apart in screen space (sizes measured once), so the reveal reads as a clean index.
  function layoutOverview() {
    const cam = camera(T.indexOut - 1), sc = 0.82;
    const r = TAGS.map(([, , wx, wy], i) => {
      const el = document.getElementById(`tag${i}`);
      return { x: cam.x + wx * cam.s, y: cam.y + wy * cam.s - 46, w: el.offsetWidth * sc + 8, h: el.offsetHeight * sc + 8, x0: 0, y0: 0 };
    });
    r.forEach((a) => { a.x0 = a.x; a.y0 = a.y; });
    // The panel headings stay readable: tags are pushed off them, never the other way round.
    const fixed = $$(".cap, #p6-note, #kt").map((el) => {
      const p = el.closest(".panel"), pad = 10;
      return { x: cam.x + (p.offsetLeft + el.offsetLeft) * cam.s - pad, y: cam.y + (p.offsetTop + el.offsetTop) * cam.s - pad, w: el.offsetWidth * cam.s + 2 * pad, h: el.offsetHeight * cam.s + 2 * pad, fixed: true };
    });
    const hud = $("#hud");
    fixed.push({ x: hud.offsetLeft - 10, y: hud.offsetTop - 10, w: hud.offsetWidth + 20, h: hud.offsetHeight + 20, fixed: true });
    const all = r.concat(fixed);
    for (let it = 0; it < 300; it++) {
      for (let i = 0; i < r.length; i++) for (let j = i + 1; j < all.length; j++) {
        const a = all[i], b = all[j];
        const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x), oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
        if (ox <= 0 || oy <= 0) continue;
        const k = b.fixed ? 1 : 0.5;
        if (oy < ox) { const d = oy * k + 0.5, s = a.y < b.y ? -1 : 1; a.y += s * d; if (!b.fixed) b.y -= s * d; }
        else { const d = ox * k + 0.5, s = a.x < b.x ? -1 : 1; a.x += s * d; if (!b.fixed) b.x -= s * d; }
      }
      r.forEach((a) => { a.x = clamp(a.x, 16, 1904 - a.w); a.y = clamp(a.y, 100, 960 - a.h); });
    }
    r.forEach((a, i) => (OV[i] = { dx: a.x - a.x0, dy: a.y - a.y0, sc }));
  }

  const W = gsap.timeline({ paused: true });
  function buildWorld() {
    const hookL = $$("#hook .l3"), ktL = $$("#kt .l3");
    hookL.forEach((el, i) => {
      const a = (i / hookL.length) * Math.PI * 2 + 0.6;
      W.fromTo(el, { x: 0, y: 0, z: 0, rotationX: 0, rotationY: 0, rotation: 0, autoAlpha: 1 },
        { x: Math.cos(a) * (500 + hash(i) * 400), y: Math.sin(a) * 420 - 200, z: 900 + hash(i + 3) * 500, rotationX: (hash(i + 7) - 0.5) * 540, rotationY: (hash(i + 9) - 0.5) * 540, rotation: (hash(i + 11) - 0.5) * 180, duration: 0.75, ease: "power2.out" }, T.ballHit);
      W.to(el, { autoAlpha: 0, duration: 0.2 }, T.ballHit + 0.5);
    });
    W.fromTo("#hook-sub", { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: 30, duration: 0.3, ease: "power2.in" }, T.ballHit);
    ktL.forEach((el, i) => {
      const t0 = (i < 7 ? T.wordsIn[0] : T.wordsIn[1]) + (i % 7) * 0.045;
      W.fromTo(el, { z: -2200, x: (hash(i + 20) - 0.5) * 900, y: (hash(i + 30) - 0.5) * 600, rotationX: 200, rotationY: -140, autoAlpha: 0 },
        { z: 0, x: 0, y: 0, rotationX: 0, rotationY: 0, autoAlpha: 1, duration: 0.6, ease: "back.out(1.5)" }, t0);
    });
    W.to(ktL, { keyframes: [{ rotationY: -38, duration: 0.22, ease: "power2.out" }, { rotationY: 24, duration: 0.26, ease: "sine.inOut" }, { rotationY: 0, duration: 0.32, ease: "power2.out" }], stagger: 0.05 }, T.emph);
    W.fromTo("#ramp-path", { strokeDasharray: 1700, strokeDashoffset: 1700 }, { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" }, T.emph + 0.4);

    W.fromTo("#odo", { rotation: 0 }, { rotation: 2.2, duration: 0.08, yoyo: true, repeat: 3, ease: "sine.inOut" }, T.domino + 6 * 0.19 + 0.2);
    W.fromTo("#odo", { scale: 1 }, { scale: 1.06, duration: 0.07, yoyo: true, repeat: 1, ease: "power2.out" }, T.slam);
    A3.barTops.forEach((_, i) => W.fromTo(`#val${i}`, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" }, T.chart + 0.55 + i * 0.05));

    W.fromTo("#card", { rotationX: 28, rotationY: -22, transformPerspective: 1600, z: -200 }, { rotationX: 0, rotationY: 0, z: 0, duration: 1.0, ease: "power3.out" }, 25.6);
    T.tog.forEach((t, i) => {
      W.fromTo(`#tog${i} .knob`, { x: 0 }, { x: 90, duration: 0.22, ease: "power3.out" }, t);
      W.fromTo(`#tog${i}`, { backgroundColor: "#f8f6fd" }, { backgroundColor: "#ff48b0", duration: 0.18 }, t);
    });
    W.fromTo("#toast", { autoAlpha: 0, y: -70, rotationX: -80, transformPerspective: 900 }, { autoAlpha: 1, y: 0, rotationX: 0, duration: 0.5, ease: "back.out(1.8)" }, T.tog[1]);
    W.to("#card", { keyframes: [{ x: -14, rotation: -0.6 }, { x: 12, rotation: 0.5 }, { x: -8 }, { x: 6 }, { x: 0, rotation: 0 }], duration: 0.5, ease: "none" }, T.tog[2] + 0.05);
    W.fromTo("#tog2 .knob", { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.01 }, T.chaosPop);
    W.fromTo("#go", { scale: 1 }, { scale: 0.84, duration: 0.09, ease: "power2.in" }, T.go);
    W.to("#go", { scale: 1, duration: 0.5, ease: "elastic.out(1.1, 0.4)" }, T.go + 0.09);
    [0, 1, 2].forEach((i) => W.fromTo(`#rip${i}`, { scale: 1, opacity: 0.9 }, { scale: 2.4 + i * 0.5, opacity: 0, duration: 0.7, ease: "power2.out" }, T.go + i * 0.1));
    W.fromTo("#rod-path", { strokeDasharray: 420, strokeDashoffset: 420 }, { strokeDashoffset: 0, duration: 1.5, ease: "power1.inOut" }, T.go + 0.25);
    W.fromTo("#lever", { rotation: -9 }, { rotation: 15, duration: 0.16, ease: "expo.out" }, T.lever);
    $$(".reg").forEach((r) => W.fromTo(r, { rotation: 0 }, { rotation: 360, duration: 52, ease: "none" }, 0));
  }

  function frame(t) {
    const wt = worldTime(t);
    const cam = camera(t);
    gsap.set("#world", { x: cam.x, y: cam.y, scale: cam.s });
    W.time(Math.max(0, Math.min(W.duration(), wt)));

    const b = ballState(wt);
    gsap.set("#ball", { x: b.x, y: b.y, scaleX: b.sx, scaleY: b.sy, rotation: b.r });

    const v = odoValue(wt);
    for (let k = 0; k < 4; k++) {
      const p = Math.pow(10, k), dk = Math.floor(v / p) % 10, rest = v % p;
      const frac = k === 0 ? v % 1 : Math.max(0, rest - (p - 1));
      gsap.set(`#strip${k}`, { y: -(dk + frac) * 200 });
    }
    A3.values.forEach((val, i) => {
      const n = Math.round(val * seg(wt, T.chart + 0.55 + i * 0.05, T.chart + 1.6 + i * 0.05, "power2.out"));
      const el = document.getElementById(`val${i}`);
      if (el.textContent !== String(n)) el.textContent = n;
    });

    const o = onePos(wt);
    gsap.set("#one", o ? { autoAlpha: 1, x: o.x, y: o.y, rotation: o.r, scale: o.s } : { autoAlpha: 0 });

    const knob = $("#chaos-knob");
    if (wt >= T.chaosPop && wt < T.handle) {
      const u = seg(wt, T.chaosPop, T.handle);
      gsap.set(knob, { opacity: 1, x: lerp(1659, 1660, u), y: lerp(666, 730, u) - 4 * 160 * u * (1 - u) });
    } else if (wt >= T.handle && wt < T.handle + 0.6) {
      const u = seg(wt, T.handle, T.handle + 0.6, "power2.in");
      gsap.set(knob, { opacity: 1, x: lerp(1660, 1520, u), y: lerp(730, 1200, u) });
    } else gsap.set(knob, { opacity: 0 });
    // Speed slider: the falling knob sends the handle down the track; it flies off the end into GO and drops away.
    const TRACK_Y = 802, TRACK_L = 1000, HIT = { x: 695, y: 815 };
    let hx = 1660, hy = TRACK_Y;
    if (wt >= T.handle && wt < T.go) {
      const run = 1660 - TRACK_L, fly = TRACK_L - HIT.x, d = (run + fly) * seg(wt, T.handle, T.go, "power2.in");
      if (d < run) hx = 1660 - d;
      else { const u = (d - run) / fly; hx = TRACK_L - fly * u; hy = TRACK_Y + (HIT.y - TRACK_Y) * u * u; }
    } else if (wt >= T.go) { const u = seg(wt, T.go, T.go + 0.3, "power2.out"); hx = lerp(HIT.x, HIT.x + 18, u); hy = HIT.y - 40 * Math.sin(u * Math.PI) + 180 * seg(wt, T.go + 0.2, T.go + 0.65, "bounce.out"); }
    gsap.set("#slider-handle", { x: hx, y: hy });

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

    // Tags hang from world points but live in screen space, so they read at any zoom.
    let count = 0;
    TAGS.forEach(([, , wx, wy, tt], i) => {
      const sc = tagScale(i, t);
      const ov = t >= RW && t < T.indexOut ? OV[i] : { dx: 0, dy: 0, sc: 1 };
      gsap.set(`#tag${i}`, sc > 0.001 ? { autoAlpha: 1, x: cam.x + wx * cam.s + ov.dx, y: cam.y + wy * cam.s - 46 + ov.dy, scale: sc * ov.sc } : { autoAlpha: 0 });
      if (tt <= t) count++;
    });
    $("#hud").textContent = `moves ${String(count).padStart(2, "0")} / 24`;

    // The ball the catapult threw at the lens falls back out of it onto the sheet, as the full stop.
    const fall0 = T.dot - 0.8;
    if (t < fall0) gsap.set("#ball2", { autoAlpha: 0 });
    else if (t < T.dot) {
      const u = seg(t, fall0, T.dot, "power1.in"), s = 1 / (1 - 0.7 * (1 - u));
      gsap.set("#ball2", { autoAlpha: 1, x: lerp(M.end.x - 420, M.end.x, u), y: lerp(M.end.y - 760, M.end.y, u), scaleX: s, scaleY: s, transformOrigin: "50% 50%" });
    } else {
      const d = t - T.dot, sq = 1 - 0.28 * Math.exp(-d * 12) * Math.cos(d * 28);
      gsap.set("#ball2", { autoAlpha: 1, x: M.end.x, y: M.end.y, scaleX: 2 - sq, scaleY: sq, transformOrigin: "50% 100%" });
    }
  }

  function buildSignoff(tl) {
    tl.fromTo(["#word", "#word-sweep"], { autoAlpha: 0, x: -50 }, { autoAlpha: 1, x: 0, duration: 0.7, ease: "power3.out" }, 58.7);
    tl.fromTo("#word", { "--wplate": "64px 0px 0 #ff48b0" }, { "--wplate": "7px 6px 0 #ff48b0", duration: 0.9, ease: "power3.out" }, 58.75);
    tl.fromTo("#word-sweep", { "--sweep": "-30%" }, { "--sweep": "130%", duration: 0.8, ease: "power2.inOut" }, T.sweep);
    tl.fromTo("#url", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, 62.3);
  }

  function makeTimeline() {
    A3 = window.CR3D.anchors;
    const trail = TAGS.find(([id]) => id === 14);
    [trail[2], trail[3]] = [A3.trail.x, A3.trail.y];
    build();
    buildWorld();
    const tl = gsap.timeline({ paused: true });
    const drv = { t: 0 };
    tl.to(drv, { t: 66, duration: 66, ease: "none", onUpdate: () => frame(drv.t) }, 0);
    buildSignoff(tl);
    frame(0);
    return tl;
  }

  window.CR = { worldTime, hammerState, T, TAGS, makeTimeline, ready3d: (a) => ready3d(a) };
})();
