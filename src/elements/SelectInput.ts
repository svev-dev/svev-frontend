import { signal } from '../signals/signals';
import { IS_DEV } from '../utils/isDev';
import { UIElement } from './UIElement';

// https://daisyui.com/components/select/

export class SelectInput<Value extends string | number> extends UIElement {
  public readonly value = this.prop<Value | undefined>(undefined);
  public readonly placeholder = this.prop('');
  readonly #_options = signal<[Value, Label, ValueAsString][]>([]);

  public override createUI(): HTMLElement {
    const select = document.createElement('select');
    select.id = this.id();
    select.className = 'select';

    this.effect(() => {
      select.disabled = !this.isEnabled();
    });

    this.effect(() => {
      select.innerHTML = '';
      const placeholder = this.placeholder();
      if (placeholder !== '') {
        const option = this.#createOptionElement(placeholder, this.value() === undefined, true);
        select.appendChild(option);
      } else {
        // If we have options, no placeholder, and the value is undefined, then the value does not match
        // what is being rendered (as the browser renders the first option by default).
        // We should set the value to the first option.
        const options = this.#_options();
        const value = this.value();
        const firstOption = options[0];
        if (firstOption !== undefined && value === undefined) {
          this.value(firstOption[0]);
        }
      }

      const options = this.#_options();
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
      const option = this.#_options().find(
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

  public setOptions(optionsArray: readonly Value[]): this;
  public setOptions(optionsArray: readonly Value[], map: (value: Value) => Label): this;
  public setOptions(optionsMap: Record<Value, Label>): this;
  public setOptions(
    options: readonly Value[] | Record<Value, Label>,
    map?: (value: Value) => Label
  ): this {
    if (Array.isArray(options)) {
      // A manual type assertion is necessary here because TypeScript cannot infer the type of the options array.
      const optionsArray = options as readonly Value[];
      this.#_options(
        optionsArray.map((value) => [value, map?.(value) ?? value.toString(), value.toString()])
      );
      return this;
    }

    const result = Object.entries(options).map(
      ([value, label]) => [value, label, value.toString()] as [Value, Label, ValueAsString]
    );
    this.#_options(result);
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
}

type Label = string;
type ValueAsString = string;
