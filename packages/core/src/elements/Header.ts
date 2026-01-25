import type { Element } from './UIElement';
import { UIElement } from './UIElement';

export class Header extends UIElement {
  public readonly text = this.prop('');

  protected createUI(): Element {
    const element = document.createElement('h3');
    this.effect(() => {
      this.applyClassesTo(element, ['text-lg', 'font-bold']);
      element.textContent = this.text();
    });
    return element;
  }
}
