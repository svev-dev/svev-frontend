import { signal } from '../signals/signals';
import { Element, UIElement } from './UIElement';

export class Fragment extends UIElement {
  readonly #children = signal<readonly Element[]>([]);

  public setChildren(children: readonly Element[]): void {
    this.#children(children);
    this.rerender();
  }

  public getChildren(): readonly Element[] {
    return this.#children();
  }

  protected createUI(): readonly Element[] {
    return this.#children();
  }
}
