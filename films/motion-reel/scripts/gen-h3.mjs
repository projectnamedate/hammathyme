#!/usr/bin/env node
// gen-h3.mjs: link 7 of Chain Reaction, one MiniMax H3 Max text-to-video shot on fal (the only true 1080P route).
// Two seeds per run; every file is versioned, never overwritten. Prompt is hand-written H3 IR with expansion disabled.
// Needs FAL_KEY in the environment.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'assets/video/h3');
fs.mkdirSync(OUT, { recursive: true });
const KEY = process.env.FAL_KEY?.trim().replace(/^['"]|['"]$/g, '');
if (!KEY) { console.error('Missing FAL_KEY'); process.exit(1); }
const ENDPOINT = 'minimax/h3-max/text-to-video';

const PROMPT = `integrated_multimodal_description: [Shot 1] Stylized papercraft stop-motion look printed like a risograph: every surface is matte newsprint paper printed in only three flat inks, cobalt blue, fluorescent pink and bright yellow, with visible halftone dots and slightly misregistered ink edges. A tabletop chain-reaction machine made of folded paper sits on a pale grey-white newsprint table: zigzag paper ramps, a paper funnel, a row of tall paper dominoes, and a small paper windmill. The camera pushes forward with large amplitude at medium speed, low along the table, following a fluorescent pink ball as it rolls down the zigzag ramps, drops through the funnel, knocks the dominoes over one after another, and spins the windmill. At the end the ball launches off the last ramp straight toward the camera and fills the frame with pink. One continuous shot, no cuts. Do not add people, hands, text, letters, numbers or logos. No other colours. No morphing.

overall_soundscape: Light paper and wood clicks: the ball rattling down paper ramps, soft tapping of falling paper dominoes, the whir of the paper windmill, and a whoosh as the ball flies at the camera.

non_diegetic_music: N/A`;

// Reserves the name with an exclusive create, so parallel jobs can never pick the same version.
const nextVersioned = (prefix, ext) => { for (let v = 1; ; v++) { const p = path.join(OUT, `${prefix}-v${String(v).padStart(2, '0')}${ext}`); try { fs.closeSync(fs.openSync(p, 'wx')); return p; } catch (e) { if (e.code !== 'EEXIST') throw e; } } };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const headers = { Authorization: `Key ${KEY}`, 'Content-Type': 'application/json' };

async function take(seed) {
  const res = await fetch(`https://queue.fal.run/${ENDPOINT}`, {
    method: 'POST', headers,
    body: JSON.stringify({ prompt: PROMPT, duration: 6, resolution: '1080P', aspect_ratio: '16:9', prompt_expansion_mode: 'disabled', seed }),
  });
  const job = await res.json();
  if (!res.ok || !job.request_id) throw new Error(`seed ${seed}: ${res.status} ${JSON.stringify(job).slice(0, 300)}`);
  console.log(`seed ${seed}: request ${job.request_id}`);
  for (let i = 0; i < 180; i++) {
    await sleep(5000);
    const st = await (await fetch(job.status_url, { headers })).json();
    if (st.status === 'COMPLETED') break;
    if (st.status && !['IN_QUEUE', 'IN_PROGRESS'].includes(st.status)) throw new Error(`seed ${seed}: ${JSON.stringify(st).slice(0, 300)}`);
  }
  const out = await (await fetch(job.response_url, { headers })).json();
  if (!out.video?.url) throw new Error(`seed ${seed}: no video ${JSON.stringify(out).slice(0, 300)}`);
  const f = nextVersioned('paper-machine', '.mp4');
  fs.writeFileSync(f, Buffer.from(await (await fetch(out.video.url)).arrayBuffer()));
  console.log(`  ${path.basename(f)}`);
  return { seed, request_id: job.request_id, file: path.basename(f) };
}

const results = await Promise.all([1017, 2026].map(take));
const lf = nextVersioned('paper-machine-ledger', '.json');
fs.writeFileSync(lf, JSON.stringify({ created: new Date().toISOString(), endpoint: ENDPOINT, duration: 6, resolution: '1080P', est_cost_usd: 1.92, prompt: PROMPT, results }, null, 2));
console.log(`wrote ${lf}`);
