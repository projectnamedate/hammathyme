// Runs as the body of a function (root, D) and returns a teardown, so the same source drives
// the standalone page and the Next.js mount.
const K = { iso, pathOf, solidSvg, lineSvg, dotsSvg, fadedSvg };
const parts = makeParts(K, G, D.P, D);
const stage = root.querySelector(".pj-stage");
const machine = stage.querySelector(".pj-machine");
const readout = root.querySelector("[data-readout]");
const live = root.querySelector("[data-live]");
const hint = root.querySelector(".pj-hint");
const partButtons = [...root.querySelectorAll(".pj-part")];
const speedButtons = [...root.querySelectorAll("button[data-speed]")];
const bladeButtons = [...root.querySelectorAll("button[data-blades]")];
const stepButton = root.querySelector("button[data-step]");
const apartButton = root.querySelector("button[data-apart]");
// Controls are matched as buttons: the stage carries some of the same names as state
// (data-trace, data-closer), and a remount must never take the stage for a control.
const soundButton = root.querySelector("button[data-sound]");
const traceButton = root.querySelector("button[data-trace]");
const closerButton = root.querySelector("button[data-closer]");
const slowButton = root.querySelector("button[data-slow]");
const timing = root.querySelector(".pj-timing");
const paletteButtons = [...root.querySelectorAll("button[data-palette-pick]")];
const finishButtons = [...root.querySelectorAll("button[data-finish-pick]")];
const viewButtons = [...root.querySelectorAll("button[data-view-pick]")];
// The finish is only colour, so it changes in place with no remount; the host keeps it on its
// element, where the material rules key on it.
const finishHost = root.closest(".iso");
try {
  const kept = localStorage.getItem("pj-finish");
  if (kept === "metal") finishHost?.setAttribute("data-finish", "metal");
} catch {}
const still = matchMedia("(prefers-reduced-motion: reduce)");
const part = (name) => stage.querySelector(`[data-part="${name}"]`);
const TAU = Math.PI * 2;
const FL = D.frameLength;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const ease = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const cleanups = [];
const listen = (target, type, fn, options) => {
  target.addEventListener(type, fn, options);
  cleanups.push(() => target.removeEventListener(type, fn, options));
};

// ---- nodes for the explode and the depth sort ----
const nodes = [...machine.querySelectorAll(".it")].map((el) => ({ el, piece: el.dataset.piece, key: Number(el.dataset.k), m: el.dataset.m.split(",").map(Number), shown: "" }));
for (const node of nodes) node.lift = node.m[0] * D.V[0] + node.m[1] * D.V[1] + node.m[2] * D.V[2];
let order = nodes.map((_, index) => index);
for (const node of nodes) {
  if (node.piece === "stand" || node.piece === "head") continue;
  node.el.setAttribute("data-cursor", "dot");
}
const IDS = Object.keys(D.pieces);
const SPRING = D.spring;
const piece = Object.fromEntries(IDS.map((id) => [id, { x: 0, v: 0, target: 0, pending: null }]));

// ---- the machine's state ----
const SPEEDS = [0, 1, 16, 18, 24];
const state = {
  frames: 0.5,
  fps: 0,
  target: 24,
  chosen: 24,
  blades: 2,
  apart: false,
  armed: false,
  park: null,
  selected: null,
  demo: null,
  crank: null,
  step: null,
  inched: false,
  inchedAt: 0,
  demoAt: null,
  lamp: 0,
  beam: 0,
  light: 0,
  clock: 0,
  trace: null,
  closer: null,
  lift: null,
  slow: false,
};
let touring = !still.matches;
let tourClock = 0;
let visible = false;
let frame = 0;
let last = 0;
let shownFrame = -1;
let lastText = "";
let lastPop = -1;
let settled = true;

const MOVERS = IDS.filter((id) => D.pieces[id] && nodes.some((node) => node.piece === id && (node.m[0] || node.m[1] || node.m[2])));
const springsMoving = () => IDS.some((id) => piece[id].x !== piece[id].target || piece[id].pending);
// The machine may only turn when every part is home: nothing runs while it is apart or on
// its way back together.
const home = () => !state.apart && !IDS.some((id) => piece[id].x !== 0 || piece[id].target !== 0 || piece[id].pending);

function say(text) {
  if (text !== lastText) {
    lastText = text;
    readout.textContent = text;
    describe();
  }
}
function announce(text) {
  if (!touring) live.textContent = text;
}
let shownDescription = "";
function describe() {
  const fps = Math.round(state.target);
  const speed = state.crank ? "cranking by hand" : fps ? `${fps} frame${fps === 1 ? "" : "s"} a second` : "stopped";
  const moving = springsMoving();
  const text = state.armed
    ? Math.abs(state.fps) > 0.05
      ? "stopping, then taking apart"
      : "taking apart"
    : moving
      ? state.apart
        ? "taking apart"
        : "putting together"
      : state.selected
        ? D.pieces[state.selected].say
        : state.apart
          ? `apart · ${MOVERS.length} assemblies`
          : `${speed}, ${state.blades} shutter blade${state.blades === 1 ? "" : "s"}`;
  if (text !== shownDescription) {
    shownDescription = text;
    stage.setAttribute("aria-description", text);
  }
}

function press(button, on) {
  if (on) button.setAttribute("data-on", "");
  else button.removeAttribute("data-on");
  button.setAttribute("aria-pressed", on ? "true" : "false");
}
function markButtons() {
  speedButtons.forEach((b) => press(b, Number(b.dataset.speed) === state.chosen && !state.demo));
  bladeButtons.forEach((b) => press(b, Number(b.dataset.blades) === state.blades));
  apartButton.textContent = state.apart ? "put together" : "take apart";
  press(traceButton, !!state.trace);
  press(slowButton, state.slow);
  press(closerButton, !!state.closer && !state.closer.back);
  partButtons.forEach((b) => press(b, b.dataset.part === state.selected));
  const choice = root.closest("[data-choice]")?.getAttribute("data-choice") ?? "auto";
  paletteButtons.forEach((b) => press(b, b.dataset.palettePick === choice));
  const finish = finishHost?.getAttribute("data-finish") === "metal" ? "metal" : "grey";
  finishButtons.forEach((b) => press(b, b.dataset.finishPick === finish));
  const view = root.closest("[data-view]")?.getAttribute("data-view") ?? "mid";
  viewButtons.forEach((b) => press(b, b.dataset.viewPick === view));
}

// ---- explode ----
function scheduleApart(on) {
  const goal = on ? 1 : 0;
  let index = 0;
  // A lift takes out one part (and whatever blocks its way out); the rest stay home.
  for (const id of on ? (state.lift ? D.lifts[state.lift] : D.stagger) : [...D.stagger].reverse()) {
    if (piece[id].target === goal) piece[id].pending = null;
    else piece[id].pending = { value: goal, at: state.clock + (still.matches ? 0 : index++ * SPRING.stagger) };
  }
}
function setApart(on) {
  if (state.apart === on && !state.armed) return;
  state.apart = on;
  if (!on) state.lift = null;
  state.step = null;
  if (state.crank) letGo();
  if (on) {
    state.inched = false;
    state.armed = true;
    state.park = null;
    announce(Math.abs(state.fps) > 0.05 ? "stopping the motor, then taking it apart" : "taking apart");
  } else {
    const nothingMoved = state.armed && !springsMoving() && IDS.every((id) => piece[id].x === 0);
    state.armed = false;
    state.park = null;
    scheduleApart(false);
    if (nothingMoved) {
      settled = true;
      // A speed chip or a step that cancelled it says what happens next, after this.
      announce("stays together");
      markButtons();
      describe();
      run();
      return;
    }
    announce("putting together");
  }
  settled = false;
  markButtons();
  describe();
  run();
}
function steerSpring(s, dt, calm) {
  if (s.pending && (calm || state.clock >= s.pending.at)) {
    s.target = s.pending.value;
    s.pending = null;
  }
  if (calm) {
    s.x = s.target;
    s.v = 0;
    return false;
  }
  for (let i = 0; i < SPRING.substeps; i++) {
    const h = dt / SPRING.substeps;
    s.v += ((s.target - s.x) * SPRING.stiffness - s.v * SPRING.damping) * h;
    s.x += s.v * h;
  }
  // Within a third of a pixel of home the part is home.
  if (Math.abs(s.target - s.x) < 2e-3 && Math.abs(s.v) < 2e-3) {
    s.x = s.target;
    s.v = 0;
    return s.pending !== null;
  }
  return true;
}
function place() {
  for (const node of nodes) {
    const share = piece[node.piece].x;
    const tx = (D.EX[0] * node.m[0] + D.EY[0] * node.m[1] + D.EZ[0] * node.m[2]) * share;
    const ty = (D.EX[1] * node.m[0] + D.EY[1] * node.m[1] + D.EZ[1] * node.m[2]) * share;
    const text = share === 0 ? "" : `translate(${tx.toFixed(2)} ${ty.toFixed(2)})`;
    if (text !== node.shown) {
      node.shown = text;
      if (text) node.el.setAttribute("transform", text);
      else node.el.removeAttribute("transform");
    }
  }
  const next = nodes.map((_, index) => index).sort((a, b) => nodes[a].key + nodes[a].lift * piece[nodes[a].piece].x - (nodes[b].key + nodes[b].lift * piece[nodes[b].piece].x));
  if (next.some((index, at) => index !== order[at])) {
    const fragment = document.createDocumentFragment();
    for (const index of next) fragment.appendChild(nodes[index].el);
    machine.appendChild(fragment);
    order = next;
  }
}

// ---- selection and the demo each part runs ----
const DEMOS = {
  movement: { fps: 1, text: "geneva cross · a quarter turn, then locked" },
  shutter: { fps: 1, text: "shutter · a blade over each pull-down" },
  gate: { fps: 1, text: "gate · still for ¾ of every frame" },
  film: { fps: 3, text: "loops · breathe 14 mm a frame" },
  rollers: { fps: 3, text: "pad rollers · film stays on the teeth" },
  lens: { fps: 24, text: "lens · upside down in, upright out" },
  lamp: { fps: 24, text: "lamp · steady; the shutter flickers it" },
  reels: { fps: 24, text: "reels · 90 ft a minute at 24 fps" },
};
function select(id, { demo = false } = {}) {
  if (id === "stand" || id === "head") id = null;
  state.selected = id;
  for (const node of nodes) {
    if (id && node.piece === id) node.el.setAttribute("data-on", "");
    else node.el.removeAttribute("data-on");
  }
  if (id) stage.setAttribute("data-focus", "");
  else stage.removeAttribute("data-focus");
  state.demo = demo && id && !state.apart ? id : null;
  state.demoAt = null;
  if (state.demo) state.inched = false;
  state.target = state.demo ? DEMOS[id].fps : state.chosen;
  markButtons();
  describe();
  if (id) announce(D.pieces[id].say);
  run();
}

// ---- peek: a part's legend chip and its drawing light each other on hover or focus ----
let peeked = null;
function peek(id) {
  if (id === "stand" || id === "head") id = null;
  if (id === peeked) return;
  peeked = id;
  for (const node of nodes) {
    if (id && node.piece === id) node.el.setAttribute("data-peek", "");
    else node.el.removeAttribute("data-peek");
  }
  partButtons.forEach((b) => (b.dataset.part === id ? b.setAttribute("data-peek", "") : b.removeAttribute("data-peek")));
  if (id) stage.setAttribute("data-peek", "");
  else stage.removeAttribute("data-peek");
}
partButtons.forEach((b) => {
  listen(b, "pointerenter", () => peek(b.dataset.part));
  listen(b, "pointerleave", () => peek(null));
  listen(b, "focus", () => peek(b.dataset.part));
  listen(b, "blur", () => peek(null));
});

// ---- sound: a gate clatter on every pull-down, motor hum, the 2-pop ----
let audio = null;
function startAudio() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  const ctx = new Ctx();
  const master = ctx.createGain();
  master.gain.value = 0.5;
  master.connect(ctx.destination);
  const hum = ctx.createOscillator();
  hum.type = "sawtooth";
  const humGain = ctx.createGain();
  humGain.gain.value = 0;
  const humFilter = ctx.createBiquadFilter();
  humFilter.type = "lowpass";
  humFilter.frequency.value = 300;
  hum.connect(humFilter).connect(humGain).connect(master);
  hum.start();
  const noise = ctx.createBuffer(1, ctx.sampleRate * 0.03, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.004));
  return {
    ctx,
    master,
    tick(level) {
      const src = ctx.createBufferSource();
      src.buffer = noise;
      const band = ctx.createBiquadFilter();
      band.type = "bandpass";
      band.frequency.value = 2400;
      band.Q.value = 1.4;
      const g = ctx.createGain();
      g.gain.value = 0.22 * level;
      src.connect(band).connect(g).connect(master);
      src.start();
    },
    pop() {
      const o = ctx.createOscillator();
      o.frequency.value = 1000;
      const g = ctx.createGain();
      const t = ctx.currentTime;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.12, t + 0.004);
      g.gain.setValueAtTime(0.12, t + 0.038);
      g.gain.linearRampToValueAtTime(0, t + 0.042);
      o.connect(g).connect(master);
      o.start(t);
      o.stop(t + 0.05);
    },
    hum(fps) {
      hum.frequency.setTargetAtTime(28 + fps * 2.4, ctx.currentTime, 0.08);
      humGain.gain.setTargetAtTime(fps > 0.05 ? 0.03 + fps * 0.0016 : 0, ctx.currentTime, 0.12);
    },
    close() {
      ctx.close();
    },
  };
}

// ---- drawing one moment of the machine ----
const runs = D.runs.map((run) => ({ ...run, holes: part(`marks-${run.id}`)?.querySelector(".pj-perfs"), lines: part(`marks-${run.id}`)?.querySelector(".pj-framelines") }));
const plateEl = (id) => {
  const el = stage.querySelector(`[data-plate="${id}"]`);
  return el && { back: el.querySelector('[data-turn="back"]'), walls: [...el.querySelectorAll('[data-turn="wall"]')], front: el.querySelector('[data-turn="front"]'), conn: el.querySelector('[data-turn="conn"]') };
};
const DEFS = { crank2: parts.handCrankDef(), cross: parts.crossDef(), crank: parts.crankDef(), lock: parts.lockDef(), feed: parts.flangeDef("feed", D.reels.feed), take: parts.flangeDef("take", D.reels.take), feedFar: parts.flangeDef("feed", D.reels.feed, { far: true }), takeFar: parts.flangeDef("take", D.reels.take, { far: true }) };
const groups = {
  shutter: part("shutter"),
  pin: part("pin"),
  loopU: part("loop-U"),
  loopL: part("loop-L"),
  gate: part("gate-frame"),
  picture: part("picture"),
  ammeter: part("ammeter"),
  pulleyScrews: part("screws-pulley")?.querySelector('[data-turn="front"]'),
  knurls: { handcrank: part("knurl-handcrank"), clutch: part("knurl-clutch") },
  teeth: Object.fromEntries(Object.keys(D.sprockets).map((id) => [id, [part(`teeth-${id}`), part(`screws-${id}`)].map((g) => g?.querySelector('[data-turn="front"]')).filter(Boolean)])),
};
const plates = { crank2: plateEl("handcrank"), cross: plateEl("cross"), crank: plateEl("crank"), lock: plateEl("lock"), feed: plateEl("flange-feed"), take: plateEl("flange-take"), feedFar: plateEl("flange-feed-far"), takeFar: plateEl("flange-take-far") };
let shutterBlades = 2;
let shutterDefs = parts.shutterDefs(shutterBlades);
let shutterPlates = shutterDefs.map((def) => plateEl(def.id));
const turnOf = (deg) => ((deg % 360) + 360) % 360;
// The knurl's ribs repeat every rib, so only the phase within one rib matters.
function knurl(id, phase) {
  const el = groups.knurls[id];
  const q = D.knurls[id];
  if (!el || !q) return;
  const pitch = TAU / q.n;
  el.innerHTML = K.fadedSvg(G.ribsOf(q.F, q.s0, q.s1, q.r, q.n, D.P, { phase: ((phase % pitch) + pitch) % pitch, fade: [0.1, 0.55], seams: true }), { tone: "lo" });
}
function turn(el, def, deg) {
  if (!el) return;
  const t = parts.plateTurn(def, deg);
  el.back.setAttribute("transform", t.back);
  el.walls.forEach((wall, k) => wall.setAttribute("transform", t.walls[k]));
  el.front.setAttribute("transform", t.front);
  el.conn.setAttribute("d", t.conn);
}
const S = D.sprockets;
const lit = { screen: stage.querySelector(".pj-screen"), beam: part("light-beam"), lamp: [part("port"), part("condenser"), stage.querySelector(".pj-pilot")], gate: part("gate-frame") };
let shownLight = "";
let shownLamp = "";
let shownGate = "";
let drawnKey = "";
function draw(f0, f1, calm) {
  const c = f1;
  const i = M.intermittentOf(f1);
  const key = `${c.toFixed(5)}|${state.blades}`;
  if (key !== drawnKey) {
    drawnKey = key;
    const deg = 180 / Math.PI;
    // The inching knob turns once every eight frames; at rest (half a frame in) it sits where the
    // build drew and audited it.
    const crankDeg = -360 * (c - 0.5) * D.crankRatio;
    turn(plates.crank2, DEFS.crank2, crankDeg);
    knurl("handcrank", -crankDeg * (Math.PI / 180));
    turn(plates.cross, DEFS.cross, 90 * i);
    turn(plates.crank, DEFS.crank, -360 * c);
    turn(plates.lock, DEFS.lock, -360 * c);
    groups.pin.setAttribute("transform", parts.pinShift((3 * Math.PI) / 4 + TAU * c));
    if (state.blades !== shutterBlades) {
      shutterBlades = state.blades;
      shutterDefs = parts.shutterDefs(shutterBlades);
      groups.shutter.innerHTML = shutterDefs.map((def) => parts.plateSvg(def, 0)).join("");
      shutterPlates = shutterDefs.map((def) => plateEl(def.id));
    }
    shutterDefs.forEach((def, n) => turn(shutterPlates[n], def, 360 * (c - 0.125)));
    groups.pulleyScrews?.setAttribute("transform", `rotate(${turnOf(360 * (c - 0.125)).toFixed(2)})`);
    // Four teeth to a frame, exactly, so the teeth keep step with the perforations.
    const sprocketDeg = { feed: (-c * (360 * 4)) / S.feed.teeth, inter: (i * (360 * 4)) / S.inter.teeth, hold: (-c * (360 * 4)) / S.hold.teeth };
    for (const [id, els] of Object.entries(groups.teeth)) for (const el of els) el.setAttribute("transform", `rotate(${turnOf(sprocketDeg[id]).toFixed(2)})`);
    for (const id of ["feed", "take"]) {
      const a = ((c * FL) / D.reels[id].pack) * deg;
      turn(plates[id], DEFS[id], a);
      turn(plates[`${id}Far`], DEFS[`${id}Far`], a);
      if (id === "take") knurl("clutch", -a * (Math.PI / 180));
    }
    for (const run of runs) {
      const marks = parts.marks(run.pts, run.m0 - (run.drive === "c" ? c : i) * FL, { wrap: run.wrap, centre: run.centre });
      run.holes?.setAttribute("d", marks.holes);
      run.lines?.setAttribute("d", marks.lines);
    }
    for (const [id, group] of [["U", groups.loopU], ["L", groups.loopL]]) {
      const loop = D.loops[id];
      const length = loop.L0 + loop.sign * (c - i) * FL;
      const pts = parts.loopOf(loop, length);
      const marks = parts.marks(pts, loop.m0 - (loop.drive === "c" ? c : i) * FL, {});
      group.innerHTML = `${parts.ribbonSvg(pts, { tone: "hi", loop: true })}<path class="pj-perfs" d="${marks.holes}"/><path class="iso-line pj-framelines" data-tone="lo" d="${marks.lines}"/>${parts.traceSvg(pts, loop.m0, loop.L0)}`;
    }
    groups.gate.innerHTML = parts.gateFrameSvg(i, leaderOf);
  }
  // The picture shows the frame that is sitting in the gate; light reaches it only while
  // the shutter is open and the dowser is up.
  const n = Math.floor(i + 1e-9);
  if (n !== shownFrame) {
    shownFrame = n;
    groups.picture.innerHTML = parts.leaderSvg(leaderOf(n), D.pic.w, D.pic.h);
    if (audio) {
      audio.tick(clamp(state.fps / 24, 0.25, 1));
      if (leaderOf(n).pop && n !== lastPop && state.lamp > 0.5) {
        lastPop = n;
        audio.pop();
      }
    }
  }
  // Black leader passes no light.
  const clear = leaderOf(n).number === 0 ? 0.04 : 1;
  const mean = M.lightShare(state.blades);
  const raw = f1 !== f0 ? M.screenLight(Math.min(f0, f1), Math.max(f0, f1), state.blades) : M.shutterOpen(((f1 % 1) + 1) % 1, state.blades);
  const hz = M.flickerHz(Math.abs(state.fps), state.blades);
  // Slowed down nothing fuses: each flash shows, at a little under full depth.
  const fuse = state.slow && !calm ? 0 : calm && !state.crank && !state.step && state.target > 3.05 ? 1 : ease(30, 52, hz);
  // While the tour plays by itself, flicker faster than three flashes a second is shown at a
  // third of its depth, so an unasked-for screen never flashes hard; slower blinks, and
  // everything the reader chooses, show in full.
  const depth = state.slow ? 0.7 : touring && hz > 3 ? 0.35 : 1;
  const seen = mean + (raw - mean) * (1 - fuse) * depth;
  state.light = state.beam * clear * Math.pow(clamp(seen / M.lightShare(1), 0, 1), 0.6);
  // Only the few elements that glow carry these, so a change restyles them alone.
  const light = state.light.toFixed(3);
  const lamp = state.lamp.toFixed(3);
  if (light !== shownLight) {
    shownLight = light;
    lit.screen?.style.setProperty("--pj-light", light);
    lit.beam?.style.setProperty("--pj-light", light);
  }
  if (lamp !== shownLamp) {
    shownLamp = lamp;
    for (const el of lit.lamp) el?.style.setProperty("--pj-lamp", lamp);
  }
  // The fire shutter sits between the lamp and the film: down, the gate goes dark too.
  const gateLit = state.beam.toFixed(3);
  if (gateLit !== shownGate) {
    shownGate = gateLit;
    lit.gate?.style.setProperty("--pj-lamp", gateLit);
  }
  traceDraw(calm);
  stripDraw();
  groups.ammeter?.setAttribute("transform", `rotate(${(-40 + 80 * state.lamp).toFixed(1)} 0 4)`);
  if (beam) beam.paint();
}

// ---- the trace: a pulse of lamp light that runs the threading, feed reel to take-up ----
const TRACE = { pass: 5, pulse: 70 };
const TRACE_SAY = {
  a1: "off the feed reel",
  a2: "feed sprocket · pulls it at a steady speed",
  U: "upper loop · slack, so the gate can stop the film",
  b1: "gate · each frame stops here to be shown",
  b2: "intermittent sprocket · steps it on a frame",
  L: "lower loop · takes the jerk back up",
  c1: "hold-back sprocket · steady again",
  c2: "onto the take-up reel",
};
const traceAt = () => (state.trace ? ((((state.clock - state.trace.t0) / TRACE.pass) % 1) + 1) % 1 * D.trace.total : 0);
function traceStretch() {
  const s = traceAt();
  let id = "a1";
  for (const [key, start] of Object.entries(D.trace.at)) if (s >= start) id = key;
  return id;
}
function traceDraw(calm) {
  if (!state.trace) return;
  const s = traceAt();
  const w = TRACE.pulse;
  for (const el of stage.querySelectorAll(".pj-trace")) {
    const length = Number(el.getAttribute("pathLength"));
    if (calm) {
      el.style.strokeDasharray = "none";
      continue;
    }
    // One dash, measured in film millimetres, ending where the pulse is; off this stretch it
    // sits in the gap.
    const local = s - Number(el.dataset.s0);
    el.style.strokeDasharray = `${w} ${length + 3 * w}`;
    el.style.strokeDashoffset = String(local > 0 && local - w < length ? w - local : w + 1);
  }
}
function setTrace(on, { tour = false } = {}) {
  state.trace = on ? { t0: state.clock, tour } : null;
  if (on) stage.setAttribute("data-trace", "");
  else stage.removeAttribute("data-trace");
  markButtons();
  if (!tour) announce(on ? "tracing the film path" : "trace off");
  run();
}

// ---- the timing strip: one frame of the mechanism, drawn from the model, with a playhead ----
const STRIP = { x0: 64, x1: 236 };
const stripX = (p) => STRIP.x0 + (STRIP.x1 - STRIP.x0) * p;
const fract = (x) => x - Math.floor(x);
let stripBlades = 0;
let shownHead = "";
let scrub = null;
function stripDraw() {
  if (!timing) return;
  const looking = state.inched && state.clock - state.inchedAt < FIRE + 1;
  const show = !state.apart && !state.closer && (state.slow || !!scrub || !!state.step || looking || (Math.abs(state.target) > 0 && Math.abs(state.target) <= 3.05));
  root.toggleAttribute("data-timing", show);
  if (!show) return;
  if (stripBlades !== state.blades) {
    stripBlades = state.blades;
    let pull = 0;
    while (pull < 1 && M.crossOf(pull) < 1) pull += 1 / 400;
    const light = Array.from({ length: 121 }, (_, i) => `${stripX(i / 120).toFixed(1)} ${(31 - 9 * M.shutterOpen(i / 120, state.blades)).toFixed(2)}`);
    timing.querySelector("svg").innerHTML = `<text x="0" y="11">pull-down</text><text x="0" y="29">light</text><path class="pj-t-track" d="M${STRIP.x0} 8H${STRIP.x1}M${STRIP.x0} 31H${STRIP.x1}"/><path class="pj-t-pull" d="M${stripX(0)} 5H${stripX(pull).toFixed(1)}V11H${stripX(0)}Z"/><path class="pj-t-light" d="M${STRIP.x0} 31L${light.join("L")}L${STRIP.x1} 31Z"/><path class="pj-t-head" d="M0 1V35"/>`;
    shownHead = "";
  }
  const x = stripX(fract(state.frames)).toFixed(1);
  if (x !== shownHead) {
    shownHead = x;
    timing.querySelector(".pj-t-head")?.setAttribute("transform", `translate(${x} 0)`);
    timing.setAttribute("aria-valuenow", String(Math.round(fract(state.frames) * 100)));
    timing.setAttribute("aria-valuetext", M.phaseOf(state.frames, state.blades));
  }
}
// Dragging the strip turns the mechanism by hand through one frame.
function startScrub() {
  takeOver();
  select(null);
  if (state.apart) setApart(false);
  if (state.crank) letGo();
  state.chosen = 0;
  state.target = 0;
  state.step = null;
  motor.x = 0;
  motor.v = 0;
  state.inched = true;
  state.inchedAt = state.clock;
  scrub = { base: Math.floor(state.frames), id: null };
  markButtons();
}
function scrubTo(phase) {
  state.frames = scrub.base + phase;
  state.inchedAt = state.clock;
  run();
}
const phaseAt = (event) => {
  const box = timing.getBoundingClientRect();
  return clamp((((event.clientX - box.left) / box.width) * 240 - STRIP.x0) / (STRIP.x1 - STRIP.x0), 0, 0.999);
};
if (timing) {
  listen(timing, "pointerdown", (event) => {
    startScrub();
    scrub.id = event.pointerId;
    try {
      timing.setPointerCapture(event.pointerId);
    } catch {}
    scrubTo(phaseAt(event));
  });
  listen(timing, "pointermove", (event) => {
    if (scrub && scrub.id === event.pointerId) scrubTo(phaseAt(event));
  });
  const endScrub = () => (scrub = null);
  listen(timing, "pointerup", endScrub);
  listen(timing, "pointercancel", endScrub);
  listen(timing, "keydown", (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    startScrub();
    scrubTo(clamp(fract(state.frames) + (event.key === "ArrowRight" ? 1 : -1) / 48, 0, 0.999));
    scrub = null;
  });
}

// ---- look closer: the camera whips in to four details and holds on each while it works ----
const SHOTS = ["gate", "movement", "shutter", "lamp"];
const CLOSER = { whip: 0.55, hold: 2.9, back: 0.7 };
const HERO = { x: 0.5, y: 0.5, s: 1 };
let cam = HERO;
// A shot frames the part's rest pose: getBBox leaves out the explode's own transform.
function shotOf(id) {
  const boxes = nodes.filter((node) => node.piece === id).map((node) => node.el.getBBox());
  const x0 = Math.min(...boxes.map((b) => b.x));
  const y0 = Math.min(...boxes.map((b) => b.y));
  const x1 = Math.max(...boxes.map((b) => b.x + b.width));
  const y1 = Math.max(...boxes.map((b) => b.y + b.height));
  return { x: (x0 + x1) / 2 / D.W, y: (y0 + y1) / 2 / D.H, s: clamp(0.5 * Math.min(D.W / (x1 - x0), D.H / (y1 - y0)), 1.6, 3) };
}
function startCloser() {
  if (state.apart) setApart(false);
  select(null);
  const keys = [{ at: 0, cam }];
  let t = 0;
  for (const id of SHOTS) {
    const shot = shotOf(id);
    keys.push({ at: (t += CLOSER.whip), cam: shot, id, whip: true });
    // The hold keeps drifting a little, so a held shot still reads as a camera.
    keys.push({ at: (t += CLOSER.hold), cam: { x: shot.x + 0.01, y: shot.y - 0.006, s: shot.s * 1.06 }, id });
  }
  keys.push({ at: (t += CLOSER.back), cam: HERO, whip: true });
  state.closer = { t: 0, keys, id: null, back: false };
  const controls = root.querySelector(".pj-controls")?.getBoundingClientRect();
  if (controls) stage.style.setProperty("--pj-cut", `${Math.max(0, stage.getBoundingClientRect().bottom - controls.top + 8).toFixed(0)}px`);
  stage.setAttribute("data-closer", "");
  markButtons();
  announce("looking closer");
  run();
}
function pullBack() {
  state.closer = { t: 0, keys: [{ at: 0, cam }, { at: 0.45, cam: HERO, whip: true }], id: null, back: true };
  markButtons();
}
const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
function stepCloser(dt, calm) {
  const c = state.closer;
  c.t += dt;
  const keys = c.keys;
  const end = keys[keys.length - 1];
  if (c.t >= end.at) {
    setCam(HERO);
    state.closer = null;
    stage.removeAttribute("data-closer");
    if (!c.back) {
      select(null);
      announce("back to the whole machine");
    }
    markButtons();
    return;
  }
  let i = 0;
  while (keys[i + 1].at <= c.t) i++;
  const [a, b] = [keys[i], keys[i + 1]];
  if (b.id && b.id !== c.id) {
    c.id = b.id;
    select(b.id, { demo: true });
  }
  // Under reduced motion the camera cuts and holds still.
  if (calm) return setCam(b.whip ? b.cam : a.cam);
  const k = (c.t - a.at) / (b.at - a.at);
  const e = b.whip ? easeInOut(k) : k;
  setCam({ x: a.cam.x + (b.cam.x - a.cam.x) * e, y: a.cam.y + (b.cam.y - a.cam.y) * e, s: Math.exp(Math.log(a.cam.s) + (Math.log(b.cam.s) - Math.log(a.cam.s)) * e) });
}
let shownCam = "";
function setCam(next) {
  cam = next;
  const key = `${next.x.toFixed(4)}|${next.y.toFixed(4)}|${next.s.toFixed(4)}`;
  if (key === shownCam) return;
  shownCam = key;
  stage.style.setProperty("--pj-zx", next.x.toFixed(4));
  stage.style.setProperty("--pj-zy", next.y.toFixed(4));
  stage.style.setProperty("--pj-zs", next.s.toFixed(4));
}

// ---- the projector's beam: haze in the cone from the shutter to the screen ----
const LIGHT = (root.closest("[data-theme]")?.getAttribute("data-theme") ?? "dark") !== "dark" ? 1 : 0;
const beam = (() => {
  const canvas = stage.querySelector(".pj-beam");
  const L = D.lens;
  const FRAGMENT = `
uniform float uLight;
uniform float uLevel;
uniform float uGate;
const vec3 AXIS0=vec3(${L.x1.toFixed(1)},${D.AY.toFixed(1)},${D.ZA.toFixed(1)});
const float X0=${(D.shutter.x1 + 0.5).toFixed(1)};
const float X1=${D.screenX.toFixed(1)};
const float PUPIL=${L.pupil.toFixed(1)};
const vec2 PIC=vec2(${(D.pic.w / 2).toFixed(2)},${(D.pic.h / 2).toFixed(2)});
const vec3 LAMP=vec3(${(D.lamp.x1 + 22).toFixed(1)},${D.AY.toFixed(1)},${D.ZA.toFixed(1)});
const float GATEX=${D.aperture.x0.toFixed(1)};
const vec2 WIN=vec2(${(D.win.w / 2).toFixed(2)},${(D.win.h / 2).toFixed(2)});
float coneAt(vec3 p){
  float t=(p.x-AXIS0.x)/(X1-AXIS0.x);
  vec2 hw=mix(vec2(PUPIL),PIC,t);
  vec2 q=abs(vec2(p.y-AXIS0.y,p.z-AXIS0.z))/hw;
  float edge=max(q.x,q.y);
  return (1.-smoothstep(.82,1.,edge))*smoothstep(X0,X0+6.,p.x)*(1.-smoothstep(X1-4.,X1,p.x));
}
float throatAt(vec3 p){
  float t=(p.x-LAMP.x)/(GATEX-LAMP.x);
  vec2 hw=mix(vec2(25.),WIN*1.15,t);
  vec2 q=abs(vec2(p.y-LAMP.y,p.z-LAMP.z))/hw;
  float r=length(q);
  return (1.-smoothstep(.7,1.,r))*smoothstep(LAMP.x,LAMP.x+4.,p.x)*(1.-smoothstep(GATEX-3.,GATEX,p.x));
}
void main(){
  vec2 vb=viewOf(gl_FragCoord.xy);
  vec3 o=rayOf(vb);
  vec3 v=towardViewer();
  float a=0.;
  float g=0.;
  float j=hash12(gl_FragCoord.xy+fract(uTime*.37)*41.);
  for(int i=0;i<40;i++){
    float t=-520.+(float(i)+j)*26.;
    vec3 p=o+v*t;
    float dust=.75+.25*noise3(p*.045+vec3(0.,0.,uTime*3.));
    a+=coneAt(p)*dust;
    g+=throatAt(p);
  }
  a*=26./320.;
  g*=26./150.;
  float e=a*uLevel+g*uGate*.8;
  vec3 warm=vec3(1.,.93,.80);
  vec3 col=tonemap(warm*e*.55,1.6);
  float m=max(col.r,max(col.g,col.b));
  vec4 dark=vec4(col,m);
  float ink=clamp(e*.10,0.,.16);
  vec4 light=vec4(vec3(.36,.30,.22)*ink,ink);
  vec4 outc=mix(dark,light,uLight);
  float n=(hash12(gl_FragCoord.xy+fract(uTime*.61)*91.)+hash12(gl_FragCoord.yx*1.37+fract(uTime*.37)*57.)-1.)/255.;
  outc=max(outc+n*smoothstep(0.,1.5/255.,outc.a),0.);
  outc.rgb=min(outc.rgb,vec3(outc.a));
  gl_FragColor=outc;
}`;
  const layer = glLayer({ canvas, fragment: FRAGMENT, view: [D.W, D.H], camera: D.camera, uniforms: ["uLevel", "uGate"], fixed: { uLight: LIGHT } });
  if (!layer) return null;
  stage.setAttribute("data-gl", "");
  let drawn = false;
  return {
    paint() {
      const level = state.light;
      const gate = state.beam;
      if (level < 1e-3 && gate < 1e-3) {
        if (drawn) layer.clear();
        drawn = false;
        return;
      }
      layer.draw({ uLevel: level, uGate: gate }, still.matches ? 0.8 : state.clock);
      drawn = true;
    },
  };
})();

// ---- the idle tour: it runs until the reader first touches the figure, then never again,
// and waits while the pointer or focus is on the figure ----
const TOUR = [
  { at: 0, speed: 1, part: "movement" },
  { at: 6, speed: 3, part: "film", trace: true },
  { at: 11, speed: 24, part: null, blades: 2 },
  { at: 15, speed: 24, part: null, blades: 1 },
  { at: 18.5, speed: 16, part: null, blades: 3, say: "3 blades · 48 Hz at 16 fps, but 5% light" },
  { at: 22.5, speed: 24, part: null, blades: 2 },
  { at: 24.5, speed: 0, part: null },
  { at: 27.5, apart: true },
  { at: 35, apart: false },
  { at: 40, end: true },
];
let tourStep = -1;
// Added to the frame number when choosing which leader frame to show, so the tour can start
// the countdown again from 8 while the machine keeps turning continuously.
let leaderShift = 0;
const leaderOf = (n) => M.leaderAt(n + leaderShift);
let tourSay = "";
let hovering = stage.matches(":hover");
let focused = root.contains(document.activeElement);
function stepTour(dt) {
  if (hovering || focused) return;
  tourClock += dt;
  let index = 0;
  for (let i = 0; i < TOUR.length; i++) if (tourClock >= TOUR[i].at) index = i;
  if (TOUR[index].end) {
    tourClock = 0;
    index = 0;
    leaderShift = -Math.floor(M.intermittentOf(state.frames) + 1e-9);
    shownFrame = -1;
  }
  if (index === tourStep) return;
  tourStep = index;
  const s = TOUR[index];
  tourSay = s.say ?? "";
  if (s.blades) state.blades = s.blades;
  if (!!s.trace !== !!state.trace) setTrace(!!s.trace, { tour: true });
  // Every running beat is shorter than the numbered leader, so starting each at the 8 keeps
  // its flicker on picture rather than on the black tail.
  if (s.speed >= 16) {
    const now = Math.floor(M.intermittentOf(state.frames) + 1e-9);
    const left = M.LEADER.pop - leaderOf(now).frame;
    const needs = s.speed * (TOUR[index + 1].at - s.at);
    if (leaderOf(now).number === 0 || needs > left) {
      leaderShift = -now;
      shownFrame = -1;
    }
  }
  if (s.apart !== undefined) {
    select(null);
    setApart(s.apart);
    return;
  }
  state.chosen = s.speed;
  if (s.part) select(s.part, { demo: true });
  else select(null);
  markButtons();
}
function takeOver() {
  touring = false;
  tourSay = "";
  if (state.closer && !state.closer.back) pullBack();
  if (state.trace?.tour) setTrace(false);
  // The tour may have left a speed no chip offers; the reader's machine runs at 24.
  if (!SPEEDS.includes(state.chosen)) {
    state.chosen = 24;
    if (!state.demo) state.target = 24;
    markButtons();
  }
}
listen(stage, "pointerenter", () => (hovering = true));
listen(stage, "pointerleave", () => (hovering = false));
listen(root, "focusin", () => (focused = true));
listen(root, "focusout", (event) => (focused = root.contains(event.relatedTarget)));

// ---- the frame loop ----
const FIRE = 3;
// Slow motion runs the chosen speed at a sixteenth of real time, so a 24 fps pull-down and its
// shutter can be watched happening.
const SLOW = 16;
function idleText() {
  const out = state.lift ? (D.lifts[state.lift].length > 1 ? `taking the ${D.pieces[D.lifts[state.lift][0]].name} off first` : "lifting it out") : "taking apart";
  if (state.armed) return Math.abs(state.fps) > 0.05 ? `stopping · then ${out}` : out;
  if (springsMoving()) return state.apart ? out : "putting together";
  if (state.lift) return `lifted out · ${D.pieces[state.lift].say}`;
  if (state.apart && !state.selected) return `apart · ${MOVERS.length} assemblies · ${narrow.matches ? "tap" : "click"} one`;
  if (state.selected && state.demo && state.demoAt !== null && state.clock - state.demoAt < 3.2) return D.lifts[state.selected] ? `${DEMOS[state.selected].text} · ${narrow.matches ? "tap" : "click"} again to lift it out` : DEMOS[state.selected].text;
  if (state.selected && !state.demo) return D.pieces[state.selected].say;
  if (state.trace && !state.apart) return still.matches ? "trace · feed reel to take-up, past three sprockets and the gate" : `trace · ${TRACE_SAY[traceStretch()]}`;
  if (tourSay && Math.abs(state.fps - state.target) < 0.5) return tourSay;
  if (state.inched && !state.crank && !state.step && Math.abs(state.fps) < 0.05 && state.clock - state.inchedAt > FIRE) return "stopped · fire shutter down";
  if (state.inched && !state.crank && !state.step && Math.abs(state.fps) < 0.05) return `stopped · ${M.phaseOf(state.frames, state.blades)}`;
  let text = M.readoutOf(state.fps, state.blades, state.frames);
  // Black leader passes no light, whatever the shutter is doing; nor does a lamp still coming up.
  const black = leaderOf(Math.floor(M.intermittentOf(state.frames) + 1e-9)).number === 0;
  if (black) text = text.replace("light on screen", "black leader, no picture").replace(/\d+% light$/, "black leader");
  else if (state.beam < 0.5 && !still.matches) {
    const rising = state.lamp > 0.5 ? "fire shutter opening" : "lamp coming up";
    text = text.replace("light on screen", rising).replace(/\d+% light$/, rising);
  }
  if (state.slow && Math.abs(state.fps) > 0.05 && !state.crank && !state.step) text += ` · ${SLOW}× slow`;
  return text;
}
const motor = { x: 0, v: 0 };
const lampState = { x: 0, v: 0 };
const fireState = { x: 0, v: 0 };
const hand = { rate: 0 };
let wasCalm = still.matches;
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  state.clock += dt;
  const calm = still.matches;
  if (calm !== wasCalm) {
    wasCalm = calm;
    if (calm) stillNow();
  }
  if (touring) stepTour(dt);
  if (state.closer) stepCloser(dt, calm);
  let f0 = state.frames;
  let moving = false;
  let jumped = false;
  const ready = home();
  if (state.crank && ready) {
    // The hand sets where the film should be; grabbed while running, the machine's own speed
    // fades into the hand instead of stopping dead.
    state.crank.goal += state.crank.carry * dt;
    state.crank.carry *= Math.exp(-dt / 0.3);
    state.frames += (state.crank.goal - state.frames) * (1 - Math.exp(-dt / 0.12));
    moving = true;
  } else if (state.step && ready && Math.abs(motor.x) < 0.02) {
    // A step waits for the motor to run down, then moves the film one frame at an even pace.
    motor.x = 0;
    motor.v = 0;
    if (state.step.cycle === null) state.step.cycle = stepCycle(state.frames, state.step.dir);
    state.step.goal = stepGoal(state.step, state.frames);
    if (calm) {
      state.frames = state.step.goal;
      jumped = true;
    }
    const dir = Math.sign(state.step.goal - state.frames);
    const next = state.frames + dir * dt * 0.75;
    state.frames = dir > 0 ? Math.min(next, state.step.goal) : Math.max(next, state.step.goal);
    // Moving at its own pace the step's speed is exact, so the readout's digit holds still.
    state.step.pace = state.frames === next && !jumped ? dir * 0.75 : null;
    if (state.frames === state.step.goal) {
      state.step = state.step.queue.length ? { cycle: null, goal: null, dir: state.step.queue[0], queue: state.step.queue.slice(1) } : null;
      state.inchedAt = state.clock;
    }
    moving = true;
  } else {
    const target = ready && !state.crank && !state.step && (state.lamp > 0.5 || calm) ? state.target : 0;
    // A waiting step brakes hard; otherwise the machine runs up and down at its own pace.
    const pace = state.step ? 0.12 : Math.abs(target) > Math.abs(motor.x) ? 0.7 : 0.45;
    moving = settle(motor, target, dt, pace, calm) || moving;
    // The run-down's last crawl is below what the eye or the readout can tell from stopped.
    if (target === 0 && Math.abs(motor.x) < 0.05) {
      motor.x = 0;
      motor.v = 0;
    }
    // Under reduced motion nothing moves unasked, but a speed the reader chose runs.
    state.frames += motor.x * dt * (state.slow ? 1 / SLOW : 1);
  }
  if (jumped) f0 = state.frames;
  const rate = (state.frames - f0) / dt;
  if (state.crank) {
    hand.rate = (state.crank.goal - state.frames) / 0.12;
    state.fps = hand.rate;
  } else if (state.step) {
    // Waiting for the run-down, the film moves at the motor's speed; stepping, at the step's.
    // The tick the run-down lands, the step's own pace takes over, so the readout never shows
    // "stopped" between the two.
    hand.rate =
      state.step.cycle === null
        ? motor.x || (ready && !calm ? 0.75 * state.step.dir : 0)
        : state.step.pace ?? hand.rate + (rate - hand.rate) * (1 - Math.exp(-dt / 0.15));
    state.fps = hand.rate;
  } else {
    hand.rate = 0;
    state.fps = motor.x;
  }
  // Stopped, the mechanism is inched round to its rest pose (the cross locked, the pin across
  // from it, the blades where they were drawn) before anything comes off.
  if (state.armed && Math.abs(state.fps) < 0.05) {
    if (state.park === null) state.park = Math.ceil(state.frames - 0.5 - 1e-6) + 0.5;
    if (calm) state.frames = state.park;
    state.frames = Math.min(state.park, state.frames + dt * 1.5);
    moving = true;
    if (state.frames === state.park) {
      state.armed = false;
      state.park = null;
      scheduleApart(true);
      describe();
    }
  }
  // The lamp is up while the film moves; stopped, it stays lit for a look at the frame, then
  // the fire shutter drops, as it does on a real projector, before the frame can scorch.
  const looking = state.inched && state.clock - state.inchedAt <= FIRE;
  const running = (ready && state.target > 0) || Math.abs(state.fps) >= 0.05 || state.crank || state.step;
  const lampOn = !state.apart && ready && (running || state.inched) ? 1 : 0;
  const beamOn = lampOn && (running || looking) ? 1 : 0;
  moving = settle(lampState, lampOn, dt, 0.18, calm) || moving;
  moving = settle(fireState, beamOn, dt, 0.12, calm) || moving;
  state.lamp = clamp(lampState.x, 0, 1);
  state.beam = clamp(Math.min(fireState.x, lampState.x), 0, 1);
  if (state.inched && !state.crank && !state.step && state.clock - state.inchedAt <= FIRE + 0.5) moving = true;
  let springs = false;
  for (const id of IDS) if (steerSpring(piece[id], dt, calm)) springs = true;
  if (springs) moving = true;
  // The tick the last part lands, or a step still waiting, the machine has more to do.
  if (home() !== ready || state.step) moving = true;
  if (!springs && !settled && !state.armed) {
    settled = true;
    announce(state.lift ? `${D.pieces[state.lift].name} lifted out` : state.apart ? `taken apart: ${MOVERS.length} assemblies` : "put together");
  }
  if (Math.abs(state.fps) > 1e-4) moving = true;
  if (Math.abs(hand.rate) > 1e-3) moving = true;
  if (state.demo && state.demoAt === null && Math.abs(state.fps - state.target) < 0.3) state.demoAt = state.clock;
  if (state.demo && (state.demoAt === null || state.clock - state.demoAt < 3.4)) moving = true;
  if (state.trace && !calm) moving = true;
  if (state.closer) moving = true;
  draw(f0, state.frames, calm);
  place();
  if (audio) audio.hum(visible && !document.hidden ? Math.abs(state.fps) : 0);
  say(idleText());
  frame = visible && (moving || touring) ? requestAnimationFrame(tick) : 0;
}
function run() {
  if (!frame && visible) {
    last = 0;
    frame = requestAnimationFrame(tick);
  }
}
const observer = new IntersectionObserver(
  (entries) => {
    visible = entries[entries.length - 1].isIntersecting;
    if (visible) run();
    else if (audio) audio.hum(0);
  },
  { rootMargin: "120px 0px" },
);
observer.observe(stage);
listen(document, "visibilitychange", () => {
  if (!audio) return;
  if (document.hidden) audio.ctx.suspend();
  else audio.ctx.resume();
});

// ---- input ----
function setSpeed(fps) {
  takeOver();
  state.step = null;
  if (state.crank) letGo();
  state.inched = false;
  state.chosen = fps;
  select(null);
  if (state.apart) setApart(false);
  announce(fps ? `${fps} frame${fps === 1 ? "" : "s"} a second` : "stopped");
  run();
}
speedButtons.forEach((b) => listen(b, "click", () => setSpeed(Number(b.dataset.speed))));
bladeButtons.forEach((b) =>
  listen(b, "click", () => {
    takeOver();
    state.blades = Number(b.dataset.blades);
    drawnKey = "";
    markButtons();
    describe();
    announce(`${state.blades} blade${state.blades === 1 ? "" : "s"}, ${Math.round(M.lightShare(state.blades) * 100)} percent of the light`);
    run();
  }),
);
// One step brings the next (or the last) frame into the gate and ends at the instant the
// shutter is most open, so it shows lit on the screen. Presses queue.
// The step's goal is a shutter gap in the frame the step brings in: the first one ahead of the
// film in the step's direction, so a blade change part-way never sends the film back.
function stepGoal(step, from) {
  const gaps = Array.from({ length: state.blades }, (_, k) => step.cycle + 0.125 + (k + 0.5) / state.blades);
  const ahead = step.dir > 0 ? gaps.filter((g) => g >= from - 1e-9) : gaps.filter((g) => g <= from + 1e-9).reverse();
  return ahead[0] ?? (step.dir > 0 ? Math.max(from, step.cycle + M.openPhase(state.blades)) : Math.min(from, step.cycle + M.openPhase(state.blades)));
}
function stepCycle(from, dir) {
  const n = Math.floor(M.intermittentOf(from) + 1e-6);
  return dir > 0 ? n : n - 2;
}
function stepFrame(dir = 1) {
  takeOver();
  if (state.selected) select(null);
  state.chosen = 0;
  state.target = 0;
  if (state.crank) letGo();
  state.inched = true;
  state.inchedAt = state.clock;
  if (state.apart) setApart(false);
  if (state.step) state.step.queue.push(dir);
  else {
    hand.rate = still.matches ? 0 : motor.x;
    state.step = { cycle: null, goal: null, dir, queue: [] };
  }
  markButtons();
  describe();
  announce(dir > 0 ? "one frame on" : "one frame back");
  run();
}
listen(stepButton, "click", () => stepFrame(1));
listen(apartButton, "click", () => {
  takeOver();
  select(null);
  setApart(!state.apart);
});
listen(traceButton, "click", () => {
  const on = !state.trace;
  takeOver();
  select(null);
  setTrace(on);
});
listen(slowButton, "click", () => {
  takeOver();
  state.slow = !state.slow;
  // Slow motion is for watching the machine run at sound speed; a sixteenth of a slow speed or
  // a part's demo would barely move.
  if (state.slow && (state.chosen < 16 || state.demo)) setSpeed(24);
  markButtons();
  announce(state.slow ? `slow motion, ${SLOW} times slower` : "real time");
  run();
});
listen(closerButton, "click", () => {
  const on = !state.closer || state.closer.back;
  takeOver();
  if (on) startCloser();
});
listen(soundButton, "click", () => {
  if (audio) {
    audio.close();
    audio = null;
    soundButton.setAttribute("aria-pressed", "false");
  } else {
    audio = startAudio();
    if (audio) soundButton.setAttribute("aria-pressed", "true");
  }
});
finishButtons.forEach((b) =>
  listen(b, "click", () => {
    const metal = b.dataset.finishPick === "metal";
    if (metal) finishHost?.setAttribute("data-finish", "metal");
    else finishHost?.removeAttribute("data-finish");
    try {
      localStorage.setItem("pj-finish", metal ? "metal" : "grey");
    } catch {}
    markButtons();
    announce(metal ? "metal finish" : "grey finish");
  }),
);
// A view is another drawing: the page loads it and remounts the figure on it.
viewButtons.forEach((b) => listen(b, "click", () => root.dispatchEvent(new CustomEvent("pj-view", { bubbles: true, detail: b.dataset.viewPick }))));
// The page around the figure owns its colours: it keeps the choice and remounts the figure.
paletteButtons.forEach((b) => listen(b, "click", () => root.dispatchEvent(new CustomEvent("pj-palette", { bubbles: true, detail: b.dataset.palettePick }))));
// A click shows a part working; a second click lifts it out on its own, and a third, or a
// click anywhere else, puts it back.
function choose(id) {
  if (id === "stand" || id === "head") id = null;
  if (state.lift) {
    setApart(false);
    return select(id, { demo: !!id });
  }
  if (!id || (state.selected === id && (state.apart || !D.lifts[id]))) return select(null);
  if (state.selected === id) {
    state.lift = id;
    select(id);
    return setApart(true);
  }
  select(id, { demo: !state.apart });
}
partButtons.forEach((b) =>
  listen(b, "click", () => {
    takeOver();
    choose(b.dataset.part);
  }),
);

function pieceAt(event) {
  const hit = document.elementFromPoint(event.clientX, event.clientY);
  const item = hit && hit.closest ? hit.closest(".it") : null;
  return item && stage.contains(item) ? item.dataset.piece : null;
}
let grab = null;
listen(stage, "pointerdown", (event) => {
  if (event.button !== 0 || (grab && grab.dragging)) return;
  grab = { x: event.clientX, y: event.clientY, id: event.pointerId, dragging: false, piece: pieceAt(event) };
  try {
    stage.setPointerCapture(event.pointerId);
  } catch {}
});
listen(stage, "pointermove", (event) => {
  if (!grab || grab.id !== event.pointerId) return;
  if (event.pointerType === "mouse" && !(event.buttons & 1)) {
    if (grab.dragging) letGo();
    grab = null;
    return;
  }
  const dx = event.clientX - grab.x;
  if (!grab.dragging && Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(event.clientY - grab.y)) {
    grab.dragging = true;
    grab.lastX = event.clientX;
    takeOver();
    if (state.selected) select(null);
    state.chosen = 0;
    state.target = 0;
    state.step = null;
    state.inched = true;
    state.inchedAt = state.clock;
    if (state.apart) setApart(false);
    state.crank = { goal: state.frames + motor.x * 0.12, carry: motor.x };
    hand.rate = motor.x;
    motor.x = 0;
    motor.v = 0;
    markButtons();
    describe();
    try {
      stage.setPointerCapture(event.pointerId);
    } catch {}
    hint.textContent = "cranking by hand · left runs it backwards";
  }
  if (grab.dragging && state.crank) {
    const scale = 1 / Math.max(28, stage.clientWidth / 26);
    if (home()) state.crank.goal += (event.clientX - grab.lastX) * scale;
    else state.crank.goal = state.frames;
    // No hand turns a projector much past sound speed: the film never trails it by more than
    // 30 frames a second's worth.
    state.crank.goal = clamp(state.crank.goal, state.frames - 30 * 0.12, state.frames + 30 * 0.12);
    grab.lastX = event.clientX;
    run();
  }
});
// Let go, the machine coasts on from the film's own speed like a flywheel. The film follows
// the hand with a 0.12 s lag, so its speed is how far it still trails, over that lag.
function endDrag() {
  state.crank = null;
  grab = null;
  hint.textContent = wording();
}
const letGo = () => {
  if (state.crank) {
    motor.x = (state.crank.goal - state.frames) / 0.12;
    motor.v = 0;
    state.inchedAt = state.clock;
  }
  endDrag();
  describe();
  run();
};
listen(stage, "pointerup", (event) => {
  if (!grab || grab.id !== event.pointerId) return;
  if (grab.dragging) return letGo();
  if (state.crank) letGo();
  if (Math.hypot(event.clientX - grab.x, event.clientY - grab.y) > 10) {
    grab = null;
    return;
  }
  takeOver();
  const id = grab.piece;
  grab = null;
  choose(id);
});
// A mouse over the drawing names the part under it in the legend.
listen(stage, "pointermove", (event) => {
  if (event.pointerType === "mouse" && !grab?.dragging) peek(pieceAt(event));
});
listen(stage, "pointerleave", () => peek(null));
listen(stage, "pointercancel", (event) => {
  if (!grab || grab.id !== event.pointerId) return;
  if (grab.dragging) letGo();
  grab = null;
});
const shownSpeed = () => (state.demo ? DEMOS[state.demo].fps : state.chosen);
listen(stage, "keydown", (event) => {
  const now = shownSpeed();
  if (event.key === "ArrowRight" || event.key === "ArrowUp") {
    event.preventDefault();
    setSpeed(SPEEDS.find((v) => v > now + 0.01) ?? SPEEDS[SPEEDS.length - 1]);
  } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
    event.preventDefault();
    setSpeed([...SPEEDS].reverse().find((v) => v < now - 0.01) ?? 0);
  } else if (event.key === "Home") {
    event.preventDefault();
    setSpeed(0);
  } else if (event.key === "End") {
    event.preventDefault();
    setSpeed(24);
  } else if (event.key === "b" || event.key === "B") {
    event.preventDefault();
    bladeButtons[state.blades % 3].click();
  } else if (event.key === "s" || event.key === "S") {
    event.preventDefault();
    slowButton.click();
  } else if (event.key === "c" || event.key === "C") {
    event.preventDefault();
    closerButton.click();
  } else if (event.key === "t" || event.key === "T") {
    event.preventDefault();
    traceButton.click();
  } else if (event.key === ".") {
    event.preventDefault();
    stepFrame(1);
  } else if (event.key === ",") {
    event.preventDefault();
    stepFrame(-1);
  } else if (event.key === " ") {
    event.preventDefault();
    takeOver();
    select(null);
    setApart(!state.apart);
  } else if (event.key === "Escape") {
    takeOver();
    select(null);
    if (state.apart) setApart(false);
  }
});
listen(stage, "focus", () => {
  describe();
  live.textContent = idleText();
});

const narrow = matchMedia("(hover: none), (max-width: 640px)");
const wording = () => (narrow.matches ? "drag to crank · tap a part" : "drag to crank · click a part");
hint.textContent = wording();
listen(narrow, "change", () => {
  if (!state.crank) hint.textContent = wording();
  say(idleText());
});
// Reduced motion switched on mid-visit: the tour stops, and a speed only the tour had chosen
// stops with it. The tick checks too, in case the media event never arrives.
function stillNow() {
  if (touring) {
    state.chosen = 0;
    select(null);
  }
  touring = false;
  tourSay = "";
  motor.x = state.target;
  drawnKey = "";
}
listen(still, "change", () => {
  if (still.matches) {
    wasCalm = true;
    stillNow();
  }
  run();
});

// A remount after a theme change carries on from what the reader had chosen.
stage.removeAttribute("data-focus");
stage.removeAttribute("data-trace");
stage.removeAttribute("data-peek");
partButtons.forEach((b) => b.removeAttribute("data-peek"));
// A remount starts on the whole machine.
stage.removeAttribute("data-closer");
for (const name of ["--pj-zx", "--pj-zy", "--pj-zs", "--pj-cut"]) stage.style.removeProperty(name);
if (D.resume) {
  const r = D.resume;
  state.frames = r.frames;
  state.chosen = r.chosen;
  state.target = r.chosen;
  state.blades = r.blades;
  motor.x = still.matches ? r.chosen : r.motor;
  motor.v = still.matches ? 0 : r.motorV;
  state.fps = r.fps;
  lampState.x = r.lamp;
  fireState.x = r.beam;
  state.lamp = r.lamp;
  state.beam = Math.min(r.beam, r.lamp);
  leaderShift = r.leaderShift;
  state.inched = r.inched;
  state.inchedAt = -r.inchedAge;
  if (r.step) {
    state.step = { cycle: r.step.cycle, goal: null, dir: r.step.dir, queue: r.step.queue };
    if (r.step.cycle !== null) {
      motor.x = 0;
      motor.v = 0;
    }
    hand.rate = r.fps;
  }
  touring = r.touring && !still.matches;
  tourClock = r.tourClock;
  tourStep = r.tourStep;
  tourSay = (touring && TOUR[tourStep]?.say) || "";
  state.apart = r.apart;
  state.armed = r.armed;
  state.lift = r.lift;
  state.slow = !!r.slow;
  if (r.trace) {
    setTrace(true, { tour: true });
    state.trace = { t0: -r.trace.age, tour: r.trace.tour && touring };
  }
  for (const id of IDS) {
    const q = r.pieces[id];
    Object.assign(piece[id], { x: q.x, v: q.v, target: q.target, pending: q.pending && { value: q.pending.value, at: q.pending.in } });
  }
  if (r.apart && !r.armed) motor.x = 0;
  settled = !springsMoving() && !r.armed;
  if (r.selected) select(r.selected, { demo: r.demo });
  if (r.demoAge !== null && state.demo) state.demoAt = -r.demoAge;
  // The reader turned sound on with a click earlier, so the page may start audio again.
  if (r.sound) {
    audio = startAudio();
    if (audio) soundButton.setAttribute("aria-pressed", "true");
  }
}
// Under reduced motion the machine waits, stopped, for the reader to choose a speed.
if (still.matches && !D.resume) {
  state.chosen = 0;
  state.target = 0;
}
if (still.matches) {
  touring = false;
  motor.x = state.target;
}
if (!audio) soundButton.setAttribute("aria-pressed", "false");
markButtons();
describe();
draw(state.frames, state.frames, true);
place();
say(idleText());

const teardown = () => {
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
  observer.disconnect();
  cleanups.forEach((fn) => fn());
  if (audio) audio.close();
  soundButton.setAttribute("aria-pressed", "false");
};
teardown.snapshot = () => ({ frames: state.frames, chosen: state.chosen, blades: state.blades, fps: state.fps, motor: state.crank ? (state.crank.goal - state.frames) / 0.12 : motor.x, motorV: state.crank ? 0 : motor.v, touring, tourClock, tourStep, apart: state.apart, selected: state.selected, demo: !!state.demo, lamp: lampState.x, beam: fireState.x, sound: !!audio, leaderShift, inched: state.inched, inchedAge: state.crank ? 0 : state.clock - state.inchedAt, step: state.step && { cycle: state.step.cycle, dir: state.step.dir, queue: [...state.step.queue] }, armed: state.armed, lift: state.lift, slow: state.slow, trace: state.trace && { tour: state.trace.tour, age: state.clock - state.trace.t0 }, demoAge: state.demoAt === null ? null : state.clock - state.demoAt, pieces: Object.fromEntries(IDS.map((id) => [id, { x: piece[id].x, v: piece[id].v, target: piece[id].target, pending: piece[id].pending && { value: piece[id].pending.value, in: piece[id].pending.at - state.clock } }])) });
return teardown;
