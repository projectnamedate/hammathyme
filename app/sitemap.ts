import type { MetadataRoute } from "next";
import { CASE_STUDIES, getReadyPieceParams } from "@/lib/works";
import { SITE_LAST_MODIFIED, getCanonicalUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(SITE_LAST_MODIFIED);
  const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "", priority: 1.0, changeFrequency: "monthly" },
    { path: "/work", priority: 0.9, changeFrequency: "weekly" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
    { path: "/colophon", priority: 0.4, changeFrequency: "monthly" },
  ];
  return [
    ...staticRoutes.map((r) => ({
      url: getCanonicalUrl(r.path),
      lastModified,
      priority: r.priority,
      changeFrequency: r.changeFrequency,
    })),
    ...CASE_STUDIES.map((c) => ({
      url: getCanonicalUrl(`/work/${c.slug}`),
      lastModified,
      priority: 0.8,
      changeFrequency: "weekly" as const,
    })),
    ...getReadyPieceParams().map((p) => ({
      url: getCanonicalUrl(`/work/${p.slug}/${p.piece}`),
      lastModified,
      priority: 0.7,
      changeFrequency: "monthly" as const,
    })),
  ];
}
