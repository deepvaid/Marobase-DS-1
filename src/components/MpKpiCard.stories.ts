import type { Meta, StoryObj } from '@storybook/vue3'
import MpKpiCard from './MpKpiCard.vue'

const meta = {
  title: 'Data Display/MpKpiCard',
  component: MpKpiCard,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    icon: { control: 'text' },
    color: { control: 'select', options: ['primary', 'success', 'warning', 'error', 'secondary'] },
    trend: { control: 'text' },
    trendPositive: { control: 'boolean' },
    subStat: { control: 'text' },
  },
} satisfies Meta<typeof MpKpiCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Total Revenue',
    value: '$12,430',
    icon: 'mdi-currency-usd',
    color: 'success',
    trend: '+12.5%',
    trendPositive: true,
    subStat: 'vs last month',
  },
}

export const NegativeTrend: Story = {
  args: {
    label: 'Bounce Rate',
    value: '4.2%',
    icon: 'mdi-email-alert-outline',
    color: 'error',
    trend: '-2.1%',
    trendPositive: false,
    subStat: 'vs last week',
  },
}

export const NoTrend: Story = {
  args: {
    label: 'Active Campaigns',
    value: '8',
    icon: 'mdi-bullhorn-outline',
    color: 'primary',
  },
}

export const DashboardRow: Story = {
  render: () => ({
    components: { MpKpiCard },
    template: `
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <MpKpiCard label="Total Revenue" value="$12,430" icon="mdi-currency-usd" color="success" trend="+12.5%" :trendPositive="true" subStat="vs last month" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <MpKpiCard label="Orders Today" value="47" icon="mdi-package-variant-closed" color="primary" trend="+8" :trendPositive="true" subStat="vs yesterday" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <MpKpiCard label="Active Campaigns" value="8" icon="mdi-bullhorn-outline" color="secondary" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <MpKpiCard label="Open Rate" value="24.3%" icon="mdi-email-open-outline" color="warning" trend="-1.2%" :trendPositive="false" subStat="vs avg" />
        </v-col>
      </v-row>
    `,
  }),
}
