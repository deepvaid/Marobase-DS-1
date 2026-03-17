import type { Meta, StoryObj } from '@storybook/vue3';
import MbDropdownMenu from '../../../../../../packages/marobase-ui/src/components/MbDropdownMenu.vue';
import { visualParameters } from '../../../visual-meta';

type Args = Record<string, never>;

const meta = {
  title: 'Visual/MbDropdownMenu',
  tags: ['autodocs'],
  render: () => ({
    components: { MbDropdownMenu },
    template: `
      <section data-visual-target class="mbvdm-root" aria-label="MbDropdownMenu visual matrix">
        <h2 class="mbvdm-title">MbDropdownMenu</h2>

        <div class="mbvdm-grid">
          <MbDropdownMenu header="Header" footer="Footer" :width="260" />
          <MbDropdownMenu header="Header" footer="Footer" :width="260" state="hover" />
          <MbDropdownMenu header="Header" footer="Footer" :width="260" state="focus" selected-id="3" />
        </div>

        <style>
          .mbvdm-root {
            width: 100%;
            min-height: 100%;
            padding: 12px;
            box-sizing: border-box;
            background: var(--mb-stage-bg);
            color: var(--mb-stage-text);
            border: 1px solid var(--mb-stage-border);
            border-radius: 12px;
            font-family: var(--mb-dm-font-family);
            display: grid;
            gap: 10px;
          }

          .mbvdm-title {
            margin: 0;
            font-size: 18px;
            line-height: 24px;
          }

          .mbvdm-grid {
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
    figmaNodeId: '3809:144950',
    viewport: 'desktop',
    theme: 'light',
    state: 'matrix',
    variant: 'all'
  })
};
