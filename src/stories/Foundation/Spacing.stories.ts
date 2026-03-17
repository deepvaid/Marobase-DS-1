import type { Meta, StoryObj } from '@storybook/vue3'
import { VContainer, VRow, VCol, VCard, VCardText } from 'vuetify/components'

const meta = {
  title: 'Foundation/Spacing & Layout',
  component: VContainer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Spacing & Layout

The Maropost Design System uses a consistent spacing scale based on a 4px base unit. This ensures harmonious visual rhythm, predictable layouts, and maintains consistency across all pages and components. The spacing system extends to layout dimensions for common UI structures like sidebars, app bars, and drawers.

## Overview

The spacing system provides:
- **Base Unit**: 4px as the fundamental spacing increment
- **Spacing Scale**: 8 standard spacing values (4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 64)
- **Padding & Margin Utilities**: pa-*, ma-* classes for quick spacing application
- **Gap Utilities**: ga-* classes for flex and grid item spacing
- **Border Radius Scale**: 5 standard radius values (sm=4, md=8, lg=12, xl=16, full=9999)
- **Layout Dimensions**: Fixed widths for sidebar (260px), app bar (56px), drawer (480px), and content max (1280px)

## Do's ✓

- Use spacing increments (4, 8, 12, 16, 20, 24, etc.) to maintain visual rhythm
- Apply consistent spacing between sections using mb-4, mb-6, or mb-8
- Use gap utilities (ga-2, ga-3, ga-4) for flex and grid layouts instead of manual margins
- Group related content with 16px (spacing-4) spacing minimum
- Separate major sections with 24–32px spacing (spacing-6 or spacing-8)
- Use rounded-md (8px) for most cards and buttons; reserve rounded-lg for larger containers
- Respect the 260px sidebar, 56px app bar, and 480px drawer dimensions in layout planning

## Don'ts ✗

- Don't use arbitrary pixel values for spacing; always use spacing scale
- Don't mix different spacing scales within the same section
- Don't apply spacing utilities directly to reusable components (define in parent)
- Don't use tight spacing (less than 8px) for interactive elements
- Don't reserve rounded-full for anything except circular avatars or pills
- Don't ignore the 1280px content max-width on desktop screens
- Don't use hardcoded margin/padding values in component styles

## Best Practices

1. **Rhythm**: Maintain consistent spacing vertically (mb-4 between sections, mb-6 between major areas)
2. **Density**: Use tighter spacing (ga-2, pa-3) in data-heavy contexts, looser spacing (ga-4, pa-6) for marketing
3. **Responsiveness**: Reduce spacing on mobile (pa-3 instead of pa-6) using responsive classes
4. **Grouping**: Use spacing to visually group related content; increase spacing to separate concerns
5. **Alignment**: Align spacing with layout grid (multiples of 4px) for pixel-perfect layouts
6. **Containers**: Apply padding (pa-6) consistently to all content cards
7. **Whitespace**: Don't underestimate whitespace; it improves readability and cognitive load
        `,
      },
    },
  },
} satisfies Meta<typeof VContainer>

export default meta
type Story = StoryObj<typeof meta>

const spacingValues = [
  { name: 'XS', value: 4, class: 'pa-1' },
  { name: 'SM', value: 8, class: 'pa-2' },
  { name: 'MD', value: 12, class: 'pa-3' },
  { name: 'LG', value: 16, class: 'pa-4' },
  { name: 'XL', value: 20, class: 'pa-5' },
  { name: '2XL', value: 24, class: 'pa-6' },
  { name: '3XL', value: 28, class: 'pa-7' },
  { name: '4XL', value: 32, class: 'pa-8' },
  { name: '5XL', value: 40, class: 'pa-10' },
  { name: '6XL', value: 48, class: 'pa-12' },
  { name: '7XL', value: 64, class: 'pa-16' },
]

const radiusValues = [
  { name: 'None', value: 0, class: 'rounded-0' },
  { name: 'Small', value: 4, class: 'rounded-sm', desc: 'Buttons, chips' },
  { name: 'Medium', value: 8, class: 'rounded', desc: 'Cards, input fields' },
  { name: 'Large', value: 12, class: 'rounded-lg', desc: 'Dialogs, containers' },
  { name: 'Extra Large', value: 16, class: 'rounded-xl', desc: 'Large modals' },
  { name: 'Full', value: 9999, class: 'rounded-pill', desc: 'Avatars, badges' },
]

const layoutDimensions = [
  { name: 'Sidebar Width', value: 260, unit: 'px' },
  { name: 'App Bar Height', value: 56, unit: 'px' },
  { name: 'Form Drawer Width', value: 480, unit: 'px' },
  { name: 'Content Max Width', value: 1280, unit: 'px' },
]

export const SpacingScale: Story = {
  render: () => ({
    components: { VContainer, VRow, VCol, VCard, VCardText },
    template: `
      <v-container class="py-8">
        <p class="text-overline text-medium-emphasis mb-6">Spacing Scale (4px base unit)</p>
        <v-row>
          <v-col cols="12">
            <div class="mb-6">
              <p v-for="spacing in spacingValues" :key="spacing.value" class="mb-4">
                <span class="d-inline-block text-caption text-medium-emphasis" style="width: 140px;">{{ spacing.name }} ({{ spacing.value }}px)</span>
                <div :style="{ width: spacing.value + 'px', height: '24px', backgroundColor: '#0091FF', display: 'inline-block' }"></div>
                <span class="text-caption text-medium-emphasis ml-3">{{ spacing.class }}</span>
              </p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    `,
    setup() {
      return { spacingValues }
    },
  }),
}

export const GapUtilities: Story = {
  render: () => ({
    components: { VContainer, VRow, VCol, VCard, VCardText },
    template: `
      <v-container class="py-8">
        <p class="text-overline text-medium-emphasis mb-6">Gap Utilities (for flex and grid)</p>
        <v-row>
          <v-col cols="12" class="mb-6">
            <div>
              <p class="text-subtitle-2 font-weight-medium mb-3">Gap 2 (8px)</p>
              <div style="display: flex; gap: 8px;" class="mb-4">
                <div style="width: 60px; height: 60px; background-color: #0091FF; border-radius: 8px;"></div>
                <div style="width: 60px; height: 60px; background-color: #0091FF; border-radius: 8px;"></div>
                <div style="width: 60px; height: 60px; background-color: #0091FF; border-radius: 8px;"></div>
              </div>
              <p class="text-caption text-medium-emphasis">ga-2 • Tight spacing for related items</p>
            </div>
          </v-col>
          <v-col cols="12" class="mb-6">
            <div>
              <p class="text-subtitle-2 font-weight-medium mb-3">Gap 3 (12px)</p>
              <div style="display: flex; gap: 12px;" class="mb-4">
                <div style="width: 60px; height: 60px; background-color: #7E3AF2; border-radius: 8px;"></div>
                <div style="width: 60px; height: 60px; background-color: #7E3AF2; border-radius: 8px;"></div>
                <div style="width: 60px; height: 60px; background-color: #7E3AF2; border-radius: 8px;"></div>
              </div>
              <p class="text-caption text-medium-emphasis">ga-3 • Standard spacing for items</p>
            </div>
          </v-col>
          <v-col cols="12" class="mb-6">
            <div>
              <p class="text-subtitle-2 font-weight-medium mb-3">Gap 4 (16px)</p>
              <div style="display: flex; gap: 16px;" class="mb-4">
                <div style="width: 60px; height: 60px; background-color: #0E9F6E; border-radius: 8px;"></div>
                <div style="width: 60px; height: 60px; background-color: #0E9F6E; border-radius: 8px;"></div>
                <div style="width: 60px; height: 60px; background-color: #0E9F6E; border-radius: 8px;"></div>
              </div>
              <p class="text-caption text-medium-emphasis">ga-4 • Comfortable spacing for groups</p>
            </div>
          </v-col>
          <v-col cols="12" class="mb-6">
            <div>
              <p class="text-subtitle-2 font-weight-medium mb-3">Gap 6 (24px)</p>
              <div style="display: flex; gap: 24px;" class="mb-4">
                <div style="width: 60px; height: 60px; background-color: #D97706; border-radius: 8px;"></div>
                <div style="width: 60px; height: 60px; background-color: #D97706; border-radius: 8px;"></div>
                <div style="width: 60px; height: 60px; background-color: #D97706; border-radius: 8px;"></div>
              </div>
              <p class="text-caption text-medium-emphasis">ga-6 • Generous spacing for major sections</p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    `,
  }),
}

export const BorderRadius: Story = {
  render: () => ({
    components: { VContainer, VRow, VCol, VCard, VCardText },
    template: `
      <v-container class="py-8">
        <p class="text-overline text-medium-emphasis mb-6">Border Radius</p>
        <v-row>
          <v-col v-for="radius in radiusValues" :key="radius.class" cols="12" sm="6" md="4" class="mb-4">
            <v-card flat border class="pa-6">
              <div
                :style="{
                  backgroundColor: '#0091FF',
                  height: '80px',
                  borderRadius: radius.value === 9999 ? '9999px' : radius.value + 'px',
                  marginBottom: '16px'
                }">
              </div>
              <p class="text-subtitle-2 font-weight-medium mb-1">{{ radius.name }}</p>
              <p class="text-caption text-medium-emphasis mb-1">{{ radius.class }}</p>
              <p v-if="radius.desc" class="text-caption text-disabled">{{ radius.desc }}</p>
              <p class="text-caption text-disabled">{{ radius.value }}px</p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    `,
    setup() {
      return { radiusValues }
    },
  }),
}

export const LayoutDimensions: Story = {
  render: () => ({
    components: { VContainer, VRow, VCol, VCard, VCardText },
    template: `
      <v-container class="py-8">
        <p class="text-overline text-medium-emphasis mb-6">Layout Dimensions</p>
        <v-row>
          <v-col cols="12" class="mb-6">
            <p class="text-subtitle-2 font-weight-medium mb-3">Sidebar Width</p>
            <div class="d-flex align-center mb-3">
              <div style="width: 260px; height: 40px; background-color: #0091FF; border-radius: 8px;"></div>
              <span class="text-body-2 ml-4">260px</span>
            </div>
            <p class="text-caption text-medium-emphasis">Left navigation sidebar width (collapsible to 64px rail)</p>
          </v-col>
          <v-col cols="12" class="mb-6">
            <p class="text-subtitle-2 font-weight-medium mb-3">App Bar Height</p>
            <div class="d-flex align-center mb-3">
              <div style="width: 100%; max-width: 400px; height: 56px; background-color: #7E3AF2; border-radius: 8px;"></div>
              <span class="text-body-2 ml-4">56px</span>
            </div>
            <p class="text-caption text-medium-emphasis">Top application bar height with search, notifications, and user menu</p>
          </v-col>
          <v-col cols="12" class="mb-6">
            <p class="text-subtitle-2 font-weight-medium mb-3">Form Drawer Width</p>
            <div class="d-flex align-center mb-3">
              <div style="width: 480px; height: 40px; background-color: #0E9F6E; border-radius: 8px;"></div>
              <span class="text-body-2 ml-4">480px</span>
            </div>
            <p class="text-caption text-medium-emphasis">Right-side drawer width for create/edit forms and details panels</p>
          </v-col>
          <v-col cols="12" class="mb-6">
            <p class="text-subtitle-2 font-weight-medium mb-3">Content Max Width</p>
            <div class="d-flex align-center mb-3">
              <div style="width: 100%; max-width: 1280px; height: 40px; background-color: #D97706; border-radius: 8px;"></div>
              <span class="text-body-2 ml-4">1280px</span>
            </div>
            <p class="text-caption text-medium-emphasis">Maximum width for main content area on desktop screens; prevents awkward line lengths</p>
          </v-col>
        </v-row>
      </v-container>
    `,
  }),
}

export const CombinedSpacingExample: Story = {
  render: () => ({
    components: { VContainer, VRow, VCol, VCard, VCardText },
    template: `
      <v-container class="py-8">
        <p class="text-overline text-medium-emphasis mb-6">Spacing in Practice</p>
        <v-row>
          <v-col cols="12" lg="6">
            <p class="text-subtitle-2 font-weight-medium mb-4">Tight Layout (Data Table)</p>
            <v-card flat border class="pa-4">
              <p class="text-overline text-medium-emphasis mb-3">Section Header</p>
              <v-card flat border variant="outlined" class="pa-3 mb-3 ga-2" style="display: flex; gap: 8px;">
                <div style="width: 40px; height: 40px; background-color: #E5E7EB; border-radius: 8px;"></div>
                <div style="flex: 1;">
                  <p class="text-body-2 mb-1">Item 1</p>
                  <p class="text-caption text-medium-emphasis">Tight vertical spacing (8px)</p>
                </div>
              </v-card>
              <v-card flat border variant="outlined" class="pa-3 ga-2" style="display: flex; gap: 8px;">
                <div style="width: 40px; height: 40px; background-color: #E5E7EB; border-radius: 8px;"></div>
                <div style="flex: 1;">
                  <p class="text-body-2 mb-1">Item 2</p>
                  <p class="text-caption text-medium-emphasis">Tight vertical spacing (8px)</p>
                </div>
              </v-card>
            </v-card>
          </v-col>
          <v-col cols="12" lg="6">
            <p class="text-subtitle-2 font-weight-medium mb-4">Spacious Layout (Dashboard)</p>
            <v-card flat border class="pa-6">
              <p class="text-overline text-medium-emphasis mb-6">Section Header</p>
              <v-card flat border variant="tonal" color="primary" class="pa-6 mb-6">
                <p class="text-body-1 font-weight-medium mb-2">KPI Card</p>
                <p class="text-caption text-medium-emphasis">24px spacing between items</p>
              </v-card>
              <v-card flat border variant="tonal" color="secondary" class="pa-6">
                <p class="text-body-1 font-weight-medium mb-2">KPI Card</p>
                <p class="text-caption text-medium-emphasis">24px spacing between items</p>
              </v-card>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    `,
  }),
}
