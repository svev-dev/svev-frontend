import { IS_DEV } from './isDev';
import type { Size, Variant } from './Enums';
import { getSizeClass, getVariantClass, Sizes, Variants } from './Enums';
import type { IPropertyRegister } from 'svev-frontend';
import { UIElement, signal } from 'svev-frontend';

// https://daisyui.com/components/select/

// https://tailwindcss.com/docs/detecting-classes-in-source-files
// select-neutral select-primary select-secondary select-accent select-info select-success select-warning select-error
// select-xs select-sm select-lg select-xl

export class SelectInput<Value extends string | number> extends UIElement {
  public readonly value = this.prop<Value | undefined>(undefined);
  public readonly placeholder = this.prop('');
  public readonly isGhost = this.prop(false);
  public readonly size = this.prop<Size>('md');
  public readonly variant = this.prop<Variant | undefined>(undefined);

  readonly #options = signal<[Value, Label, ValueAsString][]>([]);

  protected createUI(): Element {
    const select = document.createElement('select');
    select.id = this.id();

    this.effect(() => {
      select.disabled = !this.isEnabled();
    });

    this.effect(() => {
      const className = 'select';
      const classNames = [className];
      if (this.isGhost()) {
        classNames.push(`select-ghost`);
      }
      classNames.push(getSizeClass(className, this.size()));
      classNames.push(getVariantClass(className, this.variant()));
      select.className = classNames.join(' ');

      select.innerHTML = '';
      const placeholder = this.placeholder();
      if (placeholder !== '') {
        const option = this.#createOptionElement(placeholder, this.value() === undefined, true);
        select.appendChild(option);
      } else {
        // If we have options, no placeholder, and the value is undefined, then the value does not match
        // what is being rendered (as the browser renders the first option by default).
        // We should set the value to the first option.
        const options = this.#options();
        const value = this.value();
        const firstOption = options[0];
        if (firstOption !== undefined && value === undefined) {
          this.value(firstOption[0]);
        }
      }

      const options = this.#options();
      for (const [value, label, valueAsString] of options) {
        const option = this.#createOptionElement(
          label,
          this.value() === value,
          false,
          valueAsString
        );
        select.appendChild(option);
      }
    });

    select.onchange = (): void => {
      const option = this.#options().find(
        ([_, __, valueAsString]) => valueAsString === select.value
      );
      if (option) {
        this.value(option[0]);
      }
    };

    return select;
  }

  /**
   * If you know that a value is set, and do not want to handle the undefined case, use this method.
   * @throws {Error} If no value is set.
   */
  public requiredValue(): Value {
    const value = this.value();
    if (value === undefined) {
      throw new Error(IS_DEV ? 'A value is not set' : '');
    }
    return value;
  }

  public setOptions(optionsArray: readonly Value[], map?: (value: Value) => Label): this;
  public setOptions(optionsMap: Record<Value, Label>): this;
  public setOptions(
    options: readonly Value[] | Record<Value, Label>,
    map?: (value: Value) => Label
  ): this {
    if (Array.isArray(options)) {
      // A manual type assertion is necessary here because TypeScript cannot infer the type of the options array.
      const optionsArray = options as readonly Value[];
      this.#options(
        optionsArray.map((value) => [value, map?.(value) ?? value.toString(), value.toString()])
      );
      return this;
    }

    const result = Object.entries(options).map(
      ([value, label]) => [value, label, value.toString()] as [Value, Label, ValueAsString]
    );
    this.#options(result);
    return this;
  }

  #createOptionElement(
    label: Label,
    selected: boolean,
    disabled: boolean,
    value?: ValueAsString
  ): HTMLOptionElement {
    const option = document.createElement('option');
    option.textContent = label;
    option.disabled = disabled;
    if (selected) {
      option.setAttribute('selected', '');
    }
    if (value !== undefined) {
      option.value = value;
    }
    return option;
  }

  public override registerProperties(register: IPropertyRegister): void {
    if (IS_DEV) {
      super.registerProperties(register);
      register.addHeader('SelectInput');
      register.addBool('Is Ghost', this.isGhost);
      register.addOptions('Size', this.size, Sizes);
      register.addOptionalOptions('Variant', this.variant, Variants);
    }
  }
}

type Label = string;
type ValueAsString = string;
