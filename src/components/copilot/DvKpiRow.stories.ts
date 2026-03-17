import type { Meta, StoryObj } from '@storybook/vue3'
import DvKpiRow from './DvKpiRow.vue'

const meta = {
  title: 'Copilot/DvKpiRow',
  component: DvKpiRow,
  tags: ['autodocs'],
  argTypes: {
    kpis: {
      description: 'Array of KPI objects with label, value, trend, trendUp, and icon',
      control: false
    }
  },
  parameters: {
    docs: {
      description: {
        component: `
## Overview
DvKpiRow displays a horizontal row of key performance indicators with values, trends, and icons. Perfect for dashboard headers and quick metric overviews in the copilot interface.

## Do's
- Use for displaying 3-4 related metrics
- Show trend indicators with clear up/down direction
- Include relevant icons to reinforce metrics
- Use for quick snapshot of performance
- Always include meaningful trend data

## Don'ts
- Don't display more than 4 KPIs in a single row (use multiple rows)
- Don't use inconsistent formatting across KPIs
- Don't hide trend information
- Don't use icons that contradict the metric

## Best Practices
- Group related metrics (revenue, AOV, conversion for commerce)
- Use green for positive trends, red for negative
- Format large numbers with abbreviations (e.g., $1.2M, 45.3K)
- Include percentage changes in trend (e.g., "+12% vs last month")
- Use consistent icon sizing and positioning
        `
      }
    }
  }
} satisfies Meta<typeof DvKpiRow>

export default meta
type Story = StoryObj<typeof meta>

export const RevenueKpis: Story = {
  args: {
    kpis: [
      {
        label: 'Total Revenue',
        value: '$287,450',
        trend: '+18% vs Last Month',
        trendUp: true,
        icon: 'mdi-cash-multiple'
      },
      {
        label: 'Average Order Value',
        value: '$127.50',
        trend: '+5.2% vs Last Month',
        trendUp: true,
        icon: 'mdi-shopping-cart'
      },
      {
        label: 'Conversion Rate',
        value: '4.23%',
        trend: '-0.5% vs Last Month',
        trendUp: false,
        icon: 'mdi-percent'
      },
      {
        label: 'Customer Count',
        value: '2,254',
        trend: '+342 New Customers',
        trendUp: true,
        icon: 'mdi-account-multiple'
      }
    ]
  }
}

export const MarketingKpis: Story = {
  args: {
    kpis: [
      {
        label: 'Email Open Rate',
        value: '28.4%',
        trend: '+4.2% vs Last Campaign',
        trendUp: true,
        icon: 'mdi-email-open'
      },
      {
        label: 'Click-Through Rate',
        value: '6.8%',
        trend: '+1.1% vs Last Campaign',
        trendUp: true,
        icon: 'mdi-cursor-default-click'
      },
      {
        label: 'Campaign Reach',
        value: '145.2K',
        trend: '+23K Contacts',
        trendUp: true,
        icon: 'mdi-bullhorn'
      },
      {
        label: 'Subscriber Growth',
        value: '8,342',
        trend: '+356 this month',
        trendUp: true,
        icon: 'mdi-account-plus'
      }
    ]
  }
}
