// GPT Image 2.5 still on Evolink, one image per request.
// usage: node scripts/gen_still.mjs <project> <id> <prompt.md> [--model sunburst|flare] [--size 4:3] [--ref file]...
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { appendLedger, compactDataUrl, download, refuseOverwrite, secret, sleep } from "./lib.mjs";

const [project, id, promptFile, ...rest] = process.argv.slice(2);
const opts = { model: "sunburst", size: "4:3", refs: [] };
for (let i = 0; i < rest.length; i += 2) {
  if (rest[i] === "--ref") opts.refs.push(rest[i + 1]);
  else opts[rest[i].replace(/^--/, "")] = rest[i + 1];
}
const out = path.join(project, "stills", `${id}.png`);
refuseOverwrite(out);

const model = `gpt-image-2.5-${opts.model}`;
const prompt = readFileSync(promptFile, "utf8").trim();
const body = { model, prompt, size: opts.size, resolution: "2K", quality: "high" };
if (opts.refs.length) body.image_urls = opts.refs.map(compactDataUrl);

const headers = { Authorization: `Bearer ${secret("EVOLINK_API_KEY")}`, "Content-Type": "application/json" };
const submit = await fetch("https://api.evolink.ai/v1/images/generations", { method: "POST", headers, body: JSON.stringify(body) });
const task = await submit.json();
if (!submit.ok || !task.id) throw new Error(`submit failed: ${submit.status} ${JSON.stringify(task)}`);
console.log(`${id}: task ${task.id}`);

let result = task;
for (let i = 0; i < 120; i++) {
  const s = String(result.status || "").toLowerCase();
  if (["completed", "succeeded", "success", "failed", "error"].includes(s) && i > 0) break;
  await sleep(6000);
  const poll = await fetch(`https://api.evolink.ai/v1/tasks/${task.id}`, { headers });
  if (poll.ok) result = await poll.json();
}
const status = String(result.status || "").toLowerCase();
const url = (JSON.stringify(result).match(/https:[^"]+?\.(?:png|jpe?g|webp)[^"]*/i) || [])[0];
appendLedger(project, { id, provider: "evolink", model, requestId: task.id, status, cost: result.usage || null, refs: opts.refs, prompt: promptFile });
if (!url) throw new Error(`${id}: no image (${status}) ${JSON.stringify(result).slice(0, 600)}`);
await download(url, out);
writeFileSync(out.replace(/\.png$/, ".json"), JSON.stringify({ id, model, size: opts.size, refs: opts.refs, prompt, requestId: task.id }, null, 2));
console.log(`${id}: saved ${out}`);
