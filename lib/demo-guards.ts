import { Redis } from "@upstash/redis";
import { createHash } from "node:crypto";

const SPEND_UNITS_PER_USD = 10_000;
const TTL_SECONDS = 60 * 60 * 48;

const SPEND_LUA = `
local spent = tonumber(redis.call("GET", KEYS[1]) or "0")
local global_count = tonumber(redis.call("GET", KEYS[2]) or "0")
local client_count = tonumber(redis.call("GET", KEYS[3]) or "0")
local add = tonumber(ARGV[1])
local budget = tonumber(ARGV[2])
local global_limit = tonumber(ARGV[3])
local client_limit = tonumber(ARGV[4])
local ttl = tonumber(ARGV[5])

if spent + add > budget then
  return {0, spent, global_count, client_count, 1}
end
if global_count + 1 > global_limit then
  return {0, spent, global_count, client_count, 2}
end
if client_count + 1 > client_limit then
  return {0, spent, global_count, client_count, 3}
end

local next_spent = redis.call("INCRBY", KEYS[1], add)
local next_global = redis.call("INCR", KEYS[2])
local next_client = redis.call("INCR", KEYS[3])
redis.call("EXPIRE", KEYS[1], ttl)
redis.call("EXPIRE", KEYS[2], ttl)
redis.call("EXPIRE", KEYS[3], ttl)
return {1, next_spent, next_global, next_client, 0}
`;

let redisClient: Redis | null | undefined;

function getConfiguredDailyBudgetUsd(): number {
  const raw = process.env.DAILY_API_BUDGET_USD ?? process.env.HAMMER_DAILY_API_BUDGET_USD ?? "1";
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return 1;
  return Math.max(0, Math.min(1, parsed));
}

export const DEMO_DAILY_BUDGET_USD = 1;

export function getProviderKey(...names: string[]): string | null {
  for (const name of names) {
    const value = process.env[name];
    if (value && value.trim()) return value.trim();
  }
  return null;
}

function getRedisEnv(): { url: string; token: string } | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ??
    process.env.UPSTASH_REDIS_REST_KV_REST_API_URL ??
    process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ??
    process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN ??
    process.env.KV_REST_API_TOKEN;
  return url && token ? { url, token } : null;
}

function getRedis(): Redis | null {
  if (redisClient !== undefined) return redisClient;
  const env = getRedisEnv();
  redisClient = env ? new Redis({ url: env.url, token: env.token }) : null;
  return redisClient;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function clientHash(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  const ip = request.headers.get("x-real-ip") ?? forwarded;
  const ua = request.headers.get("user-agent") ?? "unknown";
  return createHash("sha256").update(`${ip}|${ua}`).digest("hex").slice(0, 24);
}

function cacheHash(input: unknown): string {
  return createHash("sha256").update(JSON.stringify(input)).digest("hex").slice(0, 32);
}

export type SpendReservation = {
  ok: boolean;
  sample: boolean;
  reason: string;
  status: number;
  capUsd: number;
  spentUsd: number;
};

export async function reserveDemoSpend(
  request: Request,
  {
    demo,
    estimatedUsd,
    perClientDailyLimit,
    globalDailyLimit,
  }: {
    demo: string;
    estimatedUsd: number;
    perClientDailyLimit: number;
    globalDailyLimit: number;
  },
): Promise<SpendReservation> {
  const capUsd = getConfiguredDailyBudgetUsd();
  if (process.env.HAMMER_DEMOS_ENABLED === "0" || process.env.HAMMER_DEMOS_ENABLED === "false") {
    return { ok: false, sample: true, reason: "demo sample mode", status: 200, capUsd, spentUsd: 0 };
  }
  if (capUsd <= 0) {
    return { ok: false, sample: true, reason: "daily cap is set to zero", status: 200, capUsd, spentUsd: 0 };
  }
  const redis = getRedis();
  if (!redis) {
    return { ok: false, sample: true, reason: "budget store unavailable", status: 200, capUsd, spentUsd: 0 };
  }

  const date = todayKey();
  const add = Math.max(1, Math.ceil(estimatedUsd * SPEND_UNITS_PER_USD));
  const budget = Math.floor(capUsd * SPEND_UNITS_PER_USD);
  const keys = [
    `hammer:demos:spend:${date}`,
    `hammer:demos:global:${demo}:${date}`,
    `hammer:demos:client:${demo}:${date}:${clientHash(request)}`,
  ];
  const args = [add, budget, globalDailyLimit, perClientDailyLimit, TTL_SECONDS];

  try {
    const result = (await redis.eval(SPEND_LUA, keys, args)) as unknown;
    const values = Array.isArray(result) ? result.map(Number) : [];
    const allowed = values[0] === 1;
    const spentUsd = (values[1] ?? 0) / SPEND_UNITS_PER_USD;
    if (allowed) return { ok: true, sample: false, reason: "reserved", status: 200, capUsd, spentUsd };

    const code = values[4] ?? 0;
    const reason =
      code === 1
        ? "daily demo budget reached"
        : code === 2
          ? "demo traffic cap reached"
          : code === 3
            ? "visitor cap reached"
            : "demo unavailable";
    return { ok: false, sample: true, reason, status: 200, capUsd, spentUsd };
  } catch {
    return { ok: false, sample: true, reason: "budget check unavailable", status: 200, capUsd, spentUsd: 0 };
  }
}

export async function getDemoCache<T>(demo: string, input: unknown): Promise<T | null> {
  const redis = getRedis();
  if (!redis) return null;
  try {
    const value = await redis.get<T>(`hammer:demos:cache:${demo}:${cacheHash(input)}`);
    return value ?? null;
  } catch {
    return null;
  }
}

export async function setDemoCache(demo: string, input: unknown, value: unknown, ttlSeconds = 60 * 60 * 24) {
  const redis = getRedis();
  if (!redis) return;
  try {
    await redis.set(`hammer:demos:cache:${demo}:${cacheHash(input)}`, value, { ex: ttlSeconds });
  } catch {
    // Cache writes must never affect the public demo.
  }
}
