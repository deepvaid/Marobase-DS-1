import { ref, watch } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import MbCheckbox from '../../../../../packages/marobase-ui/src/components/MbCheckbox.vue';
import type {
  MbCheckboxProps,
  MbCheckboxSize,
  MbCheckboxState
} from '../../../../../packages/marobase-ui/src/components/MbCheckbox.types';

const stateOptions: MbCheckboxState[] = ['default', 'hover', 'focus', 'pressed', 'disabled', 'error'];
const sizeOptions: MbCheckboxSize[] = ['lg', 'md', 'sm'];

const meta: Meta<MbCheckboxProps> = {
  title: 'Components/MbCheckbox',
  component: MbCheckbox,
  tags: ['autodocs'],
  args: {
    modelValue: true,
    indeterminate: false,
    size: 'lg',
    state: 'default',
    label: 'Label',
    caption: '',
    hint: 'Hint text',
    errorMessage: 'Error message',
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
    components: { MbCheckbox },
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
        <MbCheckbox
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
    components: { MbCheckbox },
    setup() {
      return {
        states: stateOptions,
        sizes: sizeOptions
      };
    },
    template: `
      <div style="display:grid;gap:16px;padding:24px;">
        <div v-for="size in sizes" :key="size" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;align-items:start;">
          <MbCheckbox :size="size" label="Unchecked" state="default" :model-value="false" hint="Hint text" />
          <MbCheckbox :size="size" label="Checked" state="default" :model-value="true" hint="Hint text" />
          <MbCheckbox :size="size" label="Indeterminate" state="default" :indeterminate="true" hint="Hint text" />
          <MbCheckbox :size="size" label="Hover" state="hover" :model-value="true" />
          <MbCheckbox :size="size" label="Focus" state="focus" :model-value="true" />
          <MbCheckbox :size="size" label="Pressed" state="pressed" :model-value="true" />
          <MbCheckbox :size="size" label="Disabled" state="disabled" :model-value="true" />
          <MbCheckbox :size="size" label="Error" state="error" :model-value="true" error-message="Error message" />
        </div>
      </div>
    `
  })
};
