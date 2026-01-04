import { IInvokable } from './IInvokable';
import { UIElement } from './UIElement';

export class StringInput extends UIElement implements IInvokable {
  public value = this.prop('');
  public placeholder = this.prop('');
  private _onInvoke?: VoidFunction;

  public override createUI(): HTMLElement {
    const input = <HTMLInputElement>document.createElement('input');
    input.type = 'text';
    input.className = 'form-control';
    this.effect(() => {
      input.placeholder = this.placeholder();
      input.disabled = !this.isEnabled();
      input.value = this.value();
    });

    input.onkeydown = (event): void => {
      if (event.code === 'Enter') {
        this.invoke();
      }
    };

    input.oninput = (): void => {
      this.value(input.value);
    };

    return input;
  }

  public setOnInvoke = (fn: VoidFunction): this => {
    this._onInvoke = fn;
    return this;
  };

  public invoke = (): void => {
    this._onInvoke?.();
  };
}
