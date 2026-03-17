---
name: marobase-token-sync
description: Keeps design tokens consistent across src/design-tokens, generated outputs, design-kit scripts, and Figma. Use when changing tokens, adding new token types, syncing from or to Figma, or when token drift or build/sync failures are suspected.
---

# Marobase Token Sync

Single source of truth: `src/design-tokens/tokens.json`. All other token outputs and Figma stay in sync with it.

## When to Use

- Editing `tokens.json` or adding new token groups
- Syncing tokens to or from Figma (Tokens Studio / design-kit)
- Regenerating outputs after token changes
- Debugging token drift or broken builds

## Token Flow

```
src/design-tokens/tokens.json   (SOURCE — edit only this by hand)
         │
         ├── npm run tokens:build
         │         │
         │         └── src/design-tokens/generated/
         │                   ├── _variables.scss
         │                   ├── variables.css
         │                   └── tokens.ts
         │
         └── Figma sync (Tokens Studio or design-kit scripts)
                   design-kit/figma-export/...
                   design-kit/scripts/sync-from-figma.mjs
                   design-kit/scripts/push-variables.mjs
```

## Rules

1. **Do not edit generated files** in `src/design-tokens/generated/`. Change `tokens.json` and run `npm run tokens:build`.
2. **After any change to `tokens.json`:** run `npm run tokens:build` and commit the updated generated files (or rely on CI).
3. **Figma → code:** Use Tokens Studio “Pull from GitHub” or `design-kit/scripts/sync-from-figma.mjs`; then run `npm run tokens:build` so generated outputs match.
4. **Code → Figma:** Edit `tokens.json`, run `npm run tokens:build`, push; in Figma use Tokens Studio “Pull from GitHub” or design-kit push scripts.

## NPM Scripts

| Script | Purpose |
|--------|--------|
| `npm run tokens:build` | Generate SCSS/CSS/TS from `tokens.json` |
| `npm run tokens:watch` | Watch `tokens.json` and regenerate on save |
| `npm run tokens:sync-figma` | Sync from Figma then build (sync-from-figma.mjs + tokens:build) |
| `npm run design-kit:export-figma` | Export for Figma (design-kit) |
| `npm run design-kit:push-variables` | Push variables to Figma |
| `npm run design-kit:push-connect` | Publish Code Connect (requires FIGMA_TOKEN) |

## Token JSON Shape

- W3C-style: each token has `$value` and `$type` (e.g. `color`, `dimension`).
- Nested groups: `color.light.primary`, `spacing.4`, `borderRadius.md`, etc.
- Build script: `src/design-tokens/build.mjs` (flattens and emits SCSS/CSS/TS). Do not edit generated files.

## Preventing Drift

- **Single source:** All visual token values live in `tokens.json`. Design-kit and Figma consume or sync from it.
- **CI (optional):** On push to `tokens.json`, run `tokens:build` and commit generated files so PRs show token-driven diff.
- **Validation:** After editing `tokens.json`, run `npm run tokens:build`; fix any script errors before committing.
- **Components:** Components must use generated tokens (`$mp-*` in SCSS or Vuetify theme that references them), not hardcoded values.

## References

- `src/design-tokens/tokens.json` — source
- `src/design-tokens/build.mjs` — generator
- `docs/figma-integration.md` — Tokens Studio and GitHub sync
- `design-kit/scripts/` — sync-from-figma, push-variables, export-figma
