import { signal } from '../signals/signals';

export class CSSStyle<Self> {
  readonly #self: Self;
  readonly #style = signal<Partial<CSSStyleDeclaration>>({});

  public constructor(self: Self) {
    this.#self = self;
  }

  /**
   * Sets the CSS styles, replacing all existing styles.
   * @param styles Object with CSS property-value pairs
   */
  public setCss(styles: Partial<CSSStyleDeclaration>): Self {
    this.#style({ ...styles });
    return this.#self;
  }

  /**
   * Adds or merges CSS styles with existing styles.
   * @param styles Object with CSS property-value pairs to merge
   */
  public addCss(styles: Partial<CSSStyleDeclaration>): Self {
    const current = this.#style.peek();
    this.#style({ ...current, ...styles });
    return this.#self;
  }

  /**
   * Applies the current styles to an HTML element.
   * This method directly assigns styles to the element's style property.
   * @param element The HTML element to apply styles to
   */
  public applyTo(element: HTMLElement): void {
    const styles = this.#style();
    Object.assign(element.style, styles);
  }
}
