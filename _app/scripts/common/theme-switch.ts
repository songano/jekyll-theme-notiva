/**
 * Dark mode management
 * Supports three modes: light, dark, and auto (system preference)
 */

type Theme = 'light' | 'dark' | 'auto';
const THEME_KEY = 'notiva-theme';

function getInitialTheme(): Theme {
  const savedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
  if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
    return savedTheme;
  }
  const dataTheme = document.documentElement.getAttribute('data-theme') as Theme | null;

  if (dataTheme && ['light', 'dark', 'auto'].includes(dataTheme)) {
    return dataTheme;
  }
  return 'auto';
}

function systemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyTheme(theme: Theme): void {
  if (theme === 'auto')
    document.documentElement.setAttribute('data-theme', systemPrefersDark() ? 'dark' : 'light');
  else document.documentElement.setAttribute('data-theme', theme);

  updateThemeToggleUI(theme);
}

// Update the theme toggle button UI
function updateThemeToggleUI(theme: Theme): void {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  // Hide all icons first
  const lightIcon = themeToggle.querySelector('.theme-light');
  const darkIcon = themeToggle.querySelector('.theme-dark');
  const autoIcon = themeToggle.querySelector('.theme-auto');

  if (lightIcon) lightIcon.classList.add('hidden');
  if (darkIcon) darkIcon.classList.add('hidden');
  if (autoIcon) autoIcon.classList.add('hidden');

  // Show the appropriate icon
  if (theme === 'light') {
    darkIcon?.classList.remove('hidden');
  } else if (theme === 'dark') {
    lightIcon?.classList.remove('hidden');
  } else {
    autoIcon?.classList.remove('hidden');
  }
}

// Initialize dark mode
export function initThemeToggle(): void {
  const currentTheme = getInitialTheme();

  // Apply the initial theme
  applyTheme(currentTheme);

  // Set up theme toggle button
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentStoredTheme = (localStorage.getItem(THEME_KEY) as Theme) || 'auto';

      // Cycle through themes: light -> dark -> auto -> light
      let newTheme: Theme;

      if (currentStoredTheme === 'light') {
        newTheme = 'dark';
      } else if (currentStoredTheme === 'dark') {
        newTheme = 'auto';
      } else {
        newTheme = 'light';
      }

      // Store the new theme preference
      localStorage.setItem(THEME_KEY, newTheme);

      // Apply the new theme
      applyTheme(newTheme);
    });
  }

  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (localStorage.getItem(THEME_KEY) === 'auto') {
      applyTheme('auto');
    }
  });
}
