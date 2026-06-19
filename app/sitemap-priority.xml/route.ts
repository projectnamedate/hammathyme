import { SITE_LAST_MODIFIED, getCanonicalUrl } from "@/lib/seo";

const PRIORITY_SITEMAP_ROUTES = [
  { path: "/", priority: "1.0", changeFrequency: "weekly" },
  { path: "/about", priority: "0.9", changeFrequency: "monthly" },
  { path: "/contact", priority: "0.8", changeFrequency: "monthly" },
  { path: "/work", priority: "0.9", changeFrequency: "weekly" },
  { path: "/work/agents/kira", priority: "0.8", changeFrequency: "monthly" },
  { path: "/work/motion-graphics/reel", priority: "0.8", changeFrequency: "monthly" },
  { path: "/work/motion-graphics/internet-capital-markets", priority: "0.8", changeFrequency: "monthly" },
  { path: "/work/motion-graphics/spring-health", priority: "0.8", changeFrequency: "monthly" },
  { path: "/work/visual-media/equinox", priority: "0.8", changeFrequency: "monthly" },
  { path: "/work/pipelines-tools/pipeline-visualizer", priority: "0.8", changeFrequency: "monthly" },
  { path: "/work/brand-systems/hammer", priority: "0.8", changeFrequency: "monthly" },
  { path: "/work/websites/hammer", priority: "0.8", changeFrequency: "monthly" },
] as const;

export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (char) => {
    if (char === "<") return "&lt;";
    if (char === ">") return "&gt;";
    if (char === "&") return "&amp;";
    if (char === "'") return "&apos;";
    return "&quot;";
  });
}

export function GET() {
  const lastModified = new Date(SITE_LAST_MODIFIED).toISOString();
  const urls = PRIORITY_SITEMAP_ROUTES.map(
    (route) => `<url>
<loc>${escapeXml(getCanonicalUrl(route.path))}</loc>
<lastmod>${lastModified}</lastmod>
<changefreq>${route.changeFrequency}</changefreq>
<priority>${route.priority}</priority>
</url>`,
  ).join("\n");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}
