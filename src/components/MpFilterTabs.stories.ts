import type { Meta, StoryObj } from '@storybook/vue3'
import MpFilterTabs from './MpFilterTabs.vue'
import { ref } from 'vue'

const meta = {
  title: 'Navigation/MpFilterTabs',
  component: MpFilterTabs,
  tags: ['autodocs'],
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
}
