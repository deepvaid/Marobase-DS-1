import { ref, watch } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import MbQuantityInput from '../../../../../packages/marobase-ui/src/components/MbQuantityInput.vue';
import type {
  MbQuantityInputProps,
  MbQuantityInputState
} from '../../../../../packages/marobase-ui/src/components/MbQuantityInput.types';

const stateOptions: MbQuantityInputState[] = ['default', 'focus', 'disabled', 'error'];

const meta: Meta<MbQuantityInputProps> = {
  title: 'Components/MbQuantityInput',
  component: MbQuantityInput,
  tags: ['autodocs'],
  args: {
    modelValue: 99,
    state: 'focus',
    label: 'Label',
    hint: 'Hint text',
    errorMessage: 'Error message',
    min: 0,
    max: 999,
    step: 1
  },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: stateOptions
    },
    modelValue: {
      control: { type: 'number', min: 0, max: 999, step: 1 }
    }
  },
  render: (args) => ({
    components: { MbQuantityInput },
    setup() {
      const value = ref(args.modelValue ?? 99);

      watch(
        () => args.modelValue,
        (next) => {
          if (typeof next === 'number' && Number.isFinite(next)) {
            value.value = next;
          }
        }
      );

      return { args, value };
    },
    template: `
      <div style="display:grid;gap:16px;align-items:start;justify-items:start;padding:24px;">
        <MbQuantityInput v-bind="args" :model-value="value" @update:modelValue="value = $event" />
      </div>
    `
  })
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const FigmaFocused: Story = {
  args: {
    state: 'focus',
    modelValue: 99
  }
};

export const Default: Story = {
  args: {
    state: 'default'
  }
};
