import { Shortcut } from '../Shortcut';
import { signal } from '../signals/signals';
import { ShortcutElement } from './ShortcutElement';
import { UIElement } from './UIElement';

export class Button extends UIElement {
  public label = signal('');
  public size = signal<Size>('md');
  public variant = signal<Variant | undefined>(undefined);
  public isEnabled = signal(true);
  public shortcut = signal<Shortcut | undefined>(undefined);
  public onAction?: VoidFunction;

  public override createUI(): HTMLElement {
    const button = <HTMLButtonElement>document.createElement('button');
    button.role = 'button';
    const baseClassName = ['btn'];
    this.effect(() => {
      const isEnabled = this.isEnabled();
      button.innerText = this.label();
      button.disabled = !isEnabled;
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

    // Shortcut
    this.effect(() => {
      const shortcut = this.shortcut();
      const isEnabled = this.isEnabled();

      if (shortcut === undefined || !isEnabled) {
        return;
      }

      const shortcutElement = new ShortcutElement();
      shortcutElement.shortcut(shortcut);
      shortcutElement.onAction = () => this.onAction?.();
      const shortcutNode = shortcutElement.createUI();
      button.appendChild(shortcutNode);
      return () => {
        shortcutNode.remove();
        shortcutElement.dispose();
      };
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
