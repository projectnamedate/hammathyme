import { NextResponse } from "next/server";
import { demosEnabled, getProviderKey } from "@/lib/demo-guards";

export const runtime = "nodejs";

export function GET() {
  const live = demosEnabled() && Boolean(getProviderKey("EVOLINK_API_KEY"));
  return NextResponse.json({ ok: true, status: live ? "available" : "sample" });
}
