import { computed } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import MbCircleButton from '../../../../../packages/marobase-ui/src/components/MbCircleButton.vue';
import type {
  MbCircleButtonMode,
  MbCircleButtonProps,
  MbCircleButtonState,
  MbCircleButtonVariant
} from '../../../../../packages/marobase-ui/src/components/MbCircleButton.types';

type IconName = 'dots' | 'heart' | 'cloud-download';

type StoryArgs = MbCircleButtonProps & {
  iconName: IconName;
};

type Story = StoryObj<typeof meta>;

const meta: Meta<StoryArgs> = {
  title: 'Components/MbCircleButton',
  component: MbCircleButton,
  tags: ['autodocs'],
  args: {
    variant: 'neutral',
    state: 'default',
    mode: 'icon-only',
    label: 'More actions',
    ariaLabel: 'More actions',
    disabled: false,
    iconName: 'dots'
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['neutral', 'danger', 'brand-outline'] satisfies MbCircleButtonVariant[]
    },
    state: {
      control: 'select',
      options: ['default', 'hover', 'active', 'focus', 'disabled'] satisfies MbCircleButtonState[]
    },
    mode: {
      control: 'inline-radio',
      options: ['icon-only', 'with-label'] satisfies MbCircleButtonMode[]
    },
    iconName: {
      control: 'inline-radio',
      options: ['dots', 'heart', 'cloud-download'] satisfies IconName[]
    }
  },
  render: (args) => ({
    components: { MbCircleButton },
    setup() {
      const componentArgs = computed(() => {
        const { iconName, ...rest } = args;
        void iconName;
        return rest;
      });

      return { args, componentArgs };
    },
    template: `
      <div style="display:grid;gap:16px;align-items:start;justify-items:start;padding:24px;">
        <MbCircleButton v-bind="componentArgs">
          <template #icon>
            <svg
              v-if="args.iconName === 'dots'"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="12" cy="6" r="1.8" fill="currentColor" />
              <circle cx="12" cy="12" r="1.8" fill="currentColor" />
              <circle cx="12" cy="18" r="1.8" fill="currentColor" />
            </svg>

            <svg
              v-else-if="args.iconName === 'heart'"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12 20.25C11.62 20.25 11.27 20.1 11.02 19.85L4.73 13.56C3.19 12.02 3.19 9.52 4.73 7.98C6.27 6.44 8.77 6.44 10.31 7.98L12 9.67L13.69 7.98C15.23 6.44 17.73 6.44 19.27 7.98C20.81 9.52 20.81 12.02 19.27 13.56L12.98 19.85C12.73 20.1 12.38 20.25 12 20.25Z"
                fill="currentColor"
              />
            </svg>

            <svg
              v-else
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12 16V7.5M12 16L8.75 12.75M12 16L15.25 12.75M5 15.75V16.5C5 18.16 6.34 19.5 8 19.5H16C17.66 19.5 19 18.16 19 16.5V15.75"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </template>
        </MbCircleButton>
      </div>
    `
  })
};

export default meta;

export const Playground: Story = {};

export const MoreActions: Story = {
  args: {
    variant: 'neutral',
    mode: 'icon-only',
    state: 'default',
    label: 'More actions',
    ariaLabel: 'More actions',
    iconName: 'dots'
  }
};

export const Favorite: Story = {
  args: {
    variant: 'danger',
    mode: 'icon-only',
    state: 'default',
    label: 'Add to favorites',
    ariaLabel: 'Add to favorites',
    iconName: 'heart'
  }
};

export const Download: Story = {
  args: {
    variant: 'brand-outline',
    mode: 'with-label',
    state: 'default',
    label: 'Download',
    iconName: 'cloud-download'
  }
};

export const DarkPreview: Story = {
  name: 'Dark Preview (Static reference)',
  args: {
    variant: 'brand-outline',
    mode: 'with-label',
    state: 'default',
    label: 'Download',
    iconName: 'cloud-download'
  },
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
