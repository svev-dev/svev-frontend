import { effect, ReadonlySignal, Signal, signal } from '../signals/signals';
import { MultiMap } from '../utils/MultiMap';
import { UIElement } from './UIElement';

export abstract class Container extends UIElement {
  private _children: Signal<readonly UIElement[]>;

  public constructor(children: readonly UIElement[]) {
    super();
    this._children = signal(children);
  }

  public get children(): ReadonlySignal<readonly UIElement[]> {
    return this._children;
  }

  public setChildren(children: readonly UIElement[]): void {
    this._children(children);
  }

  public mapChildren<T>(items: ReadonlySignal<readonly T[]>, map: (item: T) => UIElement): void {
    const elements = createAndUpdateUIElementList(items, map);
    effect(() => {
      this._children(elements());
    });
  }
}

function createAndUpdateUIElementList<T>(
  items: ReadonlySignal<readonly T[]>,
  map: (item: T) => UIElement
): ReadonlySignal<readonly UIElement[]> {
  const result = signal<UIElement[]>([]);
  const elementCache = new MultiMap<T, UIElement>();

  effect(() => {
    const itemsToRender = items();
    const elements: [T, UIElement][] = [];

    // Step 1: reuse or create UIElement
    for (const item of itemsToRender) {
      const cachedElement = elementCache.popFirst(item);
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
