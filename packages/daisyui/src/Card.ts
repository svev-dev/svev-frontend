import { IS_DEV } from './isDev';
import { getSizeClass, Size, Sizes } from './Enums';
import { Element, IPropertyRegister, Container } from 'svev-frontend';

// https://daisyui.com/components/card/

// https://tailwindcss.com/docs/detecting-classes-in-source-files
// card-xs card-sm card-md card-lg card-xl
// card-side image-full
// card-compact
// card-normal
// card-border
// card-dash

export class Card extends Container {
  public readonly title = this.prop<string | undefined>(undefined);
  public readonly description = this.prop<string | undefined>(undefined);
  public readonly imageSrc = this.prop<string | undefined>(undefined);
  public readonly imageAlt = this.prop<string>('');
  public readonly size = this.prop<Size>('md');
  public readonly isSide = this.prop(false);
  public readonly isImageFull = this.prop(false);
  public readonly isCompact = this.prop(false);
  public readonly isBordered = this.prop(true);
  public readonly isDashed = this.prop(false);

  protected createUI(): Element {
    const card = document.createElement('div');
    card.className = 'card';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    // Create actions container for children
    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'card-actions';
    cardBody.appendChild(actionsContainer);

    // Append cardBody to card before effect runs, so insertBefore works correctly
    card.appendChild(cardBody);

    let figure: HTMLElement | undefined;
    let image: HTMLImageElement | undefined;
    let titleElement: HTMLElement | undefined;
    let descriptionElement: HTMLElement | undefined;

    this.effect(() => {
      // Update card classes
      const classNames = ['card'];
      classNames.push(getSizeClass('card', this.size()));

      if (this.isSide()) {
        classNames.push('card-side');
      }

      if (this.isImageFull()) {
        classNames.push('image-full');
      }

      if (this.isCompact()) {
        classNames.push('card-compact');
      }

      if (this.isBordered()) {
        if (this.isDashed()) {
          classNames.push('card-dash');
        } else {
          classNames.push('card-border');
        }
      }

      card.className = classNames.join(' ');

      // Handle image
      const imageSrc = this.imageSrc();
      if (imageSrc !== undefined) {
        if (figure === undefined) {
          figure = document.createElement('figure');
          image = document.createElement('img');
          figure.appendChild(image);
          card.insertBefore(figure, cardBody);
        }
        if (image !== undefined) {
          image.src = imageSrc;
          image.alt = this.imageAlt();
        }
      } else {
        if (figure !== undefined) {
          figure.remove();
          figure = undefined;
          image = undefined;
        }
      }

      // Handle title
      const title = this.title();
      if (title !== undefined && title !== '') {
        if (titleElement === undefined) {
          titleElement = document.createElement('h2');
          titleElement.className = 'card-title';
          cardBody.insertBefore(titleElement, actionsContainer);
        }
        titleElement.textContent = title;
      } else {
        if (titleElement !== undefined) {
          titleElement.remove();
          titleElement = undefined;
        }
      }

      // Handle description
      const description = this.description();
      if (description !== undefined && description !== '') {
        if (descriptionElement === undefined) {
          descriptionElement = document.createElement('p');
          cardBody.insertBefore(descriptionElement, actionsContainer);
        }
        descriptionElement.textContent = description;
      } else {
        if (descriptionElement !== undefined) {
          descriptionElement.remove();
          descriptionElement = undefined;
        }
      }
    });

    // Render fragment children into actions container (like Flex does)
    const dispose = this.fragment.render({ in: actionsContainer });
    this.addDisposable(dispose);

    return card;
  }

  public override registerProperties(register: IPropertyRegister): void {
    if (IS_DEV) {
      super.registerProperties(register);
      register.addHeader('Card');
      register.addOptions('Size', this.size, Sizes);
      // Note: Optional strings - using addString with type assertion
      // The property register doesn't have addOptionalString, so we use addString
      // register.addString('Title', this.title);
      // register.addString('Description', this.description);
      // register.addString('Image Src', this.imageSrc);
      register.addString('Image Alt', this.imageAlt);
      register.addBool('Is side', this.isSide);
      register.addBool('Is image full', this.isImageFull);
      register.addBool('Is compact', this.isCompact);
      register.addBool('Is bordered', this.isBordered);
      register.addBool('Is dashed', this.isDashed);
    }
  }
}
