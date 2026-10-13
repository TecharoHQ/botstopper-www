import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Markdown } from "@/lib/docs";
import { getMarkdownPage } from "@/lib/markdown-pages";

export const metadata: Metadata = {
  title: "Contact | BotStopper from Techaro",
  description:
    "How to reach the BotStopper team: email for organizational questions, GitHub issue trackers for bugs and features, GitHub Sponsors to fund the work.",
  alternates: {
    canonical: "/contact",
    types: { "text/markdown": "/contact.md" },
  },
  openGraph: {
    type: "website",
    url: "/contact",
    title: "Contact | BotStopper from Techaro",
    description: "How to reach the BotStopper team.",
  },
};

export default function ContactPage() {
  return (
    <div className="docs-shell">
      <SiteHeader />
      <main className="container page-layout">
        <article className="docs-article">
          <div className="docs-article-top"><span className="eyebrow">BOTSTOPPER FROM TECHARO</span><span className="docs-updated">CONTACT</span></div>
          <Markdown source={getMarkdownPage("contact")} />
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
