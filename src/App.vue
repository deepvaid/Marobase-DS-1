<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppBar from '@/components/layout/AppBar.vue'

const route = useRoute()
const drawer = ref(true)
const rail = ref(false)

const isFullPage = computed(() => !!route.meta?.fullPage)
</script>

<template>
  <v-app>
    <AppSidebar
      v-if="!isFullPage"
      v-model="drawer"
      :rail="rail"
      @update:rail="rail = $event"
    />

    <AppBar v-if="!isFullPage" />

    <v-main :style="{ background: 'rgb(var(--v-theme-background))' }">
      <v-container v-if="!isFullPage" fluid class="pa-6">
        <router-view />
      </v-container>
      <router-view v-else />
    </v-main>
  </v-app>
</template>
