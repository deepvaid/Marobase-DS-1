import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { VAlert } from 'vuetify/components'

interface AlertArgs {
  title: string
  text: string
  type: 'success' | 'info' | 'warning' | 'error'
  variant: 'tonal' | 'flat' | 'outlined' | 'elevated' | 'text' | 'plain'
  density: 'default' | 'comfortable' | 'compact'
  closable: boolean
  prominent: boolean
  border: false | 'top' | 'bottom' | 'start' | 'end'
  icon: string
  rounded: '0' | 'sm' | 'lg' | 'xl' | 'pill'
}

const meta = {
  title: 'Base/Alerts',
  component: VAlert,
  tags: ['autodocs'],

  argTypes: {
    title: {
      control: 'text',
      description: 'Alert heading text.',
      table: { category: 'Content' },
    },
    text: {
      control: 'text',
      description: 'Alert body text (maps to default slot or `text` prop).',
      table: { category: 'Content' },
    },
    type: {
      control: 'select',
      options: ['success', 'info', 'warning', 'error'],
      description: 'Semantic type that sets color and default icon.',
      table: { category: 'Appearance', defaultValue: { summary: 'info' } },
    },
    variant: {
      control: 'select',
      options: ['tonal', 'flat', 'outlined', 'elevated', 'text', 'plain'],
      description: 'Visual style of the alert.',
      table: { category: 'Appearance', defaultValue: { summary: 'tonal' } },
    },
    density: {
      control: 'select',
      options: ['default', 'comfortable', 'compact'],
      description: 'Controls vertical padding and overall height.',
      table: { category: 'Appearance', defaultValue: { summary: 'default' } },
    },
    closable: {
      control: 'boolean',
      description: 'Shows a close button to dismiss the alert.',
      table: { category: 'Behavior', defaultValue: { summary: 'false' } },
    },
    prominent: {
      control: 'boolean',
      description: 'Increases icon size and applies a more prominent layout.',
      table: { category: 'Appearance', defaultValue: { summary: 'false' } },
    },
    border: {
      control: 'select',
      options: [false, 'top', 'bottom', 'start', 'end'],
      description: 'Adds a colored border to one side of the alert.',
      table: { category: 'Appearance', defaultValue: { summary: 'false' } },
    },
    icon: {
      control: 'text',
      description: 'Custom MDI icon override (e.g. `mdi-check-circle`). Leave empty to use the default icon for the `type`.',
      table: { category: 'Icons', defaultValue: { summary: '—' } },
    },
    rounded: {
      control: 'select',
      options: ['0', 'sm', 'lg', 'xl', 'pill'],
      description: 'Border-radius preset.',
      table: { category: 'Appearance', defaultValue: { summary: 'lg' } },
    },
  },

  args: {
    title: 'Alert Title',
    text: 'This is the alert body text with additional context for the user.',
    type: 'info',
    variant: 'tonal',
    density: 'default',
    closable: false,
    prominent: false,
    border: false,
    icon: '',
    rounded: 'lg',
  },

  parameters: {
    docs: {
      description: {
        component: `### Overview
Vuetify's v-alert component for system notifications, validation summaries, and contextual messages. Used for dismissible banners and informational content blocks.

Use the **Playground** story below to interactively configure every alert property via the Controls panel.

### 🟢 Do's
- Use appropriate semantic type (success for positive outcomes, info for informational, warning for caution, error for problems)
- Include actionable text when suggesting next steps
- Make alerts dismissible when context permits
- Use icons that match the alert type for visual clarity
- Stack alerts only when showing multiple validation errors (max 3)

### 🔴 Don'ts
- Stack multiple alerts for different concerns (consolidate related messages)
- Use for inline field-level validation (use v-messages instead)
- Make alerts auto-dismiss without user action (causes accessibility issues)
- Use warning or error alerts for trivial information
- Place alerts at the bottom of forms (put them at the top)

### 💡 Best Practices
- Always lead with the most critical alert (error > warning > info > success)
- Keep alert text concise (2-3 lines max)
- Use prominent placement at the top of content sections
- Provide clear call-to-action buttons in the default slot
- Match alert color to page state (e.g., error alerts when form validation fails)`,
      },
    },
  },
} satisfies Meta<AlertArgs>

export default meta
type Story = StoryObj<AlertArgs>

// ── 1. Playground (interactive) ─────────────────────────────────────────────
export const Playground: Story = {
  render: (args) => ({
    setup() { return { args } },
    template: `
      <v-alert
        :title="args.title"
        :text="args.text"
        :type="args.type"
        :variant="args.variant"
        :density="args.density"
        :closable="args.closable"
        :prominent="args.prominent"
        :border="args.border"
        :icon="args.icon || undefined"
        :rounded="args.rounded"
      />
    `,
  }),
}

// ── 2. Types ────────────────────────────────────────────────────────────────
/** All four semantic alert types. */
export const Types: Story = {
  render: () => ({
    template: `
      <div class="d-flex flex-column gap-4">
        <v-alert type="success" icon="mdi-check-circle" title="Success">
          Your order has been placed successfully. You will receive a confirmation email shortly.
        </v-alert>
        <v-alert type="info" icon="mdi-information" title="Information">
          This feature is new. Check out the help documentation to learn more about how to use it.
        </v-alert>
        <v-alert type="warning" icon="mdi-alert" title="Warning">
          You are using 85% of your monthly API quota. Upgrade your plan to avoid service interruption.
        </v-alert>
        <v-alert type="error" icon="mdi-alert-circle" title="Error">
          Failed to save your changes. Please check your connection and try again.
        </v-alert>
      </div>
    `,
  }),
  parameters: { controls: { disable: true } },
}

// ── 3. Variants ─────────────────────────────────────────────────────────────
/** Tonal, flat, outlined, and elevated visual styles. */
export const Variants: Story = {
  render: () => ({
    template: `
      <div class="d-flex flex-column gap-4">
        <v-alert type="info" icon="mdi-information" title="Tonal" variant="tonal">
          This is the default tonal variant with background color.
        </v-alert>
        <v-alert type="info" icon="mdi-information" title="Flat" variant="flat">
          This is a flat variant with minimal styling.
        </v-alert>
        <v-alert type="info" icon="mdi-information" title="Outlined" variant="outlined">
          This is an outlined variant with a border.
        </v-alert>
        <v-alert type="info" icon="mdi-information" title="Elevated" variant="elevated">
          This is an elevated variant with shadow.
        </v-alert>
      </div>
    `,
  }),
  parameters: { controls: { disable: true } },
}

// ── 4. With Actions ─────────────────────────────────────────────────────────
/** Alert with a custom action button in the close slot. */
export const WithActions: Story = {
  render: () => ({
    template: `
      <v-alert type="warning" icon="mdi-alert" title="Action Required">
        Your account subscription expires in 7 days. Renew now to maintain access.
        <template #close="{ props }">
          <v-btn v-bind="props" variant="text" size="small" color="warning">Dismiss</v-btn>
        </template>
      </v-alert>
    `,
  }),
  parameters: { controls: { disable: true } },
}

// ── 5. Dismissible ──────────────────────────────────────────────────────────
/** Closable alert with show/hide toggle. */
export const Dismissible: Story = {
  render: () => ({
    template: `
      <div class="d-flex flex-column gap-4">
        <v-alert
          v-if="showAlert"
          type="info"
          icon="mdi-information"
          title="Closable Alert"
          closable
          @click:close="showAlert = false"
        >
          Click the X button to dismiss this alert.
        </v-alert>
        <div v-if="!showAlert">
          <v-btn color="primary" @click="showAlert = true">Show Alert</v-btn>
        </div>
      </div>
    `,
    setup() {
      const showAlert = ref(true)
      return { showAlert }
    },
  }),
  parameters: { controls: { disable: true } },
}
