import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { getDocNav, type DocNavItem } from "@/lib/docs";

function SidebarItems({ items }: { items: DocNavItem[] }) {
  return (
    <ul className="docs-nav-list">
      {items.map((item) => (
        <li key={item.id}>
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span className="docs-nav-group">{item.label}</span>}
          {item.children.length > 0 && <SidebarItems items={item.children} />}
        </li>
      ))}
    </ul>
  );
}

export default function DocsLayout({ children }: { children: ReactNode }) {
  const items = getDocNav();
  return (
    <div className="docs-shell">
      <header className="docs-header">
        <div className="container docs-header-inner">
          <Link className="brand" href="/" aria-label="BotStopper from Techaro home">
            <Image src="/botstopper-mark.svg" alt="" width={40} height={40} />
            <span className="brand-copy"><strong>BotStopper</strong><small>from Techaro</small></span>
          </Link>
          <nav aria-label="Main navigation"><Link href="/#platform">Platform</Link><Link href="/#features">Features</Link><Link className="active" href="/docs">Documentation</Link></nav>
          <a className="header-cta" href="http://github.com/sponsors/Xe" target="_blank" rel="noreferrer">Support the project <span aria-hidden="true">↗</span></a>
        </div>
      </header>
      <div className="docs-layout container">
        <aside className="docs-sidebar" aria-label="Documentation navigation">
          <p className="docs-sidebar-label">DOCUMENTATION</p>
          <SidebarItems items={items} />
          <div className="docs-sidebar-callout"><span className="callout-spark">✳</span><p>Built for the open web.</p><a href="http://github.com/sponsors/Xe" target="_blank" rel="noreferrer">Support the work ↗</a></div>
        </aside>
        <main className="docs-main">{children}</main>
      </div>
    </div>
  );
}
