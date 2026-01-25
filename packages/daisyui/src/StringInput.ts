import type { Element, IInvokable } from 'svev-frontend';
import { UIElement } from 'svev-frontend';

// https://daisyui.com/components/input/

export class StringInput extends UIElement implements IInvokable {
  public readonly value = this.prop('');
  public readonly placeholder = this.prop('');
  #onInvoke?: VoidFunction;

  protected createUI(): Element {
    const input = document.createElement('input');
    input.id = this.id();
    input.type = 'text';
    this.applyClassesTo(input, ['input']);
    this.effect(() => {
      input.placeholder = this.placeholder();
      input.disabled = !this.isEnabled();
      input.value = this.value();
    });

    input.onkeydown = (event): void => {
      if (event.code === 'Enter' && input.value !== '') {
        this.invoke();
      }
    };

    input.oninput = (): void => {
      this.value(input.value);
    };

    return input;
  }

  public setOnInvoke = (fn: VoidFunction): this => {
    this.#onInvoke = fn;
    return this;
  };

  public invoke = (): void => {
    this.#onInvoke?.();
  };
}
