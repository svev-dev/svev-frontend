import { Signal, signal, ReadonlySignal, batch } from 'svev-frontend';
import { INavigator } from './INavigator';

/**
 * Browser-based implementation of INavigator that uses window.location and window.history.
 */

export class BrowserNavigator implements INavigator {
  readonly #pathname: Signal<string>;
  readonly #search: Signal<string>;
  readonly #hash: Signal<string>;

  public constructor() {
    this.#pathname = signal(window.location.pathname);
    this.#search = signal(window.location.search);
    this.#hash = signal(window.location.hash);

    // Listen to popstate events (back/forward button)
    // We don't dispose the listener because we expect it to be a long-lived listener.
    window.addEventListener('popstate', () => {
      this.#updateUrlSignals();
    });
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

  #updateUrlSignals(): void {
    const { pathname, search, hash } = window.location;
    batch(() => {
      this.#pathname(pathname);
      this.#search(search);
      this.#hash(hash);
    });
  }
}
