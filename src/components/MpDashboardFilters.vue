<script setup lang="ts">
import { useDashboardStore } from '@/stores/useDashboard'

const dashboard = useDashboardStore()
</script>

<template>
  <div class="dashboard-filters-bar d-flex align-center px-6 py-2 border-b">
    <div class="d-flex align-center gap-2">
      <!-- Date Range Filter -->
      <v-select
        :model-value="dashboard.globalFilters.dateRange"
        @update:model-value="dashboard.setGlobalFilter('dateRange', $event)"
        :items="[
          { title: 'Last 7 Days', value: '7D' },
          { title: 'Last 30 Days', value: '30D' },
          { title: 'Last 3 Months', value: '3M' },
          { title: 'Year to Date', value: 'YTD' },
        ]"
        variant="plain"
        density="compact"
        hide-details
        prepend-inner-icon="mdi-calendar-range"
        class="filter-select"
        menu-icon="mdi-chevron-down"
        style="width: 170px;"
      >
        <template #selection="{ item }">
          <span class="text-body-2 font-weight-medium text-high-emphasis">{{ item.title }}</span>
        </template>
      </v-select>

      <v-divider vertical class="my-2 mx-2" style="height: 20px; align-self: center;" />

      <!-- Segment Filter -->
       <v-select
        :model-value="dashboard.globalFilters.segment"
        @update:model-value="dashboard.setGlobalFilter('segment', $event)"
        :items="[
          { title: 'All Segments', value: 'all' },
          { title: 'VIP Customers', value: 'vip' },
          { title: 'New Subscribers', value: 'new' },
          { title: 'Enterprise Accounts', value: 'enterprise' },
        ]"
        variant="plain"
        density="compact"
        hide-details
        prepend-inner-icon="mdi-account-group-outline"
        class="filter-select"
        menu-icon="mdi-chevron-down"
        style="width: 190px;"
      >
        <template #selection="{ item }">
          <span class="text-body-2 font-weight-medium text-high-emphasis">{{ item.title }}</span>
        </template>
      </v-select>

      <v-divider vertical class="my-2 mx-2" style="height: 20px; align-self: center;" />

      <!-- Region Filter -->
      <v-select
        :model-value="dashboard.globalFilters.region"
        @update:model-value="dashboard.setGlobalFilter('region', $event)"
        :items="[
          { title: 'All Regions', value: 'all' },
          { title: 'North America', value: 'na' },
          { title: 'Europe', value: 'eu' },
          { title: 'Asia Pacific', value: 'apac' },
        ]"
        variant="plain"
        density="compact"
        hide-details
        prepend-inner-icon="mdi-earth"
        class="filter-select"
        menu-icon="mdi-chevron-down"
        style="width: 170px;"
      >
        <template #selection="{ item }">
          <span class="text-body-2 font-weight-medium text-high-emphasis">{{ item.title }}</span>
        </template>
      </v-select>
      
      <!-- Quick Filter Menu -->
      <v-menu location="bottom start">
        <template #activator="{ props }">
          <v-btn variant="text" size="small" color="primary" class="text-none ml-2 rounded-lg" v-bind="props">
            <v-icon size="16" start>mdi-plus</v-icon>Quick filter
          </v-btn>
        </template>
        <v-list density="compact" rounded="lg" elevation="3" class="mt-1" width="220">
          <v-list-subheader class="text-caption text-uppercase font-weight-bold ml-1">Presets</v-list-subheader>
          <v-list-item @click="dashboard.setGlobalFilter('segment', 'vip'); dashboard.setGlobalFilter('dateRange', '3M')">
            <template #prepend><v-icon color="success" size="18" class="mr-2">mdi-star-outline</v-icon></template>
            <v-list-item-title class="text-body-2 font-weight-medium">VIP Qtr Performance</v-list-item-title>
          </v-list-item>
          <v-list-item @click="dashboard.setGlobalFilter('segment', 'new'); dashboard.setGlobalFilter('dateRange', '7D')">
            <template #prepend><v-icon color="info" size="18" class="mr-2">mdi-account-plus-outline</v-icon></template>
            <v-list-item-title class="text-body-2 font-weight-medium">Recent Signups</v-list-item-title>
          </v-list-item>
          <v-list-item @click="dashboard.setGlobalFilter('region', 'na'); dashboard.setGlobalFilter('dateRange', 'YTD')">
            <template #prepend><v-icon color="primary" size="18" class="mr-2">mdi-earth</v-icon></template>
            <v-list-item-title class="text-body-2 font-weight-medium">North America YTD</v-list-item-title>
          </v-list-item>
          <v-divider class="my-1"></v-divider>
          <v-list-item @click="dashboard.setGlobalFilter('dateRange', '30D'); dashboard.setGlobalFilter('segment', 'all'); dashboard.setGlobalFilter('region', 'all')">
            <template #prepend><v-icon color="medium-emphasis" size="18" class="mr-2">mdi-restore</v-icon></template>
            <v-list-item-title class="text-body-2 font-weight-medium">Reset All Filters</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <v-spacer />

    <!-- Advanced Filters -->
    <v-btn variant="tonal" size="small" color="medium-emphasis" class="text-none rounded-lg">
      <v-icon size="16" start>mdi-filter-variant</v-icon>
      Advanced filters
      <v-badge color="primary" content="1" inline class="ml-1"></v-badge>
    </v-btn>
  </div>
</template>

<style scoped>
.dashboard-filters-bar {
  background: rgb(var(--v-theme-surface));
  /* Not sticky so it scrolls normally, or we can make it sticky */
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 4px 6px -4px rgba(0,0,0,0.05);
}
.filter-select :deep(.v-field__input) {
  padding-top: 4px;
  padding-bottom: 4px;
  min-height: 36px;
}
.filter-select :deep(.v-field__append-inner) {
  padding-top: 6px;
}
.filter-select :deep(.v-field__prepend-inner) {
  padding-top: 8px;
}
</style>
