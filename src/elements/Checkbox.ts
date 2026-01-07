import { IS_DEV } from '../utils/isDev';
import { IPropertyRegister } from './IPropertyRegister';
import { UIElement } from './UIElement';

// https://daisyui.com/components/checkbox/
// https://daisyui.com/components/toggle/

export class Checkbox extends UIElement {
  public readonly label = this.prop('');
  public readonly isChecked = this.prop(false);
  public readonly isIndeterminate = this.prop(false);
  public readonly isSwitch = this.prop(false);

  public override createUI(): HTMLElement {
    const label = document.createElement('label');
    label.className = 'label';

    const input = document.createElement('input');
    input.type = 'checkbox';

    const text = document.createTextNode(this.label());

    label.append(input, text);

    this.effect(() => {
      input.id = this.id();
      input.className = this.isSwitch() ? 'toggle' : 'checkbox';

      text.textContent = this.label();

      input.indeterminate = this.isIndeterminate();

      const isChecked = this.isChecked();
      if (isChecked) {
        input.setAttribute('checked', 'checked');
        input.checked = true;
      } else {
        input.removeAttribute('checked');
        input.checked = false;
      }

      input.disabled = !this.isEnabled();
    });
    input.onchange = (): void => {
      this.isChecked(input.checked);
    };
    return label;
  }

  public override registerProperties(register: IPropertyRegister): void {
    if (IS_DEV) {
      super.registerProperties(register);
      register.addHeader('Checkbox');
      register.addString('Label', this.label);
      register.addBool('Is checked', this.isChecked);
      register.addBool('Is indeterminate', this.isIndeterminate);
      register.addBool('Is switch', this.isSwitch);
    }
  }
}
