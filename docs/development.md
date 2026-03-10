# Development Guide

## Prerequisites
- Node.js 18+
- npm 9+

## Quick Start

```bash
# Install dependencies
npm install

# Generate design tokens
npm run tokens:build

# Start dev server
npm run dev
# → http://localhost:5173

# In a second terminal, start Storybook
npm run storybook
# → http://localhost:6006
```

## Development Workflow

### Three terminals

| Terminal | Command | Purpose |
|----------|---------|---------|
| 1 | `npm run dev` | App dev server with HMR |
| 2 | `npm run storybook` | Component preview |
| 3 | `npm run tokens:watch` | Auto-rebuild tokens on change |

### Creating a New Component

1. Create `src/components/MpComponentName.vue`:
```vue
<script setup lang="ts">
defineProps<{
  title: string
  count?: number
}>()

defineEmits<{
  (e: 'action'): void
}>()
</script>

<template>
  <div>...</div>
</template>

<style scoped>
/* Use design tokens, never hardcode */
</style>
```

2. Write a story `src/components/MpComponentName.stories.ts`:
```ts
import type { Meta, StoryObj } from '@storybook/vue3'
import MpComponentName from './MpComponentName.vue'

const meta = {
  title: 'Category/MpComponentName',
  component: MpComponentName,
  tags: ['autodocs'],
} satisfies Meta<typeof MpComponentName>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { title: 'Example', count: 5 },
}
```

3. Verify in Storybook: `http://localhost:6006`

### Modifying a Design Token

1. Edit `src/design-tokens/tokens.json`
2. Run `npm run tokens:build` (or let watch mode handle it)
3. Generated files update automatically:
   - `src/design-tokens/generated/_variables.scss`
   - `src/design-tokens/generated/variables.css`
   - `src/design-tokens/generated/tokens.ts`
4. Components referencing these tokens pick up changes via HMR

### Adding a New View

1. Create `src/views/Section/NewPage.vue`
2. Add route in `src/router/index.ts`
3. Add sidebar nav link in `src/components/layout/AppSidebar.vue`
4. Follow the data table page pattern (see CLAUDE.md)

## Pre-Push Checklist

```bash
# 1. Type check
npm run type-check

# 2. Build app
npm run build

# 3. Build Storybook
npm run build-storybook

# 4. Verify tokens
npm run tokens:build
```

## Commit Message Format

```
[type]: short description

Optional longer explanation.
```

**Types:** `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `chore`

**Examples:**
- `[feat]: add MpDateRangePicker component with story`
- `[fix]: correct MpStatusChip color for "Requires Action" status`
- `[docs]: update design-system.md with new tokens`
- `[refactor]: extract useTableFilters composable from SalesOrders`

## Storybook Dependencies

When setting up for the first time, install Storybook:

```bash
npm install -D storybook @storybook/vue3-vite @storybook/addon-essentials @storybook/addon-themes
```

## Useful Links

- [Vuetify 3 Docs](https://vuetifyjs.com/)
- [Vue 3 Composition API](https://vuejs.org/api/composition-api-setup.html)
- [Storybook for Vue](https://storybook.js.org/docs/get-started/frameworks/vue3-vite)
- [MDI Icons](https://pictogrammers.com/library/mdi/)
