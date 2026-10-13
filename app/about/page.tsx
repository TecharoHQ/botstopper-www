import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Markdown } from "@/lib/docs";
import { getMarkdownPage } from "@/lib/markdown-pages";

export const metadata: Metadata = {
  title: "About | BotStopper from Techaro",
  description:
    "BotStopper is made by Techaro, the team behind Anubis. Open source roots, calmer defaults, and documentation a team can deploy from.",
  alternates: {
    canonical: "/about",
    types: { "text/markdown": "/about.md" },
  },
  openGraph: {
    type: "website",
    url: "/about",
    title: "About | BotStopper from Techaro",
    description: "BotStopper is made by Techaro, the team behind Anubis.",
  },
};

export default function AboutPage() {
  return (
    <div className="docs-shell">
      <SiteHeader />
      <main className="container page-layout">
        <article className="docs-article">
          <div className="docs-article-top"><span className="eyebrow">BOTSTOPPER FROM TECHARO</span><span className="docs-updated">ABOUT</span></div>
          <Markdown source={getMarkdownPage("about")} />
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
