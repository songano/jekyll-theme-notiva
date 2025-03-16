import { defineConfig } from 'vite';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'fs';
import yaml from 'js-yaml';
import tailwindcss from '@tailwindcss/vite'
import banner from 'vite-plugin-banner';

/**
 * Load Jekyll config to synchronize PWA settings
 */
function loadJekyllConfig() {
  try {
    const configYml = fs.readFileSync('./_config.yml', 'utf8');
    return yaml.load(configYml);
  } catch (error) {
    console.error('Error loading Jekyll config:', error);
    return {};
  }
}

const jekyllConfig = loadJekyllConfig();
const pwaConfig = jekyllConfig.pwa || { enable: false };

console.log(pwaConfig);

const pkg = JSON.parse(
  fs.readFileSync('./package.json', 'utf8')
);

// Create banner for bundled files
const bannerContent = `/*!
 * ${pkg.name} v${pkg.version}
 * ${pkg.description}
 * (c) ${new Date().getFullYear()} ${pkg.author}
 * Released under the ${pkg.license} License
 */`;

 // Define page-specific entry points
const pageEntries = {
  main: resolve(__dirname, '_app/js/main.ts'),
  // home: resolve(__dirname, '_app/js/pages/home.ts'),
  // post: resolve(__dirname, '_app/js/pages/post.ts'),
  // archive: resolve(__dirname, '_app/js/pages/archive.ts'),
  // search: resolve(__dirname, '_app/js/pages/search.ts'),
};


/**
 * Main Vite configuration
 */
export default defineConfig({
  base: '/',
  build: {
    outDir: 'assets/dist',
    emptyOutDir: true,
    sourcemap: false,
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
        styles: resolve(__dirname, '_app/css/main.css'),
        ...pageEntries,
      },
      output: {
        entryFileNames: 'js/[name].min.js',
        chunkFileNames: 'js/chunks/[name]-[hash].min.js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.originalFileNames?.[0] || '';

          if (/\.(css)$/i.test(name)) {
            return 'css/[name].min.[ext]';
          }
          
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(name)) {
            return 'img/[name].[ext]';
          }
          
          if (/\.(woff2?|eot|ttf|otf)$/i.test(name)) {
            return 'fonts/[name].[ext]';
          }
          
          return '[name].[ext]';
        },
        // // Extract common chunks
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          if (id.includes('_app/js/utils/')) {
            return 'components';
          }
          if (id.includes('_app/js/components/')) {
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
    banner(bannerContent),
    tailwindcss(),
    // PWA plugin
    pwaConfig.enable
      ? VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['**/*'],
          outDir: 'assets/dist',
          manifestFilename: 'manifest.json',
          manifest: pwaConfig.manifest || {
            name: jekyllConfig.title || 'Notiva',
            short_name: jekyllConfig.title || 'Notiva',
            description: jekyllConfig.description || 'A Jekyll theme',
            theme_color: '#252627',
            background_color: '#252627',
            display: 'standalone',
            start_url: '/?utm_source=homescreen',
            icons: [
              {
                src: '/assets/images/icons/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
              },
              {
                src: '/assets/images/icons/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
              },
            ],
          },
          workbox: {
            globPatterns: ['**/*.{js,css,html,png,jpg,svg,woff,woff2}'],
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
            ],
          },
        })
      : [],
  ],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, '_app'),
    },
  },
  server: {
    hmr: false, // Disable HMR as per requirements
  },
});