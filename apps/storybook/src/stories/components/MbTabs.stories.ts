import { ref, watch } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import MbTabs from '../../../../../packages/marobase-ui/src/components/MbTabs.vue';
import type {
  MbTabItem,
  MbTabsProps,
  MbTabsState
} from '../../../../../packages/marobase-ui/src/components/MbTabs.types';

const stateOptions: MbTabsState[] = ['default', 'hover', 'focus', 'disabled'];

const figmaItems: MbTabItem[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'profile', label: 'Profile', dot: true },
  { id: 'notifications', label: 'Notifications', badge: 1 },
  { id: 'more', label: '...', icon: 'more' }
];

const meta: Meta<MbTabsProps> = {
  title: 'Components/MbTabs',
  component: MbTabs,
  tags: ['autodocs'],
  args: {
    items: figmaItems,
    modelValue: 'home',
    state: 'default',
    disabled: false,
    ariaLabel: 'Tabs'
  },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: stateOptions
    }
  },
  render: (args) => ({
    components: { MbTabs },
    setup() {
      const active = ref(args.modelValue ?? 'home');

      watch(
        () => args.modelValue,
        (next) => {
          active.value = next ?? 'home';
        }
      );

      return { args, active };
    },
    template: `
      <div style="display:grid;gap:16px;align-items:start;justify-items:start;padding:24px;">
        <MbTabs v-bind="args" :model-value="active" @update:modelValue="active = $event" />
      </div>
    `
  })
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const FigmaDefault: Story = {
  args: {
    modelValue: 'home'
  }
};
