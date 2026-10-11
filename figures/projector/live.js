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
  lamp: 0,
  light: 0,
  clock: 0,
};
let touring = !still.matches;
let tourClock = 0;
let idleTimer = 0;
let visible = false;
let frame = 0;
let last = 0;
let shownFrame = -1;
let lastText = "";
let lastPop = -1;

const MOVERS = IDS.filter((id) => D.pieces[id] && nodes.some((node) => node.piece === id && (node.m[0] || node.m[1] || node.m[2])));

function say(text) {
  if (text !== lastText) {
    lastText = text;
    readout.textContent = text;
  }
}
function announce(text) {
  live.textContent = text;
}
function describe() {
  const text = state.selected ? D.pieces[state.selected].say : state.apart ? `apart · ${MOVERS.length} assemblies` : `${Math.round(state.target)} frames a second, ${state.blades} shutter blades`;
  stage.setAttribute("aria-description", text);
}

function markButtons() {
  speedButtons.forEach((b) => (Number(b.dataset.speed) === state.chosen && !state.demo ? b.setAttribute("data-on", "") : b.removeAttribute("data-on")));
  bladeButtons.forEach((b) => (Number(b.dataset.blades) === state.blades ? b.setAttribute("data-on", "") : b.removeAttribute("data-on")));
  apartButton.textContent = state.apart ? "put together" : "take apart";
  partButtons.forEach((b) => (b.dataset.part === state.selected ? b.setAttribute("data-on", "") : b.removeAttribute("data-on")));
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
  if (on) {
    if (state.fps > 0.05) {
      state.armed = true;
      state.target = 0;
      announce("stopping the motor");
    } else scheduleApart(true);
    announce("taking apart");
  } else {
    state.armed = false;
    scheduleApart(false);
    announce("putting together");
  }
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
  state.target = state.apart ? 0 : state.demo ? DEMOS[id].fps : state.chosen;
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
  return el && { back: el.querySelector('[data-turn="back"]'), front: el.querySelector('[data-turn="front"]'), conn: el.querySelector('[data-turn="conn"]') };
};
const DEFS = { cross: parts.crossDef(), crank: parts.crankDef(), lock: parts.lockDef(), feed: parts.flangeDef("feed", D.reels.feed), take: parts.flangeDef("take", D.reels.take) };
const groups = {
  shutter: part("shutter"),
  pin: part("pin"),
  loopU: part("loop-U"),
  loopL: part("loop-L"),
  gate: part("gate-frame"),
  picture: part("picture"),
  ammeter: part("ammeter"),
  teeth: Object.fromEntries(Object.keys(D.sprockets).map((id) => [id, part(`teeth-${id}`)?.querySelector('[data-turn="front"]')])),
};
const plates = { cross: plateEl("cross"), crank: plateEl("crank"), lock: plateEl("lock"), feed: plateEl("flange-feed"), take: plateEl("flange-take") };
let shutterBlades = 2;
let shutterDefs = parts.shutterDefs(shutterBlades);
let shutterPlates = shutterDefs.map((def) => plateEl(def.id));
function turn(el, def, deg) {
  if (!el) return;
  const t = parts.plateTurn(def, deg);
  el.back.setAttribute("transform", t.back);
  el.front.setAttribute("transform", t.front);
  el.conn.setAttribute("d", t.conn);
}
const S = D.sprockets;
const lit = { screen: stage.querySelector(".pj-screen"), lamp: [part("gate-frame"), part("port"), part("condenser")] };
let shownLight = "";
let shownLamp = "";
let drawnKey = "";
function draw(f0, f1, calm) {
  const c = f1;
  const i = M.intermittentOf(f1);
  const key = `${c.toFixed(5)}|${state.blades}`;
  if (key !== drawnKey) {
    drawnKey = key;
    const deg = 180 / Math.PI;
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
    groups.teeth.feed?.setAttribute("transform", `rotate(${(-((c * FL) / S.feed.r) * deg).toFixed(2)})`);
    groups.teeth.inter?.setAttribute("transform", `rotate(${(((i * FL) / S.inter.r) * deg).toFixed(2)})`);
    groups.teeth.hold?.setAttribute("transform", `rotate(${(-((c * FL) / S.hold.r) * deg).toFixed(2)})`);
    turn(plates.feed, DEFS.feed, ((c * FL) / D.reels.feed.pack) * deg);
    turn(plates.take, DEFS.take, ((c * FL) / D.reels.take.pack) * deg);
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
    if (audio && state.lamp > 0.5) {
      audio.tick(clamp(state.fps / 24, 0.25, 1));
      if (M.leaderAt(n).pop && n !== lastPop) {
        lastPop = n;
        audio.pop();
      }
    }
  }
  const mean = M.lightShare(state.blades);
  const raw = f1 > f0 ? M.screenLight(f0, f1, state.blades) : M.shutterOpen(((f1 % 1) + 1) % 1, state.blades);
  const hz = M.flickerHz(state.fps, state.blades);
  const fuse = calm ? 1 : ease(30, 52, hz);
  const seen = mean + (raw - mean) * (1 - fuse);
  state.light = state.lamp * Math.pow(clamp(seen / M.lightShare(1), 0, 1), 0.6);
  // Only the few elements that glow carry these, so a change restyles them alone.
  const light = state.light.toFixed(3);
  const lamp = state.lamp.toFixed(3);
  if (light !== shownLight) {
    shownLight = light;
    lit.screen?.style.setProperty("--pj-light", light);
  }
  if (lamp !== shownLamp) {
    shownLamp = lamp;
    for (const el of lit.lamp) el?.style.setProperty("--pj-lamp", lamp);
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
      const gate = state.lamp;
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

// ---- the idle tour ----
const TOUR = [
  { at: 0, speed: 1, part: "movement" },
  { at: 5.5, speed: 3, part: "film" },
  { at: 10, speed: 24, part: null },
  { at: 14, speed: 24, part: null, blades: 1 },
  { at: 17.5, speed: 24, part: null, blades: 3 },
  { at: 21, speed: 24, part: null, blades: 2 },
  { at: 24, apart: true },
  { at: 31, apart: false },
  { at: 36, end: true },
];
let tourStep = -1;
function tourAt(time) {
  let index = 0;
  for (let i = 0; i < TOUR.length; i++) if (time >= TOUR[i].at) index = i;
  return index;
}
function stepTour(dt) {
  tourClock += dt;
  let index = tourAt(tourClock);
  if (TOUR[index].end) {
    tourClock = 0;
    index = 0;
    tourStep = -1;
  }
  if (index === tourStep) return;
  tourStep = index;
  const s = TOUR[index];
  if (s.blades) state.blades = s.blades;
  if (s.apart !== undefined) {
    select(null);
    setApart(s.apart);
    return;
  }
  if (s.speed !== undefined) {
    state.chosen = s.speed;
    if (s.part) select(s.part, { demo: true });
    else select(null);
  }
  markButtons();
}
function quietTour() {
  touring = false;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    if (state.crank || state.step) return quietTour();
    touring = !still.matches;
    tourClock = 0;
    tourStep = -1;
    if (touring) {
      if (state.apart) setApart(false);
      run();
    }
  }, 9000);
}

// ---- the frame loop ----
function idleText() {
  const moving = IDS.some((id) => Math.abs(piece[id].x - piece[id].target) > 0.002 || piece[id].pending);
  if (state.armed) return "stopping · then taking apart";
  if (moving) return state.apart ? "taking apart" : "putting together";
  if (state.apart && !state.selected) return `apart · ${MOVERS.length} assemblies · click one`;
  if (state.selected && (state.apart || state.demo)) return state.demo ? DEMOS[state.selected].text : D.pieces[state.selected].say;
  if (state.selected) return D.pieces[state.selected].say;
  return M.readoutOf(state.fps, state.blades);
}
const motor = { x: 0, v: 0 };
const lampState = { x: 0, v: 0 };
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  state.clock += dt;
  const calm = still.matches;
  if (touring) stepTour(dt);
  const f0 = state.frames;
  let moving = false;
  if (state.crank) {
    const share = clamp(state.crank.pending, -0.5, 0.5);
    state.crank.pending -= share;
    state.frames += Math.max(0, share);
    state.fps = Math.max(0, share / dt);
    motor.x = 0;
    motor.v = 0;
    moving = true;
  } else if (state.step) {
    state.step.t += dt;
    const t = clamp(state.step.t / state.step.length, 0, 1);
    state.frames = state.step.from + t;
    state.fps = 1 / state.step.length;
    if (t >= 1) {
      state.step = null;
      state.fps = 0;
    }
    moving = true;
  } else {
    moving = settle(motor, state.target, dt, state.target > motor.x ? 0.7 : 0.45, calm) || moving;
    state.fps = Math.max(0, motor.x);
    state.frames += state.fps * dt;
  }
  if (state.armed && state.fps < 0.05) {
    state.armed = false;
    scheduleApart(true);
  }
  const lampOn = !state.apart && (state.fps > 0.3 || state.crank || state.step) ? 1 : 0;
  moving = settle(lampState, lampOn, dt, 0.18, calm) || moving;
  state.lamp = clamp(lampState.x, 0, 1);
  for (const id of IDS) if (steerSpring(piece[id], dt, calm)) moving = true;
  if (state.fps > 1e-4) moving = true;
  draw(f0, state.frames, calm);
  place();
  if (audio) audio.hum(state.fps);
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
  },
  { rootMargin: "120px 0px" },
);
observer.observe(stage);

// ---- input ----
function takeOver() {
  quietTour();
}
function setSpeed(fps) {
  takeOver();
  state.step = null;
  if (state.apart) setApart(false);
  state.chosen = fps;
  select(null);
  announce(fps ? `${fps} frames a second` : "stopped");
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
function stepFrame() {
  takeOver();
  if (state.apart) return;
  select(null);
  state.chosen = 0;
  state.target = 0;
  motor.x = 0;
  motor.v = 0;
  const from = state.step ? state.step.from + 1 : Math.floor(state.frames + 1e-6);
  state.frames = Math.max(state.frames, from);
  state.step = { from: state.frames, t: 0, length: 1.4 };
  markButtons();
  run();
}
listen(stepButton, "click", stepFrame);
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
    else select(id, { demo: true });
  }),
);

function pieceAt(event) {
  const hit = document.elementFromPoint(event.clientX, event.clientY);
  const item = hit && hit.closest ? hit.closest(".it") : null;
  return item && stage.contains(item) ? item.dataset.piece : null;
}
let press = null;
listen(stage, "pointerdown", (event) => {
  if (event.button !== 0) return;
  press = { x: event.clientX, y: event.clientY, id: event.pointerId, dragging: false, piece: pieceAt(event) };
});
listen(stage, "pointermove", (event) => {
  if (!press || press.id !== event.pointerId) return;
  const dx = event.clientX - press.x;
  if (!press.dragging && Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(event.clientY - press.y)) {
    press.dragging = true;
    press.lastX = event.clientX;
    takeOver();
    if (state.apart) setApart(false);
    select(null);
    state.crank = { pending: 0 };
    try {
      stage.setPointerCapture(event.pointerId);
    } catch {}
    hint.textContent = "cranking by hand";
  }
  if (press.dragging) {
    const scale = 1 / Math.max(28, stage.clientWidth / 26);
    state.crank.pending += Math.max(0, event.clientX - press.lastX) * scale;
    press.lastX = event.clientX;
    run();
  }
});
const release = (event) => {
  if (!press || press.id !== event.pointerId) return;
  if (press.dragging) {
    state.crank = null;
    motor.x = 0;
    motor.v = 0;
    hint.textContent = wording();
    run();
  } else {
    takeOver();
    const id = press.piece;
    if (!id || id === "stand" || id === "head") select(null);
    else if (state.selected === id) select(null);
    else select(id, { demo: !state.apart });
  }
  press = null;
};
listen(stage, "pointerup", release);
listen(stage, "pointercancel", () => {
  if (press && press.dragging) state.crank = null;
  press = null;
  run();
});
listen(stage, "keydown", (event) => {
  const index = SPEEDS.indexOf(state.chosen);
  if (event.key === "ArrowRight" || event.key === "ArrowUp") {
    event.preventDefault();
    setSpeed(SPEEDS[Math.min(SPEEDS.length - 1, (index < 0 ? 0 : index) + 1)]);
  } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
    event.preventDefault();
    setSpeed(SPEEDS[Math.max(0, (index < 0 ? 0 : index) - 1)]);
  } else if (event.key === "b" || event.key === "B") {
    event.preventDefault();
    bladeButtons[(state.blades % 3)].click();
  } else if (event.key === "." || event.key === ",") {
    event.preventDefault();
    stepFrame();
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
listen(stage, "focus", () => describe());

const narrow = matchMedia("(hover: none), (max-width: 640px)");
const wording = () => (narrow.matches ? "Drag to crank · tap a part" : "Drag sideways to crank · click a part");
hint.textContent = wording();

if (still.matches) {
  touring = false;
  state.chosen = 24;
  state.target = 24;
  motor.x = 24;
}
markButtons();
describe();
draw(state.frames, state.frames, true);
place();
say(idleText());

return () => {
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
  clearTimeout(idleTimer);
  observer.disconnect();
  cleanups.forEach((fn) => fn());
  if (audio) audio.close();
};
