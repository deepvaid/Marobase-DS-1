import type { Meta, StoryObj } from '@storybook/vue3'
import { VContainer, VRow, VCol, VCard, VCardText } from 'vuetify/components'

const meta = {
  title: 'Foundation/Colors',
  component: VContainer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Color Palette

The Maropost Design System color palette is built on Material Design 3 principles and includes brand colors, semantic colors, and surface colors. All colors are designed to ensure accessibility compliance (WCAG AA) and work seamlessly in both light and dark themes.

## Overview

The color system provides:
- **Brand Colors**: Primary (#0091FF) and Secondary (#7E3AF2) for core identity
- **Semantic Colors**: Success, Warning, Error, and Info for status and messaging
- **Surface Colors**: Background, Surface, and Border for layout structure
- **On-Colors**: Text colors specifically designed to render on colored backgrounds
- **Tonal Variants**: Softer versions of brand colors for secondary emphasis
- **Contrast Variants**: Darker shades (-darken-1) for visual hierarchy and active states

## Do's ✓

- Use primary color for main interactive elements (buttons, links, active states)
- Apply semantic colors for status information (success, error, warning, info)
- Use surface colors for layout structure and content containers
- Pair on-primary text with primary background for maximum contrast
- Apply tonal variants for secondary actions and subtle emphasis
- Use border color for dividers and outline strokes only
- Ensure color combinations meet WCAG AA contrast ratios (4.5:1 minimum)

## Don'ts ✗

- Don't use primary color for non-interactive elements or text
- Don't mix semantic colors within a single message or status indicator
- Don't apply multiple brand colors in the same component
- Don't use surface colors for interactive elements
- Don't rely on color alone to communicate information; use icons and text labels
- Don't use tonal variants for primary actions or critical elements
- Don't hardcode hex values; always use CSS variables or Vuetify color utilities

## Best Practices

1. **Consistency**: Use the same semantic color for the same meaning across all pages
2. **Accessibility**: Always check contrast ratios before shipping color combinations
3. **Hierarchy**: Use primary for main actions, secondary for alternate actions
4. **Tonal Depth**: Use darken-1 variants for hover and active states
5. **Surface Contrast**: Maintain sufficient contrast between surface and background
6. **Data Visualization**: Reserve semantic colors for status, not arbitrary styling
7. **Theme Support**: Test all colors in both light and dark theme modes
        `,
      },
    },
  },
} satisfies Meta<typeof VContainer>

export default meta
type Story = StoryObj<typeof meta>

const colorSwatches = [
  { name: 'Primary', hex: '#0091FF', class: 'primary' },
  { name: 'Primary Darken 1', hex: '#0073C6', class: 'primary-darken-1' },
  { name: 'Secondary', hex: '#7E3AF2', class: 'secondary' },
  { name: 'Secondary Darken 1', hex: '#6A2CB8', class: 'secondary-darken-1' },
]

const semanticColors = [
  { name: 'Success', hex: '#0E9F6E', class: 'success' },
  { name: 'Warning', hex: '#D97706', class: 'warning' },
  { name: 'Error', hex: '#E02424', class: 'error' },
  { name: 'Info', hex: '#1A56DB', class: 'info' },
]

const surfaceColors = [
  { name: 'Background', hex: '#F9FAFB', class: 'bg-grey-1' },
  { name: 'Surface', hex: '#FFFFFF', class: 'bg-white' },
  { name: 'Surface Variant', hex: '#F3F4F6', class: 'bg-grey-2' },
  { name: 'Border', hex: '#E5E7EB', class: 'border' },
]

export const BrandColors: Story = {
  render: () => ({
    components: { VContainer, VRow, VCol, VCard, VCardText },
    template: `
      <v-container class="py-8">
        <p class="text-overline text-medium-emphasis mb-6">Brand Colors</p>
        <v-row>
          <v-col v-for="color in colorSwatches" :key="color.name" cols="12" sm="6" md="3" class="mb-4">
            <v-card flat border class="overflow-hidden">
              <div :style="{ backgroundColor: color.hex, height: '120px' }" class="d-flex align-center justify-center">
                <span class="text-white font-weight-medium text-caption">{{ color.hex }}</span>
              </div>
              <v-card-text class="pa-3">
                <p class="text-subtitle-2 font-weight-medium mb-1">{{ color.name }}</p>
                <p class="text-caption text-medium-emphasis mb-2">{{ color.class }}</p>
                <p class="text-caption text-disabled">{{ color.hex }}</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    `,
    setup() {
      return { colorSwatches }
    },
  }),
}

export const SemanticColors: Story = {
  render: () => ({
    components: { VContainer, VRow, VCol, VCard, VCardText },
    template: `
      <v-container class="py-8">
        <p class="text-overline text-medium-emphasis mb-6">Semantic Colors</p>
        <v-row>
          <v-col v-for="color in semanticColors" :key="color.name" cols="12" sm="6" md="3" class="mb-4">
            <v-card flat border class="overflow-hidden">
              <div :style="{ backgroundColor: color.hex, height: '120px' }" class="d-flex align-center justify-center">
                <span class="text-white font-weight-medium text-caption">{{ color.hex }}</span>
              </div>
              <v-card-text class="pa-3">
                <p class="text-subtitle-2 font-weight-medium mb-1">{{ color.name }}</p>
                <p class="text-caption text-medium-emphasis mb-2">{{ color.class }}</p>
                <p class="text-caption text-disabled">{{ color.hex }}</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    `,
    setup() {
      return { semanticColors }
    },
  }),
}

export const SurfaceColors: Story = {
  render: () => ({
    components: { VContainer, VRow, VCol, VCard, VCardText },
    template: `
      <v-container class="py-8">
        <p class="text-overline text-medium-emphasis mb-6">Surface & Background Colors</p>
        <v-row>
          <v-col v-for="color in surfaceColors" :key="color.name" cols="12" sm="6" md="3" class="mb-4">
            <v-card flat border class="overflow-hidden">
              <div :style="{ backgroundColor: color.hex, height: '120px', border: '1px solid #E5E7EB' }" class="d-flex align-center justify-center">
                <span class="text-caption text-medium-emphasis">{{ color.hex }}</span>
              </div>
              <v-card-text class="pa-3">
                <p class="text-subtitle-2 font-weight-medium mb-1">{{ color.name }}</p>
                <p class="text-caption text-medium-emphasis mb-2">{{ color.class }}</p>
                <p class="text-caption text-disabled">{{ color.hex }}</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    `,
    setup() {
      return { surfaceColors }
    },
  }),
}

export const OnColors: Story = {
  render: () => ({
    components: { VContainer, VRow, VCol, VCard, VCardText },
    template: `
      <v-container class="py-8">
        <p class="text-overline text-medium-emphasis mb-6">Text On Colored Backgrounds (On-Colors)</p>
        <v-row>
          <v-col cols="12" sm="6" md="3" class="mb-4">
            <v-card flat border class="overflow-hidden">
              <div style="background-color: #0091FF; height: 120px;" class="d-flex align-center justify-center pa-4">
                <span class="text-on-primary text-body-1 font-weight-medium">Text on Primary</span>
              </div>
              <v-card-text class="pa-3">
                <p class="text-caption text-medium-emphasis mb-1">on-primary</p>
                <p class="text-caption text-disabled">Optimal contrast on primary background</p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3" class="mb-4">
            <v-card flat border class="overflow-hidden">
              <div style="background-color: #7E3AF2; height: 120px;" class="d-flex align-center justify-center pa-4">
                <span class="text-on-secondary text-body-1 font-weight-medium">Text on Secondary</span>
              </div>
              <v-card-text class="pa-3">
                <p class="text-caption text-medium-emphasis mb-1">on-secondary</p>
                <p class="text-caption text-disabled">Optimal contrast on secondary background</p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3" class="mb-4">
            <v-card flat border class="overflow-hidden">
              <div style="background-color: #0E9F6E; height: 120px;" class="d-flex align-center justify-center pa-4">
                <span class="text-white text-body-1 font-weight-medium">Text on Success</span>
              </div>
              <v-card-text class="pa-3">
                <p class="text-caption text-medium-emphasis mb-1">on-success</p>
                <p class="text-caption text-disabled">Optimal contrast on success background</p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3" class="mb-4">
            <v-card flat border class="overflow-hidden">
              <div style="background-color: #E02424; height: 120px;" class="d-flex align-center justify-center pa-4">
                <span class="text-white text-body-1 font-weight-medium">Text on Error</span>
              </div>
              <v-card-text class="pa-3">
                <p class="text-caption text-medium-emphasis mb-1">on-error</p>
                <p class="text-caption text-disabled">Optimal contrast on error background</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    `,
  }),
}

export const TonalVariants: Story = {
  render: () => ({
    components: { VContainer, VRow, VCol, VCard, VCardText },
    template: `
      <v-container class="py-8">
        <p class="text-overline text-medium-emphasis mb-6">Tonal Variants</p>
        <v-row>
          <v-col cols="12" sm="6" md="4" class="mb-4">
            <v-card flat border variant="tonal" color="primary" class="pa-6 mb-2">
              <p class="text-body-1 font-weight-medium mb-0">Primary Tonal</p>
            </v-card>
            <p class="text-caption text-medium-emphasis">Softer version of primary for secondary actions and low-emphasis backgrounds</p>
          </v-col>
          <v-col cols="12" sm="6" md="4" class="mb-4">
            <v-card flat border variant="tonal" color="secondary" class="pa-6 mb-2">
              <p class="text-body-1 font-weight-medium mb-0">Secondary Tonal</p>
            </v-card>
            <p class="text-caption text-medium-emphasis">Softer version of secondary for alternative actions</p>
          </v-col>
          <v-col cols="12" sm="6" md="4" class="mb-4">
            <v-card flat border variant="tonal" color="success" class="pa-6 mb-2">
              <p class="text-body-1 font-weight-medium mb-0">Success Tonal</p>
            </v-card>
            <p class="text-caption text-medium-emphasis">Softer version of success for gentle success indicators</p>
          </v-col>
          <v-col cols="12" sm="6" md="4" class="mb-4">
            <v-card flat border variant="tonal" color="warning" class="pa-6 mb-2">
              <p class="text-body-1 font-weight-medium mb-0">Warning Tonal</p>
            </v-card>
            <p class="text-caption text-medium-emphasis">Softer version of warning for cautionary messages</p>
          </v-col>
          <v-col cols="12" sm="6" md="4" class="mb-4">
            <v-card flat border variant="tonal" color="error" class="pa-6 mb-2">
              <p class="text-body-1 font-weight-medium mb-0">Error Tonal</p>
            </v-card>
            <p class="text-caption text-medium-emphasis">Softer version of error for subtle error backgrounds</p>
          </v-col>
          <v-col cols="12" sm="6" md="4" class="mb-4">
            <v-card flat border variant="tonal" color="info" class="pa-6 mb-2">
              <p class="text-body-1 font-weight-medium mb-0">Info Tonal</p>
            </v-card>
            <p class="text-caption text-medium-emphasis">Softer version of info for informational backgrounds</p>
          </v-col>
        </v-row>
      </v-container>
    `,
  }),
}
