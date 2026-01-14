import { escapeHTML } from '../utils/html';
import { Element, UIElement } from './UIElement';

export class Text extends UIElement {
  public readonly text = this.prop('');
  public readonly bold = this.prop(false);

  protected createUI(): Element {
    const span = document.createElement('span');

    this.effect(() => {
      if (this.bold()) {
        span.innerHTML = `<strong>${escapeHTML(this.text())}</strong>`;
      } else {
        span.textContent = this.text();
      }
    });

    return span;
  }
}
