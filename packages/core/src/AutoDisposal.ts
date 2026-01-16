import type { DisposeCollection } from './DisposeCollection';

export class AutoDisposal {
  static #instance: AutoDisposal;
  readonly #registry: FinalizationRegistry<DisposeCollection>;

  private constructor() {
    this.#registry = new FinalizationRegistry((disposeContainer: DisposeCollection) => {
      disposeContainer.dispose();
    });
  }

  public static get instance(): AutoDisposal {
    if (this.#instance === undefined) {
      this.#instance = new AutoDisposal();
    }
    return this.#instance;
  }

  public register(target: object, disposeContainer: DisposeCollection): void {
    this.#registry.register(target, disposeContainer);
  }
}
