import { readdirSync } from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";

function docRoutes(directory = path.join(process.cwd(), "content", "docs"), segments: string[] = []): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) return docRoutes(path.join(directory, entry.name), [...segments, entry.name]);
    if (!entry.name.endsWith(".mdx")) return [];
    const name = entry.name.slice(0, -4);
    return [`/docs${[...segments, ...(name === "index" ? [] : [name])].map((segment) => `/${segment}`).join("")}`];
  });
}

const routes = docRoutes();
const runtimeErrors = new WeakMap<Page, string[]>();

test.beforeEach(({ page }) => {
  const errors: string[] = [];
  runtimeErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
});

test.afterEach(({ page }) => {
  expect(runtimeErrors.get(page)).toEqual([]);
});

for (const route of routes) {
  test(`documentation loads: ${route}`, async ({ page }) => {
    const response = await page.goto(route, { waitUntil: "networkidle" });
    expect(response?.status()).toBe(200);
    await expect(page.locator(".docs-article .markdown-content > h1:visible")).toBeVisible();
    await expect(page.locator(".docs-sidebar")).toBeVisible();
  });
}

for (const route of ["/", "/about", "/contact", "/pricing", "/privacy"]) {
  test(`public page loads: ${route}`, async ({ page }) => {
    const response = await page.goto(route, { waitUntil: "networkidle" });
    expect(response?.status()).toBe(200);
    await expect(page.locator("main")).toBeVisible();
  });
}

test("code blocks copy the displayed code", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/docs/installation", { waitUntil: "networkidle" });
  const block = page.locator(".docs-code-block").first();
  const source = await block.locator("pre").textContent();
  expect(source).toMatch(/\S/);
  await block.getByRole("button").click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(source);
});

test("clipboard errors leave readable code and a status message", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: () => Promise.reject(new Error("Clipboard unavailable")) },
    });
  });
  await page.goto("/docs/installation", { waitUntil: "networkidle" });
  const block = page.locator(".docs-code-block").first();
  await block.getByRole("button").click();
  await expect(block.getByRole("status")).toHaveText(/\S/);
  await expect(block.locator("pre")).toBeVisible();
});

test("sidebar links load pages with rendered tables", async ({ page }) => {
  await page.goto("/docs", { waitUntil: "networkidle" });
  await page.locator('.docs-sidebar a[href="/docs/customization"]').click();
  await expect(page).toHaveURL(/\/docs\/customization$/);
  await expect(page.locator(".markdown-content table").first()).toBeVisible();
});

test("Markdown endpoints and agent indexes load", async ({ request }) => {
  for (const route of routes) {
    const source = await request.get(`${route}.md`);
    expect(source.status(), route).toBe(200);
    expect(source.headers()["content-type"]).toContain("text/markdown");
    const content = await source.text();
    expect(content, route).toMatch(/^#\s/m);
    const negotiated = await request.get(route, { headers: { Accept: "text/markdown" } });
    expect(await negotiated.text(), route).toBe(content);
  }
  const index = await request.get("/docs/llms.txt");
  expect(index.status()).toBe(200);
  expect(await index.text()).toContain("/docs/");
  const missing = await request.get("/docs/does-not-exist.md");
  expect(missing.status()).toBe(404);
});

test("nested pages expand their sidebar folder", async ({ page }) => {
  await page.goto("/docs/installation/native-install", { waitUntil: "networkidle" });
  const link = page.locator('.docs-sidebar a[href="/docs/installation/native-install"]');
  await expect(link).toBeVisible();
  expect(await link.evaluate((element) => element.closest("details")?.open)).toBe(true);
});

test("Mermaid diagrams and highlighted code load", async ({ page }) => {
  await page.goto("/docs/configuration/redirect-domains", { waitUntil: "networkidle" });
  await expect(page.locator(".mermaid-diagram svg").first()).toBeVisible();
  await expect(page.locator("pre code span[style*='color']").first()).toBeVisible();
});

test("Soteria visualizer loads on desktop and mobile", async ({ page }) => {
  await page.goto("/docs/challenges/soteria", { waitUntil: "networkidle" });
  await expect(page.locator(".soteria-lane-visualizer")).toBeVisible();
  await expect(page.getByRole("meter").first()).toBeVisible();
  await page.setViewportSize({ width: 375, height: 812 });
  const fits = await page.locator(".soteria-lane-visualizer").evaluate((element) => element.scrollWidth <= element.clientWidth);
  expect(fits).toBe(true);
});
