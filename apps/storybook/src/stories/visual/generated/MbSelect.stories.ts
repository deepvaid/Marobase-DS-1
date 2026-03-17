import type { Meta, StoryObj } from '@storybook/vue3';
import { visualParameters } from '../../../visual-meta';

type SelectVariant = 'outlined' | 'filled';
type SelectState = 'default' | 'hover' | 'focus' | 'open' | 'selected' | 'error' | 'disabled';

type Args = Record<string, never>;

const variants: Array<{ id: SelectVariant; label: string }> = [
  { id: 'outlined', label: 'Outlined' },
  { id: 'filled', label: 'Filled' }
];

const states: Array<{ id: SelectState; label: string }> = [
  { id: 'default', label: 'Default' },
  { id: 'hover', label: 'Hover' },
  { id: 'focus', label: 'Focus' },
  { id: 'open', label: 'Open' },
  { id: 'selected', label: 'Selected' },
  { id: 'error', label: 'Error' },
  { id: 'disabled', label: 'Disabled' }
];

function valueForState(state: SelectState) {
  if (state === 'selected') return 'United States';
  if (state === 'error') return 'Select a country';
  if (state === 'disabled') return 'Japan';
  return 'Choose country';
}

function helperForState(state: SelectState) {
  if (state === 'error') return 'A country is required to continue.';
  if (state === 'open') return 'Use arrow keys to move through options.';
  return 'Select your current country of residence.';
}

const options = ['United States', 'Canada', 'Japan', 'Germany'];

const meta = {
  title: 'Visual/MbSelect',
  tags: ['autodocs'],
  render: () => ({
    setup() {
      return {
        variants,
        states,
        options,
        valueForState,
        helperForState
      };
    },
    template: `
      <section data-visual-target class="mbsl-root" aria-label="MbSelect visual matrix">
        <header class="mbsl-header">
          <h2 class="mbsl-title">MbSelect</h2>
          <p class="mbsl-subtitle">State matrix with closed/open menus and validation states</p>
        </header>

        <div class="mbsl-grid">
          <div class="mbsl-column mbsl-column-state">State</div>
          <div v-for="variant in variants" :key="variant.id" class="mbsl-column">
            {{ variant.label }}
          </div>

          <template v-for="state in states" :key="state.id">
            <div class="mbsl-row-label">{{ state.label }}</div>

            <div v-for="variant in variants" :key="state.id + '-' + variant.id" class="mbsl-cell">
              <div
                class="mbsl-field"
                :data-variant="variant.id"
                :data-state="state.id"
                :aria-invalid="state.id === 'error' ? 'true' : 'false'"
                :aria-expanded="state.id === 'open' ? 'true' : 'false'"
                :aria-disabled="state.id === 'disabled' ? 'true' : 'false'"
              >
                <label class="mbsl-label">Country</label>
                <div class="mbsl-control" role="combobox" aria-haspopup="listbox">
                  <span class="mbsl-value">{{ valueForState(state.id) }}</span>
                  <span class="mbsl-chevron" aria-hidden="true">⌄</span>
                </div>

                <ul v-if="state.id === 'open'" class="mbsl-menu" role="listbox">
                  <li
                    v-for="option in options"
                    :key="option"
                    :data-active="option === 'Canada'"
                    class="mbsl-option"
                  >
                    {{ option }}
                  </li>
                </ul>

                <p class="mbsl-helper">{{ helperForState(state.id) }}</p>
              </div>
            </div>
          </template>
        </div>

        <style>
          :root {
            --mbsl-bg: #f2f4f8;
            --mbsl-surface: #ffffff;
            --mbsl-text: #101828;
            --mbsl-muted: #667085;
            --mbsl-border: #d0d5dd;
            --mbsl-hover: #98a2b3;
            --mbsl-focus: #3b82f6;
            --mbsl-filled: #f8fafc;
            --mbsl-error: #d92d20;
            --mbsl-menu-shadow: 0 8px 24px rgba(16, 24, 40, 0.12);
          }

          html[data-theme='dark'] {
            --mbsl-bg: #0f141c;
            --mbsl-surface: #151b24;
            --mbsl-text: #e5eaf2;
            --mbsl-muted: #9aa4b2;
            --mbsl-border: #2a3342;
            --mbsl-hover: #4b5a70;
            --mbsl-focus: #89a8ff;
            --mbsl-filled: #1a2230;
            --mbsl-error: #f97066;
            --mbsl-menu-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
          }

          .mbsl-root {
            width: 100%;
            min-height: 840px;
            background: var(--mbsl-bg);
            border: 1px solid var(--mbsl-border);
            border-radius: 16px;
            padding: 24px;
            font-family: Roboto, 'Noto Sans', 'Segoe UI', sans-serif;
            color: var(--mbsl-text);
            box-sizing: border-box;
          }

          .mbsl-header {
            margin-bottom: 18px;
          }

          .mbsl-title {
            margin: 0;
            font-size: 20px;
            line-height: 28px;
          }

          .mbsl-subtitle {
            margin: 6px 0 0;
            font-size: 13px;
            line-height: 20px;
            color: var(--mbsl-muted);
          }

          .mbsl-grid {
            display: grid;
            grid-template-columns: 140px repeat(2, minmax(280px, 1fr));
            border: 1px solid var(--mbsl-border);
            border-radius: 12px;
            overflow: hidden;
            background: var(--mbsl-surface);
          }

          .mbsl-column,
          .mbsl-row-label,
          .mbsl-cell {
            box-sizing: border-box;
            border-right: 1px solid var(--mbsl-border);
            border-bottom: 1px solid var(--mbsl-border);
          }

          .mbsl-column:nth-child(3n),
          .mbsl-cell:nth-child(3n) {
            border-right: none;
          }

          .mbsl-column {
            padding: 10px 12px;
            font-size: 12px;
            line-height: 16px;
            font-weight: 600;
            color: var(--mbsl-muted);
            text-transform: uppercase;
            letter-spacing: 0.06em;
            background: color-mix(in srgb, var(--mbsl-surface) 93%, var(--mbsl-text));
          }

          .mbsl-row-label {
            padding: 20px 12px;
            font-size: 12px;
            line-height: 18px;
            font-weight: 500;
            color: var(--mbsl-muted);
            text-transform: uppercase;
            letter-spacing: 0.04em;
            background: color-mix(in srgb, var(--mbsl-surface) 95%, var(--mbsl-text));
          }

          .mbsl-cell {
            padding: 16px;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            background: var(--mbsl-surface);
          }

          .mbsl-field {
            width: 260px;
            position: relative;
          }

          .mbsl-label {
            display: block;
            margin: 0 0 6px;
            font-size: 12px;
            line-height: 16px;
            color: var(--mbsl-muted);
          }

          .mbsl-control {
            height: 44px;
            border-radius: 12px;
            border: 1px solid var(--mbsl-border);
            background: var(--mbsl-surface);
            padding: 0 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-sizing: border-box;
          }

          .mbsl-value {
            font-size: 14px;
            line-height: 20px;
            color: var(--mbsl-text);
          }

          .mbsl-chevron {
            color: var(--mbsl-muted);
            font-size: 14px;
            transform: translateY(-1px);
          }

          .mbsl-helper {
            margin: 6px 0 0;
            font-size: 12px;
            line-height: 16px;
            color: var(--mbsl-muted);
          }

          .mbsl-field[data-variant='filled'] .mbsl-control {
            background: var(--mbsl-filled);
            border-color: transparent;
          }

          .mbsl-field[data-state='hover'] .mbsl-control {
            border-color: var(--mbsl-hover);
          }

          .mbsl-field[data-state='focus'] .mbsl-control,
          .mbsl-field[data-state='open'] .mbsl-control {
            border-color: var(--mbsl-focus);
            box-shadow: 0 0 0 3px color-mix(in srgb, var(--mbsl-focus) 30%, transparent);
          }

          .mbsl-field[data-state='selected'] .mbsl-value {
            font-weight: 500;
          }

          .mbsl-field[data-state='error'] .mbsl-control {
            border-color: var(--mbsl-error);
          }

          .mbsl-field[data-state='error'] .mbsl-label,
          .mbsl-field[data-state='error'] .mbsl-helper {
            color: var(--mbsl-error);
          }

          .mbsl-field[data-state='disabled'] .mbsl-control,
          .mbsl-field[data-state='disabled'] .mbsl-label,
          .mbsl-field[data-state='disabled'] .mbsl-value,
          .mbsl-field[data-state='disabled'] .mbsl-helper,
          .mbsl-field[data-state='disabled'] .mbsl-chevron {
            opacity: 0.45;
          }

          .mbsl-menu {
            position: absolute;
            top: 54px;
            left: 0;
            width: 100%;
            margin: 0;
            padding: 6px;
            border-radius: 12px;
            border: 1px solid var(--mbsl-border);
            background: var(--mbsl-surface);
            box-shadow: var(--mbsl-menu-shadow);
            list-style: none;
            box-sizing: border-box;
            z-index: 1;
          }

          .mbsl-option {
            height: 32px;
            border-radius: 8px;
            padding: 0 10px;
            display: flex;
            align-items: center;
            font-size: 13px;
            line-height: 18px;
            color: var(--mbsl-text);
          }

          .mbsl-option[data-active='true'] {
            background: color-mix(in srgb, var(--mbsl-focus) 14%, var(--mbsl-surface));
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
    figmaNodeId: '981:23648',
    viewport: 'desktop',
    theme: 'light',
    state: 'matrix',
    variant: 'all'
  })
};
