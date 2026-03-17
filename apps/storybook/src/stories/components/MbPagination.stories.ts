import { ref, watch } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import MbPagination from '../../../../../packages/marobase-ui/src/components/MbPagination.vue';
import type {
  MbPaginationProps,
  MbPaginationState
} from '../../../../../packages/marobase-ui/src/components/MbPagination.types';

const stateOptions: MbPaginationState[] = ['default', 'hover', 'focus', 'disabled'];

const meta: Meta<MbPaginationProps> = {
  title: 'Components/MbPagination',
  component: MbPagination,
  tags: ['autodocs'],
  args: {
    items: [1, 2, 3, 4, 5, 6, 'ellipsis', 1024],
    modelValue: 1,
    state: 'default',
    disabled: false,
    prevLabel: 'Previous',
    nextLabel: 'Next'
  },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: stateOptions
    }
  },
  render: (args) => ({
    components: { MbPagination },
    setup() {
      const currentPage = ref(args.modelValue ?? 1);

      watch(
        () => args.modelValue,
        (next) => {
          currentPage.value = next ?? 1;
        }
      );

      return { args, currentPage };
    },
    template: `
      <div style="display:grid;gap:16px;align-items:start;justify-items:start;padding:24px;">
        <MbPagination v-bind="args" :model-value="currentPage" @update:modelValue="currentPage = $event" />
      </div>
    `
  })
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const FigmaDefault: Story = {
  args: {
    modelValue: 1
  }
};
