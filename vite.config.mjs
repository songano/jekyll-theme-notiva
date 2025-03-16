import { defineConfig } from 'vite';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'fs';
import yaml from 'js-yaml';
import tailwindcss from '@tailwindcss/vite'

/**
 * Load Jekyll config to synchronize PWA settings
 */
function loadJekyllConfig() {
  try {
    const configYml = fs.readFileSync('./_config.yml', 'utf8');
    return yaml.load(configYml);
  } catch (e) {
    console.error('Error loading _config.yml:', e);
    return {};
  }
}

// Load Jekyll configuration
const jekyllConfig = loadJekyllConfig();
const pwaConfig = jekyllConfig?.notiva?.pwa || {};

/**
 * Main Vite configuration
 */
export default defineConfig({
  // Set root to the _app directory
  root: '_app',

  // Configure build settings
  build: {
    // Output to assets/dist directory
    outDir: '../assets/dist',
    emptyOutDir: true,
    
    // Enable source maps for production
    sourcemap: false,
    
    // Optimize build
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: process.env.NODE_ENV === 'production',
      },
    },
    
    // Configure rollup options for code splitting
    rollupOptions: {
      input: {
        main: resolve(__dirname, '_app/js/main.ts'),
        styles: resolve(__dirname, '_app/css/main.css'),
        // home: resolve(__dirname, '_app/js/pages/home.ts'),
        // post: resolve(__dirname, '_app/js/pages/post.ts'),
        // archive: resolve(__dirname, '_app/js/pages/archive.ts'),
        // search: resolve(__dirname, '_app/js/pages/search.ts'),
      },
      output: {
        entryFileNames: 'js/[name].min.js',
        chunkFileNames: 'js/chunks/[name]-[hash].min.js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          
          if (/\.(css)$/i.test(assetInfo.name)) {
            return 'css/[name].min.[ext]';
          }
          
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.name)) {
            return 'img/[name].[ext]';
          }
          
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return 'fonts/[name].[ext]';
          }
          
          return '[name].[ext]';
        },
        // // Extract common chunks
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          
          if (id.includes('components/')) {
            return 'components';
          }
          
          if (id.includes('utils/')) {
            return 'utils';
          }
        },
      },
    },
  },
  
  // CSS processing
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      // Add any preprocessor options if needed
    },
  },
  
  // PWA plugin configuration based on Jekyll config
  plugins: [
    tailwindcss(),
    // PWA plugin
    pwaConfig.enabled && VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      outDir: '../assets/dist',
      manifestFilename: 'manifest.json',
      manifest: {
        name: pwaConfig.app_name || 'Notiva',
        short_name: pwaConfig.app_name || 'Notiva',
        description: jekyllConfig.description || 'A Jekyll theme for developers',
        theme_color: pwaConfig.theme_color || '#ffffff',
        background_color: pwaConfig.background_color || '#ffffff',
        display: pwaConfig.display || 'standalone',
        icons: [
          {
            src: '/assets/img/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/assets/img/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/assets/img/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: {
                maxEntries: 5,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          {
            urlPattern: /\.(?:js|css)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
            },
          },
        ],
      },
    }),
  ].filter(Boolean),
  
  // Resolve paths
  resolve: {
    alias: {
      '@': resolve(__dirname, '_app'),
    },
  },
  
  // Server options
  server: {
    hmr: false, // Disable HMR as per requirements
  },
});