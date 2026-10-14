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
    // Markdown responses supply their own Link header, including a canonical.
    const htmlOnly = [{ type: "header" as const, key: "accept", value: ".*text/markdown.*" }];
    return [
      {
        source: "/",
        missing: htmlOnly,
        headers: [
          {
            key: "Link",
            value: '</sitemap.xml>; rel="sitemap", </index.md>; rel="alternate"; type="text/markdown"',
          },
        ],
      },
      { source: "/docs", missing: htmlOnly, headers: [linkSitemap] },
      { source: "/docs/:path((?!.*\\.md$).*)", missing: htmlOnly, headers: [linkSitemap] },
      { source: "/pricing", missing: htmlOnly, headers: [linkSitemap] },
      { source: "/about", missing: htmlOnly, headers: [linkSitemap] },
      { source: "/contact", missing: htmlOnly, headers: [linkSitemap] },
      { source: "/privacy", missing: htmlOnly, headers: [linkSitemap] },
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
