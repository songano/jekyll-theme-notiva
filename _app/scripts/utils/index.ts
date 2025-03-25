/**
 * Utils Module Index
 * Exports all utility functions
 */

// Re-export utility functions from individual modules
export * from './dom';

// Initialize utilities that need setup
export function initHelpers(): void {
  // Initialize clock if present
  initClock();

  // Other initializations can be added here
}

/**
 * Initialize the site header clock if present
 */
function initClock(): void {
  const clockElement = document.getElementById('site-header-time');
  if (!clockElement) return;

  // Load dayjs dynamically to reduce main bundle size
  import('./date').then(({ getCurrentTime }) => {
    // Get timezone from site config
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Update clock immediately
    updateClock(clockElement, timezone, getCurrentTime);

    // Update clock every minute
    setInterval(() => {
      updateClock(clockElement, timezone, getCurrentTime);
    }, 60000); // Update every minute
  });
}

/**
 * Update the clock element with current time
 * @param element Clock element
 * @param timezone Timezone to use
 * @param getCurrentTime Function to get formatted time
 */
function updateClock(
  element: HTMLElement,
  timezone: string,
  getCurrentTime: (timezone?: string, format?: string) => string
): void {
  element.textContent = getCurrentTime(timezone);
  element.setAttribute('title', `Current time (${timezone})`);
}

// Export default object for module usage
export default {
  initHelpers,
};
