import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  redirects() {
    return [
      {
        source: "/docs/customization.md",
        destination: "/docs/customization",
        permanent: true,
      },
    ];
  },
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
