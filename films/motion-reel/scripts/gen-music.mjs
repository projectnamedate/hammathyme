#!/usr/bin/env node
// gen-music.mjs: the Chain Reaction bed from Suno v6-wild on Evolink (v6-wild follows `duration`; v6 doesn't).
// Two requests = four songs to pick from; every file is versioned, never overwritten.
// Rights: Evolink resells Suno access, so the bed is cleared for portfolio use only (suno skill).
// Needs EVOLINK_API_KEY in the environment.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'assets/audio/music');
fs.mkdirSync(OUT, { recursive: true });
const KEY = process.env.EVOLINK_API_KEY?.trim().replace(/^['"]|['"]$/g, '');
if (!KEY) { console.error('Missing EVOLINK_API_KEY'); process.exit(1); }
const API = 'https://api.evolink.ai/v1';

const STYLE = 'Cool, precise, technical electronic instrumental for a design-engineering showreel. Minimal techno and IDM, 118 BPM, steady metronomic 4/4. A tight analog kick, crisp closed hi-hats and small glitchy clicks on the sixteenths, a deep round sub bass, a clean modular synth arpeggio in a minor key with subtle filter movement, cold digital pads, granular textures, dry and close, wide stereo detail, restrained and confident. Opens with a filtered pulse and ticking clicks, the arpeggio enters, the groove builds with each section; around forty seconds the beat cuts to near silence for one bar, then drops back in full; ends on a single low synth hit that rings out to silence.';
const PROMPT = '[Intro – filtered pulse, ticking clicks, no kick]\n[Build – arpeggio enters, kick and hats lock in]\n[Main – full groove, sub bass, glitch details]\n[Break – one bar of near silence]\n[Drop – full groove returns]\n[End – one low synth hit rings out, then silence]';
const NEG = 'vocals, singing, choir, marimba, ukulele, whistle, glockenspiel, claps, kazoo, happy, cartoon, jingle, commercial, playful, brass, orchestral';

// Reserves the name with an exclusive create, so parallel jobs can never pick the same version.
const nextVersioned = (prefix, ext) => { for (let v = 1; ; v++) { const p = path.join(OUT, `${prefix}-v${String(v).padStart(2, '0')}${ext}`); try { fs.closeSync(fs.openSync(p, 'wx')); return p; } catch (e) { if (e.code !== 'EEXIST') throw e; } } };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function generate(tag) {
  const res = await fetch(`${API}/audios/generations`, {
    method: 'POST', headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'suno-v6-wild-beta', custom_mode: true, instrumental: true, title: `Chain Reaction ${tag}`, style: STYLE, prompt: PROMPT, negative_tags: NEG, duration: 66, style_weight: 0.75 }),
  });
  const task = await res.json();
  if (!res.ok || !task.id) throw new Error(`${tag}: ${res.status} ${JSON.stringify(task).slice(0, 300)}`);
  console.log(`${tag}: task ${task.id}`);
  for (let i = 0; i < 120; i++) {
    await sleep(5000);
    const s = await (await fetch(`${API}/tasks/${task.id}`, { headers: { Authorization: `Bearer ${KEY}` } })).json();
    if (s.status === 'failed') throw new Error(`${tag}: failed ${JSON.stringify(s).slice(0, 300)}`);
    if (s.status !== 'completed') continue;
    const songs = Array.isArray(s.result_data) ? s.result_data : (s.result_data?.songs || []);
    const files = [];
    for (const song of songs) {
      const f = nextVersioned('chain-bed', '.mp3');
      fs.writeFileSync(f, Buffer.from(await (await fetch(song.audio_url)).arrayBuffer()));
      files.push({ file: path.basename(f), duration: song.duration, result_id: song.result_id });
      console.log(`  ${path.basename(f)} ${song.duration}s`);
    }
    return { tag, task: task.id, cost: s.usage?.cost?.usd, files };
  }
  throw new Error(`${tag}: timed out`);
}

const results = await Promise.all(['a', 'b'].map(generate));
const mf = nextVersioned('chain-bed-ledger', '.json');
fs.writeFileSync(mf, JSON.stringify({ created: new Date().toISOString(), model: 'suno-v6-wild-beta', style: STYLE, prompt: PROMPT, negative_tags: NEG, results }, null, 2));
console.log(`wrote ${mf}`);
