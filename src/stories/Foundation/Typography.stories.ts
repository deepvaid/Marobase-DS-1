import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { VContainer, VRow, VCol, VCard, VCardText } from 'vuetify/components'

const meta = {
  title: 'Foundation/Typography',
  component: VContainer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Typography Foundation

The Maropost Design System uses a carefully crafted typographic scale based on **Inter** font family for all text content. Our typography system is built on Vuetify 3's text utilities and provides consistent sizing, weights, and emphasis levels across the entire application.

## Overview

The typography system provides:
- **6 heading levels** (h1–h6) for content hierarchy
- **2 body text sizes** for regular content and secondary information
- **Caption and overline** styles for supplementary information
- **5 font weights** ranging from regular to bold
- **Text emphasis levels** (primary, medium, disabled) for information hierarchy
- **Semantic colors** for success, error, warning, and info states

## Do's ✓

- Use heading levels sequentially (h1 → h2 → h3) to maintain proper document structure
- Pair headings with body text (body-1 or body-2) for readable contrast
- Use text-medium-emphasis for secondary information and helper text
- Leverage text-disabled for inactive or non-interactive elements
- Apply semantic text colors (success, error, warning) only for status information
- Maintain consistent capitalization within sections (Title Case for headings, sentence case for body)

## Don'ts ✗

- Don't skip heading levels (e.g., h1 → h3) as it breaks document semantics
- Don't use headings for body text; use text-h6 at smallest
- Don't apply multiple font weights in the same phrase for emphasis
- Don't use text-disabled for interactive elements
- Don't mix font families or fallback fonts in component text
- Don't override line-height for typography classes

## Best Practices

1. **Hierarchy**: Use heading levels (h1 → h6) to create visual and semantic hierarchy
2. **Readability**: Keep line-length under 80 characters for body text in long-form content
3. **Emphasis**: Use font-weight-medium for callouts within body text, not bold
4. **Spacing**: Pair typography with spacing utilities (mb-2, mt-3) for vertical rhythm
5. **Color**: Reserve text-primary for interactive elements, use text-medium-emphasis for labels
6. **Accessibility**: Ensure color contrast meets WCAG AA standards (4.5:1 for body, 3:1 for large text)
        `,
      },
    },
  },
} satisfies Meta<typeof VContainer>

export default meta
type Story = StoryObj<typeof meta>

export const AllTypography: Story = {
  render: () => ({
    components: { VContainer, VRow, VCol, VCard, VCardText },
    template: `
      <v-container class="py-8">
        <!-- Headings Section -->
        <div class="mb-8">
          <p class="text-overline text-medium-emphasis mb-4">Headings</p>
          <v-row>
            <v-col cols="12">
              <v-card flat border class="pa-6 mb-4">
                <div class="text-h1 mb-2">Heading 1</div>
                <p class="text-caption text-medium-emphasis">text-h1 • 36px • 700 weight • 1.2 line-height</p>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card flat border class="pa-6 mb-4">
                <div class="text-h2 mb-2">Heading 2</div>
                <p class="text-caption text-medium-emphasis">text-h2 • 28px • 700 weight • 1.2 line-height</p>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card flat border class="pa-6 mb-4">
                <div class="text-h3 mb-2">Heading 3</div>
                <p class="text-caption text-medium-emphasis">text-h3 • 22px • 700 weight • 1.3 line-height</p>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card flat border class="pa-6 mb-4">
                <div class="text-h4 mb-2">Heading 4</div>
                <p class="text-caption text-medium-emphasis">text-h4 • 18px • 700 weight • 1.3 line-height</p>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card flat border class="pa-6 mb-4">
                <div class="text-h5 mb-2">Heading 5</div>
                <p class="text-caption text-medium-emphasis">text-h5 • 16px • 600 weight • 1.4 line-height</p>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card flat border class="pa-6 mb-4">
                <div class="text-h6 mb-2">Heading 6</div>
                <p class="text-caption text-medium-emphasis">text-h6 • 14px • 600 weight • 1.4 line-height</p>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- Body Text Section -->
        <div class="mb-8">
          <p class="text-overline text-medium-emphasis mb-4">Body Text</p>
          <v-row>
            <v-col cols="12">
              <v-card flat border class="pa-6 mb-4">
                <div class="text-body-1 mb-2">This is body text size 1. It's used for primary content and regular paragraphs throughout the application. Body 1 provides optimal readability at 14px.</div>
                <p class="text-caption text-medium-emphasis">text-body-1 • 14px • 400 weight • 1.5 line-height</p>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card flat border class="pa-6 mb-4">
                <div class="text-body-2 mb-2">This is body text size 2. It's used for secondary content, descriptions, and helper text that requires slightly more subtle appearance. Body 2 is slightly smaller at 12px.</div>
                <p class="text-caption text-medium-emphasis">text-body-2 • 12px • 400 weight • 1.5 line-height</p>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- Subtitles & Captions Section -->
        <div class="mb-8">
          <p class="text-overline text-medium-emphasis mb-4">Subtitles & Captions</p>
          <v-row>
            <v-col cols="12">
              <v-card flat border class="pa-6 mb-4">
                <div class="text-subtitle-1 mb-2">Subtitle 1</div>
                <p class="text-caption text-medium-emphasis">text-subtitle-1 • 14px • 500 weight • 1.4 line-height</p>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card flat border class="pa-6 mb-4">
                <div class="text-subtitle-2 mb-2">Subtitle 2</div>
                <p class="text-caption text-medium-emphasis">text-subtitle-2 • 12px • 500 weight • 1.4 line-height</p>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card flat border class="pa-6 mb-4">
                <div class="text-caption mb-2">This is caption text used for small labels and annotations.</div>
                <p class="text-caption text-medium-emphasis">text-caption • 11px • 500 weight • 1.4 line-height</p>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card flat border class="pa-6 mb-4">
                <div class="text-overline mb-2">This is overline text</div>
                <p class="text-caption text-medium-emphasis">text-overline • 11px • 600 weight • 1.6 line-height</p>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- Font Weights Section -->
        <div class="mb-8">
          <p class="text-overline text-medium-emphasis mb-4">Font Weights</p>
          <v-row>
            <v-col cols="12" md="6">
              <v-card flat border class="pa-6 mb-4">
                <div class="text-body-1 font-weight-regular mb-2">Regular Weight (400)</div>
                <p class="text-caption text-medium-emphasis">font-weight-regular</p>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card flat border class="pa-6 mb-4">
                <div class="text-body-1 font-weight-medium mb-2">Medium Weight (500)</div>
                <p class="text-caption text-medium-emphasis">font-weight-medium</p>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card flat border class="pa-6 mb-4">
                <div class="text-body-1 font-weight-semibold mb-2">Semibold Weight (600)</div>
                <p class="text-caption text-medium-emphasis">font-weight-semibold</p>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card flat border class="pa-6 mb-4">
                <div class="text-body-1 font-weight-bold mb-2">Bold Weight (700)</div>
                <p class="text-caption text-medium-emphasis">font-weight-bold</p>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- Text Emphasis Section -->
        <div class="mb-8">
          <p class="text-overline text-medium-emphasis mb-4">Text Emphasis & Color</p>
          <v-row>
            <v-col cols="12" md="6">
              <v-card flat border class="pa-6 mb-4">
                <div class="text-body-1 text-primary mb-2">Primary Text</div>
                <p class="text-caption text-medium-emphasis">text-primary • Used for emphasis and interactive elements</p>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card flat border class="pa-6 mb-4">
                <div class="text-body-1 text-medium-emphasis mb-2">Medium Emphasis Text</div>
                <p class="text-caption text-medium-emphasis">text-medium-emphasis • Used for secondary information</p>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card flat border class="pa-6 mb-4">
                <div class="text-body-1 text-disabled mb-2">Disabled Text</div>
                <p class="text-caption text-medium-emphasis">text-disabled • Used for inactive or non-interactive elements</p>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card flat border class="pa-6 mb-4">
                <div class="text-body-1 text-success mb-2">Success Text</div>
                <p class="text-caption text-medium-emphasis">text-success • Used for positive status information</p>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card flat border class="pa-6 mb-4">
                <div class="text-body-1 text-error mb-2">Error Text</div>
                <p class="text-caption text-medium-emphasis">text-error • Used for error messages and invalid states</p>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card flat border class="pa-6 mb-4">
                <div class="text-body-1 text-warning mb-2">Warning Text</div>
                <p class="text-caption text-medium-emphasis">text-warning • Used for warning messages</p>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-container>
    `,
  }),
}
