import { effect, signal } from '../signals/signals';
import { UIElement } from './UIElement';

export class Text extends UIElement {
  public text = signal('');

  public override createUI(): HTMLElement {
    const element = <HTMLParagraphElement>document.createElement('p');
    effect(() => {
      element.innerText = this.text();
    });
    return element;
  }
}
