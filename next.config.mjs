import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/work/websites/hammathyme",
        destination: "/work/websites/hammer",
        permanent: true,
      },
      {
        source: "/work/animation",
        destination: "/work/film-animation",
        permanent: true,
      },
      {
        source: "/work/animation/:piece",
        destination: "/work/film-animation",
        permanent: true,
      },
      {
        source: "/work/visual-media",
        destination: "/work/film-animation",
        permanent: true,
      },
      {
        source: "/work/visual-media/:piece(the-applicant|animated-short)",
        destination: "/work/film-animation",
        permanent: true,
      },
      {
        source: "/work/visual-media/:piece",
        destination: "/work/film-animation/:piece",
        permanent: true,
      },
      {
        source: "/work/agents",
        destination: "/work",
        permanent: true,
      },
      {
        source: "/work/agents/:piece",
        destination: "/work",
        permanent: true,
      },
      {
        source: "/work/brand-guides/agentify",
        destination: "https://agentify.nexus/brand-bible",
        permanent: true,
      },
      {
        source: "/work/brand-guides/agentify/index.html",
        destination: "https://agentify.nexus/brand-bible",
        permanent: true,
      },
      {
        source: "/work/brand-guides/agentify/BRAND_GUIDE.md",
        destination: "https://agentify.nexus/brand-bible",
        permanent: true,
      },
      {
        source: "/work/brand-systems/effigy",
        destination: "/work/brand-systems",
        permanent: true,
      },
      {
        source: "/work/brand-guides/effigy/:path*",
        destination: "/work/brand-systems",
        permanent: true,
      },
      {
        source: "/work/websites/opencrawl",
        destination: "/work/websites",
        permanent: true,
      },
      {
        source: "/work/agents-digital-twins",
        destination: "/work",
        permanent: true,
      },
      {
        source: "/work/agents-digital-twins/:piece",
        destination: "/work",
        permanent: true,
      },
      {
        source: "/work/film-animation/the-applicant",
        destination: "/work/film-animation",
        permanent: true,
      },
      {
        source: "/work/film-animation/animated-short",
        destination: "/work/film-animation",
        permanent: true,
      },
      {
        source: "/work/motion-graphics/audio-reactive-overlays",
        destination: "/work/motion-graphics",
        permanent: true,
      },
      {
        source: "/work/pipelines-tools/prompt-library",
        destination: "/work/pipelines-tools",
        permanent: true,
      },
      {
        source: "/work/interactive-playable/consistency-lab",
        destination: "/work/interactive-playable",
        permanent: true,
      },
      {
        source: "/work/interactive-playable/talk-to-character",
        destination: "/work/interactive-playable",
        permanent: true,
      },
    ];
  },
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
