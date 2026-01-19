import type { Signal, ReadonlySignal } from '../signals/signals';
import { signal, batch } from '../signals/signals';
import type { INavigator } from './INavigator';

/**
 * Browser-based implementation of INavigator that uses window.location and window.history.
 */
export class BrowserNavigator implements INavigator {
  readonly #pathname: Signal<string>;
  readonly #search: Signal<string>;
  readonly #hash: Signal<string>;
  #clickHandler: ((event: Event) => void) | undefined;
  #rootNode: Node | undefined;

  public constructor() {
    this.#pathname = signal(window.location.pathname);
    this.#search = signal(window.location.search);
    this.#hash = signal(window.location.hash);

    // Listen to popstate events (back/forward button)
    // We don't dispose the listener because we expect it to be a long-lived listener.
    window.addEventListener('popstate', this.#updateUrlSignals);
  }

  public get pathname(): ReadonlySignal<string> {
    return this.#pathname;
  }

  public get search(): ReadonlySignal<string> {
    return this.#search;
  }

  public get hash(): ReadonlySignal<string> {
    return this.#hash;
  }

  public navigate(path: string): void {
    window.history.pushState(null, '', path);
    this.#updateUrlSignals();
  }

  public replace(path: string): void {
    window.history.replaceState(null, '', path);
    this.#updateUrlSignals();
  }

  public back(): void {
    window.history.back();
  }

  public forward(): void {
    window.history.forward();
  }

  public getHref(): string {
    return window.location.href;
  }

  /**
   * Intercepts anchor tag clicks to prevent page reloads for internal links.
   * This enables client-side navigation for same-origin links.
   *
   * @param rootNode Optional root element to attach the listener to. Defaults to document.
   *                    If provided, only clicks within this element will be intercepted.
   */
  public interceptAnchors(rootNode: Node = document): void {
    if (this.#clickHandler) {
      // Already set up, remove old handler first
      this.stopInterceptingAnchors();
    }

    this.#clickHandler = (event: Event): void => {
      if (!(event instanceof MouseEvent)) {
        return;
      }

      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      // Find the closest anchor element
      const anchor = target.closest('a');
      if (!anchor) {
        return;
      }

      const href = anchor.getAttribute('href');
      if (href === null || href === '') {
        return;
      }

      // Don't intercept if:
      // - Middle/right click (open in new tab/window)
      // - Ctrl/Cmd+click (open in new tab)
      // - Shift+click (open in new window)
      // - Has target="_blank" or other target
      // - Has download attribute
      // - Is a special protocol (mailto:, tel:, javascript:, etc.)
      if (
        event.button !== 0 ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        anchor.target === '_blank' ||
        anchor.hasAttribute('download') ||
        /^(mailto:|tel:|javascript:|data:|blob:)/i.test(href)
      ) {
        return;
      }

      try {
        // Check if it's an internal link (same origin)
        const currentUrl = new URL(this.getHref());
        const targetUrl = new URL(href, currentUrl.href);

        // If same origin, intercept and use client-side navigation
        if (targetUrl.origin === currentUrl.origin) {
          event.preventDefault();
          const path = targetUrl.pathname + targetUrl.search + targetUrl.hash;
          this.navigate(path);
        }
      } catch {
        // If URL parsing fails, let the browser handle it normally
      }
    };

    rootNode.addEventListener('click', this.#clickHandler);
    this.#rootNode = rootNode;
  }

  /**
   * Stops intercepting anchor tag clicks.
   */
  public stopInterceptingAnchors(): void {
    if (this.#clickHandler && this.#rootNode) {
      this.#rootNode.removeEventListener('click', this.#clickHandler);
      this.#clickHandler = undefined;
      this.#rootNode = undefined;
    }
  }

  readonly #updateUrlSignals = (): void => {
    const { pathname, search, hash } = window.location;
    batch(() => {
      this.#pathname(pathname);
      this.#search(search);
      this.#hash(hash);
    });
  };
}
