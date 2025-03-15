import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  const isProd = !isDev;

  return {
    build: {
      emptyOutDir: true,
      outDir: 'assets/dist',
      cssCodeSplit: true,
      minify: isProd,
      sourcemap: isProd,
      terserOptions: isProd
        ? {
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.log', 'console.debug', 'console.info'],
            },
          }
        : undefined,
      // Configure rollup
      rollupOptions: {
        input: {
          styles: resolve(__dirname, '_styles/main.css'),
        },
        output: {
          assetFileNames: (assetInfo) => {
            if (/\.(css)$/i.test(assetInfo.name)) {
              return 'css/[name][extname]';
            }
            return 'assets/[name][extname]';
          },
        },
      },
      // Enable lib mode for better tree-shaking
      lib: {
        entry: resolve(__dirname, 'assets/js/src/main.ts'),
        formats: ['es'],
      },

      // Remove console logs in production
      esbuild: {
        drop: isProd ? ['console', 'debugger'] : [],
      },
    },
    plugins: [tailwindcss()],

    // Development server options
    server: {
      // Disable HMR as it's not needed with Jekyll's livereload
      hmr: false,
    },
  };
});
