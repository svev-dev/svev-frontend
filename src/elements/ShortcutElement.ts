import { onShortcut, Shortcut, shortcutToString } from '../Shortcut';
import { signal } from '../signals/signals';
import { UIElement } from './UIElement';

export class ShortcutElement extends UIElement {
  public shortcut = signal<Shortcut | undefined>(undefined);
  public onAction?: VoidFunction;

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
      const dispose = onShortcut(shortcut, () => {
        this.onAction?.();
      });
      return dispose;
    });

    return element;
  }
}
