import { IS_DEV, Container } from 'svev-frontend';
import type { IPropertyRegister, Element } from 'svev-frontend';
import { Tab } from './Tab';

// https://daisyui.com/components/tabs/

// https://tailwindcss.com/docs/detecting-classes-in-source-files
// .....

export class Tabs extends Container {
  public readonly selectedIndex = this.prop<number>(0);

  public addTab(): Tab {
    const tab = new Tab(this.id());
    this.addChild(tab);
    return tab;
  }

  protected createUI(): Element {
    const element = document.createElement('div');

    element.onchange = (event): void => {
      const element = event.target as HTMLElement;
      if (element === null) {
        return;
      }
      // Updated selectedIndex by finding the tab with the same id
      let selectedIndex = 0;
      for (const child of this.#getTabs()) {
        if (child.id() === element.id) {
          this.selectedIndex(selectedIndex);
          break;
        }
        selectedIndex++;
      }
    };

    this.effect(() => {
      element.id = this.id();

      // TODO: add more options
      const className = 'tabs tabs-box';
      const classNames = [className];
      element.className = classNames.join(' ');

      // Update tabs based on selectedIndex
      let selectedIndex = 0;
      for (const child of this.#getTabs()) {
        child.isEnabled(this.isEnabled());
        child.isChecked(selectedIndex === this.selectedIndex());
        selectedIndex++;
      }
    });

    const dispose = this.fragment.render({ in: element });
    this.addDisposable(dispose);

    return element;
  }

  public override registerProperties(register: IPropertyRegister): void {
    if (IS_DEV) {
      super.registerProperties(register);
      register.addHeader('Tabs');
      register.addOptions(
        'SelectedIndex',
        this.selectedIndex,
        Array.from(this.#getTabs()).map((_, i) => i)
      );
      // register.addOptions('Size', this.size, Sizes);
      // register.addOptionalOptions('Variant', this.variant, Variants);
    }
  }

  *#getTabs(): Generator<Tab> {
    for (const child of this.fragment.getChildren()) {
      if (child instanceof Tab) {
        yield child;
      }
    }
  }
}
