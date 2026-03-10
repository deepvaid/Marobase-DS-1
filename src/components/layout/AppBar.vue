<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()
const notificationCount = ref(18)
const userName = ref('Deepak Vaidya')
const userInitials = ref('DV')

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'maropostLight' : 'maropostDark'
}
</script>

<template>
  <v-app-bar height="56" color="surface" class="border-b">
    <div class="w-100 d-flex align-center px-4 gap-3">
      <!-- Global search -->
      <v-text-field
        density="compact"
        variant="solo-filled"
        flat
        hide-details
        prepend-inner-icon="mdi-magnify"
        placeholder="Search campaigns, contacts, orders..."
        rounded="pill"
        style="max-width: 360px;"
        bg-color="surface-variant"
      />

      <v-spacer />

      <!-- Notification bell -->
      <v-btn variant="text" size="small" icon class="position-relative">
        <v-icon>mdi-bell-outline</v-icon>
        <v-badge v-if="notificationCount > 0" :content="notificationCount" color="error" floating style="font-size: 10px;" />
      </v-btn>

      <!-- Theme toggle -->
      <v-tooltip text="Toggle dark mode" location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon="mdi-theme-light-dark" variant="text" size="small" @click="toggleTheme" />
        </template>
      </v-tooltip>

      <v-divider vertical class="mx-1" style="height: 24px; align-self: center;" />

      <!-- User menu -->
      <v-menu location="bottom end" offset="8">
        <template v-slot:activator="{ props }">
          <div v-bind="props" class="d-flex align-center gap-2 cursor-pointer pa-1 rounded-lg user-menu-trigger">
            <v-avatar color="primary" size="30" style="font-size: 11px; font-weight: 700; color: #fff;">{{ userInitials }}</v-avatar>
            <span class="text-body-2 font-weight-medium d-none d-sm-block">{{ userName }}</span>
            <v-icon size="16" color="medium-emphasis">mdi-chevron-down</v-icon>
          </div>
        </template>
        <v-card width="260" rounded="xl" elevation="8">
          <v-list>
            <v-list-item class="py-3">
              <template v-slot:prepend>
                <v-avatar color="primary" size="40" style="font-weight: 700; color: #fff;">{{ userInitials }}</v-avatar>
              </template>
              <v-list-item-title class="font-weight-bold">{{ userName }}</v-list-item-title>
              <v-list-item-subtitle style="font-size: 12px;">deepak.v@maropost.com</v-list-item-subtitle>
            </v-list-item>
          </v-list>
          <v-divider />
          <v-list density="compact">
            <v-list-item prepend-icon="mdi-account-outline" title="My Profile" to="/profile" rounded="lg" />
            <v-list-item prepend-icon="mdi-cog-outline" title="Account Settings" to="/settings" rounded="lg" />
            <v-list-item prepend-icon="mdi-credit-card-outline" title="Billing" to="/billing" rounded="lg" />
          </v-list>
          <v-divider />
          <v-list density="compact" class="py-1">
            <v-list-item prepend-icon="mdi-logout" title="Sign Out" class="text-error" rounded="lg" />
          </v-list>
        </v-card>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<style scoped>
.user-menu-trigger {
  transition: background 0.15s ease;
}
.user-menu-trigger:hover {
  background: rgb(var(--v-theme-surface-variant));
}
</style>
