import { ref, watch } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import MbAlert from '../../../../../packages/marobase-ui/src/components/MbAlert.vue';
import type { MbAlertProps, MbAlertTone } from '../../../../../packages/marobase-ui/src/components/MbAlert.types';

const toneOptions: MbAlertTone[] = ['info', 'success', 'warning', 'danger', 'additional'];

const meta: Meta<MbAlertProps> = {
  title: 'Components/MbAlert',
  component: MbAlert,
  tags: ['autodocs'],
  args: {
    modelValue: true,
    tone: 'info',
    dismissible: true
  },
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: toneOptions
    }
  },
  render: (args) => ({
    components: { MbAlert },
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
      <div style="display:grid;gap:16px;align-items:start;justify-items:start;padding:24px; width: 100%;">
        <MbAlert v-bind="args" :model-value="open" @update:modelValue="open = $event" />
      </div>
    `
  })
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AdditionalTone: Story = {
  args: {
    tone: 'additional',
    title: 'Quick start development',
    description: 'Link this issue to your code by including issue keys when creating a branch, commit, or pull request below.',
    primaryLabel: 'Learn more',
    secondaryLabel: '',
    dismissible: false
  }
};
