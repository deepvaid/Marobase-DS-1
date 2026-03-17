import type { Meta, StoryObj } from '@storybook/vue3'
import DvJourneyCard from './DvJourneyCard.vue'

const meta = {
  title: 'Copilot/DvJourneyCard',
  component: DvJourneyCard,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Name of the journey/automation sequence'
    },
    steps: {
      description: 'Array of journey steps with type and label',
      control: false
    }
  },
  parameters: {
    docs: {
      description: {
        component: `
## Overview
DvJourneyCard displays the structure of an automated customer journey or workflow sequence. It visualizes the flow of triggers, actions, and conditions in a vertically stacked format.

## Do's
- Use for visualizing automated marketing workflows
- Show clear step-by-step progression
- Use appropriate step types (trigger, action, condition, etc.)
- Include clear labels for each step
- Use for journey recommendations and templates

## Don'ts
- Don't use for complex branching logic without visual indicators
- Don't mix unrelated journeys in one card
- Don't use without clear step labels
- Don't show more than 8-10 steps in a single view

## Best Practices
- Always start with a trigger step
- Include conditions for personalization
- Show both email and SMS actions where appropriate
- Use descriptive labels for wait periods (e.g., "Wait 2 days")
- Group related journeys by business purpose (onboarding, retention, etc.)
        `
      }
    }
  }
} satisfies Meta<typeof DvJourneyCard>

export default meta
type Story = StoryObj<typeof meta>

export const WelcomeSeries: Story = {
  args: {
    name: 'Welcome Onboarding Series',
    steps: [
      {
        type: 'trigger',
        label: 'New Subscriber Signup'
      },
      {
        type: 'email',
        label: 'Send Welcome Email'
      },
      {
        type: 'wait',
        label: 'Wait 1 Day'
      },
      {
        type: 'email',
        label: 'Send Product Recommendations'
      },
      {
        type: 'wait',
        label: 'Wait 3 Days'
      },
      {
        type: 'condition',
        label: 'Has Made Purchase?'
      },
      {
        type: 'action',
        label: 'Update Segment: VIP Customers'
      }
    ]
  }
}

export const AbandonedCartRecovery: Story = {
  args: {
    name: 'Cart Abandonment Recovery',
    steps: [
      {
        type: 'trigger',
        label: 'Cart Abandoned (30+ min)'
      },
      {
        type: 'wait',
        label: 'Wait 1 Hour'
      },
      {
        type: 'email',
        label: 'Send Cart Reminder Email'
      },
      {
        type: 'wait',
        label: 'Wait 24 Hours'
      },
      {
        type: 'condition',
        label: 'Was Cart Recovered?'
      },
      {
        type: 'email',
        label: 'Send Second Reminder with 10% Off'
      },
      {
        type: 'wait',
        label: 'Wait 48 Hours'
      },
      {
        type: 'sms',
        label: 'Send Final SMS with Discount Code'
      }
    ]
  }
}
