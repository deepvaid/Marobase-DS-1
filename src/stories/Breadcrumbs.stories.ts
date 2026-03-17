import type { Meta, StoryObj } from '@storybook/vue3'
import { VBreadcrumbs } from 'vuetify/components'

interface BreadcrumbArgs {
  divider: string
  density: 'default' | 'comfortable' | 'compact'
  rounded: '0' | 'sm' | 'lg' | 'xl' | 'pill'
  color: string
  activeColor: string
  disabled: boolean
}

const meta = {
  title: 'Base/Breadcrumbs',
  component: VBreadcrumbs,
  tags: ['autodocs'],

  argTypes: {
    divider: {
      control: 'text',
      description: 'Divider character or MDI icon between breadcrumb items.',
      table: { category: 'Appearance', defaultValue: { summary: '/' } },
    },
    density: {
      control: 'select',
      options: ['default', 'comfortable', 'compact'],
      description: 'Controls vertical padding.',
      table: { category: 'Appearance', defaultValue: { summary: 'default' } },
    },
    rounded: {
      control: 'select',
      options: ['0', 'sm', 'lg', 'xl', 'pill'],
      description: 'Border-radius preset.',
      table: { category: 'Appearance', defaultValue: { summary: '0' } },
    },
    color: {
      control: 'text',
      description: 'Color applied to breadcrumb links.',
      table: { category: 'Appearance', defaultValue: { summary: '—' } },
    },
    activeColor: {
      control: 'text',
      description: 'Color of the active (current) breadcrumb item.',
      table: { category: 'Appearance', defaultValue: { summary: '—' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables all breadcrumb items.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
  },

  args: {
    divider: '/',
    density: 'default',
    rounded: '0',
    color: '',
    activeColor: '',
    disabled: false,
  },

  parameters: {
    docs: {
      description: {
        component: `### Overview
v-breadcrumbs displays the current page's location within a site hierarchy. It provides a clickable navigation trail that helps users understand where they are and navigate back up the hierarchy.

Use the **Playground** story to interactively configure breadcrumb properties via the Controls panel.

### 🟢 Do's
- Always show breadcrumbs for nested pages (2+ levels deep)
- Include the home icon/link as the first item
- Use for hierarchical navigation within a section
- Keep breadcrumb trail to 4 levels or fewer
- Make items clickable for back-navigation

### 🔴 Don'ts
- Don't show breadcrumbs for top-level pages
- Don't use more than 4-5 levels deep (collapse earlier levels)
- Don't make breadcrumbs larger than supporting text
- Don't use breadcrumbs for step-by-step processes (use a stepper)

### 💡 Best Practices
- Use consistent divider characters (forward slash or chevron)
- Match breadcrumb hierarchy to actual page structure
- Highlight the current page (no link) at the end
- Include icons for the home item for instant recognition
- Test on mobile to ensure proper truncation behavior`,
      },
    },
  },
} satisfies Meta<BreadcrumbArgs>

export default meta
type Story = StoryObj<BreadcrumbArgs>

const sampleItems = [
  { title: 'Home', href: '#/' },
  { title: 'Commerce', href: '#/commerce' },
  { title: 'Sales Orders', href: '#/commerce/orders' },
  { title: 'Order #12345' },
]

// ── 1. Playground (interactive) ─────────────────────────────────────────────
export const Playground: Story = {
  render: (args) => ({
    setup() { return { args, items: sampleItems } },
    template: `
      <v-breadcrumbs
        :items="items"
        :divider="args.divider"
        :density="args.density"
        :rounded="args.rounded"
        :color="args.color || undefined"
        :active-color="args.activeColor || undefined"
        :disabled="args.disabled"
      />
    `,
  }),
}

// ── 2. Default ──────────────────────────────────────────────────────────────
/** Standard breadcrumb trail with slash dividers. */
export const Default: Story = {
  render: () => ({
    template: `
      <v-breadcrumbs :items="[
        { title: 'Home', href: '#/' },
        { title: 'Commerce', href: '#/commerce' },
        { title: 'Sales Orders', href: '#/commerce/orders' },
        { title: 'Order #12345' }
      ]" />
    `,
  }),
  parameters: { controls: { disable: true } },
}

// ── 3. With Icons ───────────────────────────────────────────────────────────
/** Breadcrumbs with a home icon on the first item. */
export const WithIcons: Story = {
  render: () => ({
    template: `
      <v-breadcrumbs :items="[
        { title: 'Home', href: '#/', icon: 'mdi-home' },
        { title: 'Products', href: '#/products' },
        { title: 'Electronics', href: '#/products/electronics' },
        { title: 'Laptops' }
      ]" />
    `,
  }),
  parameters: { controls: { disable: true } },
}

// ── 4. Custom Divider ───────────────────────────────────────────────────────
/** Chevron divider instead of the default slash. */
export const CustomDivider: Story = {
  render: () => ({
    template: `
      <v-breadcrumbs
        :items="[
          { title: 'Dashboard', href: '#/' },
          { title: 'Marketing', href: '#/marketing' },
          { title: 'Campaigns', href: '#/marketing/campaigns' },
          { title: 'Summer Sale' }
        ]"
        divider="mdi-chevron-right"
      />
    `,
  }),
  parameters: { controls: { disable: true } },
}
