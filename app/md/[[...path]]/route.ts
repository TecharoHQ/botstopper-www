import { getDocParams, getDocs } from "@/lib/docs";
import { buildLlmsIndex } from "@/lib/llms";
import { getMarkdownPage, isMarkdownPageName } from "@/lib/markdown-pages";

const markdownHeaders = {
  "Content-Type": "text/markdown; charset=utf-8",
  Vary: "Accept",
};

const canonicalBase = "https://botstopper.net";

function canonicalPath(path: string[]): string {
  if (path.length === 0) return "/";

  const [head, ...rest] = path;
  if (head === "llms" && rest.length === 0) return "/llms.txt";
  if (head === "docs") {
    const parts = [...rest];
    if (parts.at(-1) === "index") parts.pop();
    return parts.length ? `/docs/${parts.join("/")}` : "/docs";
  }
  if (rest.length === 0 && isMarkdownPageName(head)) {
    return head === "index" ? "/" : `/${head}`;
  }
  return "/";
}

const notFoundBody = [
  "# 404: Not found",
  "",
  "There is no page at this address on botstopper.net.",
  "",
  "- Documentation index for agents: https://botstopper.net/docs/llms.txt",
  "- Site index: https://botstopper.net/llms.txt",
  "- Rendered documentation: https://botstopper.net/docs",
  "- Homepage: https://botstopper.net/",
  "",
  "If you followed a link here, it may be stale.",
  "",
].join("\n");

export function generateStaticParams() {
  const paths: { path: string[] }[] = [
    { path: [] },
    { path: ["llms"] },
    { path: ["pricing"] },
    { path: ["about"] },
    { path: ["contact"] },
    { path: ["privacy"] },
  ];
  for (const { slug } of getDocParams()) {
    paths.push({ path: slug.length ? ["docs", ...slug] : ["docs"] });
  }
  return paths;
}

function resolve(path: string[]): string | null {
  if (path.length === 0) return getMarkdownPage("index");

  const [head, ...rest] = path;
  if (head === "llms" && rest.length === 0) return buildLlmsIndex();
  if (rest.length === 0 && isMarkdownPageName(head)) return getMarkdownPage(head);

  if (head === "docs") {
    // /docs/index and /docs mean the same doc: slug "".
    let parts = rest;
    if (parts.length > 0 && parts[parts.length - 1] === "index") {
      parts = parts.slice(0, -1);
    }
    const doc = getDocs().find((candidate) => candidate.slug === parts.join("/"));
    return doc ? doc.content : null;
  }

  return null;
}

export async function GET(_request: Request, { params }: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await params;
  const body = resolve(path);
  if (body === null) {
    return new Response(notFoundBody, { status: 404, headers: markdownHeaders });
  }
  const headers = new Headers(markdownHeaders);
  headers.set("Link", `<${canonicalBase}${canonicalPath(path)}>; rel="canonical"`);
  return new Response(body, { headers });
}
