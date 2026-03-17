import { ref, watch } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import MbTooltip from '../../../../../packages/marobase-ui/src/components/MbTooltip.vue';
import type { MbTooltipProps } from '../../../../../packages/marobase-ui/src/components/MbTooltip.types';

const meta: Meta<MbTooltipProps> = {
  title: 'Components/MbTooltip',
  component: MbTooltip,
  tags: ['autodocs'],
  args: {
    modelValue: false,
    text: "It's a tooltip",
    placement: 'top',
    disabled: false,
    triggerAriaLabel: 'Show tooltip'
  },
  argTypes: {
    placement: {
      control: 'inline-radio',
      options: ['top', 'bottom']
    }
  },
  render: (args) => ({
    components: { MbTooltip },
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
        <MbTooltip v-bind="args" :model-value="open" @update:modelValue="open = $event" />
      </div>
    `
  })
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const FigmaVisible: Story = {
  args: {
    modelValue: true,
    text: "It's a tooltip"
  }
};
