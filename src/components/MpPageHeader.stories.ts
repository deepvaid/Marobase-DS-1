import type { Meta, StoryObj } from '@storybook/vue3'
import MpPageHeader from './MpPageHeader.vue'

const meta = {
  title: 'Layout/MpPageHeader',
  component: MpPageHeader,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
  },
} satisfies Meta<typeof MpPageHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Sales Orders',
    subtitle: 'Manage and fulfill customer orders',
  },
}

export const WithBreadcrumbs: Story = {
  args: {
    title: 'Email Campaigns',
    subtitle: 'Create and manage your email campaigns',
    breadcrumbs: [
      { title: 'Marketing', to: '/marketing' },
      { title: 'Campaigns', disabled: true },
    ],
  },
}

export const WithActions: Story = {
  render: (args) => ({
    components: { MpPageHeader },
    setup: () => ({ args }),
    template: `
      <MpPageHeader v-bind="args">
        <template #actions>
          <v-btn variant="outlined" class="mr-2">Import</v-btn>
          <v-btn color="primary" prepend-icon="mdi-plus">New Campaign</v-btn>
        </template>
      </MpPageHeader>
    `,
  }),
  args: {
    title: 'Email Campaigns',
    subtitle: 'Create and manage your email campaigns',
    breadcrumbs: [
      { title: 'Marketing', to: '/marketing' },
      { title: 'Campaigns', disabled: true },
    ],
  },
}

export const TitleOnly: Story = {
  args: {
    title: 'Dashboard',
  },
}
