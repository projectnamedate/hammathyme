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
const speedButtons = [...root.querySelectorAll("[data-speed]")];
const bladeButtons = [...root.querySelectorAll("[data-blades]")];
const stepButton = root.querySelector("[data-step]");
const apartButton = root.querySelector("[data-apart]");
const soundButton = root.querySelector("[data-sound]");
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
const springsMoving = () => IDS.some((id) => Math.abs(piece[id].x - piece[id].target) > 0.002 || piece[id].pending);
// The machine may only turn when every part is home: nothing runs while it is apart or on
// its way back together.
const home = () => !state.apart && !IDS.some((id) => piece[id].x !== 0 || piece[id].target !== 0 || piece[id].pending);

function say(text) {
  if (text !== lastText) {
    lastText = text;
    readout.textContent = text;
  }
}
function announce(text) {
  if (!touring) live.textContent = text;
}
function describe() {
  const fps = Math.round(state.target);
  const speed = fps ? `${fps} frame${fps === 1 ? "" : "s"} a second` : "stopped";
  const text = state.selected ? D.pieces[state.selected].say : state.apart ? `apart · ${MOVERS.length} assemblies` : `${speed}, ${state.blades} shutter blade${state.blades === 1 ? "" : "s"}`;
  stage.setAttribute("aria-description", text);
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
  partButtons.forEach((b) => press(b, b.dataset.part === state.selected));
}

// ---- explode ----
function scheduleApart(on) {
  const goal = on ? 1 : 0;
  let index = 0;
  for (const id of on ? D.stagger : [...D.stagger].reverse()) {
    if (piece[id].target === goal) piece[id].pending = null;
    else piece[id].pending = { value: goal, at: state.clock + (still.matches ? 0 : index++ * SPRING.stagger) };
  }
}
function setApart(on) {
  if (state.apart === on && !state.armed) return;
  state.apart = on;
  state.step = null;
  if (state.crank) letGo();
  if (on) {
    state.inched = false;
    if (Math.abs(state.fps) > 0.05) {
      state.armed = true;
      announce("stopping the motor, then taking it apart");
    } else {
      scheduleApart(true);
      announce("taking apart");
    }
  } else {
    state.armed = false;
    scheduleApart(false);
    announce("putting together");
  }
  settled = false;
  markButtons();
  describe();
  run();
}
function steerSpring(s, dt, calm) {
  if (s.pending && state.clock >= s.pending.at) {
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
  if (Math.abs(s.target - s.x) < 2e-4 && Math.abs(s.v) < 2e-4) {
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
  pose();
  markButtons();
  describe();
  if (id) announce(D.pieces[id].say);
  run();
}

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
  handle: part("handle"),
  loopU: part("loop-U"),
  loopL: part("loop-L"),
  gate: part("gate-frame"),
  picture: part("picture"),
  ammeter: part("ammeter"),
  teeth: Object.fromEntries(Object.keys(D.sprockets).map((id) => [id, part(`teeth-${id}`)?.querySelector('[data-turn="front"]')])),
};
const plates = { crank2: plateEl("handcrank"), cross: plateEl("cross"), crank: plateEl("crank"), lock: plateEl("lock"), feed: plateEl("flange-feed"), take: plateEl("flange-take"), feedFar: plateEl("flange-feed-far"), takeFar: plateEl("flange-take-far") };
let shutterBlades = 2;
let shutterDefs = parts.shutterDefs(shutterBlades);
let shutterPlates = shutterDefs.map((def) => plateEl(def.id));
function turn(el, def, deg) {
  if (!el) return;
  const t = parts.plateTurn(def, deg);
  el.back.setAttribute("transform", t.back);
  el.walls.forEach((wall, k) => wall.setAttribute("transform", t.walls[k]));
  el.front.setAttribute("transform", t.front);
  el.conn.setAttribute("d", t.conn);
}
const S = D.sprockets;
const lit = { screen: stage.querySelector(".pj-screen"), beam: part("light-beam"), lamp: [part("port"), part("condenser")], gate: part("gate-frame") };
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
    const crankDeg = -360 * c * D.crankRatio;
    turn(plates.crank2, DEFS.crank2, crankDeg);
    groups.handle?.setAttribute("transform", parts.handleShift(crankDeg));
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
    // Four teeth to a frame, exactly, so the teeth keep step with the perforations.
    groups.teeth.feed?.setAttribute("transform", `rotate(${(-c * (360 * 4) / S.feed.teeth).toFixed(2)})`);
    groups.teeth.inter?.setAttribute("transform", `rotate(${(i * (360 * 4) / S.inter.teeth).toFixed(2)})`);
    groups.teeth.hold?.setAttribute("transform", `rotate(${(-c * (360 * 4) / S.hold.teeth).toFixed(2)})`);
    for (const id of ["feed", "take"]) {
      const a = ((c * FL) / D.reels[id].pack) * deg;
      turn(plates[id], DEFS[id], a);
      turn(plates[`${id}Far`], DEFS[`${id}Far`], a);
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
      group.innerHTML = `${parts.ribbonSvg(pts, { tone: "hi", loop: true })}<path class="pj-perfs" d="${marks.holes}"/><path class="iso-line pj-framelines" data-tone="lo" d="${marks.lines}"/>`;
    }
    groups.gate.innerHTML = parts.gateFrameSvg(i, M.leaderAt);
  }
  // The picture shows the frame that is sitting in the gate; light reaches it only while
  // the shutter is open and the dowser is up.
  const n = Math.floor(i + 1e-9);
  if (n !== shownFrame) {
    shownFrame = n;
    groups.picture.innerHTML = parts.leaderSvg(M.leaderAt(n), D.pic.w, D.pic.h);
    if (audio) {
      audio.tick(clamp(state.fps / 24, 0.25, 1));
      if (M.leaderAt(n).pop && n !== lastPop && state.lamp > 0.5) {
        lastPop = n;
        audio.pop();
      }
    }
  }
  // Black leader passes no light.
  const clear = M.leaderAt(n).number === 0 ? 0.04 : 1;
  const mean = M.lightShare(state.blades);
  const raw = f1 !== f0 ? M.screenLight(Math.min(f0, f1), Math.max(f0, f1), state.blades) : M.shutterOpen(((f1 % 1) + 1) % 1, state.blades);
  const hz = M.flickerHz(Math.abs(state.fps), state.blades);
  const fuse = calm && !state.crank && !state.step && state.target > 0 ? 1 : ease(30, 52, hz);
  // While the tour plays by itself, flicker faster than three flashes a second is shown at a
  // third of its depth, so an unasked-for screen never flashes hard; slower blinks, and
  // everything the reader chooses, show in full.
  const depth = touring && hz > 3 ? 0.35 : 1;
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
  groups.ammeter?.setAttribute("transform", `rotate(${(-40 + 80 * state.lamp).toFixed(1)} 0 4)`);
  if (beam) beam.paint();
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
  { at: 6, speed: 3, part: "film" },
  { at: 11, speed: 24, part: null, blades: 2 },
  { at: 15, speed: 24, part: null, blades: 1 },
  { at: 18.5, speed: 16, part: null, blades: 3, say: "3 blades · 48 Hz at 16 fps, but 5% light" },
  { at: 22.5, speed: 24, part: null, blades: 2 },
  { at: 24.5, apart: true },
  { at: 31.5, apart: false },
  { at: 36.5, end: true },
];
let tourStep = -1;
let tourSay = "";
let hovering = false;
let focused = false;
function stepTour(dt) {
  if (hovering || focused) return;
  tourClock += dt;
  let index = 0;
  for (let i = 0; i < TOUR.length; i++) if (tourClock >= TOUR[i].at) index = i;
  if (TOUR[index].end) {
    tourClock = 0;
    index = 0;
    const n = Math.floor(state.frames);
    state.frames += (Math.ceil(n / M.LEADER.frames) * M.LEADER.frames || M.LEADER.frames) - n;
  }
  if (index === tourStep) return;
  tourStep = index;
  const s = TOUR[index];
  tourSay = s.say ?? "";
  if (s.blades) state.blades = s.blades;
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
function idleText() {
  if (state.armed) return "stopping · then taking apart";
  if (springsMoving()) return state.apart ? "taking apart" : "putting together";
  if (state.apart && !state.selected) return `apart · ${MOVERS.length} assemblies · ${narrow.matches ? "tap" : "click"} one`;
  if (state.selected && state.demo && state.demoAt !== null && state.clock - state.demoAt < 3.2) return DEMOS[state.selected].text;
  if (state.selected && !state.demo) return D.pieces[state.selected].say;
  if (tourSay && Math.abs(state.fps - state.target) < 0.5) return tourSay;
  if (still.matches && !state.crank && !state.step && state.target > 0) return `held still · ${M.readoutOf(state.target, state.blades, M.openPhase(state.blades))}`;
  if (state.inched && !state.crank && !state.step && Math.abs(state.fps) < 0.05 && state.clock - state.inchedAt > FIRE) return "stopped · fire shutter down";
  const text = M.readoutOf(state.fps, state.blades, state.frames);
  // Black leader passes no light, whatever the shutter is doing.
  const black = M.leaderAt(Math.floor(M.intermittentOf(state.frames) + 1e-9)).number === 0;
  return black ? text.replace("light on screen", "black leader, no picture") : text;
}
const motor = { x: 0, v: 0 };
const lampState = { x: 0, v: 0 };
const fireState = { x: 0, v: 0 };
const hand = { rate: 0 };
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  state.clock += dt;
  const calm = still.matches;
  if (touring) stepTour(dt);
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
    state.step.goal = state.step.cycle + M.openPhase(state.blades);
    if (calm) {
      state.frames = state.step.goal;
      jumped = true;
    }
    const dir = Math.sign(state.step.goal - state.frames);
    const next = state.frames + dir * dt * 0.75;
    state.frames = dir > 0 ? Math.min(next, state.step.goal) : Math.max(next, state.step.goal);
    if (state.frames === state.step.goal) {
      state.step = state.step.queue.length ? { cycle: null, goal: null, dir: state.step.queue[0], queue: state.step.queue.slice(1) } : null;
      state.inchedAt = state.clock;
    }
    moving = true;
  } else {
    const target = ready && !state.crank && !state.step ? state.target : 0;
    // A waiting step brakes hard; otherwise the machine runs up and down at its own pace.
    const pace = state.step ? 0.12 : Math.abs(target) > Math.abs(motor.x) ? 0.7 : 0.45;
    moving = settle(motor, target, dt, pace, calm) || moving;
    // The run-down's last crawl is below what the eye or the readout can tell from stopped.
    if (target === 0 && Math.abs(motor.x) < 0.05) {
      motor.x = 0;
      motor.v = 0;
    }
    // Under reduced motion the parts stay where they are; the readout and the screen show the
    // chosen speed as a steady picture.
    if (!calm) state.frames += motor.x * dt;
  }
  if (jumped) f0 = state.frames;
  const rate = (state.frames - f0) / dt;
  if (state.crank || state.step) {
    hand.rate += (rate - hand.rate) * (1 - Math.exp(-dt / 0.15));
    state.fps = hand.rate;
  } else {
    hand.rate = 0;
    state.fps = motor.x;
  }
  if (state.armed && Math.abs(state.fps) < 0.05) {
    state.armed = false;
    scheduleApart(true);
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
    announce(state.apart ? `taken apart: ${MOVERS.length} assemblies` : "put together");
  }
  if (!calm && Math.abs(state.fps) > 1e-4) moving = true;
  if (Math.abs(hand.rate) > 1e-3) moving = true;
  if (state.demo && state.demoAt === null && Math.abs(state.fps - state.target) < 0.3) state.demoAt = state.clock;
  if (state.demo && (state.demoAt === null || state.clock - state.demoAt < 3.4)) moving = true;
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
  pose();
  announce(fps ? `${fps} frame${fps === 1 ? "" : "s"} a second` : "stopped");
  run();
}
speedButtons.forEach((b) => listen(b, "click", () => setSpeed(Number(b.dataset.speed))));
bladeButtons.forEach((b) =>
  listen(b, "click", () => {
    takeOver();
    state.blades = Number(b.dataset.blades);
    pose();
    drawnKey = "";
    markButtons();
    describe();
    announce(`${state.blades} blade${state.blades === 1 ? "" : "s"}, ${Math.round(M.lightShare(state.blades) * 100)} percent of the light`);
    run();
  }),
);
// One step brings the next (or the last) frame into the gate and ends at the instant the
// shutter is most open, so it shows lit on the screen. Presses queue.
function stepCycle(from, dir) {
  const n = Math.floor(M.intermittentOf(from) + 1e-6);
  return dir > 0 ? n : n - 2;
}
// Under reduced motion a held speed is shown as one still frame with the shutter open.
function pose() {
  if (still.matches && !state.crank && !state.step && state.target > 0) state.frames = Math.floor(state.frames) + M.openPhase(state.blades);
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
    hand.rate = motor.x;
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
partButtons.forEach((b) =>
  listen(b, "click", () => {
    takeOver();
    const id = b.dataset.part;
    if (state.selected === id) select(null);
    else select(id, { demo: !state.apart });
  }),
);

function pieceAt(event) {
  const hit = document.elementFromPoint(event.clientX, event.clientY);
  const item = hit && hit.closest ? hit.closest(".it") : null;
  return item && stage.contains(item) ? item.dataset.piece : null;
}
let grab = null;
listen(stage, "pointerdown", (event) => {
  if (event.button !== 0) return;
  grab = { x: event.clientX, y: event.clientY, id: event.pointerId, dragging: false, piece: pieceAt(event) };
});
listen(stage, "pointermove", (event) => {
  if (!grab || grab.id !== event.pointerId) return;
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
  run();
};
listen(stage, "pointerup", (event) => {
  if (!grab || grab.id !== event.pointerId) return;
  if (grab.dragging) return letGo();
  takeOver();
  const id = grab.piece;
  grab = null;
  if (!id || id === "stand" || id === "head") select(null);
  else if (state.selected === id) select(null);
  else select(id, { demo: !state.apart });
});
listen(stage, "pointercancel", () => {
  if (grab && grab.dragging) letGo();
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

// A remount after a theme change carries on from what the reader had chosen.
stage.removeAttribute("data-focus");
if (D.resume) {
  const r = D.resume;
  state.frames = r.frames;
  state.chosen = r.chosen;
  state.target = r.chosen;
  state.blades = r.blades;
  motor.x = still.matches ? r.chosen : r.fps;
  lampState.x = r.lamp;
  fireState.x = r.beam;
  touring = r.touring && !still.matches;
  tourClock = r.tourClock;
  if (r.apart) {
    state.apart = true;
    for (const id of IDS) piece[id].x = piece[id].target = 1;
    motor.x = 0;
  }
  if (r.selected) select(r.selected, { demo: r.demo });
  // The reader turned sound on with a click earlier, so the page may start audio again.
  if (r.sound) {
    audio = startAudio();
    if (audio) soundButton.setAttribute("aria-pressed", "true");
  }
}
if (still.matches) {
  touring = false;
  motor.x = state.target;
  pose();
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
teardown.snapshot = () => ({ frames: state.frames, chosen: state.chosen, blades: state.blades, fps: Math.max(0, state.fps), touring, tourClock, apart: state.apart, selected: state.selected, demo: !!state.demo, lamp: lampState.x, beam: fireState.x, sound: !!audio });
return teardown;
