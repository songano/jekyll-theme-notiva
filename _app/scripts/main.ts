/**
 * Main entry point for Notiva theme
 * This file loads common components and functionality used across all pages
 */

import { initSidebar } from './common/sidebar';
import { initThemeToggle } from './common/theme-switch';
import { initScrollHandlers } from './core/scroll-handlers';
import { initSearch } from './common/search';
import * as utils from './utils';

/**
 * Initialize the common functionality across all pages
 */
function initializeApp(): void {
  // DOM ready check
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onDOMReady);
  } else {
    onDOMReady();
  }
}

/**
 * Handle DOM ready event
 */
function onDOMReady(): void {
  console.log('Notiva theme initialized');

  initSidebar();
  initThemeToggle();
  initSearch();

  // Initialize utility helpers
  utils.initHelpers();

  // Initialize scroll handlers
  initScrollHandlers();
}

// Initialize the application
initializeApp();

// Export public API if needed
export { initializeApp };
