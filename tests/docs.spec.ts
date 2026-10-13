import { expect, test } from "@playwright/test";

test("code blocks hydrate and copy their code", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/docs/installation");
  await expect(page.getByRole("heading", { name: "Installation", exact: true })).toBeVisible();
  const copy = page.getByRole("button", { name: "Copy code", exact: true }).first();
  await expect(copy).toBeVisible();
  await copy.click();
  await expect(copy).toHaveText("Copied");
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(
    "-ghcr.io/techarohq/anubis:latest\n+ghcr.io/techarohq/botstopper/anubis:latest\n",
  );
});

test("documentation links and tables survive the MDX migration", async ({ page }) => {
  await page.goto("/docs");
  await page.locator(".markdown-content").getByRole("link", { name: "Customization", exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/customization$/);
  await expect(page.getByRole("heading", { name: "Customization", exact: true })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Environment variable", exact: true })).toBeVisible();
  await expect(page.getByRole("region", { name: "Scrollable table" })).toHaveCount(2);
  await page.goto("/docs/does-not-exist");
  await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
});

test("clipboard errors offer a manual fallback", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: () => Promise.reject(new Error("Clipboard unavailable")) },
    });
  });
  await page.goto("/docs/installation");
  await page.getByRole("button", { name: "Copy code", exact: true }).first().click();
  await expect(page.getByRole("status").filter({ hasText: "Could not copy" })).toHaveText(
    "Could not copy. Select the code and copy it manually.",
  );
});

test("nested MDX guides retain their Markdown endpoints and agent indexes", async ({ page, request }) => {
  for (const [slug, title] of [["anubis", "What is Anubis?"], ["challenges/soteria", "Soteria"], ["extensions/headless", "Headless browser detection"]]) {
    await page.goto("/docs");
    await page.locator(`.markdown-content a[href="/docs/${slug}"]`).click();
    await expect(page).toHaveURL(`/docs/${slug}`);
    await expect(page.locator(".markdown-content > h1")).toHaveText(title);

    const source = await request.get(`/docs/${slug}.md`);
    expect(source.status()).toBe(200);
    expect(source.headers()["content-type"]).toContain("text/markdown");
    expect(await source.text()).toContain(`# ${title}`);
    const negotiated = await request.get(`/docs/${slug}`, { headers: { Accept: "text/markdown" } });
    expect(await negotiated.text()).toBe(await source.text());
  }
  const index = await request.get("/docs/llms.txt");
  expect(index.status()).toBe(200);
  expect(await index.text()).toContain("/docs/challenges/soteria.md");
  for (const name of ["about", "contact", "pricing", "privacy"]) {
    await page.goto(`/${name}`);
    await expect(page.locator(".markdown-content > h1")).toBeVisible();
  }
});
