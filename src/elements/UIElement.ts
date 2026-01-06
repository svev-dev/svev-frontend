import { effect } from '../signals/signals';
import { Dispose } from '../types';
import { IS_DEV } from '../utils/isDev';
import { randomString } from '../utils/Random';
import { IPropertyRegister } from './IPropertyRegister';
import { Property, property } from './Property';

export abstract class UIElement {
  public readonly id = this.prop(randomString(8));
  public readonly isVisible = this.prop(true);
  public readonly isEnabled = this.prop(true);

  #_disposables: Dispose[] = [];

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

  public registerProperties(register: IPropertyRegister): void {
    if (IS_DEV) {
      register.addHeader('UIElement');
      register.addBool('Is Visible', this.isVisible);
      register.addBool('Is Enabled', this.isEnabled);
    }
  }

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
    this.#_disposables.push(dispose);
  }

  /**
   * Disposes all registered disposables and clears the set.
   */
  public dispose = (): void => {
    for (const dispose of this.#_disposables) {
      dispose();
    }
    this.#_disposables = [];
  };
}
