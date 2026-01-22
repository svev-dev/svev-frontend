import { IS_DEV, UIElement } from 'svev-frontend';
import type { Size } from './Enums';
import { getSizeClass, Sizes } from './Enums';
import type { IPropertyRegister } from 'svev-frontend';

// https://daisyui.com/components/avatar/

// https://tailwindcss.com/docs/detecting-classes-in-source-files
// avatar-xs avatar-sm avatar-md avatar-lg avatar-xl
// avatar-online avatar-offline
// avatar-placeholder

export class Avatar extends UIElement {
  public readonly imageSrc = this.prop<string | undefined>(undefined);
  public readonly imageAlt = this.prop<string>('');
  public readonly placeholder = this.prop<string | undefined>(undefined);
  public readonly size = this.prop<Size>('md');
  public readonly status = this.prop<'online' | 'offline' | undefined>(undefined);

  protected createUI(): Element {
    const avatar = document.createElement('div');
    const innerContainer = document.createElement('div');

    this.effect(() => {
      // Build avatar classes
      const className = 'avatar';
      const classNames = [className];
      classNames.push(getSizeClass(className, this.size()));

      const status = this.status();
      if (status === 'online') {
        classNames.push('avatar-online');
      } else if (status === 'offline') {
        classNames.push('avatar-offline');
      }

      const imageSrc = this.imageSrc();
      const placeholderText = this.placeholder();

      const hasPlaceholderText = placeholderText !== undefined && imageSrc === undefined;
      // Add avatar-placeholder class if using placeholder
      if (hasPlaceholderText) {
        classNames.push('avatar-placeholder');
      }

      avatar.className = classNames.join(' ');

      // Set size classes on inner container
      const sizeClassMap: Record<Size, string> = {
        xs: 'w-8',
        sm: 'w-10',
        md: 'w-12',
        lg: 'w-16',
        xl: 'w-24',
      };

      // Build inner container classes
      const innerClasses = ['rounded-full', sizeClassMap[this.size()]];
      if (hasPlaceholderText) {
        innerClasses.push('bg-neutral', 'text-neutral-content');
      }
      innerContainer.className = innerClasses.join(' ');

      // Clear and rebuild content
      innerContainer.innerHTML = '';

      if (imageSrc !== undefined) {
        // Use image
        const image = document.createElement('img');
        image.src = imageSrc;
        image.alt = this.imageAlt();
        innerContainer.appendChild(image);
      } else if (hasPlaceholderText) {
        // Use placeholder
        const span = document.createElement('span');
        const textSizeMap: Record<Size, string> = {
          xs: 'text-xs',
          sm: '',
          md: '',
          lg: 'text-xl',
          xl: 'text-3xl',
        };
        const textSize = textSizeMap[this.size()];
        if (textSize) {
          span.className = textSize;
        }
        span.textContent = placeholderText;
        innerContainer.appendChild(span);
      }
    });

    avatar.appendChild(innerContainer);
    return avatar;
  }

  public override registerProperties(register: IPropertyRegister): void {
    if (IS_DEV) {
      super.registerProperties(register);
      register.addHeader('Avatar');
      register.addOptions('Size', this.size, Sizes);
      register.addString('Image Alt', this.imageAlt);
      // Note: Optional strings - using addString with type assertion
      // register.addString('Image Src', this.imageSrc);
      // register.addString('Placeholder', this.placeholder);
      register.addOptionalOptions('Status', this.status, ['online', 'offline'] as const);
    }
  }
}
