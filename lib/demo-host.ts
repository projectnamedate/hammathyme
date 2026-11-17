// Paid live demos run only on the canonical domain, where the firewall's site-wide cap applies.
// Per-deployment *.vercel.app hosts would each get their own rate-limit bucket.
const LIVE_HOSTS = new Set(["hammer.ad", "localhost", "127.0.0.1"]);

export function liveDemoHost(hostHeader: string | null): boolean {
  const host = hostHeader?.split(":")[0]?.toLowerCase() ?? "";
  return LIVE_HOSTS.has(host);
}
