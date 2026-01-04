import { effect } from '../signals/signals';
import { Dispose } from '../types';
import { Property, property } from './Property';

export abstract class UIElement {
  public readonly isEnabled = this.prop(true);

  private _disposables: Dispose[] = [];

  /**
   * Helper method to create a property without explicitly passing `this`.
   * Usage: `public label = this.prop('');`
   */
  protected prop<T>(value: T): Property<T, this> {
    return property(value, this);
  }

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
