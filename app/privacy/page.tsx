import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Markdown } from "@/lib/docs";
import { getMarkdownPage } from "@/lib/markdown-pages";

export const metadata: Metadata = {
  title: "Privacy | BotStopper from Techaro",
  description:
    "What botstopper.net does with your data: static pages, no tracking cookies, no third-party analytics, no advertising. Standard server logs only.",
  alternates: {
    canonical: "/privacy",
    types: { "text/markdown": "/privacy.md" },
  },
  openGraph: {
    type: "website",
    url: "/privacy",
    title: "Privacy | BotStopper from Techaro",
    description: "What the botstopper.net website does with your data.",
  },
};

export default function PrivacyPage() {
  return (
    <div className="docs-shell">
      <SiteHeader />
      <main className="container page-layout">
        <article className="docs-article">
          <div className="docs-article-top"><span className="eyebrow">BOTSTOPPER FROM TECHARO</span><span className="docs-updated">PRIVACY</span></div>
          <Markdown source={getMarkdownPage("privacy")} />
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
