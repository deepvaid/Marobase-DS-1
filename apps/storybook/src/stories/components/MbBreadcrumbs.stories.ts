import { ref, watch } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import MbBreadcrumbs from '../../../../../packages/marobase-ui/src/components/MbBreadcrumbs.vue';
import type {
  MbBreadcrumbItem,
  MbBreadcrumbsProps,
  MbBreadcrumbsState
} from '../../../../../packages/marobase-ui/src/components/MbBreadcrumbs.types';

const stateOptions: MbBreadcrumbsState[] = ['default', 'hover', 'focus', 'disabled'];

const figmaItems: MbBreadcrumbItem[] = [
  { id: 'home', label: 'Home', icon: 'home', iconOnly: true, ariaLabel: 'Home' },
  { id: 'products', label: 'Products' },
  { id: 'more', label: '...' },
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'outdoors', label: 'Outdoors' },
  { id: 'hiking', label: 'Hiking' }
];

const meta: Meta<MbBreadcrumbsProps> = {
  title: 'Components/MbBreadcrumbs',
  component: MbBreadcrumbs,
  tags: ['autodocs'],
  args: {
    items: figmaItems,
    modelValue: 'hiking',
    state: 'default',
    disabled: false,
    ariaLabel: 'Breadcrumb'
  },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: stateOptions
    }
  },
  render: (args) => ({
    components: { MbBreadcrumbs },
    setup() {
      const selected = ref(args.modelValue ?? 'hiking');

      watch(
        () => args.modelValue,
        (next) => {
          selected.value = next ?? 'hiking';
        }
      );

      return { args, selected };
    },
    template: `
      <div style="display:grid;gap:16px;align-items:start;justify-items:start;padding:24px;">
        <MbBreadcrumbs v-bind="args" :model-value="selected" @update:modelValue="selected = $event" />
      </div>
    `
  })
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const FigmaPath: Story = {
  args: {
    modelValue: 'hiking'
  }
};
