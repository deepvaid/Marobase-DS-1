import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { VProgressLinear } from 'vuetify/components'

interface ProgressArgs {
  type: 'linear' | 'circular'
  modelValue: number
  indeterminate: boolean
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  bgColor: string
  size: number
  width: number
  rounded: boolean
  striped: boolean
  showLabel: boolean
  height: number
}

const meta: Meta<ProgressArgs> = {
  title: 'Base/Progress',
  component: VProgressLinear,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['linear', 'circular'],
      description: 'Progress component type',
      table: {
        category: 'Type',
        defaultValue: 'linear',
      },
    },
    modelValue: {
      control: { type: 'range', min: 0, max: 100, step: 5 },
      description: 'Progress percentage (0-100)',
      table: {
        category: 'Value',
        defaultValue: 60,
      },
    },
    indeterminate: {
      control: 'boolean',
      description: 'Shows indeterminate (continuous) progress',
      table: {
        category: 'Behavior',
        defaultValue: false,
      },
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info'],
      description: 'Progress bar color',
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
    size: {
      control: { type: 'range', min: 16, max: 120, step: 4 },
      description: 'Size for circular progress',
      table: {
        category: 'Appearance',
        defaultValue: 48,
      },
    },
    width: {
      control: { type: 'range', min: 1, max: 16, step: 1 },
      description: 'Stroke width for circular progress',
      table: {
        category: 'Appearance',
        defaultValue: 4,
      },
    },
    rounded: {
      control: 'boolean',
      description: 'Rounded ends for linear progress',
      table: {
        category: 'Appearance',
        defaultValue: false,
      },
    },
    striped: {
      control: 'boolean',
      description: 'Striped pattern for linear progress',
      table: {
        category: 'Appearance',
        defaultValue: false,
      },
    },
    showLabel: {
      control: 'boolean',
      description: 'Show percentage label for circular progress',
      table: {
        category: 'Content',
        defaultValue: false,
      },
    },
    height: {
      control: { type: 'range', min: 2, max: 20, step: 1 },
      description: 'Height for linear progress',
      table: {
        category: 'Appearance',
        defaultValue: 4,
      },
    },
  },
  args: {
    type: 'linear',
    modelValue: 60,
    indeterminate: false,
    color: 'primary',
    bgColor: '',
    size: 48,
    width: 4,
    rounded: false,
    striped: false,
    showLabel: false,
    height: 4,
  },
  parameters: {
    docs: {
      description: {
        component: `
# Progress

Progress indicators display the progression of a system operation in a visual way. They show the status of an ongoing process or loading state.

## Overview

Vuetify provides two types of progress indicators: VProgressLinear for horizontal progress bars, and VProgressCircular for circular progress indicators. Both support determinate (0-100%) and indeterminate (continuous) modes.

## Do's

- Use determinate progress for uploads, exports, downloads
- Use indeterminate progress for unknown duration processes
- Show progress in loading states and long operations
- Use appropriate colors for status (green for success, blue for progress)
- Label circular progress with percentage when relevant

## Don'ts

- Don't use progress bars for trivial operations
- Avoid oversized progress indicators
- Don't show multiple progress bars for one process
- Avoid striped patterns for accessibility

## Best Practices

- Use \`rounded\` for linear progress bars
- Combine with status text for clarity
- Use indeterminate for operations where duration is unknown
- Update progress value at reasonable intervals (not every millisecond)
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
      return { args }
    },
    template: `
      <div class="pa-6">
        <div v-if="args.type === 'linear'" class="space-y-6">
          <v-progress-linear
            :model-value="args.modelValue"
            :indeterminate="args.indeterminate"
            :color="args.color"
            :bg-color="args.bgColor"
            :rounded="args.rounded"
            :striped="args.striped"
            :height="args.height"
          />
          <p class="text-body2">{{ args.modelValue }}% Complete</p>
        </div>

        <div v-else class="d-flex justify-center align-center gap-4">
          <v-progress-circular
            :model-value="args.modelValue"
            :indeterminate="args.indeterminate"
            :color="args.color"
            :size="args.size"
            :width="args.width"
          >
            <span v-if="args.showLabel && !args.indeterminate">{{ args.modelValue }}%</span>
          </v-progress-circular>
        </div>
      </div>
    `,
  }),
}

export const Linear: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="pa-6 space-y-4">
        <div>
          <p class="text-body2 mb-2">0% Complete</p>
          <v-progress-linear :model-value="0" color="primary" />
        </div>
        <div>
          <p class="text-body2 mb-2">50% Complete</p>
          <v-progress-linear :model-value="50" color="primary" />
        </div>
        <div>
          <p class="text-body2 mb-2">100% Complete</p>
          <v-progress-linear :model-value="100" color="success" />
        </div>
      </div>
    `,
  }),
}

export const LinearIndeterminate: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="pa-6 space-y-4">
        <div>
          <p class="text-body2 mb-2">Loading...</p>
          <v-progress-linear indeterminate color="primary" />
        </div>
        <div>
          <p class="text-body2 mb-2">Processing...</p>
          <v-progress-linear indeterminate color="warning" striped />
        </div>
      </div>
    `,
  }),
}

export const Circular: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="pa-6 d-flex justify-center gap-8">
        <div class="text-center">
          <v-progress-circular :model-value="25" color="primary" size="80" width="4" />
          <p class="text-body2 mt-2">25%</p>
        </div>
        <div class="text-center">
          <v-progress-circular :model-value="60" color="warning" size="80" width="4" />
          <p class="text-body2 mt-2">60%</p>
        </div>
        <div class="text-center">
          <v-progress-circular :model-value="100" color="success" size="80" width="4" />
          <p class="text-body2 mt-2">100%</p>
        </div>
      </div>
    `,
  }),
}

export const BufferedLinear: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="pa-6 space-y-4">
        <div>
          <p class="text-body2 mb-2">Download: 60% Complete (buffered to 90%)</p>
          <v-progress-linear :model-value="60" :buffer-value="90" color="primary" rounded />
        </div>
        <div>
          <p class="text-body2 mb-2">Upload: 40% Complete (buffered to 70%)</p>
          <v-progress-linear :model-value="40" :buffer-value="70" color="warning" rounded />
        </div>
      </div>
    `,
  }),
}
