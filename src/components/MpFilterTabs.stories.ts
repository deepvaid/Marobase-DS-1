import type { Meta, StoryObj } from '@storybook/vue3'
import MpFilterTabs from './MpFilterTabs.vue'
import { ref } from 'vue'

const meta = {
  title: 'Navigation/MpFilterTabs',
  component: MpFilterTabs,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'text', description: 'Active tab key (v-model)' },
    tabs: { control: 'object', description: 'Array of tab objects with label, key, and optional count' },
  },
  parameters: {
    docs: {
      description: {
        component: `
### Overview
\`MpFilterTabs\` provides horizontal navigation within a page or component, typically used to filter segmented data sets (like "All", "Drafts", "Sent").

### 🟢 Do's
- **Do** keep tab labels short (1-2 words maximum).
- **Do** include item \`count\`s when available to give users a preview of how much data exists in that segment before clicking.
- **Do** ensure there is always an "All" or an equivalent default active tab to show the complete dataset when nothing is filtered.

### 🔴 Don'ts
- **Don't** use more than 5-6 tabs. If you have too many categories, consider using a \`v-select\` dropdown filter instead.
- **Don't** use tabs for multi-selection. Tabs are strictly mutually exclusive views. Use Checkboxes or Chip Groups for multi-select.
- **Don't** mix tabs with counts and tabs without counts in the same group. Keep the data structure consistent within the component.

### 💡 Best Practices
- **Initial State:** Always v-model the active state to the \`key\` of one of your tabs upon initialization so the UI doesn't load visually un-selected.
- **Responsive:** The component automatically handles horizontal scrolling on smaller screens via \`overflow-x-auto\` and \`hide-scrollbar\`.
        `,
      },
    },
  },
} satisfies Meta<typeof MpFilterTabs>

export default meta
type Story = StoryObj<typeof meta>

export const OrderTabs: Story = {
  render: () => ({
    components: { MpFilterTabs },
    setup() {
      const active = ref('all')
      return { active }
    },
    template: `
      <MpFilterTabs
        v-model="active"
        :tabs="[
          { label: 'All', key: 'all', count: 1471 },
          { label: 'Completed', key: 'completed', count: 892 },
          { label: 'Processing', key: 'processing', count: 234 },
          { label: 'Not Fulfilled', key: 'unfulfilled', count: 345 },
        ]"
      />
      <p class="text-body-2 text-medium-emphasis mt-4">Active tab: {{ active }}</p>
    `,
  }),
}

export const CampaignTabs: Story = {
  render: () => ({
    components: { MpFilterTabs },
    setup() {
      const active = ref('all')
      return { active }
    },
    template: `
      <MpFilterTabs
        v-model="active"
        :tabs="[
          { label: 'All', key: 'all', count: 8 },
          { label: 'Drafts', key: 'drafts', count: 2 },
          { label: 'Scheduled', key: 'scheduled', count: 1 },
          { label: 'Sent', key: 'sent', count: 5 },
        ]"
      />
    `,
  }),
}

export const NoCounts: Story = {
  render: () => ({
    components: { MpFilterTabs },
    setup() {
      const active = ref('overview')
      return { active }
    },
    template: `
      <MpFilterTabs
        v-model="active"
        :tabs="[
          { label: 'Overview', key: 'overview' },
          { label: 'Email', key: 'email' },
          { label: 'Commerce', key: 'commerce' },
          { label: 'Audience', key: 'audience' },
        ]"
      />
    `,
  }),
  args: {} as any, // Fixes TS strict mode error for missing args on meta type
}
