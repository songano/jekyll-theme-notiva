/**
 * Main entry point for Notiva theme
 * This file loads common components and functionality used across all pages
 */

import { initSidebar } from './common/sidebar';
import { initThemeToggle } from './common/theme-switch';

// const cleanupFunctions: Record<string, () => void> = {};

/**
 * Initialize common components
 */
function initializeCommon(): void {
  // Initialize dark
  //  mode
  initThemeToggle();
  initSidebar();
}

/**
 * Initialize on DOM content loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  initializeCommon();

  // Dispatch event for page-specific scripts
  document.dispatchEvent(new CustomEvent('notiva:ready'));
});
