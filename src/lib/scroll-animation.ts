/**
 * scroll-animation.ts
 *
 * Centralized scroll animation utilities using IntersectionObserver.
 * Eliminates duplicated observer code across components.
 */

export interface ScrollAnimationOptions {
  /** Threshold at which to trigger the animation (0-1) */
  threshold?: number;
  /** Root margin for the observer */
  rootMargin?: string;
  /** Class to add when element is visible */
  visibleClass?: string;
  /** Whether to unobserve after animation triggers once */
  once?: boolean;
}

/**
 * Observes elements matching a selector and adds a class when they enter viewport.
 *
 * @param selector - CSS selector for elements to observe
 * @param options - Configuration options
 *
 * @example
 * ```ts
 * // Basic usage
 * observeScrollAnimations('.fade-in-up');
 *
 * // Custom options
 * observeScrollAnimations('.scale-in', {
 *   threshold: 0.3,
 *   rootMargin: '0px 0px -100px 0px'
 * });
 * ```
 */
export function observeScrollAnimations(
  selector: string,
  options: ScrollAnimationOptions = {}
): IntersectionObserver | null {
  const {
    threshold = 0.2,
    rootMargin = '0px 0px -50px 0px',
    visibleClass = 'visible',
    once = true
  } = options;

  // Check if running in browser
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
    return null;
  }

  const observerOptions: IntersectionObserverInit = {
    threshold,
    rootMargin
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add(visibleClass);

        // Unobserve after animation triggers if 'once' is true
        if (once) {
          observer.unobserve(entry.target);
        }
      }
    });
  }, observerOptions);

  // Observe all matching elements
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    observer.observe(el);
  });

  return observer;
}

/**
 * Observes multiple selectors with different configurations.
 *
 * @param configs - Array of selector and options pairs
 *
 * @example
 * ```ts
 * observeMultiple([
 *   { selector: '.fade-in-left', options: { threshold: 0.3 } },
 *   { selector: '.fade-in-right', options: { threshold: 0.3 } }
 * ]);
 * ```
 */
export function observeMultiple(
  configs: Array<{ selector: string; options?: ScrollAnimationOptions }>
): IntersectionObserver[] {
  return configs
    .map(({ selector, options }) => observeScrollAnimations(selector, options))
    .filter((observer): observer is IntersectionObserver => observer !== null);
}
