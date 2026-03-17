import { ref, watch } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import MbPopover from '../../../../../packages/marobase-ui/src/components/MbPopover.vue';
import type { MbPopoverProps } from '../../../../../packages/marobase-ui/src/components/MbPopover.types';

const meta: Meta<MbPopoverProps> = {
  title: 'Components/MbPopover',
  component: MbPopover,
  tags: ['autodocs'],
  args: {
    modelValue: true,
    title: 'Popover Header',
    description: 'Helpful description for popover',
    primaryLabel: 'Accept',
    secondaryLabel: 'Cancel',
    dismissible: true,
    closeOnAction: false,
    showArrow: true,
    width: 300
  },
  render: (args) => ({
    components: { MbPopover },
    setup() {
      const open = ref(Boolean(args.modelValue));

      watch(
        () => args.modelValue,
        (next) => {
          open.value = Boolean(next);
        }
      );

      return { args, open };
    },
    template: `
      <div style="display:grid;gap:16px;align-items:start;justify-items:start;padding:24px;">
        <MbPopover v-bind="args" :model-value="open" @update:modelValue="open = $event" />
      </div>
    `
  })
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const FigmaDefault: Story = {
  args: {
    modelValue: true,
    title: 'Popover Header',
    description: 'Helpful description for popover'
  }
};
