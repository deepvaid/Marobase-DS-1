import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { VDialog } from 'vuetify/components'

interface DialogsArgs {
  title: string
  message: string
  confirmLabel: string
  confirmColor: 'primary' | 'error' | 'success' | 'warning'
  maxWidth: string
  persistent: boolean
  scrollable: boolean
  fullscreen: boolean
}

const meta: Meta<DialogsArgs> = {
  title: 'Base/Dialogs',
  component: VDialog,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Dialog title',
      table: {
        category: 'Content',
        defaultValue: 'Confirm Action',
      },
    },
    message: {
      control: 'text',
      description: 'Dialog message content',
      table: {
        category: 'Content',
        defaultValue: 'Are you sure you want to proceed? This cannot be undone.',
      },
    },
    confirmLabel: {
      control: 'text',
      description: 'Label for confirm button',
      table: {
        category: 'Content',
        defaultValue: 'Confirm',
      },
    },
    confirmColor: {
      control: 'select',
      options: ['primary', 'error', 'success', 'warning'],
      description: 'Color of confirm button',
      table: {
        category: 'Appearance',
        defaultValue: 'primary',
      },
    },
    maxWidth: {
      control: 'text',
      description: 'Maximum width of dialog',
      table: {
        category: 'Appearance',
        defaultValue: '500px',
      },
    },
    persistent: {
      control: 'boolean',
      description: 'Dialog cannot be closed by clicking outside',
      table: {
        category: 'Behavior',
        defaultValue: false,
      },
    },
    scrollable: {
      control: 'boolean',
      description: 'Enable scrollable content',
      table: {
        category: 'Behavior',
        defaultValue: false,
      },
    },
    fullscreen: {
      control: 'boolean',
      description: 'Make dialog fullscreen',
      table: {
        category: 'Appearance',
        defaultValue: false,
      },
    },
  },
  args: {
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed? This cannot be undone.',
    confirmLabel: 'Confirm',
    confirmColor: 'primary',
    maxWidth: '500px',
    persistent: false,
    scrollable: false,
    fullscreen: false,
  },
  parameters: {
    docs: {
      description: {
        component: `
# Dialog

Dialogs inform users about a specific task and may contain critical information, require decisions, or involve multiple tasks.

## Overview

Vuetify's VDialog component provides a modal dialog that overlays content. Dialogs are perfect for confirmations, alerts, and forms that require user attention before proceeding.

## Do's

- Use dialogs for important confirmations or decisions
- Provide clear, actionable button labels
- Set \`persistent\` to true for critical actions requiring explicit confirmation
- Use appropriate colors (error for destructive, primary for neutral)
- Keep dialog content concise

## Don'ts

- Don't overuse dialogs for trivial confirmations
- Avoid deeply nested dialogs
- Don't put complex forms in dialogs (use drawers instead)
- Avoid blocking UI indefinitely

## Best Practices

- Always include a cancel/close button
- Use \`maxWidth\` to control dialog size (typically 400-600px)
- Make the confirm button's color match the action's consequence
- Use \`scrollable\` for longer content
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
      const dialogOpen = ref(false)
      return { args, dialogOpen }
    },
    template: `
      <div class="pa-6">
        <v-btn @click="dialogOpen = true" color="primary">
          Open Dialog
        </v-btn>

        <v-dialog
          v-model="dialogOpen"
          :max-width="args.maxWidth"
          :persistent="args.persistent"
          :scrollable="args.scrollable"
          :fullscreen="args.fullscreen"
        >
          <v-card>
            <v-card-title>{{ args.title }}</v-card-title>
            <v-card-text>{{ args.message }}</v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn text @click="dialogOpen = false">Cancel</v-btn>
              <v-btn :color="args.confirmColor" @click="dialogOpen = false">
                {{ args.confirmLabel }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    `,
  }),
}

export const Confirmation: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    setup() {
      const open = ref(false)
      return { open }
    },
    template: `
      <div class="pa-6">
        <v-btn @click="open = true" color="primary">
          Confirm Action
        </v-btn>

        <v-dialog v-model="open" max-width="500px">
          <v-card>
            <v-card-title>Confirm Action</v-card-title>
            <v-card-text>
              Are you sure you want to proceed? This action cannot be undone.
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn text @click="open = false">Cancel</v-btn>
              <v-btn color="primary" @click="open = false">Confirm</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    `,
  }),
}

export const Destructive: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    setup() {
      const open = ref(false)
      return { open }
    },
    template: `
      <div class="pa-6">
        <v-btn @click="open = true" color="error">
          Delete Item
        </v-btn>

        <v-dialog v-model="open" max-width="500px" persistent>
          <v-card>
            <v-card-title>Delete Item?</v-card-title>
            <v-card-text>
              This will permanently delete the item and cannot be reversed. Are you absolutely sure?
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn text @click="open = false">Keep It</v-btn>
              <v-btn color="error" @click="open = false">Delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    `,
  }),
}

export const Informational: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    setup() {
      const open = ref(false)
      return { open }
    },
    template: `
      <div class="pa-6">
        <v-btn @click="open = true" color="info">
          Show Info
        </v-btn>

        <v-dialog v-model="open" max-width="500px">
          <v-card>
            <v-card-title>Information</v-card-title>
            <v-card-text>
              This is an informational dialog. It displays important information to the user.
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" @click="open = false">Got it</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    `,
  }),
}
