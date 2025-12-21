import { BaseElement } from '../elements/BaseElement';

export abstract class BaseView<T extends BaseElement = BaseElement> {
  public readonly element: T;
  private _cleanups: VoidFunction[] = [];

  constructor(el: T) {
    this.element = el;
  }

  public abstract get htmlElement(): HTMLElement;

  public dispose(): void {
    this._cleanups.forEach((cleanup) => cleanup());
    this._cleanups = [];
  }

  protected onDispose(cleanup: VoidFunction): void {
    this._cleanups.push(cleanup);
  }
}
