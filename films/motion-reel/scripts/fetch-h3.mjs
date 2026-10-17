#!/usr/bin/env node
// fetch-h3.mjs: re-download finished H3 takes by fal request id from a gen-h3 ledger, each into a new version.
//   node scripts/fetch-h3.mjs assets/video/h3/paper-machine-ledger-v01.json
// Needs FAL_KEY in the environment.
import fs from 'node:fs';
import path from 'node:path';

const ledgerPath = process.argv[2];
if (!ledgerPath) { console.error('usage: fetch-h3.mjs <ledger.json>'); process.exit(1); }
const KEY = process.env.FAL_KEY?.trim().replace(/^['"]|['"]$/g, '');
if (!KEY) { console.error('Missing FAL_KEY'); process.exit(1); }
const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
const OUT = path.dirname(ledgerPath);
const nextVersioned = (prefix, ext) => { for (let v = 1; ; v++) { const p = path.join(OUT, `${prefix}-v${String(v).padStart(2, '0')}${ext}`); try { fs.closeSync(fs.openSync(p, 'wx')); return p; } catch (e) { if (e.code !== 'EEXIST') throw e; } } };

const recovered = [];
for (const r of ledger.results) {
  const res = await fetch(`https://queue.fal.run/minimax/h3-max/requests/${r.request_id}`, { headers: { Authorization: `Key ${KEY}` } });
  const out = await res.json();
  if (!res.ok || !out.video?.url) { console.error(`seed ${r.seed}: ${res.status} ${JSON.stringify(out).slice(0, 300)}`); continue; }
  const f = nextVersioned('paper-machine', '.mp4');
  fs.writeFileSync(f, Buffer.from(await (await fetch(out.video.url)).arrayBuffer()));
  console.log(`seed ${r.seed} -> ${path.basename(f)}`);
  recovered.push({ seed: r.seed, request_id: r.request_id, file: path.basename(f) });
}
const lf = nextVersioned('paper-machine-ledger', '.json');
fs.writeFileSync(lf, JSON.stringify({ created: new Date().toISOString(), recovered_from: path.basename(ledgerPath), results: recovered }, null, 2));
console.log(`wrote ${lf}`);
