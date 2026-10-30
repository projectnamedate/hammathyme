// The bay's sound, made in the page with Web Audio: nothing is downloaded. Unity reports where you are each frame and
// every footstep, stir and shooting star (Assets/Plugins/WebGL/BaySound.jslib); the surf breaks when the swell's crest
// reaches the shore, from the same wave the water shader draws. Browsers keep audio locked until the first tap, click or
// key, so it starts then; it pauses while the tab is hidden, and the sound button or M mutes it.
(() => {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  let ctx = null, bus, muffle, out, white, pink, brown, muted = false, lastTick = 0, startedAt = 0;
  const st = { t: 0, x: 0, z: -6, yaw: 0, under: 0, rain: 0, wade: 0, stir: 0, stirWater: 1, live: false };
  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const shoreZ = (x) => 4 * Math.sin(x * 0.05) + 1.5 * Math.sin(x * 0.13 + 1);
  const K = (2 * Math.PI) / 14, C = Math.sqrt(9.8 / K), DX = 0.1 / Math.hypot(0.1, 1), DZ = -1 / Math.hypot(0.1, 1);
  const swell = (x, z, t) => K * (DX * x + DZ * z - C * t);          // the main swell's phase, as in BayWater.shader
  const hash = (n) => { const s = Math.sin(n * 12.9898) * 43758.5453; return s - Math.floor(s); };
  const PENTA = [2637, 2960, 3322, 3951, 4434, 5274, 5920, 6645];     // the glow's shimmer: E major pentatonic, high
  const LEVEL = 1.0;                                                    // output gain: about −19 LUFS over a visit, peaks under −1 dBTP

  function noiseBuffer(seconds, color) {
    const n = Math.floor(ctx.sampleRate * seconds), b = ctx.createBuffer(2, n, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = b.getChannelData(c);
      let last = 0, b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < n; i++) {
        const w = Math.random() * 2 - 1;
        if (color === "brown") { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
        else if (color === "pink") { b0 = 0.99765 * b0 + w * 0.099046; b1 = 0.963 * b1 + w * 0.2965164; b2 = 0.57 * b2 + w * 1.0526913; d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.2; }
        else d[i] = w * 0.5;
      }
    }
    return b;
  }
  const gainNode = (v = 0) => { const g = ctx.createGain(); g.gain.value = v; return g; };
  const filter = (type, f, q = 0.7) => { const b = ctx.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = q; return b; };
  const panner = (p = 0) => { if (!ctx.createStereoPanner) return null; const s = ctx.createStereoPanner(); s.pan.value = clamp(p, -1, 1); return s; };
  const chain = (...nodes) => { nodes = nodes.filter(Boolean); for (let i = 0; i < nodes.length - 1; i++) nodes[i].connect(nodes[i + 1]); return nodes[0]; };
  const loop = (buf) => { const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true; s.start(0, Math.random() * buf.duration); return s; };
  const ease = (param, v, tc = 0.08) => param.setTargetAtTime(v, ctx.currentTime, tc);

  // a one-shot of noise from somewhere in a buffer, through a filter (optionally swept) and a rise-and-fall envelope;
  // decay is the time to fall to about 5%
  function burst(o) {
    const at = ctx.currentTime + (o.at || 0), attack = o.attack || 0.005, decay = o.decay || 0.2;
    const s = ctx.createBufferSource(); s.buffer = o.buf || white;
    const f = filter(o.type || "bandpass", o.f || 1000, o.q || 0.7), g = gainNode(0);
    if (o.f2) { f.frequency.setValueAtTime(o.f, at); f.frequency.exponentialRampToValueAtTime(o.f2, at + (o.sweep || decay)); }
    g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(o.peak, at + attack); g.gain.setTargetAtTime(0, at + attack, decay / 3);
    chain(s, f, g, panner(o.pan || 0), o.dest || bus);
    const len = attack + decay * 2;
    s.start(at, Math.random() * Math.max(0, s.buffer.duration - len - 0.05)); s.stop(at + len);
  }
  // a short tone gliding from f by a factor `up` (a drop's plink rises; a bubble's too)
  function ping(o) {
    const at = ctx.currentTime + (o.at || 0), decay = o.decay || 0.06;
    const s = ctx.createOscillator(), g = gainNode(0);
    s.type = o.wave || "sine";
    s.frequency.setValueAtTime(o.f, at); s.frequency.exponentialRampToValueAtTime(o.f * (o.up || 1), at + (o.glide || decay * 0.5));
    g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(o.peak, at + (o.attack || 0.002)); g.gain.setTargetAtTime(0, at + (o.attack || 0.002), decay / 3);
    chain(s, g, panner(o.pan || 0), o.dest || bus);
    s.start(at); s.stop(at + (o.attack || 0.002) + decay * 2);
  }
  // the plankton's light as sound: a spray of tiny high tones
  function shimmer(amount, p = 0, spread = 0.6) {
    const n = Math.round(4 + 10 * amount);
    for (let i = 0; i < n; i++) ping({ f: PENTA[Math.floor(Math.random() * PENTA.length)] * rnd(0.995, 1.005), up: rnd(1, 1.02), peak: rnd(0.004, 0.014) * (0.5 + amount),
      at: rnd(0, spread), attack: 0.003, decay: rnd(0.08, 0.3), pan: p + rnd(-0.5, 0.5) });
  }
  const bubble = (at, peak = 0.03) => ping({ f: rnd(260, 700), up: rnd(1.8, 2.6), glide: 0.04, peak, at, decay: rnd(0.04, 0.09), pan: rnd(-0.6, 0.6) });

  // pan for a point in the world: Unity's yaw turns from +z toward +x, and +x is your right when you face +z
  function panTo(x, z) {
    const dx = x - st.x, dz = z - st.z, d = Math.hypot(dx, dz), y = (st.yaw * Math.PI) / 180;
    return d < 0.5 ? 0 : clamp((dx * Math.cos(y) - dz * Math.sin(y)) / d, -0.85, 0.85);
  }

  // --- the ambience ---------------------------------------------------------------------------------------------
  let bedGain, bedLow, wind, windFilter, rainHiss, rainBody, underBed, wadeGain, wadeFilter, stirGain, stirFilter, cricketBus;
  const crickets = [{ x: -9, z: -24, f: 4700, every: 0.62 }, { x: 8, z: -27, f: 5150, every: 0.81 }, { x: 24, z: -21, f: 4420, every: 0.7 }];
  const surf = [{ dx: -11, w: 0.6 }, { dx: 0, w: 1 }, { dx: 11, w: 0.6 }];

  function start() {
    ctx = new AC({ latencyHint: "interactive" }); startedAt = performance.now();
    white = noiseBuffer(4, "white"); pink = noiseBuffer(6, "pink"); brown = noiseBuffer(6, "brown");
    // everything → muffle (closes down when you're under) → a gentle glue compressor → a limiter → out
    bus = gainNode(1); muffle = filter("lowpass", 18000, 0.5); out = gainNode(muted ? 0 : LEVEL);
    const glue = ctx.createDynamicsCompressor(); glue.threshold.value = -18; glue.knee.value = 12; glue.ratio.value = 3; glue.attack.value = 0.01; glue.release.value = 0.25;
    const limit = ctx.createDynamicsCompressor(); limit.threshold.value = -4; limit.knee.value = 0; limit.ratio.value = 20; limit.attack.value = 0.002; limit.release.value = 0.1;
    chain(bus, muffle, glue, limit, out, ctx.destination);
    // the sea's bed: pink noise low and wide, swelling after each break, and a low rumble
    bedGain = gainNode(0); chain(loop(pink), filter("lowpass", 520, 0.5), bedGain, bus);
    bedLow = gainNode(0); chain(loop(brown), filter("lowpass", 140, 0.5), bedLow, bus);
    // the night air: a faint wind that wanders
    wind = gainNode(0); windFilter = filter("bandpass", 480, 0.45); chain(loop(pink), windFilter, wind, bus);
    // rain: a high hiss and a softer body; the drops are scheduled one by one in tick()
    rainHiss = gainNode(0); chain(loop(white), filter("bandpass", 5200, 0.5), rainHiss, bus);
    rainBody = gainNode(0); chain(loop(pink), filter("bandpass", 1300, 0.45), rainBody, bus);
    // under the surface: a dark pressure hum
    underBed = gainNode(0); chain(loop(brown), filter("lowpass", 220, 0.6), underBed, bus);
    // wading: water pushed round the legs; stirring: the hand's swish
    wadeGain = gainNode(0); wadeFilter = filter("bandpass", 700, 0.8); chain(loop(pink), wadeFilter, wadeGain, bus);
    stirGain = gainNode(0); stirFilter = filter("bandpass", 600, 0.9); chain(loop(pink), stirFilter, stirGain, bus);
    // crickets in the dune behind the beach: one tone each, gated into chirps by tick()
    cricketBus = gainNode(0); cricketBus.connect(bus);
    for (const c of crickets) {
      const o = ctx.createOscillator(); o.frequency.value = c.f; c.g = gainNode(0); c.p = panner(0);
      chain(o, c.g, c.p, cricketBus); o.start(); c.next = ctx.currentTime + rnd(0.2, 1.5);
    }
    setInterval(tick, 40);
  }

  // a wave breaking at x, z: the crash, its thump, then the foam fizzing as the wash runs up and drains
  function breakWave(x, z, n, w) {
    const big = 0.3 + 0.7 * Math.pow(hash(n * 1.7 + Math.round(x / 11)), 1.3);
    const d = Math.hypot(x - st.x, z - st.z), near = 1 / (1 + Math.max(0, d - 2) / 7);
    const p = panTo(x, z), a = big * near * w;
    burst({ buf: pink, type: "bandpass", f: 1100, f2: 380, sweep: 1.1, q: 0.55, peak: 0.5 * a, attack: 0.16, decay: 1.5, pan: p });
    burst({ buf: brown, type: "lowpass", f: 170, q: 0.5, peak: 0.4 * a, attack: 0.09, decay: 0.9, pan: p * 0.5 });
    burst({ buf: pink, type: "bandpass", f: 3600, q: 0.6, peak: 0.24 * a, at: 0.3, attack: 0.55, decay: 2.3, pan: p });
    for (let i = 0; i < 6 * a; i++) ping({ f: rnd(1600, 4200), up: rnd(1.2, 1.8), peak: rnd(0.003, 0.009), at: rnd(0.4, 2.2), decay: rnd(0.02, 0.05), pan: p + rnd(-0.3, 0.3) });
  }

  // runs every 40 ms: the levels that follow where you are, and everything scheduled one by one
  function tick() {
    if (!ctx || ctx.state !== "running") return;
    const now = ctx.currentTime, dt = lastTick ? Math.min(0.2, now - lastTick) : 0.04; lastTick = now;
    const toShore = st.z - shoreZ(st.x), dry = 1 - st.under, r = st.rain;
    const near = 1 / (1 + Math.abs(toShore) / 9);
    // the bed swells for a second after each crest passes the shore in front of you
    const ph = swell(st.x, shoreZ(st.x) + 1.5, st.t), after = ((-ph / (2 * Math.PI) + 0.25) % 1 + 1) % 1;
    const surge = 0.65 + 0.35 * Math.exp(-after * 3);
    ease(bedGain.gain, (0.05 + 0.13 * near) * surge * (1 - 0.4 * st.under));
    ease(bedLow.gain, 0.06 + 0.07 * near + 0.04 * st.under);
    // the muffle: open above, about 600 Hz under, swept on a log scale
    ease(muffle.frequency, 600 * Math.pow(18000 / 600, 1 - st.under), 0.05);
    ease(bus.gain, 1 - 0.35 * st.under, 0.05);
    ease(underBed.gain, 0.1 * st.under);
    // wind wanders; rain lifts it
    if (Math.random() < dt * 0.5) ease(windFilter.frequency, rnd(320, 720), 1.5);
    ease(wind.gain, (0.012 + 0.02 * Math.random() + 0.03 * r) * dry, 1.2);
    ease(rainHiss.gain, 0.05 * r, 0.5); ease(rainBody.gain, 0.07 * r, 0.5);
    // wading: a swish that follows your pace, and the glow fizzing round your legs
    ease(wadeGain.gain, 0.09 * st.wade, 0.12); ease(wadeFilter.frequency, 500 + 500 * st.wade, 0.2);
    // stirring: brighter and louder the faster the hand goes, duller in the sand
    ease(stirGain.gain, 0.11 * st.stir * (st.stirWater ? 1 : 0.5), 0.06);
    ease(stirFilter.frequency, (st.stirWater ? 450 : 250) + 1500 * st.stir, 0.08);
    const sparks = 5 * st.wade + 22 * st.stir * (st.stirWater ? 1 : 0.4);
    for (let n = sparks * dt; n > 0; n--) if (n >= 1 || Math.random() < n)
      ping({ f: PENTA[Math.floor(Math.random() * PENTA.length)], up: 1.01, peak: rnd(0.004, 0.013), at: rnd(0, 0.04), attack: 0.003, decay: rnd(0.08, 0.25), pan: rnd(-0.5, 0.5) });
    // rain drops plinking on the water around you (under, the muffle dulls them to taps)
    for (let n = 45 * r * dt; n > 0; n--) if (n >= 1 || Math.random() < n) {
      const close = Math.random() < 0.12;
      ping({ f: rnd(1200, 3200), up: rnd(1.4, 2.2), glide: 0.012, peak: close ? rnd(0.02, 0.04) : rnd(0.004, 0.014), at: rnd(0, 0.04), decay: rnd(0.025, 0.06), pan: rnd(-0.9, 0.9) });
    }
    // bubbles when you're under
    for (let n = 1.5 * st.under * dt; n > 0; n--) if (n >= 1 || Math.random() < n) bubble(rnd(0, 0.04), rnd(0.015, 0.04));
    // crickets: quieter the further out you go, silent in the rain and under the water
    ease(cricketBus.gain, 0.05 * clamp(1 - (toShore + 6) / 24, 0, 1) * (1 - r) * dry, 0.6);
    for (const c of crickets) {
      if (c.p) ease(c.p.pan, panTo(c.x, c.z), 0.2);
      while (c.next < now + 0.2) {
        if (Math.random() < 0.06) { c.next += rnd(2, 6); continue; }                 // a rest now and then
        for (let k = 0; k < 3; k++) { const a = c.next + k * 0.038; c.g.gain.setValueAtTime(0, a); c.g.gain.linearRampToValueAtTime(rnd(0.7, 1), a + 0.004); c.g.gain.setValueAtTime(rnd(0.7, 1), a + 0.014); c.g.gain.linearRampToValueAtTime(0, a + 0.02); }
        c.next += c.every * rnd(0.9, 1.1);
      }
    }
  }

  // --- what Unity calls ------------------------------------------------------------------------------------------
  const api = {
    state(t, x, z, yaw, under, rain, wade) {
      if (ctx && st.live && ctx.state === "running") for (const s of surf) {
        const sx = x + s.dx, sz = shoreZ(sx) + 1.5;                   // crests break about a metre and a half out
        const u = Math.floor(swell(sx, sz, t) / (2 * Math.PI) - 0.25);
        if (s.last !== undefined && u !== s.last && t > st.t) breakWave(sx, sz, u, s.w);
        s.last = u;
      }
      Object.assign(st, { t, x, z, yaw, under, rain, wade, live: true });
    },
    step(kind, strength, depth, side) {
      if (!ctx || ctx.state !== "running") return;
      const p = side * 0.18, s = 0.6 + 0.4 * strength;
      if (kind === 0) {                       // dry sand: a soft crunch, heel then ball
        for (const [at, a] of [[0, 1], [0.065, 0.65]]) {
          burst({ type: "bandpass", f: rnd(2200, 3400), q: 0.9, peak: 0.16 * s * a, at, attack: 0.004, decay: 0.07, pan: p });
          burst({ buf: brown, type: "lowpass", f: 200, q: 0.7, peak: 0.4 * s * a, at, attack: 0.003, decay: 0.06, pan: p });
        }
      } else if (kind === 1) {                // wet sand: duller and heavier, a little suck as the foot lifts
        burst({ type: "lowpass", f: 750, q: 0.8, peak: 0.28 * s, attack: 0.004, decay: 0.09, pan: p });
        burst({ buf: brown, type: "lowpass", f: 180, q: 0.7, peak: 0.45 * s, attack: 0.003, decay: 0.07, pan: p });
        burst({ type: "bandpass", f: 380, f2: 1150, sweep: 0.07, q: 5, peak: 0.07 * s, at: 0.13, attack: 0.012, decay: 0.06, pan: p });
      } else if (kind === 2) {                // wading: the foot splashing in, water slopping round the leg, drops, the glow
        const d = clamp(depth / 0.5, 0, 1);
        burst({ type: "bandpass", f: rnd(1300, 2100), q: 0.6, peak: (0.2 + 0.12 * d) * s, attack: 0.006, decay: 0.22 + 0.2 * d, pan: p });
        burst({ buf: pink, type: "lowpass", f: 480, q: 0.7, peak: (0.25 + 0.2 * d) * s, at: 0.03, attack: 0.04, decay: 0.38, pan: p });
        for (let i = 0, n = 3 + Math.floor(Math.random() * 5); i < n; i++) ping({ f: rnd(900, 2600), up: rnd(1.3, 1.9), glide: 0.015, peak: rnd(0.008, 0.03), at: rnd(0.04, 0.4), decay: rnd(0.025, 0.05), pan: p + rnd(-0.3, 0.3) });
        shimmer(0.4 + 0.6 * d, p);
      } else {                                // a swimmer's stroke: a slow push through the water, bubbles, the glow
        burst({ buf: pink, type: "lowpass", f: 300, f2: 900, sweep: 0.3, q: 1.2, peak: 0.2, attack: 0.15, decay: 0.45, pan: p });
        for (let i = 0; i < 4; i++) bubble(rnd(0.05, 0.4));
        shimmer(0.4, p);
      }
    },
    stir(amount, water) { st.stir += (amount - st.stir) * (amount > st.stir ? 0.35 : 0.12); st.stirWater = water; },
    meteor(pan, duration) {
      if (!ctx || ctx.state !== "running") return;
      // shooting stars are silent; this is a faint airy sweep, there and gone
      burst({ type: "bandpass", f: 7000, f2: 2600, sweep: duration, q: 2.5, peak: 0.035, attack: duration * 0.3, decay: duration * 1.2, pan });
      [5274, 3951, 2960].forEach((f, i) => ping({ f, peak: 0.008, at: (i * duration) / 3, attack: 0.01, decay: 0.5, pan: pan * (1 - i / 3) }));
    },
    // for the walk-through: record what the page plays (Opus in WebM), returned as base64 when stopped
    record() {
      unlock();
      const d = ctx.createMediaStreamDestination(); out.connect(d);
      const rec = new MediaRecorder(d.stream, { mimeType: "audio/webm;codecs=opus", audioBitsPerSecond: 192000 }), parts = [];
      rec.ondataavailable = (e) => parts.push(e.data); rec.start(250);
      return { stop: () => new Promise((done) => { rec.onstop = async () => { const b = new Uint8Array(await new Blob(parts).arrayBuffer()); let s = ""; for (let i = 0; i < b.length; i += 32768) s += String.fromCharCode.apply(null, b.subarray(i, i + 32768)); done(btoa(s)); }; rec.stop(); }) };
    },
    toggle() { muted = !muted; if (out) ease(out.gain, muted ? 0 : LEVEL, 0.05); show(); return muted; },
    // the sound button and M: the press that first unlocks the audio turns it on, it doesn't also mute it
    press() { if (performance.now() - startedAt < 400) show(); else api.toggle(); },
    get on() { return !!ctx && ctx.state === "running" && !muted; },
  };

  const button = () => document.getElementById("snd");
  function show() { const b = button(); if (b) b.textContent = api.on ? "sound on" : "sound off"; }
  function unlock() {
    if (!ctx) start();
    if (ctx.state !== "running" && !document.hidden) ctx.resume().then(show);
    show();
  }
  for (const e of ["pointerdown", "keydown", "touchend", "click"]) addEventListener(e, unlock, { capture: true, passive: true });
  addEventListener("keydown", (e) => { if (e.code === "KeyM") api.press(); });
  document.addEventListener("visibilitychange", () => { if (!ctx) return; if (document.hidden) ctx.suspend(); else ctx.resume().then(show); });
  window.baySound = api;
})();
