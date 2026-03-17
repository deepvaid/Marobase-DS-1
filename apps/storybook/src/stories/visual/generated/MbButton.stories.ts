import type { Meta, StoryObj } from '@storybook/vue3';
import MbButton from '../../../../../../packages/marobase-ui/src/components/MbButton.vue';
import type {
  MbButtonIconMode,
  MbButtonSize,
  MbButtonState,
  MbButtonStyleType
} from '../../../../../../packages/marobase-ui/src/components/MbButton.types';
import { visualParameters } from '../../../visual-meta';

type Args = Record<string, never>;

const styles: Array<{ id: MbButtonStyleType; label: string }> = [
  { id: 'filled', label: 'Filled' },
  { id: 'outline', label: 'Outline' },
  { id: 'tinted', label: 'Tinted' },
  { id: 'plain', label: 'Plain' }
];

const states: Array<{ id: MbButtonState; label: string }> = [
  { id: 'default', label: 'Default' },
  { id: 'hover', label: 'Hover' },
  { id: 'active', label: 'Active' },
  { id: 'focus', label: 'Focus' },
  { id: 'disabled', label: 'Disabled' },
  { id: 'loading', label: 'Loading' }
];

const sizes: Array<{ id: MbButtonSize; label: string }> = [
  { id: 'lg', label: 'LG' },
  { id: 'md', label: 'MD' },
  { id: 'sm', label: 'SM' }
];

const iconModes: Array<{ id: MbButtonIconMode; label: string }> = [
  { id: 'with-label', label: 'With Label' },
  { id: 'icon-only', label: 'Icon Only' }
];

const meta = {
  title: 'Visual/MbButton',
  tags: ['autodocs'],
  components: { MbButton },
  render: () => ({
    components: { MbButton },
    setup() {
      return {
        styles,
        states,
        sizes,
        iconModes
      };
    },
    template: `
      <section data-visual-target class="mbvb-root" aria-label="MbButton visual matrix">
        <header class="mbvb-header">
          <h2 class="mbvb-title">MbButton</h2>
          <p class="mbvb-subtitle">Primary color - full style/state/size/icon-mode matrix</p>
        </header>

        <div class="mbvb-groups">
          <article v-for="mode in iconModes" :key="mode.id" class="mbvb-group">
            <h3 class="mbvb-group-title">{{ mode.label }}</h3>

            <div v-for="size in sizes" :key="size.id" class="mbvb-size-block">
              <h4 class="mbvb-size-title">Size {{ size.label }}</h4>

              <div class="mbvb-grid">
                <div class="mbvb-cell mbvb-cell--header">State</div>
                <div v-for="style in styles" :key="'head-' + style.id" class="mbvb-cell mbvb-cell--header">{{ style.label }}</div>

                <template v-for="state in states" :key="size.id + '-' + state.id">
                  <div class="mbvb-cell mbvb-cell--state">{{ state.label }}</div>

                  <div
                    v-for="style in styles"
                    :key="size.id + '-' + state.id + '-' + style.id + '-' + mode.id"
                    class="mbvb-cell"
                  >
                    <MbButton
                      :style-type="style.id"
                      :size="size.id"
                      :state="state.id"
                      :icon-mode="mode.id"
                      label="Button"
                      leading-icon="mdi-rhombus-outline"
                      trailing-icon="mdi-rhombus-outline"
                      aria-label="Button"
                    />
                  </div>
                </template>
              </div>
            </div>
          </article>
        </div>

        <style>
          .mbvb-root {
            box-sizing: border-box;
            width: 100%;
            min-height: 100%;
            padding: 16px;
            background: var(--mb-stage-bg);
            color: var(--mb-stage-text);
            border-radius: 12px;
            border: 1px solid var(--mb-stage-border);
            font-family: var(--mb-btn-font-family);
          }

          .mbvb-header {
            margin-bottom: 16px;
          }

          .mbvb-title {
            margin: 0;
            font-size: 20px;
            line-height: 28px;
          }

          .mbvb-subtitle {
            margin: 4px 0 0;
            font-size: 13px;
            line-height: 18px;
            opacity: 0.85;
          }

          .mbvb-groups {
            display: grid;
            gap: 20px;
          }

          .mbvb-group {
            display: grid;
            gap: 12px;
          }

          .mbvb-group-title {
            margin: 0;
            font-size: 14px;
            line-height: 20px;
            text-transform: uppercase;
            letter-spacing: 0.04em;
          }

          .mbvb-size-block {
            display: grid;
            gap: 8px;
          }

          .mbvb-size-title {
            margin: 0;
            font-size: 12px;
            line-height: 16px;
            opacity: 0.8;
            text-transform: uppercase;
            letter-spacing: 0.06em;
          }

          .mbvb-grid {
            display: grid;
            grid-template-columns: 100px repeat(4, minmax(128px, 1fr));
          }

          .mbvb-cell {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 56px;
            padding: 8px;
            box-sizing: border-box;
            border-bottom: 1px solid var(--mb-stage-border);
            border-right: 1px solid var(--mb-stage-border);
            background: color-mix(in srgb, var(--mb-stage-bg) 90%, var(--mb-stage-text));
          }

          .mbvb-cell:nth-child(5n) {
            border-right: none;
          }

          .mbvb-cell--header {
            min-height: 40px;
            font-size: 11px;
            line-height: 16px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 600;
          }

          .mbvb-cell--state {
            justify-content: flex-start;
            font-size: 12px;
            line-height: 16px;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            font-weight: 500;
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
    figmaNodeId: '1902:151171',
    viewport: 'desktop',
    theme: 'light',
    state: 'matrix',
    variant: 'primary-full'
  })
};
