import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'Base/Buttons',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ── Variants ──────────────────────────────────────────────────────────────────
export const Variants: Story = {
  render: () => ({
    template: `
      <div class="d-flex flex-column ga-6">
        <div>
          <div class="text-overline text-medium-emphasis mb-3">Variants</div>
          <div class="d-flex align-center flex-wrap ga-3">
            <v-btn color="primary" variant="elevated" class="text-none">Elevated</v-btn>
            <v-btn color="primary" variant="flat" class="text-none">Flat</v-btn>
            <v-btn color="primary" variant="tonal" class="text-none">Tonal</v-btn>
            <v-btn color="primary" variant="outlined" class="text-none">Outlined</v-btn>
            <v-btn color="primary" variant="text" class="text-none">Text</v-btn>
            <v-btn color="primary" variant="plain" class="text-none">Plain</v-btn>
          </div>
        </div>

        <div>
          <div class="text-overline text-medium-emphasis mb-3">Sizes</div>
          <div class="d-flex align-center flex-wrap ga-3">
            <v-btn color="primary" variant="flat" size="x-small" class="text-none">X-Small</v-btn>
            <v-btn color="primary" variant="flat" size="small" class="text-none">Small</v-btn>
            <v-btn color="primary" variant="flat" size="default" class="text-none">Default</v-btn>
            <v-btn color="primary" variant="flat" size="large" class="text-none">Large</v-btn>
            <v-btn color="primary" variant="flat" size="x-large" class="text-none">X-Large</v-btn>
          </div>
        </div>

        <div>
          <div class="text-overline text-medium-emphasis mb-3">With Icons</div>
          <div class="d-flex align-center flex-wrap ga-3">
            <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" class="text-none">Add Item</v-btn>
            <v-btn color="primary" variant="outlined" append-icon="mdi-chevron-down" class="text-none">Options</v-btn>
            <v-btn color="primary" variant="tonal" prepend-icon="mdi-download" class="text-none">Export</v-btn>
            <v-btn variant="outlined" prepend-icon="mdi-upload" class="text-none">Import</v-btn>
            <v-btn icon="mdi-dots-horizontal" variant="text" color="medium-emphasis" />
            <v-btn icon="mdi-pencil-outline" variant="tonal" color="primary" size="small" />
          </div>
        </div>

        <div>
          <div class="text-overline text-medium-emphasis mb-3">Semantic Colors</div>
          <div class="d-flex align-center flex-wrap ga-3">
            <v-btn color="primary" variant="flat" class="text-none">Primary</v-btn>
            <v-btn color="secondary" variant="flat" class="text-none">Secondary</v-btn>
            <v-btn color="success" variant="flat" class="text-none">Success</v-btn>
            <v-btn color="warning" variant="flat" class="text-none">Warning</v-btn>
            <v-btn color="error" variant="flat" class="text-none">Error</v-btn>
            <v-btn color="info" variant="flat" class="text-none">Info</v-btn>
          </div>
        </div>

        <div>
          <div class="text-overline text-medium-emphasis mb-3">States</div>
          <div class="d-flex align-center flex-wrap ga-3">
            <v-btn color="primary" variant="flat" class="text-none">Normal</v-btn>
            <v-btn color="primary" variant="flat" class="text-none" loading>Loading</v-btn>
            <v-btn color="primary" variant="flat" class="text-none" disabled>Disabled</v-btn>
          </div>
        </div>

        <div>
          <div class="text-overline text-medium-emphasis mb-3">Rounded</div>
          <div class="d-flex align-center flex-wrap ga-3">
            <v-btn color="primary" variant="flat" rounded="0" class="text-none">Square</v-btn>
            <v-btn color="primary" variant="flat" rounded="sm" class="text-none">Small</v-btn>
            <v-btn color="primary" variant="flat" rounded="lg" class="text-none">Large (default)</v-btn>
            <v-btn color="primary" variant="flat" rounded="pill" class="text-none">Pill</v-btn>
          </div>
        </div>

        <div>
          <div class="text-overline text-medium-emphasis mb-3">Dark / On-Surface</div>
          <div class="d-flex align-center flex-wrap ga-3">
            <v-btn
              variant="flat"
              class="text-none"
              style="background: rgb(var(--v-theme-on-surface)); color: rgb(var(--v-theme-surface));"
            >
              Dark Button
            </v-btn>
            <v-btn variant="outlined" class="text-none text-medium-emphasis">Secondary Action</v-btn>
          </div>
        </div>

        <div>
          <div class="text-overline text-medium-emphasis mb-3">Button Group</div>
          <div class="d-flex align-center ga-3">
            <v-btn-group variant="outlined" divided rounded="lg">
              <v-btn class="text-none" prepend-icon="mdi-format-list-bulleted">List</v-btn>
              <v-btn class="text-none" prepend-icon="mdi-view-grid">Grid</v-btn>
              <v-btn class="text-none" prepend-icon="mdi-chart-bar">Chart</v-btn>
            </v-btn-group>
          </div>
        </div>
      </div>
    `,
  }),
}
