import { Shortcut } from '../Shortcut';
import { IInvokable } from './IInvokable';
import { ShortcutElement } from './ShortcutElement';
import { UIElement } from './UIElement';

// https://daisyui.com/components/button/

export class Button extends UIElement implements IInvokable {
  public readonly label = this.prop('');
  public readonly icon = this.prop<SVGElement | undefined>(undefined);
  public readonly size = this.prop<Size>('md');
  public readonly variant = this.prop<Variant | undefined>(undefined);
  public readonly shortcut = this.prop<Shortcut | undefined>(undefined);
  private _onInvoke?: VoidFunction;

  public override createUI(): HTMLElement {
    const button = document.createElement('button');
    this.effect(() => {
      const isEnabled = this.isEnabled();
      const label = this.label();
      button.innerText = label;
      button.disabled = !isEnabled;
      const classNames = ['btn'];

      const icon = this.icon();
      if (icon !== undefined) {
        button.prepend(icon);
      }

      if (icon !== undefined && label === '') {
        classNames.push('btn-square');
      }

      const size = this.size();
      classNames.push(this.getSizeClass(size));

      const variant = this.variant();
      classNames.push(this.getVariantClass(variant));
      button.className = classNames.join(' ');
    });

    // Shortcut
    this.effect(() => {
      const shortcut = this.shortcut();
      const isEnabled = this.isEnabled();

      if (shortcut === undefined || !isEnabled) {
        return;
      }

      const shortcutElement = new ShortcutElement()
        .shortcut(shortcut)
        .size('sm')
        .setOnInvoke(this.invoke);
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

  private getVariantClass(variant?: Variant): string {
    if (!variant) return '';

    // https://tailwindcss.com/docs/detecting-classes-in-source-files
    const variantMap: Record<Variant, string> = {
      neutral: 'btn-neutral',
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      accent: 'btn-accent',
      info: 'btn-info',
      success: 'btn-success',
      warning: 'btn-warning',
      error: 'btn-error',
    };
    return variantMap[variant];
  }

  private getSizeClass(size: Size): string {
    // https://tailwindcss.com/docs/detecting-classes-in-source-files
    const classMap: Record<Size, string> = {
      xs: 'btn-xs',
      sm: 'btn-sm',
      md: '',
      lg: 'btn-lg',
      xl: 'btn-xl',
    };
    return classMap[size];
  }
}

type Variant =
  | 'neutral'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
