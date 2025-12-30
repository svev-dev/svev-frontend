import { effect, signal } from '../signals/signals';
import { UIElement } from './UIElement';

export class Paragraph extends UIElement {
  public text = signal('');

  public override createUI(): HTMLElement {
    const element = <HTMLParagraphElement>document.createElement('p');
    effect(() => {
      element.textContent = this.text();
    });
    return element;
  }
}
