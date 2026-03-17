import type { Meta, StoryObj } from '@storybook/vue3'
import DvDataTable from './DvDataTable.vue'

const meta = {
  title: 'Copilot/DvDataTable',
  component: DvDataTable,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Optional title for the data table'
    },
    headers: {
      description: 'Column headers for the table',
      control: false
    },
    rows: {
      description: 'Array of row data (each row is an array of cell values)',
      control: false
    }
  },
  parameters: {
    docs: {
      description: {
        component: `
## Overview
DvDataTable is a simple, clean table component for displaying structured data in the AI copilot dashboard. It supports multiple columns and rows with an optional title.

## Do's
- Use for displaying lists of products, customers, or metrics
- Keep header names short and descriptive
- Align data appropriately (numbers right-aligned, text left-aligned)
- Include relevant context in the title
- Use for read-only data display

## Don'ts
- Don't use for very large datasets without pagination
- Don't mix data types in a way that confuses readers
- Don't use without clear column headers
- Don't use for interactive forms or editable data

## Best Practices
- Sort by most relevant column (sales, date, etc.)
- Format numbers with thousands separators
- Use consistent date formatting
- Keep rows scannable with good spacing
- Limit to 5-8 columns for readability
        `
      }
    }
  }
} satisfies Meta<typeof DvDataTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Top Products',
    headers: ['Product', 'Sales', 'Revenue', 'Profit Margin'],
    rows: [
      ['Premium Wireless Headphones', '1,234', '$61,700', '32%'],
      ['Designer Backpack', '956', '$47,800', '28%'],
      ['Smart Watch Pro', '842', '$50,520', '35%'],
      ['Leather Wallet', '2,103', '$42,060', '22%'],
      ['USB-C Fast Charger', '3,456', '$34,560', '18%']
    ]
  }
}

export const CustomerTable: Story = {
  args: {
    title: 'Top Customers',
    headers: ['Customer Name', 'Total Orders', 'Lifetime Value', 'Last Purchase'],
    rows: [
      ['Sarah Johnson', '24', '$4,892', '2 days ago'],
      ['Michael Chen', '18', '$3,456', '1 week ago'],
      ['Emma Rodriguez', '31', '$6,234', '3 days ago'],
      ['James Williams', '15', '$2,890', '2 weeks ago'],
      ['Lisa Martinez', '27', '$5,123', '5 days ago']
    ]
  }
}
