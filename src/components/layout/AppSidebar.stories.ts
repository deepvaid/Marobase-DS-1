import type { Meta, StoryObj } from '@storybook/vue3'
import AppSidebar from './AppSidebar.vue'
import { ref } from 'vue'

const meta = {
  title: 'Layout/AppSidebar',
  component: AppSidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
### Overview
\`AppSidebar\` is the primary left-hand navigation for the Maropost platform. It supports two modes: expanded (260px, showing labels) and rail/collapsed (showing icons only).

### Navigation Structure
Module groups with expandable sub-items (Analytics, Commerce, Marketing, etc.) plus single-route items (Dashboard, Integrations, **Settings**). All Settings sub-pages (Users, Billing, Profile) live as panels inside \`/settings\` — no separate URLs.

### 🟢 Do's
- **Do** use the rail mode on smaller viewports for a compact sidebar.
- **Do** wrap it in a \`v-layout\` alongside \`AppBar\` and \`v-main\` for proper page structure.
- **Do** keep Settings as a single direct link — sub-pages are handled by the Settings panel tabs.

### 🔴 Don'ts
- **Don't** add sub-links to Settings in the sidebar; use the left-nav inside the Settings page instead.
- **Don't** put page-specific actions in the sidebar. Navigation only.
- **Don't** render more than one sidebar per page.

### 💡 Best Practices
- The sidebar width follows design tokens: 260px expanded, 72px rail.
- Navigation items are grouped by module: Commerce, Marketing, Contacts, Products, etc.
        `,
      },
    },
  },
  argTypes: {
    modelValue: { control: 'boolean', description: 'Controls sidebar visibility (v-model)' },
    rail: { control: 'boolean', description: 'Collapse to icon-only rail mode (v-model:rail)' },
  },
} satisfies Meta<typeof AppSidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Expanded: Story = {
  render: () => ({
    components: { AppSidebar },
    setup() {
      const open = ref(true)
      const rail = ref(false)
      return { open, rail }
    },
    template: `
      <v-layout style="height: 600px;">
        <AppSidebar v-model="open" v-model:rail="rail" />
        <v-main class="pa-6">
          <p class="text-body-1">Sidebar is <strong>expanded</strong> (260px). Toggle the rail prop to collapse it.</p>
        </v-main>
      </v-layout>
    `,
  }),
}

export const CollapsedRail: Story = {
  render: () => ({
    components: { AppSidebar },
    setup() {
      const open = ref(true)
      const rail = ref(true)
      return { open, rail }
    },
    template: `
      <v-layout style="height: 600px;">
        <AppSidebar v-model="open" v-model:rail="rail" />
        <v-main class="pa-6">
          <p class="text-body-1">Sidebar is in <strong>rail mode</strong> (icon-only, 72px).</p>
        </v-main>
      </v-layout>
    `,
  }),
}
