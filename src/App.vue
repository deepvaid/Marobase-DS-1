<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppBar from '@/components/layout/AppBar.vue'
import MpDaVinciBot from '@/components/MpDaVinciBot.vue'
import { useDaVinciStore } from '@/stores/useDaVinci'

const route = useRoute()
const drawer = ref(true)
const rail = ref(false)
const copilotOpen = ref(false)
const copilotExpanded = ref(false)
const daVinci = useDaVinciStore()

const isFullPage = computed(() => !!route.meta?.fullPage)

// Sync: when the store opens from anywhere, open the drawer
watch(() => daVinci.isOpen, (v) => {
  if (v) copilotOpen.value = true
})
// Sync back: when drawer closes, update store
watch(copilotOpen, (v) => {
  if (!v) daVinci.isOpen = false
})
</script>

<template>
  <v-app>
    <AppSidebar
      v-if="!isFullPage"
      v-model="drawer"
      :rail="rail"
      @update:rail="rail = $event"
    />

    <AppBar v-if="!isFullPage" v-model:copilot-open="copilotOpen" />

    <v-main :style="{ background: 'rgb(var(--v-theme-background))' }">
      <v-container v-if="!isFullPage" fluid class="pa-6">
        <router-view />
      </v-container>
      <router-view v-else />
    </v-main>

    <!-- Da Vinci Copilot Drawer -->
    <v-navigation-drawer
      v-if="!isFullPage"
      v-model="copilotOpen"
      location="right"
      :width="copilotExpanded ? 800 : 430"
      class="copilot-drawer"
      style="transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1); border-left: 1px solid rgba(0,0,0,0.08);"
    >
      <MpDaVinciBot
        @close="copilotOpen = false"
        @expand="copilotExpanded = !copilotExpanded"
      />
    </v-navigation-drawer>
  </v-app>
</template>

<style>
.copilot-drawer .v-navigation-drawer__content {
  display: flex;
  flex-direction: column;
  overflow: hidden !important;
}
</style>

