import type { Meta, StoryObj } from '@storybook/vue3'
import AppBar from './AppBar.vue'

const meta = {
  title: 'Layout/AppBar',
  component: AppBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof AppBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { AppBar },
    template: `
      <v-layout>
        <AppBar />
        <v-main class="pa-6">
          <p class="text-body-1">Main content area below the app bar.</p>
        </v-main>
      </v-layout>
    `,
  }),
}
