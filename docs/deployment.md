# Deployment Guide

## Vercel Setup (One-Time)

### Option A: Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (first time — will create project)
vercel

# Deploy to production
vercel --prod
```

### Option B: Via GitHub Integration
1. Push code to a GitHub repo
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the GitHub repo
4. Vercel auto-detects the `vercel.json` config
5. Click "Deploy"

### What Gets Deployed
- **App** → `https://your-project.vercel.app/` (Vue app from `dist/`)
- **Storybook** → `https://your-project.vercel.app/storybook/` (from `dist-storybook/`)

### Build Pipeline
The `vercel.json` build command runs:
1. `npm run tokens:build` — Generate design token files
2. `npm run build` — TypeScript check + Vite production build
3. `npm run build-storybook` — Build Storybook static site

## Preview Deployments

When connected to GitHub, every pull request automatically gets a preview URL:
- `https://your-project-git-branch-name.vercel.app`

Share this URL with stakeholders for review.

## Environment Variables

Currently none required (no backend API). If you add API integration later:
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add variables for Production, Preview, and Development

## Manual Deploy from CLI

```bash
# Preview deployment (creates a unique URL)
vercel

# Production deployment
vercel --prod
```

## Rollback

```bash
# List recent deployments
vercel ls

# Promote a previous deployment to production
vercel promote [deployment-url]
```

## Custom Domain

1. Vercel Dashboard → Project → Settings → Domains
2. Add your domain (e.g., `design.maropost.com`)
3. Update DNS as instructed by Vercel

## Troubleshooting

**Build fails on TypeScript errors:**
Run `npm run type-check` locally and fix all errors before pushing.

**Storybook build fails:**
Make sure Storybook dependencies are installed:
```bash
npm install -D storybook @storybook/vue3-vite @storybook/addon-essentials @storybook/addon-themes
```

**Token generation fails:**
Verify `src/design-tokens/tokens.json` is valid JSON:
```bash
node -e "JSON.parse(require('fs').readFileSync('src/design-tokens/tokens.json'))"
```
