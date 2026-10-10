import type { Metadata } from "next";
import { hasPieceDetail, type CaseStudy, type Piece } from "@/lib/works";

export type JsonLdObject = Record<string, unknown>;

export const CANONICAL_ORIGIN = "https://hammer.ad";
export const SITE_LAST_MODIFIED = "2026-10-09T00:00:00-07:00";
export const SITE_NAME = "hammer";
export const SITE_TITLE = "hammer · creative technologist";
export const DEFAULT_DESCRIPTION =
  "Jeff Hammer is a creative technologist with ten-plus years on broadcast and agency pipelines. He produces brand systems, agents and digital twins, motion graphics, vfx and cgi, pipelines, film and animation, and websites.";
export const DEFAULT_KEYWORDS = [
  "Creative Technologist",
  "Creative Technologist portfolio",
  "Jeff Hammer",
  "Hammer creative technologist",
  "AI Producer",
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
          alt: "Hammer creative technologist portfolio social card",
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
    "Hammer is Jeff Hammer's creative technologist portfolio: brand systems, agents and digital twins, motion graphics, vfx and cgi, pipelines, film and animation, and websites.",
  path: "/",
  absoluteTitle: true,
  keywords: ["hire creative technologist", "hire AI producer", "creative technologist Los Angeles"],
});

export const aboutMetadata = buildPageMetadata({
  title: "about Jeff Hammer, creative technologist",
  description:
    "Jeff Hammer is a creative technologist with ten-plus years of broadcast, agency, and AI-native production experience.",
  path: "/about",
  openGraphType: "profile",
  keywords: ["Jeff Hammer creative technologist", "broadcast producer AI", "creative producer AI"],
});

export const contactMetadata = buildPageMetadata({
  title: "contact Jeff Hammer",
  description:
    "Contact Jeff Hammer for creative technology work across AI pipelines, brand systems, motion graphics, autonomous characters, and broadcast-grade production.",
  path: "/contact",
  keywords: ["hire creative technologist", "AI producer freelance", "creative technologist contact"],
});

export const workMetadata = buildPageMetadata({
  title: "creative technologist portfolio work",
  description:
    "Explore Hammer's creative technologist portfolio across brand systems, agents and digital twins, motion graphics, vfx and cgi, pipelines, interactive demos, film and animation, and websites.",
  path: "/work",
  keywords: ["creative technologist portfolio", "AI producer portfolio", "AI video portfolio"],
});

export const colophonMetadata = buildPageMetadata({
  title: "colophon",
  description:
    "The Hammer colophon documents the typefaces, build stack, AI models, hosting, source-readable docs, and production materials behind the portfolio site.",
  path: "/colophon",
  keywords: ["Hammer portfolio stack", "creative technologist site build", "Next.js portfolio"],
});

export function buildCategoryMetadata(category: CaseStudy): Metadata {
  return buildPageMetadata({
    title: `${category.title} creative technologist work`,
    description: `${category.summary} Hammer portfolio category for ${category.capabilityLabel} work.`,
    path: `/work/${category.slug}`,
    keywords: [category.title, category.capabilityLabel, category.capability, "creative technologist case studies"],
  });
}

export function buildPieceMetadata(category: CaseStudy, piece: Piece): Metadata {
  const description =
    piece.blurb ??
    `${piece.title} is part of Hammer's ${category.title} portfolio category for creative technologist work.`;

  return buildPageMetadata({
    title: `${piece.title} · ${category.title}`,
    description,
    path: getPiecePath(category, piece),
    keywords: [piece.title, category.title, category.capabilityLabel, "creative technologist case study"],
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
    jobTitle: "Creative Technologist",
    email: "mailto:hammer@hammer.ad",
    description: DEFAULT_DESCRIPTION,
    sameAs: ["https://www.linkedin.com/in/jeff-hammer1985/"],
    areaServed: ["Los Angeles", "New York", "Remote"],
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

export function buildAboutPageJsonLd(): JsonLdObject {
  return {
    "@type": "AboutPage",
    "@id": `${CANONICAL_ORIGIN}/about#webpage`,
    url: getCanonicalUrl("/about"),
    name: "Jeff Hammer - Creative Technologist",
    description: aboutMetadata.description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": PERSON_ID },
    mainEntity: { "@id": PERSON_ID },
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
    name: "Hammer creative technologist portfolio work",
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
        const url = hasPieceDetail(category.slug, piece.slug)
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
    `${piece.title} is part of Hammer's ${category.title} portfolio category for creative technologist work.`;

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
    dateModified: SITE_LAST_MODIFIED,
    creator: { "@id": PERSON_ID },
    author: { "@id": PERSON_ID },
    producer: { "@id": PERSON_ID },
    isPartOf: {
      "@id": `${CANONICAL_ORIGIN}/work/${category.slug}#collection`,
      name: category.title,
    },
    keywords: [piece.title, category.title, category.capabilityLabel, "creative technologist"],
  };
}

export function buildVideoObjectJsonLd(category: CaseStudy, piece: Piece): JsonLdObject | null {
  const pageUrl = getCanonicalUrl(getPiecePath(category, piece));
  if (category.slug === "vfx-cgi" && piece.slug === "environment-swap") {
    return {
      "@type": "VideoObject",
      "@id": `${pageUrl}#video`,
      name: "AI environment swap",
      description:
        piece.blurb ??
        "One first-person driving plate relit into many worlds with the real dashboard preserved, via Runway Aleph 2 video-to-video.",
      thumbnailUrl: [
        getCanonicalUrl("/work/vfx-cgi/environment-swap/environment-swap-poster.jpg"),
      ],
      uploadDate: "2026-06-25T00:00:00-07:00",
      contentUrl: getCanonicalUrl("/work/vfx-cgi/environment-swap/environment-swap-web.mp4"),
      embedUrl: pageUrl,
      creator: { "@id": PERSON_ID },
      publisher: { "@id": PERSON_ID },
    };
  }
  if (category.slug === "film-animation" && piece.slug === "equinox") {
    return {
      "@type": "VideoObject",
      "@id": `${pageUrl}#video`,
      name: "Equinox Question Everything But Yourself campaign spot",
      description:
        piece.blurb ??
        "A 30-second Equinox campaign spot produced with Angry Gods around AI imagery, uncertainty, and the human body.",
      thumbnailUrl: [
        getCanonicalUrl(
          "/work/film-animation/equinox/equinox-question-everything-but-yourself-poster.jpg",
        ),
      ],
      uploadDate: "2026-06-19T00:00:00-07:00",
      contentUrl: getCanonicalUrl(
        "/work/film-animation/equinox/equinox-question-everything-but-yourself.mp4",
      ),
      embedUrl: pageUrl,
      creator: { "@id": PERSON_ID },
      publisher: { "@id": PERSON_ID },
    };
  }

  if (category.slug === "film-animation" && piece.slug === "the-gunfight") {
    return {
      "@type": "VideoObject",
      "@id": `${pageUrl}#video`,
      name: "The Gunfight: AI-native western comedy short",
      description:
        piece.blurb ??
        "A 92-second western comedy short made through the Studioly pipeline with Seedance 2.5 takes and a 35mm print look.",
      thumbnailUrl: [
        getCanonicalUrl("/work/film-animation/the-gunfight/the-gunfight-poster.jpg"),
      ],
      uploadDate: "2026-10-09T00:00:00-07:00",
      duration: "PT1M32S",
      contentUrl: getCanonicalUrl("/work/film-animation/the-gunfight/the-gunfight-web.mp4"),
      embedUrl: pageUrl,
      creator: { "@id": PERSON_ID },
      publisher: { "@id": PERSON_ID },
    };
  }

  if (category.slug === "film-animation" && piece.slug === "the-applicant") {
    return {
      "@type": "VideoObject",
      "@id": `${pageUrl}#video`,
      name: "The Applicant: AI-native short film",
      description:
        piece.blurb ??
        "A one-minute AI-native short made end-to-end through the Studioly pipeline: locked GPT Image 2 frames, Seedance 2.0 takes, native crowd audio.",
      thumbnailUrl: [
        getCanonicalUrl("/work/film-animation/the-applicant/the-applicant-poster.jpg"),
      ],
      uploadDate: "2026-08-26T00:00:00-07:00",
      contentUrl: getCanonicalUrl("/work/film-animation/the-applicant/the-applicant-web.mp4"),
      embedUrl: pageUrl,
      creator: { "@id": PERSON_ID },
      publisher: { "@id": PERSON_ID },
    };
  }

  if (category.slug !== "motion-graphics") return null;

  if (piece.slug === "internet-capital-markets") {
    return {
      "@type": "VideoObject",
      "@id": `${pageUrl}#video`,
      name: "ICM teaser",
      description:
        piece.blurb ??
        "A film teaser package with pixel-title cards, lower thirds, and AI-assisted motion design.",
      thumbnailUrl: [getCanonicalUrl("/work/motion/icm/icm-the-movie-trailer-poster.jpg")],
      uploadDate: "2026-06-09T00:00:00-07:00",
      contentUrl: getCanonicalUrl("/work/motion/icm/icm-the-movie-trailer-web.mp4"),
      embedUrl: pageUrl,
      creator: { "@id": PERSON_ID },
      publisher: { "@id": PERSON_ID },
    };
  }

  if (piece.slug === "audio-reactive-overlays") {
    return {
      "@type": "VideoObject",
      "@id": `${pageUrl}#video`,
      name: "Hammer audio reactive overlays",
      description:
        piece.blurb ??
        "A Remotion overlay driven by energy, band, centroid, and beat analysis.",
      thumbnailUrl: [getCanonicalUrl("/work/motion/audio-reactive/audio-reactive-overlay-poster.png")],
      uploadDate: "2026-05-25T00:00:00-07:00",
      contentUrl: getCanonicalUrl("/work/motion/audio-reactive/audio-reactive-overlay-h264.mp4"),
      embedUrl: pageUrl,
      creator: { "@id": PERSON_ID },
      publisher: { "@id": PERSON_ID },
    };
  }

  if (piece.slug === "spring-health") {
    return {
      "@type": "VideoObject",
      "@id": `${pageUrl}#video`,
      name: "Spring Health motion showcase",
      description:
        piece.blurb ??
        "A HyperFrames showcase translating Spring Health's brand system, product UI, and care-system story into motion.",
      thumbnailUrl: [getCanonicalUrl("/work/motion/spring-health/spring-health-showcase-poster.jpg")],
      uploadDate: "2026-06-19T00:00:00-07:00",
      contentUrl: getCanonicalUrl("/work/motion/spring-health/spring-health-showcase.mp4"),
      embedUrl: pageUrl,
      creator: { "@id": PERSON_ID },
      publisher: { "@id": PERSON_ID },
    };
  }

  if (piece.slug === "spotify-titles") {
    return {
      "@type": "VideoObject",
      "@id": `${pageUrl}#video`,
      name: "Spotify titles: kinetic title sequence",
      description:
        piece.blurb ??
        "A kinetic title sequence for Spotify generated in one text-to-video pass with MiniMax H3.",
      thumbnailUrl: [getCanonicalUrl("/work/motion/spotify-titles/spotify-titles-poster.jpg")],
      uploadDate: "2026-08-03T00:00:00-07:00",
      contentUrl: getCanonicalUrl("/work/motion/spotify-titles/spotify-titles-h3.mp4"),
      embedUrl: pageUrl,
      creator: { "@id": PERSON_ID },
      publisher: { "@id": PERSON_ID },
    };
  }

  if (piece.slug !== "reel") return null;

  return {
    "@type": "VideoObject",
    "@id": `${pageUrl}#video`,
    name: "Hammer motion graphics reel",
    description:
      piece.blurb ??
      "A compact reel of AI motion work: Remotion, HyperFrames, brand identity motion, kinetic type, data motion, particles, and early audio-reactive animation tests.",
    thumbnailUrl: [getCanonicalUrl(SOCIAL_IMAGE_PATH)],
    uploadDate: "2026-05-18T00:00:00-07:00",
    contentUrl: getCanonicalUrl("/work/motion/hammer-reel-v3-web-max-h264.mp4"),
    embedUrl: pageUrl,
    creator: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
  };
}
