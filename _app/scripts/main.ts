/**
 * Main entry point for Notiva theme
 * This file loads common components and functionality used across all pages
 */

import { initSidebarToggle } from './components/sidebar-toggle';
import { initThemeToggle } from './components/theme-switch';
import { initScrollHandlers } from './core/scroll-handlers';
import { initSearch } from './components/search';
import * as utils from './utils';
import { initializeCategory } from './components/category';

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

  initSidebarToggle();
  initializeCategory();
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
