import { initializeCodeHighlight } from '../components/code-highlight';

document.addEventListener('DOMContentLoaded', () => {
  const markdownContent = document.querySelectorAll('.markdown-content');

  markdownContent.forEach((content) => {
    // Add wrapper class if not already present
    if (!content.classList.contains('markdown-content')) {
      content.classList.add('markdown-content');
    }

    // Apply enhancements
    addHeadingAnchors(content);
    handleExternalLinks(content);
  });

  initializeCodeHighlight();
});

/**
 * Add anchor links to the end of headings for easy linking
 */
export function addHeadingAnchors(content: Element): void {
  const headings = content.querySelectorAll('h1, h2, h3, h4, h5, h6');

  headings.forEach((heading) => {
    // Skip headings that already have anchors
    if (heading.querySelector('.anchor')) return;

    // Create ID from heading text
    const id =
      heading.textContent
        ?.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-') || '';

    heading.setAttribute('id', id);

    // Create anchor link and append to end of heading
    const anchor = document.createElement('a');
    anchor.className = 'anchor';
    anchor.href = `#${id}`;
    anchor.innerHTML = '#';

    // Append anchor to the end of heading instead of prepending
    heading.appendChild(anchor);
  });
}

/**
 * Handle external links - add target and rel attributes
 */
function handleExternalLinks(content: Element): void {
  const links = content.querySelectorAll('a');
  const currentHost = window.location.hostname;

  links.forEach((link) => {
    const href = link.getAttribute('href');

    // Skip if no href or it's a hash link or already processed
    if (!href || href.startsWith('#') || link.hasAttribute('data-processed')) return;

    try {
      const url = new URL(href, window.location.origin);

      // If external link
      if (url.hostname !== currentHost) {
        // Add target and rel attributes for security
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');

        // Optionally add external link icon
        if (!link.querySelector('.external-icon')) {
          const icon = document.createElement('span');
          icon.className = 'external-icon inline-block ml-1';
          icon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          `;
          link.appendChild(icon);
        }
      }
    } catch (e) {
      console.log(e);
      console.debug('Not processing link:', href);
    }

    // Mark as processed
    link.setAttribute('data-processed', 'true');
  });
}
