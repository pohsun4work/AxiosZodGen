import { defineConfig } from 'tsup';

export default defineConfig(async () => ({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  clean: true,
  platform: 'neutral',
  dts: true,
  splitting: true,
  minify: true,
  treeshake: true,
}));
