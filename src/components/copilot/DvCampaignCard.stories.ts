import type { Meta, StoryObj } from '@storybook/vue3'
import DvCampaignCard from './DvCampaignCard.vue'

const meta = {
  title: 'Copilot/DvCampaignCard',
  component: DvCampaignCard,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Campaign name'
    },
    subject: {
      control: 'text',
      description: 'Email subject line or campaign headline'
    },
    audience: {
      control: 'text',
      description: 'Target audience or segment name'
    },
    audienceSize: {
      control: 'number',
      description: 'Number of contacts in the target audience'
    },
    sendTime: {
      control: 'text',
      description: 'Scheduled send time or delivery window'
    },
    channel: {
      control: 'text',
      description: 'Communication channel (Email, SMS, Push, etc.)'
    },
    status: {
      control: 'select',
      options: ['draft', 'scheduled', 'sent', 'paused'],
      description: 'Current campaign status'
    }
  },
  parameters: {
    docs: {
      description: {
        component: `
## Overview
DvCampaignCard displays a summary of a marketing campaign with key details like subject, audience, and send time. It provides quick actions to launch or edit the campaign.

## Do's
- Show complete campaign overview at a glance
- Use for listing suggested or recent campaigns
- Always include audience size for context
- Display channel prominently
- Use status badges to indicate campaign state

## Don'ts
- Don't truncate subject lines unnecessarily
- Don't hide audience size information
- Don't use without a clear action button
- Don't show incomplete campaign data

## Best Practices
- Sort campaigns by send time or status
- Show estimated reach or engagement projections
- Include preview of subject line or message content
- Pair with DvInsightCard for performance metrics
        `
      }
    }
  }
} satisfies Meta<typeof DvCampaignCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: 'Spring Sale - Email Campaign',
    subject: 'Limited Time: Save 30% on Spring Collection',
    audience: 'Active Customers (Last 90 Days)',
    audienceSize: 5234,
    sendTime: 'Tomorrow at 10:00 AM EST',
    channel: 'Email',
    status: 'draft'
  }
}

export const SMSCampaign: Story = {
  args: {
    name: 'Cart Recovery - SMS',
    subject: 'Your items are waiting! Complete your purchase today.',
    audience: 'Cart Abandoners (Last 7 Days)',
    audienceSize: 1847,
    sendTime: 'Today at 2:30 PM EST',
    channel: 'SMS',
    status: 'scheduled'
  }
}
