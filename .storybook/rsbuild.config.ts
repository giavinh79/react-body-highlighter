import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

// storybook-react-rsbuild takes its rsbuild plugins from this file; the library itself is built by rslib.
export default defineConfig({
  plugins: [pluginReact()],
});
