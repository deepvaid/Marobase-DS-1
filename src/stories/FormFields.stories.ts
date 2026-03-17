import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { VTextField } from 'vuetify/components'

interface FormFieldsArgs {
  label: string
  placeholder: string
  variant: 'outlined' | 'filled' | 'solo' | 'underlined' | 'plain'
  density: 'default' | 'comfortable' | 'compact'
  rounded: '0' | 'sm' | 'lg' | 'xl' | 'pill'
  prependInnerIcon: string
  appendInnerIcon: string
  clearable: boolean
  disabled: boolean
  readonly: boolean
  errorMessages: string
  hint: string
  persistentHint: boolean
  hideDetails: boolean
}

const meta: Meta<FormFieldsArgs> = {
  title: 'Base/FormFields',
  component: VTextField,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Field label',
      table: {
        category: 'Content',
        defaultValue: 'Label',
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
      table: {
        category: 'Content',
        defaultValue: '',
      },
    },
    variant: {
      control: 'select',
      options: ['outlined', 'filled', 'solo', 'underlined', 'plain'],
      description: 'Field variant style',
      table: {
        category: 'Appearance',
        defaultValue: 'outlined',
      },
    },
    density: {
      control: 'select',
      options: ['default', 'comfortable', 'compact'],
      description: 'Vertical spacing density',
      table: {
        category: 'Appearance',
        defaultValue: 'comfortable',
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
    prependInnerIcon: {
      control: 'text',
      description: 'Icon at the start of input',
      table: {
        category: 'Icons',
        defaultValue: '',
      },
    },
    appendInnerIcon: {
      control: 'text',
      description: 'Icon at the end of input',
      table: {
        category: 'Icons',
        defaultValue: '',
      },
    },
    clearable: {
      control: 'boolean',
      description: 'Shows a clear button',
      table: {
        category: 'Behavior',
        defaultValue: false,
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the field',
      table: {
        category: 'State',
        defaultValue: false,
      },
    },
    readonly: {
      control: 'boolean',
      description: 'Makes field read-only',
      table: {
        category: 'State',
        defaultValue: false,
      },
    },
    errorMessages: {
      control: 'text',
      description: 'Error message to display',
      table: {
        category: 'Validation',
        defaultValue: '',
      },
    },
    hint: {
      control: 'text',
      description: 'Helper text below field',
      table: {
        category: 'Content',
        defaultValue: '',
      },
    },
    persistentHint: {
      control: 'boolean',
      description: 'Always show hint text',
      table: {
        category: 'Behavior',
        defaultValue: false,
      },
    },
    hideDetails: {
      control: 'boolean',
      description: 'Hide hint and error messages',
      table: {
        category: 'Behavior',
        defaultValue: false,
      },
    },
  },
  args: {
    label: 'Label',
    placeholder: '',
    variant: 'outlined',
    density: 'comfortable',
    rounded: 'lg',
    prependInnerIcon: '',
    appendInnerIcon: '',
    clearable: false,
    disabled: false,
    readonly: false,
    errorMessages: '',
    hint: '',
    persistentHint: false,
    hideDetails: false,
  },
  parameters: {
    docs: {
      description: {
        component: `
# Form Fields

Text input fields allow users to enter, edit, or search text. Vuetify provides flexible, customizable form fields with multiple variants and densities.

## Overview

VTextField is the primary text input component. It supports various styles (outlined, filled, solo, underlined, plain), sizes (density), and validation states.

## Do's

- Use descriptive labels and placeholders
- Provide helpful hint text for complex fields
- Show error messages immediately when validation fails
- Use appropriate icons (search, email, lock, etc.)
- Enable clearable for fields with long content

## Don'ts

- Don't use placeholders as labels
- Avoid overly long or cryptic error messages
- Don't use readonly for disabled fields
- Avoid multiple fields without proper spacing

## Best Practices

- Set density based on content density (use 'compact' in dense tables)
- Use variant 'outlined' as default for standard forms
- Combine with VForm for comprehensive validation
- Always pair with MpDataTableToolbar for search fields
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
      const value = ref('')
      return { args, value }
    },
    template: `
      <div class="pa-6">
        <v-text-field
          v-model="value"
          :label="args.label"
          :placeholder="args.placeholder"
          :variant="args.variant"
          :density="args.density"
          :rounded="args.rounded"
          :prepend-inner-icon="args.prependInnerIcon"
          :append-inner-icon="args.appendInnerIcon"
          :clearable="args.clearable"
          :disabled="args.disabled"
          :readonly="args.readonly"
          :error-messages="args.errorMessages"
          :hint="args.hint"
          :persistent-hint="args.persistentHint"
          :hide-details="args.hideDetails"
        />
      </div>
    `,
  }),
}

export const Showcase: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="pa-6">
        <h3 class="text-h6 mb-4">Variants</h3>
        <v-row class="mb-6">
          <v-col cols="12" sm="6">
            <v-text-field label="Outlined" variant="outlined" placeholder="Enter text" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field label="Filled" variant="filled" placeholder="Enter text" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field label="Solo" variant="solo" placeholder="Enter text" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field label="Underlined" variant="underlined" placeholder="Enter text" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field label="Plain" variant="plain" placeholder="Enter text" />
          </v-col>
        </v-row>

        <h3 class="text-h6 mb-4">Density</h3>
        <v-row class="mb-6">
          <v-col cols="12">
            <v-text-field label="Default" density="default" variant="outlined" />
          </v-col>
          <v-col cols="12">
            <v-text-field label="Comfortable" density="comfortable" variant="outlined" />
          </v-col>
          <v-col cols="12">
            <v-text-field label="Compact" density="compact" variant="outlined" />
          </v-col>
        </v-row>

        <h3 class="text-h6 mb-4">With Icons & Helpers</h3>
        <v-row class="mb-6">
          <v-col cols="12" sm="6">
            <v-text-field label="Search" variant="outlined" prepend-inner-icon="mdi-magnify" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field label="Email" variant="outlined" prepend-inner-icon="mdi-email" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field label="Password" type="password" variant="outlined" prepend-inner-icon="mdi-lock" append-inner-icon="mdi-eye-off" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field label="With hint" variant="outlined" hint="This is a helpful hint" />
          </v-col>
        </v-row>

        <h3 class="text-h6 mb-4">States</h3>
        <v-row class="mb-6">
          <v-col cols="12" sm="6">
            <v-text-field label="Normal" variant="outlined" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field label="Disabled" variant="outlined" disabled />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field label="Read-only" variant="outlined" readonly value="Read-only text" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field label="Error" variant="outlined" error-messages="This field is required" />
          </v-col>
        </v-row>

        <h3 class="text-h6 mb-4">Select & Textarea</h3>
        <v-row>
          <v-col cols="12" sm="6">
            <v-select label="Single Select" :items="['Option 1', 'Option 2', 'Option 3']" variant="outlined" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-select label="Multiple Select" :items="['Option 1', 'Option 2', 'Option 3']" variant="outlined" multiple />
          </v-col>
          <v-col cols="12">
            <v-textarea label="Textarea" variant="outlined" rows="4" />
          </v-col>
        </v-row>
      </div>
    `,
  }),
}

export const TextVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="pa-6">
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field label="Outlined" variant="outlined" placeholder="Outlined style" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field label="Filled" variant="filled" placeholder="Filled style" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field label="Solo" variant="solo" placeholder="Solo style" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field label="Underlined" variant="underlined" placeholder="Underlined style" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field label="Plain" variant="plain" placeholder="Plain style" />
          </v-col>
        </v-row>
      </div>
    `,
  }),
}

export const Density: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="pa-6">
        <v-text-field label="Default" density="default" variant="outlined" class="mb-4" />
        <v-text-field label="Comfortable" density="comfortable" variant="outlined" class="mb-4" />
        <v-text-field label="Compact" density="compact" variant="outlined" />
      </div>
    `,
  }),
}

export const WithIcons: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="pa-6">
        <v-text-field label="Search" prepend-inner-icon="mdi-magnify" variant="outlined" placeholder="Search..." class="mb-4" />
        <v-text-field label="Email" prepend-inner-icon="mdi-email" variant="outlined" placeholder="your@email.com" class="mb-4" />
        <v-text-field label="Password" type="password" prepend-inner-icon="mdi-lock" append-inner-icon="mdi-eye-off" variant="outlined" class="mb-4" />
        <v-text-field label="Website" prepend-inner-icon="mdi-globe" append-inner-icon="mdi-open-in-new" variant="outlined" />
      </div>
    `,
  }),
}

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="pa-6">
        <v-text-field label="Normal" variant="outlined" placeholder="Normal state" class="mb-4" />
        <v-text-field label="Disabled" variant="outlined" disabled placeholder="Disabled state" class="mb-4" />
        <v-text-field label="Read-only" variant="outlined" readonly value="Read-only text" class="mb-4" />
        <v-text-field label="Error" variant="outlined" error-messages="This field is required" class="mb-4" />
      </div>
    `,
  }),
}

export const SelectAndAutocomplete: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="pa-6">
        <h3 class="text-subtitle2 mb-2">Single Select</h3>
        <v-select label="Choose one" :items="['Apple', 'Banana', 'Cherry', 'Date']" variant="outlined" class="mb-6" />

        <h3 class="text-subtitle2 mb-2">Multiple Select</h3>
        <v-select label="Choose multiple" :items="['Red', 'Green', 'Blue', 'Yellow']" variant="outlined" multiple class="mb-6" />

        <h3 class="text-subtitle2 mb-2">Autocomplete</h3>
        <v-autocomplete label="Search countries" :items="['USA', 'UK', 'Canada', 'Australia']" variant="outlined" class="mb-6" />

        <h3 class="text-subtitle2 mb-2">Textarea</h3>
        <v-textarea label="Enter description" variant="outlined" rows="4" />
      </div>
    `,
  }),
}
