import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { VSnackbar } from 'vuetify/components'

interface SnackbarsArgs {
  text: string
  color: 'success' | 'error' | 'info' | 'warning' | 'default'
  timeout: number
  location: 'bottom' | 'top' | 'top start' | 'top end' | 'bottom start' | 'bottom end'
  rounded: '0' | 'sm' | 'lg' | 'xl' | 'pill'
  vertical: boolean
  multiLine: boolean
  closable: boolean
}

const meta: Meta<SnackbarsArgs> = {
  title: 'Base/Snackbars',
  component: VSnackbar,
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'Snackbar message text',
      table: {
        category: 'Content',
        defaultValue: 'Changes saved successfully',
      },
    },
    color: {
      control: 'select',
      options: ['success', 'error', 'info', 'warning', 'default'],
      description: 'Snackbar color',
      table: {
        category: 'Appearance',
        defaultValue: 'success',
      },
    },
    timeout: {
      control: { type: 'range', min: -1, max: 10000, step: 500 },
      description: 'Auto-dismiss timeout in ms. Use -1 for persistent.',
      table: {
        category: 'Behavior',
        defaultValue: 3000,
      },
    },
    location: {
      control: 'select',
      options: ['bottom', 'top', 'top start', 'top end', 'bottom start', 'bottom end'],
      description: 'Position on screen',
      table: {
        category: 'Appearance',
        defaultValue: 'bottom',
      },
    },
    rounded: {
      control: 'select',
      options: ['0', 'sm', 'lg', 'xl', 'pill'],
      description: 'Border radius',
      table: {
        category: 'Appearance',
        defaultValue: 'lg',
      },
    },
    vertical: {
      control: 'boolean',
      description: 'Display content vertically',
      table: {
        category: 'Layout',
        defaultValue: false,
      },
    },
    multiLine: {
      control: 'boolean',
      description: 'Allow multi-line content',
      table: {
        category: 'Layout',
        defaultValue: false,
      },
    },
    closable: {
      control: 'boolean',
      description: 'Show close button',
      table: {
        category: 'Behavior',
        defaultValue: false,
      },
    },
  },
  args: {
    text: 'Changes saved successfully',
    color: 'success',
    timeout: 3000,
    location: 'bottom',
    rounded: 'lg',
    vertical: false,
    multiLine: false,
    closable: false,
  },
  parameters: {
    docs: {
      description: {
        component: `
# Snackbars

Snackbars provide brief feedback about an operation through a message at the bottom or top of the screen.

## Overview

VSnackbar displays temporary, non-intrusive notifications. They're ideal for confirmations (save successful), errors, or informational messages that don't require immediate user action.

## Do's

- Use for brief confirmations and status updates
- Auto-dismiss after 3-6 seconds for non-critical messages
- Position at bottom or top, not center
- Keep message text concise
- Use appropriate colors (success, error, info, warning)

## Don'ts

- Don't overuse snackbars for all messages
- Avoid long, detailed text in snackbars
- Don't stack multiple snackbars
- Avoid blocking important content
- Don't use timeout=-1 for trivial messages

## Best Practices

- Use \`timeout="3000"\` for confirmations
- Use \`timeout="-1"\` (persistent) for errors requiring action
- Combine with action buttons for important messages
- Position at \`bottom\` for least intrusion
- Use rounded="lg" for modern appearance
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
      const show = ref(false)
      return { args, show }
    },
    template: `
      <div class="pa-6">
        <v-btn @click="show = true" color="primary">
          Show Snackbar
        </v-btn>

        <v-snackbar
          v-model="show"
          :text="args.text"
          :color="args.color"
          :timeout="args.timeout"
          :location="args.location"
          :rounded="args.rounded"
          :vertical="args.vertical"
          :multi-line="args.multiLine"
          :closable="args.closable"
        />
      </div>
    `,
  }),
}

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    setup() {
      const successShow = ref(true)
      const errorShow = ref(true)
      const infoShow = ref(true)
      const warningShow = ref(true)
      return { successShow, errorShow, infoShow, warningShow }
    },
    template: `
      <div class="pa-6">
        <v-snackbar v-model="successShow" color="success" text="Success: Operation completed" timeout="3000" location="top start" />
        <v-snackbar v-model="errorShow" color="error" text="Error: Something went wrong" timeout="-1" location="top" />
        <v-snackbar v-model="infoShow" color="info" text="Info: New updates available" timeout="3000" location="top end" />
        <v-snackbar v-model="warningShow" color="warning" text="Warning: Action required" timeout="3000" location="bottom" />

        <p class="text-body2">Multiple snackbar examples displayed</p>
      </div>
    `,
  }),
}

export const WithAction: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    setup() {
      const show = ref(true)
      return { show }
    },
    template: `
      <div class="pa-6">
        <v-snackbar v-model="show" color="error" text="Failed to save changes" timeout="-1" location="bottom">
          <template #actions>
            <v-btn text small @click="show = false">Retry</v-btn>
            <v-btn text small @click="show = false">Dismiss</v-btn>
          </template>
        </v-snackbar>

        <p class="text-body2">Error snackbar with action buttons</p>
      </div>
    `,
  }),
}
