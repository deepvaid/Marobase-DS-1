import type { Meta, StoryObj } from '@storybook/vue3';
import MbChip from '../../../../../packages/marobase-ui/src/components/MbChip.vue';
import type { MbChipProps, MbChipTone } from '../../../../../packages/marobase-ui/src/components/MbChip.types';

const toneOptions: MbChipTone[] = ['neutral', 'brand', 'danger'];

const meta: Meta<MbChipProps> = {
  title: 'Components/MbChip',
  component: MbChip,
  tags: ['autodocs'],
  args: {
    label: 'Tag with Dismiss',
    tone: 'neutral',
    selected: false,
    dismissible: true,
    disabled: false
  },
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: toneOptions
    }
  },
  render: (args) => ({
    components: { MbChip },
    setup() {
      return { args };
    },
    template: `
      <div style="display:grid;gap:16px;align-items:start;justify-items:start;padding:24px;">
        <MbChip v-bind="args" />
      </div>
    `
  })
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Selected: Story = {
  args: {
    selected: true
  }
};
