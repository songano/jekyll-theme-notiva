/**
 * Scroll Handlers Module
 * Manages all scroll-related functionality
 */

// import { NotivaSiteConfig } from '../types';
import { debounce } from '../utils/dom';

/**
 * Initialize scroll event handlers
 * @param config Site configuration
 */
export function initScrollHandlers(): void {
  // Get scroll-related features
  // const { scroll_progress, back_to_top } = config.features || {};

  // Set up optimized scroll listener
  const handleScroll = debounce(() => {
    const scrollPos = window.scrollY;

    // Handle progress bar if enabled

    updateProgressBar(scrollPos);

    // Handle back to top button if enabled

    updateBackToTopButton(scrollPos);

    // Always handle header blur
    updateHeaderBlur(scrollPos);
  }, 10);

  // Add scroll event listener
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Initial call to set correct states
  handleScroll();

  // Set up back to top click handler if enabled

  setupBackToTopButton();
}

/**
 * Update scroll progress bar
 * @param scrollPos Current scroll position
 */
function updateProgressBar(scrollPos: number): void {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollPos / docHeight) * 100;

  progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
}

/**
 * Update header blur effect based on scroll position
 * @param scrollPos Current scroll position
 */
function updateHeaderBlur(scrollPos: number): void {
  const header = document.getElementById('header');
  if (!header) return;

  if (scrollPos > 10) {
    header.classList.add('backdrop-blur');
    header.classList.add('bg-opacity-80');
  } else {
    header.classList.remove('backdrop-blur');
    header.classList.remove('bg-opacity-80');
  }
}

/**
 * Update back to top button visibility
 * @param scrollPos Current scroll position
 */
function updateBackToTopButton(scrollPos: number): void {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  if (scrollPos > 300) {
    backToTopBtn.setAttribute('aria-hidden', 'false');
  } else {
    backToTopBtn.setAttribute('aria-hidden', 'true');
  }
}

/**
 * Set up back to top button click handler
 */
function setupBackToTopButton(): void {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

// Export scroll handlers
export default { initScrollHandlers };
