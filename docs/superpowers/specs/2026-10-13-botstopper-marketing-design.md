# BotStopper from Techaro marketing site

## Goal

Create a polished, deliberately familiar corporate marketing site for BotStopper from Techaro. Explain the product as the public-facing CAPTCHA and scraping filter in the Anubis family, present its enterprise features, link to GitHub Sponsors, and make product documentation easy to extend by adding Markdown files.

## Visual direction

Use the selected classic enterprise direction: a clear top navigation, high-contrast hero, large dimensional security illustration, trust/product strip, feature cards, and a direct closing call to action. Keep the palette muted plum and lavender with a restrained gradient. Adapt the supplied overlapping-triangle and iris logo with simplified corporate colors while preserving its recognizable geometry. The wordmark and brand line read “BotStopper from Techaro.” Use Podkova for headings and Schibsted Grotesk for body text. The homepage illustration should be a layered shield built around the triangle mark, slowly rotating in CSS to suggest a challenge in progress. Include reduced-motion support and no added animation dependency.

## Homepage content

The hero should communicate that BotStopper keeps useful visitors moving while filtering abusive automation. Describe its relationship to the open source Anubis project at a high level and name the requested capabilities: corporate-friendly default branding, custom branding, headless-browser detection, and hybrid challenge architecture. Do not imply a complete inventory of every Anubis capability. Add a prominent link to `http://github.com/sponsors/Xe` to support the project. Use clear, enterprise-oriented copy without implying unverified certifications or customer claims.

## Documentation

Create a `/docs` experience backed by Markdown files in `content/docs/`, scanned recursively. Each Markdown file becomes a route using its relative path without the `.md` extension, so `content/docs/getting-started/install.md` maps to `/docs/getting-started/install`. Build the sidebar recursively from these files, using frontmatter titles where available and humanized filenames as a fallback. Render Markdown headings, paragraphs, lists, links, and fenced code safely. Unknown slugs should use the app's not-found behavior. Adding a Markdown file should make it appear in the generated navigation and route without editing a route registry.

## Technical approach

Keep the implementation inside the existing Next.js App Router. Use server-rendered pages and a small local content loader for the Markdown directory. Prefer existing project dependencies; add a focused Markdown parser only if needed for safe and maintainable rendering. Keep the 3D visual CSS-driven and responsive. Respect reduced-motion preferences and provide semantic navigation, heading hierarchy, and visible focus styles.

## Validation

Run the existing lint and production build commands after implementation. Inspect the home page and at least one generated docs route in a browser, including a narrow viewport and reduced-motion preference. Verify the Sponsors link, sidebar generation, unknown docs route, and logo asset.
