import { onShortcut, Shortcut, shortcutToStringParts } from '../Shortcut';
import { IInvokable } from './IInvokable';
import { UIElement } from './UIElement';

// https://daisyui.com/components/kbd/

export class ShortcutElement extends UIElement implements IInvokable {
  public readonly size = this.prop<Size>('md');
  public readonly shortcut = this.prop<Shortcut | undefined>(undefined);
  private _onInvoke?: VoidFunction;

  public override createUI(): HTMLElement {
    const element = document.createElement('span');
    element.style.display = 'flex';
    element.style.gap = '2px';

    const shortcut = this.shortcut();
    this.effect(() => {
      element.innerText = '';
      if (!shortcut) {
        return;
      }

      const parts = shortcutToStringParts(shortcut);
      parts.forEach((text) => {
        const kbdElement = this.createKbdElement(text);
        element.appendChild(kbdElement);
      });

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

  private createKbdElement(text: string): HTMLElement {
    const element = document.createElement('kbd');
    const classNames = ['kbd'];
    classNames.push(this.getSizeClass(this.size()));
    element.className = classNames.join(' ');
    element.innerText = text;
    return element;
  }

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
