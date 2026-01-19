import type { ReadonlySignal } from '../signals/signals';

/**
 * Interface for URL navigation. This abstraction allows for testable navigation
 * without relying on window.location or window.history.
 */

export interface INavigator {
  /**
   * Gets the current URL pathname (without query string or hash).
   */
  readonly pathname: ReadonlySignal<string>;

  /**
   * Gets the current URL search string (query parameters, including the leading '?').
   */
  readonly search: ReadonlySignal<string>;

  /**
   * Gets the current URL hash (including the leading '#').
   */
  readonly hash: ReadonlySignal<string>;

  /**
   * Navigates to a new URL. This should update the browser history
   * without causing a page reload.
   * @param path The path to navigate to. Can be:
   *   - A pathname only (e.g., '/users' or './sibling' or '../parent') - clears search/hash
   *   - A full URL string (e.g., '/users?page=1#section') - includes search/hash
   */
  navigate(path: string): void;

  /**
   * Replaces the current URL without adding a history entry.
   * @param path The path to replace with. Can be:
   *   - A pathname only (e.g., '/users') - clears search/hash
   *   - A full URL string (e.g., '/users?page=1#section') - includes search/hash
   */
  replace(path: string): void;

  /**
   * Goes back in the browser history.
   */
  back(): void;

  /**
   * Goes forward in the browser history.
   */
  forward(): void;

  /**
   * Gets the full current URL (including pathname, search, and hash).
   */
  getHref(): string;
}
