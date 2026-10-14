import { expect, test } from "@playwright/test";

test("homepage FAQ schema matches visible answers and preserves publisher identity", async ({ page }) => {
  await page.goto("/");
  const graph = JSON.parse(await page.locator('script[type="application/ld+json"]').innerText())["@graph"];
  const faq = graph.find((node: { "@type": string }) => node["@type"] === "FAQPage");
  for (const question of faq.mainEntity) {
    const card = page.locator("#faq article").filter({ has: page.getByRole("heading", { name: question.name, exact: true }) });
    await expect(card).toBeVisible();
    await expect(card.locator("p")).toHaveText(question.acceptedAnswer.text);
  }
  const product = graph.find((node: { name: string }) => node.name === "BotStopper");
  const organization = graph.find((node: { "@type": string }) => node["@type"] === "Organization");
  expect(product.sameAs).toBeUndefined();
  expect(product.publisher["@id"]).toBe(organization["@id"]);
  expect(organization.sameAs).toContain("https://www.wikidata.org/wiki/Q134301803");
  expect(graph.some((node: { "@type": string }) => node["@type"] === "Service")).toBe(false);
});

test("headless guide links to a rendered Fetch Metadata section", async ({ page }) => {
  await page.goto("/docs/extensions/headless");
  await page.getByRole("link", { name: "Fetch Metadata", exact: true }).click();
  await expect(page.locator("#fetch-metadata")).toBeVisible();
  await expect(page).toHaveURL(/#fetch-metadata$/);
});
