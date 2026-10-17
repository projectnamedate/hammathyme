#!/usr/bin/env node
// gen-sfx.mjs: synthesizes the Chain Reaction SFX stem (66 s, 48 kHz stereo WAV) from the same key times the picture
// uses. Seeded noise, so every run is identical. Writes a new version each run; never overwrites.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'assets/audio/sfx');
fs.mkdirSync(OUT, { recursive: true });
const SR = 48000, DUR = 66, N = SR * DUR;
const L = new Float32Array(N), R = new Float32Array(N);

let seed = 20261017;
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 * 2 - 1; };
const BAR = (60 / 118) * 4, BEAT = BAR / 4, D = (i) => 0.27 + i * BAR;

function add(t0, len, fn, gain = 1, pan = 0) {
  const s0 = Math.round(t0 * SR), n = Math.round(len * SR);
  const gl = gain * Math.cos((pan + 1) * Math.PI / 4), gr = gain * Math.sin((pan + 1) * Math.PI / 4);
  for (let i = 0; i < n && s0 + i < N; i++) {
    if (s0 + i < 0) continue;
    const v = fn(i / SR);
    L[s0 + i] += v * gl; R[s0 + i] += v * gr;
  }
}
const env = (t, a, d) => (t < a ? t / a : Math.exp(-(t - a) / d));
// A short digital tick (the call sites still pass the old woodblock pitches; the tick sits an octave up).
const woodblock = (t0, f = 900, g = 0.35, pan = 0) => add(t0, 0.06, (t) => env(t, 0.0004, 0.009) * Math.sin(2 * Math.PI * f * 2 * t), g * 0.8, pan);
const thud = (t0, g = 0.7) => add(t0, 0.6, (t) => { const f = 50 + 90 * Math.exp(-t * 18); return env(t, 0.002, 0.16) * Math.sin(2 * Math.PI * f * t * (1 + 0.2 * t)); }, g);
const pop = (t0, g = 0.4, pan = 0) => add(t0, 0.12, (t) => env(t, 0.001, 0.03) * Math.sin(2 * Math.PI * (300 + 700 * Math.exp(-t * 60)) * t), g, pan);
function clack(t0, g = 0.35, pan = 0) {
  let y = 0;
  add(t0, 0.09, (t) => { const x = rnd(); const hp = x - y; y = x; return env(t, 0.0005, 0.012) * hp + env(t, 0.001, 0.02) * Math.sin(2 * Math.PI * 1400 * t) * 0.6; }, g, pan);
}
// A clean sine ping with one octave partial, and a downward zap.
const bell = (t0, f = 1320, g = 0.3) => add(t0, 0.9, (t) => (Math.sin(2 * Math.PI * f * t) + 0.25 * Math.sin(2 * Math.PI * f * 2 * t)) * env(t, 0.001, 0.16), g * 0.8);
const boing = (t0, g = 0.4) => { let ph = 0; add(t0, 0.3, (t) => { ph += 2 * Math.PI * (90 + 900 * Math.exp(-t * 14)) / SR; return env(t, 0.001, 0.09) * Math.sin(ph); }, g); };
function whoosh(t0, len, f0, f1, g = 0.4, pan0 = 0, pan1 = 0) {
  let y = 0;
  const n = Math.round(len * SR), s0 = Math.round(t0 * SR);
  for (let i = 0; i < n && s0 + i < N; i++) {
    const u = i / n, fc = f0 * Math.pow(f1 / f0, u), a = 1 - Math.exp(-2 * Math.PI * fc / SR);
    y += a * (rnd() - y);
    const e = Math.sin(Math.PI * u) ** 1.5 * g * 2.2, p = pan0 + (pan1 - pan0) * u;
    L[s0 + i] += y * e * Math.cos((p + 1) * Math.PI / 4); R[s0 + i] += y * e * Math.sin((p + 1) * Math.PI / 4);
  }
}
function tear(t0, g = 0.7) {
  let y = 0, crack = 0;
  add(t0, 0.55, (t) => { if (rnd() > 0.9) crack = rnd(); const a = 1 - Math.exp(-2 * Math.PI * 3000 / SR); y += a * (rnd() - y); return env(t, 0.002, 0.14) * (y * 1.6 + crack * 0.5 * Math.exp(-t * 6)); }, g);
}

function roll(t0, len, g = 0.18) {
  let y = 0;
  add(t0, len, (t) => { const a = 1 - Math.exp(-2 * Math.PI * 260 / SR); y += a * (rnd() - y); const e = Math.min(1, t / 0.05) * Math.min(1, (len - t) / 0.08); return y * 3 * e * (1 + 0.3 * Math.sin(2 * Math.PI * 23 * t)); }, g);
}
function ticks(t0, t1, n, f = 2400, g = 0.12) {
  for (let i = 0; i < n; i++) { const u = i / (n - 1); woodblock(t0 + (t1 - t0) * Math.sqrt(u), f + 600 * u, g * (0.6 + 0.4 * u), -0.2 + 0.4 * u); }
}
const chime = (t0, notes, g = 0.16) => notes.forEach((f, i) => bell(t0 + i * 0.09, f, g));
const S = D(21); // the smash; the machine runs from here

// 01: the drop, the burst, the letters, the full stop.
whoosh(0.7, 1.6, 300, 2200, 0.12);
thud(D(1), 0.6); whoosh(D(1), 0.7, 900, 5000, 0.2, -0.3, 0.3);
for (let i = 0; i < 11; i++) woodblock((i < 7 ? D(1) + BEAT : D(1) + 2 * BEAT) + (i % 7) * 0.045 + 0.35, 900 + (i % 7) * 70, 0.16, -0.5 + i * 0.09);
thud(D(2), 0.35); pop(D(2) + BEAT, 0.45, 0.3);
for (let i = 0; i < 11; i++) woodblock(D(3) + i * 0.05, 1500 + i * 40, 0.08, -0.5 + i * 0.09);
roll(D(4) + 0.2, 11.0 - D(4) - 0.2, 0.16);
// 02: dominoes, the flip into bars, the count, the slam, the rollover.
for (let i = 0; i < 7; i++) clack(11.22 + i * 0.19, 0.32, -0.5 + i * 0.12);
for (let i = 0; i < 7; i++) whoosh(D(6) + i * 0.05, 0.35, 700, 3200, 0.05, -0.4 + i * 0.12, -0.4 + i * 0.12);
ticks(13.3, D(8) - 0.05, 38);
thud(D(8), 0.6); woodblock(D(8), 520, 0.3);
bell(D(8) + BEAT, 1480, 0.25); pop(D(8) + BEAT + 0.05, 0.4);
// 03: the "1" flies to the globe, the pins pop, Tokyo's spring.
whoosh(18.1, 1.5, 400, 2600, 0.14, 0.4, -0.2); pop(19.6, 0.3);
[19.6, D(10), 21.62, D(11), D(12)].forEach((t, i) => { pop(t - 0.12, 0.3, -0.6 + i * 0.3); if (i < 4) whoosh(t, 0.9, 600, 1400, 0.05); });
boing(D(12) + BEAT, 0.42);
// 04: the card swings in, toggles, the toast, chaos, GO, the lever, launch.
whoosh(25.6, 0.9, 300, 1500, 0.12);
[27.2, 27.2 + BEAT, 27.2 + 2 * BEAT].forEach((t, i) => { clack(t, 0.3, 0.4); woodblock(t + 0.01, 1600 + i * 120, 0.12, 0.4); });
chime(27.2 + BEAT + 0.1, [1568, 2093], 0.1);
for (let i = 0; i < 6; i++) clack(27.2 + 2 * BEAT + 0.05 + i * 0.08, 0.12, (i % 2) * 0.6 - 0.3);
pop(29.24, 0.35, 0.4); woodblock(29.75, 760, 0.3, 0.3);
whoosh(29.75, 1.0, 600, 3500, 0.18, 0.4, -0.4);
thud(D(15), 0.45); woodblock(D(15), 430, 0.35, -0.3); chime(D(15) + 0.05, [1175, 1760], 0.08);
thud(D(16), 0.5); clack(D(16), 0.35, -0.4);
whoosh(D(16), 1.6, 250, 1800, 0.3, -0.2, 0.2);
whoosh(35.0, 2.4, 400, 900, 0.1, 0.4, -0.4);
// 05/06: the hammer hangs in the break, then the smash.
whoosh(D(20), 2.0, 120, 260, 0.08);
thud(S, 0.95); tear(S, 0.75); clack(S, 0.4);
// The machine behind the sheet.
thud(S + 0.35, 0.55); woodblock(S + 0.35, 380, 0.3); whoosh(S + 0.37, 0.65, 500, 2400, 0.16);
pop(S + 1.0, 0.25); roll(S + 1.0, 0.75); clack(S + 1.8, 0.2); roll(S + 1.88, 0.72); clack(S + 2.66, 0.2); roll(S + 2.72, 0.62);
clack(S + 3.4, 0.18);
whoosh(S + 3.42, 0.6, 300, 1600, 0.16);
for (let i = 0; i < 8; i++) clack(S + 4.32 + i * 0.11 + 0.16, 0.3, -0.4 + i * 0.1);
thud(S + 5.32, 0.5); clack(S + 5.32, 0.35, 0.3);
whoosh(S + 5.36, 0.76, 300, 5200, 0.34);
// The crane up, the index of moves, the dive to the sign-off, the ball falling out of the lens, the sweep.
whoosh(49.4, 1.6, 200, 900, 0.12);
for (let i = 0; i < 23; i++) woodblock(D(25) + 0.3 + i * 0.06, 2000 + (i % 6) * 180, 0.07, -0.6 + (i % 12) * 0.1);
whoosh(57.4, 3.2, 900, 220, 0.12);
whoosh(D(30) - 0.8, 0.85, 4200, 500, 0.2, -0.3, 0.1);
pop(D(30), 0.5); thud(D(30), 0.3); bell(D(30) + 0.02, 1760, 0.18);
whoosh(D(30) + 0.35, 0.8, 3000, 9000, 0.06, -0.5, 0.5);

// Peak-normalize to -3 dBFS, write 16-bit WAV.
let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const k = 0.708 / peak;
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVE', 8); buf.write('fmt ', 12);
buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  buf.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(L[i] * k * 32767))), 44 + i * 4);
  buf.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(R[i] * k * 32767))), 46 + i * 4);
}
const nextVersioned = (prefix, ext) => { for (let v = 1; ; v++) { const p = path.join(OUT, `${prefix}-v${String(v).padStart(2, '0')}${ext}`); try { fs.closeSync(fs.openSync(p, 'wx')); return p; } catch (e) { if (e.code !== 'EEXIST') throw e; } } };
const f = nextVersioned('chain-sfx', '.wav');
fs.writeFileSync(f, buf);
console.log(`wrote ${f} (peak scale ${k.toFixed(3)})`);
