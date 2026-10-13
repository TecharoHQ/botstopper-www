import { getDocs } from "@/lib/docs";

const site = "https://botstopper.net";

// First prose paragraph of a document, links flattened, kept short so the
// index stays scannable.
function describe(content: string): string {
  let inFence = false;
  for (const line of content.split("\n")) {
    if (line.trim().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const trimmed = line.trim();
    if (!trimmed || /^[#->]/.test(trimmed)) continue;
    const text = trimmed.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
    return text.length > 100 ? `${text.slice(0, 97)}...` : text;
  }
  return "";
}

function docHref(slug: string): string {
  return `${site}/docs${slug ? `/${slug}` : ""}.md`;
}

function docsList(): string {
  return getDocs()
    .map((doc) => {
      const summary = describe(doc.content);
      return `- [${doc.title}](${docHref(doc.slug)})${summary ? `: ${summary}` : ""}`;
    })
    .join("\n");
}

export function buildDocsLlmsIndex(): string {
  return [
    "# BotStopper documentation",
    "",
    "Machine-readable index of the BotStopper documentation. Every entry",
    "links to the Markdown source of the page; strip the .md suffix for the",
    "rendered HTML version.",
    "",
    docsList(),
    "",
  ].join("\n");
}

export function buildLlmsIndex(): string {
  return [
    "# BotStopper",
    "",
    "> BotStopper from Techaro is a bot protection product built by the",
    "> creators of Anubis. It helps protect websites from scraping and",
    "> automated abuse while keeping the experience straightforward for",
    "> people.",
    "",
    "Use BotStopper when you need to protect a website from unwanted",
    "automated traffic and want the Anubis approach with organizational",
    "polish: calm defaults, customizable branding, headless browser",
    "detection, and a hybrid challenge architecture. It is one layer in a",
    "defense in depth, not a replacement for authentication or rate",
    "limiting.",
    "",
    "BotStopper costs $50 per month, billed through GitHub Sponsors.",
    "",
    "## Documentation",
    "",
    docsList(),
    "",
    `Documentation index for agents: ${site}/docs/llms.txt`,
    "",
    "## Site",
    "",
    `- [Home](${site}/index.md): what BotStopper is and why it exists.`,
    `- [Pricing](${site}/pricing.md): $50 per month via GitHub Sponsors.`,
    `- [About](${site}/about.md): Techaro and the people behind BotStopper.`,
    `- [Contact](${site}/contact.md): how to reach the team.`,
    `- [Privacy](${site}/privacy.md): what this website does with data.`,
    "",
    "## Project",
    "",
    "- Source: https://github.com/TecharoHQ",
    "- Sponsor the work: https://github.com/sponsors/Xe",
    "",
  ].join("\n");
}
