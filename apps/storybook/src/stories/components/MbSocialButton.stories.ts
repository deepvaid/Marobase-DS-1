import type { Meta, StoryObj } from '@storybook/vue3';
import MbSocialButton from '../../../../../packages/marobase-ui/src/components/MbSocialButton.vue';
import type {
  MbSocialButtonProps,
  MbSocialButtonState
} from '../../../../../packages/marobase-ui/src/components/MbSocialButton.types';

const stateOptions: MbSocialButtonState[] = ['default', 'hover', 'active', 'disabled'];

const meta: Meta<MbSocialButtonProps> = {
  title: 'Components/MbSocialButton',
  component: MbSocialButton,
  tags: ['autodocs'],
  args: {
    provider: 'google',
    state: 'default',
    label: 'Continue with Google',
    iconOnly: false,
    width: 320,
    disabled: false
  },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: stateOptions
    },
    iconOnly: {
      control: 'boolean'
    },
    width: {
      control: { type: 'number', min: 220, max: 420, step: 10 }
    }
  },
  render: (args) => ({
    components: { MbSocialButton },
    setup() {
      return { args };
    },
    template: `
      <div style="display:grid;gap:16px;align-items:start;justify-items:start;padding:24px;">
        <MbSocialButton v-bind="args" />
      </div>
    `
  })
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const FigmaGoogle: Story = {
  args: {
    provider: 'google',
    state: 'default',
    label: 'Continue with Google',
    iconOnly: false,
    width: 320
  }
};

export const IconOnly: Story = {
  args: {
    iconOnly: true,
    ariaLabel: 'Continue with Google'
  }
};
