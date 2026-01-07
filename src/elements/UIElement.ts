import { effect, signal } from '../signals/signals';
import { Dispose } from '../types';
import { IS_DEV } from '../utils/isDev';
import { randomString } from '../utils/Random';
import { IPropertyRegister } from './IPropertyRegister';
import { Property, property } from './Property';

export abstract class UIElement {
  public readonly id = this.prop(randomString(8));
  public readonly isVisible = this.prop(true);
  public readonly isEnabled = this.prop(true);

  #disposables: Dispose[] = [];
  #isBeingRendered = false;
  readonly #triggerRender = signal(0);

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

  /**
   * Renders the UIElement inside the parent node.
   * @param parentNode The parent node to render the UIElement inside.
   * @param options Options for positioning the element when rendering. If not provided, the element will be appended to the end of the parent node.
   * @returns A disposable function that can be called to remove the UIElement from the DOM, and dispose the UIElement.
   */
  public render(parentNode: Node, options?: RenderOptions): Dispose {
    if (this.#isBeingRendered) {
      throw new Error(IS_DEV ? 'UIElement is already being rendered' : '');
    }
    this.#isBeingRendered = true;

    let currentNode: ChildNode | undefined = undefined;

    const dispose = effect(() => {
      this.#triggerRender(); // To make it reactive

      const newNode = this.#getNode();
      if (currentNode !== undefined) {
        // If we are rerendering, we replace the current node with the new node.
        currentNode.replaceWith(newNode);
      } else {
        // The first time we render, position the node according to options.
        this.#insertNode(parentNode, newNode, options);
      }
      currentNode = newNode;

      return this.dispose;
    });

    return () => {
      dispose();
      currentNode?.remove();
      this.#isBeingRendered = false;
    };
  }

  #insertNode(parentNode: Node, node: Node, options?: RenderOptions): void {
    if (options && 'before' in options) {
      parentNode.insertBefore(node, options.before);
    } else if (options && 'after' in options) {
      const nextSibling = options.after.nextSibling;
      // If nextSibling is null (after is the last child), insertBefore appends to the end
      parentNode.insertBefore(node, nextSibling);
    } else {
      // Default: append to the end
      parentNode.appendChild(node);
    }
  }

  #getNode(): ChildNode {
    if (this.isVisible()) {
      return this.createUI();
    }
    return document.createComment('hidden');
  }

  // This is called when the UIElement must be rerendered.
  // A use-case is that the top-level HTML element is changing.
  // Calling this only has effect if the UIElement is being rendered.
  // This will dispose all disposables and call createUI.
  protected rerender(): void {
    if (!this.#isBeingRendered) {
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
    this.#disposables.push(dispose);
  }

  /**
   * Disposes all registered disposables and clears the set.
   */
  public dispose = (): void => {
    for (const dispose of this.#disposables) {
      dispose();
    }
    this.#disposables = [];
  };
}

/**
 * Options for positioning the element when rendering.
 */
type RenderOptions =
  | {
      /**
       * Insert the element before this reference node.
       */
      before: Node;
    }
  | {
      /**
       * Insert the element after this reference node.
       */
      after: Node;
    };
