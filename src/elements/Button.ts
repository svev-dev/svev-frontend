import { IS_DEV } from '../utils/isDev';
import { getSizeClass, getVariantClass, Size, Sizes, Variant, Variants } from './Enums';
import { Shortcut } from '../Shortcut';
import { IInvokable } from './IInvokable';
import { IPropertyRegister } from './IPropertyRegister';
import { ShortcutElement } from './ShortcutElement';
import { UIElement } from './UIElement';

// https://daisyui.com/components/button/

// https://tailwindcss.com/docs/detecting-classes-in-source-files
// btn-neutral btn-primary btn-secondary btn-accent btn-info btn-success btn-warning btn-error
// btn-xs btn-sm btn-lg btn-xl

export class Button extends UIElement implements IInvokable {
  public readonly label = this.prop('');
  public readonly icon = this.prop<SVGElement | undefined>(undefined);
  public readonly size = this.prop<Size>('md');
  public readonly variant = this.prop<Variant | undefined>(undefined);
  public readonly shortcut = this.prop<Shortcut | undefined>(undefined);
  #onInvoke?: VoidFunction;

  public override createUI(): HTMLElement {
    const button = document.createElement('button');
    this.effect(() => {
      const isEnabled = this.isEnabled();
      const label = this.label();
      button.innerText = label;
      button.disabled = !isEnabled;

      const icon = this.icon();
      if (icon !== undefined) {
        button.prepend(icon);
      }

      const className = 'btn';
      const classNames = [className];
      if (icon !== undefined && label === '') {
        classNames.push(`${className}-square`);
      }

      classNames.push(getSizeClass(className, this.size()));

      classNames.push(getVariantClass(className, this.variant()));
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
    this.#onInvoke = fn;
    return this;
  };

  public invoke = (): void => {
    this.#onInvoke?.();
  };

  public override registerProperties(register: IPropertyRegister): void {
    if (IS_DEV) {
      super.registerProperties(register);
      register.addHeader('Button');
      register.addOptions('Size', this.size, Sizes);
      register.addOptionalOptions('Variant', this.variant, Variants);
      register.addString('Label', this.label);
      register.addOptionalIcon('Icon', this.icon);
      register.addOptionalShortcut('Shortcut', this.shortcut);
    }
  }
}
