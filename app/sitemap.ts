import type { MetadataRoute } from "next";
import { CASE_STUDIES } from "@/lib/works";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://hammathyme.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: { path: string; priority: number }[] = [
    { path: "", priority: 1.0 },
    { path: "/work", priority: 0.9 },
    { path: "/about", priority: 0.8 },
    { path: "/contact", priority: 0.7 },
    { path: "/colophon", priority: 0.4 },
  ];
  return [
    ...staticRoutes.map((r) => ({
      url: `${SITE_URL}${r.path}`,
      lastModified: now,
      priority: r.priority,
    })),
    ...CASE_STUDIES.map((c) => ({
      url: `${SITE_URL}/work/${c.slug}`,
      lastModified: now,
      priority: 0.8,
    })),
  ];
}
