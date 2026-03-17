import { ref, watch } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import MbFloatingInputField from '../../../../../packages/marobase-ui/src/components/MbFloatingInputField.vue';
import type {
  MbFloatingInputFieldProps,
  MbFloatingInputFieldState
} from '../../../../../packages/marobase-ui/src/components/MbFloatingInputField.types';

const stateOptions: MbFloatingInputFieldState[] = [
  'default',
  'hover',
  'focus',
  'filled',
  'disabled',
  'error'
];

const meta: Meta<MbFloatingInputFieldProps> = {
  title: 'Components/MbFloatingInputField',
  component: MbFloatingInputField,
  tags: ['autodocs'],
  args: {
    size: 'lg',
    state: 'default',
    label: 'Label',
    required: true,
    hint: 'Hint text',
    errorMessage: 'Error message',
    placeholder: 'Placeholder',
    trailingIcon: 'rhombus'
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['lg', 'md', 'sm']
    },
    state: {
      control: 'inline-radio',
      options: stateOptions
    },
    trailingIcon: {
      control: 'inline-radio',
      options: ['rhombus', 'none']
    }
  },
  render: (args) => ({
    components: { MbFloatingInputField },
    setup() {
      const value = ref(args.modelValue ?? '');

      watch(
        () => args.modelValue,
        (next) => {
          value.value = next ?? '';
        }
      );

      return { args, value };
    },
    template: `
      <div style="display:grid;gap:16px;align-items:start;justify-items:start;padding:24px;">
        <MbFloatingInputField v-bind="args" :model-value="value" @update:modelValue="value = $event" />
      </div>
    `
  })
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => ({
    components: { MbFloatingInputField },
    template: `
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;padding:24px;">
        <MbFloatingInputField label="Default" state="default" />
        <MbFloatingInputField label="Hover" state="hover" />
        <MbFloatingInputField label="Focus" state="focus" />
        <MbFloatingInputField label="Filled" state="filled" />
        <MbFloatingInputField label="Disabled" state="disabled" />
        <MbFloatingInputField label="Error" state="error" />
      </div>
    `
  })
};
