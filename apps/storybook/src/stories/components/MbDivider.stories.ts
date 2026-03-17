import type { Meta, StoryObj } from '@storybook/vue3';
import MbDivider from '../../../../../packages/marobase-ui/src/components/MbDivider.vue';
import type {
  MbDividerOrientation,
  MbDividerProps,
  MbDividerTextAlign
} from '../../../../../packages/marobase-ui/src/components/MbDivider.types';

const orientationOptions: MbDividerOrientation[] = ['horizontal', 'vertical'];
const alignOptions: MbDividerTextAlign[] = ['start', 'center', 'end'];

const meta: Meta<MbDividerProps> = {
  title: 'Components/MbDivider',
  component: MbDivider,
  tags: ['autodocs'],
  args: {
    text: 'Log in with',
    orientation: 'horizontal',
    textAlign: 'center',
    inset: false
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: orientationOptions
    },
    textAlign: {
      control: 'inline-radio',
      options: alignOptions
    }
  },
  render: (args) => ({
    components: { MbDivider },
    setup() {
      return { args };
    },
    template: `
      <div style="display:grid;gap:16px;align-items:start;justify-items:start;padding:24px; width: 320px;">
        <MbDivider v-bind="args" />
      </div>
    `
  })
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
