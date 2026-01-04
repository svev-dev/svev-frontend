import { UIElement } from './UIElement';

export class StringInput extends UIElement {
  public value = this.prop('');
  public placeholder = this.prop('');

  public override createUI(): HTMLElement {
    const input = <HTMLInputElement>document.createElement('input');
    input.type = 'text';
    input.className = 'form-control';
    this.effect(() => {
      input.placeholder = this.placeholder();
      input.disabled = !this.isEnabled();
      input.value = this.value();
    });

    input.oninput = (): void => {
      this.value(input.value);
    };

    return input;
  }
}
