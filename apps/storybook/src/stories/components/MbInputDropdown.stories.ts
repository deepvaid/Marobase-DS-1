import { ref, watch } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import MbInputDropdown from '../../../../../packages/marobase-ui/src/components/MbInputDropdown.vue';
import type {
  MbInputDropdownOption,
  MbInputDropdownProps,
  MbInputDropdownState
} from '../../../../../packages/marobase-ui/src/components/MbInputDropdown.types';

const defaultOptions: MbInputDropdownOption[] = [
  { id: 'en', label: 'English', meta: '+1', icon: '🇺🇸' },
  { id: 'bg', label: 'Български' },
  { id: 'cz', label: 'Čeština', meta: '+355', icon: '🇦🇱' },
  { id: 'dk', label: 'Dansk', meta: '+213', icon: '🇩🇿' },
  { id: 'de', label: 'Deutsch', meta: '+1684', icon: '🇦🇸' },
  { id: 'fr', label: 'Français', meta: '+376', icon: '🇦🇩' }
];

const stateOptions: MbInputDropdownState[] = ['default', 'hover', 'focus', 'disabled', 'error'];

const meta: Meta<MbInputDropdownProps> = {
  title: 'Components/MbInputDropdown',
  component: MbInputDropdown,
  tags: ['autodocs'],
  args: {
    modelValue: 'English',
    searchValue: '',
    options: defaultOptions,
    label: 'Language',
    placeholder: 'Select option',
    leftAddon: 'Text',
    hint: 'Hint text',
    errorMessage: 'Error message',
    required: false,
    open: true,
    showSearch: true,
    state: 'default',
    disabled: false
  },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: stateOptions
    }
  },
  render: (args) => ({
    components: { MbInputDropdown },
    setup() {
      const value = ref(args.modelValue ?? '');
      const searchValue = ref(args.searchValue ?? '');
      const open = ref(Boolean(args.open));

      watch(
        () => args.modelValue,
        (next) => {
          value.value = next ?? '';
        }
      );

      watch(
        () => args.searchValue,
        (next) => {
          searchValue.value = next ?? '';
        }
      );

      watch(
        () => args.open,
        (next) => {
          open.value = Boolean(next);
        }
      );

      return { args, value, searchValue, open };
    },
    template: `
      <div style="display:grid;gap:16px;align-items:start;justify-items:start;padding:24px;">
        <MbInputDropdown
          v-bind="args"
          :model-value="value"
          :search-value="searchValue"
          :open="open"
          @update:modelValue="value = $event"
          @update:searchValue="searchValue = $event"
          @update:open="open = $event"
        />
      </div>
    `
  })
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Closed: Story = {
  args: {
    open: false,
    state: 'default'
  }
};

export const Error: Story = {
  args: {
    state: 'error',
    errorMessage: 'Please choose one option'
  }
};
