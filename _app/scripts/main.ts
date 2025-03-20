/**
 * Main entry point for Notiva theme
 * This file loads common components and functionality used across all pages
 */

/**
 * Initialize common components
 */
function initializeCommon(): void {
  console.log('initialize--');
}

/**
 * Initialize on DOM content loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('-> 👋 Initializing on DOM content loaded');
  initializeCommon();

  console.log('is iT work?');

  // Dispatch event for page-specific scripts
  document.dispatchEvent(new CustomEvent('notiva:ready'));
});
