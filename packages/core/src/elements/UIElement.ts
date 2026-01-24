import { AutoDisposal } from '../AutoDisposal';
import { DisposeCollection } from '../DisposeCollection';
import type { ReadonlySignal } from '../signals/signals';
import { effect, signal, untracked } from '../signals/signals';
import type { Dispose } from '../types';
import { last, reverse, toArray } from '../utils/array';
import { IS_DEV } from '../utils/isDev';
import { randomString } from '../utils/Random';
import type { IPropertyRegister } from './IPropertyRegister';
import type { Property } from './Property';
import { property } from './Property';

export type Element = UIElement | ChildNode;

/**
 * This is the base class for all UI elements.
 * It takes care of rendering the UIElement and disposing of it.
 * In addition, it provides common properties like `id`, `isVisible`, `isEnabled` and styling.
 */
export abstract class UIElement {
  public readonly id = this.prop(randomString(8));
  public readonly isVisible = this.prop(true);
  public readonly isEnabled = this.prop(true);

  #isDisposed = false;
  #beingRendered = false;
  #isCreatingUI = false;
  #renderedElements: readonly [Element, Unrender][] = [];
  #onUnrender: VoidFunction[] = [];
  #lastApplyClassesToElement: HTMLElement | undefined;
  readonly #disposeCollection = new DisposeCollection();
  readonly #renderDisposeCollection = new DisposeCollection();
  readonly #dummyNode = document.createComment('dummy');
  readonly #triggerRender = signal(0);
  readonly #classList = signal<string[]>([]);

  public constructor() {
    AutoDisposal.instance.register(this, this.#disposeCollection);
    AutoDisposal.instance.register(this, this.#renderDisposeCollection);
  }

  /**
   * This is a virtual method that must be implemented by the subclass.
   * `createUI` is called when the UIElement is rendered, and can return a single element or a list of elements.
   * Supported elements are `UIElement` and `ChildNode` (DOM nodes).
   * All calls to `this.addDisposable` called inside `createUI` will be disposed in these scenarios:
   * 1. The return function from `render` (unrender) is called.
   * 2. `UIElement.rerender` is called.
   * 3. The UIElement is disposed.
   */
  protected abstract createUI(): Element | readonly Element[];

  /**
   * Renders the UIElement in the DOM, and will render until the return function is called, or the UIElement is disposed.
   * @param placement Option for where the element should render.
   * @returns A unrender function, which will cause the UIElement to be removed from the DOM, and dispose effects created inside `createUI`.
   *
   * @throws If the UIElement is already being rendered.
   */
  public render(placement: ElementPlacement): Unrender {
    if (this.#beingRendered) {
      throw new Error(IS_DEV ? 'UIElement is being rendered already' : '');
    }
    if (this.#isDisposed) {
      throw new Error(IS_DEV ? 'UIElement is disposed. Cannot render.' : '');
    }
    this.#beingRendered = true;

    const elementsToRender = signal<readonly Element[]>([]);
    const dispose = effect(() => {
      // We only call this signal to react to `rerender` calls.
      this.#triggerRender();

      if (!this.isVisible()) {
        elementsToRender([]);
        return;
      }

      // We don't want to listen to signals in createUI to rerender.
      // Instead, one must call `rerender` to rerender the UIElement.
      untracked(() => {
        let elements: Element | readonly Element[];
        try {
          this.#isCreatingUI = true;
          elements = this.createUI();
        } finally {
          this.#isCreatingUI = false;
        }
        elementsToRender(toArray(elements));
      });
    });

    const unrenderList = this.#renderList(elementsToRender, placement);

    this.#renderDisposeCollection.add(() => {
      dispose();
      unrenderList();
      this.#beingRendered = false;
      this.#onUnrender.forEach((fn) => fn());
      this.#onUnrender = [];
    });

    return () => this.#renderDisposeCollection.dispose();
  }

  public onUnrender(fn: VoidFunction): this {
    this.#onUnrender.push(fn);
    return this;
  }

  public addClass(...classNames: string[]): this {
    const current = this.#classList.peek();
    this.#classList([...current, ...classNames]);
    return this;
  }

  public removeClass(className: string): this {
    const current = this.#classList.peek();
    this.#classList(current.filter((c) => c !== className));
    return this;
  }

  protected applyClassesTo(element: HTMLElement, classes: readonly string[] = []): void {
    if (IS_DEV) {
      if (
        this.#lastApplyClassesToElement !== undefined &&
        this.#lastApplyClassesToElement !== element
      ) {
        throw new Error(
          'applyClassesTo is called on multiple elements in the same `createUI` call. Something is wrong, and the expected usage is to only call it on the top-level element.'
        );
      }
      this.#lastApplyClassesToElement = element;
      this.#renderDisposeCollection.add(() => {
        this.#lastApplyClassesToElement = undefined;
      });
    }
    const classList = this.#classList();
    element.className = [...classes, ...classList].filter(Boolean).join(' ');
  }

  /**
   * Inserts `nodeToInsert` before this UIElement.
   * @param nodeToInsert
   */
  public before(nodeToInsert: Node): void {
    this.#insertBeforeOrAfter(nodeToInsert, 'before');
  }

  /**
   * Inserts `nodeToInsert` after this UIElement.
   * @param nodeToInsert
   */
  public after(nodeToInsert: Node): void {
    this.#insertBeforeOrAfter(nodeToInsert, 'after');
  }

  /**
   * Moves the UIElement to the given placement. The UIElement must be rendering.
   * @param placement
   */
  public move(placement: ElementPlacement): void {
    // We require this UIElement to be rendered.
    if (!this.#beingRendered) {
      throw new Error(IS_DEV ? 'UIElement is not being rendered' : '');
    }

    if ('before' in placement) {
      this.#moveBefore(placement.before);
    } else if ('after' in placement) {
      this.#moveAfter(placement.after);
    } else {
      this.#moveInside(placement.in);
    }
  }

  /**
   * This is called when the UIElement must be rerendered.
   * A use-case is that the top-level HTML element is changing.
   * Calling this only has effect if the UIElement is being rendered.
   */
  protected rerender(): void {
    if (!this.#beingRendered) {
      return;
    }
    this.#triggerRender(this.#triggerRender.peek() + 1);
  }

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

  /**
   * Watches one or more signals and calls `rerender()` when any of them change.
   * This is a convenience method for the common pattern of watching signals and rerendering on change.
   * The first run is automatically skipped to avoid rerendering during the initial render.
   *
   * @example
   * ```ts
   * protected createUI(): Element {
   *   this.watchAndRerender(this.#childSignal, this.#countSignal);
   *   // ... rest of createUI
   * }
   * ```
   *
   * @param signals One or more signals to watch for changes
   */
  protected watchAndRerender(...signals: ReadonlySignal<unknown>[]): void {
    let firstRun = true;
    this.effect(() => {
      // Access all signals to create dependencies
      for (const signal of signals) {
        signal();
      }
      if (firstRun) {
        firstRun = false;
        return;
      }
      this.rerender();
    });
  }

  /**
   * Adds a disposable function. If `addDisposable` is called inside `createUI`, the disposable will be disposed when the UIElement is unrendered, rerendered or disposed.
   * Otherwise, the disposable will only be disposed when the UIElement is disposed.
   */
  protected addDisposable(dispose: Dispose): void {
    if (this.#isCreatingUI) {
      this.#renderDisposeCollection.add(dispose);
      return;
    }
    this.#disposeCollection.add(dispose);
  }

  /**
   * Disposes all registered disposables.
   * It is no longer safe to render the UIElement after it has been disposed.
   */
  public dispose = (): void => {
    if (this.#beingRendered) {
      throw new Error(
        IS_DEV
          ? 'UIElement is being rendered. Dispose forbidden. Please call `unrender` first.'
          : ''
      );
    }
    this.#disposeCollection.dispose();
    this.#isDisposed = true;
  };

  /**
   * Creates a property (slightly modified signal) tied to this UIElement. We tie the property to the UIElement to make calls to it chainable and more ergonomic.
   * @example
   * ```ts
   * class MyElement extends UIElement {
   *   public readonly label = this.prop('');
   *   public readonly description = this.prop<string | undefined>(undefined);
   * }
   *
   * const myElement = new MyElement()
   *   .label('Hello, world!')
   *   .description('This is a description');
   * ```
   */
  protected prop<T>(value: T): Property<T, this> {
    return property(value, this);
  }

  /**
   * Renders a dynamic list of elements (UIElement or ChildNode) to the given `placement`.
   *
   * **How it works**
   *
   * First of all, we must always render at least one HTML node to keep track of which position we must render to.
   *
   * We start by rendering a dummy comment node.
   * The dummy node is used to keep track of the position we must render to.
   *
   * As we go, we keep track of the elements we have rendered (`renderedElements`), and its dispose method which removes it from the DOM and disposes it.
   *
   * We start an `effect` with the following steps:
   *
   * 1. We call the elements signals (`elements()`) to get the list of elements to render. We store the list in `elementsToRender`.
   * 2. We place the dummy node before the first element in `renderedElements`. This act as an anchor.
   * 3. We detect which elements in `renderedElements` are not present in `elementsToRender`. Dispose them.
   * 4. Iterate over each element in `elementsToRender`.
   *    - If the element is already present in the DOM at the correct position -> do nothing.
   *    - If the element is already present in the DOM at the incorrect position -> move it to the correct position.
   *    - Otherwise, we call `.render()` on the element, and insert the element at the correct position in `parentNode`.
   * 5. Remove the dummy node if `elementsToRender` is non-empty (no need for the anchor anymore).
   *
   * @param elements The list of elements to render.
   * @param placement Options for positioning the elements when rendering.
   * @returns A disposable function that can be called to remove the list from the DOM.
   */
  #renderList(elements: ReadonlySignal<readonly Element[]>, placement: ElementPlacement): Unrender {
    // Sanity check
    if (this.#renderedElements.length > 0) {
      throw new Error(IS_DEV ? '#renderedElements is not empty when rendering a list' : '');
    }

    this.#insert(this.#dummyNode, placement);
    this.#renderedElements = [[this.#dummyNode, (): void => this.#dummyNode.remove()]];

    const dispose = effect(() => {
      // Step 1
      const elementsToRender = elements();

      // Step 2
      const firstRenderedElement = this.#renderedElements[0];
      if (firstRenderedElement !== undefined && firstRenderedElement[0] !== this.#dummyNode) {
        firstRenderedElement[0].before(this.#dummyNode);
      } else {
        // The dummy node is already rendered.
      }

      // Step 3
      this.#renderedElements = this.#renderedElements.filter(([element, unrender]) => {
        if (element === this.#dummyNode) {
          return true;
        }
        const isInElementsToRender = elementsToRender.includes(element);
        if (!isInElementsToRender) {
          unrender();
        }
        return isInElementsToRender;
      });

      // Step 4
      let renderedElementsIndex = 0;
      let lastRenderedElement: Element = this.#dummyNode;
      const newRenderedElements: [Element, Unrender][] = [];
      for (const element of elementsToRender) {
        const renderedElement = this.#renderedElements[renderedElementsIndex];
        if (element === renderedElement?.[0]) {
          // The element is already present in the DOM at the correct position. Nothing to add to the DOM.
          renderedElementsIndex++;
          lastRenderedElement = element;
          newRenderedElements.push(renderedElement);
          continue;
        }

        const existingRenderedElement = this.#renderedElements.find(([el]) => el === element);
        if (existingRenderedElement !== undefined) {
          this.#insert(element, { after: lastRenderedElement });
          lastRenderedElement = element;
          newRenderedElements.push(existingRenderedElement);
          continue;
        }

        // New element, not being rendered yet. Render it.
        if (element instanceof UIElement) {
          const unrender = element.render({ after: lastRenderedElement });
          newRenderedElements.push([element, unrender]);
        } else {
          this.#insert(element, { after: lastRenderedElement });
          newRenderedElements.push([element, (): void => element.remove()]);
        }
        lastRenderedElement = element;
      }

      // Step 5
      if (elementsToRender.length > 0) {
        this.#dummyNode.remove();
      } else {
        newRenderedElements.push([this.#dummyNode, (): void => this.#dummyNode.remove()]);
      }

      this.#renderedElements = newRenderedElements;
    });

    return () => {
      dispose();
      this.#dummyNode.remove();
      this.#renderedElements.forEach(([_element, unrender]) => unrender());
      this.#renderedElements = [];
    };
  }

  #insert(elementToInsert: Element, placement: ElementPlacement): void {
    const isUIElement = elementToInsert instanceof UIElement;
    if (!isUIElement) {
      this.#moveNode(elementToInsert, placement);
      return;
    }
    elementToInsert.move(placement);
  }

  #moveNode(nodeToMove: Node, placement: ElementPlacement): void {
    if ('before' in placement) {
      placement.before.before(nodeToMove);
    } else if ('after' in placement) {
      placement.after.after(nodeToMove);
    } else {
      placement.in.appendChild(nodeToMove);
    }
  }

  #moveBefore(referenceElement: ChildNode | UIElement): void {
    for (const [element] of this.#renderedElements) {
      if (element instanceof UIElement) {
        element.move({ before: referenceElement });
      } else {
        referenceElement.before(element);
      }
    }
  }

  #moveAfter(referenceElement: ChildNode | UIElement): void {
    for (const [element] of reverse(this.#renderedElements)) {
      if (element instanceof UIElement) {
        element.move({ after: referenceElement });
      } else {
        referenceElement.after(element);
      }
    }
  }

  #moveInside(referenceElement: Node): void {
    for (const [element] of this.#renderedElements) {
      if (element instanceof UIElement) {
        element.move({ in: referenceElement });
      } else {
        referenceElement.appendChild(element);
      }
    }
  }

  /**
   * Inserts `nodeToInsert` before or after this UIElement.
   * @param nodeToInsert
   */
  #insertBeforeOrAfter(nodeToInsert: Node, placement: 'before' | 'after'): void {
    // We require this UIElement to be rendered.
    if (!this.#beingRendered) {
      throw new Error(IS_DEV ? 'UIElement is not being rendered' : '');
    }

    const isBefore = placement === 'before';

    const referenceElement = isBefore
      ? this.#renderedElements[0]?.[0]
      : last(this.#renderedElements)?.[0];
    if (referenceElement === undefined) {
      throw new Error(IS_DEV ? 'UIElement is rendered but has no rendered elements' : '');
    }

    // Recursive
    if (isBefore) {
      referenceElement.before(nodeToInsert);
    } else {
      referenceElement.after(nodeToInsert);
    }
  }
}

type Unrender = VoidFunction;

/**
 * Options for positioning the element when rendering.
 */
type ElementPlacement =
  | {
      /**
       * Insert the element inside this reference node (append to the end).
       */
      in: Node;
    }
  | {
      /**
       * Insert the element before this reference node.
       */
      before: Element;
    }
  | {
      /**
       * Insert the element after this reference node.
       */
      after: Element;
    };
