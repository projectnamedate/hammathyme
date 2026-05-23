import { NextResponse } from "next/server";
import { getProviderKey } from "@/lib/demo-guards";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json({
    ok: true,
    capUsd: 1,
    openrouter: Boolean(getProviderKey("HAMMER_OPENROUTER_API_KEY", "OPENROUTER_API_KEY")),
    kiraChat: Boolean(getProviderKey("HAMMER_KIRA_WEB_CHAT_API_KEY", "KIRA_WEB_CHAT_API_KEY")),
    fal: Boolean(getProviderKey("HAMMER_FAL_KEY", "FAL_KEY")),
    lora: Boolean(getProviderKey("HAMMER_KIRA_LORA_URL", "KIRA_LORA_URL")),
    budgetStore: Boolean(
      process.env.UPSTASH_REDIS_REST_URL ||
        process.env.UPSTASH_REDIS_REST_KV_REST_API_URL ||
        process.env.KV_REST_API_URL,
    ),
  });
}
