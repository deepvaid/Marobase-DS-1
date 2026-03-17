import type { Preview } from '@storybook/vue3';
import '../../../packages/marobase-ui/src/tokens/mb-accordion.tokens.css';
import '../../../packages/marobase-ui/src/tokens/mb-alert.tokens.css';
import '../../../packages/marobase-ui/src/tokens/mb-avatar.tokens.css';
import '../../../packages/marobase-ui/src/tokens/mb-badge.tokens.css';
import '../../../packages/marobase-ui/src/tokens/mb-breadcrumbs.tokens.css';
import '../../../packages/marobase-ui/src/tokens/mb-button.tokens.css';
import '../../../packages/marobase-ui/src/tokens/mb-button-group.tokens.css';
import '../../../packages/marobase-ui/src/tokens/mb-chip.tokens.css';
import '../../../packages/marobase-ui/src/tokens/mb-circle-button.tokens.css';
import '../../../packages/marobase-ui/src/tokens/mb-checkbox.tokens.css';
import '../../../packages/marobase-ui/src/tokens/mb-input-field.tokens.css';
import '../../../packages/marobase-ui/src/tokens/mb-input-dropdown.tokens.css';
import '../../../packages/marobase-ui/src/tokens/mb-quantity-input.tokens.css';
import '../../../packages/marobase-ui/src/tokens/mb-radio.tokens.css';
import '../../../packages/marobase-ui/src/tokens/mb-social-button.tokens.css';
import '../../../packages/marobase-ui/src/tokens/mb-split-button.tokens.css';
import '../../../packages/marobase-ui/src/tokens/mb-switch.tokens.css';
import '../../../packages/marobase-ui/src/tokens/mb-text-field.tokens.css';
import '../../../packages/marobase-ui/src/tokens/mb-select.tokens.css';
import '../../../packages/marobase-ui/src/tokens/mb-slider.tokens.css';
import '../../../packages/marobase-ui/src/tokens/mb-multi-select.tokens.css';
import '../../../packages/marobase-ui/src/tokens/mb-combo-box.tokens.css';
import '../../../packages/marobase-ui/src/tokens/mb-search-dropdown.tokens.css';
import '../../../packages/marobase-ui/src/tokens/mb-dropdown-menu.tokens.css';
import '../../../packages/marobase-ui/src/tokens/mb-divider.tokens.css';
import '../../../packages/marobase-ui/src/tokens/mb-text-area.tokens.css';
import '../../../packages/marobase-ui/src/tokens/mb-wysiwyg-editor.tokens.css';
import '../../../packages/marobase-ui/src/tokens/mb-drag-drop-uploader.tokens.css';
import '../../../packages/marobase-ui/src/tokens/mb-drawer.tokens.css';
import '../../../packages/marobase-ui/src/tokens/mb-modal.tokens.css';
import '../../../packages/marobase-ui/src/tokens/mb-pagination.tokens.css';
import '../../../packages/marobase-ui/src/tokens/mb-popover.tokens.css';
import '../../../packages/marobase-ui/src/tokens/mb-section-message.tokens.css';
import '../../../packages/marobase-ui/src/tokens/mb-stepper.tokens.css';
import '../../../packages/marobase-ui/src/tokens/mb-table.tokens.css';
import '../../../packages/marobase-ui/src/tokens/mb-tabs.tokens.css';
import '../../../packages/marobase-ui/src/tokens/mb-timeline.tokens.css';
import '../../../packages/marobase-ui/src/tokens/mb-tooltip.tokens.css';

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global visual theme',
      defaultValue: 'light',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' }
        ]
      }
    }
  },
  parameters: {
    controls: {
      expanded: true
    },
    backgrounds: {
      disable: true
    }
  },
  decorators: [
    (story, context) => ({
      components: { story },
      setup() {
        const theme = String(context.globals.theme ?? 'light');
        const isVisualParity = Boolean((context.parameters as { visualParity?: boolean }).visualParity);

        if (typeof document !== 'undefined') {
          const isDark = theme === 'dark';
          const root = document.documentElement;
          const body = document.body;

          root.dataset.theme = theme;
          root.classList.toggle('theme-dark', isDark);
          root.classList.toggle('theme-light', !isDark);
          root.classList.toggle('v-theme--dark', isDark);
          root.classList.toggle('v-theme--light', !isDark);

          if (body) {
            body.classList.toggle('theme-dark', isDark);
            body.classList.toggle('theme-light', !isDark);
            body.classList.toggle('v-theme--dark', isDark);
            body.classList.toggle('v-theme--light', !isDark);
          }
        }

        return { theme, isVisualParity };
      },
      template: `
        <div
          data-visual-root
          class="mb-preview-root"
          :class="theme === 'dark' ? 'mb-preview-root--dark' : 'mb-preview-root--light'"
          :data-theme="theme"
        >
          <div v-if="isVisualParity" data-visual-target="stage" class="mb-visual-stage mb-visual-stage--parity">
            <div class="mb-visual-stage__content">
              <story />
            </div>
          </div>
          <div v-else class="mb-interactive-shell">
            <div class="v-application mb-v-app" :class="theme === 'dark' ? 'v-theme--dark' : 'v-theme--light'" data-app="true">
              <div class="v-application__wrap mb-v-app__wrap">
                <story />
              </div>
            </div>
          </div>
        </div>
      `
    })
  ]
};

export default preview;

if (typeof document !== 'undefined' && !document.getElementById('mb-visual-stage-style')) {
  const style = document.createElement('style');
  style.id = 'mb-visual-stage-style';
  style.textContent = `
    :root {
      --mb-stage-bg: #f2f4f8;
      --mb-stage-border: #d0d5dd;
      --mb-stage-text: #1f2630;
    }

    html[data-theme='dark'],
    html.theme-dark,
    html.v-theme--dark {
      --mb-stage-bg: #0f141c;
      --mb-stage-border: #2a3342;
      --mb-stage-text: #e5eaf2;
    }

    .mb-preview-root {
      min-height: 100vh;
      color: var(--mb-stage-text);
    }

    .mb-interactive-shell {
      min-height: 100vh;
      width: 100%;
    }

    .mb-v-app {
      min-height: 100vh;
      width: 100%;
      color: var(--mb-stage-text);
      background: transparent;
    }

    .mb-v-app__wrap {
      min-height: 100vh;
      width: 100%;
    }

    .mb-visual-stage {
      width: 960px;
      height: 540px;
      padding: 24px;
      box-sizing: border-box;
      overflow: hidden;
      display: grid;
      place-items: center;
      margin: 0 auto;
      background: var(--mb-stage-bg);
      border: 1px solid var(--mb-stage-border);
      color: var(--mb-stage-text);
    }

    .mb-visual-stage__content {
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      overflow: hidden;
      display: grid;
      place-items: center;
      box-sizing: border-box;
      contain: strict;
    }

    .mb-visual-stage--parity,
    .mb-visual-stage--parity *,
    .mb-visual-stage--parity *::before,
    .mb-visual-stage--parity *::after {
      animation: none !important;
      transition: none !important;
      caret-color: transparent !important;
    }
  `;
  document.head.appendChild(style);
}
