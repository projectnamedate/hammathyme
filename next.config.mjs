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
