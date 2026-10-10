import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const PROVIDER_ENV = "/Users/hammer/.codex/private/aividdy-provider.env";

export function secret(name) {
  if (process.env[name]) return process.env[name];
  for (const line of readFileSync(PROVIDER_ENV, "utf8").split(/\r?\n/)) {
    const i = line.indexOf("=");
    if (i > 0 && line.slice(0, i).trim() === name) return line.slice(i + 1).trim().replace(/^['"]|['"]$/g, "");
  }
  throw new Error(`${name} is not set`);
}

// Refs go inline as JPEG data URLs, shrunk to 1280 px so a packet stays small.
export function compactDataUrl(file) {
  const tmp = path.join(os.tmpdir(), `splat-ref-${process.pid}-${Date.now()}.jpg`);
  const res = spawnSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "85", "-Z", "1280", file, "--out", tmp], { stdio: "ignore" });
  const src = res.status === 0 && existsSync(tmp) ? tmp : file;
  return `data:image/jpeg;base64,${readFileSync(src).toString("base64")}`;
}

export function refuseOverwrite(file) {
  if (existsSync(file)) throw new Error(`${file} exists; generated media is never overwritten, bump the version`);
}

export function appendLedger(project, event) {
  const file = path.join(project, "ledger.json");
  const ledger = JSON.parse(readFileSync(file, "utf8"));
  ledger.events.push({ ...event, recordedAt: new Date().toISOString() });
  writeFileSync(file, JSON.stringify(ledger, null, 2) + "\n");
}

export async function download(url, file) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download ${url}: ${res.status}`);
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
