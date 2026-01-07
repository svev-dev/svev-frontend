import { IS_DEV } from '../utils/isDev';
import { getSizeClass, getVariantClass, Size, Sizes, Variant, Variants } from './Enums';
import { IPropertyRegister } from './IPropertyRegister';
import { UIElement } from './UIElement';

// https://daisyui.com/components/checkbox/
// https://daisyui.com/components/toggle/

// https://tailwindcss.com/docs/detecting-classes-in-source-files
// checkbox-neutral checkbox-primary checkbox-secondary checkbox-accent checkbox-info checkbox-success checkbox-warning checkbox-error
// toggle-neutral toggle-primary toggle-secondary toggle-accent toggle-info toggle-success toggle-warning toggle-error
// checkbox-xs checkbox-sm checkbox-md checkbox-lg checkbox-xl
// toggle-xs toggle-sm toggle-md toggle-lg toggle-xl

export class BoolInput extends UIElement {
  public readonly label = this.prop('');
  public readonly isChecked = this.prop(false);
  public readonly isIndeterminate = this.prop(false);
  public readonly isSwitch = this.prop(false);
  public readonly size = this.prop<Size>('md');
  public readonly variant = this.prop<Variant | undefined>(undefined);

  public override createUI(): HTMLElement {
    const label = document.createElement('label');
    label.className = 'label';

    const input = document.createElement('input');
    input.type = 'checkbox';

    const text = document.createTextNode(this.label());

    label.append(input, text);

    this.effect(() => {
      input.id = this.id();

      const className = this.isSwitch() ? 'toggle' : 'checkbox';
      const classNames = [className];
      classNames.push(getSizeClass(className, this.size()));
      classNames.push(getVariantClass(className, this.variant()));
      input.className = classNames.join(' ');

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
      register.addHeader('BoolInput');
      register.addOptions('Size', this.size, Sizes);
      register.addOptionalOptions('Variant', this.variant, Variants);
      register.addString('Label', this.label);
      register.addBool('Is checked', this.isChecked);
      register.addBool('Is indeterminate', this.isIndeterminate);
      register.addBool('Is switch', this.isSwitch);
    }
  }
}
