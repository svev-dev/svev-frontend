import { Shortcut } from '../Shortcut';
import { IS_DEV } from '../utils/isDev';
import { IInvokable } from './IInvokable';
import { IPropertyRegister } from './IPropertyRegister';
import { ShortcutElement } from './ShortcutElement';
import { UIElement } from './UIElement';

// https://daisyui.com/components/button/

export class Button extends UIElement implements IInvokable {
  public readonly label = this.prop('');
  public readonly icon = this.prop<SVGElement | undefined>(undefined);
  public readonly size = this.prop<Size>('md');
  public readonly variant = this.prop<Variant | undefined>(undefined);
  public readonly shortcut = this.prop<Shortcut | undefined>(undefined);
  #_onInvoke?: VoidFunction;

  public override createUI(): HTMLElement {
    const button = document.createElement('button');
    this.effect(() => {
      const isEnabled = this.isEnabled();
      const label = this.label();
      button.innerText = label;
      button.disabled = !isEnabled;
      const classNames = ['btn'];

      const icon = this.icon();
      if (icon !== undefined) {
        button.prepend(icon);
      }

      if (icon !== undefined && label === '') {
        classNames.push('btn-square');
      }

      const size = this.size();
      classNames.push(this.#getSizeClass(size));

      const variant = this.variant();
      classNames.push(this.#getVariantClass(variant));
      button.className = classNames.join(' ');
    });

    // Shortcut
    this.effect(() => {
      const shortcut = this.shortcut();
      const isEnabled = this.isEnabled();

      if (shortcut === undefined || !isEnabled) {
        return;
      }

      const shortcutElement = new ShortcutElement()
        .shortcut(shortcut)
        .size('sm')
        .setOnInvoke(this.invoke);
      const shortcutNode = shortcutElement.createUI();
      button.appendChild(shortcutNode);
      return (): void => {
        shortcutNode.remove();
        shortcutElement.dispose();
      };
    });
    button.onclick = this.invoke;

    return button;
  }

  public setOnInvoke = (fn: VoidFunction): this => {
    this.#_onInvoke = fn;
    return this;
  };

  public invoke = (): void => {
    this.#_onInvoke?.();
  };

  public override registerProperties(register: IPropertyRegister): void {
    if (IS_DEV) {
      super.registerProperties(register);
      register.addHeader('Button');
      register.addString('Label', this.label);
      register.addOptionalIcon('Icon', this.icon);
      register.addOptions('Size', this.size, Sizes);
      register.addOptionalOptions('Variant', this.variant, Variants);
      register.addOptionalShortcut('Shortcut', this.shortcut);
    }
  }

  #getVariantClass(variant?: Variant): string {
    if (!variant) return '';
    return `btn-${variant}`;
    // https://tailwindcss.com/docs/detecting-classes-in-source-files
    // btn-neutral, btn-primary, btn-secondary, btn-accent, btn-info, btn-success, btn-warning, btn-error
  }

  #getSizeClass(size: Size): string {
    if (size === 'md') return '';
    return `btn-${size}`;
    // https://tailwindcss.com/docs/detecting-classes-in-source-files
    // btn-xs, btn-sm, btn-lg, btn-xl
  }
}

const Variants = [
  'neutral',
  'primary',
  'secondary',
  'accent',
  'info',
  'success',
  'warning',
  'error',
] as const;

type Variant = (typeof Variants)[number];

const Sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
type Size = (typeof Sizes)[number];
