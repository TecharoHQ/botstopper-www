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

Add or edit Markdown files in `content/docs/`. The site generates documentation routes and navigation from those files. `index.md` maps to `/docs`, and `installation.md` maps to `/docs/installation`. Nested directories become nested routes.

Page titles come from a `title` field in YAML frontmatter, the first level-one heading, or the filename, in that order. The renderer supports GitHub Flavored Markdown, including tables.

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

Run the production server after a successful build:

```sh
pnpm start
```

Next.js is configured to produce standalone output for deployment.
