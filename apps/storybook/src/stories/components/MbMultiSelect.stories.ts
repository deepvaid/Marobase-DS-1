import { ref, watch } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import MbMultiSelect from '../../../../../packages/marobase-ui/src/components/MbMultiSelect.vue';
import type {
  MbMultiSelectOption,
  MbMultiSelectProps,
  MbMultiSelectState
} from '../../../../../packages/marobase-ui/src/components/MbMultiSelect.types';

const defaultOptions: MbMultiSelectOption[] = [
  { id: '1', label: 'Option 1' },
  { id: '2', label: 'Option 2' },
  { id: '3', label: 'Option 3' },
  { id: '4', label: 'Option 4' },
  { id: '5', label: 'Option 5' },
  { id: '6', label: 'Option 6' }
];

const stateOptions: MbMultiSelectState[] = ['default', 'hover', 'focus', 'disabled', 'error'];

const meta: Meta<MbMultiSelectProps> = {
  title: 'Components/MbMultiSelect',
  component: MbMultiSelect,
  tags: ['autodocs'],
  args: {
    modelValue: [],
    options: defaultOptions,
    label: 'Categories',
    placeholder: 'Select options',
    hint: 'Hint text',
    errorMessage: 'Error message',
    required: false,
    open: false,
    state: 'default',
    floatingLabel: false
  },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: stateOptions
    }
  },
  render: (args) => ({
    components: { MbMultiSelect },
    setup() {
      const value = ref<string[]>(args.modelValue ?? []);
      const open = ref(Boolean(args.open));

      watch(
        () => args.modelValue,
        (next) => {
          value.value = next ?? [];
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
        <MbMultiSelect
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

export const FloatingLabel: Story = {
  args: {
    floatingLabel: true,
    required: true,
    open: true,
    state: 'focus'
  }
};

export const WithSelection: Story = {
  args: {
    modelValue: ['Option 1', 'Option 3']
  }
};
