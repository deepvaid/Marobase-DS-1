# Visual Parity Workflow

## Local

1. Start Storybook:

```bash
pnpm --filter storybook dev
```

2. Export/update Figma baselines:

```bash
FIGMA_TOKEN=... FIGMA_FILE_KEY=... pnpm visual:baseline
```

3. Capture story screenshots:

```bash
pnpm visual:test
```

4. Compare with strict threshold (`0.5%`):

```bash
pnpm visual:report
```

This command also regenerates Storybook parity badges/docs in:

- `apps/storybook/src/docs/shared/ParityStatus.mdx`

## CI

The workflow in `.github/workflows/visual-parity.yml` runs the same capture + compare steps on pull requests.
