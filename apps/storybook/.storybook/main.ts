import type { StorybookConfig } from '@storybook/vue3-vite';
import { mergeConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {}
  },
  docs: {
    autodocs: 'tag'
  },
  async viteFinal(existingConfig) {
    return mergeConfig(existingConfig, {
      plugins: [vue()],
      server: {
        fs: {
          allow: ['..', '../..', '../../..']
        }
      }
    });
  }
};

export default config;
