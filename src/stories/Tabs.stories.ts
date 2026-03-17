import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { VTabs } from 'vuetify/components'

interface TabsArgs {
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  bgColor: string
  density: 'default' | 'comfortable' | 'compact'
  direction: 'horizontal' | 'vertical'
  grow: boolean
  centered: boolean
  alignTabs: 'start' | 'center' | 'end' | 'title'
  showArrows: boolean
  fixedTabs: boolean
}

const meta: Meta<TabsArgs> = {
  title: 'Base/Tabs',
  component: VTabs,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info'],
      description: 'Indicator bar color',
      table: {
        category: 'Appearance',
        defaultValue: 'primary',
      },
    },
    bgColor: {
      control: 'text',
      description: 'Background color',
      table: {
        category: 'Appearance',
        defaultValue: '',
      },
    },
    density: {
      control: 'select',
      options: ['default', 'comfortable', 'compact'],
      description: 'Tab height density',
      table: {
        category: 'Appearance',
        defaultValue: 'default',
      },
    },
    direction: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Tab direction',
      table: {
        category: 'Layout',
        defaultValue: 'horizontal',
      },
    },
    grow: {
      control: 'boolean',
      description: 'Tabs grow to fill available width',
      table: {
        category: 'Layout',
        defaultValue: false,
      },
    },
    centered: {
      control: 'boolean',
      description: 'Center tabs',
      table: {
        category: 'Layout',
        defaultValue: false,
      },
    },
    alignTabs: {
      control: 'select',
      options: ['start', 'center', 'end', 'title'],
      description: 'Tab alignment',
      table: {
        category: 'Layout',
        defaultValue: 'start',
      },
    },
    showArrows: {
      control: 'boolean',
      description: 'Show scroll arrows for overflow',
      table: {
        category: 'Behavior',
        defaultValue: false,
      },
    },
    fixedTabs: {
      control: 'boolean',
      description: 'All tabs equal width',
      table: {
        category: 'Layout',
        defaultValue: false,
      },
    },
  },
  args: {
    color: 'primary',
    bgColor: '',
    density: 'default',
    direction: 'horizontal',
    grow: false,
    centered: false,
    alignTabs: 'start',
    showArrows: false,
    fixedTabs: false,
  },
  parameters: {
    docs: {
      description: {
        component: `
# Tabs

Tabs organize content into logical sections and allow users to switch between views without leaving the page.

## Overview

VTabs and VTabsWindow provide tabbed navigation. Tabs display as a horizontal or vertical bar with an indicator showing the active tab. Content switches when tabs are clicked.

## Do's

- Use tabs for content sections on the same page
- Keep tab labels short and descriptive
- Use icons with labels for clarity
- Limit to 3-7 tabs per row
- Use consistent styling across tabs

## Don'ts

- Don't use tabs for primary navigation
- Avoid complex content transitions
- Don't mix icon-only and text tabs
- Avoid tabs with very long labels
- Don't use vertical tabs for many items

## Best Practices

- Use \`grow\` for small tab sets (3-4 items)
- Use \`fixedTabs\` for consistent tab widths
- Combine with VTabsWindow for content switching
- Use icons (prepend-icon) for visual clarity
- Position indicator at bottom (default) for modern look
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    setup() {
      const tab = ref('overview')
      return { args, tab }
    },
    template: `
      <div class="pa-6">
        <v-tabs
          v-model="tab"
          :color="args.color"
          :bg-color="args.bgColor"
          :density="args.density"
          :direction="args.direction"
          :grow="args.grow"
          :centered="args.centered"
          :align-tabs="args.alignTabs"
          :show-arrows="args.showArrows"
          :fixed-tabs="args.fixedTabs"
        >
          <v-tab value="overview">Overview</v-tab>
          <v-tab value="details">Details</v-tab>
          <v-tab value="settings">Settings</v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab" class="mt-4">
          <v-tabs-window-item value="overview">
            <v-card flat>
              <v-card-text>Overview tab content</v-card-text>
            </v-card>
          </v-tabs-window-item>
          <v-tabs-window-item value="details">
            <v-card flat>
              <v-card-text>Details tab content</v-card-text>
            </v-card>
          </v-tabs-window-item>
          <v-tabs-window-item value="settings">
            <v-card flat>
              <v-card-text>Settings tab content</v-card-text>
            </v-card>
          </v-tabs-window-item>
        </v-tabs-window>
      </div>
    `,
  }),
}

export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    setup() {
      const tab = ref('tab1')
      return { tab }
    },
    template: `
      <div class="pa-6">
        <v-tabs v-model="tab" bg-color="primary">
          <v-tab value="tab1">Tab 1</v-tab>
          <v-tab value="tab2">Tab 2</v-tab>
          <v-tab value="tab3">Tab 3</v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab" class="mt-4">
          <v-tabs-window-item value="tab1">
            <v-card flat>
              <v-card-text>Content for Tab 1</v-card-text>
            </v-card>
          </v-tabs-window-item>
          <v-tabs-window-item value="tab2">
            <v-card flat>
              <v-card-text>Content for Tab 2</v-card-text>
            </v-card>
          </v-tabs-window-item>
          <v-tabs-window-item value="tab3">
            <v-card flat>
              <v-card-text>Content for Tab 3</v-card-text>
            </v-card>
          </v-tabs-window-item>
        </v-tabs-window>
      </div>
    `,
  }),
}

export const WithIcons: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    setup() {
      const tab = ref('home')
      return { tab }
    },
    template: `
      <div class="pa-6">
        <v-tabs v-model="tab">
          <v-tab value="home" prepend-icon="mdi-home">Home</v-tab>
          <v-tab value="chart" prepend-icon="mdi-chart-box">Analytics</v-tab>
          <v-tab value="settings" prepend-icon="mdi-cog">Settings</v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab" class="mt-4">
          <v-tabs-window-item value="home">
            <v-card flat>
              <v-card-text>Home content with icon</v-card-text>
            </v-card>
          </v-tabs-window-item>
          <v-tabs-window-item value="chart">
            <v-card flat>
              <v-card-text>Analytics content with icon</v-card-text>
            </v-card>
          </v-tabs-window-item>
          <v-tabs-window-item value="settings">
            <v-card flat>
              <v-card-text>Settings content with icon</v-card-text>
            </v-card>
          </v-tabs-window-item>
        </v-tabs-window>
      </div>
    `,
  }),
}

export const Vertical: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    setup() {
      const tab = ref('section1')
      return { tab }
    },
    template: `
      <div class="pa-6 d-flex gap-4">
        <v-tabs v-model="tab" direction="vertical" style="flex-shrink: 0; width: 150px;">
          <v-tab value="section1">Section 1</v-tab>
          <v-tab value="section2">Section 2</v-tab>
          <v-tab value="section3">Section 3</v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab" style="flex: 1;">
          <v-tabs-window-item value="section1">
            <v-card flat>
              <v-card-text>Section 1 content (vertical tabs)</v-card-text>
            </v-card>
          </v-tabs-window-item>
          <v-tabs-window-item value="section2">
            <v-card flat>
              <v-card-text>Section 2 content (vertical tabs)</v-card-text>
            </v-card>
          </v-tabs-window-item>
          <v-tabs-window-item value="section3">
            <v-card flat>
              <v-card-text>Section 3 content (vertical tabs)</v-card-text>
            </v-card>
          </v-tabs-window-item>
        </v-tabs-window>
      </div>
    `,
  }),
}
