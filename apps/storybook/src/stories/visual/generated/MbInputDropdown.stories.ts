import type { Meta, StoryObj } from '@storybook/vue3';
import MbInputDropdown from '../../../../../../packages/marobase-ui/src/components/MbInputDropdown.vue';
import { visualParameters } from '../../../visual-meta';

type Args = Record<string, never>;

const meta = {
  title: 'Visual/MbInputDropdown',
  tags: ['autodocs'],
  render: () => ({
    components: { MbInputDropdown },
    template: `
      <section data-visual-target class="mbvidd-root" aria-label="MbInputDropdown visual matrix">
        <h2 class="mbvidd-title">MbInputDropdown</h2>

        <div class="mbvidd-grid">
          <MbInputDropdown label="Language" :open="true" state="focus" />
          <MbInputDropdown label="Language" :open="false" state="default" />
          <MbInputDropdown label="Language" :open="true" state="error" error-message="Error message" />
        </div>

        <style>
          .mbvidd-root {
            width: 100%;
            min-height: 100%;
            padding: 12px;
            box-sizing: border-box;
            background: var(--mb-stage-bg);
            color: var(--mb-stage-text);
            border: 1px solid var(--mb-stage-border);
            border-radius: 12px;
            font-family: var(--mb-idd-font-family);
            display: grid;
            gap: 10px;
          }

          .mbvidd-title {
            margin: 0;
            font-size: 18px;
            line-height: 24px;
          }

          .mbvidd-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            justify-items: center;
            gap: 10px;
          }
        </style>
      </section>
    `
  })
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Matrix: Story = {
  parameters: visualParameters({
    figmaNodeId: '21502:24879',
    viewport: 'desktop',
    theme: 'light',
    state: 'matrix',
    variant: 'all'
  })
};
