import type { ReadonlySignal } from '../signals/signals';
import { signal } from '../signals/signals';
import type { INavigator } from './INavigator';

/**
 * Test implementation of INavigator for unit testing without browser APIs.
 */
export class TestNavigator implements INavigator {
  readonly #pathname = signal<string>('');
  readonly #search = signal<string>('');
  readonly #hash = signal<string>('');

  public constructor(initialPath: string = '/') {
    this.#updateFromPath(initialPath);
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
    this.#updateFromPath(path);
  }

  public replace(path: string): void {
    this.#updateFromPath(path);
  }

  public back(): void {
    // Test implementation - no-op
  }

  public forward(): void {
    // Test implementation - no-op
  }

  public getHref(): string {
    return `http://localhost${this.#pathname()}${this.#search()}${this.#hash()}`;
  }

  #updateFromPath(path: string): void {
    // Parse path to extract pathname, search, and hash
    const url = new URL(path, 'http://localhost');
    this.#pathname(url.pathname);
    this.#search(url.search);
    this.#hash(url.hash);
  }
}
