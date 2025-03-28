/**
 * Search functionality for Notiva theme
 * Uses Simple Jekyll Search for fast and efficient search
 * https://github.com/christian-fei/Simple-Jekyll-Search
 */

import { SimpleJekyllSearch } from '../types';
import { debounce } from '../utils';

declare global {
  interface Window {
    SimpleJekyllSearch: SimpleJekyllSearch;
  }
}

// Constants
const SEARCH_SHORTCUT_KEYS = ['k'];
const KEY_CODES = {
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  ENTER: 'Enter',
  ESCAPE: 'Escape',
};

// Caching DOM elements and state
let selectedResultIndex = -1;
let searchButton: HTMLButtonElement | null = null;
let searchModal: HTMLElement | null = null;
let searchInput: HTMLInputElement | null = null;
let searchResults: HTMLElement | null = null;

// Initialize Simple Jekyll Search
export function initSearch(): void {
  // Only query DOM once
  searchButton = document.getElementById('search-button') as HTMLButtonElement;
  searchModal = document.getElementById('search-modal') as HTMLElement;
  searchInput = document.getElementById('search-input') as HTMLInputElement;
  searchResults = document.getElementById('search-results') as HTMLElement;

  if (!searchButton || !searchModal || !searchInput || !searchResults) return;

  // Event listeners
  searchButton.addEventListener('click', openSearchModal);
  searchInput.addEventListener('keydown', handleResultNavigation);
  searchModal.addEventListener('click', handleModalClick);
  document.addEventListener('keydown', handleKeyboardShortcuts);

  // Performance optimization: debounce search input
  searchInput.addEventListener('input', debounce(handleSearchInput, 300));

  // Initialize modal based on aria-hidden status
  if (searchModal.getAttribute('aria-hidden') === 'false') {
    searchInput.focus();
  }
}

// Extracted event handlers for better readability and maintenance
function handleResultNavigation(e: KeyboardEvent): void {
  if (!searchResults) return;

  const resultItems = searchResults.querySelectorAll('.search-result-item');
  const totalResults = resultItems.length;

  if (totalResults === 0) return;

  // Navigate through results with keyboard
  if (e.key === KEY_CODES.DOWN) {
    e.preventDefault();
    selectedResultIndex = (selectedResultIndex + 1) % totalResults;
    updateSelectedResult(resultItems);
  } else if (e.key === KEY_CODES.UP) {
    e.preventDefault();
    selectedResultIndex = (selectedResultIndex - 1 + totalResults) % totalResults;
    updateSelectedResult(resultItems);
  } else if (e.key === KEY_CODES.ENTER && selectedResultIndex >= 0) {
    e.preventDefault();
    const selectedItem = resultItems[selectedResultIndex] as HTMLAnchorElement;
    if (selectedItem) {
      window.location.href = selectedItem.href;
    }
  }
}

function handleModalClick(e: MouseEvent): void {
  if (!searchModal) return;
  if (e.target === searchModal) closeSearchModal();
}

function handleSearchInput(e: Event): void {
  const target = e.target as HTMLInputElement;
  if (target.value.length > 1) {
    // Reset selection when search changes
    selectedResultIndex = -1;
    // Optional: track search analytics
  }
}

function handleKeyboardShortcuts(e: KeyboardEvent): void {
  // Close modal with ESC
  if (e.key === KEY_CODES.ESCAPE && searchModal && !searchModal.classList.contains('aria-hidden')) {
    closeSearchModal();
    return;
  }

  // Open search with Ctrl/Cmd + K
  if ((e.ctrlKey || e.metaKey) && SEARCH_SHORTCUT_KEYS.includes(e.key)) {
    e.preventDefault();
    openSearchModal();
  }
}

function updateSelectedResult(resultItems: NodeListOf<Element>): void {
  resultItems.forEach((item, index) => {
    if (index === selectedResultIndex) {
      item.classList.add('bg-secondary');
      item.classList.remove('hover:bg-secondary');

      // 선택된 항목이 뷰에 보이도록 스크롤
      (item as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    } else {
      item.classList.remove('bg-secondary');
      item.classList.add('hover:bg-secondary');
    }
  });
}

function openSearchModal(): void {
  if (!searchModal || !searchInput) return;

  searchModal.setAttribute('aria-hidden', 'false');
  selectedResultIndex = -1; // Reset selection when opening

  // Focus the input with a slight delay for animations
  setTimeout(() => {
    searchInput?.focus();
  }, 50);

  document.body.classList.add('overflow-hidden');
}

function closeSearchModal(): void {
  if (!searchModal || !searchInput || !searchResults) return;

  searchModal.setAttribute('aria-hidden', 'true');

  // Clear state
  searchInput.value = '';
  searchResults.innerHTML = '';
  selectedResultIndex = -1;

  document.body.classList.remove('overflow-hidden');
}
