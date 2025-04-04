/**
 * Category tree component functionality
 * Handles expanding/collapsing of category items in the sidebar
 * Persists state across page navigation using localStorage
 */
export function initializeCategoryTree(): void {
  const STORAGE_KEY = 'notiva-expanded-categories';
  const categoryToggles = document.querySelectorAll<HTMLButtonElement>('.category-toggle');

  // Load expanded categories from localStorage
  const loadExpandedCategories = (): Set<string> => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? new Set(JSON.parse(saved)) : new Set<string>();
    } catch (e) {
      console.error('Failed to load expanded categories from localStorage:', e);
      return new Set<string>();
    }
  };

  // Save expanded categories to localStorage
  const saveExpandedCategories = (categories: Set<string>): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(categories)));
    } catch (e) {
      console.error('Failed to save expanded categories to localStorage:', e);
    }
  };

  // Get initial state from localStorage
  const expandedCategories = loadExpandedCategories();

  // Initialize UI based on stored state
  categoryToggles.forEach((toggle) => {
    const categoryId = toggle.getAttribute('data-category-id');
    if (categoryId && expandedCategories.has(categoryId)) {
      const contentEl = document.querySelector(`[data-category-content="${categoryId}"]`);
      const toggleIcon = toggle.querySelector('.toggle-icon');
      const folderIconClosed = toggle.closest('.category-header')?.querySelector('.folder-closed');
      const folderIconOpen = toggle.closest('.category-header')?.querySelector('.folder-open');

      if (contentEl && toggleIcon) {
        // Expand this category
        toggle.setAttribute('aria-expanded', 'true');

        // Set visibility
        contentEl.classList.remove('opacity-0');
        contentEl.classList.add('opacity-100');
        contentEl.classList.remove('max-h-0');
        contentEl.classList.add('max-h-[1000px]');

        // Rotate icon
        toggleIcon.classList.add('rotate-90');
        toggleIcon.classList.remove('rotate-0');

        // Update folder icon
        if (folderIconClosed && folderIconOpen) {
          folderIconClosed.classList.remove('inline-block');
          folderIconClosed.classList.add('hidden');
          folderIconOpen.classList.remove('hidden');
          folderIconOpen.classList.add('inline-block');
        }
      }
    }
  });

  // Add click handlers
  categoryToggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const categoryId = toggle.getAttribute('data-category-id');
      const parentId = toggle.getAttribute('data-parent-id');

      if (!categoryId || !parentId) return;

      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      const contentEl = document.querySelector(`[data-category-content="${categoryId}"]`);
      const toggleIcon = toggle.querySelector('.toggle-icon');

      // Close other categories at the same level under the same parent
      if (!isExpanded) {
        // Find all toggles with the same parent ID
        const siblingToggles = document.querySelectorAll(
          `.category-toggle[data-parent-id="${parentId}"][data-category-id]`
        );

        siblingToggles.forEach((siblingToggle) => {
          if (siblingToggle !== toggle && siblingToggle.getAttribute('aria-expanded') === 'true') {
            const siblingCategoryId = siblingToggle.getAttribute('data-category-id');
            if (siblingCategoryId) {
              // Close this sibling
              const siblingToggleElement = siblingToggle as HTMLElement;
              collapseCategory(siblingToggleElement, siblingCategoryId);
              expandedCategories.delete(siblingCategoryId);
            }
          }
        });
      }

      // Toggle the current category
      if (isExpanded) {
        // Collapse
        if (contentEl && toggleIcon) {
          collapseCategory(toggle, categoryId);
          expandedCategories.delete(categoryId);
        }
      } else {
        // Expand
        if (contentEl && toggleIcon) {
          expandCategory(toggle, categoryId);
          expandedCategories.add(categoryId);
        }
      }

      // Save updated state to localStorage
      saveExpandedCategories(expandedCategories);
    });
  });

  // Helper function to expand a category
  function expandCategory(toggle: HTMLElement, categoryId: string): void {
    const contentEl = document.querySelector(`[data-category-content="${categoryId}"]`);
    const toggleIcon = toggle.querySelector('.toggle-icon');
    const folderIconClosed = toggle.closest('.category-header')?.querySelector('.folder-closed');
    const folderIconOpen = toggle.closest('.category-header')?.querySelector('.folder-open');

    if (contentEl && toggleIcon) {
      toggle.setAttribute('aria-expanded', 'true');

      // Animate opening
      contentEl.classList.remove('opacity-0');
      contentEl.classList.add('opacity-100');
      contentEl.classList.remove('max-h-0');
      contentEl.classList.add('max-h-[1000px]'); // Large enough value

      // Rotate icon
      toggleIcon.classList.add('rotate-90');
      toggleIcon.classList.remove('rotate-0');

      // Update folder icon
      if (folderIconClosed && folderIconOpen) {
        folderIconClosed.classList.remove('inline-block');
        folderIconClosed.classList.add('hidden');
        folderIconOpen.classList.remove('hidden');
        folderIconOpen.classList.add('inline-block');
      }
    }
  }

  // Helper function to collapse a category
  function collapseCategory(toggle: HTMLElement, categoryId: string): void {
    const contentEl = document.querySelector(`[data-category-content="${categoryId}"]`);
    const toggleIcon = toggle.querySelector('.toggle-icon');
    const folderIconClosed = toggle.closest('.category-header')?.querySelector('.folder-closed');
    const folderIconOpen = toggle.closest('.category-header')?.querySelector('.folder-open');

    if (contentEl && toggleIcon) {
      toggle.setAttribute('aria-expanded', 'false');

      // Animate closing
      contentEl.classList.remove('opacity-100');
      contentEl.classList.add('opacity-0');
      contentEl.classList.remove('max-h-[1000px]');
      contentEl.classList.add('max-h-0');

      // Rotate icon back
      toggleIcon.classList.remove('rotate-90');
      toggleIcon.classList.add('rotate-0');

      // Reset folder icon
      if (folderIconClosed && folderIconOpen) {
        folderIconClosed.classList.remove('hidden');
        folderIconClosed.classList.add('inline-block');
        folderIconOpen.classList.remove('inline-block');
        folderIconOpen.classList.add('hidden');
      }
    }
  }
}

/**
 * Initialize sidebar functionality
 * Should be called when DOM is loaded
 */
export function initializeCategory(): void {
  initializeCategoryTree();

  // Expand categories for active page (optionally)
  expandForActivePage();

  // Add additional sidebar functionality as needed
  // For example: mobile sidebar toggle, search in sidebar, etc.
}

/**
 * Auto-expand categories that contain the current active page
 * This ensures the current page is visible in the sidebar navigation
 */
function expandForActivePage(): void {
  const currentPath = window.location.pathname;
  const activeLink =
    document.querySelector(`a[href="${currentPath}"]`) ||
    document.querySelector(`a[href="${window.location.origin}${currentPath}"]`);

  if (activeLink) {
    // Find parent category items that need expanding
    let parentItem = activeLink.closest('.category-content');

    while (parentItem) {
      const categoryId = parentItem.getAttribute('data-category-content');
      if (categoryId) {
        const toggle = document.querySelector(`.category-toggle[data-category-id="${categoryId}"]`);
        if (toggle && toggle.getAttribute('aria-expanded') !== 'true') {
          // Simulate a click to expand this category
          (toggle as HTMLElement).click();
        }
      }
      // 다음 부모로 이동
      parentItem = parentItem.parentElement?.closest('.category-content') ?? null;
    }

    // 애니메이션을 허용하는 작은 지연 후 활성 링크를 뷰로 스크롤
    setTimeout(() => {
      activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 300);
  }
}
