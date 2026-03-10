import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'

const meta = {
  title: 'Base/Selection Controls',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ── Checkboxes ────────────────────────────────────────────────────────────────
export const Checkboxes: Story = {
  render: () => ({
    setup() {
      const single = ref(false)
      const indeterminate = ref(true)
      const group = ref(['Email'])
      return { single, indeterminate, group }
    },
    template: `
      <div class="d-flex flex-column ga-6">
        <div>
          <div class="text-overline text-medium-emphasis mb-3">States</div>
          <div class="d-flex flex-wrap ga-4">
            <v-checkbox v-model="single" label="Unchecked" hide-details />
            <v-checkbox :model-value="true" label="Checked" hide-details />
            <v-checkbox :indeterminate="indeterminate" label="Indeterminate" hide-details />
            <v-checkbox :model-value="true" label="Disabled" hide-details disabled />
            <v-checkbox :model-value="false" label="Disabled unchecked" hide-details disabled />
          </div>
        </div>

        <div>
          <div class="text-overline text-medium-emphasis mb-3">Colors</div>
          <div class="d-flex flex-wrap ga-4">
            <v-checkbox :model-value="true" label="Primary" color="primary" hide-details />
            <v-checkbox :model-value="true" label="Secondary" color="secondary" hide-details />
            <v-checkbox :model-value="true" label="Success" color="success" hide-details />
            <v-checkbox :model-value="true" label="Warning" color="warning" hide-details />
            <v-checkbox :model-value="true" label="Error" color="error" hide-details />
          </div>
        </div>

        <div>
          <div class="text-overline text-medium-emphasis mb-3">Checkbox Group</div>
          <v-checkbox-group v-model="group" hide-details>
            <div class="d-flex flex-wrap ga-4">
              <v-checkbox label="Email notifications" value="Email" color="primary" hide-details />
              <v-checkbox label="SMS notifications" value="SMS" color="primary" hide-details />
              <v-checkbox label="Push notifications" value="Push" color="primary" hide-details />
              <v-checkbox label="Weekly digest" value="Digest" color="primary" hide-details />
            </div>
          </v-checkbox-group>
          <div class="text-caption text-medium-emphasis mt-2">Selected: {{ group.join(', ') || 'none' }}</div>
        </div>
      </div>
    `,
  }),
}

// ── Radio Buttons ─────────────────────────────────────────────────────────────
export const RadioButtons: Story = {
  render: () => ({
    setup() {
      const plan = ref('pro')
      const color = ref('primary')
      return { plan, color }
    },
    template: `
      <div class="d-flex flex-column ga-6">
        <div>
          <div class="text-overline text-medium-emphasis mb-3">Inline Radio Group</div>
          <v-radio-group v-model="plan" inline hide-details>
            <v-radio label="Free" value="free" />
            <v-radio label="Pro" value="pro" />
            <v-radio label="Enterprise" value="enterprise" />
          </v-radio-group>
          <div class="text-caption text-medium-emphasis mt-2">Selected: {{ plan }}</div>
        </div>

        <div>
          <div class="text-overline text-medium-emphasis mb-3">Vertical Radio Group</div>
          <v-radio-group v-model="plan" hide-details>
            <v-radio label="Free — Basic features, up to 500 contacts" value="free" color="primary" />
            <v-radio label="Pro — Advanced automation, up to 10k contacts" value="pro" color="primary" />
            <v-radio label="Enterprise — Unlimited everything + SLA" value="enterprise" color="primary" />
          </v-radio-group>
        </div>

        <div>
          <div class="text-overline text-medium-emphasis mb-3">Colors</div>
          <v-radio-group v-model="color" inline hide-details>
            <v-radio label="Primary" value="primary" color="primary" />
            <v-radio label="Secondary" value="secondary" color="secondary" />
            <v-radio label="Success" value="success" color="success" />
            <v-radio label="Warning" value="warning" color="warning" />
            <v-radio label="Error" value="error" color="error" />
          </v-radio-group>
        </div>

        <div>
          <div class="text-overline text-medium-emphasis mb-3">States</div>
          <v-radio-group inline hide-details>
            <v-radio label="Normal" value="a" color="primary" />
            <v-radio label="Disabled" value="b" color="primary" disabled />
            <v-radio label="Checked disabled" value="c" color="primary" disabled :model-value="true" />
          </v-radio-group>
        </div>
      </div>
    `,
  }),
}

// ── Switches ──────────────────────────────────────────────────────────────────
export const Switches: Story = {
  render: () => ({
    setup() {
      const notifications = ref(true)
      const darkMode = ref(false)
      const marketing = ref(true)
      const api = ref(false)
      return { notifications, darkMode, marketing, api }
    },
    template: `
      <div class="d-flex flex-column ga-6">
        <div>
          <div class="text-overline text-medium-emphasis mb-3">States</div>
          <div class="d-flex flex-wrap ga-4">
            <v-switch :model-value="false" label="Off" hide-details color="primary" />
            <v-switch :model-value="true" label="On" hide-details color="primary" />
            <v-switch :model-value="true" label="Disabled on" hide-details color="primary" disabled />
            <v-switch :model-value="false" label="Disabled off" hide-details color="primary" disabled />
          </div>
        </div>

        <div>
          <div class="text-overline text-medium-emphasis mb-3">Colors</div>
          <div class="d-flex flex-wrap ga-4">
            <v-switch :model-value="true" label="Primary" hide-details color="primary" />
            <v-switch :model-value="true" label="Secondary" hide-details color="secondary" />
            <v-switch :model-value="true" label="Success" hide-details color="success" />
            <v-switch :model-value="true" label="Warning" hide-details color="warning" />
            <v-switch :model-value="true" label="Error" hide-details color="error" />
          </div>
        </div>

        <div>
          <div class="text-overline text-medium-emphasis mb-3">Notification Settings (realistic)</div>
          <v-card variant="flat" border rounded="xl" style="max-width: 420px;">
            <v-list lines="two">
              <v-list-item title="Email Notifications" subtitle="Receive order updates via email">
                <template #append>
                  <v-switch v-model="notifications" hide-details color="primary" />
                </template>
              </v-list-item>
              <v-divider style="opacity: 0.4" />
              <v-list-item title="Marketing Emails" subtitle="Promotions, tips and product updates">
                <template #append>
                  <v-switch v-model="marketing" hide-details color="primary" />
                </template>
              </v-list-item>
              <v-divider style="opacity: 0.4" />
              <v-list-item title="Dark Mode" subtitle="Use dark theme across the app">
                <template #append>
                  <v-switch v-model="darkMode" hide-details color="primary" />
                </template>
              </v-list-item>
              <v-divider style="opacity: 0.4" />
              <v-list-item title="API Access" subtitle="Enable REST API for this account">
                <template #append>
                  <v-switch v-model="api" hide-details color="primary" />
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </div>
      </div>
    `,
  }),
}
