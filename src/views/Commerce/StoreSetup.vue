<script setup lang="ts">
import { useRouter } from 'vue-router'
import MpPageHeader from '@/components/MpPageHeader.vue'

const router = useRouter()

const channels = [
  { id: 'scooter-village', name: 'Scooter Village', type: 'Online Storefront', status: 'Connected', theme: 'Dawn', products: 142, url: 'scootervillage.maropost.store' },
  { id: 'city-rides', name: 'City Rides POS', type: 'Retail / Point of Sale', status: 'Connected', theme: 'Starter', products: 86, url: '' },
  { id: 'amazon', name: 'Amazon Channel', type: 'Marketplace', status: 'Pending Auth', theme: '—', products: 0, url: '' },
  { id: 'facebook', name: 'Facebook Shop', type: 'Social Commerce', status: 'Disconnected', theme: '—', products: 0, url: '' },
]

const statusColor = (s: string) => s === 'Connected' ? 'success' : s.includes('Pending') ? 'warning' : 'error'
const channelIcon = (type: string) =>
  type.includes('Retail') ? 'mdi-storefront' : type === 'Marketplace' ? 'mdi-cart-variant' : type.includes('Social') ? 'mdi-facebook' : 'mdi-web'
</script>

<template>
  <div class="h-100 d-flex flex-column gap-5">
    <MpPageHeader
      title="Sales Channels"
      :subtitle="`${channels.filter(c => c.status === 'Connected').length} stores connected · ${channels.reduce((a, c) => a + c.products, 0)} total products`"
      :breadcrumbs="[
        { title: 'Home', to: '/dashboard' },
        { title: 'Commerce', to: '/commerce/orders' },
        { title: 'Sales Channels', disabled: true },
      ]"
    >
      <template #actions>
        <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" class="text-none">Add Channel</v-btn>
      </template>
    </MpPageHeader>

    <v-row>
      <v-col cols="12" md="6" lg="3" v-for="channel in channels" :key="channel.id">
        <v-card variant="flat" border rounded="xl" class="channel-card h-100 d-flex flex-column">
          <v-card-text class="text-center py-6 flex-grow-1">
            <v-avatar :color="channel.status === 'Connected' ? 'primary' : 'grey'" variant="tonal" size="56" class="mb-4">
              <v-icon size="28">{{ channelIcon(channel.type) }}</v-icon>
            </v-avatar>
            <h3 class="text-subtitle-1 font-weight-bold mb-1">{{ channel.name }}</h3>
            <p class="text-medium-emphasis text-body-2 mb-3">{{ channel.type }}</p>
            <v-chip :color="statusColor(channel.status)" size="small" variant="tonal" class="mb-3">
              {{ channel.status }}
            </v-chip>
            <div v-if="channel.status === 'Connected'" class="d-flex justify-center gap-4 text-caption text-medium-emphasis mt-2">
              <span><v-icon size="12" class="mr-1">mdi-palette-outline</v-icon>{{ channel.theme }}</span>
              <span><v-icon size="12" class="mr-1">mdi-package-variant</v-icon>{{ channel.products }} products</span>
            </div>
          </v-card-text>
          <div v-if="channel.status === 'Connected'" class="pa-3 border-t d-flex gap-2">
            <v-btn variant="outlined" size="small" class="text-none flex-grow-1" prepend-icon="mdi-cog-outline" @click="router.push('/commerce/stores/general')">Settings</v-btn>
            <v-btn color="primary" variant="tonal" size="small" class="text-none flex-grow-1" prepend-icon="mdi-palette-outline" @click="router.push('/commerce/stores/themes')">Themes</v-btn>
          </div>
          <div v-else class="pa-3 border-t d-flex justify-center">
            <v-btn variant="outlined" size="small" class="text-none" prepend-icon="mdi-connection">{{ channel.status === 'Disconnected' ? 'Reconnect' : 'Complete Setup' }}</v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.channel-card {
  transition: transform 0.2s, box-shadow 0.2s;
}
.channel-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}
</style>
