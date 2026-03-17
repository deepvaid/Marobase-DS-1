import { ref, watch } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import MbDrawer from '../../../../../packages/marobase-ui/src/components/MbDrawer.vue';
import type { MbDrawerProps } from '../../../../../packages/marobase-ui/src/components/MbDrawer.types';

const meta: Meta<MbDrawerProps> = {
  title: 'Components/MbDrawer',
  component: MbDrawer,
  tags: ['autodocs'],
  args: {
    modelValue: true,
    title: 'Add new card',
    subtitle: 'Visible only for you',
    primaryLabel: 'Save changes',
    secondaryLabel: 'Cancel',
    width: 424,
    showBackdrop: false,
    closeOnBackdrop: true,
    dismissible: true
  },
  render: (args) => ({
    components: { MbDrawer },
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
      <div style="display:grid;gap:16px;align-items:stretch;justify-items:stretch;padding:0; width: 100%; min-height: 900px;">
        <MbDrawer v-bind="args" :model-value="open" @update:modelValue="open = $event" />
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
    showBackdrop: false
  }
};
