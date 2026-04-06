<script setup lang="ts">
const activityFeed = [
  { icon: 'mdi-email-check', color: 'success', text: 'Campaign "Flash Sale — 40% Off Sitewide" completed with 12,891 clicks.', time: '10 mins ago' },
  { icon: 'mdi-account-check', color: 'primary', text: 'Segment "Lapsed 90 Days" recalculated: 4,201 contacts.', time: '1 hour ago' },
  { icon: 'mdi-connection', color: 'secondary', text: 'New Shopify store connection authenticated successfully.', time: '3 hours ago' },
  { icon: 'mdi-robot', color: 'info', text: 'Journey "Abandoned Cart — 3-Email Recovery" triggered 234 new enrollments.', time: '5 hours ago' },
  { icon: 'mdi-cart-check', color: 'success', text: '47 orders received today — $8,234 in revenue.', time: 'Today' },
]
</script>

<template>
  <div>
    <v-list lines="two" density="compact" :border="false" class="pa-0">
      <v-list-item
        v-for="(item, idx) in activityFeed"
        :key="idx"
        class="px-1 py-3 border-b"
      >
        <template v-slot:prepend>
          <v-avatar :color="item.color" variant="tonal" size="36" class="mr-3">
            <v-icon :color="item.color" size="18">{{ item.icon }}</v-icon>
          </v-avatar>
        </template>
        <v-list-item-title class="text-body-2 font-weight-medium" style="white-space: normal; line-height: 1.3;">{{ item.text }}</v-list-item-title>
        <v-list-item-subtitle class="text-caption">{{ item.time }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>
    <v-btn block variant="text" color="primary" class="text-none mt-4" append-icon="mdi-arrow-right">View Full Audit Log</v-btn>
  </div>
</template>
