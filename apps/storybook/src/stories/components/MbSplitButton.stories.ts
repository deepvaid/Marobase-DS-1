import { ref, watch } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import MbSplitButton from '../../../../../packages/marobase-ui/src/components/MbSplitButton.vue';
import type {
  MbSplitButtonOption,
  MbSplitButtonProps
} from '../../../../../packages/marobase-ui/src/components/MbSplitButton.types';

const defaultOptions: MbSplitButtonOption[] = [
  { id: 'option-1', label: 'Menu Option' },
  { id: 'option-2', label: 'Menu Option' },
  { id: 'option-3', label: 'Menu Option' },
  { id: 'option-4', label: 'Menu Option' },
  { id: 'option-5', label: 'Menu Option' },
  { id: 'option-6', label: 'Menu Option' }
];

const meta: Meta<MbSplitButtonProps> = {
  title: 'Components/MbSplitButton',
  component: MbSplitButton,
  tags: ['autodocs'],
  args: {
    label: 'Button',
    options: defaultOptions,
    open: true,
    size: 'md',
    disabled: false
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['md', 'lg']
    },
    open: {
      control: 'boolean'
    }
  },
  render: (args) => ({
    components: { MbSplitButton },
    setup() {
      const open = ref(Boolean(args.open));

      watch(
        () => args.open,
        (value) => {
          open.value = Boolean(value);
        }
      );

      return { args, open };
    },
    template: `
      <div style="display:grid;gap:16px;align-items:start;justify-items:start;padding:24px;">
        <MbSplitButton v-bind="args" :open="open" @update:open="open = $event" />
      </div>
    `
  })
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const FigmaOpen: Story = {
  args: {
    open: true,
    size: 'md'
  }
};

export const Closed: Story = {
  args: {
    open: false
  }
};
