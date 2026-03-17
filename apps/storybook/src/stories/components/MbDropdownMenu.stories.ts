import type { Meta, StoryObj } from '@storybook/vue3';
import MbDropdownMenu from '../../../../../packages/marobase-ui/src/components/MbDropdownMenu.vue';
import type {
  MbDropdownMenuOption,
  MbDropdownMenuProps,
  MbDropdownMenuState
} from '../../../../../packages/marobase-ui/src/components/MbDropdownMenu.types';

const options: MbDropdownMenuOption[] = [
  { id: '1', label: 'Menu Option' },
  { id: '2', label: 'Menu Option' },
  { id: '3', label: 'Menu Option', meta: 'Text' },
  { id: '4', label: 'Menu Option', meta: 'Text' },
  { id: '5', label: 'Menu Option' },
  { id: '6', label: 'Menu Option' }
];

const stateOptions: MbDropdownMenuState[] = ['default', 'hover', 'focus', 'disabled'];

const meta: Meta<MbDropdownMenuProps> = {
  title: 'Components/MbDropdownMenu',
  component: MbDropdownMenu,
  tags: ['autodocs'],
  args: {
    header: 'Header',
    footer: 'Footer',
    options,
    selectedId: '',
    state: 'default',
    disabled: false,
    width: 260
  },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: stateOptions
    }
  },
  render: (args) => ({
    components: { MbDropdownMenu },
    setup() {
      return { args };
    },
    template: `
      <div style="display:grid;gap:16px;align-items:start;justify-items:start;padding:24px;">
        <MbDropdownMenu v-bind="args" />
      </div>
    `
  })
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithSelection: Story = {
  args: {
    selectedId: '3'
  }
};
