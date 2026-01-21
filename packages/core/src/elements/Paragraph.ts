import type { Element } from './UIElement';
import { UIElement } from './UIElement';

export class Paragraph extends UIElement {
  public readonly text = this.prop('');

  protected createUI(): Element {
    const element = document.createElement('p');
    this.effect(() => {
      this.applyClassesTo(element);
      element.textContent = this.text();
    });
    return element;
  }
}
