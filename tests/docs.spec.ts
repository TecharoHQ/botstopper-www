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
  for (const [slug, title] of [["introduction", "What is BotStopper?"], ["challenges/soteria", "Soteria"], ["extensions/headless", "Headless browser detection"]]) {
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

test("Soteria explains its four sample lanes and respects motion preferences", async ({ page, request }) => {
  const runtimeErrors: Error[] = [];
  page.on("pageerror", (error) => runtimeErrors.push(error));

  const response = await request.get("/docs/challenges/soteria");
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain("Illustrative sample data, not a live challenge.");
  expect(html).toContain("10000000");

  await page.goto("/docs/challenges/soteria");
  const lanes = page.locator(".soteria-lanes");
  await expect(lanes.locator(":scope > li")).toHaveCount(4);
  await expect(lanes).toHaveAttribute("data-frame", "0");
  await expect(page.getByRole("meter")).toHaveCount(4);
  await expect(page.getByText("Leading zero bits").first()).toBeVisible();

  await expect(lanes).toHaveAttribute("data-frame", "1", { timeout: 3000 });
  await expect(page.getByText("Solution").first()).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(lanes).toHaveAttribute("data-frame", "0");
  await page.waitForTimeout(1800);
  await expect(lanes).toHaveAttribute("data-frame", "0");

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(lanes).toHaveAttribute("data-frame", "1", { timeout: 3000 });
  await page.setViewportSize({ width: 375, height: 812 });
  const hasNoVisualizerOverflow = await page.locator(".soteria-lane-visualizer").evaluate((element) => element.scrollWidth <= element.clientWidth);
  expect(hasNoVisualizerOverflow).toBe(true);
  const mobileColumns = await lanes.evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);
  expect(mobileColumns).toBe(1);

  await page.goto("/docs");
  expect(runtimeErrors).toEqual([]);
});
