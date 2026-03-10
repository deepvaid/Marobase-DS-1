<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  breadcrumbs?: Array<{ title: string; to?: string; disabled?: boolean }>
}>()
</script>

<template>
  <div class="mp-page-header mb-6">
    <!-- Breadcrumbs -->
    <nav v-if="breadcrumbs?.length" class="mp-breadcrumbs d-flex align-center gap-1 mb-3">
      <template v-for="(crumb, i) in breadcrumbs" :key="i">
        <router-link
          v-if="crumb.to && !crumb.disabled"
          :to="crumb.to"
          class="mp-breadcrumb-link text-caption font-weight-medium text-decoration-none"
        >{{ crumb.title }}</router-link>
        <span
          v-else
          class="text-caption font-weight-medium text-disabled"
        >{{ crumb.title }}</span>
        <v-icon v-if="i < breadcrumbs.length - 1" size="12" color="medium-emphasis" class="mx-1">mdi-chevron-right</v-icon>
      </template>
    </nav>

    <!-- Header row -->
    <div class="d-flex align-start justify-space-between pb-5 border-b">
      <div>
        <h1 class="mp-page-title font-weight-bold">{{ title }}</h1>
        <p v-if="subtitle" class="text-medium-emphasis text-body-2 mb-0 mt-1">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.actions" class="d-flex gap-2 align-center flex-shrink-0" style="margin-top: 2px;">
        <slot name="actions" />
      </div>
    </div>
  </div>

  <slot name="tabs" />
</template>

<style scoped>
.mp-page-title {
  font-size: 1.65rem;
  letter-spacing: -0.4px;
  line-height: 1.2;
}

.mp-breadcrumb-link {
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.6;
  transition: opacity 0.15s ease;
}
.mp-breadcrumb-link:hover {
  opacity: 1;
  text-decoration: underline !important;
}

.border-b {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
