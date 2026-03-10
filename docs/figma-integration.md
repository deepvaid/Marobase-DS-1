# Figma Integration — Design Token Sync

## Overview

Design tokens flow between Figma and code using **Tokens Studio** (Figma plugin) and a JSON file in this repo. Changes in either direction are synced through Git.

```
Figma (Tokens Studio plugin)
        ↕ sync via GitHub
src/design-tokens/tokens.json
        ↓ npm run tokens:build
Generated outputs:
  ├── _variables.scss   (SCSS)
  ├── variables.css     (CSS custom properties)
  └── tokens.ts         (TypeScript constants)
        ↓
Used by Vue components + Storybook
```

---

## Setup (One-Time)

### 1. Install Tokens Studio in Figma
1. Open Figma → Plugins → Search "Tokens Studio"
2. Install the plugin
3. Open it in your design file

### 2. Connect to GitHub
In Tokens Studio:
1. Click the sync icon (⚡) → Add new → GitHub
2. Configure:
   - **Repository:** `your-org/new-maropost`
   - **Branch:** `main` (or a dedicated `tokens` branch)
   - **File path:** `src/design-tokens/tokens.json`
   - **Personal access token:** Generate at github.com/settings/tokens (needs `repo` scope)
3. Click "Save" and "Pull from GitHub" to load existing tokens

### 3. Map Tokens in Figma
The `tokens.json` file uses the W3C Design Tokens Format with these groups:

| Group | Figma usage |
|-------|------------|
| `color.light.*` | Light theme color styles |
| `color.dark.*` | Dark theme color styles |
| `spacing.*` | Auto-layout spacing, padding |
| `borderRadius.*` | Corner radius |
| `typography.fontSize.*` | Text styles |
| `typography.fontWeight.*` | Text weight |
| `shadow.*` | Drop shadows |

---

## Workflow: Designer Updates Tokens in Figma

1. Designer opens Tokens Studio in Figma
2. Modifies a token value (e.g., changes `primary` from `#1A56DB` to `#2563EB`)
3. Clicks "Push to GitHub"
4. Tokens Studio creates a PR against `main` with the updated `tokens.json`
5. Developer reviews the PR, approves it
6. After merge, developer runs:
   ```bash
   git pull
   npm run tokens:build
   ```
7. Generated SCSS/CSS/TS files update → components reflect the change

### Automated Option
Add a GitHub Action to auto-run `tokens:build` on merge:

```yaml
# .github/workflows/tokens.yml
name: Build Design Tokens
on:
  push:
    paths: ['src/design-tokens/tokens.json']
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 18 }
      - run: node src/design-tokens/build.mjs
      - uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: "[chore]: regenerate design tokens"
          file_pattern: "src/design-tokens/generated/*"
```

---

## Workflow: Developer Updates Tokens in Code

1. Edit `src/design-tokens/tokens.json` directly
2. Run `npm run tokens:build` to verify output
3. Commit and push
4. In Figma, open Tokens Studio → Pull from GitHub
5. Token values update in Figma automatically

---

## Token JSON Format

The file follows a structure compatible with both Tokens Studio and W3C Design Tokens:

```json
{
  "color": {
    "light": {
      "primary": {
        "$value": "#1A56DB",
        "$type": "color"
      }
    }
  },
  "spacing": {
    "4": {
      "$value": "16px",
      "$type": "dimension"
    }
  }
}
```

Each token has:
- `$value` — the actual design value
- `$type` — token type (color, dimension, shadow, transition, fontFamily, fontWeight, number)

---

## Code Connect (Figma → Component Mapping)

To link Figma components directly to source code:

1. Use the Figma MCP tools available in this project (see `.claude/settings.local.json`)
2. For each component, create a mapping:
   - Figma node ID → `src/components/MpComponentName.vue`
3. This enables designers to right-click a Figma component and jump to the code

### Mappings to Create

| Figma Component | Code File |
|----------------|-----------|
| Status Chip | `src/components/MpStatusChip.vue` |
| Page Header | `src/components/MpPageHeader.vue` |
| KPI Card | `src/components/MpKpiCard.vue` |
| Empty State | `src/components/MpEmptyState.vue` |
| Filter Tabs | `src/components/MpFilterTabs.vue` |
| Form Drawer | `src/components/MpFormDrawer.vue` |
| Data Table Toolbar | `src/components/MpDataTableToolbar.vue` |
| Section Header | `src/components/MpSectionHeader.vue` |

---

## Troubleshooting

**Tokens not syncing from Figma:**
- Check GitHub PAT hasn't expired
- Verify file path in Tokens Studio matches `src/design-tokens/tokens.json`
- Check branch name matches

**Generated files look wrong:**
- Validate JSON: `node -e "JSON.parse(require('fs').readFileSync('src/design-tokens/tokens.json'))"`
- Run build with verbose: `node src/design-tokens/build.mjs`
- Check for missing `$value` or `$type` on new tokens

**Token changes not showing in app:**
- Make sure you ran `npm run tokens:build`
- Check that components reference tokens via SCSS variables (`$mp-*`) not hardcoded values
- Restart dev server if HMR doesn't pick up SCSS changes
