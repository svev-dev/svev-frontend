import { signal } from '../signals/signals';
import type { Element } from './UIElement';
import { UIElement } from './UIElement';

export class Fragment extends UIElement {
  readonly #children = signal<readonly Element[]>([]);

  public setChildren(children: readonly Element[]): this {
    this.#children(children);
    this.rerender();
    return this;
  }

  public addChild(child: Element): this {
    this.#children([...this.#children.peek(), child]); // Create new array to trigger signal
    this.rerender();
    return this;
  }

  public getChildren(): readonly Element[] {
    return this.#children();
  }

  protected createUI(): readonly Element[] {
    return this.#children();
  }
}
