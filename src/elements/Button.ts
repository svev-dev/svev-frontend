import { effect, signal } from '../signals/signals';
import { UIElement } from './UIElement';

export class Button extends UIElement {
  public label = signal('');
  public isEnabled = signal(true);
  public onAction?: VoidFunction;

  public override createUI(): HTMLElement {
    const button = <HTMLButtonElement>document.createElement('button');
    button.role = 'button';
    button.className = 'btn btn-primary';
    effect(() => {
      button.innerText = this.label();
      button.disabled = !this.isEnabled();
    });
    button.onclick = () => {
      this.onAction?.();
    };
    return button;
  }
}
