<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  status: string
  type?: 'order' | 'fulfillment' | 'payment' | 'campaign' | 'contact' | 'ticket' | 'coupon' | 'general'
  size?: 'x-small' | 'small' | 'default'
  variant?: 'flat' | 'tonal' | 'outlined'
  showIcon?: boolean
}>(), {
  type: 'general',
  size: 'small',
  variant: 'tonal',
  showIcon: false,
})

const colorMap: Record<string, Record<string, string>> = {
  order: {
    'Processing': 'info', 'Completed': 'success', 'Cancelled': 'grey-darken-1',
    'Refunded': 'error', 'On Hold': 'warning',
  },
  fulfillment: {
    'Unapproved': 'warning', 'Not Ready': 'grey', 'Ready For Fulfillment': 'info',
    'Shipped': 'success', 'Return Requested': 'error', 'Cancelled': 'grey-darken-1',
    'Fulfilled': 'success', 'Unfulfilled': 'warning', 'Partial': 'info',
  },
  payment: {
    'Paid': 'success', 'Refunded': 'error', 'Voided': 'grey', 'Pending': 'warning',
  },
  campaign: {
    'Sent': 'success', 'Scheduled': 'info', 'Draft': 'grey-darken-1', 'Sending': 'warning',
    'Active': 'success', 'Paused': 'warning', 'Completed': 'success', 'Failed': 'error',
  },
  contact: {
    'Active': 'success', 'Unsubscribed': 'grey', 'Bounced': 'error', 'Pending': 'warning',
  },
  ticket: {
    'Open': 'info', 'In Progress': 'warning', 'Awaiting Reply': 'secondary',
    'Resolved': 'success', 'Closed': 'grey',
  },
  coupon: {
    'Active': 'success', 'Expired': 'grey', 'Scheduled': 'info', 'Used': 'secondary',
  },
  general: {
    'Active': 'success', 'Inactive': 'grey', 'Pending': 'warning', 'Error': 'error',
    'Published': 'success', 'Draft': 'grey-darken-1', 'Archived': 'grey',
  },
}

const iconMap: Record<string, Record<string, string>> = {
  campaign: {
    'Sent': 'mdi-check', 'Scheduled': 'mdi-calendar-clock',
    'Draft': 'mdi-pencil-outline', 'Sending': 'mdi-truck-fast-outline',
  },
  fulfillment: {
    'Unapproved': 'mdi-alert-circle-outline', 'Not Ready': 'mdi-package-variant',
    'Ready For Fulfillment': 'mdi-package-check', 'Shipped': 'mdi-truck-fast-outline',
    'Return Requested': 'mdi-keyboard-return', 'Cancelled': 'mdi-close-circle-outline',
  },
  ticket: {
    'Open': 'mdi-alert-circle-outline', 'In Progress': 'mdi-progress-clock',
    'Awaiting Reply': 'mdi-message-reply-text', 'Resolved': 'mdi-check-circle',
  },
}

const chipColor = computed(() => {
  return colorMap[props.type]?.[props.status] ?? colorMap.general[props.status] ?? 'default'
})

const chipIcon = computed(() => {
  if (!props.showIcon) return undefined
  return iconMap[props.type]?.[props.status]
})
</script>

<template>
  <v-chip
    :color="chipColor"
    :size="size"
    :variant="variant"
    class="font-weight-medium"
  >
    <v-icon v-if="chipIcon" start size="12">{{ chipIcon }}</v-icon>
    {{ status }}
  </v-chip>
</template>
