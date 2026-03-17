import { ref, watch } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import MbModal from '../../../../../packages/marobase-ui/src/components/MbModal.vue';
import type { MbModalProps } from '../../../../../packages/marobase-ui/src/components/MbModal.types';

const meta: Meta<MbModalProps> = {
  title: 'Components/MbModal',
  component: MbModal,
  tags: ['autodocs'],
  args: {
    modelValue: true,
    title: 'Popup header',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    primaryLabel: 'Button',
    secondaryLabel: 'Button',
    dismissible: true,
    closeOnOverlay: true,
    closeOnAction: false,
    width: 400
  },
  render: (args) => ({
    components: { MbModal },
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
      <div style="display:grid;gap:16px;align-items:start;justify-items:start;padding:24px; width: 100%; min-height: 520px;">
        <MbModal v-bind="args" :model-value="open" @update:modelValue="open = $event" />
      </div>
    `
  })
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const FigmaDefault: Story = {
  args: {
    modelValue: true
  }
};
