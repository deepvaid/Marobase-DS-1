import type { Meta, StoryObj } from '@storybook/vue3';
import MbAvatar from '../../../../../packages/marobase-ui/src/components/MbAvatar.vue';
import type {
  MbAvatarProps,
  MbAvatarSize,
  MbAvatarTone
} from '../../../../../packages/marobase-ui/src/components/MbAvatar.types';

const sizeOptions: MbAvatarSize[] = ['sm', 'md', 'lg', 'xl'];
const toneOptions: MbAvatarTone[] = ['neutral', 'brand', 'danger'];

const meta: Meta<MbAvatarProps> = {
  title: 'Components/MbAvatar',
  component: MbAvatar,
  tags: ['autodocs'],
  args: {
    name: 'Jane Smith',
    initials: 'JS',
    size: 'lg',
    tone: 'neutral',
    interactive: true,
    disabled: false
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: sizeOptions
    },
    tone: {
      control: 'inline-radio',
      options: toneOptions
    }
  },
  render: (args) => ({
    components: { MbAvatar },
    setup() {
      return { args };
    },
    template: `
      <div style="display:grid;gap:16px;align-items:start;justify-items:start;padding:24px;">
        <MbAvatar v-bind="args" />
      </div>
    `
  })
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ToneGrid: Story = {
  render: (args) => ({
    components: { MbAvatar },
    setup() {
      return { args };
    },
    template: `
      <div style="display:flex;gap:16px;padding:24px;align-items:center;">
        <MbAvatar v-bind="args" tone="neutral" initials="JS" />
        <MbAvatar v-bind="args" tone="brand" initials="MB" />
        <MbAvatar v-bind="args" tone="danger" initials="AL" />
      </div>
    `
  })
};
