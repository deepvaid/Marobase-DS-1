import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'Base/Cards',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Variants: Story = {
  render: () => ({
    template: `
      <div class="d-flex flex-column ga-6">

        <div>
          <div class="text-overline text-medium-emphasis mb-3">Card Variants</div>
          <v-row dense>
            <v-col cols="12" md="4">
              <v-card variant="flat" border rounded="xl">
                <v-card-item>
                  <v-card-title>Flat + Border</v-card-title>
                  <v-card-subtitle>Design system default</v-card-subtitle>
                </v-card-item>
                <v-card-text>Use this for all content cards. Never use elevation shadows.</v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="4">
              <v-card variant="tonal" color="primary" rounded="xl">
                <v-card-item>
                  <v-card-title>Tonal</v-card-title>
                  <v-card-subtitle>For highlighted sections</v-card-subtitle>
                </v-card-item>
                <v-card-text>Soft background derived from color. Good for info panels.</v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="4">
              <v-card variant="outlined" rounded="xl">
                <v-card-item>
                  <v-card-title>Outlined</v-card-title>
                  <v-card-subtitle>Alternative border style</v-card-subtitle>
                </v-card-item>
                <v-card-text>Same visual as flat+border but uses Vuetify's built-in border.</v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <div>
          <div class="text-overline text-medium-emphasis mb-3">KPI / Metric Cards</div>
          <v-row dense>
            <v-col cols="6" md="3">
              <v-card variant="flat" border rounded="xl">
                <v-card-text class="d-flex align-center justify-space-between pa-5">
                  <div>
                    <div class="text-overline text-medium-emphasis">Total Revenue</div>
                    <div class="text-h4 font-weight-bold mt-1">$84,230</div>
                    <div class="text-caption text-success mt-1">↑ 12.4% vs last month</div>
                  </div>
                  <v-icon size="40" color="primary" opacity="0.25">mdi-cash-multiple</v-icon>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6" md="3">
              <v-card variant="flat" border rounded="xl">
                <v-card-text class="d-flex align-center justify-space-between pa-5">
                  <div>
                    <div class="text-overline text-medium-emphasis">Orders</div>
                    <div class="text-h4 font-weight-bold mt-1">1,284</div>
                    <div class="text-caption text-success mt-1">↑ 8.1% vs last month</div>
                  </div>
                  <v-icon size="40" color="secondary" opacity="0.25">mdi-cart-outline</v-icon>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6" md="3">
              <v-card variant="flat" border rounded="xl">
                <v-card-text class="d-flex align-center justify-space-between pa-5">
                  <div>
                    <div class="text-overline text-medium-emphasis">Contacts</div>
                    <div class="text-h4 font-weight-bold mt-1">24,891</div>
                    <div class="text-caption text-error mt-1">↓ 2.3% vs last month</div>
                  </div>
                  <v-icon size="40" color="success" opacity="0.25">mdi-account-group-outline</v-icon>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6" md="3">
              <v-card variant="flat" border rounded="xl">
                <v-card-text class="d-flex align-center justify-space-between pa-5">
                  <div>
                    <div class="text-overline text-medium-emphasis">Open Rate</div>
                    <div class="text-h4 font-weight-bold mt-1">34.7%</div>
                    <div class="text-caption text-warning mt-1">→ No change</div>
                  </div>
                  <v-icon size="40" color="warning" opacity="0.25">mdi-email-open-outline</v-icon>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <div>
          <div class="text-overline text-medium-emphasis mb-3">Color Accent Cards</div>
          <v-row dense>
            <v-col cols="12" md="3">
              <v-card variant="tonal" color="primary" rounded="xl">
                <v-card-text class="text-center pa-6">
                  <v-icon size="32" color="primary" class="mb-3">mdi-lightning-bolt</v-icon>
                  <div class="text-subtitle-1 font-weight-bold">Primary</div>
                  <div class="text-caption text-medium-emphasis">Tonal variant</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="3">
              <v-card variant="tonal" color="success" rounded="xl">
                <v-card-text class="text-center pa-6">
                  <v-icon size="32" color="success" class="mb-3">mdi-check-circle-outline</v-icon>
                  <div class="text-subtitle-1 font-weight-bold">Success</div>
                  <div class="text-caption text-medium-emphasis">Tonal variant</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="3">
              <v-card variant="tonal" color="warning" rounded="xl">
                <v-card-text class="text-center pa-6">
                  <v-icon size="32" color="warning" class="mb-3">mdi-alert-outline</v-icon>
                  <div class="text-subtitle-1 font-weight-bold">Warning</div>
                  <div class="text-caption text-medium-emphasis">Tonal variant</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="3">
              <v-card variant="tonal" color="error" rounded="xl">
                <v-card-text class="text-center pa-6">
                  <v-icon size="32" color="error" class="mb-3">mdi-close-circle-outline</v-icon>
                  <div class="text-subtitle-1 font-weight-bold">Error</div>
                  <div class="text-caption text-medium-emphasis">Tonal variant</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <div>
          <div class="text-overline text-medium-emphasis mb-3">Interactive / Clickable Cards</div>
          <v-row dense>
            <v-col cols="12" md="4" v-for="item in [
              { icon: 'mdi-storefront-outline', title: 'Store Setup', desc: 'Configure your online store channels and settings', color: 'primary' },
              { icon: 'mdi-email-fast-outline', title: 'Email Campaigns', desc: 'Create and send targeted email marketing campaigns', color: 'secondary' },
              { icon: 'mdi-chart-line', title: 'Analytics', desc: 'Track performance, revenue and engagement metrics', color: 'success' },
            ]" :key="item.title">
              <v-card
                variant="flat"
                border
                rounded="xl"
                class="settings-tile cursor-pointer"
                hover
              >
                <v-card-text class="pa-5">
                  <v-avatar :color="item.color" variant="tonal" size="44" rounded="lg" class="mb-4">
                    <v-icon :color="item.color">{{ item.icon }}</v-icon>
                  </v-avatar>
                  <div class="text-subtitle-1 font-weight-bold mb-1">{{ item.title }}</div>
                  <div class="text-body-2 text-medium-emphasis">{{ item.desc }}</div>
                </v-card-text>
                <v-card-actions class="px-5 pb-4 pt-0">
                  <v-btn variant="text" color="primary" class="text-none px-0" append-icon="mdi-arrow-right" size="small">
                    Configure
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <div>
          <div class="text-overline text-medium-emphasis mb-3">Card with Header Actions</div>
          <v-card variant="flat" border rounded="xl" style="max-width: 480px;">
            <div class="d-flex align-center justify-space-between px-5 pt-4 pb-3 border-b">
              <div class="text-subtitle-1 font-weight-bold">Recent Orders</div>
              <v-btn variant="text" size="small" class="text-none text-primary" append-icon="mdi-arrow-right">
                View all
              </v-btn>
            </div>
            <v-list lines="two" class="py-2">
              <v-list-item
                v-for="order in [
                  { num: '#10042', name: 'James Anderson', amount: '$284.00', status: 'Completed' },
                  { num: '#10041', name: 'Sofia Martinez', amount: '$156.50', status: 'Processing' },
                  { num: '#10040', name: 'Liam Johnson', amount: '$89.99', status: 'Shipped' },
                ]"
                :key="order.num"
                :title="order.num + ' · ' + order.name"
                :subtitle="order.status"
              >
                <template #append>
                  <span class="font-weight-bold text-body-2">{{ order.amount }}</span>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </div>

      </div>
    `,
  }),
}
