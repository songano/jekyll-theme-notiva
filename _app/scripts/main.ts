/**
 * Main entry point for the Notiva theme
 * This file loads all the necessary components and initializes the theme
 */
// import { initTheme } from './utils/theme';
// import { initSearch } from './components/search';
// import { initSidebar } from './components/sidebar';
// import { initScrollProgress } from './components/scroll';
// import { initCodeBlocks } from './components/codeblock';
// import { initToc } from './components/toc';
// import { initFirebase } from './utils/firebase';

// DOM ready handler
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');

  if (!themeToggle) return;

  themeToggle.addEventListener('click', () => {
    console.log('클릭됨');

    // 클릭할 때마다 현재 테마 값을 다시 가져오기
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
  });
});
