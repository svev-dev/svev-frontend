import { effect, signal } from "../signals/signals";
import { UIElement } from "./UIElement";

// https://getbootstrap.com/docs/5.3/forms/checks-radios/

export class Checkbox extends UIElement {
  public label = signal("");
  public isEnabled = signal(true);
  public isChecked = signal(false);
  public isIndeterminate = signal(false);
  public isSwitch = signal(false);
  public onAction?: VoidFunction;

  public override createUI(): HTMLElement {
    const container = <HTMLDivElement>document.createElement("div");
    container.role = "checkbox";

    const inputElement = <HTMLInputElement>document.createElement("input"); 
    inputElement.type = "checkbox";
    inputElement.className = "form-check-input";
    inputElement.id = "checkbox" + Math.random().toString();
    inputElement.indeterminate = true;
    inputElement.style.userSelect = "none";

    container.appendChild(inputElement);

    const labelElement = <HTMLLabelElement>document.createElement("label");
    labelElement.className = "form-check-label";
    labelElement.htmlFor = inputElement.id;
    labelElement.style.userSelect = "none";
    container.appendChild(labelElement);

    effect(() => {
      inputElement.role = this.isSwitch() ? "switch" : "checkbox";
      inputElement.disabled = !this.isEnabled();
      inputElement.checked = this.isChecked();
      inputElement.indeterminate = this.isIndeterminate();

      labelElement.innerText = this.label();
      labelElement.ariaLabel = this.label();

      container.className = this.isSwitch() ? "form-check form-switch" : "form-check";
    });
    inputElement.onchange = () => {
      this.isChecked(inputElement.checked);
      this.onAction?.();
    };
    return container;
  }
}
