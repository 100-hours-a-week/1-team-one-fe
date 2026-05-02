import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/*.tsx', 'src/lib/*.ts'],
  format: ['esm'],
  dts: false,
  sourcemap: true,
  clean: true,
  splitting: false,
  target: 'es2022',
});
