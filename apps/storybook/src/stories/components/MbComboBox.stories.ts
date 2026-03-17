import { ref, watch } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import MbComboBox from '../../../../../packages/marobase-ui/src/components/MbComboBox.vue';
import type {
  MbComboBoxOption,
  MbComboBoxProps,
  MbComboBoxState
} from '../../../../../packages/marobase-ui/src/components/MbComboBox.types';

const defaultOptions: MbComboBoxOption[] = [
  { id: 'chrome', label: 'Chrome' },
  { id: 'edge', label: 'Edge' },
  { id: 'firefox', label: 'Firefox' },
  { id: 'safari', label: 'Safari' }
];

const stateOptions: MbComboBoxState[] = ['default', 'hover', 'focus', 'disabled', 'error'];

const meta: Meta<MbComboBoxProps> = {
  title: 'Components/MbComboBox',
  component: MbComboBox,
  tags: ['autodocs'],
  args: {
    modelValue: '',
    options: defaultOptions,
    label: 'Browser',
    placeholder: '',
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
    components: { MbComboBox },
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
        <MbComboBox
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
