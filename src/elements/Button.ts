import { effect, signal } from '../signals/signals';
import { UIElement } from './UIElement';

export class Button extends UIElement {
  public label = signal('');
  public size = signal<Size>('md');
  public variant = signal<Variant | undefined>(undefined);
  public isEnabled = signal(true);
  public onAction?: VoidFunction;

  public override createUI(): HTMLElement {
    const button = <HTMLButtonElement>document.createElement('button');
    button.role = 'button';
    const baseClassName = ['btn'];
    effect(() => {
      button.innerText = this.label();
      button.disabled = !this.isEnabled();
      const classNames = [...baseClassName];

      const size = this.size();
      if (size !== 'md') {
        classNames.push(`btn-${size}`);
      }

      const variant = this.variant();
      if (variant !== undefined) {
        classNames.push(`btn-${variant}`);
      }
      button.className = classNames.join(' ');
    });
    button.onclick = () => {
      this.onAction?.();
    };
    return button;
  }
}

type Variant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'
  | 'link';

type Size = 'sm' | 'md' | 'lg';
