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
        permanent: false,
      },
    ];
  },
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
