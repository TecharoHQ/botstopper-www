import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-frontmatter", "remark-gfm"],
  },
});

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingIncludes: {
    "/docs/**": ["./content/docs/**/*.mdx"],
    "/social/docs/**": ["./content/docs/**/*.mdx"],
  },
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

export default withMDX(nextConfig);
