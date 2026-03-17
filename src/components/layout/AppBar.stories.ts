import type { Meta, StoryObj } from '@storybook/vue3'
import AppBar from './AppBar.vue'

const meta = {
  title: 'Layout/AppBar',
  component: AppBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
### Overview
\`AppBar\` is the main top navigation bar of the Maropost platform. It provides global search, notification bell, Da Vinci AI toggle, and the user profile menu.

### 🟢 Do's
- **Do** always render it inside a \`v-layout\` wrapper so it integrates properly with the sidebar and main content area.
- **Do** use it as a singleton — only one AppBar should exist per page.

### 🔴 Don'ts
- **Don't** add page-level actions to the AppBar — those belong in \`MpPageHeader\`.
- **Don't** override its height; it follows the design token \`appbar: 56px\`.

### 💡 Best Practices
- The AppBar is fixed to the top. All page content should account for its 56px height via \`v-main\`.
        `,
      },
    },
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

export const ProfileMenuOpen: Story = {
  name: 'Profile Menu (Open)',
  render: () => ({
    components: { AppBar },
    template: `
      <v-layout>
        <AppBar />
        <v-main class="pa-6">
          <p class="text-body-1 text-medium-emphasis">Click the user avatar at top-right to see the profile dropdown with grouped items, role badge, and section headers.</p>
        </v-main>
      </v-layout>
    `,
  }),
  play: async ({ canvasElement }) => {
    // Auto-open the profile dropdown for Storybook preview
    await new Promise(resolve => setTimeout(resolve, 500))
    const trigger = canvasElement.querySelector('.user-menu-trigger') as HTMLElement
    if (trigger) trigger.click()
  },
}
