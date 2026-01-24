import { IS_DEV, Container } from 'svev-frontend';
import type { Direction, Size } from './Enums';
import { Directions, getDirectionClass, getSizeClass, Sizes } from './Enums';
import type { Element, IPropertyRegister } from 'svev-frontend';

// https://daisyui.com/components/menu/

// https://tailwindcss.com/docs/detecting-classes-in-source-files
// menu-xs menu-sm menu-md menu-lg menu-xl
// menu-vertical menu-horizontal

export class Menu extends Container {
  public readonly size = this.prop<Size>('md');
  public readonly direction = this.prop<Direction>('vertical');
  public readonly isSubmenu = this.prop(false);

  protected createUI(): Element {
    const ul = document.createElement('ul');

    this.effect(() => {
      const isSubmenu = this.isSubmenu();

      if (isSubmenu) {
        return;
      }

      const classNames: string[] = [];

      // Add 'menu' class (only for root menus)
      classNames.push('menu');
      // Add size class (only for root menus)
      classNames.push(getSizeClass('menu', this.size()));
      // Add direction class (only for root menus)
      classNames.push(getDirectionClass('menu', this.direction()));

      this.applyClassesTo(ul, classNames);
    });

    const dispose = this.fragment.render({ in: ul });
    this.addDisposable(dispose);

    return ul;
  }

  public override registerProperties(register: IPropertyRegister): void {
    if (IS_DEV) {
      super.registerProperties(register);
      register.addHeader('Menu');
      register.addOptions('Size', this.size, Sizes);
      register.addOptions('Direction', this.direction, Directions);
    }
  }
}
