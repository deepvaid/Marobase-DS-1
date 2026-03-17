import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { test, expect } from '@playwright/test';
import { caseFileName, loadManifest } from '../../scripts/visual/manifest';

const rootDir = path.resolve(process.cwd());
const captureDir = path.join(rootDir, 'artifacts/storybook-captures');
const LIGHT_STAGE_BG = '#f2f4f8';
const DARK_STAGE_BG = '#0f141c';
const LIGHT_STAGE_BORDER = '#d0d5dd';
const DARK_STAGE_BORDER = '#2a3342';
const LIGHT_STAGE_TEXT = '#1f2630';
const DARK_STAGE_TEXT = '#e5eaf2';

const manifestPromise = loadManifest(rootDir);

test.beforeAll(async () => {
  await mkdir(captureDir, { recursive: true });
});

test.describe('Visual Capture - Storybook', () => {
  test('manifest has at least one case', async () => {
    const manifest = await manifestPromise;
    expect(manifest.cases.length).toBeGreaterThan(0);
  });

  test.describe.configure({ mode: 'serial' });

  test('capture all manifest cases', async ({ page, baseURL }) => {
    const manifest = await manifestPromise;
    let debugLogged = false;

    for (const visualCase of manifest.cases) {
      const viewport = manifest.viewports[visualCase.viewport];
      await page.setViewportSize(viewport);

      const globals = encodeURIComponent(`theme:${visualCase.theme}`);
      const targetUrl = `${baseURL ?? manifest.storyBaseUrl}/iframe.html?id=${visualCase.storyId}&viewMode=story&globals=${globals}`;
      await page.goto(targetUrl, { waitUntil: 'networkidle' });

      await page.addStyleTag({
        content: `
          html[data-visual-test='true'],
          html[data-visual-test='true'] body,
          html[data-visual-test='true'] * {
            scroll-behavior: auto !important;
          }

          html[data-visual-test='true'] *,
          html[data-visual-test='true'] *::before,
          html[data-visual-test='true'] *::after {
            animation-duration: 0s !important;
            animation-delay: 0s !important;
            animation: none !important;
            transition-duration: 0s !important;
            transition-delay: 0s !important;
            transition: none !important;
            caret-color: transparent !important;
          }

          html[data-visual-test='true'] [data-visual-target='stage'] {
            background: var(--mb-stage-bg) !important;
            border-color: var(--mb-stage-border) !important;
            color: var(--mb-stage-text) !important;
          }
        `
      });

      await page.evaluate(
        async ({ theme, colors }) => {
          const isDark = theme === 'dark';
          const root = document.documentElement;
          const body = document.body;

          root.dataset.theme = theme;
          root.dataset.visualTest = 'true';
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

          root.style.setProperty('--mb-stage-bg', isDark ? colors.darkBg : colors.lightBg);
          root.style.setProperty('--mb-stage-border', isDark ? colors.darkBorder : colors.lightBorder);
          root.style.setProperty('--mb-stage-text', isDark ? colors.darkText : colors.lightText);

          // Wait for CSS variable propagation and layout stabilization.
          await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
          await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        },
        {
          theme: visualCase.theme,
          colors: {
            lightBg: LIGHT_STAGE_BG,
            darkBg: DARK_STAGE_BG,
            lightBorder: LIGHT_STAGE_BORDER,
            darkBorder: DARK_STAGE_BORDER,
            lightText: LIGHT_STAGE_TEXT,
            darkText: DARK_STAGE_TEXT
          }
        }
      );

      await page.evaluate(async () => {
        // @ts-expect-error fonts is available in the browser context
        if (document.fonts?.ready) await document.fonts.ready;
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      });

      const stageTarget = page.locator('[data-visual-target="stage"]').first();
      const selector = visualCase.captureSelector ?? '[data-visual-target], [data-visual-root], #storybook-root';
      const fallbackTarget = page.locator(selector).first();
      const target = (await stageTarget.count()) > 0 ? stageTarget : fallbackTarget;
      await expect(target).toBeVisible();

      if (!debugLogged && visualCase.theme === 'dark') {
        const debugSnapshot = await page.evaluate(() => {
          const rootStyles = getComputedStyle(document.documentElement);
          const stage = document.querySelector('[data-visual-target="stage"]') as HTMLElement | null;
          const stageStyles = stage ? getComputedStyle(stage) : null;

          return {
            theme: document.documentElement.dataset.theme ?? 'unset',
            rootClassName: document.documentElement.className,
            stageBackground: stageStyles?.backgroundColor ?? 'missing',
            stageText: stageStyles?.color ?? 'missing',
            resolvedStageBgVar: rootStyles.getPropertyValue('--mb-stage-bg').trim(),
            resolvedStageTextVar: rootStyles.getPropertyValue('--mb-stage-text').trim()
          };
        });

        console.log(
          `[visual:test:debug] story=${visualCase.storyId} theme=${debugSnapshot.theme} ` +
          `bgVar=${debugSnapshot.resolvedStageBgVar} textVar=${debugSnapshot.resolvedStageTextVar} ` +
          `stageBg=${debugSnapshot.stageBackground} stageText=${debugSnapshot.stageText} ` +
          `rootClass="${debugSnapshot.rootClassName}"`
        );
        debugLogged = true;
      }

      await target.screenshot({
        path: path.join(captureDir, caseFileName(visualCase)),
        animations: 'disabled'
      });
    }
  });
});
