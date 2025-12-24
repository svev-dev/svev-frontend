import { effect, signal } from '../signals/signals';
import { UIElement } from './UIElement';

export class Text extends UIElement {
  public text = signal('');

  public override createUI(): ChildNode {
    const element = document.createTextNode(this.text());
    effect(() => {
      element.textContent = this.text();
    });
    return element;
  }
}
