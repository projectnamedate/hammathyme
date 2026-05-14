import { NextRequest, NextResponse } from "next/server";

const CANONICAL_HOST = "hammer.ad";
const REDIRECT_HOSTS = new Set(["www.hammer.ad", "hammathyme.vercel.app"]);

export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase();
  if (!host || !REDIRECT_HOSTS.has(host)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.protocol = "https";
  url.hostname = CANONICAL_HOST;
  url.port = "";
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next/).*)"],
};
