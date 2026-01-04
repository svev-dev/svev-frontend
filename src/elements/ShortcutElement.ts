import { onShortcut, Shortcut, shortcutToString } from '../Shortcut';
import { IInvokable } from './IInvokable';
import { UIElement } from './UIElement';

// https://daisyui.com/components/kbd/

export class ShortcutElement extends UIElement implements IInvokable {
  public size = this.prop<Size>('md');
  public shortcut = this.prop<Shortcut | undefined>(undefined);
  private _onInvoke?: VoidFunction;

  public override createUI(): HTMLElement {
    const element = <HTMLButtonElement>document.createElement('kbd');

    const shortcut = this.shortcut();
    this.effect(() => {
      if (!shortcut) {
        element.innerText = '';
        return;
      }

      const classNames = ['kbd'];
      classNames.push(this.getSizeClass(this.size()));

      element.className = classNames.join(' ');

      element.innerText = shortcutToString(shortcut);
      const dispose = onShortcut(shortcut, this.invoke);
      return dispose;
    });

    return element;
  }

  public setOnInvoke(fn: VoidFunction): this {
    this._onInvoke = fn;
    return this;
  }

  public invoke = (): void => {
    this._onInvoke?.();
  };

  private getSizeClass(size: Size): string {
    // https://tailwindcss.com/docs/detecting-classes-in-source-files
    const classMap: Record<Size, string> = {
      xs: 'kbd-xs',
      sm: 'kbd-sm',
      md: 'kbd-md',
      lg: 'kbd-lg',
      xl: 'kbd-xl',
    };
    return classMap[size];
  }
}

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
