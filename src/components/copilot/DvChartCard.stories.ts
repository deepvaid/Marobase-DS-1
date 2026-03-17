import type { Meta, StoryObj } from '@storybook/vue3'
import DvChartCard from './DvChartCard.vue'

const meta = {
  title: 'Copilot/DvChartCard',
  component: DvChartCard,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Main title of the chart'
    },
    subtitle: {
      control: 'text',
      description: 'Optional subtitle or time range'
    },
    bars: {
      description: 'Array of arrays, each inner array represents values for a data series',
      control: false
    },
    labels: {
      description: 'X-axis labels for each bar group',
      control: false
    },
    seriesNames: {
      description: 'Names for each data series (appears in legend if provided)',
      control: false
    }
  },
  parameters: {
    docs: {
      description: {
        component: `
## Overview
DvChartCard displays bar chart data with support for single or multi-series visualization. It's designed to show performance metrics, trends, and comparisons in the AI copilot dashboard.

## Do's
- Use for comparing metrics across time periods or categories
- Provide clear, descriptive titles
- Use seriesNames for multi-series data
- Keep data sets reasonably sized for clarity
- Use consistent color schemes

## Don'ts
- Don't use for more than 3-4 series (becomes hard to read)
- Don't use without clear axis labels
- Don't show data with extreme value ranges without scaling
- Don't omit legends for multi-series charts

## Best Practices
- Use for revenue, traffic, conversion trends
- Include time period in subtitle (e.g., "Last 12 Months")
- Sort categories logically (chronological, alphabetical, or by value)
- Provide context about what metrics mean
        `
      }
    }
  }
} satisfies Meta<typeof DvChartCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Revenue by Month',
    subtitle: 'Last 12 Months',
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    bars: [[24000, 28000, 32000, 29000, 35000, 41000, 38000, 43000, 47000, 51000, 48000, 56000]]
  }
}

export const WithLegend: Story = {
  args: {
    title: 'Revenue Comparison',
    subtitle: 'This Year vs Last Year',
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    seriesNames: ['This Year', 'Last Year'],
    bars: [
      [24000, 28000, 32000, 29000, 35000, 41000],
      [18000, 22000, 25000, 23000, 28000, 32000]
    ]
  }
}
