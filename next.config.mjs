import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
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
        source: "/work/visual-media/:piece",
        destination: "/work/film-animation/:piece",
        permanent: true,
      },
      {
        source: "/work/agents",
        destination: "/work/agents-digital-twins",
        permanent: true,
      },
      {
        source: "/work/agents/:piece",
        destination: "/work/agents-digital-twins/:piece",
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
    ];
  },
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
