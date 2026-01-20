import type { Element, Shortcut, IPropertyRegister, IInvokable } from 'svev-frontend';
import { UIElement } from 'svev-frontend';
import { IS_DEV } from '../utils/isDev';

export abstract class BaseButton extends UIElement implements IInvokable {
  public readonly label = this.prop('');
  public readonly icon = this.prop<SVGElement | undefined>(undefined);
  public readonly shortcut = this.prop<Shortcut | undefined>(undefined);
  #onInvoke?: VoidFunction;

  protected abstract initializeButton(button: HTMLButtonElement): void;

  protected override createUI(): Element {
    const button = document.createElement('button');
    this.initializeButton(button);
    button.onclick = this.invoke;
    return button;
  }

  public setOnInvoke = (fn: VoidFunction): this => {
    this.#onInvoke = fn;
    return this;
  };

  public invoke = (): void => {
    this.#onInvoke?.();
  };

  public override registerProperties(register: IPropertyRegister): void {
    if (IS_DEV) {
      super.registerProperties(register);
      register.addHeader(BaseButton.name);
      register.addString('Label', this.label);
      register.addOptionalIcon('Icon', this.icon);
      register.addOptionalShortcut('Shortcut', this.shortcut);
    }
  }
}
