import { Element, UIElement } from './UIElement';

export class Paragraph extends UIElement {
  public readonly text = this.prop('');

  protected createUI(): Element[] {
    const element = document.createElement('p');
    this.effect(() => {
      element.textContent = this.text();
    });
    return [element];
  }
}
