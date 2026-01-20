import type { Element } from '../elements/UIElement';
import { UIElement } from '../elements/UIElement';
import type { ReadonlySignal } from '../signals/signals';

/**
 * Slot (similar to Outlet in React Router) is an element that renders the matched child route.
 * Place this element in layout elements to render nested route content.
 */
export class Slot extends UIElement {
  readonly #childSignal: ReadonlySignal<UIElement | null>;

  /**
   * We pass `childSignal` to the constructor which represents a dynamic child element to render (or nothing).
   * We pass it in the constructor because only the creators of the `Slot` can change the child element.
   * @param childSignal
   */
  public constructor(childSignal: ReadonlySignal<UIElement | null>) {
    super();
    this.#childSignal = childSignal;
  }

  protected createUI(): Element | readonly Element[] {
    this.watchAndRerender(this.#childSignal);

    const child = this.#childSignal();
    return child !== null ? child : [];
  }
}
