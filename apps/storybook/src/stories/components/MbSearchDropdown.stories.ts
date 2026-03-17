import { ref, watch } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import MbSearchDropdown from '../../../../../packages/marobase-ui/src/components/MbSearchDropdown.vue';
import type {
  MbSearchDropdownOption,
  MbSearchDropdownProps,
  MbSearchDropdownState
} from '../../../../../packages/marobase-ui/src/components/MbSearchDropdown.types';

const defaultOptions: MbSearchDropdownOption[] = [
  { id: 'apple-store', prefix: 'Apple', label: 'store' },
  { id: 'apple-watch', prefix: 'Apple', label: 'watch' },
  { id: 'apple-music', prefix: 'Apple', label: 'music' },
  { id: 'apple-id', prefix: 'Apple', label: 'id' },
  { id: 'apple-iphone', prefix: 'Apple', label: 'iphone 14' }
];

const stateOptions: MbSearchDropdownState[] = ['default', 'hover', 'focus', 'disabled', 'error'];

const meta: Meta<MbSearchDropdownProps> = {
  title: 'Components/MbSearchDropdown',
  component: MbSearchDropdown,
  tags: ['autodocs'],
  args: {
    modelValue: '',
    options: defaultOptions,
    placeholder: 'Search',
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
    components: { MbSearchDropdown },
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
        <MbSearchDropdown
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

export const OpenWithValue: Story = {
  args: {
    modelValue: 'Apple',
    open: true,
    state: 'focus'
  }
};

export const Disabled: Story = {
  args: {
    state: 'disabled'
  }
};
