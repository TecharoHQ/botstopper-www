import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { expect, test } from "@playwright/test";

function documents(directory = path.join(process.cwd(), "content", "docs"), segments: string[] = []): { route: string; title: string; description: string }[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) return documents(path.join(directory, entry.name), [...segments, entry.name]);
    if (!entry.name.endsWith(".mdx")) return [];
    const source = readFileSync(path.join(directory, entry.name), "utf8");
    const frontmatter = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
    const metadata = frontmatter ? parse(frontmatter[1]) : {};
    const name = entry.name.slice(0, -4);
    const slug = [...segments, ...(name === "index" ? [] : [name])].join("/");
    return [{ route: `/docs${slug ? `/${slug}` : ""}`, title: metadata.title, description: metadata.description }];
  });
}

const docs = documents();

for (const { route, title, description } of docs) {
  test(`frontmatter drives SEO metadata: ${route}`, async ({ page, request }) => {
    expect(title).toEqual(expect.any(String));
    expect(description).toEqual(expect.any(String));
    expect(description.trim()).not.toBe("");
    await page.goto(route);
    const fullTitle = `${title} | BotStopper documentation`;
    await expect(page).toHaveTitle(fullTitle);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", description);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", fullTitle);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute("content", description);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", `https://botstopper.net${route}`);
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "website");
    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute("content", "BotStopper from Techaro");
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", fullTitle);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute("content", description);
    const socialRoute = `/social${route}`;
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", `https://botstopper.net${socialRoute}`);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://botstopper.net${route}`);
    const image = await request.get(socialRoute);
    expect(image.status()).toBe(200);
    expect(image.headers()["content-type"]).toContain("image/png");
  });
}

test("agent indexes use every document's frontmatter description", async ({ request }) => {
  for (const route of ["/llms.txt", "/docs/llms.txt"]) {
    const response = await request.get(route);
    expect(response.status()).toBe(200);
    const body = await response.text();
    for (const doc of docs) {
      expect(body).toContain(`[${doc.title}](https://botstopper.net${doc.route}.md): ${doc.description}`);
    }
  }
});
