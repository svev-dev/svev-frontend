import { IS_DEV, UIElement } from 'svev-frontend';
import type { Size, Variant } from './Enums';
import { getSizeClass, getVariantClass, Sizes, Variants } from './Enums';
import type { IPropertyRegister } from 'svev-frontend';

// https://daisyui.com/components/badge/

// https://tailwindcss.com/docs/detecting-classes-in-source-files
// badge-neutral badge-primary badge-secondary badge-accent badge-info badge-success badge-warning badge-error
// badge-xs badge-sm badge-md badge-lg badge-xl
// badge-outline badge-ghost

export class Badge extends UIElement {
  public readonly label = this.prop<string>('');
  public readonly size = this.prop<Size>('md');
  public readonly variant = this.prop<Variant | undefined>(undefined);
  public readonly isOutline = this.prop(false);
  public readonly isGhost = this.prop(false);

  protected createUI(): Element {
    const badge = document.createElement('span');

    this.effect(() => {
      badge.textContent = this.label();

      const className = 'badge';
      const classNames = [className];
      classNames.push(getSizeClass(className, this.size()));
      classNames.push(getVariantClass(className, this.variant()));

      if (this.isOutline()) {
        classNames.push('badge-outline');
      }

      if (this.isGhost()) {
        classNames.push('badge-ghost');
      }

      badge.className = classNames.join(' ');
    });

    return badge;
  }

  public override registerProperties(register: IPropertyRegister): void {
    if (IS_DEV) {
      super.registerProperties(register);
      register.addHeader('Badge');
      register.addString('Label', this.label);
      register.addOptions('Size', this.size, Sizes);
      register.addOptionalOptions('Variant', this.variant, Variants);
      register.addBool('Is outline', this.isOutline);
      register.addBool('Is ghost', this.isGhost);
    }
  }
}
