import type { Meta, StoryObj } from '@storybook/vue3'
import { VCard } from 'vuetify/components'

interface CardArgs {
  title: string
  subtitle: string
  text: string
  variant: 'flat' | 'tonal' | 'outlined' | 'elevated' | 'text' | 'plain'
  color: string
  rounded: '0' | 'sm' | 'md' | 'lg' | 'xl' | 'pill'
  border: boolean
  hover: boolean
  elevation: number
}

const meta = {
  title: 'Base/Cards',
  component: VCard,
  tags: ['autodocs'],

  argTypes: {
    title: {
      control: 'text',
      description: 'Card title displayed in the v-card-item.',
      table: { category: 'Content' },
    },
    subtitle: {
      control: 'text',
      description: 'Card subtitle displayed below the title.',
      table: { category: 'Content' },
    },
    text: {
      control: 'text',
      description: 'Card body text content.',
      table: { category: 'Content' },
    },
    variant: {
      control: 'select',
      options: ['flat', 'tonal', 'outlined', 'elevated', 'text', 'plain'],
      description: 'Visual style. **Flat + border** is the Maropost design system default.',
      table: { category: 'Appearance', defaultValue: { summary: 'flat' } },
    },
    color: {
      control: 'select',
      options: ['', 'primary', 'secondary', 'success', 'warning', 'error', 'info'],
      description: 'Color applied when using the tonal variant.',
      table: { category: 'Appearance', defaultValue: { summary: '—' } },
    },
    rounded: {
      control: 'select',
      options: ['0', 'sm', 'md', 'lg', 'xl', 'pill'],
      description: 'Border-radius preset. Maropost default is xl.',
      table: { category: 'Appearance', defaultValue: { summary: 'xl' } },
    },
    border: {
      control: 'boolean',
      description: 'Adds a subtle border. Always use alongside variant="flat".',
      table: { category: 'Appearance', defaultValue: { summary: 'true' } },
    },
    hover: {
      control: 'boolean',
      description: 'Applies hover effect — use for clickable cards.',
      table: { category: 'Behavior', defaultValue: { summary: 'false' } },
    },
    elevation: {
      control: { type: 'range', min: 0, max: 24, step: 1 },
      description: 'Box-shadow level. Keep at 0 for the Maropost flat design.',
      table: { category: 'Appearance', defaultValue: { summary: '0' } },
    },
  },

  args: {
    title: 'Card Title',
    subtitle: 'Supporting subtitle text',
    text: 'Cards contain content and actions about a single subject. Use flat + border for almost all standard content areas.',
    variant: 'flat',
    color: '',
    rounded: 'xl',
    border: true,
    hover: false,
    elevation: 0,
  },

  parameters: {
    docs: {
      description: {
        component: `### Overview
Cards contain content and actions about a single subject. They are used to group related information and make it easy to digest.

Use the **Playground** story below to interactively configure card properties via the Controls panel.

### 🟢 Do's
- **Do** use the \`flat\` variant with a \`border\` for almost all standard content areas. This is the Maropost design system default.
- **Do** use \`tonal\` variants for highlighting specific metrics, statuses, or state-changes.
- **Do** use clear visual hierarchy within cards (e.g., \`text-overline\` for metric titles, \`text-h4\` for the main value).

### 🔴 Don'ts
- **Don't** use elevation shadows on cards. Our design system relies on flat borders to keep the UI clean and modern.
- **Don't** nest cards too deeply inside other cards. Use dividers or spacing to separate content instead.
- **Don't** overcrowd cards with too many actions. Limit primary actions to 1–2 buttons in a \`v-card-actions\` block.

### 💡 Best Practices
- **Interactivity:** If a card is fully clickable, add the \`hover\` prop so users get visual feedback.
- **Corner Radii:** Use \`rounded="xl"\` (the Maropost default). Do not apply \`rounded="0"\` unless cards are edge-to-edge on mobile.
- **Padding:** Maintain consistent padding. The standard is \`pa-5\` or \`pa-6\` for main content areas.`,
      },
    },
  },
} satisfies Meta<CardArgs>

export default meta
type Story = StoryObj<CardArgs>

// ── 1. Playground ────────────────────────────────────────────────────────────
export const Playground: Story = {
  render: (args) => ({
    setup() { return { args } },
    template: `
      <v-card
        :variant="args.variant"
        :color="args.color || undefined"
        :rounded="args.rounded"
        :border="args.border"
        :hover="args.hover"
        :elevation="args.elevation"
        style="max-width: 420px;"
      >
        <v-card-item>
          <v-card-title>{{ args.title }}</v-card-title>
          <v-card-subtitle>{{ args.subtitle }}</v-card-subtitle>
        </v-card-item>
        <v-card-text>{{ args.text }}</v-card-text>
        <v-card-actions>
          <v-btn variant="text" color="primary" class="text-none">Action</v-btn>
          <v-btn variant="text" class="text-none">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    `,
  }),
}

// ── 2. Variants ──────────────────────────────────────────────────────────────
/** Flat+border (default), tonal, and outlined variants. */
export const Variants: Story = {
  render: () => ({
    template: `
      <v-row dense>
        <v-col cols="12" md="4">
          <v-card variant="flat" border rounded="xl">
            <v-card-item>
              <v-card-title>Flat + Border</v-card-title>
              <v-card-subtitle>Design system default</v-card-subtitle>
            </v-card-item>
            <v-card-text>Use this for all content cards. Never use elevation shadows.</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card variant="tonal" color="primary" rounded="xl">
            <v-card-item>
              <v-card-title>Tonal</v-card-title>
              <v-card-subtitle>For highlighted sections</v-card-subtitle>
            </v-card-item>
            <v-card-text>Soft background derived from color. Good for info panels.</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card variant="outlined" rounded="xl">
            <v-card-item>
              <v-card-title>Outlined</v-card-title>
              <v-card-subtitle>Alternative border style</v-card-subtitle>
            </v-card-item>
            <v-card-text>Same visual as flat+border but uses Vuetify's built-in border.</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    `,
  }),
  parameters: { controls: { disable: true } },
}

// ── 3. KPI / Metric Cards ─────────────────────────────────────────────────────
/** Dashboard KPI cards with trend indicators. */
export const KpiCards: Story = {
  render: () => ({
    template: `
      <v-row dense>
        <v-col cols="6" md="3">
          <v-card variant="flat" border rounded="xl">
            <v-card-text class="d-flex align-center justify-space-between pa-5">
              <div>
                <div class="text-overline text-medium-emphasis">Total Revenue</div>
                <div class="text-h4 font-weight-bold mt-1">$84,230</div>
                <div class="text-caption text-success mt-1">↑ 12.4% vs last month</div>
              </div>
              <v-icon size="40" color="primary" opacity="0.25">mdi-cash-multiple</v-icon>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6" md="3">
          <v-card variant="flat" border rounded="xl">
            <v-card-text class="d-flex align-center justify-space-between pa-5">
              <div>
                <div class="text-overline text-medium-emphasis">Orders</div>
                <div class="text-h4 font-weight-bold mt-1">1,284</div>
                <div class="text-caption text-success mt-1">↑ 8.1% vs last month</div>
              </div>
              <v-icon size="40" color="secondary" opacity="0.25">mdi-cart-outline</v-icon>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6" md="3">
          <v-card variant="flat" border rounded="xl">
            <v-card-text class="d-flex align-center justify-space-between pa-5">
              <div>
                <div class="text-overline text-medium-emphasis">Contacts</div>
                <div class="text-h4 font-weight-bold mt-1">24,891</div>
                <div class="text-caption text-error mt-1">↓ 2.3% vs last month</div>
              </div>
              <v-icon size="40" color="success" opacity="0.25">mdi-account-group-outline</v-icon>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6" md="3">
          <v-card variant="flat" border rounded="xl">
            <v-card-text class="d-flex align-center justify-space-between pa-5">
              <div>
                <div class="text-overline text-medium-emphasis">Open Rate</div>
                <div class="text-h4 font-weight-bold mt-1">34.7%</div>
                <div class="text-caption text-warning mt-1">→ No change</div>
              </div>
              <v-icon size="40" color="warning" opacity="0.25">mdi-email-open-outline</v-icon>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    `,
  }),
  parameters: { controls: { disable: true } },
}

// ── 4. Color Accent Cards ─────────────────────────────────────────────────────
/** Tonal color accent cards for status highlights. */
export const ColorAccent: Story = {
  render: () => ({
    template: `
      <v-row dense>
        <v-col v-for="item in items" :key="item.color" cols="12" md="3">
          <v-card :variant="'tonal'" :color="item.color" rounded="xl">
            <v-card-text class="text-center pa-6">
              <v-icon size="32" :color="item.color" class="mb-3">{{ item.icon }}</v-icon>
              <div class="text-subtitle-1 font-weight-bold">{{ item.label }}</div>
              <div class="text-caption text-medium-emphasis">Tonal variant</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    `,
    setup() {
      return {
        items: [
          { color: 'primary', icon: 'mdi-lightning-bolt', label: 'Primary' },
          { color: 'success', icon: 'mdi-check-circle-outline', label: 'Success' },
          { color: 'warning', icon: 'mdi-alert-outline', label: 'Warning' },
          { color: 'error', icon: 'mdi-close-circle-outline', label: 'Error' },
        ],
      }
    },
  }),
  parameters: { controls: { disable: true } },
}

// ── 5. Clickable Cards ────────────────────────────────────────────────────────
/** Cards with hover effect for navigation or selection. */
export const Clickable: Story = {
  render: () => ({
    template: `
      <v-row dense>
        <v-col v-for="item in items" :key="item.title" cols="12" md="4">
          <v-card variant="flat" border rounded="xl" hover class="cursor-pointer">
            <v-card-text class="pa-5">
              <v-avatar :color="item.color" variant="tonal" size="44" rounded="lg" class="mb-4">
                <v-icon :color="item.color">{{ item.icon }}</v-icon>
              </v-avatar>
              <div class="text-subtitle-1 font-weight-bold mb-1">{{ item.title }}</div>
              <div class="text-body-2 text-medium-emphasis">{{ item.desc }}</div>
            </v-card-text>
            <v-card-actions class="px-5 pb-4 pt-0">
              <v-btn variant="text" color="primary" class="text-none px-0" append-icon="mdi-arrow-right" size="small">Configure</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    `,
    setup() {
      return {
        items: [
          { icon: 'mdi-storefront-outline', title: 'Store Setup', desc: 'Configure your online store channels', color: 'primary' },
          { icon: 'mdi-email-fast-outline', title: 'Email Campaigns', desc: 'Create and send targeted campaigns', color: 'secondary' },
          { icon: 'mdi-chart-line', title: 'Analytics', desc: 'Track performance and engagement metrics', color: 'success' },
        ],
      }
    },
  }),
  parameters: { controls: { disable: true } },
}

// ── 6. With Header Actions ────────────────────────────────────────────────────
/** Card with inline header actions — common data widget pattern. */
export const WithHeaderActions: Story = {
  render: () => ({
    template: `
      <v-card variant="flat" border rounded="xl" style="max-width: 480px;">
        <div class="d-flex align-center justify-space-between px-5 pt-4 pb-3 border-b">
          <div class="text-subtitle-1 font-weight-bold">Recent Orders</div>
          <v-btn variant="text" size="small" class="text-none text-primary" append-icon="mdi-arrow-right">View all</v-btn>
        </div>
        <v-list lines="two" class="py-2">
          <v-list-item v-for="order in orders" :key="order.num" :title="order.num + ' · ' + order.name" :subtitle="order.status">
            <template #append>
              <span class="font-weight-bold text-body-2">{{ order.amount }}</span>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    `,
    setup() {
      return {
        orders: [
          { num: '#10042', name: 'James Anderson', amount: '$284.00', status: 'Completed' },
          { num: '#10041', name: 'Sofia Martinez', amount: '$156.50', status: 'Processing' },
          { num: '#10040', name: 'Liam Johnson', amount: '$89.99', status: 'Shipped' },
        ],
      }
    },
  }),
  parameters: { controls: { disable: true } },
}
