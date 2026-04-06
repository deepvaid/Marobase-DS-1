<script setup lang="ts">
import { useCommerceStore } from '@/stores/useCommerce'
import MpStatusChip from '@/components/MpStatusChip.vue'

const commerce = useCommerceStore()
const recentOrders = commerce.orders.slice(0, 6)
</script>

<template>
  <div>
    <v-list lines="two" density="compact" :border="false" class="pa-0">
      <v-list-item v-for="order in recentOrders" :key="order.id" class="px-1 py-3 border-b">
        <template v-slot:prepend>
          <v-avatar color="primary" variant="tonal" size="36" class="mr-3 font-weight-bold text-caption">{{ order.customer.avatar }}</v-avatar>
        </template>
        <v-list-item-title class="text-body-2 font-weight-medium">{{ order.customer.name }}</v-list-item-title>
        <v-list-item-subtitle class="text-caption">{{ order.orderNumber }} · {{ order.itemCount }} items · {{ order.date }}</v-list-item-subtitle>
        <template v-slot:append>
          <div class="text-right">
            <div class="font-weight-bold text-body-2">${{ order.total }}</div>
            <MpStatusChip :status="order.status || ''" type="order" size="x-small" variant="flat" />
          </div>
        </template>
      </v-list-item>
    </v-list>
    <v-btn block variant="text" color="primary" class="text-none mt-4" append-icon="mdi-arrow-right" to="/commerce/orders">View All Orders</v-btn>
  </div>
</template>
