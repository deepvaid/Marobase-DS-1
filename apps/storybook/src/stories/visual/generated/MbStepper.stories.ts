import type { Meta, StoryObj } from '@storybook/vue3';
import { visualParameters } from '../../../visual-meta';

type Args = {
  label: string;
};

const meta = {
  title: 'Visual/MbStepper',
  tags: ['autodocs'],
  render: (args: Args) => ({
    setup() {
      return { args };
    },
    template: "<section\n        data-visual-target\n        data-component=\"MbStepper\"\n        style=\"\n          width: 100%;\n          min-height: 280px;\n          border-radius: 12px;\n          border: 1px solid #c1c8cd;\n          padding: 24px;\n          background: var(--mb-surface, #ffffff);\n          color: var(--mb-text, #11181c);\n          font-family: Inter, sans-serif;\n        \"\n      >\n        <h2 style=\"margin: 0 0 12px; font-size: 20px; line-height: 28px;\">MbStepper</h2>\n        <p style=\"margin: 0; font-size: 14px; line-height: 20px;\">{{ args.label }}</p>\n      </section>"
  }),
  args: {
    label: 'MbStepper matrix placeholder. Replace with real component implementation.'
  }
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Matrix: Story = {
  parameters: visualParameters({
    figmaNodeId: '1161:62571',
    viewport: 'desktop',
    theme: 'light',
    state: 'matrix',
    variant: 'all'
  })
};
