import type { Meta, StoryObj } from '@storybook/vue3'
import DvActionCard from './DvActionCard.vue'

const meta = {
  title: 'Copilot/DvActionCard',
  component: DvActionCard,
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'text',
      description: 'MDI icon name for the action card'
    },
    title: {
      control: 'text',
      description: 'Main title of the action card'
    },
    description: {
      control: 'text',
      description: 'Descriptive text explaining the action'
    },
    confirmLabel: {
      control: 'text',
      description: 'Label for the confirm button (default: "Confirm")'
    },
    color: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'error', 'info'],
      description: 'Color theme for the action card'
    }
  },
  parameters: {
    docs: {
      description: {
        component: `
## Overview
DvActionCard is a call-to-action component that presents a single action to the user with confirmation and cancellation options. It's designed for the AI copilot interface to suggest or prompt user actions.

## Do's
- Use for clear, single actions (not multi-step)
- Always provide a descriptive explanation
- Use appropriate colors (error for destructive actions)
- Keep titles concise and actionable
- Use relevant MDI icons to reinforce the action

## Don'ts
- Don't use for multiple conflicting actions
- Don't use overly long descriptions
- Don't change color meanings (error = destructive)
- Don't use without an icon for clarity

## Best Practices
- Use 'error' color only for destructive actions (delete, archive, etc.)
- Use 'success' color for positive actions (launch campaign, publish content)
- Use 'primary' color for standard actions
- Pair with DvInsightCard for related insights
        `
      }
    }
  }
} satisfies Meta<typeof DvActionCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: 'mdi-rocket-launch',
    title: 'Launch Campaign',
    description: 'Your email campaign is ready to send to 5,234 subscribers. Review settings and launch when ready.',
    confirmLabel: 'Launch Now',
    color: 'primary'
  }
}

export const CustomColor: Story = {
  args: {
    icon: 'mdi-content-save',
    title: 'Save as Template',
    description: 'Save this campaign configuration as a reusable template for future campaigns. You can apply it to similar audiences anytime.',
    confirmLabel: 'Save Template',
    color: 'success'
  }
}

export const DangerAction: Story = {
  args: {
    icon: 'mdi-trash-can',
    title: 'Delete Campaign',
    description: 'This action cannot be undone. All analytics data for this campaign will be permanently removed.',
    confirmLabel: 'Delete Campaign',
    color: 'error'
  }
}
