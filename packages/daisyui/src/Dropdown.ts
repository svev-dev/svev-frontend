import { IS_DEV, Container } from 'svev-frontend';
import type { Element, IPropertyRegister, UIElement } from 'svev-frontend';
import type { Alignment, Side } from './Enums';
import { Alignments, getAlignmentClass, getSideClass, Sides } from './Enums';

// https://daisyui.com/components/dropdown/

// https://tailwindcss.com/docs/detecting-classes-in-source-files
// dropdown dropdown-content dropdown-start dropdown-center dropdown-end dropdown-top dropdown-bottom dropdown-left dropdown-right dropdown-hover dropdown-open dropdown-close

export class Dropdown extends Container {
  public readonly trigger = this.prop<UIElement | undefined>(undefined);
  public readonly horizontalPlacement = this.prop<Alignment | undefined>(undefined);
  public readonly verticalPlacement = this.prop<Side | undefined>(undefined);
  public readonly toggleOnHover = this.prop(false);
  public readonly isOpen = this.prop(false);
  public readonly forceClose = this.prop(false);

  protected createUI(): Element {
    const dropdown = document.createElement('div');
    const triggerWrapper = document.createElement('div');

    // Set trigger wrapper attributes for CSS focus method
    triggerWrapper.setAttribute('tabindex', '0');
    triggerWrapper.setAttribute('role', 'button');

    // Insert trigger wrapper as first child
    dropdown.appendChild(triggerWrapper);

    this.effect(() => {
      this.applyClassesTo(dropdown, this.#getClassNames());
    });

    // Render trigger in wrapper
    this.effect(() => {
      const trigger = this.trigger();
      if (!trigger) {
        return;
      }
      const dispose = trigger.render({ in: triggerWrapper });
      return dispose;
    });

    // Render content (children) after trigger wrapper
    const dispose = this.fragment.render({ after: triggerWrapper });
    this.addDisposable(dispose);

    this.addDisposable(() => {
      triggerWrapper.remove();
    });

    return dropdown;
  }

  public override registerProperties(register: IPropertyRegister): void {
    if (IS_DEV) {
      super.registerProperties(register);
      register.addHeader('Dropdown');
      register.addOptionalOptions('Horizontal placement', this.horizontalPlacement, Alignments);
      register.addOptionalOptions('Vertical placement', this.verticalPlacement, Sides);
      register.addBool('Is hover', this.toggleOnHover);
      register.addBool('Is open', this.isOpen);
      register.addBool('Is close', this.forceClose);
    }
  }

  #getClassNames(): readonly string[] {
    const className = 'dropdown';
    const classNames = [className];

    classNames.push(getAlignmentClass(className, this.horizontalPlacement()));
    classNames.push(getSideClass(className, this.verticalPlacement()));

    if (this.toggleOnHover()) {
      classNames.push(`${className}-hover`);
    }

    if (this.isOpen()) {
      classNames.push(`${className}-open`);
    }

    if (this.forceClose()) {
      classNames.push(`${className}-close`);
    }
    return classNames;
  }
}

export class DropdownContent extends Container {
  protected createUI(): Element {
    const wrapper = document.createElement('div');
    wrapper.tabIndex = -1;

    this.effect(() => {
      this.applyClassesTo(wrapper, ['dropdown-content']);
    });

    const dispose = this.fragment.render({ in: wrapper });
    this.addDisposable(dispose);

    return wrapper;
  }
}
