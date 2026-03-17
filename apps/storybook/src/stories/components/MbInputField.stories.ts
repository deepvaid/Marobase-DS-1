import { ref, watch } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import MbInputField from '../../../../../packages/marobase-ui/src/components/MbInputField.vue';
import type {
  MbInputFieldProps,
  MbInputFieldState
} from '../../../../../packages/marobase-ui/src/components/MbInputField.types';

const stateOptions: MbInputFieldState[] = ['default', 'hover', 'focus', 'disabled', 'error'];

const meta: Meta<MbInputFieldProps> = {
  title: 'Components/MbInputField',
  component: MbInputField,
  tags: ['autodocs'],
  args: {
    modelValue: '',
    state: 'default',
    label: 'Label',
    required: false,
    hint: 'Hint text',
    errorMessage: 'Error message',
    placeholder: 'Placeholder',
    leftAddon: 'Text',
    trailingIcon: 'rhombus',
    width: 320
  },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: stateOptions
    },
    trailingIcon: {
      control: 'inline-radio',
      options: ['rhombus', 'none']
    },
    width: {
      control: { type: 'number', min: 260, max: 420, step: 10 }
    }
  },
  render: (args) => ({
    components: { MbInputField },
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
        <MbInputField v-bind="args" :model-value="value" @update:modelValue="value = $event" />
      </div>
    `
  })
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const FigmaDefault: Story = {
  args: {
    state: 'default',
    label: 'Label',
    leftAddon: 'Text',
    placeholder: 'Placeholder',
    hint: 'Hint text',
    width: 320
  }
};

export const Focus: Story = {
  args: {
    state: 'focus'
  }
};
