import { NextResponse } from "next/server";
import { DEMO_DAILY_BUDGET_USD, getProviderKey, hasDemoBudgetStore } from "@/lib/demo-guards";

export const runtime = "nodejs";

export function GET() {
  const budgetStore = hasDemoBudgetStore();
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({
      ok: true,
      capUsd: DEMO_DAILY_BUDGET_USD,
      status: budgetStore ? "available" : "sample",
    });
  }

  const fal = Boolean(getProviderKey("HAMMER_FAL_KEY", "FAL_KEY"));
  const openrouter = Boolean(getProviderKey("HAMMER_OPENROUTER_API_KEY", "OPENROUTER_API_KEY"));
  const kiraChat = Boolean(getProviderKey("HAMMER_KIRA_WEB_CHAT_API_KEY", "KIRA_WEB_CHAT_API_KEY"));
  return NextResponse.json({
    ok: true,
    capUsd: 1,
    liveCallsEnabled: budgetStore,
    openrouter,
    kiraChat,
    fal,
    storyboardFal: fal,
    lora: Boolean(getProviderKey("HAMMER_KIRA_LORA_URL", "KIRA_LORA_URL")),
    budgetStore,
  });
}
