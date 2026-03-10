<script setup lang="ts">
import MpPageHeader from '@/components/MpPageHeader.vue'
</script>

<template>
  <div class="h-100 d-flex flex-column gap-5">
    <MpPageHeader
      title="Signup Forms (Legacy)"
      subtitle="Legacy signup form management"
      :breadcrumbs="[
        { title: 'Home', to: '/dashboard' },
        { title: 'Marketing', disabled: true },
        { title: 'Signup Forms', disabled: true },
      ]"
    />

    <v-alert type="info" variant="tonal" rounded="xl">
      This is a legacy feature. We recommend using Acquisition Forms for new projects.
    </v-alert>

    <v-card variant="flat" border rounded="xl">
      <v-card-text class="text-center py-10">
        <v-icon size="64" color="medium-emphasis" class="mb-4">mdi-form-dropdown</v-icon>
        <p class="text-medium-emphasis">No legacy signup forms found.</p>
      </v-card-text>
    </v-card>
  </div>
</template>
