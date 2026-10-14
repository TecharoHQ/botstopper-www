import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import { parse as parseYaml } from "yaml";

const docsRoot = path.join(process.cwd(), "content", "docs");

export type DocPage = {
  slug: string;
  title: string;
  description: string;
  file: string;
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
    .replace(/\.mdx$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function frontmatterFromSource(source: string) {
  const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/);
  if (!match) return { content: source, values: {} as Record<string, unknown> };

  const parsed: unknown = parseYaml(match[1]);
  const values = parsed && typeof parsed === "object" && !Array.isArray(parsed)
    ? parsed as Record<string, unknown>
    : {};

  return { content: source.slice(match[0].length), values };
}

export function describeDoc(content: string, maxLength = 160): string {
  let inFence = false;
  for (const line of content.split("\n")) {
    if (line.trim().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const trimmed = line.trim();
    if (!trimmed || /^import\s/.test(trimmed) || /^[#>-]/.test(trimmed)) continue;
    const text = trimmed
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\s+/g, " ");
    return text.length > maxLength ? `${text.slice(0, maxLength - 3).trimEnd()}...` : text;
  }
  return "";
}

function readDoc(filePath: string, slug: string): DocPage {
  const source = readFileSync(filePath, "utf8");
  const { content, values } = frontmatterFromSource(source);
  const title = (typeof values.title === "string" && values.title.trim() ? values.title.trim() : undefined)
    ?? content.match(/^#\s+(.+)$/m)?.[1]
    ?? titleFromFilename(path.basename(filePath));
  const description = (typeof values.description === "string" && values.description.trim() ? values.description.trim() : undefined)
    ?? describeDoc(content);

  return {
    slug,
    title,
    description: description || `${title} documentation.`,
    content,
    file: path.relative(docsRoot, filePath).replace(/\.mdx$/i, "").split(path.sep).join("/"),
  };
}

function collectDocs(directory = "", parentSlug = ""): DocPage[] {
  return readdirSync(path.join(docsRoot, directory), { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name, "en"))
    .flatMap((entry) => {
      const entryPath = path.join(docsRoot, directory, entry.name);
      if (entry.isDirectory()) {
        return collectDocs(path.join(directory, entry.name), parentSlug ? `${parentSlug}/${entry.name}` : entry.name);
      }
      if (!entry.isFile() || !entry.name.endsWith(".mdx")) return [];

      const basename = entry.name.replace(/\.mdx$/i, "");
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
          // react-markdown passes the hast node as a prop; keep it out of
          // the DOM attributes.
          a: ({ href, children, node, ...props }) => {
            const external = /^https?:/i.test(href ?? "");
            // Relative links to the .md twins point agents at the markdown
            // source; humans clicking through the rendered page get HTML.
            const resolved = !external && href?.endsWith(".md") ? href.slice(0, -3) : href;
            return <a href={resolved} {...props} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>{children}</a>;
          },
          table: ({ children, node, ...props }) => <div className="markdown-table-scroll" tabIndex={0} role="region" aria-label="Scrollable table"><table {...props}>{children}</table></div>,
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
