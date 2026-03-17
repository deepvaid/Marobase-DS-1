# Visual Capture Contract

To participate in visual parity checks, each story must provide:

- `parameters.visual.figmaNodeId`
- `parameters.visual.viewport`
- `parameters.visual.theme`
- `parameters.visual.state`
- `parameters.visual.variant`

Each rendered story must expose a stable capture hook:

- `data-visual-target`

The capture pipeline snapshots `data-visual-target` first, then falls back to `data-visual-root`.
