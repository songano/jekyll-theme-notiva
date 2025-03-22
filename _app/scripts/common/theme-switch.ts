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
 * Extracts the theme from an element with theme-* class
 * @param {Element} element - The element to extract theme from
 * @returns {Theme|null} The extracted theme or null if not found
 */
function extractThemeFromElement(element: Element): Theme | null {
  if (!element.classList) return null;

  for (const className of element.classList) {
    if (className.startsWith('theme-')) {
      const theme = className.replace('theme-', '') as Theme;
      if (VALID_THEMES.includes(theme as Theme)) {
        return theme;
      }
    }
  }

  return null;
}

/**
 * Updates the active state of theme buttons
 * @param {Theme} theme - The current theme
 */
function updateActiveButton(theme: Theme): void {
  // Remove active state from all buttons
  document.querySelectorAll('button[data-active]').forEach((btn) => {
    btn.removeAttribute('data-active');
  });

  // Find and activate the theme button
  const buttons = document.querySelectorAll('button');
  for (const button of buttons) {
    const iconElement = button.querySelector('[class*="theme-"]');
    if (iconElement && extractThemeFromElement(iconElement) === theme) {
      button.setAttribute('data-active', '');
      break; // Stop iteration once found
    }
  }
}

/**
 * Applies the specified theme
 * @param {Theme} theme - The theme to apply (light, dark, or auto)
 */
function applyTheme(theme: Theme): void {
  // Apply theme (auto is based on system preference)
  const appliedTheme = theme === 'auto' ? (systemPrefersDark() ? 'dark' : 'light') : theme;
  document.documentElement.setAttribute('data-theme', appliedTheme);

  // Save theme to localStorage
  localStorage.setItem(THEME_KEY, theme);

  // Update UI
  updateActiveButton(theme);
}

/**
 * Initializes the theme toggle functionality
 */
export function initThemeToggle(): void {
  const currentTheme = getInitialTheme();

  // Apply initial theme
  applyTheme(currentTheme);

  // Set up theme button event listeners
  const themeSelector = 'button';
  document.querySelectorAll(themeSelector).forEach((button) => {
    const iconElement = button.querySelector('[class*="theme-"]');
    if (!iconElement) return; // Skip if no theme icon

    button.addEventListener('click', () => {
      const theme = extractThemeFromElement(iconElement);
      if (theme) {
        applyTheme(theme);
      }
    });
  });

  // Detect system theme changes
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  darkModeMediaQuery.addEventListener('change', (e) => {
    if (localStorage.getItem(THEME_KEY) === 'auto') {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  });
}
