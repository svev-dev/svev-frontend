import { IInvokable } from './IInvokable';
import { UIElement } from './UIElement';

// https://daisyui.com/components/input/

export class StringInput extends UIElement implements IInvokable {
  public readonly value = this.prop('');
  public readonly placeholder = this.prop('');
  #_onInvoke?: VoidFunction;

  public override createUI(): HTMLElement {
    const input = document.createElement('input');
    input.id = this.id();
    input.type = 'text';
    input.className = 'input';
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
    this.#_onInvoke = fn;
    return this;
  };

  public invoke = (): void => {
    this.#_onInvoke?.();
  };
}
