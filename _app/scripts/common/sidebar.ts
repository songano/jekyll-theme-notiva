/**
 * Sidebar functionality: toggle, submenu expansion, etc.
 */

const DESKTOP_BREAKPOINT = 640;

export function initSidebar(): void {
  initSidebarToggle();
}

/**
 * Initialize sidebar toggle behavior
 */
function initSidebarToggle(): void {
  const body = document.body;
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');

  if (!sidebarToggle || !sidebar || !sidebarOverlay) return;

  const isSidebarLeft = sidebar.classList.contains('left-0');
  const translateClass = isSidebarLeft ? '-translate-x-full' : 'translate-x-full';
  const isDesktop = () => window.innerWidth >= DESKTOP_BREAKPOINT;

  const toggleDesktopSidebar = () => {
    body.toggleAttribute('data-sidebar-collapsed');
  };

  const isMobileSidebarVisible = () => !sidebar.classList.contains(translateClass);

  const showMobileSidebar = () => {
    sidebar.classList.remove(translateClass);
    sidebarOverlay.classList.remove('hidden');
    body.classList.add('overflow-hidden');
  };

  const hideMobileSidebar = () => {
    sidebar.classList.add(translateClass);
    sidebarOverlay.classList.add('hidden');
    body.classList.remove('overflow-hidden');
  };

  const toggleSidebar = () => {
    if (isDesktop()) {
      toggleDesktopSidebar();
    } else {
      if (isMobileSidebarVisible()) {
        hideMobileSidebar();
      } else {
        showMobileSidebar();
      }
    }
  };

  const handleEscapeKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (isDesktop()) {
        body.setAttribute('data-sidebar-collapsed', '');
      } else {
        hideMobileSidebar();
      }
    }
  };

  const handleResize = () => {
    if (!isDesktop()) hideMobileSidebar();
  };

  sidebarToggle.addEventListener('click', toggleSidebar);
  sidebarOverlay.addEventListener('click', hideMobileSidebar);
  document.addEventListener('keydown', handleEscapeKey);
  window.addEventListener('resize', handleResize);

  // Initialize Settings
  if (isDesktop()) body.removeAttribute('data-sidebar-collapsed');
  else hideMobileSidebar();
}
