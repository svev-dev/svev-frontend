import { IS_DEV, Container } from 'svev-frontend';
import type { Element, IPropertyRegister } from 'svev-frontend';

// https://daisyui.com/components/navbar/

// https://tailwindcss.com/docs/detecting-classes-in-source-files
// navbar navbar-start navbar-center navbar-end

export class Navbar extends Container {
  protected createUI(): Element {
    const navbar = document.createElement('div');

    this.effect(() => {
      this.applyClassesTo(navbar, ['navbar']);
    });

    const dispose = this.fragment.render({ in: navbar });
    this.addDisposable(dispose);

    return navbar;
  }

  public override registerProperties(register: IPropertyRegister): void {
    if (IS_DEV) {
      super.registerProperties(register);
      register.addHeader('Navbar');
    }
  }
}

export class NavbarStart extends Container {
  protected createUI(): Element {
    const start = document.createElement('div');

    this.effect(() => {
      this.applyClassesTo(start, ['navbar-start']);
    });

    const dispose = this.fragment.render({ in: start });
    this.addDisposable(dispose);

    return start;
  }
}

export class NavbarCenter extends Container {
  protected createUI(): Element {
    const center = document.createElement('div');

    this.effect(() => {
      this.applyClassesTo(center, ['navbar-center']);
    });

    const dispose = this.fragment.render({ in: center });
    this.addDisposable(dispose);

    return center;
  }
}

export class NavbarEnd extends Container {
  protected createUI(): Element {
    const end = document.createElement('div');

    this.effect(() => {
      this.applyClassesTo(end, ['navbar-end']);
    });

    const dispose = this.fragment.render({ in: end });
    this.addDisposable(dispose);

    return end;
  }
}
