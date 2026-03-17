import { ref, watch } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import MbRadio from '../../../../../packages/marobase-ui/src/components/MbRadio.vue';
import type {
  MbRadioProps,
  MbRadioSize,
  MbRadioState
} from '../../../../../packages/marobase-ui/src/components/MbRadio.types';

const stateOptions: MbRadioState[] = ['default', 'hover', 'focus', 'pressed', 'disabled', 'error'];
const sizeOptions: MbRadioSize[] = ['lg', 'md', 'sm'];

const meta: Meta<MbRadioProps> = {
  title: 'Components/MbRadio',
  component: MbRadio,
  tags: ['autodocs'],
  args: {
    modelValue: false,
    size: 'lg',
    state: 'default',
    label: 'Label',
    caption: '',
    hint: 'Hint text',
    errorMessage: 'Error message',
    allowDeselect: false,
    required: false,
    disabled: false
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: sizeOptions
    },
    state: {
      control: 'inline-radio',
      options: stateOptions
    }
  },
  render: (args) => ({
    components: { MbRadio },
    setup() {
      const checked = ref(Boolean(args.modelValue));

      watch(
        () => args.modelValue,
        (next) => {
          checked.value = Boolean(next);
        }
      );

      return { args, checked };
    },
    template: `
      <div style="display:grid;gap:16px;align-items:start;justify-items:start;padding:24px;">
        <MbRadio v-bind="args" :model-value="checked" @update:modelValue="checked = $event" />
      </div>
    `
  })
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => ({
    components: { MbRadio },
    setup() {
      return {
        sizes: sizeOptions
      };
    },
    template: `
      <div style="display:grid;gap:16px;padding:24px;">
        <div v-for="size in sizes" :key="size" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;align-items:start;">
          <MbRadio :size="size" label="Unchecked" state="default" :model-value="false" hint="Hint text" />
          <MbRadio :size="size" label="Checked" state="default" :model-value="true" hint="Hint text" />
          <MbRadio :size="size" label="Hover" state="hover" :model-value="true" />
          <MbRadio :size="size" label="Focus" state="focus" :model-value="true" />
          <MbRadio :size="size" label="Pressed" state="pressed" :model-value="true" />
          <MbRadio :size="size" label="Disabled" state="disabled" :model-value="true" />
          <MbRadio :size="size" label="Error" state="error" :model-value="true" error-message="Error message" />
        </div>
      </div>
    `
  })
};
