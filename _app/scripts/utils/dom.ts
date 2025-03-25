/**
 * DOM Utility Functions
 * Common DOM manipulation utilities
 */

/**
 * Creates a debounced function that delays invoking the callback
 * @param callback Function to debounce
 * @param wait Time to wait in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  callback: T,
  wait = 100
): (...args: Parameters<T>) => void {
  let timeout: number | null = null;

  return (...args: Parameters<T>): void => {
    const later = () => {
      timeout = null;
      callback(...args);
    };

    if (timeout !== null) {
      window.clearTimeout(timeout);
    }

    timeout = window.setTimeout(later, wait);
  };
}

/**
 * Creates a throttled function that only invokes the callback
 * at most once per every `wait` milliseconds
 * @param callback Function to throttle
 * @param wait Time between allowed invocations
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  callback: T,
  wait = 100
): (...args: Parameters<T>) => void {
  let timeout: number | null = null;
  let previous = 0;

  return (...args: Parameters<T>): void => {
    const now = Date.now();
    const remaining = wait - (now - previous);

    if (remaining <= 0 || remaining > wait) {
      if (timeout !== null) {
        window.clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      callback(...args);
    } else if (timeout === null) {
      timeout = window.setTimeout(() => {
        previous = Date.now();
        timeout = null;
        callback(...args);
      }, remaining);
    }
  };
}

/**
 * Gets an element by its ID with type safety
 * @param id Element ID
 * @returns Element or null if not found
 */
export function getElementById<T extends HTMLElement = HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

/**
 * Finds elements by selector with type safety
 * @param selector CSS selector
 * @param parent Parent element (defaults to document)
 * @returns NodeList of elements
 */
export function querySelectorAll<T extends HTMLElement = HTMLElement>(
  selector: string,
  parent: Document | HTMLElement = document
): NodeListOf<T> {
  return parent.querySelectorAll<T>(selector);
}

/**
 * Finds first element by selector with type safety
 * @param selector CSS selector
 * @param parent Parent element (defaults to document)
 * @returns Element or null if not found
 */
export function querySelector<T extends HTMLElement = HTMLElement>(
  selector: string,
  parent: Document | HTMLElement = document
): T | null {
  return parent.querySelector<T>(selector);
}

/**
 * Adds event listener with specified options
 * @param element Target element
 * @param event Event name
 * @param handler Event handler
 * @param options Event listener options
 */
export function addEvent<K extends keyof HTMLElementEventMap>(
  element: HTMLElement | Window | Document,
  event: K,
  handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): void {
  element.addEventListener(event, handler as EventListener, options);
}

/**
 * Removes event listener
 * @param element Target element
 * @param event Event name
 * @param handler Event handler
 * @param options Event listener options
 */
export function removeEvent<K extends keyof HTMLElementEventMap>(
  element: HTMLElement | Window | Document,
  event: K,
  handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
  options?: boolean | EventListenerOptions
): void {
  element.removeEventListener(event, handler as EventListener, options);
}

/**
 * Creates a DOM element with attributes
 * @param tag Element tag name
 * @param attributes Element attributes
 * @returns Created element
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attributes: Record<string, string> = {}
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

  return element;
}

// Export all DOM utilities
export default {
  debounce,
  throttle,
  getElementById,
  querySelectorAll,
  querySelector,
  addEvent,
  removeEvent,
  createElement,
};
