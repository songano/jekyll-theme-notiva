// vite.config.mjs
import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import tailwindcss from '@tailwindcss/vite';
import banner from 'vite-plugin-banner';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * Load Jekyll configuration from _config.yml
 * @returns {Object} Jekyll configuration
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

// Load Jekyll config and package.json
const jekyllConfig = loadJekyllConfig();
const pwaConfig = jekyllConfig.pwa || { enable: false };
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

// Create banner for bundled files
const bannerContent = `/*!
 * ${pkg.name} v${pkg.version}
 * ${pkg.description}
 * (c) ${new Date().getFullYear()} ${pkg.author}
 * Released under the ${pkg.license} License
 */`;

/**
 * Get dynamic page entries from _app/js/pages
 * @returns {Object} Entry points for page-specific scripts
 */
const getPageEntries = () => {
  const pagesDir = resolve(__dirname, '_app/js/pages');
  const entries = {};
  
  if (fs.existsSync(pagesDir)) {
    fs.readdirSync(pagesDir).forEach(file => {
      if (file.endsWith('.ts') || file.endsWith('.js')) {
        const name = file.replace(/\.(ts|js)$/, '');
        entries[name] = resolve(pagesDir, file);
      }
    });
  }
  
  return entries;
};

// Configuration
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  console.log(isProd);
  const pageEntries = getPageEntries();
  
  return {
    base: '/',
    build: {
      outDir: 'assets/dist',
      emptyOutDir: true,
      minify: 'terser',
      terserOptions: isProd ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      } : undefined,
      
      // Configure rollup options for code splitting
      rollupOptions: {
        input: {
          main: resolve(__dirname, '_app/scripts/main.ts'),
          styles: resolve(__dirname, '_app/styles/main.css'),
          ...pageEntries,
        },
        output: {
          entryFileNames: 'js/[name].min.js',
          chunkFileNames: 'js/chunks/[name]-[hash].min.js',
          assetFileNames: (assetInfo) => {
            const name = assetInfo.name || '';
            
            if (/\.css$/i.test(name)) {
              return 'css/[name].min.[ext]';
            }
            
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(name)) {
              return 'img/[name].[ext]';
            }
            
            if (/\.(woff2?|eot|ttf|otf)$/i.test(name)) {
              return 'fonts/[name].[ext]';
            }
            
            return 'assets/[name].[ext]';
          },
          // Extract common chunks
          manualChunks: (id) => {
            if (id.includes('node_modules/firebase')) {
              return 'vendor/firebase';
            }
            if (id.includes('node_modules')) {
              return 'vendor';
            }
            if (id.includes('_app/js/utils/')) {
              return 'utils';
            }
            if (id.includes('_app/js/components/')) {
              return 'components';
            }
          },
        },
      },
    },
    
    // CSS processing
    css: {
      devSourcemap: true,
    },
    
    // Plugins
    plugins: [
      // Add Tailwind CSS plugin
      tailwindcss(),
      
      // Add banner plugin
      banner(bannerContent),
      
      // PWA plugin if enabled in _config.yml
      ...(pwaConfig.enable ? [
        VitePWA({
          registerType: 'autoUpdate',
          outDir: 'assets/dist',
          includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
          manifest: pwaConfig.manifest,
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
      ] : []),
    ],
    
    resolve: {
      alias: {
        '@': resolve(__dirname, '_app'),
      },
    },
    server: {
      hmr: false, // Disable HMR as per requirements
    },
  };
});