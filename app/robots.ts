import type { MetadataRoute } from "next";
import { AI_CRAWLER_USER_AGENTS, CANONICAL_ORIGIN } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_CRAWLER_USER_AGENTS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${CANONICAL_ORIGIN}/sitemap.xml`,
    host: CANONICAL_ORIGIN,
  };
}
