import type { StorybookConfig } from '@storybook/vue3-vite'
import vuetify from 'vite-plugin-vuetify'
import { fileURLToPath } from 'node:url'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-themes',
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  viteFinal: async (config) => {
    const srcDir = fileURLToPath(new URL('../src', import.meta.url))

    config.plugins?.push(
      vuetify({ autoImport: true })
    )
    // Ensure @ alias works in Storybook
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': srcDir,
    }
    // Mirror main vite.config.ts SCSS preprocessor options.
    // Use absolute path so Sass resolves it without needing the @ alias.
    config.css = config.css || {}
    config.css.preprocessorOptions = config.css.preprocessorOptions || {}
    config.css.preprocessorOptions.scss = {
      ...config.css.preprocessorOptions.scss,
      additionalData: `@use "${srcDir}/styles/tokens" as *;\n`,
    }
    return config
  },
  docs: { autodocs: 'tag' },
}

export default config
