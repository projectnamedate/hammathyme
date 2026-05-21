import type { Metadata } from "next";
import type { CaseStudy, Piece } from "@/lib/works";

export type JsonLdObject = Record<string, unknown>;

export const CANONICAL_ORIGIN = "https://hammer.ad";
export const SITE_LAST_MODIFIED = "2026-05-21";
export const SITE_NAME = "hammer";
export const SITE_TITLE = "hammer · ai producer";
export const DEFAULT_DESCRIPTION =
  "Jeff Hammer is an AI producer with ten-plus years on broadcast and agency pipelines, now producing brand systems, agents, motion graphics, animation, pipelines, visual media, and websites.";
export const DEFAULT_KEYWORDS = [
  "AI Producer",
  "AI Creative Producer",
  "AI Video Producer",
  "Jeff Hammer",
  "Hammer AI Producer",
  "AI producer portfolio",
  "autonomous AI characters",
  "AI motion graphics",
  "AI video pipeline producer",
];

export const AI_CRAWLER_USER_AGENTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "ClaudeBot",
  "PerplexityBot",
  "Google-Extended",
  "CCBot",
];

const SOCIAL_IMAGE_PATH = "/opengraph-image";
const PERSON_ID = `${CANONICAL_ORIGIN}/about#jeff-hammer`;
const WEBSITE_ID = `${CANONICAL_ORIGIN}/#website`;

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  keywords?: string[];
  openGraphType?: "website" | "profile";
};

type BreadcrumbItem = {
  name: string;
  path: string;
};

function normalizePath(path: string): string {
  if (!path || path === "/") return "";
  return path.startsWith("/") ? path : `/${path}`;
}

function formatPageTitle(title: string, absoluteTitle = false): string {
  return absoluteTitle ? title : `${title} · ${SITE_NAME}`;
}

export function getCanonicalUrl(path = ""): string {
  return `${CANONICAL_ORIGIN}${normalizePath(path)}`;
}

export function getPiecePath(category: CaseStudy, piece: Piece): string {
  return `/work/${category.slug}/${piece.slug}`;
}

export function buildPageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  keywords = [],
  openGraphType = "website",
}: PageMetadataInput): Metadata {
  const canonicalUrl = getCanonicalUrl(path);
  const socialImageUrl = getCanonicalUrl(SOCIAL_IMAGE_PATH);
  const fullTitle = formatPageTitle(title, absoluteTitle);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: [...DEFAULT_KEYWORDS, ...keywords],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-US": canonicalUrl,
      },
    },
    openGraph: {
      type: openGraphType,
      url: canonicalUrl,
      title: fullTitle,
      description,
      siteName: SITE_TITLE,
      locale: "en_US",
      images: [
        {
          url: socialImageUrl,
          width: 1200,
          height: 630,
          alt: "Hammer AI producer portfolio social card",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [socialImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export const rootMetadata: Metadata = {
  ...buildPageMetadata({
    title: SITE_TITLE,
    description: DEFAULT_DESCRIPTION,
    path: "/",
    absoluteTitle: true,
  }),
  title: {
    default: SITE_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  metadataBase: new URL(CANONICAL_ORIGIN),
  applicationName: SITE_NAME,
  authors: [{ name: "Jeff Hammer", url: getCanonicalUrl("/about") }],
  creator: "Jeff Hammer",
  publisher: "Jeff Hammer",
  category: "portfolio",
  icons: {
    icon: "/brand/icon.svg",
    apple: "/brand/icon.svg",
  },
};

export const homeMetadata = buildPageMetadata({
  title: SITE_TITLE,
  description:
    "Hammer is Jeff Hammer's AI producer portfolio: brand systems, autonomous characters, motion graphics, animation, pipelines, visual media, and websites.",
  path: "/",
  absoluteTitle: true,
  keywords: ["hire AI producer", "AI producer Los Angeles", "AI producer New York"],
});

export const aboutMetadata = buildPageMetadata({
  title: "about Jeff Hammer, AI producer",
  description:
    "Jeff Hammer is an AI producer with broadcast, agency, and AI-native production experience across Comcast, Discovery, Tribune Media, and independent Hammer work.",
  path: "/about",
  openGraphType: "profile",
  keywords: ["Jeff Hammer AI producer", "broadcast producer AI", "creative producer AI"],
});

export const contactMetadata = buildPageMetadata({
  title: "contact Jeff Hammer",
  description:
    "Contact Jeff Hammer for AI producer work across AI pipelines, brand systems, motion graphics, autonomous characters, and broadcast-grade production.",
  path: "/contact",
  keywords: ["hire AI producer", "AI producer freelance", "AI producer contact"],
});

export const workMetadata = buildPageMetadata({
  title: "AI producer portfolio work",
  description:
    "Explore Hammer's AI producer portfolio across brand systems, agents, motion graphics, animation, pipelines, interactive demos, visual media, and websites.",
  path: "/work",
  keywords: ["AI producer portfolio", "AI creative producer portfolio", "AI video portfolio"],
});

export const colophonMetadata = buildPageMetadata({
  title: "colophon",
  description:
    "The Hammer colophon documents the typefaces, build stack, AI models, hosting, source-readable docs, and production materials behind the portfolio site.",
  path: "/colophon",
  keywords: ["Hammer portfolio stack", "AI producer site build", "Next.js portfolio"],
});

export function buildCategoryMetadata(category: CaseStudy): Metadata {
  return buildPageMetadata({
    title: `${category.title} AI producer work`,
    description: `${category.summary} Hammer portfolio category for ${category.capabilityLabel} work.`,
    path: `/work/${category.slug}`,
    keywords: [category.title, category.capabilityLabel, category.capability, "AI producer case studies"],
  });
}

export function buildPieceMetadata(category: CaseStudy, piece: Piece): Metadata {
  const description =
    piece.blurb ??
    `${piece.title} is part of Hammer's ${category.title} portfolio category for AI producer work.`;

  return buildPageMetadata({
    title: `${piece.title} · ${category.title}`,
    description,
    path: getPiecePath(category, piece),
    keywords: [piece.title, category.title, category.capabilityLabel, "AI producer case study"],
  });
}

export function buildPersonJsonLd(): JsonLdObject {
  return {
    "@id": PERSON_ID,
    "@type": "Person",
    name: "Jeff Hammer",
    alternateName: ["Hammer", "hammer"],
    url: getCanonicalUrl("/about"),
    image: getCanonicalUrl(SOCIAL_IMAGE_PATH),
    jobTitle: "AI Producer",
    email: "mailto:jeff@projectname.date",
    description: DEFAULT_DESCRIPTION,
    sameAs: ["https://www.linkedin.com/in/jeff-hammer1985/"],
    knowsAbout: [
      "AI video production",
      "AI creative production",
      "autonomous AI characters",
      "motion graphics",
      "brand systems",
      "prompt libraries",
      "broadcast production",
      "production pipelines",
      "AI websites",
    ],
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
      url: CANONICAL_ORIGIN,
    },
  };
}

export function buildWebSiteJsonLd(): JsonLdObject {
  return {
    "@id": WEBSITE_ID,
    "@type": "WebSite",
    name: SITE_TITLE,
    alternateName: SITE_NAME,
    url: CANONICAL_ORIGIN,
    inLanguage: "en-US",
    description: DEFAULT_DESCRIPTION,
    creator: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
  };
}

export function buildHomePageJsonLd(): JsonLdObject {
  return {
    "@type": "WebPage",
    "@id": `${CANONICAL_ORIGIN}/#webpage`,
    url: CANONICAL_ORIGIN,
    name: SITE_TITLE,
    description: homeMetadata.description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": PERSON_ID },
    primaryImageOfPage: getCanonicalUrl(SOCIAL_IMAGE_PATH),
    dateModified: SITE_LAST_MODIFIED,
  };
}

export function buildProfilePageJsonLd(): JsonLdObject {
  return {
    "@type": "ProfilePage",
    "@id": `${CANONICAL_ORIGIN}/about#profile`,
    url: getCanonicalUrl("/about"),
    name: "Jeff Hammer - AI Producer",
    description: aboutMetadata.description,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: { "@id": PERSON_ID },
    dateCreated: "2026-05-03",
    dateModified: SITE_LAST_MODIFIED,
  };
}

export function buildContactPageJsonLd(): JsonLdObject {
  return {
    "@type": "ContactPage",
    "@id": `${CANONICAL_ORIGIN}/contact#webpage`,
    url: getCanonicalUrl("/contact"),
    name: "Contact Jeff Hammer",
    description: contactMetadata.description,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: { "@id": PERSON_ID },
    dateModified: SITE_LAST_MODIFIED,
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]): JsonLdObject {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getCanonicalUrl(item.path),
    })),
  };
}

export function buildWorkIndexJsonLd(categories: CaseStudy[]): JsonLdObject {
  return {
    "@type": "CollectionPage",
    "@id": `${CANONICAL_ORIGIN}/work#collection`,
    url: getCanonicalUrl("/work"),
    name: "Hammer AI producer portfolio work",
    description: workMetadata.description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": PERSON_ID },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: categories.map((category, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: category.title,
        url: getCanonicalUrl(`/work/${category.slug}`),
      })),
    },
    dateModified: SITE_LAST_MODIFIED,
  };
}

export function buildCollectionPageJsonLd(category: CaseStudy): JsonLdObject {
  return {
    "@type": "CollectionPage",
    "@id": `${CANONICAL_ORIGIN}/work/${category.slug}#collection`,
    url: getCanonicalUrl(`/work/${category.slug}`),
    name: `${category.title} - Hammer portfolio`,
    description: category.summary,
    isPartOf: { "@id": WEBSITE_ID },
    about: [category.capabilityLabel, { "@id": PERSON_ID }],
    mainEntity: {
      "@type": "ItemList",
      itemListElement: category.pieces.map((piece, index) => {
        const url =
          piece.status === "live"
            ? getCanonicalUrl(getPiecePath(category, piece))
            : getCanonicalUrl(`/work/${category.slug}#${piece.slug}`);
        return {
          "@type": "ListItem",
          position: index + 1,
          name: piece.title,
          url,
        };
      }),
    },
    dateModified: SITE_LAST_MODIFIED,
  };
}

export function buildCreativeWorkJsonLd(category: CaseStudy, piece: Piece): JsonLdObject {
  const url = getCanonicalUrl(getPiecePath(category, piece));
  const description =
    piece.blurb ??
    `${piece.title} is part of Hammer's ${category.title} portfolio category for AI producer work.`;

  return {
    "@type": "CreativeWork",
    "@id": `${url}#creative-work`,
    url,
    name: piece.title,
    headline: piece.title,
    description,
    genre: category.capabilityLabel,
    creativeWorkStatus: piece.status,
    inLanguage: "en-US",
    datePublished: "2026-05-13",
    dateModified: SITE_LAST_MODIFIED,
    creator: { "@id": PERSON_ID },
    author: { "@id": PERSON_ID },
    producer: { "@id": PERSON_ID },
    isPartOf: {
      "@id": `${CANONICAL_ORIGIN}/work/${category.slug}#collection`,
      name: category.title,
    },
    keywords: [piece.title, category.title, category.capabilityLabel, "AI producer"],
  };
}

export function buildVideoObjectJsonLd(category: CaseStudy, piece: Piece): JsonLdObject | null {
  if (category.slug !== "motion-graphics" || piece.slug !== "reel") return null;

  const pageUrl = getCanonicalUrl(getPiecePath(category, piece));
  return {
    "@type": "VideoObject",
    "@id": `${pageUrl}#video`,
    name: "Hammer motion graphics reel",
    description:
      piece.blurb ??
      "A compact reel of AI motion work: Remotion, HyperFrames, brand identity motion, kinetic type, data motion, particles, and early audio-reactive animation tests.",
    thumbnailUrl: [getCanonicalUrl(SOCIAL_IMAGE_PATH)],
    uploadDate: "2026-05-18",
    contentUrl: getCanonicalUrl("/work/motion/hammer-reel-v3-web-max-h264.mp4"),
    embedUrl: pageUrl,
    creator: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
  };
}
