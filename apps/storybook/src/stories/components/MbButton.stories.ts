import type { Meta, StoryObj } from '@storybook/vue3';
import MbButton from '../../../../../packages/marobase-ui/src/components/MbButton.vue';
import type { MbButtonProps } from '../../../../../packages/marobase-ui/src/components/MbButton.types';

type Story = StoryObj<typeof meta>;

const meta: Meta<MbButtonProps> = {
  title: 'Components/MbButton',
  component: MbButton,
  tags: ['autodocs'],
  args: {
    styleType: 'filled',
    size: 'lg',
    state: 'default',
    iconMode: 'with-label',
    label: 'Sign Up',
    leadingIcon: undefined,
    trailingIcon: undefined,
    disabled: false,
    loading: false
  },
  argTypes: {
    styleType: {
      control: 'inline-radio',
      options: ['filled', 'outline', 'tinted', 'plain']
    },
    size: {
      control: 'inline-radio',
      options: ['lg', 'md', 'sm']
    },
    state: {
      control: 'select',
      options: ['default', 'hover', 'active', 'focus', 'disabled', 'loading']
    },
    iconMode: {
      control: 'inline-radio',
      options: ['with-label', 'icon-only']
    }
  },
  render: (args) => ({
    components: { MbButton },
    setup() {
      return { args };
    },
    template: `
      <div style="display:grid;gap:12px;align-items:start;justify-items:start;padding:24px;">
        <MbButton v-bind="args" />
      </div>
    `
  })
};

export default meta;

export const Playground: Story = {};

export const FigmaPrimary: Story = {
  name: 'Figma Primary (Static reference)',
  args: {
    styleType: 'filled',
    size: 'lg',
    state: 'default',
    iconMode: 'with-label',
    label: 'Sign Up',
    leadingIcon: undefined,
    trailingIcon: undefined
  },
  parameters: {
    docs: {
      description: {
        story: 'Static Figma reference snapshot (non-interactive target state).'
      }
    }
  }
};

export const DarkPreview: Story = {
  name: 'Dark Preview (Static reference)',
  parameters: {
    docs: {
      description: {
        story: 'Static dark-mode reference snapshot (non-interactive target state).'
      }
    },
    globals: {
      theme: 'dark'
    }
  }
};
