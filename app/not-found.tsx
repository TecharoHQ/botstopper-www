import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export default function NotFound() {
  return (
    <div className="docs-shell">
      <SiteHeader />
      <main className="container page-layout">
        <article className="docs-article">
          <div className="docs-article-top"><span className="eyebrow">BOTSTOPPER FROM TECHARO</span><span className="docs-updated">404</span></div>
          <div className="markdown-content">
            <h1>404: Page not found</h1>
            <p>There is no page at this address.</p>
            <ul>
              <li><Link href="/">Back to the homepage</Link></li>
              <li><Link href="/docs">Read the documentation</Link></li>
              <li><a href="/llms.txt">Machine-readable site index (llms.txt)</a></li>
            </ul>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
