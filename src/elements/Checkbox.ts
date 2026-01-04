import { signal } from '../signals/signals';
import { UIElement } from './UIElement';

// https://getbootstrap.com/docs/5.3/forms/checks-radios/

export class Checkbox extends UIElement {
  public label = signal('');
  public isVisible = signal(true);
  public isEnabled = signal(true);
  public isChecked = signal(false);
  public isIndeterminate = signal(false);
  public isSwitch = signal(false);
  public onAction?: VoidFunction;

  public override createUI(): HTMLElement {
    const container = <HTMLDivElement>document.createElement('div');
    container.role = 'checkbox';

    const inputElement = <HTMLInputElement>document.createElement('input');
    inputElement.type = 'checkbox';

    inputElement.className = 'form-check-input';
    inputElement.id = 'checkbox' + Math.random().toString();
    inputElement.indeterminate = true;
    inputElement.style.userSelect = 'none';

    container.appendChild(inputElement);

    const labelElement = <HTMLLabelElement>document.createElement('label');
    labelElement.className = 'form-check-label';
    labelElement.htmlFor = inputElement.id;
    labelElement.style.userSelect = 'none';
    container.appendChild(labelElement);

    this.effect(() => {
      container.style.display = this.isVisible() ? '' : 'none';
      if (!this.isVisible()) return; // No need to update other properties if not visible

      container.className = this.isSwitch() ? 'form-check form-switch' : 'form-check';

      inputElement.disabled = !this.isEnabled();
      inputElement.checked = this.isChecked();
      inputElement.indeterminate = this.isIndeterminate();
      inputElement.role = this.isSwitch() ? 'switch' : 'checkbox';

      labelElement.innerText = this.label();
      labelElement.ariaLabel = this.label();
    });
    inputElement.onchange = (): void => {
      this.isChecked(inputElement.checked);
      this.onAction?.();
    };
    return container;
  }
}
