"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import type { DocNavItem } from "@/lib/docs";

function SidebarFolder({ item, pathname, label }: { item: DocNavItem; pathname: string; label: ReactNode }) {
  const folder = `/docs/${item.id}`;
  const [open, setOpen] = useState(pathname === folder || pathname.startsWith(`${folder}/`));

  return (
    <details open={open} onToggle={(event) => setOpen(event.currentTarget.open)}>
      <summary className="docs-nav-summary" style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", padding: "7px 0", listStyle: "none" }}>
        <span aria-hidden="true" style={{ display: "inline-block", fontSize: "10px", transform: open ? "rotate(90deg)" : undefined }}>▸</span>
        {label}
      </summary>
      <SidebarItems items={item.children} pathname={pathname} />
    </details>
  );
}

function SidebarItems({ items, pathname }: { items: DocNavItem[]; pathname: string }) {
  return (
    <ul className="docs-nav-list">
      {items.map((item) => {
        const folderStyle = item.children.length > 0 ? {
          display: "inline",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: ".08em",
          textTransform: "uppercase" as const,
        } : undefined;
        const label = item.href
          ? <Link href={item.href} style={folderStyle} aria-current={pathname === item.href ? "page" : undefined}>{item.label}</Link>
          : <span className="docs-nav-group" style={folderStyle}>{item.label}</span>;
        return (
          <li key={item.id}>
            {item.children.length > 0 ? (
              <SidebarFolder item={item} pathname={pathname} label={label} />
            ) : label}
          </li>
        );
      })}
    </ul>
  );
}

export function DocsSidebar({ items }: { items: DocNavItem[] }) {
  const pathname = usePathname().replace(/\/$/, "");
  // Reset user toggles when navigating, then expand the current page's folders.
  return <SidebarItems key={pathname} items={items} pathname={pathname} />;
}
