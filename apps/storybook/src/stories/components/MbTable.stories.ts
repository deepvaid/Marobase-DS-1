import { ref, watch } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import MbTable from '../../../../../packages/marobase-ui/src/components/MbTable.vue';
import type { MbTableProps } from '../../../../../packages/marobase-ui/src/components/MbTable.types';

const meta: Meta<MbTableProps> = {
  title: 'Components/MbTable',
  component: MbTable,
  tags: ['autodocs'],
  args: {
    modelValue: [],
    selectable: true,
    striped: true,
    hoverable: true
  },
  render: (args) => ({
    components: { MbTable },
    setup() {
      const selectedRows = ref<string[]>(Array.isArray(args.modelValue) ? [...args.modelValue] : []);

      watch(
        () => args.modelValue,
        (next) => {
          selectedRows.value = Array.isArray(next) ? [...next] : [];
        }
      );

      return { args, selectedRows };
    },
    template: `
      <div style="display:grid;gap:16px;align-items:start;justify-items:start;padding:24px; width: 100%;">
        <MbTable v-bind="args" :model-value="selectedRows" @update:modelValue="selectedRows = $event" />
      </div>
    `
  })
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
