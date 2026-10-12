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
  return NextResponse.json({
    ok: true,
    capUsd: 1,
    liveCallsEnabled: budgetStore,
    fal,
    storyboardFal: fal,
    budgetStore,
  });
}
