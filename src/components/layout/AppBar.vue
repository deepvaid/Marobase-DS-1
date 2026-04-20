<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from 'vuetify'
import { useAccountStore } from '@/stores/useAccount'

const copilotOpen = defineModel<boolean>('copilotOpen', { default: false })

const theme = useTheme()
const notificationCount = ref(18)
const userName = ref('Deepak Vaidya')
const userInitials = ref('DV')
const userEmail = ref('deepak.v@maropost.com')
const userRole = ref('Super Admin')

const accountStore = useAccountStore()

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'maropostLight' : 'maropostDark'
}
</script>

<template>
  <v-app-bar height="56" color="surface" flat>
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
        class="appbar-search"
        bg-color="surface-variant"
      />

      <!-- Account switcher -->
      <v-menu location="bottom start" offset="8">
        <template v-slot:activator="{ props }">
          <div v-bind="props" class="d-flex align-center gap-2 cursor-pointer pa-1 pl-2 rounded-lg account-switcher-trigger">
            <v-avatar :color="accountStore.currentAccount.color" size="26" class="appbar-avatar-sm">{{ accountStore.currentAccount.initials }}</v-avatar>
            <div class="d-none d-md-block account-summary">
              <div class="text-caption font-weight-medium text-truncate account-name">{{ accountStore.currentAccount.name }}</div>
              <div class="text-caption text-medium-emphasis account-user">{{ userName }}</div>
            </div>
            <v-icon size="14" color="medium-emphasis">mdi-chevron-down</v-icon>
          </div>
        </template>
        <v-card width="340" rounded="xl" flat border class="account-switcher-card">
          <!-- Current account header -->
          <div class="account-menu-header d-flex align-center gap-3">
            <v-avatar :color="accountStore.currentAccount.color" size="40" class="appbar-avatar-md">{{ accountStore.currentAccount.initials }}</v-avatar>
            <div class="account-min-width flex-grow-1">
              <div class="font-weight-semibold text-body-2 text-truncate">{{ accountStore.currentAccount.name }}</div>
              <div class="text-caption text-medium-emphasis">{{ userName }}</div>
            </div>
            <v-chip size="x-small" variant="tonal" color="primary">{{ accountStore.currentAccount.plan }}</v-chip>
          </div>
          <v-divider />
          <v-list density="compact" :border="false" class="pa-3">
            <v-list-subheader class="text-uppercase mb-1 appbar-subheader">Switch Account</v-list-subheader>
            <v-list-item
              v-for="acc in accountStore.accounts"
              :key="acc.id"
              rounded="lg"
              class="mb-1 account-list-item"
              :active="acc.id === accountStore.currentAccountId"
              active-color="primary"
              @click="accountStore.switchAccount(acc.id)"
            >
              <template v-slot:prepend>
                <v-avatar size="28" :color="acc.color" variant="tonal" class="mr-3 appbar-avatar-initials">{{ acc.initials }}</v-avatar>
              </template>
              <div class="text-body-2 font-weight-medium account-item-text">{{ acc.name }}</div>
              <div class="text-caption text-medium-emphasis">{{ acc.plan }}</div>
              <template v-slot:append v-if="acc.id === accountStore.currentAccountId">
                <v-icon size="16" color="primary">mdi-check-circle</v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>

      <div class="mx-2" />

      <v-spacer />

      <!-- Da Vinci Copilot trigger -->
      <v-tooltip text="Da Vinci Copilot" location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            size="small"
            :variant="copilotOpen ? 'flat' : 'text'"
            :color="copilotOpen ? 'purple' : undefined"
            icon
            @click="copilotOpen = !copilotOpen"
            class="copilot-trigger"
          >
            <v-icon>mdi-creation</v-icon>
          </v-btn>
        </template>
      </v-tooltip>

      <!-- Notification bell -->
      <v-btn variant="text" size="small" icon class="position-relative">
        <v-icon>mdi-bell-outline</v-icon>
        <v-badge v-if="notificationCount > 0" :content="notificationCount" color="error" floating class="notification-badge" />
      </v-btn>

      <!-- Theme toggle -->
      <v-tooltip text="Toggle dark mode" location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon="mdi-theme-light-dark" variant="text" size="small" @click="toggleTheme" />
        </template>
      </v-tooltip>

      <div class="mx-2" />

      <!-- User menu -->
      <v-menu location="bottom end" offset="8">
        <template v-slot:activator="{ props }">
          <div v-bind="props" class="d-flex align-center gap-2 cursor-pointer pa-1 rounded-lg user-menu-trigger">
            <v-avatar color="primary" size="30" class="user-avatar-ring appbar-avatar-sm">{{ userInitials }}</v-avatar>
            <span class="text-body-2 font-weight-medium d-none d-sm-block">{{ userName }}</span>
            <v-icon size="16" color="medium-emphasis">mdi-chevron-down</v-icon>
          </div>
        </template>
        <v-card min-width="280" rounded="xl" elevation="0" class="user-menu-card">
          <!-- User header -->
          <div class="user-menu-header d-flex align-center gap-3">
            <v-avatar color="primary" size="44" class="appbar-avatar-lg">{{ userInitials }}</v-avatar>
            <div>
              <div class="font-weight-bold text-body-2">{{ userName }}</div>
              <div class="text-caption text-medium-emphasis">{{ userEmail }}</div>
              <v-chip size="x-small" variant="tonal" color="primary" class="mt-1">{{ userRole }}</v-chip>
            </div>
          </div>

          <v-divider class="mx-4" />

          <!-- Personal -->
          <v-list density="compact" :border="false" class="px-3 pt-3 pb-1">
            <v-list-subheader class="text-uppercase font-weight-bold appbar-subheader">Personal</v-list-subheader>
            <v-list-item prepend-icon="mdi-account-outline" title="My Profile" subtitle="View and edit your info" to="/settings" rounded="lg" class="mb-1" />
          </v-list>

          <v-divider class="mx-4" />

          <!-- Account -->
          <v-list density="compact" :border="false" class="px-3 pt-3 pb-1">
            <v-list-subheader class="text-uppercase font-weight-bold appbar-subheader">Account</v-list-subheader>
            <v-list-item prepend-icon="mdi-cog-outline" title="Account Settings" subtitle="Company, users, permissions" to="/settings" rounded="lg" class="mb-1" />
            <v-list-item prepend-icon="mdi-credit-card-outline" title="Billing" subtitle="Plan, usage, invoices" to="/settings" rounded="lg" class="mb-1" />
          </v-list>

          <v-divider class="mx-4" />

          <!-- Sign Out -->
          <v-list density="compact" :border="false" class="px-3 py-2">
            <v-list-item prepend-icon="mdi-logout" title="Sign Out" rounded="lg" class="sign-out-item" color="error" />
          </v-list>
        </v-card>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<style scoped lang="scss">
.user-menu-trigger {
  transition: background $mp-transition-fast;
}
.user-menu-trigger:hover {
  background: rgb(var(--v-theme-surface-variant));
}
.user-avatar-ring {
  box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.15);
  transition: box-shadow $mp-transition-fast;
}
.user-menu-trigger:hover .user-avatar-ring {
  box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.35);
}
.user-menu-card {
  box-shadow: $mp-shadow-md;
}
.user-menu-header {
  background: rgba(var(--v-theme-primary), 0.03);
  padding: $mp-space-5;
}
.sign-out-item {
  transition: background $mp-transition-fast;
}
.sign-out-item:hover {
  background: rgba(var(--v-theme-error), 0.06);
}
.account-switcher-trigger {
  transition: background $mp-transition-fast;
}
.account-switcher-trigger:hover {
  background: rgb(var(--v-theme-surface-variant));
}
.account-switcher-card {
  box-shadow: $mp-shadow-md;
}
.account-menu-header {
  padding: $mp-space-5;
  background: rgba(var(--v-theme-surface-variant), 0.4);
}
.copilot-trigger {
  transition: all $mp-transition-base;
}
.copilot-trigger:hover {
  color: #7C3AED;
}

.appbar-search {
  max-width: var(--mp-layout-searchMaxWidth);
}
.appbar-avatar-sm {
  font-size: var(--mp-typography-fontSize-xs);
  font-weight: var(--mp-typography-fontWeight-bold);
  color: rgb(var(--v-theme-on-primary));
}
.appbar-avatar-md {
  font-weight: var(--mp-typography-fontWeight-bold);
  color: rgb(var(--v-theme-on-primary));
  flex-shrink: 0;
}
.appbar-avatar-lg {
  font-weight: var(--mp-typography-fontWeight-bold);
  color: rgb(var(--v-theme-on-primary));
  flex-shrink: 0;
}
.account-summary {
  line-height: 1.2;
}
.account-name {
  max-width: 160px;
}
.account-user {
  font-size: var(--mp-typography-fontSize-xs);
}
.appbar-subheader {
  font-size: var(--mp-typography-fontSize-xs);
  letter-spacing: 0.05em;
}
.appbar-avatar-initials {
  font-size: var(--mp-typography-fontSize-xs);
  font-weight: var(--mp-typography-fontWeight-bold);
}
.account-item-text {
  white-space: normal;
  line-height: 1.3;
}
.account-min-width {
  min-width: 0;
}
.notification-badge {
  font-size: var(--mp-typography-fontSize-xs);
}
</style>
