import type { StorybookConfig } from 'storybook-react-rsbuild';

const config: StorybookConfig = {
  framework: {
    name: 'storybook-react-rsbuild',
    options: { builder: { rsbuildConfigPath: '.storybook/rsbuild.config.ts' } },
  },
  stories: ['../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@github-ui/storybook-addon-performance-panel'],
  // react-docgen-typescript needs the TypeScript JS API, which TypeScript 7 does not ship.
  typescript: { reactDocgen: 'react-docgen' },
  core: { disableTelemetry: true },
};

export default config;
