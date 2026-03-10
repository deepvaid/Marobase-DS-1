import type { Meta, StoryObj } from '@storybook/vue3'
import MpFloatingBulkBar from './MpFloatingBulkBar.vue'
import { ref } from 'vue'

const meta = {
  title: 'Feedback/MpFloatingBulkBar',
  component: MpFloatingBulkBar,
  tags: ['autodocs'],
  argTypes: {
    count: { control: { type: 'number', min: 0, max: 100 } },
  },
} satisfies Meta<typeof MpFloatingBulkBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { MpFloatingBulkBar },
    setup() {
      const count = ref(5)
      return { count }
    },
    template: `
      <div style="min-height: 200px; position: relative;">
        <div class="d-flex gap-2 mb-4">
          <v-btn size="small" @click="count++">Select more</v-btn>
          <v-btn size="small" @click="count = Math.max(0, count - 1)">Deselect one</v-btn>
        </div>
        <MpFloatingBulkBar :count="count" @clear="count = 0">
          <v-btn size="small" variant="outlined" prepend-icon="mdi-truck-delivery">Fulfill</v-btn>
          <v-btn size="small" variant="outlined" prepend-icon="mdi-download">Export</v-btn>
          <v-btn size="small" variant="outlined" color="error" prepend-icon="mdi-delete">Delete</v-btn>
        </MpFloatingBulkBar>
      </div>
    `,
  }),
}

export const WithThreeSelected: Story = {
  args: { count: 3 },
  render: (args) => ({
    components: { MpFloatingBulkBar },
    setup: () => ({ args }),
    template: `
      <div style="min-height: 200px; position: relative;">
        <MpFloatingBulkBar v-bind="args">
          <v-btn size="small" variant="outlined" prepend-icon="mdi-tag">Tag</v-btn>
          <v-btn size="small" variant="outlined" prepend-icon="mdi-email">Email</v-btn>
        </MpFloatingBulkBar>
      </div>
    `,
  }),
}
