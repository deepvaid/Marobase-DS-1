import { ref, watch } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import MbTextArea from '../../../../../packages/marobase-ui/src/components/MbTextArea.vue';
import type {
  MbTextAreaProps,
  MbTextAreaState
} from '../../../../../packages/marobase-ui/src/components/MbTextArea.types';

const stateOptions: MbTextAreaState[] = ['default', 'hover', 'focus', 'disabled', 'error'];

const meta: Meta<MbTextAreaProps> = {
  title: 'Components/MbTextArea',
  component: MbTextArea,
  tags: ['autodocs'],
  args: {
    modelValue: '',
    label: 'Label',
    placeholder: 'Type here',
    hint: 'Hint text',
    errorMessage: 'Error message',
    required: false,
    state: 'default',
    floatingLabel: false,
    rows: 6
  },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: stateOptions
    }
  },
  render: (args) => ({
    components: { MbTextArea },
    setup() {
      const value = ref(args.modelValue ?? '');

      watch(
        () => args.modelValue,
        (next) => {
          value.value = next ?? '';
        }
      );

      return { args, value };
    },
    template: `
      <div style="display:grid;gap:16px;align-items:start;justify-items:start;padding:24px;">
        <MbTextArea v-bind="args" :model-value="value" @update:modelValue="value = $event" />
      </div>
    `
  })
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const FloatingLabel: Story = {
  args: {
    floatingLabel: true,
    required: true,
    modelValue: 'Filled'
  }
};

export const Focus: Story = {
  args: {
    state: 'focus',
    modelValue:
      'Earth is the third planet from the Sun and the only astronomical object known to harbor life. According to radiometric dating estimation and other evidence, Earth formed over 4.5 billion years ago|'
  }
};
