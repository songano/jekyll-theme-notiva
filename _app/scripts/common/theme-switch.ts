/**
 * Dark mode management
 * Supports three modes: light, dark, and auto (system preference)
 */

type Theme = 'light' | 'dark' | 'auto';
const THEME_KEY = 'notiva-theme';
const VALID_THEMES = ['light', 'dark', 'auto'] as const;

/**
 * Checks if the system prefers dark mode
 * @returns {boolean} True if dark mode is preferred
 */
function systemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Gets the initial theme value
 * @returns {Theme} The initial theme (light, dark, or auto)
 */
function getInitialTheme(): Theme {
  // Check localStorage first
  const savedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
  if (savedTheme && VALID_THEMES.includes(savedTheme as Theme)) {
    return savedTheme;
  }

  // Get default theme from HTML
  const themeContainer = document.querySelector('[data-default-theme]');
  if (themeContainer) {
    const defaultTheme = themeContainer.getAttribute('data-default-theme') as Theme;
    if (defaultTheme && VALID_THEMES.includes(defaultTheme as Theme)) {
      return defaultTheme;
    }
  }

  // Default is auto
  return 'auto';
}

/**
 * Updates the active state of theme buttons using direct ID selectors
 * @param {Theme} theme - The current theme
 */
function updateActiveButton(theme: Theme): void {
  // Remove active state from all theme buttons
  VALID_THEMES.forEach((t) => {
    document.getElementById(`theme-${t}`)?.removeAttribute('data-active');
  });

  // Set active state for current theme button
  document.getElementById(`theme-${theme}`)?.setAttribute('data-active', '');
}

/**
 * Applies the specified theme
 * @param {Theme} theme - The theme to apply (light, dark, or auto)
 */
function applyTheme(theme: Theme): void {
  // Apply theme (auto is based on system preference)
  const appliedTheme = theme === 'auto' ? (systemPrefersDark() ? 'dark' : 'light') : theme;

  // Set theme attribute early in the process
  document.documentElement.setAttribute('data-theme', appliedTheme);

  // Save theme to localStorage
  localStorage.setItem(THEME_KEY, theme);

  // Update UI immediately
  updateActiveButton(theme);
}

/**
 * Apply theme as early as possible - before DOMContentLoaded
 * This prevents flickering during page transitions
 */
(function preloadTheme() {
  const currentTheme = getInitialTheme();
  const appliedTheme =
    currentTheme === 'auto' ? (systemPrefersDark() ? 'dark' : 'light') : currentTheme;

  document.documentElement.setAttribute('data-theme', appliedTheme);
})();

/**
 * Initializes the theme toggle functionality
 */
export function initThemeToggle(): void {
  const currentTheme = getInitialTheme();

  // Apply theme and update UI
  applyTheme(currentTheme);

  // Set up theme button event listeners using direct ID selectors
  VALID_THEMES.forEach((theme) => {
    const button = document.getElementById(`theme-${theme}`);
    button?.addEventListener('click', () => {
      applyTheme(theme);
    });
  });

  // Detect system theme changes
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  darkModeMediaQuery.addEventListener('change', (e) => {
    if (localStorage.getItem(THEME_KEY) === 'auto') {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      updateActiveButton('auto');
    }
  });
}
