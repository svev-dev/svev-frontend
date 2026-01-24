import { signal, IS_DEV, UIElement } from 'svev-frontend';
import type { Size, Variant } from './Enums';
import type { IPropertyRegister, Element } from 'svev-frontend';

// https://daisyui.com/components/tab/
// https://daisyui.com/components/radio/

// https://tailwindcss.com/docs/detecting-classes-in-source-files
// ....

export class Tab extends UIElement {
  public readonly size = this.prop<Size>('md');
  public readonly label = this.prop<string>('');
  public readonly variant = this.prop<Variant | undefined>(undefined);
  public readonly isChecked = this.prop(false); // Used internally by the class Tabs, never set it manually

  readonly #child = signal<UIElement | undefined>(undefined);
  readonly #parentId: string = ''; // This is the name of the radio for grouping

  public constructor(parentId: string) {
    super();
    this.#parentId = parentId;
  }

  public get child(): UIElement | undefined {
    return this.#child();
  }

  public setChild(value: UIElement | undefined): Tab {
    this.#child(value);
    return this;
  }

  protected createUI(): Element[] {
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = this.#parentId;

    this.effect(() => {
      input.ariaLabel = this.label();
      input.id = this.id();

      // TODO: add more options
      this.applyClassesTo(input, ['tab']);
      input.disabled = !this.isEnabled();

      // Set checked (not sure if this works correctly with effect)
      const isChecked = this.isChecked();
      if (isChecked) {
        input.setAttribute('checked', 'checked');
        input.checked = true;
      } else {
        input.removeAttribute('checked');
        input.checked = false;
      }
    });
    const content = document.createElement('div');
    content.className = 'tab-content';

    this.effect(() => {
      // Not sure if this can be in the effect
      if (this.child !== undefined) {
        const dispose = this.child.render({ in: content });
        this.addDisposable(dispose);
      }
    });
    return [input, content];
  }

  public override registerProperties(register: IPropertyRegister): void {
    if (IS_DEV) {
      super.registerProperties(register);
      register.addHeader('Tab');
      register.addString('Label', this.label);
    }
  }
}
