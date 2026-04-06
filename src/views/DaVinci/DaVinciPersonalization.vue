<script setup lang="ts">
import { ref } from 'vue'

const isRecsEnabled = ref(true)
const isDynamicPricing = ref(false)
const isContentPersonalization = ref(true)

const segments = ref([
  { name: 'High-Intent VIPs', algorithm: 'Collaborative Filtering', lift: '+12.5%' },
  { name: 'At-Risk Scrollers', algorithm: 'Discount Affinity', lift: '+8.2%' },
  { name: 'First-time Browsers', algorithm: 'Trending/Popular', lift: '+4.1%' },
])
</script>

<template>
  <div class="h-100 pa-6" style="background: #fafafa;">
    <div class="d-flex align-center justify-space-between mb-8">
      <div>
        <h1 class="text-h4 font-weight-bold d-flex align-center">
          <v-icon color="purple" class="mr-3">mdi-creation</v-icon>
          AI Personalization Strategy
        </h1>
        <p class="text-body-1 text-medium-emphasis mt-1">Configure Da Vinci's predictive behavior widgets across your storefront.</p>
      </div>
      <v-btn color="purple" class="text-none" size="large" prepend-icon="mdi-auto-fix">Optimize Global Strategy</v-btn>
    </div>

    <v-row>
      <!-- Configuration Column -->
      <v-col cols="12" md="7">
        <v-card class="mb-6 pa-5" border flat>
          <h2 class="text-h6 font-weight-bold mb-4">Core AI Models</h2>
          
          <div class="d-flex align-center py-3 border-bottom">
            <v-avatar color="indigo-lighten-5" class="mr-4"><v-icon color="indigo">mdi-star-shooting-outline</v-icon></v-avatar>
            <div class="flex-grow-1">
              <div class="font-weight-bold">Predictive Product Recommendations</div>
              <div class="text-caption text-medium-emphasis">Show "You might also like" widgets based on real-time browsing ML.</div>
            </div>
            <v-switch v-model="isRecsEnabled" color="purple" inset hide-details></v-switch>
          </div>
          
          <div class="d-flex align-center py-3 border-bottom">
            <v-avatar color="pink-lighten-5" class="mr-4"><v-icon color="pink">mdi-text-box-edit-outline</v-icon></v-avatar>
            <div class="flex-grow-1">
              <div class="font-weight-bold">Dynamic Content Personalization</div>
              <div class="text-caption text-medium-emphasis">Swap hero banners automatically based on the user's demographic segment.</div>
            </div>
            <v-switch v-model="isContentPersonalization" color="purple" inset hide-details></v-switch>
          </div>

          <div class="d-flex align-center py-3">
            <v-avatar color="green-lighten-5" class="mr-4"><v-icon color="green">mdi-cash-multiple</v-icon></v-avatar>
            <div class="flex-grow-1">
              <div class="font-weight-bold">Discount Propensity Pricing (Beta)</div>
              <div class="text-caption text-medium-emphasis">Only show discounts to users who have a high churn probability.</div>
            </div>
            <v-switch v-model="isDynamicPricing" color="purple" inset hide-details></v-switch>
          </div>
        </v-card>

        <v-card class="pa-5" border flat>
          <h2 class="text-h6 font-weight-bold mb-4">Active Segments Optimization</h2>
          <v-table density="comfortable">
            <thead>
              <tr>
                <th class="font-weight-bold text-left">Segment Target</th>
                <th class="font-weight-bold text-left">Da Vinci Algorithm</th>
                <th class="font-weight-bold text-right">Revenue Lift</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="seg in segments" :key="seg.name">
                <td class="font-weight-medium">{{ seg.name }}</td>
                <td>
                  <v-chip size="small" variant="flat" color="purple-lighten-5" class="text-purple-darken-3 font-weight-medium">
                    <v-icon start size="14">mdi-brain</v-icon>
                    {{ seg.algorithm }}
                  </v-chip>
                </td>
                <td class="text-right text-success font-weight-bold">{{ seg.lift }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>

      <!-- Preview Column -->
      <v-col cols="12" md="5">
        <v-card class="h-100 preview-card" border flat style="background: center / cover url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80'); position: relative; overflow: hidden">
          <!-- Dark overlay -->
          <div style="position: absolute; inset:0; background: rgba(0,0,0,0.6);"></div>
          
          <div style="position: relative; z-index:1;" class="pa-6 text-white h-100 d-flex flex-column">
            <h3 class="text-h5 font-weight-bold mb-2">Live Storefront Preview</h3>
            <p class="text-body-2 text-white text-opacity-70 mb-8">This is what Da Vinci is currently generating for a returning VIP customer.</p>

            <v-card color="rgba(255,255,255,0.15)" style="backdrop-filter: blur(10px);" class="mb-4 pa-4" flat border border-color="white">
              <div class="text-caption text-uppercase font-weight-bold text-purple-lighten-2 mb-1">
                <v-icon size="14" class="mr-1">mdi-auto-fix</v-icon> Dynamic Hero Replaced
              </div>
              <h4 class="text-h6 mb-2">Welcome back, Sarah!</h4>
              <p class="text-body-2">We noticed you love sustainable fabrics. Our new summer linen collection just dropped.</p>
            </v-card>

            <v-spacer></v-spacer>

            <div class="text-subtitle-2 mb-2 font-weight-medium text-white d-flex align-center">
               Personalized Picks for Sarah <v-icon size="14" class="ml-2 text-purple-lighten-2">mdi-lock-pattern</v-icon>
            </div>
            <div class="d-flex gap-4">
              <v-card width="120" color="white" flat class="pa-2 shrink">
                <div class="bg-grey-lighten-3 mb-2 rounded" style="height: 100px;"></div>
                <div class="text-caption font-weight-bold text-black">Linen Shirt</div>
                <div class="text-caption text-primary">$45.00</div>
              </v-card>
              <v-card width="120" color="white" flat class="pa-2 shrink">
                <div class="bg-grey-lighten-3 mb-2 rounded" style="height: 100px;"></div>
                <div class="text-caption font-weight-bold text-black">Cotton Pants</div>
                <div class="text-caption text-primary">$80.00</div>
              </v-card>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.preview-card {
  border-radius: 16px;
  min-height: 500px;
}
.gap-4 {
  gap: 16px;
}
</style>
