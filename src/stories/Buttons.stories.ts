import type { Meta, StoryObj } from '@storybook/vue3'
import { VBtn } from 'vuetify/components'

/**
 * Playground args interface — mirrors the key VBtn props we expose in Controls.
 */
interface ButtonArgs {
  label: string
  variant: 'elevated' | 'flat' | 'tonal' | 'outlined' | 'text' | 'plain'
  size: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  rounded: '0' | 'sm' | 'lg' | 'pill'
  disabled: boolean
  loading: boolean
  prependIcon: string
  appendIcon: string
  block: boolean
}

const meta = {
  title: 'Base/Buttons',
  component: VBtn,
  tags: ['autodocs'],

  // ── Controls panel configuration ──────────────────────────────────────────
  argTypes: {
    // Custom "label" arg (mapped to default slot in render)
    label: {
      control: 'text',
      description: 'Button label text (maps to default slot).',
      table: { category: 'Content' },
    },

    // Variant
    variant: {
      control: 'select',
      options: ['elevated', 'flat', 'tonal', 'outlined', 'text', 'plain'],
      description:
        'Visual style of the button. **Flat/Elevated** = primary CTA, **Tonal/Outlined** = secondary, **Text/Plain** = tertiary.',
      table: { category: 'Appearance', defaultValue: { summary: 'flat' } },
    },

    // Size
    size: {
      control: 'select',
      options: ['x-small', 'small', 'default', 'large', 'x-large'],
      description: 'Controls the height and font-size of the button.',
      table: { category: 'Appearance', defaultValue: { summary: 'default' } },
    },

    // Color
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info'],
      description:
        'Semantic color applied to the button. Use `error` exclusively for destructive actions.',
      table: { category: 'Appearance', defaultValue: { summary: 'primary' } },
    },

    // Rounded / border-radius
    rounded: {
      control: 'select',
      options: ['0', 'sm', 'lg', 'pill'],
      description: 'Border-radius preset. The Maropost default is `lg` (12 px).',
      table: { category: 'Appearance', defaultValue: { summary: 'lg' } },
    },

    // States
    disabled: {
      control: 'boolean',
      description: 'Disables the button, preventing user interaction.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    loading: {
      control: 'boolean',
      description: 'Shows a loading spinner and disables interaction.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },

    // Icons
    prependIcon: {
      control: 'text',
      description:
        'MDI icon class to prepend (left side), e.g. `mdi-plus`. Leave empty for no icon.',
      table: { category: 'Icons', defaultValue: { summary: '—' } },
    },
    appendIcon: {
      control: 'text',
      description:
        'MDI icon class to append (right side), e.g. `mdi-chevron-down`. Typically used for dropdowns.',
      table: { category: 'Icons', defaultValue: { summary: '—' } },
    },

    // Layout
    block: {
      control: 'boolean',
      description: 'Expands the button to 100 % width of its parent container.',
      table: { category: 'Layout', defaultValue: { summary: 'false' } },
    },
  },

  // ── Default arg values ────────────────────────────────────────────────────
  args: {
    label: 'Button',
    variant: 'flat',
    size: 'default',
    color: 'primary',
    rounded: 'lg',
    disabled: false,
    loading: false,
    prependIcon: '',
    appendIcon: '',
    block: false,
  },

  parameters: {
    docs: {
      description: {
        component: `
### Overview
Buttons communicate actions that users can take. They are typically placed throughout your UI, in places like dialogs, modal windows, forms, and cards.

Use the **Playground** story below to interactively configure every button property via the Controls panel.

### 🟢 Do's
- **Do** use only one primary (elevated/flat) button per screen or view to clearly indicate the main desired action.
- **Do** keep labels concise and action-oriented (e.g., "Save changes", "Submit form", "Cancel").
- **Do** ensure buttons have a clear hierarchy using variants. Primary actions = Flat/Elevated. Secondary actions = Tonal/Outlined. Tertiary actions = Text/Plain.

### 🔴 Don'ts
- **Don't** use too many buttons on a single screen, which can overwhelm the user and dilute the primary call-to-action.
- **Don't** use generic labels like "Click Here" or "Submit" if a more descriptive label like "Save Settings" provides better context.
- **Don't** wrap text inside buttons. Keep labels short enough to fit on a single line.

### 💡 Best Practices
- **Spacing:** Maintain standard gap spacing (\`ga-3\` or \`12px\`) between adjacent horizontal buttons.
- **Icons:** Use leading icons (left side) to clarify actions, but avoid trailing icons (right side) unless indicating a dropdown menu or forward navigation.
- **Destructive Actions:** Use \`color="error"\` exclusively for destructive actions like Delete, Remove, or Discard to warn users of irreversible consequences.
- **Button Groups:** When grouping related toggle actions (e.g., List/Grid view), wrap them in a \`v-btn-group\` component to visually bind them together.
        `,
      },
    },
  },
} satisfies Meta<ButtonArgs>

export default meta
type Story = StoryObj<ButtonArgs>

// ── 1. Playground (interactive) ─────────────────────────────────────────────
/**
 * The primary interactive story. Toggle every property from the **Controls**
 * panel on the right to see live changes.
 */
export const Playground: Story = {
  render: (args) => ({
    setup() {
      return { args }
    },
    template: `
      <v-btn
        :variant="args.variant"
        :size="args.size"
        :color="args.color"
        :rounded="args.rounded"
        :disabled="args.disabled"
        :loading="args.loading"
        :prepend-icon="args.prependIcon || undefined"
        :append-icon="args.appendIcon || undefined"
        :block="args.block"
        class="text-none"
      >
        {{ args.label }}
      </v-btn>
    `,
  }),
}

// ── 2. Variants ─────────────────────────────────────────────────────────────
/** All six Vuetify button variants side-by-side. */
export const Variants: Story = {
  render: () => ({
    template: `
      <div class="d-flex align-center flex-wrap ga-3">
        <v-btn color="primary" variant="elevated" class="text-none">Elevated</v-btn>
        <v-btn color="primary" variant="flat" class="text-none">Flat</v-btn>
        <v-btn color="primary" variant="tonal" class="text-none">Tonal</v-btn>
        <v-btn color="primary" variant="outlined" class="text-none">Outlined</v-btn>
        <v-btn color="primary" variant="text" class="text-none">Text</v-btn>
        <v-btn color="primary" variant="plain" class="text-none">Plain</v-btn>
      </div>
    `,
  }),
  parameters: { controls: { disable: true } },
}

// ── 3. Sizes ────────────────────────────────────────────────────────────────
/** Five standard size presets from `x-small` to `x-large`. */
export const Sizes: Story = {
  render: () => ({
    template: `
      <div class="d-flex align-center flex-wrap ga-3">
        <v-btn color="primary" variant="flat" size="x-small" class="text-none">X-Small</v-btn>
        <v-btn color="primary" variant="flat" size="small" class="text-none">Small</v-btn>
        <v-btn color="primary" variant="flat" size="default" class="text-none">Default</v-btn>
        <v-btn color="primary" variant="flat" size="large" class="text-none">Large</v-btn>
        <v-btn color="primary" variant="flat" size="x-large" class="text-none">X-Large</v-btn>
      </div>
    `,
  }),
  parameters: { controls: { disable: true } },
}

// ── 4. Semantic Colors ──────────────────────────────────────────────────────
/** Buttons using the six semantic theme colors. */
export const SemanticColors: Story = {
  render: () => ({
    template: `
      <div class="d-flex align-center flex-wrap ga-3">
        <v-btn color="primary" variant="flat" class="text-none">Primary</v-btn>
        <v-btn color="secondary" variant="flat" class="text-none">Secondary</v-btn>
        <v-btn color="success" variant="flat" class="text-none">Success</v-btn>
        <v-btn color="warning" variant="flat" class="text-none">Warning</v-btn>
        <v-btn color="error" variant="flat" class="text-none">Error</v-btn>
        <v-btn color="info" variant="flat" class="text-none">Info</v-btn>
      </div>
    `,
  }),
  parameters: { controls: { disable: true } },
}

// ── 5. With Icons ───────────────────────────────────────────────────────────
/** Buttons with prepend/append icons and icon-only variants. */
export const WithIcons: Story = {
  render: () => ({
    template: `
      <div class="d-flex align-center flex-wrap ga-3">
        <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" class="text-none">Add Item</v-btn>
        <v-btn color="primary" variant="outlined" append-icon="mdi-chevron-down" class="text-none">Options</v-btn>
        <v-btn color="primary" variant="tonal" prepend-icon="mdi-download" class="text-none">Export</v-btn>
        <v-btn variant="outlined" prepend-icon="mdi-upload" class="text-none">Import</v-btn>
        <v-btn icon="mdi-dots-horizontal" variant="text" color="medium-emphasis" />
        <v-btn icon="mdi-pencil-outline" variant="tonal" color="primary" size="small" />
      </div>
    `,
  }),
  parameters: { controls: { disable: true } },
}

// ── 6. States ───────────────────────────────────────────────────────────────
/** Normal, loading, and disabled states. */
export const States: Story = {
  render: () => ({
    template: `
      <div class="d-flex align-center flex-wrap ga-3">
        <v-btn color="primary" variant="flat" class="text-none">Normal</v-btn>
        <v-btn color="primary" variant="flat" class="text-none" loading>Loading</v-btn>
        <v-btn color="primary" variant="flat" class="text-none" disabled>Disabled</v-btn>
      </div>
    `,
  }),
  parameters: { controls: { disable: true } },
}

// ── 7. Rounded ──────────────────────────────────────────────────────────────
/** Border-radius presets from square (`0`) to `pill`. */
export const Rounded: Story = {
  render: () => ({
    template: `
      <div class="d-flex align-center flex-wrap ga-3">
        <v-btn color="primary" variant="flat" rounded="0" class="text-none">Square</v-btn>
        <v-btn color="primary" variant="flat" rounded="sm" class="text-none">Small</v-btn>
        <v-btn color="primary" variant="flat" rounded="lg" class="text-none">Large (default)</v-btn>
        <v-btn color="primary" variant="flat" rounded="pill" class="text-none">Pill</v-btn>
      </div>
    `,
  }),
  parameters: { controls: { disable: true } },
}

// ── 8. Button Group ─────────────────────────────────────────────────────────
/** Grouped toggle buttons using `v-btn-group`. */
export const ButtonGroup: Story = {
  render: () => ({
    template: `
      <div class="d-flex align-center ga-3">
        <v-btn-group variant="outlined" divided rounded="lg">
          <v-btn class="text-none" prepend-icon="mdi-format-list-bulleted">List</v-btn>
          <v-btn class="text-none" prepend-icon="mdi-view-grid">Grid</v-btn>
          <v-btn class="text-none" prepend-icon="mdi-chart-bar">Chart</v-btn>
        </v-btn-group>
      </div>
    `,
  }),
  parameters: { controls: { disable: true } },
}

// ── 9. Full Showcase (all sections combined) ────────────────────────────────
/**
 * A comprehensive visual reference showing every button configuration in a
 * single view. Useful for design review and screenshot comparisons.
 */
export const Showcase: Story = {
  render: () => ({
    template: `
      <div class="d-flex flex-column ga-6">
        <div>
          <div class="text-overline text-medium-emphasis mb-3">Variants</div>
          <div class="d-flex align-center flex-wrap ga-3">
            <v-btn color="primary" variant="elevated" class="text-none">Elevated</v-btn>
            <v-btn color="primary" variant="flat" class="text-none">Flat</v-btn>
            <v-btn color="primary" variant="tonal" class="text-none">Tonal</v-btn>
            <v-btn color="primary" variant="outlined" class="text-none">Outlined</v-btn>
            <v-btn color="primary" variant="text" class="text-none">Text</v-btn>
            <v-btn color="primary" variant="plain" class="text-none">Plain</v-btn>
          </div>
        </div>

        <div>
          <div class="text-overline text-medium-emphasis mb-3">Sizes</div>
          <div class="d-flex align-center flex-wrap ga-3">
            <v-btn color="primary" variant="flat" size="x-small" class="text-none">X-Small</v-btn>
            <v-btn color="primary" variant="flat" size="small" class="text-none">Small</v-btn>
            <v-btn color="primary" variant="flat" size="default" class="text-none">Default</v-btn>
            <v-btn color="primary" variant="flat" size="large" class="text-none">Large</v-btn>
            <v-btn color="primary" variant="flat" size="x-large" class="text-none">X-Large</v-btn>
          </div>
        </div>

        <div>
          <div class="text-overline text-medium-emphasis mb-3">With Icons</div>
          <div class="d-flex align-center flex-wrap ga-3">
            <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" class="text-none">Add Item</v-btn>
            <v-btn color="primary" variant="outlined" append-icon="mdi-chevron-down" class="text-none">Options</v-btn>
            <v-btn color="primary" variant="tonal" prepend-icon="mdi-download" class="text-none">Export</v-btn>
            <v-btn variant="outlined" prepend-icon="mdi-upload" class="text-none">Import</v-btn>
            <v-btn icon="mdi-dots-horizontal" variant="text" color="medium-emphasis" />
            <v-btn icon="mdi-pencil-outline" variant="tonal" color="primary" size="small" />
          </div>
        </div>

        <div>
          <div class="text-overline text-medium-emphasis mb-3">Semantic Colors</div>
          <div class="d-flex align-center flex-wrap ga-3">
            <v-btn color="primary" variant="flat" class="text-none">Primary</v-btn>
            <v-btn color="secondary" variant="flat" class="text-none">Secondary</v-btn>
            <v-btn color="success" variant="flat" class="text-none">Success</v-btn>
            <v-btn color="warning" variant="flat" class="text-none">Warning</v-btn>
            <v-btn color="error" variant="flat" class="text-none">Error</v-btn>
            <v-btn color="info" variant="flat" class="text-none">Info</v-btn>
          </div>
        </div>

        <div>
          <div class="text-overline text-medium-emphasis mb-3">States</div>
          <div class="d-flex align-center flex-wrap ga-3">
            <v-btn color="primary" variant="flat" class="text-none">Normal</v-btn>
            <v-btn color="primary" variant="flat" class="text-none" loading>Loading</v-btn>
            <v-btn color="primary" variant="flat" class="text-none" disabled>Disabled</v-btn>
          </div>
        </div>

        <div>
          <div class="text-overline text-medium-emphasis mb-3">Rounded</div>
          <div class="d-flex align-center flex-wrap ga-3">
            <v-btn color="primary" variant="flat" rounded="0" class="text-none">Square</v-btn>
            <v-btn color="primary" variant="flat" rounded="sm" class="text-none">Small</v-btn>
            <v-btn color="primary" variant="flat" rounded="lg" class="text-none">Large (default)</v-btn>
            <v-btn color="primary" variant="flat" rounded="pill" class="text-none">Pill</v-btn>
          </div>
        </div>

        <div>
          <div class="text-overline text-medium-emphasis mb-3">Dark / On-Surface</div>
          <div class="d-flex align-center flex-wrap ga-3">
            <v-btn
              variant="flat"
              class="text-none"
              style="background: rgb(var(--v-theme-on-surface)); color: rgb(var(--v-theme-surface));"
            >
              Dark Button
            </v-btn>
            <v-btn variant="outlined" class="text-none text-medium-emphasis">Secondary Action</v-btn>
          </div>
        </div>

        <div>
          <div class="text-overline text-medium-emphasis mb-3">Button Group</div>
          <div class="d-flex align-center ga-3">
            <v-btn-group variant="outlined" divided rounded="lg">
              <v-btn class="text-none" prepend-icon="mdi-format-list-bulleted">List</v-btn>
              <v-btn class="text-none" prepend-icon="mdi-view-grid">Grid</v-btn>
              <v-btn class="text-none" prepend-icon="mdi-chart-bar">Chart</v-btn>
            </v-btn-group>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: { controls: { disable: true } },
}
