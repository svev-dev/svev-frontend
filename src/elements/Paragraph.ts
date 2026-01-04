import { signal } from '../signals/signals';
import { UIElement } from './UIElement';

export class Paragraph extends UIElement {
  public text = signal('');

  public override createUI(): HTMLElement {
    const element = <HTMLParagraphElement>document.createElement('p');
    this.effect(() => {
      element.textContent = this.text();
    });
    return element;
  }
}
