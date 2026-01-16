import { onShortcut, Shortcut, shortcutToStringParts } from 'svev-frontend';
import { getSizeClass, Size } from './Enums';
import { Element, UIElement, IInvokable } from 'svev-frontend';

// https://daisyui.com/components/kbd/

// https://tailwindcss.com/docs/detecting-classes-in-source-files
// kbd-xs kbd-sm kbd-md kbd-lg kbd-xl

export class ShortcutElement extends UIElement implements IInvokable {
  public readonly size = this.prop<Size>('md');
  public readonly shortcut = this.prop<Shortcut | undefined>(undefined);
  #onInvoke?: VoidFunction;

  protected createUI(): Element {
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
        const kbdElement = this.#createKbdElement(text);
        element.appendChild(kbdElement);
      });

      const dispose = onShortcut(shortcut, this.invoke);
      return dispose;
    });

    return element;
  }

  public setOnInvoke(fn: VoidFunction): this {
    this.#onInvoke = fn;
    return this;
  }

  public invoke = (): void => {
    this.#onInvoke?.();
  };

  #createKbdElement(text: string): HTMLElement {
    const className = 'kbd';
    const element = document.createElement(className);
    const classNames = [className];
    classNames.push(getSizeClass(className, this.size()));
    element.className = classNames.join(' ');
    element.innerText = text;
    return element;
  }
}
