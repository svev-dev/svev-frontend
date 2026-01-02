import { effect, signal } from '../signals/signals';
import { UIElement } from './UIElement';

export class Text extends UIElement {
  public text = signal('');
  public bold = signal(false);

  public override createUI(): HTMLElement {
    const span = document.createElement('span');
    
    effect(() => {
      if (this.bold()) {
        span.innerHTML = `<strong>${this.text()}</strong>`;
      } else {
        span.textContent = this.text();
      }
    });
    
    return span;
  }
}
