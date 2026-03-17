import type { Meta, StoryObj } from '@storybook/vue3';
import MbBadge from '../../../../../packages/marobase-ui/src/components/MbBadge.vue';
import type {
  MbBadgeIcon,
  MbBadgeProps,
  MbBadgeTone,
  MbBadgeVariant
} from '../../../../../packages/marobase-ui/src/components/MbBadge.types';

const toneOptions: MbBadgeTone[] = ['additional', 'danger', 'success', 'brand', 'neutral'];
const variantOptions: MbBadgeVariant[] = ['outline', 'soft', 'solid'];
const iconOptions: MbBadgeIcon[] = ['star', 'alert', 'none'];

const meta: Meta<MbBadgeProps> = {
  title: 'Components/MbBadge',
  component: MbBadge,
  tags: ['autodocs'],
  args: {
    label: 'Premium',
    tone: 'additional',
    variant: 'outline',
    icon: 'star',
    interactive: true,
    disabled: false
  },
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: toneOptions
    },
    variant: {
      control: 'inline-radio',
      options: variantOptions
    },
    icon: {
      control: 'inline-radio',
      options: iconOptions
    }
  },
  render: (args) => ({
    components: { MbBadge },
    setup() {
      return { args };
    },
    template: `
      <div style="display:grid;gap:16px;align-items:start;justify-items:start;padding:24px;">
        <MbBadge v-bind="args" />
      </div>
    `
  })
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const PremiumAndDanger: Story = {
  render: (args) => ({
    components: { MbBadge },
    setup() {
      return { args };
    },
    template: `
      <div style="display:flex;gap:12px;padding:24px;align-items:center;">
        <MbBadge v-bind="args" label="Premium" tone="additional" variant="outline" icon="star" />
        <MbBadge v-bind="args" label="Danger" tone="danger" variant="soft" icon="alert" />
      </div>
    `
  })
};
