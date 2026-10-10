// Hunyuan 3D 3.1 Pro image-to-3D on fal ($0.375, +$0.15 PBR).
// usage: node scripts/hunyuan.mjs <project> <id> <front.png> [--faces 500000] [--pbr true]
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fal } from "@fal-ai/client";
import { appendLedger, download, refuseOverwrite, secret } from "./lib.mjs";

const [project, id, front, ...rest] = process.argv.slice(2);
const opts = { faces: "500000", pbr: "true" };
for (let i = 0; i < rest.length; i += 2) opts[rest[i].replace(/^--/, "")] = rest[i + 1];
const out = path.join(project, "meshes", `${id}.glb`);
refuseOverwrite(out);

fal.config({ credentials: secret("FAL_KEY") });
const imageUrl = await fal.storage.upload(new Blob([readFileSync(front)], { type: "image/png" }));
const endpoint = "fal-ai/hunyuan-3d/v3.1/pro/image-to-3d";
const input = { input_image_url: imageUrl, enable_pbr: opts.pbr === "true", face_count: Number(opts.faces) };
const t0 = Date.now();
const result = await fal.subscribe(endpoint, { input, logs: false });
const usd = 0.375 + (input.enable_pbr ? 0.15 : 0) + (input.face_count !== 500000 ? 0.15 : 0);
appendLedger(project, { id, provider: "fal", model: endpoint, requestId: result.requestId, status: "completed", estimatedUsd: usd, input: { ...input, input_image_url: front } });
await download(result.data.model_glb.url, out);
writeFileSync(out.replace(/\.glb$/, ".json"), JSON.stringify({ id, endpoint, front, input: { ...input, input_image_url: front }, seed: result.data.seed, requestId: result.requestId, seconds: Math.round((Date.now() - t0) / 1000) }, null, 2));
console.log(`${id}: saved ${out} in ${Math.round((Date.now() - t0) / 1000)}s`);
