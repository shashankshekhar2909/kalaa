import { defineConfig } from 'tsup';
export default defineConfig({ entry: ['src/index.ts'], format: ['esm'], external: ['react', 'react-dom', '@base-ui/react'], banner: { js: '"use client";' }, sourcemap: true, clean: true });
