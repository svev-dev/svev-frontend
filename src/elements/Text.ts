import { Element, UIElement } from './UIElement';

export class Text extends UIElement {
  public readonly text = this.prop('');
  public readonly bold = this.prop(false);

  protected createUI(): Element {
    const span = document.createElement('span');

    this.effect(() => {
      if (this.bold()) {
        // TODO: security risk (XSS attack)
        span.innerHTML = `<strong>${this.text()}</strong>`;
      } else {
        span.textContent = this.text();
      }
    });

    return span;
  }
}
