import type { Meta, StoryObj } from '@storybook/vue3';
import MbDragDropUploader from '../../../../../packages/marobase-ui/src/components/MbDragDropUploader.vue';
import type {
  MbDragDropUploaderProps,
  MbDragDropUploaderState
} from '../../../../../packages/marobase-ui/src/components/MbDragDropUploader.types';

const stateOptions: MbDragDropUploaderState[] = ['default', 'hover', 'focus', 'disabled', 'error'];

const meta: Meta<MbDragDropUploaderProps> = {
  title: 'Components/MbDragDropUploader',
  component: MbDragDropUploader,
  tags: ['autodocs'],
  args: {
    label: 'Label',
    browseLabel: 'browse file',
    helperText: 'PDF, XLS, DOCX, JPG, PNG up to 5 MB',
    hint: 'Hint text',
    state: 'default',
    multiple: false
  },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: stateOptions
    }
  },
  render: (args) => ({
    components: { MbDragDropUploader },
    setup() {
      return { args };
    },
    template: `
      <div style="display:grid;gap:16px;align-items:start;justify-items:start;padding:24px;">
        <MbDragDropUploader v-bind="args" />
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

export const Disabled: Story = {
  args: {
    state: 'disabled'
  }
};
