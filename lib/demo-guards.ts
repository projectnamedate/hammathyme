import { NextResponse } from "next/server";

// Per-visitor limits live in the Vercel Firewall (a rate-limit rule on the demo routes), not in code.

export function getProviderKey(...names: string[]): string | null {
  for (const name of names) {
    const value = process.env[name];
    if (value && value.trim()) return value.trim();
  }
  return null;
}

export function demosEnabled(): boolean {
  return process.env.HAMMER_DEMOS_ENABLED !== "0" && process.env.HAMMER_DEMOS_ENABLED !== "false";
}

export function noStore<T extends Record<string, unknown>>(payload: T, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("cache-control", "no-store");
  return NextResponse.json(payload, {
    ...init,
    headers,
  });
}
