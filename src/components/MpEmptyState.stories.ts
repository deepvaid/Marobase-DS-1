import type { Meta, StoryObj } from '@storybook/vue3'
import MpEmptyState from './MpEmptyState.vue'

const meta = {
  title: 'Feedback/MpEmptyState',
  component: MpEmptyState,
  tags: ['autodocs'],
  argTypes: {
    icon: { control: 'text' },
    title: { control: 'text' },
    description: { control: 'text' },
    actionLabel: { control: 'text' },
    actionIcon: { control: 'text' },
  },
} satisfies Meta<typeof MpEmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: 'mdi-package-variant-closed',
    title: 'No orders yet',
    description: 'Once customers start placing orders, they will appear here.',
    actionLabel: 'Create Draft Order',
    actionIcon: 'mdi-plus',
  },
}

export const Campaigns: Story = {
  args: {
    icon: 'mdi-email-outline',
    title: 'No campaigns yet',
    description: 'Create your first email campaign to engage your audience.',
    actionLabel: 'New Campaign',
    actionIcon: 'mdi-plus',
  },
}

export const SearchNoResults: Story = {
  args: {
    icon: 'mdi-magnify',
    title: 'No results found',
    description: 'Try adjusting your search or filter criteria.',
  },
}

export const Contacts: Story = {
  args: {
    icon: 'mdi-account-group-outline',
    title: 'No contacts yet',
    description: 'Import contacts or add them manually to start building your audience.',
    actionLabel: 'Import Contacts',
    actionIcon: 'mdi-upload',
  },
}
