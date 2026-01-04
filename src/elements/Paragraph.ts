import { UIElement } from './UIElement';

export class Paragraph extends UIElement {
  public text = this.prop('');

  public override createUI(): HTMLElement {
    const element = <HTMLParagraphElement>document.createElement('p');
    this.effect(() => {
      element.textContent = this.text();
    });
    return element;
  }
}
