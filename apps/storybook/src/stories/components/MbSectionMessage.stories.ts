import type { Meta, StoryObj } from '@storybook/vue3';
import MbSectionMessage from '../../../../../packages/marobase-ui/src/components/MbSectionMessage.vue';
import type {
  MbSectionMessageProps,
  MbSectionMessageTone
} from '../../../../../packages/marobase-ui/src/components/MbSectionMessage.types';

const toneOptions: MbSectionMessageTone[] = ['additional', 'info', 'success', 'warning', 'danger'];

const meta: Meta<MbSectionMessageProps> = {
  title: 'Components/MbSectionMessage',
  component: MbSectionMessage,
  tags: ['autodocs'],
  args: {
    tone: 'additional',
    primaryLabel: 'Learn more',
    secondaryLabel: ''
  },
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: toneOptions
    }
  },
  render: (args) => ({
    components: { MbSectionMessage },
    setup() {
      return { args };
    },
    template: `
      <div style="display:grid;gap:16px;align-items:start;justify-items:start;padding:24px; width: 100%;">
        <MbSectionMessage v-bind="args" />
      </div>
    `
  })
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
