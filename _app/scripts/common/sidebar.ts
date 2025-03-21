/**
 * Sidebar functionality: toggle, submenu expansion, etc.
 */

export function initSidebar(): void {
  // Initialize sidebar toggle
  initSidebarToggle();

  // Initialize category submenu toggles
  initCategorySubmenus();
}

/**
 * Initialize sidebar toggle behavior for mobile
 */
function initSidebarToggle(): void {
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');

  console.log(sidebarToggle, sidebar, sidebarOverlay);

  if (!sidebarToggle || !sidebar || !sidebarOverlay) return;

  // Toggle sidebar when the button is clicked
  sidebarToggle.addEventListener('click', () => {
    // Check if sidebar is currently visible
    const isSidebarVisible =
      !sidebar.classList.contains('-translate-x-full') &&
      !sidebar.classList.contains('translate-x-full');

    if (isSidebarVisible) {
      // Hide sidebar
      if (sidebar.classList.contains('left-0')) {
        sidebar.classList.add('-translate-x-full');
      } else {
        sidebar.classList.add('translate-x-full');
      }
      sidebarOverlay.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    } else {
      // Show sidebar
      if (sidebar.classList.contains('left-0')) {
        sidebar.classList.remove('-translate-x-full');
      } else {
        sidebar.classList.remove('translate-x-full');
      }
      sidebarOverlay.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    }
  });

  // Hide sidebar when clicking the overlay
  sidebarOverlay.addEventListener('click', () => {
    if (sidebar.classList.contains('left-0')) {
      sidebar.classList.add('-translate-x-full');
    } else {
      sidebar.classList.add('translate-x-full');
    }
    sidebarOverlay.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  });

  // Close sidebar with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Check if sidebar is visible
      const isSidebarVisible =
        !sidebar.classList.contains('-translate-x-full') &&
        !sidebar.classList.contains('translate-x-full');

      if (isSidebarVisible) {
        // Hide sidebar
        if (sidebar.classList.contains('left-0')) {
          sidebar.classList.add('-translate-x-full');
        } else {
          sidebar.classList.add('translate-x-full');
        }
        sidebarOverlay.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }
    }
  });
}

/**
 * Initialize category submenu toggle behavior
 */
function initCategorySubmenus(): void {
  const categoryToggles = document.querySelectorAll('.category-menu-toggle');

  categoryToggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      // Find the submenu
      const submenu = toggle.nextElementSibling as HTMLElement;
      if (!submenu) return;

      // Find the arrow icon
      const arrow = toggle.querySelector('.category-arrow');

      // Toggle submenu visibility
      if (submenu.classList.contains('hidden')) {
        submenu.classList.remove('hidden');
        arrow?.classList.add('rotate-180');
      } else {
        submenu.classList.add('hidden');
        arrow?.classList.remove('rotate-180');
      }
    });
  });

  // Open the active category by default
  const activeCategory = document.querySelector('.category-menu-toggle.active');
  if (activeCategory) {
    const submenu = activeCategory.nextElementSibling as HTMLElement;
    const arrow = activeCategory.querySelector('.category-arrow');

    if (submenu) {
      submenu.classList.remove('hidden');
      arrow?.classList.add('rotate-180');
    }
  }
}
