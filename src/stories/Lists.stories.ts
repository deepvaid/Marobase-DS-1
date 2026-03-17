import type { Meta, StoryObj } from '@storybook/vue3'
import { VList } from 'vuetify/components'

interface ListsArgs {
  lines: false | 'one' | 'two' | 'three'
  density: 'default' | 'comfortable' | 'compact'
  nav: boolean
  disabled: boolean
  bgColor: string
}

const meta: Meta<ListsArgs> = {
  title: 'Base/Lists',
  component: VList,
  tags: ['autodocs'],
  argTypes: {
    lines: {
      control: 'select',
      options: [false, 'one', 'two', 'three'],
      description: 'Number of text lines per item',
      table: {
        category: 'Appearance',
        defaultValue: 'one',
      },
    },
    density: {
      control: 'select',
      options: ['default', 'comfortable', 'compact'],
      description: 'Vertical spacing density',
      table: {
        category: 'Appearance',
        defaultValue: 'default',
      },
    },
    nav: {
      control: 'boolean',
      description: 'Enables nav styles with rounded items',
      table: {
        category: 'Appearance',
        defaultValue: false,
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the entire list',
      table: {
        category: 'State',
        defaultValue: false,
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
  },
  args: {
    lines: 'one',
    density: 'default',
    nav: false,
    disabled: false,
    bgColor: '',
  },
  parameters: {
    docs: {
      description: {
        component: `
# Lists

Lists are continuous, vertical indexes of text and images. They are ideal for presenting a series of items in a compact, scannable format.

## Overview

VList and VListItem components create organized, flexible lists with support for icons, avatars, nested items, and subheaders. Use lists for navigation, menu items, or data presentation.

## Do's

- Use lists for related grouped items
- Include icons or avatars for visual hierarchy
- Use \`nav\` variant for navigation lists
- Group related items with subheaders
- Keep list items concise and scannable

## Don'ts

- Don't overload list items with content
- Avoid mixing different content types without organization
- Don't use lists for complex data tables
- Avoid very long list item text

## Best Practices

- Use \`density="compact"\` for dense data lists
- Combine with VListItemGroup for selection
- Use \`lines="two"\` or \`"three"\` for additional context
- Pair with VDivider for visual separation
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
      const items = [
        { icon: 'mdi-home', title: 'Dashboard' },
        { icon: 'mdi-chart-box', title: 'Analytics' },
        { icon: 'mdi-shopping-cart', title: 'Orders' },
        { icon: 'mdi-email', title: 'Campaigns' },
        { icon: 'mdi-cog', title: 'Settings' },
      ]
      return { args, items }
    },
    template: `
      <div class="pa-6">
        <v-list
          :lines="args.lines"
          :density="args.density"
          :nav="args.nav"
          :disabled="args.disabled"
          :bg-color="args.bgColor"
        >
          <v-list-item
            v-for="item in items"
            :key="item.title"
            :prepend-icon="item.icon"
            :title="item.title"
          />
        </v-list>
      </div>
    `,
  }),
}

export const SingleLine: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="pa-6">
        <v-list lines="one">
          <v-list-item prepend-icon="mdi-home" title="Dashboard" />
          <v-list-item prepend-icon="mdi-chart-box" title="Analytics" />
          <v-list-item prepend-icon="mdi-shopping-cart" title="Orders" />
          <v-list-item prepend-icon="mdi-email" title="Campaigns" />
        </v-list>
      </div>
    `,
  }),
}

export const TwoLine: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="pa-6">
        <v-list lines="two">
          <v-list-item prepend-icon="mdi-account" title="John Doe" subtitle="john@example.com" />
          <v-list-item prepend-icon="mdi-account" title="Jane Smith" subtitle="jane@example.com" />
          <v-list-item prepend-icon="mdi-account" title="Bob Johnson" subtitle="bob@example.com" />
        </v-list>
      </div>
    `,
  }),
}

export const ActionList: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="pa-6">
        <v-list>
          <v-list-item title="Item 1">
            <template #append>
              <v-icon icon="mdi-chevron-right" />
            </template>
          </v-list-item>
          <v-list-item title="Item 2">
            <template #append>
              <v-icon icon="mdi-chevron-right" />
            </template>
          </v-list-item>
          <v-list-item title="Item 3">
            <template #append>
              <v-icon icon="mdi-chevron-right" />
            </template>
          </v-list-item>
        </v-list>
      </div>
    `,
  }),
}

export const NestedGroups: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="pa-6">
        <v-list>
          <v-list-subheader title="Navigation" />
          <v-list-item prepend-icon="mdi-home" title="Dashboard" />
          <v-list-item prepend-icon="mdi-chart-box" title="Analytics" />
          
          <v-divider class="my-2" />
          
          <v-list-subheader title="Management" />
          <v-list-item prepend-icon="mdi-shopping-cart" title="Orders" />
          <v-list-item prepend-icon="mdi-package" title="Products" />
          
          <v-divider class="my-2" />
          
          <v-list-subheader title="Settings" />
          <v-list-item prepend-icon="mdi-cog" title="Account" />
          <v-list-item prepend-icon="mdi-shield-key" title="Security" />
        </v-list>
      </div>
    `,
  }),
}
