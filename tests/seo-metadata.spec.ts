import { expect, test } from "@playwright/test";

const documents = [
  ["/docs", "BotStopper documentation", "Guides to BotStopper installation, configuration, customization, challenges, and upgrades."],
  ["/docs/introduction", "What is BotStopper?", "Learn how BotStopper builds on Anubis to challenge automated traffic while keeping websites open to people."],
  ["/docs/installation", "Installation", "Install BotStopper with binary packages, Docker, Podman, or Kubernetes using the BotStopper image and service names."],
  ["/docs/configuration", "Configuration", "Configure BotStopper with Docker Compose, optional challenge and error titles, and a local example deployment."],
  ["/docs/customization", "Customization", "Customize BotStopper with trusted overlay folders, CSS, fonts, images, and tenant-specific assets."],
  ["/docs/extensions/headless", "Headless browser detection", "Configure headless browser detection with client hints, Fetch Metadata, policy rules, metrics, and known limits."],
  ["/docs/challenges/soteria", "Soteria", "Learn how the experimental Soteria WebAssembly challenge works, its browser requirements, and safe difficulty settings."],
  ["/docs/upgrades", "Proxy and service upgrades", "Review BotStopper upgrade notes for automatic SNI connection pools and systemd instance socket paths."],
] as const;

test("documentation frontmatter drives page, Open Graph, Twitter, and social image metadata", async ({ page, request }) => {
  for (const [path, title, description] of documents) {
    await page.goto(path);

    await expect(page).toHaveTitle(`${title} | BotStopper documentation`);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", description);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", `${title} | BotStopper documentation`);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute("content", description);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", `https://botstopper.net${path}`);
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "website");
    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute("content", "BotStopper from Techaro");
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", `${title} | BotStopper documentation`);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute("content", description);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", new RegExp(`/social/docs${path === "/docs" ? "" : path.slice("/docs".length)}$`));
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://botstopper.net${path}`);

    const image = await request.get(`/social/docs${path === "/docs" ? "" : path.slice("/docs".length)}`);
    expect(image.status()).toBe(200);
    expect(image.headers()["content-type"]).toContain("image/png");
  }
});
