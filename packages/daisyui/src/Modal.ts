import { IS_DEV, Container } from 'svev-frontend';
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
  public readonly title = this.prop<string | undefined>(undefined);
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
    const dialog = document.createElement('dialog');
    const modalBox = createModalBox(dialog);
    const header = createHeader(modalBox);
    const content = createContent(modalBox);
    const backdrop = createBackdrop(dialog);

    this.effect(() => {
      const title = this.title();
      if (title !== undefined) {
        header.textContent = title;
        header.style.display = '';
      } else {
        header.style.display = 'none';
      }
    });

    // Modal classes
    this.effect(() => {
      dialog.className = this.#className();
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
        dialog.addEventListener('cancel', this.close);
        return (): void => {
          dialog.removeEventListener('cancel', this.close);
        };
      }
      return undefined;
    });
    // Handle opening and closing
    this.effect(() => {
      const isOpen = this.isOpen();
      if (isOpen && !dialog.open) {
        dialog.showModal();
      } else if (!isOpen && dialog.open) {
        dialog.close();
      }
    });
    // Render children inside content
    this.addDisposable(this.fragment.render({ in: content }));
    return dialog;
  }

  #className(): string {
    const classNames = ['modal'];
    const placement = this.verticalPlacement();
    if (placement !== 'middle') {
      classNames.push(`modal-${placement}`);
    }
    const horizontalPlacement = this.horizontalPlacement();
    if (horizontalPlacement) {
      classNames.push(`modal-${horizontalPlacement}`);
    }
    // if (this.isOpen()) {
    //   classNames.push('modal-open');
    // }
    return classNames.join(' ');
  }

  public override registerProperties(register: IPropertyRegister): void {
    if (IS_DEV) {
      super.registerProperties(register);
      register.addHeader(Modal.name);
      register.addBool('IsOpen', this.isOpen);
      register.addOptionalString('Title', this.title);
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

function createHeader(parent: HTMLDivElement): HTMLHeadingElement {
  const result = document.createElement('h3');
  result.className = 'text-lg font-bold';
  return parent.appendChild(result);
}

function createContent(parent: HTMLDivElement): HTMLHeadingElement {
  const result = document.createElement('div');
  result.className = 'py-4';
  return parent.appendChild(result);
}

function createBackdrop(parent: HTMLDialogElement): HTMLFormElement {
  const result = document.createElement('form');
  result.method = 'dialog';
  result.className = 'modal-backdrop';
  return parent.appendChild(result);
}

function createModalBox(parent: HTMLDialogElement): HTMLDivElement {
  const result = document.createElement('div');
  result.className = 'modal-box';
  return parent.appendChild(result);
}
