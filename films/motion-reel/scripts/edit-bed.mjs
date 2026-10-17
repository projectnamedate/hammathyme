#!/usr/bin/env node
// edit-bed.mjs: cuts a Suno take to the picture's beat grid (118 BPM, downbeats at 0.27 + i * BAR).
// The take's own downbeats sit at i * BAR, so it starts 0.27 s late. Bar 18 is played twice so the take's
// written break lands on the hammer's hang (bar 21) and the drop on the smash; one outro bar is dropped to
// keep 66 s. Every cut is on a bar line with a 6 ms crossfade. Writes a new version; never overwrites.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'assets/audio/music');
const SRC = path.join(DIR, process.argv[2] || 'chain-bed-v08.mp3');
const BAR = (60 / 118) * 4, LEAD = 0.27, X = 0.006;
const b = (i) => i * BAR;
// [from, to] in the take's time, played in order.
const SEGS = [[0, b(19)], [b(18), b(19)], [b(19), b(30)], [b(31), null]];

const parts = SEGS.map(([a, z], i) => `[0:a]atrim=start=${a.toFixed(4)}${z == null ? '' : `:end=${z.toFixed(4)}`},asetpts=PTS-STARTPTS,afade=t=in:d=${X},afade=t=out:st=${z == null ? 0 : (z - a - X).toFixed(4)}:d=${z == null ? 0 : X}[s${i}]`);
parts[parts.length - 1] = `[0:a]atrim=start=${SEGS.at(-1)[0].toFixed(4)},asetpts=PTS-STARTPTS,afade=t=in:d=${X}[s${SEGS.length - 1}]`;
const filter = `${parts.join(';')};${SEGS.map((_, i) => `[s${i}]`).join('')}concat=n=${SEGS.length}:v=0:a=1,adelay=${LEAD * 1000}|${LEAD * 1000},apad,atrim=end=66,afade=t=out:st=65.4:d=0.6[o]`;

const nextVersioned = (prefix, ext) => { for (let v = 1; ; v++) { const p = path.join(DIR, `${prefix}-v${String(v).padStart(2, '0')}${ext}`); try { fs.closeSync(fs.openSync(p, 'wx')); return p; } catch (e) { if (e.code !== 'EEXIST') throw e; } } };
const out = nextVersioned('chain-bed-edit', '.wav');
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', SRC, '-filter_complex', filter, '-map', '[o]', '-ar', '48000', '-ac', '2', out]);
console.log(`wrote ${path.relative(ROOT, out)} from ${path.basename(SRC)}`);
