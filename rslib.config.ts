import { pluginReact } from '@rsbuild/plugin-react';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import { defineConfig } from '@rslib/core';

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: { index: './src/index.ts' },
  },
  lib: [
    { format: 'esm', syntax: 'es2020', dts: { bundle: true, autoExtension: true } },
    { format: 'cjs', syntax: 'es2020', dts: { bundle: true, autoExtension: true } },
  ],
  output: {
    target: 'web',
    sourceMap: true,
  },
  tools: {
    rspack: {
      plugins: process.env.RSDOCTOR
        ? [
            new RsdoctorRspackPlugin(
              process.env.CI
                ? {
                    disableClientServer: true,
                    output: { mode: 'brief', reportDir: '.rsdoctor', options: { type: ['json'] } },
                  }
                : { output: { reportDir: '.rsdoctor' } }
            ),
          ]
        : [],
    },
  },
});
