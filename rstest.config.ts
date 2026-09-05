import { pluginReact } from '@rsbuild/plugin-react';
import { defineConfig } from '@rstest/core';

export default defineConfig({
  plugins: [pluginReact()],
  setupFiles: ['./test/setup.ts'],
  testEnvironment: 'happy-dom',
});
