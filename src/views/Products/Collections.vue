<script setup lang="ts">
import MpPageHeader from '@/components/MpPageHeader.vue'
import MpEmptyState from '@/components/MpEmptyState.vue'

const breadcrumbs = [
  { title: 'Products', to: '/commerce/products' },
  { title: 'Collections', disabled: true },
]
</script>

<template>
  <div>
    <MpPageHeader
      title="Collections"
      subtitle="Group products into collections for merchandising, search, and campaigns."
      :breadcrumbs="breadcrumbs"
    >
      <template #actions>
        <v-btn color="primary" prepend-icon="mdi-plus">Create Collection</v-btn>
      </template>
    </MpPageHeader>

    <v-card flat border rounded="lg" class="pa-8">
      <MpEmptyState
        icon="mdi-folder-multiple-outline"
        title="No collections yet"
        description="Create your first collection to organize products by theme, season, or audience."
        actionLabel="Create Collection"
        actionIcon="mdi-plus"
      />
    </v-card>
  </div>
</template>
