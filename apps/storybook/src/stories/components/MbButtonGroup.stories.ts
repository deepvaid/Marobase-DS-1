import { ref, watch } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import MbButtonGroup from '../../../../../packages/marobase-ui/src/components/MbButtonGroup.vue';
import type {
  MbButtonGroupItem,
  MbButtonGroupMode,
  MbButtonGroupProps
} from '../../../../../packages/marobase-ui/src/components/MbButtonGroup.types';

type Story = StoryObj<typeof meta>;

const defaultItems: MbButtonGroupItem[] = [
  { id: 'view', icon: 'eye', ariaLabel: 'View' },
  { id: 'edit', icon: 'pencil', ariaLabel: 'Edit' },
  { id: 'delete', icon: 'trash', ariaLabel: 'Delete' }
];

const meta: Meta<MbButtonGroupProps> = {
  title: 'Components/MbButtonGroup',
  component: MbButtonGroup,
  tags: ['autodocs'],
  args: {
    items: defaultItems,
    modelValue: 0,
    size: 'lg',
    mode: 'icon-only',
    hug: false,
    disabled: false,
    ariaLabel: 'Button group'
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['lg', 'md', 'sm']
    },
    mode: {
      control: 'inline-radio',
      options: ['icon-only', 'with-label'] satisfies MbButtonGroupMode[]
    },
    hug: {
      control: 'boolean'
    },
    modelValue: {
      control: { type: 'number', min: 0, max: 2, step: 1 }
    }
  },
  render: (args) => ({
    components: { MbButtonGroup },
    setup() {
      const selected = ref(typeof args.modelValue === 'number' ? args.modelValue : 0);

      watch(
        () => args.modelValue,
        (next) => {
          if (typeof next === 'number' && Number.isFinite(next)) {
            selected.value = next;
          }
        }
      );

      return { args, selected };
    },
    template: `
      <div style="display:grid;gap:16px;align-items:start;justify-items:start;padding:24px;">
        <MbButtonGroup
          v-bind="args"
          :model-value="selected"
          @update:modelValue="selected = $event"
        />
      </div>
    `
  })
};

export default meta;

export const Playground: Story = {};

export const FigmaSegmented: Story = {
  args: {
    size: 'lg',
    mode: 'icon-only',
    hug: false,
    modelValue: 0
  }
};

export const WithLabel: Story = {
  args: {
    mode: 'with-label',
    hug: true,
    items: [
      { id: 'first', label: 'View', icon: 'eye' },
      { id: 'second', label: 'Edit', icon: 'pencil' },
      { id: 'third', label: 'Delete', icon: 'trash' }
    ]
  }
};
