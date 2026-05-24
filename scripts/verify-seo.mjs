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

const packageJson = JSON.parse(read("package.json") || "{}");
if (packageJson.scripts?.["verify:seo"] !== "node scripts/verify-seo.mjs") {
  fail("package.json must expose npm run verify:seo");
}
if (packageJson.scripts?.["submit:indexnow"] !== "node scripts/submit-indexnow.mjs") {
  fail("package.json must expose npm run submit:indexnow");
}

mustContain("lib/seo.ts", [
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
