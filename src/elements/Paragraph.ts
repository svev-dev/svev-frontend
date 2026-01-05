import { UIElement } from './UIElement';

export class Paragraph extends UIElement {
  public readonly text = this.prop('');

  public override createUI(): HTMLElement {
    const element = document.createElement('p');
    this.effect(() => {
      element.textContent = this.text();
    });
    return element;
  }
}
