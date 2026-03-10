import type { Meta, StoryObj } from '@storybook/vue3'
import MpStatusChip from './MpStatusChip.vue'

const meta = {
  title: 'Data Display/MpStatusChip',
  component: MpStatusChip,
  tags: ['autodocs'],
  argTypes: {
    status: { control: 'text' },
    type: {
      control: 'select',
      options: ['order', 'fulfillment', 'payment', 'campaign', 'contact', 'ticket', 'coupon', 'general'],
    },
    size: { control: 'select', options: ['x-small', 'small', 'default'] },
    variant: { control: 'select', options: ['flat', 'tonal', 'outlined'] },
    showIcon: { control: 'boolean' },
  },
} satisfies Meta<typeof MpStatusChip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { status: 'Processing', type: 'order' },
}

export const WithIcon: Story = {
  args: { status: 'Shipped', type: 'fulfillment', showIcon: true },
}

export const OrderStatuses: Story = {
  render: () => ({
    components: { MpStatusChip },
    template: `
      <div class="d-flex flex-wrap gap-2 align-center">
        <MpStatusChip status="Pending" type="order" />
        <MpStatusChip status="Processing" type="order" />
        <MpStatusChip status="Completed" type="order" />
        <MpStatusChip status="Cancelled" type="order" />
        <MpStatusChip status="Refunded" type="order" />
        <MpStatusChip status="On Hold" type="order" />
      </div>
    `,
  }),
}

export const FulfillmentStatuses: Story = {
  render: () => ({
    components: { MpStatusChip },
    template: `
      <div class="d-flex flex-wrap gap-2 align-center">
        <MpStatusChip status="Unapproved" type="fulfillment" showIcon />
        <MpStatusChip status="Not Ready" type="fulfillment" showIcon />
        <MpStatusChip status="Ready For Fulfillment" type="fulfillment" showIcon />
        <MpStatusChip status="Shipped" type="fulfillment" showIcon />
        <MpStatusChip status="Return Requested" type="fulfillment" showIcon />
        <MpStatusChip status="Cancelled" type="fulfillment" showIcon />
      </div>
    `,
  }),
}

export const PaymentStatuses: Story = {
  render: () => ({
    components: { MpStatusChip },
    template: `
      <div class="d-flex flex-wrap gap-2 align-center">
        <MpStatusChip status="Not Paid" type="payment" />
        <MpStatusChip status="Paid" type="payment" />
        <MpStatusChip status="Requires Action" type="payment" />
      </div>
    `,
  }),
}

export const CampaignStatuses: Story = {
  render: () => ({
    components: { MpStatusChip },
    template: `
      <div class="d-flex flex-wrap gap-2 align-center">
        <MpStatusChip status="Draft" type="campaign" />
        <MpStatusChip status="Scheduled" type="campaign" />
        <MpStatusChip status="Sending" type="campaign" />
        <MpStatusChip status="Sent" type="campaign" />
        <MpStatusChip status="Stopped" type="campaign" />
      </div>
    `,
  }),
}

export const AllTypes: Story = {
  render: () => ({
    components: { MpStatusChip },
    template: `
      <div>
        <h4 class="text-subtitle-2 mb-2">Order</h4>
        <div class="d-flex flex-wrap gap-2 mb-4">
          <MpStatusChip status="Processing" type="order" />
          <MpStatusChip status="Completed" type="order" />
          <MpStatusChip status="Cancelled" type="order" />
        </div>
        <h4 class="text-subtitle-2 mb-2">Fulfillment</h4>
        <div class="d-flex flex-wrap gap-2 mb-4">
          <MpStatusChip status="Shipped" type="fulfillment" showIcon />
          <MpStatusChip status="Ready For Fulfillment" type="fulfillment" showIcon />
          <MpStatusChip status="Unapproved" type="fulfillment" showIcon />
        </div>
        <h4 class="text-subtitle-2 mb-2">Payment</h4>
        <div class="d-flex flex-wrap gap-2 mb-4">
          <MpStatusChip status="Paid" type="payment" />
          <MpStatusChip status="Not Paid" type="payment" />
          <MpStatusChip status="Requires Action" type="payment" />
        </div>
        <h4 class="text-subtitle-2 mb-2">Campaign</h4>
        <div class="d-flex flex-wrap gap-2 mb-4">
          <MpStatusChip status="Draft" type="campaign" />
          <MpStatusChip status="Sent" type="campaign" />
          <MpStatusChip status="Stopped" type="campaign" />
        </div>
        <h4 class="text-subtitle-2 mb-2">Ticket</h4>
        <div class="d-flex flex-wrap gap-2 mb-4">
          <MpStatusChip status="Open" type="ticket" />
          <MpStatusChip status="In Progress" type="ticket" />
          <MpStatusChip status="Resolved" type="ticket" />
          <MpStatusChip status="Closed" type="ticket" />
        </div>
      </div>
    `,
  }),
}
