import type { Meta, StoryObj } from '@storybook/vue3'
import AppSidebar from './AppSidebar.vue'

const meta = {
  title: 'Layout/AppSidebar',
  component: AppSidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof AppSidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Expanded: Story = {
  render: () => ({
    components: { AppSidebar },
    template: `
      <v-layout style="height: 600px;">
        <AppSidebar />
        <v-main class="pa-6">
          <p class="text-body-1">Main content area next to the sidebar.</p>
        </v-main>
      </v-layout>
    `,
  }),
}
