import { pluginReact } from '@rsbuild/plugin-react';
import { defineConfig } from '@rstest/core';

const shared = {
  plugins: [pluginReact()],
  setupFiles: ['./test/setup.ts'],
};

export default defineConfig({
  projects: [
    {
      ...shared,
      name: 'unit',
      testEnvironment: 'happy-dom',
      include: ['src/**/*.test.{ts,tsx}'],
      exclude: ['**/*.browser.test.tsx'],
    },
    {
      ...shared,
      name: 'browser',
      include: ['src/**/*.browser.test.tsx'],
      browser: { enabled: true, provider: 'playwright', browser: 'chromium', headless: true },
    },
  ],
});
