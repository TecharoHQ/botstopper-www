import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-frontmatter", "remark-gfm"],
    rehypePlugins: [
      ["rehype-mermaid", { strategy: "pre-mermaid" }],
      ["rehype-pretty-code", { theme: "github-dark", keepBackground: false, bypassInlineCode: true }],
    ],
  },
});

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingIncludes: {
    "/docs/**": ["./content/docs/**/*.mdx"],
    "/social/docs/**": ["./content/docs/**/*.mdx"],
    "/md/**": ["./content/**/*.md", "./content/docs/**/*.mdx"],
    "/llms.txt": ["./content/docs/**/*.mdx"],
  },
  redirects() {
    return [
      { source: "/docs/introduction", destination: "/docs", permanent: true },
      { source: "/docs/introduction.md", destination: "/docs.md", permanent: true },
    ];
  },
  async headers() {
    // RFC 8288: advertise the sitemap and the markdown twin of each page.
    // (Vary: Accept on HTML responses is not set here because Next.js
    // manages the Vary header on document responses itself; the markdown
    // route handler sets Vary: Accept on its own responses.)
    const linkSitemap = { key: "Link", value: '</sitemap.xml>; rel="sitemap"' };
    return [
      {
        source: "/",
        headers: [
          {
            key: "Link",
            value: '</sitemap.xml>; rel="sitemap", </index.md>; rel="alternate"; type="text/markdown"',
          },
        ],
      },
      { source: "/docs", headers: [linkSitemap] },
      { source: "/docs/:path*", headers: [linkSitemap] },
      { source: "/pricing", headers: [linkSitemap] },
      { source: "/about", headers: [linkSitemap] },
      { source: "/contact", headers: [linkSitemap] },
      { source: "/privacy", headers: [linkSitemap] },
    ];
  },
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
