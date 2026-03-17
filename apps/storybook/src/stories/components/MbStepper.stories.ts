import { ref, watch } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import MbStepper from '../../../../../packages/marobase-ui/src/components/MbStepper.vue';
import type {
  MbStepperItem,
  MbStepperProps,
  MbStepperState
} from '../../../../../packages/marobase-ui/src/components/MbStepper.types';

const stateOptions: MbStepperState[] = ['default', 'disabled'];

const figmaItems: MbStepperItem[] = [
  { id: 'personal', title: 'Personal Info' },
  { id: 'phone', title: 'Phone' },
  { id: 'email', title: 'E-mail' },
  { id: 'password', title: 'Password' }
];

const meta: Meta<MbStepperProps> = {
  title: 'Components/MbStepper',
  component: MbStepper,
  tags: ['autodocs'],
  args: {
    items: figmaItems,
    modelValue: 1,
    clickable: true,
    state: 'default',
    disabled: false,
    ariaLabel: 'Stepper'
  },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: stateOptions
    }
  },
  render: (args) => ({
    components: { MbStepper },
    setup() {
      const active = ref(typeof args.modelValue === 'number' ? args.modelValue : 1);

      watch(
        () => args.modelValue,
        (next) => {
          active.value = typeof next === 'number' ? next : 1;
        }
      );

      return { args, active };
    },
    template: `
      <div style="display:grid;gap:16px;align-items:start;justify-items:start;padding:24px;">
        <MbStepper v-bind="args" :model-value="active" @update:modelValue="active = $event" />
      </div>
    `
  })
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const FigmaDefault: Story = {
  args: {
    modelValue: 1
  }
};
