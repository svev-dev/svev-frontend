import type { ReadonlySignal } from '../signals/signals';
import { signal } from '../signals/signals';
import { MultiMap } from '../utils/MultiMap';
import { Fragment } from './Fragment';
import { UIElement } from './UIElement';

export abstract class Container extends UIElement {
  protected readonly fragment = new Fragment();

  public setChildren(children: readonly UIElement[]): this {
    this.fragment.setChildren(children);
    return this;
  }

  public addChild(children: UIElement): this {
    this.fragment.addChild(children);
    return this;
  }

  public mapChildren<T>(items: ReadonlySignal<readonly T[]>, map: (item: T) => UIElement): this {
    const elements = this.#createAndUpdateUIElementList(items, map);
    this.effect(() => {
      this.setChildren(elements());
    });
    return this;
  }

  #createAndUpdateUIElementList<T>(
    items: ReadonlySignal<readonly T[]>,
    map: (item: T) => UIElement
  ): ReadonlySignal<readonly UIElement[]> {
    const result = signal<UIElement[]>([]);
    const elementCache = new MultiMap<T, UIElement>();

    this.effect(() => {
      const itemsToRender = items();
      const elements: [T, UIElement][] = [];

      // Step 1: reuse or create UIElement
      for (const item of itemsToRender) {
        const cachedElement = elementCache.popFirst(item);
        // TODO: verify the newly created element gets disposed (hint: use onUnrender).
        const element = cachedElement || map(item);
        elements.push([item, element]);
      }
      elementCache.clear();

      // Step 2: update cache
      elements.forEach(([items, element]) => elementCache.insert(items, element));

      // Step 3: update result
      result(elements.map(([_, element]) => element));
    });

    return result;
  }
}
