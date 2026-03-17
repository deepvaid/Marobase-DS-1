import { ref, watch } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import MbWysiwygEditor from '../../../../../packages/marobase-ui/src/components/MbWysiwygEditor.vue';
import type {
  MbWysiwygEditorProps,
  MbWysiwygEditorState
} from '../../../../../packages/marobase-ui/src/components/MbWysiwygEditor.types';

const stateOptions: MbWysiwygEditorState[] = ['default', 'hover', 'focus', 'disabled', 'error'];

const meta: Meta<MbWysiwygEditorProps> = {
  title: 'Components/MbWysiwygEditor',
  component: MbWysiwygEditor,
  tags: ['autodocs'],
  args: {
    label: 'Label',
    hint: 'Hint text',
    errorMessage: 'Error message',
    state: 'default',
    required: false
  },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: stateOptions
    }
  },
  render: (args) => ({
    components: { MbWysiwygEditor },
    setup() {
      const value = ref(args.modelValue ?? undefined);

      watch(
        () => args.modelValue,
        (next) => {
          value.value = next;
        }
      );

      return { args, value };
    },
    template: `
      <div style="display:grid;gap:16px;align-items:start;justify-items:start;padding:24px;">
        <MbWysiwygEditor v-bind="args" :model-value="value" @update:modelValue="value = $event" />
      </div>
    `
  })
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Focus: Story = {
  args: {
    state: 'focus'
  }
};

export const Error: Story = {
  args: {
    state: 'error'
  }
};
