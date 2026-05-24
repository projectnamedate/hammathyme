#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";

const CANONICAL_ORIGIN = "https://hammer.ad";
const CANONICAL_HOST = new URL(CANONICAL_ORIGIN).host;
const INDEXNOW_KEY = "1e787f87a15ea3c66e788346c3140ce0256437d6a4ef4f9e5d3c2be444c9bb69";
const INDEXNOW_KEY_PATH = `/${INDEXNOW_KEY}.txt`;
const INDEXNOW_ENDPOINT = process.env.INDEXNOW_ENDPOINT ?? "https://api.indexnow.org/indexnow";
const OK_STATUSES = new Set([200, 202]);

function usage() {
  console.error("Usage: npm run submit:indexnow -- [--dry-run] <url-or-path> [url-or-path ...]");
  console.error("Example: npm run submit:indexnow -- / /work /llms.txt");
}

function toCanonicalUrl(value) {
  if (value.startsWith("http://") || value.startsWith("https://")) {
    const url = new URL(value);
    if (url.host !== CANONICAL_HOST) throw new Error(`${value} does not belong to ${CANONICAL_HOST}`);
    url.protocol = "https:";
    return url.toString();
  }

  const path = value.startsWith("/") ? value : `/${value}`;
  return new URL(path, CANONICAL_ORIGIN).toString();
}

function assertIndexNowKey() {
  if (!/^[A-Za-z0-9-]{8,128}$/.test(INDEXNOW_KEY)) {
    throw new Error("IndexNow key must be 8-128 characters using letters, numbers, or dashes.");
  }

  const keyFilePath = `public${INDEXNOW_KEY_PATH}`;
  if (!existsSync(keyFilePath)) throw new Error(`${keyFilePath} is missing.`);

  const hostedKey = readFileSync(keyFilePath, "utf8").trim();
  if (hostedKey !== INDEXNOW_KEY) throw new Error(`${keyFilePath} must contain the IndexNow key.`);
}

function parseArgs(argv) {
  const dryRun = argv.includes("--dry-run");
  const values = argv.filter((value) => value !== "--dry-run");

  if (!values.length) {
    usage();
    process.exit(1);
  }

  const urlList = [...new Set(values.map(toCanonicalUrl))];
  if (urlList.length > 10000) throw new Error("IndexNow allows up to 10,000 URLs per POST.");

  return { dryRun, urlList };
}

async function main() {
  assertIndexNowKey();
  const { dryRun, urlList } = parseArgs(process.argv.slice(2));

  const payload = {
    host: CANONICAL_HOST,
    key: INDEXNOW_KEY,
    keyLocation: new URL(INDEXNOW_KEY_PATH, CANONICAL_ORIGIN).toString(),
    urlList,
  };

  if (dryRun) {
    console.log(JSON.stringify({ endpoint: INDEXNOW_ENDPOINT, payload }, null, 2));
    return;
  }

  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  const body = await response.text();
  if (!OK_STATUSES.has(response.status)) {
    throw new Error(`IndexNow submission failed with ${response.status}: ${body || response.statusText}`);
  }

  console.log(`IndexNow accepted ${urlList.length} URL${urlList.length === 1 ? "" : "s"} with HTTP ${response.status}.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
