import { ReadonlySignal, Signal, signal } from '../signals/signals';
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
    const elements = this.createAndUpdateUIElementList(items, map);
    this.effect(() => {
      this._children(elements());
    });
  }

  private createAndUpdateUIElementList<T>(
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

  /**
   *
   * This renders a dynamic list (items) to the given parentNode.
   * The items is of any type, but a map is given to map from T to UIElement.
   *
   * To render a list of items of type T, we do the following:
   * Store previous rendered HTML Nodes using the NodeCache. They are stored using a map (T -> Node[]).
   * We generate two dummy DOM nodes, representing start and the beginning of the list (there way be multiple lists under the same parent node).
   *
   * Step 1: detect which DOM nodes we should remove from the DOM.
   *   We go over all items. For each item, we try to get corresponding DOM Node from the NodeCache.
   *   If there is an entry in the NodeCache, we use it, and remove it from the cache. Otherwise, we create the DOM Node using the provided map function.
   *   We populate an array `nodes` as we go, which represents the nodes to be rendered to the DOM in correct order.
   *   After we have finished this process, the remaining nodes in the NodeCache should be removed from DOM, and the NodeCache should be cleared.
   *
   * Step 2: render nodes to the DOM in correct order
   *   We use the `nodes` array from step 1 to render nodes to DOM in correct order. If the node is already present in the DOM, then the browser will handle this and move the existing node to the correct location.
   *   We attach nodes to the DOM by using `insertBefore`. We use a pointer, pointing to the element in the DOM which should appear after our node (we start by setting this to the start-node + 1).
   *   We iterate over each node, if the node is not the same node as we point at, we insert the node before the pointer. If there is a match, we skip, and increase our DOM pointer.
   *
   * Step 3: update NodeCache
   *   We will add each node from the `nodes` array into the NodeCache.
   *
   */
  protected renderList(
    parentNode: HTMLElement,
    elements: ReadonlySignal<readonly UIElement[]>
  ): void {
    const start = document.createComment('start');
    const end = document.createComment('end');
    parentNode.appendChild(start);
    parentNode.appendChild(end);

    const nodeCache = new MultiMap<UIElement, ChildNode>();

    const cleanup = (): void => {
      const entriesToBeRemoved = nodeCache.getAllEntries();
      entriesToBeRemoved.forEach(([element, nodes]) => {
        nodes.forEach((node) => node.remove());
        element.dispose();
      });
      nodeCache.clear();
    };

    this.effect(() => {
      const elementsToRender = elements();
      const nodes: [UIElement, ChildNode][] = [];

      // Step 1
      for (const element of elementsToRender) {
        const cachedNode = nodeCache.popFirst(element);
        const node = cachedNode || element.createUI();
        nodes.push([element, node]);
      }
      cleanup();

      // Step 2
      let domPointer = start.nextSibling;
      nodes.forEach(([_item, node]) => {
        if (node === domPointer) {
          // The view is already present in the DOM at the current location. Nothing to add to the DOM.
          // Move the domPointer to the next element;
          domPointer = domPointer.nextSibling;
          return;
        }

        parentNode.insertBefore(node, domPointer);
      });

      // Step 3
      nodes.forEach(([items, node]) => nodeCache.insert(items, node));
    });

    this.addDisposable(() => {
      cleanup();
      start.remove();
      end.remove();
    });
  }
}
