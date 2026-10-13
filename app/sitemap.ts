import type { MetadataRoute } from "next";
import { getDocParams } from "@/lib/docs";

const base = "https://botstopper.net";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: base, priority: 1, changeFrequency: "weekly" },
    { url: `${base}/docs`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${base}/pricing`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${base}/about`, priority: 0.5, changeFrequency: "yearly" },
    { url: `${base}/contact`, priority: 0.5, changeFrequency: "yearly" },
    { url: `${base}/privacy`, priority: 0.3, changeFrequency: "yearly" },
  ];
  for (const { slug } of getDocParams()) {
    pages.push({
      url: `${base}/docs${slug.length ? `/${slug.join("/")}` : ""}`,
      priority: 0.7,
      changeFrequency: "weekly",
    });
  }
  return pages;
}
