import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'capacitorKeepAwake',
      formats: ['es', 'cjs', 'iife'],
      fileName: (format) => {
        if (format === 'es') return 'esm/index.js';
        if (format === 'cjs') return 'plugin.cjs.js';
        return 'plugin.js';
      },
    },
    rollupOptions: {
      external: ['@capacitor/core'],
      output: {
        globals: {
          '@capacitor/core': 'capacitorExports',
        },
      },
    },
    sourcemap: true,
  },
});