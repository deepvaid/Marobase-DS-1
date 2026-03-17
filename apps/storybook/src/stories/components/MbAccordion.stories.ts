import { ref, watch } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import MbAccordion from '../../../../../packages/marobase-ui/src/components/MbAccordion.vue';
import type {
  MbAccordionItem,
  MbAccordionProps,
  MbAccordionState
} from '../../../../../packages/marobase-ui/src/components/MbAccordion.types';

const stateOptions: MbAccordionState[] = ['default', 'hover', 'focus', 'disabled'];

const items: MbAccordionItem[] = [
  { id: '1', title: 'Title', description: 'Description' },
  { id: '2', title: 'Title', description: 'Description' },
  { id: '3', title: 'Title' },
  { id: '4', title: 'Title' },
  { id: '5', title: 'Title' }
];

const meta: Meta<MbAccordionProps> = {
  title: 'Components/MbAccordion',
  component: MbAccordion,
  tags: ['autodocs'],
  args: {
    items,
    modelValue: ['1'],
    multiple: false,
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
    components: { MbAccordion },
    setup() {
      const openItems = ref<string[]>(Array.isArray(args.modelValue) ? [...args.modelValue] : []);

      watch(
        () => args.modelValue,
        (next) => {
          openItems.value = Array.isArray(next) ? [...next] : [];
        }
      );

      return { args, openItems };
    },
    template: `
      <div style="display:grid;gap:16px;align-items:start;justify-items:start;padding:24px; width: 100%;">
        <MbAccordion v-bind="args" :model-value="openItems" @update:modelValue="openItems = $event" />
      </div>
    `
  })
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ExpandedFirst: Story = {
  args: {
    modelValue: ['1']
  }
};
