import type { Meta, StoryObj } from '@storybook/vue3';
import MbSlider from '../../../../../../packages/marobase-ui/src/components/MbSlider.vue';
import { visualParameters } from '../../../visual-meta';

type Args = Record<string, never>;

const meta = {
  title: 'Visual/MbSlider',
  tags: ['autodocs'],
  render: () => ({
    components: { MbSlider },
    template: `
      <section data-visual-target class="mbvsl-root" aria-label="MbSlider visual matrix">
        <h2 class="mbvsl-title">MbSlider</h2>

        <div class="mbvsl-grid">
          <div class="mbvsl-card">
            <h3 class="mbvsl-card-title">Single</h3>
            <MbSlider label="Label" :model-value="0" />
            <MbSlider label="Label" :model-value="25" />
            <MbSlider label="Label" :model-value="50" />
            <MbSlider label="Label" :model-value="75" />
            <MbSlider label="Label" :model-value="100" />
          </div>

          <div class="mbvsl-card">
            <h3 class="mbvsl-card-title">Range</h3>
            <MbSlider label="Label" :range-start="0" :model-value="25" />
            <MbSlider label="Label" :range-start="25" :model-value="50" />
            <MbSlider label="Label" :range-start="50" :model-value="75" />
            <MbSlider label="Label" :range-start="75" :model-value="100" />
          </div>

          <div class="mbvsl-card">
            <h3 class="mbvsl-card-title">Disabled</h3>
            <MbSlider label="Label" :model-value="50" state="disabled" :disabled="true" />
            <MbSlider label="Price range" :range-start="30" :model-value="70" state="disabled" :disabled="true" />
          </div>
        </div>

        <style>
          .mbvsl-root {
            width: 100%;
            min-height: 100%;
            padding: 12px;
            box-sizing: border-box;
            background: var(--mb-stage-bg);
            color: var(--mb-stage-text);
            border: 1px solid var(--mb-stage-border);
            border-radius: 12px;
            font-family: var(--mb-sr-font-family);
            display: grid;
            gap: 10px;
          }

          .mbvsl-title {
            margin: 0;
            font-size: 18px;
            line-height: 24px;
          }

          .mbvsl-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 10px;
          }

          .mbvsl-card {
            border: 1px solid var(--mb-stage-border);
            border-radius: 8px;
            background: color-mix(in srgb, var(--mb-stage-bg) 92%, var(--mb-stage-text));
            padding: 8px;
            display: grid;
            gap: 10px;
          }

          .mbvsl-card-title {
            margin: 0;
            font-size: 11px;
            line-height: 16px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 600;
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
    figmaNodeId: '981:23646',
    viewport: 'desktop',
    theme: 'light',
    state: 'matrix',
    variant: 'all'
  })
};
