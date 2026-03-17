import { ref, watch } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import MbSelect from '../../../../../packages/marobase-ui/src/components/MbSelect.vue';
import type {
  MbSelectOption,
  MbSelectProps,
  MbSelectState
} from '../../../../../packages/marobase-ui/src/components/MbSelect.types';

const defaultOptions: MbSelectOption[] = [
  { id: '1', label: 'Option 1' },
  { id: '2', label: 'Option 2' },
  { id: '3', label: 'Option 3' },
  { id: '4', label: 'Option 4' },
  { id: '5', label: 'Option 5' },
  { id: '6', label: 'Option 6' }
];

const stateOptions: MbSelectState[] = ['default', 'hover', 'focus', 'disabled', 'error'];

const meta: Meta<MbSelectProps> = {
  title: 'Components/MbSelect',
  component: MbSelect,
  tags: ['autodocs'],
  args: {
    modelValue: 'Option 1',
    options: defaultOptions,
    label: 'Label',
    placeholder: 'Select options',
    hint: 'Hint text',
    errorMessage: 'Error message',
    required: false,
    open: false,
    state: 'default'
  },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: stateOptions
    }
  },
  render: (args) => ({
    components: { MbSelect },
    setup() {
      const value = ref(args.modelValue ?? '');
      const open = ref(Boolean(args.open));

      watch(
        () => args.modelValue,
        (next) => {
          value.value = next ?? '';
        }
      );

      watch(
        () => args.open,
        (next) => {
          open.value = Boolean(next);
        }
      );

      return { args, value, open };
    },
    template: `
      <div style="display:grid;gap:16px;align-items:start;justify-items:start;padding:24px;">
        <MbSelect
          v-bind="args"
          :model-value="value"
          :open="open"
          @update:modelValue="value = $event"
          @update:open="open = $event"
        />
      </div>
    `
  })
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const OpenMenu: Story = {
  args: {
    open: true,
    state: 'focus'
  }
};

export const Error: Story = {
  args: {
    state: 'error'
  }
};
