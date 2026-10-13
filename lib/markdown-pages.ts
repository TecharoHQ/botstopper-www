import { readFileSync } from "node:fs";
import path from "node:path";

const contentRoot = path.join(process.cwd(), "content");

const pageNames = ["index", "pricing", "about", "contact", "privacy"] as const;

export type MarkdownPageName = (typeof pageNames)[number];

export function isMarkdownPageName(name: string): name is MarkdownPageName {
  return (pageNames as readonly string[]).includes(name);
}

export function getMarkdownPage(name: MarkdownPageName): string {
  return readFileSync(path.join(contentRoot, `${name}.md`), "utf8");
}

export function getMarkdownPageNames(): readonly MarkdownPageName[] {
  return pageNames;
}
