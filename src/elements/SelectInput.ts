import { signal } from '../signals/signals';
import { UIElement } from './UIElement';

// https://daisyui.com/components/select/

export class SelectInput<Value extends string | number> extends UIElement {
  public readonly value = this.prop<Value | undefined>(undefined);
  public readonly placeholder = this.prop('');
  private readonly _options = signal<[Value, Label, ValueAsString][]>([]);

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
        const option = this.createOptionElement(placeholder, this.value() === undefined, true);
        select.appendChild(option);
      }

      const options = this._options();
      for (const [value, label, valueAsString] of options) {
        const option = this.createOptionElement(
          label,
          this.value() === value,
          false,
          valueAsString
        );
        select.appendChild(option);
      }
    });

    select.onchange = (): void => {
      const option = this._options().find(
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
      throw new Error('A value is not set');
    }
    return value;
  }

  public setOptions(optionsArray: Value[]): this;
  public setOptions(optionsArray: Value[], map: (value: Value) => Label): this;
  public setOptions(optionsMap: Record<Value, Label>): this;
  public setOptions(options: Value[] | Record<Value, Label>, map?: (value: Value) => Label): this {
    if (Array.isArray(options)) {
      this._options(
        options.map((value) => [value, map?.(value) ?? value.toString(), value.toString()])
      );
      return this;
    }

    const result = Object.entries(options).map(
      ([value, label]) => [value, label, value.toString()] as [Value, Label, ValueAsString]
    );
    this._options(result);
    return this;
  }

  private createOptionElement(
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
