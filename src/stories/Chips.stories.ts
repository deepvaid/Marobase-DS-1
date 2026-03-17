import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { VChip } from 'vuetify/components'

interface ChipArgs {
  label: string
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  variant: 'flat' | 'tonal' | 'outlined' | 'elevated' | 'text' | 'plain'
  size: 'x-small' | 'small' | 'default' | 'large'
  closable: boolean
  filter: boolean
  prependIcon: string
  appendIcon: string
  disabled: boolean
  rounded: '0' | 'sm' | 'md' | 'lg' | 'pill'
}

const meta = {
  title: 'Base/Chips',
  component: VChip,
  tags: ['autodocs'],

  argTypes: {
    label: {
      control: 'text',
      description: 'Text displayed inside the chip.',
      table: { category: 'Content' },
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info'],
      description: 'Semantic color of the chip.',
      table: { category: 'Appearance', defaultValue: { summary: 'primary' } },
    },
    variant: {
      control: 'select',
      options: ['flat', 'tonal', 'outlined', 'elevated', 'text', 'plain'],
      description: 'Visual style of the chip.',
      table: { category: 'Appearance', defaultValue: { summary: 'tonal' } },
    },
    size: {
      control: 'select',
      options: ['x-small', 'small', 'default', 'large'],
      description: 'Size of the chip.',
      table: { category: 'Appearance', defaultValue: { summary: 'default' } },
    },
    closable: {
      control: 'boolean',
      description: 'Shows a remove icon — use for removable tags.',
      table: { category: 'Behavior', defaultValue: { summary: 'false' } },
    },
    filter: {
      control: 'boolean',
      description: 'Shows a check icon when selected in a v-chip-group.',
      table: { category: 'Behavior', defaultValue: { summary: 'false' } },
    },
    prependIcon: {
      control: 'text',
      description: 'MDI icon prepended to the chip label (e.g. mdi-check-circle).',
      table: { category: 'Icons', defaultValue: { summary: '—' } },
    },
    appendIcon: {
      control: 'text',
      description: 'MDI icon appended to the chip label (e.g. mdi-arrow-right).',
      table: { category: 'Icons', defaultValue: { summary: '—' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction with the chip.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    rounded: {
      control: 'select',
      options: ['0', 'sm', 'md', 'lg', 'pill'],
      description: 'Border-radius preset.',
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
  },

  args: {
    label: 'Chip Label',
    color: 'primary',
    variant: 'tonal',
    size: 'default',
    closable: false,
    filter: false,
    prependIcon: '',
    appendIcon: '',
    disabled: false,
    rounded: 'md',
  },

  parameters: {
    docs: {
      description: {
        component: `### Overview
Vuetify's v-chip component for status labels, filter tags, and dismissible items. Configured with \`rounded="md"\` default. Compact and semantic.

Use the **Playground** story below to interactively configure every chip property via the Controls panel.

### 🟢 Do's
- Use semantic colors (success for positive, error for destructive, warning for caution)
- Keep chip labels short (1–2 words max)
- Use with icons for quick visual scanning
- Implement closable chips for tag removal
- Group related chips with v-chip-group for filtering

### 🔴 Don'ts
- Use chips as buttons (use v-btn instead)
- Nest chips inside chips
- Mix too many colors in a single view (max 3–4 semantic types)
- Use chips for navigation (use breadcrumbs or tabs)
- Create chips with very long labels (truncate at 20 chars)

### 💡 Best Practices
- Use prepend-icon with MDI icons for better visual context
- Combine chips with filters for intuitive category selection
- Always show count badges next to filter chips (e.g., "Active (12)")
- Use closable variant for removable tags in input fields
- Keep chip size consistent within the same context`,
      },
    },
  },
} satisfies Meta<ChipArgs>

export default meta
type Story = StoryObj<ChipArgs>

// ── 1. Playground ────────────────────────────────────────────────────────────
export const Playground: Story = {
  render: (args) => ({
    setup() { return { args } },
    template: `
      <v-chip
        :color="args.color"
        :variant="args.variant"
        :size="args.size"
        :closable="args.closable"
        :filter="args.filter"
        :prepend-icon="args.prependIcon || undefined"
        :append-icon="args.appendIcon || undefined"
        :disabled="args.disabled"
        :rounded="args.rounded"
      >
        {{ args.label }}
      </v-chip>
    `,
  }),
}

// ── 2. Variants ───────────────────────────────────────────────────────────────
export const Variants: Story = {
  render: () => ({
    template: `
      <div class="d-flex flex-wrap gap-2">
        <v-chip color="primary" variant="flat">Flat</v-chip>
        <v-chip color="primary" variant="tonal">Tonal</v-chip>
        <v-chip color="primary" variant="outlined">Outlined</v-chip>
        <v-chip color="primary" variant="text">Text</v-chip>
        <v-chip color="primary" variant="elevated">Elevated</v-chip>
      </div>
    `,
  }),
  parameters: { controls: { disable: true } },
}

// ── 3. Semantic Colors ────────────────────────────────────────────────────────
export const SemanticColors: Story = {
  render: () => ({
    template: `
      <div class="d-flex flex-wrap gap-2">
        <v-chip color="primary" variant="tonal">Primary</v-chip>
        <v-chip color="secondary" variant="tonal">Secondary</v-chip>
        <v-chip color="success" variant="tonal">Success</v-chip>
        <v-chip color="warning" variant="tonal">Warning</v-chip>
        <v-chip color="error" variant="tonal">Error</v-chip>
        <v-chip color="info" variant="tonal">Info</v-chip>
      </div>
    `,
  }),
  parameters: { controls: { disable: true } },
}

// ── 4. With Icons ─────────────────────────────────────────────────────────────
export const WithIcons: Story = {
  render: () => ({
    template: `
      <div class="d-flex flex-wrap gap-2">
        <v-chip prepend-icon="mdi-check-circle" color="success">Success</v-chip>
        <v-chip prepend-icon="mdi-alert-circle" color="warning">Warning</v-chip>
        <v-chip prepend-icon="mdi-close-circle" color="error" closable>Closable</v-chip>
        <v-chip prepend-icon="mdi-filter" color="primary" filter>Filterable</v-chip>
        <v-chip append-icon="mdi-arrow-right" color="primary">With Append</v-chip>
      </div>
    `,
  }),
  parameters: { controls: { disable: true } },
}

// ── 5. Sizes ──────────────────────────────────────────────────────────────────
export const Sizes: Story = {
  render: () => ({
    template: `
      <div class="d-flex flex-wrap gap-2 align-center">
        <v-chip size="x-small" color="primary">X-Small</v-chip>
        <v-chip size="small" color="primary">Small</v-chip>
        <v-chip color="primary">Default</v-chip>
        <v-chip size="large" color="primary">Large</v-chip>
      </div>
    `,
  }),
  parameters: { controls: { disable: true } },
}

// ── 6. Chip Group ─────────────────────────────────────────────────────────────
/** Interactive filter-chip group. */
export const ChipGroup: Story = {
  render: () => ({
    template: `
      <div>
        <p class="text-medium-emphasis mb-3">Filter by category:</p>
        <v-chip-group v-model="selected" column>
          <v-chip v-for="cat in categories" :key="cat.key" :value="cat.key" filter color="primary">
            {{ cat.label }} ({{ cat.count }})
          </v-chip>
        </v-chip-group>
        <p v-if="selected !== undefined" class="text-caption mt-4">Selected: {{ selected }}</p>
      </div>
    `,
    setup() {
      return {
        selected: ref(undefined),
        categories: [
          { key: 'all', label: 'All', count: 128 },
          { key: 'electronics', label: 'Electronics', count: 45 },
          { key: 'apparel', label: 'Apparel', count: 62 },
          { key: 'home', label: 'Home', count: 21 },
        ],
      }
    },
  }),
  parameters: { controls: { disable: true } },
}
