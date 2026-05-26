import { existsSync, readFileSync } from "node:fs";

const failures = [];

function fail(message) {
  failures.push(message);
}

function read(path) {
  if (!existsSync(path)) {
    fail(`${path} is missing`);
    return "";
  }
  return readFileSync(path, "utf8");
}

function mustContain(path, needles) {
  const text = read(path);
  for (const needle of needles) {
    if (!text.includes(needle)) fail(`${path} is missing ${needle}`);
  }
  return text;
}

function readJson(path) {
  const text = read(path);
  try {
    return JSON.parse(text);
  } catch (error) {
    fail(`${path} is not valid JSON: ${error.message}`);
    return {};
  }
}

const packageJson = JSON.parse(read("package.json") || "{}");
if (packageJson.scripts?.["verify:seo"] !== "node scripts/verify-seo.mjs") {
  fail("package.json must expose npm run verify:seo");
}
if (packageJson.scripts?.["submit:indexnow"] !== "node scripts/submit-indexnow.mjs") {
  fail("package.json must expose npm run submit:indexnow");
}

const seoText = mustContain("lib/seo.ts", [
  "CANONICAL_ORIGIN",
  "SITE_LAST_MODIFIED",
  "DEFAULT_KEYWORDS",
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "ClaudeBot",
  "PerplexityBot",
  "Google-Extended",
  "CCBot",
  "buildPageMetadata",
  "buildWebSiteJsonLd",
  "buildPersonJsonLd",
  "buildProfilePageJsonLd",
  "buildBreadcrumbJsonLd",
  "buildCollectionPageJsonLd",
  "buildCreativeWorkJsonLd",
  "buildVideoObjectJsonLd",
]);

const isoDateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:Z|[+-]\d{2}:\d{2})$/;
const siteLastModified = seoText.match(/SITE_LAST_MODIFIED = "([^"]+)"/)?.[1];
if (!siteLastModified || !isoDateTimePattern.test(siteLastModified)) {
  fail("lib/seo.ts SITE_LAST_MODIFIED must be an ISO 8601 date-time with timezone");
}

const profilePageBlock = seoText.match(/export function buildProfilePageJsonLd\(\): JsonLdObject \{([\s\S]*?)\n\}/)?.[1] ?? "";
const profileDateCreated = profilePageBlock.match(/dateCreated: "([^"]+)"/)?.[1];
const profileDateModifiedUsesSiteConstant = profilePageBlock.includes("dateModified: SITE_LAST_MODIFIED");
if (!profileDateCreated || !isoDateTimePattern.test(profileDateCreated)) {
  fail("buildProfilePageJsonLd dateCreated must be an ISO 8601 date-time with timezone");
}
if (!profileDateModifiedUsesSiteConstant) {
  const profileDateModified = profilePageBlock.match(/dateModified: "([^"]+)"/)?.[1];
  if (!profileDateModified || !isoDateTimePattern.test(profileDateModified)) {
    fail("buildProfilePageJsonLd dateModified must be an ISO 8601 date-time with timezone");
  }
}

const videoUploadDates = [...seoText.matchAll(/uploadDate: "([^"]+)"/g)].map((match) => match[1]);
for (const uploadDate of videoUploadDates) {
  if (!isoDateTimePattern.test(uploadDate)) {
    fail(`buildVideoObjectJsonLd uploadDate must be an ISO 8601 date-time with timezone: ${uploadDate}`);
  }
}

mustContain("components/JsonLd.tsx", ["application/ld+json", "jsonLd"]);

mustContain("public/llms.txt", [
  "# hammer",
  "https://hammer.ad/llms-full.txt",
  "https://hammer.ad/.well-known/agents.json",
]);

mustContain("public/llms-full.txt", [
  "# hammer agent context",
  "canonical url: https://hammer.ad",
  "Jeff Hammer",
  "AI Producer",
  "visual-only",
  "jeff@projectname.date",
]);

mustContain("public/.well-known/agents.json", [
  "\"canonical_url\": \"https://hammer.ad\"",
  "\"llms.txt\"",
  "\"llms-full.txt\"",
  "\"ai_crawlers_allowed\"",
]);

const agentsManifest = readJson("public/.well-known/agents.json");
const worksText = read("lib/works.ts");
const categorySlugs = [
  ...worksText.matchAll(/^\s{4}slug: "([a-z0-9-]+)",\n\s{4}title:/gm),
].map((match) => match[1]);
const detailBlock = worksText.match(/DETAIL_READY_KEYS = new Set\(\[([\s\S]*?)\]\)/)?.[1] ?? "";
const detailRoutes = [...detailBlock.matchAll(/"([^"]+)"/g)].map((match) => `/work/${match[1]}`);
const expectedManifestRoutes = new Set([
  "/",
  "/work",
  "/about",
  "/contact",
  "/colophon",
  ...categorySlugs.map((slug) => `/work/${slug}`),
  ...detailRoutes,
]);
const manifestRoutes = new Set(
  Array.isArray(agentsManifest.public_routes)
    ? agentsManifest.public_routes.map((route) => route?.path).filter(Boolean)
    : [],
);

if (!Array.isArray(agentsManifest.public_routes)) {
  fail("public/.well-known/agents.json must expose public_routes");
}

for (const route of expectedManifestRoutes) {
  if (!manifestRoutes.has(route)) {
    fail(`public/.well-known/agents.json is missing public route ${route}`);
  }
}

mustContain("public/.well-known/llms.txt", ["https://hammer.ad/llms.txt"]);

const layout = mustContain("app/layout.tsx", [
  "rootMetadata",
  "buildWebSiteJsonLd",
  "buildPersonJsonLd",
  "<JsonLd",
]);
if (!layout.includes("metadata: rootMetadata") && !layout.includes("metadata = rootMetadata")) {
  fail("app/layout.tsx must export rootMetadata");
}

const home = mustContain("app/page.tsx", [
  "homeMetadata",
  "buildHomePageJsonLd",
  "EntryHall",
  "<JsonLd",
]);
if (/^["']use client["'];/m.test(home)) {
  fail("app/page.tsx must stay server-rendered for metadata and JSON-LD");
}

mustContain("components/EntryHall.tsx", ['"use client"', "HeroWordmark"]);

mustContain("app/about/page.tsx", [
  "aboutMetadata",
  "buildProfilePageJsonLd",
  "buildBreadcrumbJsonLd",
  "<JsonLd",
]);

mustContain("app/contact/page.tsx", [
  "contactMetadata",
  "buildContactPageJsonLd",
  "buildBreadcrumbJsonLd",
  "<JsonLd",
]);

mustContain("app/work/page.tsx", [
  "workMetadata",
  "buildWorkIndexJsonLd",
  "buildBreadcrumbJsonLd",
  "<JsonLd",
]);

mustContain("app/colophon/page.tsx", [
  "colophonMetadata",
  "buildBreadcrumbJsonLd",
  "<JsonLd",
]);

mustContain("app/design-system/layout.tsx", [
  "Metadata",
  "design system · hammer",
  "index: false",
  "follow: false",
  "googleBot",
]);

mustContain("app/work/[slug]/page.tsx", [
  "buildCategoryMetadata",
  "buildCollectionPageJsonLd",
  "buildBreadcrumbJsonLd",
  "<JsonLd",
]);

mustContain("app/work/[slug]/[piece]/page.tsx", [
  "buildPieceMetadata",
  "buildCreativeWorkJsonLd",
  "buildBreadcrumbJsonLd",
  "buildVideoObjectJsonLd",
  "<JsonLd",
]);

const robots = mustContain("app/robots.ts", [
  "AI_CRAWLER_USER_AGENTS",
  "CANONICAL_ORIGIN",
  "sitemap-priority.xml",
]);
if (!robots.includes("sitemap:")) fail("app/robots.ts must expose sitemap");

const sitemap = mustContain("app/sitemap.ts", [
  "SITE_LAST_MODIFIED",
  "getCanonicalUrl",
  "changeFrequency",
]);
if (sitemap.includes("new Date()")) {
  fail("app/sitemap.ts must not use request-time new Date() for lastModified");
}

const prioritySitemap = mustContain("app/sitemap-priority.xml/route.ts", [
  "PRIORITY_SITEMAP_ROUTES",
  "SITE_LAST_MODIFIED",
  "getCanonicalUrl",
  "force-static",
  "application/xml",
  "/work/agents/kira",
  "/work/motion-graphics/reel",
]);
if (prioritySitemap.includes("new Date()") && !prioritySitemap.includes("new Date(SITE_LAST_MODIFIED)")) {
  fail("app/sitemap-priority.xml/route.ts must not use request-time new Date() for lastModified");
}

const indexNowScript = mustContain("scripts/submit-indexnow.mjs", [
  "https://hammer.ad",
  "https://api.indexnow.org/indexnow",
  "keyLocation",
  "urlList",
  "INDEXNOW_KEY_PATH",
]);
const indexNowKey = indexNowScript.match(/const INDEXNOW_KEY = "([^"]+)"/)?.[1];
if (!indexNowKey) {
  fail("scripts/submit-indexnow.mjs must define INDEXNOW_KEY");
} else {
  const indexNowKeyFile = `public/${indexNowKey}.txt`;
  const indexNowKeyText = read(indexNowKeyFile).trim();
  if (indexNowKeyText !== indexNowKey) {
    fail(`${indexNowKeyFile} must contain the IndexNow key`);
  }
}

if (failures.length) {
  console.error("SEO verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("SEO verification passed.");
