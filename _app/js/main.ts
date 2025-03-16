// import '../css/main.css';

/**
 * Initialize core theme functionality
 */
function initializeCore() {
  // setupThemeToggle();
}

/**
 * Initialize when DOM is ready
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeCore);
} else {
  initializeCore();
}

// Export utils for use in other modules
