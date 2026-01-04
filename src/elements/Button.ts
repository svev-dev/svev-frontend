import { Shortcut } from '../Shortcut';
import { IInvokable } from './IInvokable';
import { ShortcutElement } from './ShortcutElement';
import { UIElement } from './UIElement';

export class Button extends UIElement implements IInvokable {
  public label = this.prop('');
  public size = this.prop<Size>('md');
  public variant = this.prop<Variant | undefined>(undefined);
  public shortcut = this.prop<Shortcut | undefined>(undefined);
  private _onInvoke?: VoidFunction;

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

      const shortcutElement = new ShortcutElement().shortcut(shortcut).setOnInvoke(this.invoke);
      const shortcutNode = shortcutElement.createUI();
      button.appendChild(shortcutNode);
      return (): void => {
        shortcutNode.remove();
        shortcutElement.dispose();
      };
    });
    button.onclick = this.invoke;

    return button;
  }

  public setOnInvoke = (fn: VoidFunction): this => {
    this._onInvoke = fn;
    return this;
  };

  public invoke = (): void => {
    this._onInvoke?.();
  };
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
