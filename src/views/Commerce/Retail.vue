<script setup lang="ts">
import MpPageHeader from '@/components/MpPageHeader.vue'

const breadcrumbs = [
  { title: 'Commerce', to: '/commerce/orders' },
  { title: 'Retail', disabled: true },
]
</script>

<template>
  <div>
    <MpPageHeader
      title="Retail"
      subtitle="Premium feature — manage physical retail operations, POS, and in-store inventory."
      :breadcrumbs="breadcrumbs"
    />

    <v-card flat border rounded="lg" class="retail-upsell pa-10 d-flex flex-column align-center text-center">
      <div class="crown-wrap mb-4">
        <v-icon icon="mdi-crown" color="amber" size="56" />
      </div>
      <h2 class="text-h5 font-weight-bold mb-2">Retail is a premium feature</h2>
      <p class="text-body-1 text-medium-emphasis mb-6 upsell-body">
        Unify your online and physical retail operations with POS, multi-location inventory,
        staff management, and unified customer profiles. Upgrade your plan to get started.
      </p>
      <div class="d-flex gap-3">
        <v-btn color="primary" size="large" prepend-icon="mdi-arrow-up-bold-circle-outline">
          Upgrade plan
        </v-btn>
        <v-btn variant="text" size="large">Learn more</v-btn>
      </div>
    </v-card>
  </div>
</template>

<style scoped>
.retail-upsell {
  max-width: 720px;
  margin: 24px auto 0;
}
.upsell-body {
  max-width: 520px;
}
.crown-wrap {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 193, 7, 0.12);
}
</style>
