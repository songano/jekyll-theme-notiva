import { loadEnv } from 'vite';
import { defineConfig } from 'vite';
// import { existsSync, mkdirSync } from 'fs';
import tailwindcss from '@tailwindcss/vite';

// Create output directory if it doesn't exist
// function ensureDirectoryExists(dirPath) {
//   if (!existsSync(dirPath)) {
//     mkdirSync(dirPath, { recursive: true });
//     console.log(`> Directory "${dirPath}" created.`);
//   }
// }

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  console.log(env);

  return {
    plugins: [tailwindcss()],
  };
});
