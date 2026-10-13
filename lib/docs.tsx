import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";

const docsRoot = path.join(process.cwd(), "content", "docs");

export type DocPage = {
  slug: string;
  title: string;
  content: string;
};

export type DocNavItem = {
  id: string;
  label: string;
  href?: string;
  children: DocNavItem[];
};

function titleFromFilename(filename: string) {
  return filename
    .replace(/\.md$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function readDoc(filePath: string, slug: string): DocPage {
  const source = readFileSync(filePath, "utf8");
  const frontmatter = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/);
  const title = frontmatter?.[1].match(/^title:\s*["']?(.+?)["']?\s*$/m)?.[1]
    ?? source.match(/^#\s+(.+)$/m)?.[1]
    ?? titleFromFilename(path.basename(filePath));

  return {
    slug,
    title,
    content: frontmatter ? source.slice(frontmatter[0].length) : source,
  };
}

function collectDocs(directory = docsRoot, parentSlug = ""): DocPage[] {
  return readdirSync(directory, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name, "en"))
    .flatMap((entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        return collectDocs(entryPath, parentSlug ? `${parentSlug}/${entry.name}` : entry.name);
      }
      if (!entry.isFile() || !entry.name.toLowerCase().endsWith(".md")) return [];

      const basename = entry.name.replace(/\.md$/i, "");
      const slug = basename === "index" ? parentSlug : parentSlug ? `${parentSlug}/${basename}` : basename;
      return [readDoc(entryPath, slug)];
    });
}

export function getDocs() {
  return collectDocs().sort((a, b) => {
    if (!a.slug) return -1;
    if (!b.slug) return 1;
    return a.slug.localeCompare(b.slug, "en");
  });
}

export function getDocNav(): DocNavItem[] {
  const root: DocNavItem[] = [];
  for (const doc of getDocs()) {
    const parts = doc.slug ? doc.slug.split("/") : [];
    let current = root;
    if (parts.length === 0) {
      root.unshift({ id: "root", label: doc.title, href: "/docs", children: [] });
      continue;
    }

    parts.forEach((part, index) => {
      const id = parts.slice(0, index + 1).join("/");
      let item = current.find((candidate) => candidate.id === id);
      if (!item) {
        item = { id, label: titleFromFilename(part), children: [] };
        current.push(item);
      }
      if (index === parts.length - 1) {
        item.label = doc.title;
        item.href = `/docs/${doc.slug}`;
      }
      current = item.children;
    });
  }
  return root;
}

export function getDoc(slug: string[]) {
  const normalized = slug.join("/");
  const doc = getDocs().find((candidate) => candidate.slug === normalized);
  if (!doc) notFound();
  return doc;
}

export function getDocParams() {
  return getDocs().map((doc) => ({ slug: doc.slug ? doc.slug.split("/") : [] }));
}

export function Markdown({ source }: { source: string }) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children, ...props }) => {
            const external = /^https?:/i.test(href ?? "");
            return <a href={href} {...props} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>{children}</a>;
          },
          table: ({ children, ...props }) => <div className="markdown-table-scroll" tabIndex={0} role="region" aria-label="Scrollable table"><table {...props}>{children}</table></div>,
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
