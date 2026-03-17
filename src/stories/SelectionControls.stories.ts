import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { VCheckbox } from 'vuetify/components'

interface SelectionControlsArgs {
  label: string
  modelValue: boolean
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  disabled: boolean
  indeterminate: boolean
  hideDetails: boolean
  trueIcon: string
  falseIcon: string
}

const meta: Meta<SelectionControlsArgs> = {
  title: 'Base/SelectionControls',
  component: VCheckbox,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Checkbox label text',
      table: {
        category: 'Content',
        defaultValue: 'Toggle option',
      },
    },
    modelValue: {
      control: 'boolean',
      description: 'Controlled checked state',
      table: {
        category: 'State',
        defaultValue: false,
      },
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error'],
      description: 'Checkbox color',
      table: {
        category: 'Appearance',
        defaultValue: 'primary',
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the checkbox',
      table: {
        category: 'State',
        defaultValue: false,
      },
    },
    indeterminate: {
      control: 'boolean',
      description: 'Shows indeterminate state',
      table: {
        category: 'State',
        defaultValue: false,
      },
    },
    hideDetails: {
      control: 'boolean',
      description: 'Hide validation details',
      table: {
        category: 'Behavior',
        defaultValue: true,
      },
    },
    trueIcon: {
      control: 'text',
      description: 'Icon when checked (e.g., mdi-heart)',
      table: {
        category: 'Icons',
        defaultValue: '',
      },
    },
    falseIcon: {
      control: 'text',
      description: 'Icon when unchecked',
      table: {
        category: 'Icons',
        defaultValue: '',
      },
    },
  },
  args: {
    label: 'Toggle option',
    modelValue: false,
    color: 'primary',
    disabled: false,
    indeterminate: false,
    hideDetails: true,
    trueIcon: '',
    falseIcon: '',
  },
  parameters: {
    docs: {
      description: {
        component: `
# Selection Controls

Selection controls allow users to select one or more options from a set. They include checkboxes, radio buttons, and switches.

## Overview

Vuetify provides VCheckbox, VRadio, and VSwitch components for user selections. Checkboxes allow multiple selections, radio buttons allow single selection, and switches toggle between two states.

## Do's

- Use checkboxes for multiple selections
- Use radio buttons for mutually exclusive choices
- Use switches for on/off states
- Label all selection controls clearly
- Group related controls visually

## Don'ts

- Don't mix selection types in the same group
- Avoid unlabeled selection controls
- Don't use switches for multiple selections
- Avoid too many options in one group

## Best Practices

- Use \`indeterminate\` state for "select all" checkboxes
- Color checkboxes to match action meaning (error for delete)
- Keep option labels concise
- Use VCheckboxGroup or VRadioGroup for grouping
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
      const checked = ref(args.modelValue)
      return { args, checked }
    },
    template: `
      <div class="pa-6">
        <v-checkbox
          v-model="checked"
          :label="args.label"
          :color="args.color"
          :disabled="args.disabled"
          :indeterminate="args.indeterminate"
          :hide-details="args.hideDetails"
          :true-icon="args.trueIcon"
          :false-icon="args.falseIcon"
        />
      </div>
    `,
  }),
}

export const Checkboxes: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    setup() {
      const items = ref(['Apple', 'Banana'])
      return { items }
    },
    template: `
      <div class="pa-6">
        <v-checkbox-group v-model="items" label="Fruits">
          <v-checkbox label="Apple" value="Apple" />
          <v-checkbox label="Banana" value="Banana" />
          <v-checkbox label="Cherry" value="Cherry" />
          <v-checkbox label="Date" value="Date" />
        </v-checkbox-group>
      </div>
    `,
  }),
}

export const RadioButtons: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    setup() {
      const selected = ref('Option 1')
      return { selected }
    },
    template: `
      <div class="pa-6">
        <v-radio-group v-model="selected" label="Choose one">
          <v-radio label="Option 1" value="Option 1" />
          <v-radio label="Option 2" value="Option 2" />
          <v-radio label="Option 3" value="Option 3" />
        </v-radio-group>
      </div>
    `,
  }),
}

export const Switches: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    setup() {
      const notifications = ref(true)
      const darkMode = ref(false)
      return { notifications, darkMode }
    },
    template: `
      <div class="pa-6 space-y-4">
        <v-switch v-model="notifications" label="Enable notifications" />
        <v-switch v-model="darkMode" label="Dark mode" color="primary" />
      </div>
    `,
  }),
}
