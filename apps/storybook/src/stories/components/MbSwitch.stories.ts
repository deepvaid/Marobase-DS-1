import { ref, watch } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import MbSwitch from '../../../../../packages/marobase-ui/src/components/MbSwitch.vue';
import type {
  MbSwitchProps,
  MbSwitchSize,
  MbSwitchState
} from '../../../../../packages/marobase-ui/src/components/MbSwitch.types';

const stateOptions: MbSwitchState[] = ['default', 'hover', 'focus', 'pressed', 'disabled', 'error'];
const sizeOptions: MbSwitchSize[] = ['md', 'sm'];

const meta: Meta<MbSwitchProps> = {
  title: 'Components/MbSwitch',
  component: MbSwitch,
  tags: ['autodocs'],
  args: {
    modelValue: false,
    indeterminate: false,
    loading: false,
    size: 'md',
    state: 'default',
    label: 'Label',
    caption: '',
    hint: 'Hint text',
    errorMessage: 'Error message',
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
    components: { MbSwitch },
    setup() {
      const checked = ref(Boolean(args.modelValue));
      const indeterminate = ref(Boolean(args.indeterminate));

      watch(
        () => args.modelValue,
        (next) => {
          checked.value = Boolean(next);
        }
      );

      watch(
        () => args.indeterminate,
        (next) => {
          indeterminate.value = Boolean(next);
        }
      );

      return { args, checked, indeterminate };
    },
    template: `
      <div style="display:grid;gap:16px;align-items:start;justify-items:start;padding:24px;">
        <MbSwitch
          v-bind="args"
          :model-value="checked"
          :indeterminate="indeterminate"
          @update:modelValue="checked = $event"
          @update:indeterminate="indeterminate = $event"
        />
      </div>
    `
  })
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => ({
    components: { MbSwitch },
    setup() {
      return {
        sizes: sizeOptions
      };
    },
    template: `
      <div style="display:grid;gap:16px;padding:24px;">
        <div v-for="size in sizes" :key="size" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;align-items:start;">
          <MbSwitch :size="size" label="Unchecked" state="default" :model-value="false" />
          <MbSwitch :size="size" label="Checked" state="default" :model-value="true" />
          <MbSwitch :size="size" label="Indeterminate" state="default" :indeterminate="true" />
          <MbSwitch :size="size" label="Hover" state="hover" :model-value="true" />
          <MbSwitch :size="size" label="Focus" state="focus" :model-value="true" />
          <MbSwitch :size="size" label="Pressed" state="pressed" :model-value="true" />
          <MbSwitch :size="size" label="Loading" state="default" :model-value="true" :loading="true" />
          <MbSwitch :size="size" label="Disabled" state="disabled" :model-value="true" />
          <MbSwitch :size="size" label="Error" state="error" :model-value="true" error-message="Error message" />
        </div>
      </div>
    `
  })
};
