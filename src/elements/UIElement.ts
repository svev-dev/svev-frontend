import { effect, signal } from '../signals/signals';
import { Dispose } from '../types';

export abstract class UIElement {
  public readonly isEnabled = signal(true);

  private _disposables: Dispose[] = [];

  /**
   * The one that calls `createUI` owns the UIElement and is responsible for calling `dispose`.
   */
  public abstract createUI(): ChildNode;

  protected effect(fn: VoidFunction): void {
    const dispose = effect(fn);
    this.addDisposable(dispose);
  }

  protected createElement<T extends UIElement>(creator: () => T): T {
    const element: T = creator();
    this.addDisposable(element.dispose);
    return element;
  }

  /**
   * Adds a disposable function that will be called when dispose() is called.
   */
  protected addDisposable(dispose: Dispose): void {
    this._disposables.push(dispose);
  }

  /**
   * Disposes all registered disposables and clears the set.
   */
  public dispose = (): void => {
    for (const dispose of this._disposables) {
      dispose();
    }
    this._disposables = [];
  };
}
