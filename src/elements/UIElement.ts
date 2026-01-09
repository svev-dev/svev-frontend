import { effect, ReadonlySignal, signal, untracked } from '../signals/signals';
import { Dispose } from '../types';
import { last, reverse, toArray } from '../utils/array';
import { IS_DEV } from '../utils/isDev';
import { randomString } from '../utils/Random';
import { IPropertyRegister } from './IPropertyRegister';
import { Property, property } from './Property';

export type Element = UIElement | ChildNode;
type Unrender = VoidFunction;

export abstract class UIElement {
  public readonly id = this.prop(randomString(8));
  public readonly isVisible = this.prop(true);
  public readonly isEnabled = this.prop(true);

  #disposables: Dispose[] = [];
  #renderDisposables: Dispose[] = [];
  #beingRendered = false;
  #isCreatingUI = false;
  #renderedElements: readonly [Element, Unrender][] = [];
  readonly #dummyNode = document.createComment('dummy');
  readonly #triggerRender = signal(0);

  /**
   * The one that calls `createUI` owns the UIElement and is responsible for calling `dispose`.
   */
  protected abstract createUI(): Element | readonly Element[];

  /**
   * Renders the UIElement inside the parent node.
   * @param placement Options for positioning the element when rendering. If not provided, the element will be appended to the end of the parent node.
   * @returns A disposable function that can be called to remove the UIElement from the DOM, and dispose the UIElement.
   */
  public render(placement: ElementPlacement): Unrender {
    if (this.#beingRendered) {
      throw new Error(IS_DEV ? 'UIElement is being rendered already' : '');
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
        this.#isCreatingUI = true;
        const elements = this.createUI();
        this.#isCreatingUI = false;
        elementsToRender(toArray(elements));
      });
    });

    const unrenderList = this.#renderList(elementsToRender, placement);

    this.#renderDisposables.push(() => {
      dispose();
      unrenderList();
      this.#beingRendered = false;
    });

    return () => this.#disposeRender();
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
   * This will dispose all disposables and call createUI.
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

  protected createElement<T extends UIElement>(creator: () => T): T {
    const element: T = creator();
    this.addDisposable(element.dispose);
    return element;
  }

  /**
   * Adds a disposable function that will be called when dispose() is called.
   */
  protected addDisposable(dispose: Dispose): void {
    if (this.#isCreatingUI) {
      this.#renderDisposables.push(dispose);
      return;
    }
    this.#disposables.push(dispose);
  }

  /**
   * Disposes all registered disposables and clears the set.
   */
  protected dispose = (): void => {
    this.#disposeRender();
    for (const dispose of this.#disposables) {
      dispose();
    }
    this.#disposables = [];
  };

  /**
   * Helper method to create a property without explicitly passing `this`.
   * Usage: `public label = this.prop('');`
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

  #disposeRender(): void {
    for (const dispose of this.#renderDisposables) {
      dispose();
    }
    this.#renderDisposables = [];
  }
}

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
