import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Markdown } from "@/lib/docs";
import { getMarkdownPage } from "@/lib/markdown-pages";

export const metadata: Metadata = {
  title: "Pricing | BotStopper from Techaro",
  description:
    "BotStopper costs $50 per month via GitHub Sponsors. If you cannot use GitHub Sponsors or the price does not fit, contact us and we will work something out.",
  alternates: {
    canonical: "/pricing",
    types: { "text/markdown": "/pricing.md" },
  },
  openGraph: {
    type: "website",
    url: "/pricing",
    title: "Pricing | BotStopper from Techaro",
    description:
      "BotStopper costs $50 per month via GitHub Sponsors. Contact us if that does not fit your situation.",
  },
};

export default function PricingPage() {
  return (
    <div className="docs-shell">
      <SiteHeader />
      <main className="container page-layout">
        <article className="docs-article">
          <div className="docs-article-top"><span className="eyebrow">BOTSTOPPER FROM TECHARO</span><span className="docs-updated">PRICING</span></div>
          <Markdown source={getMarkdownPage("pricing")} />
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
