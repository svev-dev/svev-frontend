import { IS_DEV, Container, UIElement } from 'svev-frontend';
import type { Size } from './Enums';
import { getSizeClass, Sizes } from './Enums';
import type { Element, IPropertyRegister } from 'svev-frontend';

// https://daisyui.com/components/card/

// https://tailwindcss.com/docs/detecting-classes-in-source-files
// card-xs card-sm card-md card-lg card-xl
// card-side image-full
// card-compact
// card-normal
// card-border
// card-dash

export class Card extends Container {
  public readonly size = this.prop<Size>('md');
  public readonly isSide = this.prop(false);
  public readonly isImageFull = this.prop(false);
  public readonly isCompact = this.prop(false);
  public readonly isBordered = this.prop(true);
  public readonly isDashed = this.prop(false);

  protected createUI(): Element {
    const card = document.createElement('div');

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

      this.applyClassesTo(card, classNames);
    });

    // Render fragment children into actions container (like Flex does)
    const dispose = this.fragment.render({ in: card });
    this.addDisposable(dispose);

    return card;
  }

  public override registerProperties(register: IPropertyRegister): void {
    if (IS_DEV) {
      super.registerProperties(register);
      register.addHeader('Card');
      register.addOptions('Size', this.size, Sizes);
      register.addBool('Is side', this.isSide);
      register.addBool('Is image full', this.isImageFull);
      register.addBool('Is compact', this.isCompact);
      register.addBool('Is bordered', this.isBordered);
      register.addBool('Is dashed', this.isDashed);
    }
  }
}

export class CardImage extends UIElement {
  public readonly src = this.prop<string | undefined>(undefined);
  public readonly alt = this.prop<string>('');

  protected createUI(): Element {
    const figure = document.createElement('figure');
    const image = document.createElement('img');
    figure.appendChild(image);

    this.effect(() => {
      this.applyClassesTo(figure);

      const src = this.src();
      if (src !== undefined) {
        image.src = src;
      }
      image.alt = this.alt();
    });

    return figure;
  }
}

export class CardBody extends Container {
  protected createUI(): Element {
    const body = document.createElement('div');

    this.effect(() => {
      this.applyClassesTo(body, ['card-body']);
    });

    const dispose = this.fragment.render({ in: body });
    this.addDisposable(dispose);

    return body;
  }
}

export class CardTitle extends UIElement {
  public readonly text = this.prop<string>('');

  protected createUI(): Element {
    const h2 = document.createElement('h2');

    this.effect(() => {
      this.applyClassesTo(h2, ['card-title']);
      h2.textContent = this.text();
    });

    return h2;
  }
}

export class CardActions extends Container {
  protected createUI(): Element {
    const actions = document.createElement('div');

    this.effect(() => {
      this.applyClassesTo(actions, ['card-actions']);
    });

    const dispose = this.fragment.render({ in: actions });
    this.addDisposable(dispose);

    return actions;
  }
}
