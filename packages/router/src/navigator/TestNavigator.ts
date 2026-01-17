import { Signal, signal, ReadonlySignal, batch } from 'svev-frontend';
import { INavigator } from './INavigator';

/**
 * Testable implementation of INavigator that doesn't rely on browser APIs.
 * Useful for unit testing without mocking window.location or window.history.
 */

export class TestNavigator implements INavigator {
  readonly #pathname: Signal<string>;
  readonly #search: Signal<string>;
  readonly #hash: Signal<string>;
  #history: string[] = []; // Stores full URLs (pathname + search + hash)
  #historyIndex = -1;

  public constructor(initialPath = '/') {
    const { pathname, search, hash } = this.#parseInitialPath(initialPath);
    this.#pathname = signal(pathname);
    this.#search = signal(search);
    this.#hash = signal(hash);
    const fullUrl = pathname + search + hash;
    this.#history = [fullUrl];
    this.#historyIndex = 0;
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
    const { pathname, search, hash } = this.#parsePath(path);
    const fullPath = pathname + search + hash;

    if (
      pathname === this.#pathname.peek() &&
      search === this.#search.peek() &&
      hash === this.#hash.peek()
    ) {
      return;
    }

    // Remove any forward history
    this.#history = this.#history.slice(0, this.#historyIndex + 1);
    this.#history.push(fullPath);
    this.#historyIndex++;
    batch(() => {
      this.#pathname(pathname);
      this.#search(search);
      this.#hash(hash);
    });
  }

  public replace(path: string): void {
    const { pathname, search, hash } = this.#parsePath(path);
    const fullPath = pathname + search + hash;

    if (
      pathname === this.#pathname.peek() &&
      search === this.#search.peek() &&
      hash === this.#hash.peek()
    ) {
      return;
    }

    this.#history[this.#historyIndex] = fullPath;
    batch(() => {
      this.#pathname(pathname);
      this.#search(search);
      this.#hash(hash);
    });
  }

  public back(): void {
    if (this.#historyIndex > 0) {
      this.#historyIndex--;
      this.#updateFromHistory();
    }
  }

  public forward(): void {
    if (this.#historyIndex < this.#history.length - 1) {
      this.#historyIndex++;
      this.#updateFromHistory();
    }
  }

  public getHref(): string {
    // href should return the full URL including origin (protocol + host + port)
    // Since TestNavigator doesn't have a real origin, we use a dummy one
    const origin = 'http://localhost';
    return origin + this.#pathname.peek() + this.#search.peek() + this.#hash.peek();
  }

  /**
   * Updates pathname, search, and hash from the current history entry.
   */
  #updateFromHistory(): void {
    const fullUrl = this.#history[this.#historyIndex];
    if (fullUrl === undefined) {
      return;
    }
    const parsed = this.#parseFullUrl(fullUrl);
    batch(() => {
      this.#pathname(parsed.pathname);
      this.#search(parsed.search);
      this.#hash(parsed.hash);
    });
  }

  /**
   * Parses an initial path (for constructor). Handles both pathname-only and full URLs.
   */
  #parseInitialPath(path: string): { pathname: string; search: string; hash: string } {
    return this.#parseFullUrl(path);
  }

  /**
   * Parses a full URL string into pathname, search, and hash.
   * Uses the URL API for parsing.
   */
  #parseFullUrl(url: string): { pathname: string; search: string; hash: string } {
    // Use URL API to parse - construct a base URL with dummy origin
    const fullUrl = url.startsWith('/') ? `http://localhost${url}` : `http://localhost/${url}`;
    const parsed = new URL(fullUrl);
    return {
      pathname: parsed.pathname,
      search: parsed.search,
      hash: parsed.hash,
    };
  }

  /**
   * Parses a path string into pathname, search, and hash components.
   * If the path doesn't include search/hash, clears them (empty strings).
   * Uses the URL API to handle parsing and relative path resolution.
   */
  #parsePath(path: string): { pathname: string; search: string; hash: string } {
    // Check if path includes search or hash
    const hasSearch = path.includes('?');
    const hasHash = path.includes('#');

    // Use URL API to parse and resolve the path relative to current pathname
    // Construct a base URL using a dummy origin (domain doesn't matter for path resolution)
    const baseUrl = 'http://localhost' + this.#pathname.peek();
    const url = new URL(path, baseUrl);

    // Extract components
    const pathname = url.pathname;
    const search = hasSearch ? url.search : '';
    const hash = hasHash ? url.hash : '';

    return { pathname, search, hash };
  }
}
