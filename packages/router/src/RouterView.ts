import { Container, Element, ReadonlySignal, signal } from 'svev-frontend';
import { UIElement } from 'svev-frontend';

/**
 * RouterView (also known as Outlet) is a component that renders the matched child route.
 * Place this component in layout elements to render nested route content.
 *
 * @example
 * ```ts
 * const layout = new Container().setChildren([
 *   new Text('Header'),
 *   new RouterView(), // Child routes will be rendered here
 *   new Text('Footer'),
 * ]);
 *
 * router.addWithLayout('/users', layout, (match) => {
 *   return new Text('User content');
 * });
 * ```
 */
export class RouterView extends Container {
  private readonly content = signal<UIElement | null>(null);

  constructor() {
    super();
    this.effect(() => {
      const element = this.content();
      if (element) {
        this.setChildren([element]);
      } else {
        this.setChildren([]);
      }
    });
  }

  protected createUI(): Element {
    // Return the fragment which will render the children
    return this.fragment;
  }

  /**
   * Sets the content to render. This is called internally by the Router.
   * @internal
   */
  setContent(element: UIElement | null): void {
    this.content(element);
  }

  /**
   * Gets the current content signal. Used by Router to update the content.
   * @internal
   */
  getContentSignal(): ReadonlySignal<UIElement | null> {
    return this.content;
  }
}
