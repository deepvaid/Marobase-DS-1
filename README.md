# Maropost Design System

Modern component library and UX playground for the Maropost Commerce + Marketing platform. Built for "vibe coding" with AI tools (Claude CLI, Cursor).

## Quick Start

```bash
npm install
npm run tokens:build
npm run dev          # App → http://localhost:5173
npm run storybook    # Components → http://localhost:6006
```

## What's Inside

- **11 reusable components** — `Mp*` prefixed, Vuetify-based, with Storybook stories
- **80+ page views** — Full replica of Maropost across Commerce, Marketing, Contacts, Analytics, Products, Service, Settings
- **Design token system** — JSON source of truth → auto-generated SCSS, CSS vars, TypeScript
- **Storybook 8** — Interactive component docs with light/dark theme toggle
- **Vercel deploy** — One-click preview URLs for stakeholder review
- **AI agent files** — `CLAUDE.md` + `.cursorrules` for Claude CLI and Cursor

## Stack

Vue 3.5 · Vuetify 3.12 · TypeScript 5.9 · Vite 7 · Pinia 3 · Storybook 8

## Scripts

| Command | What |
|---------|------|
| `npm run dev` | App dev server |
| `npm run storybook` | Component preview |
| `npm run build` | Production build |
| `npm run build-storybook` | Static Storybook |
| `npm run tokens:build` | Generate tokens |
| `npm run tokens:watch` | Watch & regenerate |
| `npm run type-check` | TypeScript check |

## Documentation

| File | Content |
|------|---------|
| [CLAUDE.md](CLAUDE.md) | AI agent context — architecture, APIs, conventions |
| [.cursorrules](.cursorrules) | Cursor IDE rules |
| [docs/design-system.md](docs/design-system.md) | Component API reference |
| [docs/development.md](docs/development.md) | Local dev workflow |
| [docs/deployment.md](docs/deployment.md) | Vercel setup |
| [docs/figma-integration.md](docs/figma-integration.md) | Token sync with Figma |
| [docs/personas/](docs/personas/) | 4 merchant user personas |
| [CLAUDE_CODE_PROMPT.md](CLAUDE_CODE_PROMPT.md) | Full product spec |

## First-Time Storybook Setup

```bash
npm install -D storybook @storybook/vue3-vite @storybook/addon-essentials @storybook/addon-themes
npm run storybook
```

## Deploy to Vercel

```bash
npx vercel          # Preview deploy
npx vercel --prod   # Production deploy
```

Or connect GitHub repo → Vercel auto-deploys on push.
