import { IS_DEV } from './isDev';
import type { Size, Variant } from './Enums';
import { getSizeClass, getVariantClass, Sizes, Variants } from './Enums';
import { ShortcutElement } from './ShortcutElement';
import type { IPropertyRegister } from 'svev-frontend';
import { BaseButton } from '../../core/src/elements/BaseButton';

// https://daisyui.com/components/button/

// https://tailwindcss.com/docs/detecting-classes-in-source-files
// btn-neutral btn-primary btn-secondary btn-accent btn-info btn-success btn-warning btn-error
// btn-xs btn-sm btn-lg btn-xl

export class Button extends BaseButton {
  public readonly size = this.prop<Size>('md');
  public readonly variant = this.prop<Variant | undefined>(undefined);

  protected initializeButton(button: HTMLButtonElement): void {
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
        classNames.push(`btn-square`);
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
      const dispose = shortcutElement.render({ in: button });
      return (): void => {
        dispose();
      };
    });
  }

  public override registerProperties(register: IPropertyRegister): void {
    if (IS_DEV) {
      super.registerProperties(register);
      register.addHeader(Button.name);
      register.addOptions('Size', this.size, Sizes);
      register.addOptionalOptions('Variant', this.variant, Variants);
    }
  }
}
