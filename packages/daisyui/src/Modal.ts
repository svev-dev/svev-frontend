import { IS_DEV, Container, Flex, UIElement } from 'svev-frontend';
import type { Element, IPropertyRegister } from 'svev-frontend';
import {
  type HorizontalPlacement,
  HorizontalPlacements,
  type VerticalPlacement,
  VerticalPlacements,
} from './Enums';

//https://daisyui.com/components/modal/

// https://tailwindcss.com/docs/detecting-classes-in-source-files
// modal modal-box modal-action modal-backdrop modal-toggle modal-open
// modal-top modal-middle modal-bottom modal-start modal-end

export class Modal extends Container {
  public readonly isOpen = this.prop(false);
  public readonly verticalPlacement = this.prop<VerticalPlacement | undefined>(undefined);
  public readonly horizontalPlacement = this.prop<HorizontalPlacement | undefined>(undefined);
  public readonly closeOnBackdrop = this.prop(true);
  public readonly closeOnEscape = this.prop(true);

  public constructor() {
    super();
  }

  public open = (): void => {
    this.isOpen(true);
  };

  public close = (): void => {
    this.isOpen(false);
  };

  protected createUI(): Element {
    const result = document.createElement('dialog');
    result.id = this.id();

    const modalBox = createModalBox(result);
    const backdrop = createBackdrop(result);

    this.effect(() => {
      this.applyClassesTo(result, this.#getClassNames());
    });

    // Handle click outside
    this.effect(() => {
      if (this.closeOnBackdrop()) {
        backdrop.addEventListener('click', this.close);
        return (): void => {
          backdrop.removeEventListener('click', this.close);
        };
      }
      return undefined;
    });
    // Handle close on escape
    this.effect(() => {
      if (this.closeOnEscape()) {
        result.addEventListener('cancel', this.close);
        return (): void => {
          result.removeEventListener('cancel', this.close);
        };
      }
      return undefined;
    });
    // Handle close event, to be sure isOpen is updated
    this.effect(() => {
      result.addEventListener('close', this.close);
      return (): void => {
        result.removeEventListener('close', this.close);
      };
    });
    // Handle opening and closing
    this.effect(() => {
      const isOpen = this.isOpen();
      if (isOpen && !result.open) {
        result.showModal();
      } else if (!isOpen && result.open) {
        result.close();
      }
    });
    const dispose = this.fragment.render({ in: modalBox });
    this.addDisposable(dispose);
    return result;
  }

  #getClassNames(): readonly string[] {
    const classNames = ['modal'];
    const placement = this.verticalPlacement();
    if (placement) {
      classNames.push(`modal-${placement}`);
    }
    const horizontalPlacement = this.horizontalPlacement();
    if (horizontalPlacement) {
      classNames.push(`modal-${horizontalPlacement}`);
    }
    return classNames;
  }

  public override registerProperties(register: IPropertyRegister): void {
    if (IS_DEV) {
      super.registerProperties(register);
      register.addHeader(Modal.name);
      register.addBool('IsOpen', this.isOpen);
      register.addOptionalOptions('VerticalPlacement', this.verticalPlacement, VerticalPlacements);
      register.addOptionalOptions(
        'HorizontalPlacement',
        this.horizontalPlacement,
        HorizontalPlacements
      );
      register.addBool('CloseOnBackdrop', this.closeOnBackdrop);
      register.addBool('CloseOnEscape', this.closeOnEscape);
    }
  }
}

export class ModalHeader extends UIElement {
  public readonly text = this.prop('');

  public constructor() {
    super();
  }

  protected createUI(): Element {
    const element = document.createElement('h3');
    this.effect(() => {
      this.applyClassesTo(element, ['text-lg', 'font-bold']);
      element.textContent = this.text();
    });
    return element;
  }
}

export class ModalBody extends Flex {
  public constructor() {
    super();
    this.direction('column').gap('10px');
  }
}

export class ModalFooter extends Container {
  public constructor() {
    super();
  }
  protected createUI(): Element {
    const result = createModalAction();
    const dispose = this.fragment.render({ in: result });
    this.addDisposable(dispose);
    return result;
  }
}

function createModalBox(parent: HTMLDialogElement): HTMLDivElement {
  const result = document.createElement('div');
  result.className = 'modal-box';
  return parent.appendChild(result);
}

function createModalAction(): HTMLDivElement {
  const result = document.createElement('div');
  result.className = 'modal-action';
  return result;
}

function createBackdrop(parent: HTMLDialogElement): HTMLFormElement {
  const result = document.createElement('form');
  result.method = 'dialog';
  result.className = 'modal-backdrop';
  return parent.appendChild(result);
}
