// Purpose: Configure and initialize highlight.js with additional features
// - Line numbering
// - Code block titles
// - Line highlighting
// - Copy to clipboard functionality

declare const hljs: any;
declare const ClipboardJS: any;

/**
 * Initialize code highlighting with extended features
 * This will be called after the document has loaded and hljs is available
 */
function initializeCodeHighlight(): void {
  // Make sure highlight.js and ClipboardJS are available
  if (typeof hljs === 'undefined') {
    console.error('Highlight.js is not loaded');
    return;
  }

  if (typeof ClipboardJS === 'undefined' && window.useClipboard) {
    console.warn('ClipboardJS is not loaded, copy functionality will be disabled');
  }

  // 1. Apply syntax highlighting
  applyHighlighting();

  // 2. Process code block titles
  processCodeBlockTitles();

  // 5. Add copy buttons (if ClipboardJS is available)
  if (typeof ClipboardJS !== 'undefined' && window.useClipboard) {
    addCopyButtons();
  }
}

/**
 * Apply highlight.js syntax highlighting to all code blocks
 */
function applyHighlighting(): void {
  // Select all <pre><code> elements
  document.querySelectorAll('pre code').forEach((block: Element) => {
    hljs.highlightElement(block);
  });
}

/**
 * Process code block titles from markdown attributes
 * Format: ```language title="Title Text"
 */
function processCodeBlockTitles(): void {
  document.querySelectorAll('pre code').forEach((codeBlock: Element) => {
    const pre = codeBlock.parentElement;
    if (!pre) return;

    // Extract title from class attribute (added by Jekyll from markdown)
    const classContent = pre.className || '';
    const titleMatch = classContent.match(/title="([^"]+)"/);

    if (titleMatch && titleMatch[1]) {
      // Create title element
      const titleDiv = document.createElement('div');
      titleDiv.className = 'code-title';
      titleDiv.textContent = titleMatch[1];

      // Insert title before pre element
      pre.parentNode?.insertBefore(titleDiv, pre);

      // Add title indicator class to pre
      pre.classList.add('has-title');
    }
  });
}

/**
 * Add line numbers to code blocks
 */
export function addLineNumbers(): void {
  document.querySelectorAll('pre code').forEach((block: Element) => {
    if (!block.classList.contains('no-line-numbers')) {
      const lines = block.innerHTML.split('\n');

      // Create line number elements
      let lineNumbersHtml = '';
      for (let i = 0; i < lines.length - 1; i++) {
        lineNumbersHtml += `<span class="line-number">${i + 1}</span>`;
      }

      // Create line number container
      const lineNumberContainer = document.createElement('div');
      lineNumberContainer.className = 'line-numbers';
      lineNumberContainer.innerHTML = lineNumbersHtml;

      // Add line number container before code
      const parent = block.parentElement;
      if (parent) {
        parent.insertBefore(lineNumberContainer, block);
        parent.classList.add('with-line-numbers');
      }
    }
  });
}

/**
 * Highlight specific lines based on hl attribute
 * Format: ```language hl=1,3-5
 */
export function highlightSpecificLines(): void {
  document.querySelectorAll('pre code').forEach((codeBlock: Element) => {
    const pre = codeBlock.parentElement;
    if (!pre) return;

    // Extract highlighted lines from class attribute
    const classContent = pre.className || '';
    const hlMatch = classContent.match(/hl=([0-9,-]+)/);

    if (hlMatch && hlMatch[1]) {
      const ranges = hlMatch[1].split(',');
      const linesToHighlight = new Set<number>();

      // Process each range (either single number or range like 3-5)
      ranges.forEach((range) => {
        if (range.includes('-')) {
          const [start, end] = range.split('-').map(Number);
          for (let i = start; i <= end; i++) {
            linesToHighlight.add(i);
          }
        } else {
          linesToHighlight.add(parseInt(range, 10));
        }
      });

      // Apply highlighting to specific lines
      const codeLines = pre.querySelectorAll('.line-numbers .line-number');
      codeLines.forEach((lineNumber: Element, index: number) => {
        if (linesToHighlight.has(index + 1)) {
          lineNumber.classList.add('highlighted');

          // Also highlight the corresponding code line
          const lines = codeBlock.innerHTML.split('\n');
          if (index < lines.length) {
            lines[index] = `<span class="highlighted-line">${lines[index]}</span>`;
          }
          codeBlock.innerHTML = lines.join('\n');
        }
      });
    }
  });
}

/**
 * Add copy to clipboard buttons for code blocks
 */
function addCopyButtons(): void {
  interface ClipboardEvent {
    action: string;
    text: string;
    trigger: HTMLElement;
    clearSelection(): void;
  }

  // Create copy button for each code block
  document.querySelectorAll('pre code').forEach((codeBlock: Element, index: number) => {
    const pre = codeBlock.parentElement;
    if (!pre) return;

    // Create button element
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.setAttribute('data-clipboard-target', `#code-${index}`);
    copyButton.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/></svg>';

    // Add tooltip text
    const tooltip = document.createElement('span');
    tooltip.className = 'tooltip';
    tooltip.textContent = 'Copy';
    copyButton.appendChild(tooltip);

    // Add ID to code element for clipboard targeting
    codeBlock.setAttribute('id', `code-${index}`);

    // Add button to pre element
    pre.appendChild(copyButton);
  });

  // Initialize clipboard.js
  const clipboard = new ClipboardJS('.copy-button');

  // Handle copy success
  clipboard.on('success', (e: ClipboardEvent) => {
    const button = e.trigger;
    const tooltip = button.querySelector('.tooltip');

    if (tooltip) {
      tooltip.textContent = 'Copied!';
      setTimeout(() => {
        tooltip.textContent = 'Copy';
      }, 2000);
    }

    e.clearSelection();
  });

  // Handle copy error
  clipboard.on('error', (e: ClipboardEvent) => {
    const button = e.trigger;
    const tooltip = button.querySelector('.tooltip');

    if (tooltip) {
      tooltip.textContent = 'Failed to copy';
      setTimeout(() => {
        tooltip.textContent = 'Copy';
      }, 2000);
    }
  });
}

// Export if being used as a module
export { initializeCodeHighlight };
