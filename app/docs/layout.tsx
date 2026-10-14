import { Suspense } from "react";
import type { ReactNode } from "react";
import { getDocNav } from "@/lib/docs";
import { SiteHeader } from "@/components/site-chrome";
import { DocsSidebar } from "@/components/docs/sidebar";

export default function DocsLayout({ children }: { children: ReactNode }) {
  const items = getDocNav();
  return (
    <div className="docs-shell">
      <SiteHeader variant="docs" />
      <div className="docs-layout container">
        <aside className="docs-sidebar" aria-label="Documentation navigation">
          <p className="docs-sidebar-label">DOCUMENTATION</p>
          <Suspense fallback={<p role="status">Loading navigation...</p>}>
            <DocsSidebar items={items} />
          </Suspense>
          <div className="docs-sidebar-callout"><span className="callout-spark">✳</span><p>Built for the open web.</p><a href="http://github.com/sponsors/Xe" target="_blank" rel="noreferrer">Support the work ↗</a></div>
        </aside>
        <main className="docs-main">{children}</main>
      </div>
    </div>
  );
}
