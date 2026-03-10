import type { Meta, StoryObj } from '@storybook/vue3'
import MpSectionHeader from './MpSectionHeader.vue'

const meta = {
  title: 'Layout/MpSectionHeader',
  component: MpSectionHeader,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
  },
} satisfies Meta<typeof MpSectionHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { title: 'Recent Orders' },
}

export const WithActions: Story = {
  render: (args) => ({
    components: { MpSectionHeader },
    setup: () => ({ args }),
    template: `
      <MpSectionHeader v-bind="args">
        <template #actions>
          <v-btn size="small" variant="text">Last 7 days</v-btn>
          <v-btn size="small" variant="text" color="primary">View All</v-btn>
        </template>
      </MpSectionHeader>
    `,
  }),
  args: { title: 'Top Campaigns' },
}
