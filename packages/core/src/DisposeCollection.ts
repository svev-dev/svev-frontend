import type { Dispose } from './types';

export class DisposeCollection {
  #disposables: Dispose[] = [];

  public add = (dispose: Dispose): void => {
    this.#disposables.push(dispose);
  };

  public dispose = (): void => {
    this.#disposables.forEach((dispose) => dispose());
    this.#disposables = [];
  };
}
