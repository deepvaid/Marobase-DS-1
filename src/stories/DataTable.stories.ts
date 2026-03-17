import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { VDataTable } from 'vuetify/components'

interface DataTableArgs {
  density: 'default' | 'comfortable' | 'compact'
  itemsPerPage: number
  fixedHeader: boolean
  hover: boolean
  showSelect: boolean
  loading: boolean
}

const mockOrders = [
  { id: '#ORD-001', customer: 'Jane Cooper', total: '$2,500.00', status: 'Completed', date: '2024-01-15' },
  { id: '#ORD-002', customer: 'Arlene McCoy', total: '$1,200.50', status: 'Processing', date: '2024-01-14' },
  { id: '#ORD-003', customer: 'Brooklyn Simmons', total: '$3,450.00', status: 'Pending', date: '2024-01-13' },
  { id: '#ORD-004', customer: 'Leslie Alexander', total: '$890.25', status: 'Completed', date: '2024-01-12' },
  { id: '#ORD-005', customer: 'Courtney Henry', total: '$5,120.00', status: 'Processing', date: '2024-01-11' },
  { id: '#ORD-006', customer: 'Ralph Edwards', total: '$755.00', status: 'Cancelled', date: '2024-01-10' },
  { id: '#ORD-007', customer: 'Darrell Steward', total: '$2,100.00', status: 'Completed', date: '2024-01-09' },
  { id: '#ORD-008', customer: 'Kathryn Murphy', total: '$1,650.75', status: 'Pending', date: '2024-01-08' },
]

const headers = [
  { title: 'Order #', key: 'id', sortable: true },
  { title: 'Customer', key: 'customer', sortable: true },
  { title: 'Total', key: 'total', sortable: true, align: 'end' as const },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Date', key: 'date', sortable: true },
]

const statusColors: Record<string, string> = {
  Completed: 'success',
  Processing: 'warning',
  Pending: 'info',
  Cancelled: 'error',
}

const meta = {
  title: 'Base/Data Table',
  component: VDataTable,
  tags: ['autodocs'],

  argTypes: {
    density: {
      control: 'select',
      options: ['default', 'comfortable', 'compact'],
      description: 'Row height density. Use `comfortable` as the Maropost default.',
      table: { category: 'Appearance', defaultValue: { summary: 'comfortable' } },
    },
    itemsPerPage: {
      control: { type: 'range', min: 5, max: 50, step: 5 },
      description: 'Number of rows shown per page.',
      table: { category: 'Behavior', defaultValue: { summary: '15' } },
    },
    fixedHeader: {
      control: 'boolean',
      description: 'Fixes the header row while scrolling. Always enable for long tables.',
      table: { category: 'Behavior', defaultValue: { summary: 'true' } },
    },
    hover: {
      control: 'boolean',
      description: 'Highlights the row under the cursor.',
      table: { category: 'Behavior', defaultValue: { summary: 'true' } },
    },
    showSelect: {
      control: 'boolean',
      description: 'Adds a checkbox column for row selection.',
      table: { category: 'Behavior', defaultValue: { summary: 'false' } },
    },
    loading: {
      control: 'boolean',
      description: 'Shows a loading progress bar at the top of the table.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
  },

  args: {
    density: 'comfortable',
    itemsPerPage: 15,
    fixedHeader: true,
    hover: true,
    showSelect: false,
    loading: false,
  },

  parameters: {
    docs: {
      description: {
        component: `### Overview
Vuetify's v-data-table configured with Maropost defaults: fixed headers, hover effects, comfortable density, and 15 rows per page.

Use the **Playground** story to interactively configure data table properties via the Controls panel.

### 🟢 Do's
- Use comfortable density for better readability
- Enable hover effects to highlight interactive rows
- Implement custom cell templates for complex content (statuses, badges, actions)
- Always pair with MpEmptyState when items are empty

### 🔴 Don'ts
- Use default density (too tight and cramped)
- Disable fixed headers (causes layout jank when scrolling)
- Forget to add empty states
- Use v-data-table for hierarchical data

### 💡 Best Practices
- Sort by meaningful columns first (ID, date, status)
- Limit visible columns to 6–8 max for clarity
- Provide bulk actions through floating bar when rows are selectable`,
      },
    },
  },
} satisfies Meta<DataTableArgs>

export default meta
type Story = StoryObj<DataTableArgs>

// ── 1. Playground ────────────────────────────────────────────────────────────
export const Playground: Story = {
  render: (args) => ({
    setup() {
      const selected = ref<string[]>([])
      return { args, headers, items: mockOrders, statusColors, selected }
    },
    template: `
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="items"
        :density="args.density"
        :items-per-page="args.itemsPerPage"
        :fixed-header="args.fixedHeader"
        :hover="args.hover"
        :show-select="args.showSelect"
        :loading="args.loading"
      >
        <template #item.status="{ item }">
          <v-chip :color="statusColors[item.status]" label size="small">{{ item.status }}</v-chip>
        </template>
      </v-data-table>
    `,
  }),
}

// ── 2. Default ────────────────────────────────────────────────────────────────
/** Standard Maropost table with status chip cells. */
export const Default: Story = {
  render: () => ({
    setup() { return { headers, items: mockOrders, statusColors } },
    template: `
      <v-data-table :headers="headers" :items="items" density="comfortable" :items-per-page="15" fixed-header hover>
        <template #item.status="{ item }">
          <v-chip :color="statusColors[item.status]" label size="small">{{ item.status }}</v-chip>
        </template>
      </v-data-table>
    `,
  }),
  parameters: { controls: { disable: true } },
}

// ── 3. With Selection ─────────────────────────────────────────────────────────
/** Table with checkbox row selection. */
export const WithSelection: Story = {
  render: () => ({
    setup() {
      const selected = ref<string[]>([])
      return { headers, items: mockOrders, statusColors, selected }
    },
    template: `
      <div>
        <div class="mb-4" v-if="selected.length > 0">
          <v-chip color="primary" label>{{ selected.length }} selected</v-chip>
        </div>
        <v-data-table v-model="selected" :headers="headers" :items="items" density="comfortable" :items-per-page="15" fixed-header hover show-select>
          <template #item.status="{ item }">
            <v-chip :color="statusColors[item.status]" label size="small">{{ item.status }}</v-chip>
          </template>
        </v-data-table>
      </div>
    `,
  }),
  parameters: { controls: { disable: true } },
}

// ── 4. Sortable ───────────────────────────────────────────────────────────────
/** Table with a default descending sort on the Date column. */
export const Sortable: Story = {
  render: () => ({
    setup() {
      const sortBy = ref([{ key: 'date', order: 'desc' as const }])
      return { headers, items: mockOrders, statusColors, sortBy }
    },
    template: `
      <v-data-table :headers="headers" :items="items" density="comfortable" :items-per-page="15" fixed-header hover :sort-by="sortBy" @update:sort-by="sortBy = $event">
        <template #item.status="{ item }">
          <v-chip :color="statusColors[item.status]" label size="small">{{ item.status }}</v-chip>
        </template>
      </v-data-table>
    `,
  }),
  parameters: { controls: { disable: true } },
}
