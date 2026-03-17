import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { VMenu } from 'vuetify/components'

interface MenusArgs {
  location: 'bottom' | 'top' | 'start' | 'end' | 'bottom start' | 'bottom end' | 'top start' | 'top end'
  transition: 'scale-transition' | 'fade-transition' | 'slide-y-transition' | 'slide-x-transition'
  closeOnContentClick: boolean
  openOnHover: boolean
  offset: string
}

const meta: Meta<MenusArgs> = {
  title: 'Base/Menus',
  component: VMenu,
  tags: ['autodocs'],
  argTypes: {
    location: {
      control: 'select',
      options: ['bottom', 'top', 'start', 'end', 'bottom start', 'bottom end', 'top start', 'top end'],
      description: 'Menu position relative to activator',
      table: {
        category: 'Appearance',
        defaultValue: 'bottom',
      },
    },
    transition: {
      control: 'select',
      options: ['scale-transition', 'fade-transition', 'slide-y-transition', 'slide-x-transition'],
      description: 'Transition animation',
      table: {
        category: 'Appearance',
        defaultValue: 'scale-transition',
      },
    },
    closeOnContentClick: {
      control: 'boolean',
      description: 'Automatically close when menu item is clicked',
      table: {
        category: 'Behavior',
        defaultValue: true,
      },
    },
    openOnHover: {
      control: 'boolean',
      description: 'Open menu on hover instead of click',
      table: {
        category: 'Behavior',
        defaultValue: false,
      },
    },
    offset: {
      control: 'text',
      description: 'Offset distance from activator',
      table: {
        category: 'Appearance',
        defaultValue: '',
      },
    },
  },
  args: {
    location: 'bottom',
    transition: 'scale-transition',
    closeOnContentClick: true,
    openOnHover: false,
    offset: '',
  },
  parameters: {
    docs: {
      description: {
        component: `
# Menus

Menus display a list of choices on a temporary surface. They appear when users interact with a button, action, or other control.

## Overview

VMenu component provides a context menu or dropdown list that appears at a specified location. It's ideal for actions, options, and navigation lists triggered by user interaction.

## Do's

- Use menus for action lists (Edit, Delete, Archive)
- Position menus near the activator button
- Close menu automatically on item selection
- Keep menu items concise and actionable
- Use consistent spacing between items

## Don'ts

- Don't use menus for primary navigation
- Avoid nesting menus deeply
- Don't put complex forms in menus
- Avoid menu items with lengthy descriptions

## Best Practices

- Use \`location="bottom start"\` for right-aligned menus
- Combine with VList for consistent styling
- Use icons with text for clarity
- Pair menu items with consistent action colors
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
      const menuOpen = ref(false)
      const items = [
        { icon: 'mdi-pencil', title: 'Edit' },
        { icon: 'mdi-content-copy', title: 'Duplicate' },
        { icon: 'mdi-archive', title: 'Archive' },
        { icon: 'mdi-delete', title: 'Delete', color: 'error' },
      ]
      return { args, menuOpen, items }
    },
    template: `
      <div class="pa-6">
        <v-menu
          v-model="menuOpen"
          :location="args.location"
          :transition="args.transition"
          :close-on-content-click="args.closeOnContentClick"
          :open-on-hover="args.openOnHover"
          :offset="args.offset || undefined"
        >
          <template #activator="{ props }">
            <v-btn v-bind="props" icon="mdi-dots-vertical" variant="text" />
          </template>

          <v-list min-width="200px">
            <v-list-item
              v-for="item in items"
              :key="item.title"
              :prepend-icon="item.icon"
              :title="item.title"
              :color="item.color"
            />
          </v-list>
        </v-menu>
      </div>
    `,
  }),
}

export const ContextMenu: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    setup() {
      const menuOpen = ref(false)
      return { menuOpen }
    },
    template: `
      <div class="pa-6">
        <v-menu v-model="menuOpen" location="bottom start">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon="mdi-dots-horizontal" variant="text" />
          </template>

          <v-list min-width="200px">
            <v-list-item prepend-icon="mdi-pencil" title="Edit" />
            <v-list-item prepend-icon="mdi-content-copy" title="Duplicate" />
            <v-divider />
            <v-list-item prepend-icon="mdi-archive" title="Archive" />
            <v-list-item prepend-icon="mdi-delete" title="Delete" color="error" />
          </v-list>
        </v-menu>
      </div>
    `,
  }),
}

export const DropdownActions: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    setup() {
      const menuOpen = ref(false)
      return { menuOpen }
    },
    template: `
      <div class="pa-6">
        <v-menu v-model="menuOpen">
          <template #activator="{ props }">
            <v-btn v-bind="props" text="Actions" append-icon="mdi-chevron-down" />
          </template>

          <v-list min-width="200px">
            <v-list-item prepend-icon="mdi-download" title="Export" />
            <v-list-item prepend-icon="mdi-upload" title="Import" />
            <v-divider />
            <v-list-item prepend-icon="mdi-refresh" title="Refresh" />
            <v-list-item prepend-icon="mdi-printer" title="Print" />
          </v-list>
        </v-menu>
      </div>
    `,
  }),
}
