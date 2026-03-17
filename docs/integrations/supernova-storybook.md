# Supernova + Storybook Integration Runbook

This repository is configured to sync Storybook to Supernova on every push to `main` with GitHub Actions.

## What Gets Automated

1. Build Storybook static output from `/Users/deepakvaidya/Documents/marobase/apps/storybook`.
2. Import/update that output in Supernova using a stable `sourceId`.
3. Run on every `main` push and on manual workflow dispatch.

## Required GitHub Secrets

Set these in GitHub: `Settings` -> `Secrets and variables` -> `Actions`.

- `SUPERNOVA_TOKEN` (required)
- `SUPERNOVA_DESIGN_SYSTEM_ID` (required)
- `SUPERNOVA_STORYBOOK_SOURCE_ID` (optional, recommended for strict source targeting)
- `SUPERNOVA_STORYBOOK_NAME` (optional, defaults to `marobase-ui-main`)
- `SUPERNOVA_VERSION_ID` (optional)
- `SUPERNOVA_BRAND_ID` (optional)

## One-Time Bootstrap (Create Storybook Source)

Run once locally to create the initial Storybook source in Supernova.

```bash
cd /Users/deepakvaidya/Documents/marobase
pnpm install
pnpm storybook:build
npm install -g @supernovaio/cli

export SUPERNOVA_TOKEN="<your-supernova-token>"
export SUPERNOVA_DESIGN_SYSTEM_ID="<your-design-system-id>"
export SUPERNOVA_STORYBOOK_NAME="marobase-ui-main"

pnpm supernova:storybook:sync
```

After bootstrap:

1. Verify Storybook URL is available in Supernova.
2. Optionally capture source id from Supernova UI/API and save it as `SUPERNOVA_STORYBOOK_SOURCE_ID` for stricter CI targeting.

## CI Sync Workflow

- Workflow file: `/Users/deepakvaidya/Documents/marobase/.github/workflows/supernova-storybook-sync.yml`
- Trigger:
  - push to `main`
  - manual `workflow_dispatch`
- Command used in CI:
  - `pnpm storybook:build`
  - `pnpm supernova:storybook:sync`

The sync script is `/Users/deepakvaidya/Documents/marobase/scripts/supernova/sync-storybook.ts`.

## Local Manual Sync (After Bootstrap)

```bash
cd /Users/deepakvaidya/Documents/marobase
pnpm storybook:build
pnpm supernova:storybook:sync
```

Required env vars for local sync:

- `SUPERNOVA_TOKEN`
- `SUPERNOVA_DESIGN_SYSTEM_ID`

Optional env vars for stricter targeting:

- `SUPERNOVA_STORYBOOK_SOURCE_ID`

## Figma -> Supernova Auto Update

Storybook sync and Figma sync are independent.

To enable automatic Figma updates in Supernova:

1. Open your design system in Supernova.
2. Go to `Data Sources` -> `Figma`.
3. Authorize Figma account (if not already connected).
4. Connect file key `2wTm8nybexj8HApt70oWpy`.
5. Enable automatic updates for the connected file.
6. Choose import scopes (tokens/components/assets) based on your governance rules.

## Troubleshooting

### Missing `SUPERNOVA_STORYBOOK_SOURCE_ID` in CI

Cause: Optional strict-targeting id not configured.

Fix:

1. Keep using name-based sync (works without source id), or
2. Capture source id from Supernova and add GitHub secret `SUPERNOVA_STORYBOOK_SOURCE_ID`.

### `supernova: command not found`

Cause: Supernova CLI is not installed in the current environment.

Fix:

```bash
npm install -g @supernovaio/cli
```

### Build succeeds, import fails

Cause: invalid token, insufficient permissions, wrong design system id, or wrong source id.

Fix:

1. Verify `SUPERNOVA_TOKEN` belongs to a user with Contributor+ access.
2. Verify `SUPERNOVA_DESIGN_SYSTEM_ID`.
3. Verify `SUPERNOVA_STORYBOOK_SOURCE_ID` points to the correct Storybook source.

## Rollback

If sync breaks production docs:

1. Disable workflow `/Users/deepakvaidya/Documents/marobase/.github/workflows/supernova-storybook-sync.yml` temporarily.
2. Re-run the previous known-good sync manually from local.
3. Restore workflow after correcting secrets or IDs.
