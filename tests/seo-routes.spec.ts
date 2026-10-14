import { expect, test } from "@playwright/test";

test("Markdown aliases advertise the canonical HTML page", async ({ request }) => {
  const aliases = [
    ["/index.md", "https://botstopper.net/"],
    ["/docs/index.md", "https://botstopper.net/docs"],
    ["/docs/extensions/headless/index.md", "https://botstopper.net/docs/extensions/headless"],
    ["/md", "https://botstopper.net/"],
    ["/md/index", "https://botstopper.net/"],
    ["/md/docs", "https://botstopper.net/docs"],
    ["/md/docs/index", "https://botstopper.net/docs"],
    ["/md/docs/extensions/headless/index", "https://botstopper.net/docs/extensions/headless"],
    ["/md/docs/extensions/headless", "https://botstopper.net/docs/extensions/headless"],
    ["/md/pricing", "https://botstopper.net/pricing"],
    ["/md/llms", "https://botstopper.net/llms.txt"],
  ];

  for (const [path, canonical] of aliases) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(response.headers()["content-type"], path).toContain("text/markdown");
    expect(response.headers().vary?.split(",").map((value) => value.trim()), path).toContain("Accept");
    expect(response.headers().link, path).toContain(`<${canonical}>; rel="canonical"`);
  }

  for (const [path, canonical] of [
    ["/", "https://botstopper.net/"],
    ["/docs", "https://botstopper.net/docs"],
    ["/docs/extensions/headless", "https://botstopper.net/docs/extensions/headless"],
  ]) {
    const response = await request.get(path, { headers: { Accept: "text/markdown" } });
    expect(response.status(), path).toBe(200);
    expect(response.headers()["content-type"], path).toContain("text/markdown");
    expect(response.headers().vary?.split(",").map((value) => value.trim()), path).toContain("Accept");
    expect(response.headers().link, path).toContain(`<${canonical}>; rel="canonical"`);
  }

  const missing = await request.get("/md/docs/not-a-page");
  expect(missing.status()).toBe(404);
  expect(missing.headers().link).toBeUndefined();
});

test("sitemap lists the documentation root once", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  const sitemap = await response.text();
  expect(sitemap.match(/https:\/\/botstopper\.net\/docs(?:<|<\/loc>)/g)).toHaveLength(1);
  expect(sitemap).not.toContain("<lastmod>");
});
