import { UIElement } from './UIElement';

export class Text extends UIElement {
  public readonly text = this.prop('');
  public readonly bold = this.prop(false);

  public override createUI(): HTMLElement {
    const span = document.createElement('span');

    this.effect(() => {
      if (this.bold()) {
        span.innerHTML = `<strong>${this.text()}</strong>`;
      } else {
        span.textContent = this.text();
      }
    });

    return span;
  }
}
