import { ref, watch } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import MbTimeline from '../../../../../packages/marobase-ui/src/components/MbTimeline.vue';
import type { MbTimelineProps } from '../../../../../packages/marobase-ui/src/components/MbTimeline.types';

const meta: Meta<MbTimelineProps> = {
  title: 'Components/MbTimeline',
  component: MbTimeline,
  tags: ['autodocs'],
  args: {
    modelValue: 'shipping'
  },
  render: (args) => ({
    components: { MbTimeline },
    setup() {
      const active = ref(args.modelValue ?? '');

      watch(
        () => args.modelValue,
        (next) => {
          active.value = next ?? '';
        }
      );

      return { args, active };
    },
    template: `
      <div style="display:grid;gap:16px;align-items:start;justify-items:start;padding:24px; width: 100%;">
        <MbTimeline v-bind="args" :model-value="active" @update:modelValue="active = $event" />
      </div>
    `
  })
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
