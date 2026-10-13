# BotStopper website

The marketing site and documentation for BotStopper from Techaro, built by the people behind Anubis. BotStopper helps protect websites from scraping and automated abuse. This repository contains the website that explains the product and publishes its documentation.

This site is vibe coded as a stylistic choice. Soulless corporate drones balk at the idea of anything containing soul, personality, or whimsy. Consider this README fair warning.

## Local development

Use Node.js and pnpm. The project pins its pnpm version in `package.json`.

Install the dependencies:

```sh
pnpm install --frozen-lockfile
```

Run the development server:

```sh
pnpm dev
```

Open <http://localhost:3000> for the homepage or <http://localhost:3000/docs> for the documentation.

## Documentation

Add or edit MDX files in `content/docs/`. The site generates documentation routes and navigation from those files. `index.mdx` maps to `/docs`, and `installation.mdx` maps to `/docs/installation`. Nested directories become nested routes.

Page titles come from a `title` field in YAML frontmatter, the first level-one heading, or the filename, in that order. MDX supports Markdown, tables, JSX, and component imports. Shared components in `mdx-components.tsx` style links and tables and add copy buttons to code blocks.

To embed an interactive component, put `"use client"` at the start of its `.tsx` file. Keep its state and event handlers in that file. Import the component into an MDX guide:

```mdx
import { Example } from "@/components/docs/example";

# Example guide

<Example label="Try it" />
```

Pass serializable props to client components. The guide and documentation layout remain server components.

Use route URLs for guide links, such as `[Installation](/docs/installation)`. Put literal braces and angle brackets in code spans or code blocks. MDX interprets these characters as expressions and JSX in normal text.

Local MDX files compile as application code. Only add trusted content to `content/docs/`.

The BotStopper guides describe its additions and changes. The [upstream Anubis documentation](https://anubis.techaro.lol/docs) covers shared features.

## Checks and production

Run lint checks:

```sh
pnpm lint
```

Build the site:

```sh
pnpm build
```

To check documentation navigation and client interactions, install Chromium and run the browser checks:

```sh
pnpm exec playwright install chromium
pnpm test:docs
```

Run the production server after a successful build:

```sh
pnpm start
```

Next.js is configured to produce standalone output for deployment.
