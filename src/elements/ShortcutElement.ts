import { onShortcut, Shortcut, shortcutToString } from '../Shortcut';
import { IInvokable } from './IInvokable';
import { UIElement } from './UIElement';

export class ShortcutElement extends UIElement implements IInvokable {
  public shortcut = this.prop<Shortcut | undefined>(undefined);
  private _onInvoke?: VoidFunction;

  public override createUI(): HTMLElement {
    const element = <HTMLButtonElement>document.createElement('kbd');
    element.className = 'ms-2';

    const shortcut = this.shortcut();
    this.effect(() => {
      if (!shortcut) {
        element.innerText = '';
        return;
      }

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
}
