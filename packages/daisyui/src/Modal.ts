import { IS_DEV, Container } from 'svev-frontend';
import type { Element, IPropertyRegister } from 'svev-frontend';

// https://daisyui.com/components/modal/
// https://react.daisyui.com/?path=/story/actions-modal--default

// https://tailwindcss.com/docs/detecting-classes-in-source-files
// modal modal-box modal-action modal-backdrop modal-toggle modal-open
// modal-top modal-middle modal-bottom modal-start modal-end

export type ModalPlacement = 'top' | 'middle' | 'bottom';
export type ModalHorizontalPlacement = 'start' | 'end' | undefined;
const Placements: ModalPlacement[] = ['top', 'middle', 'bottom'];

export class Modal extends Container {
  public readonly isOpen = this.prop(false);
  public readonly title = this.prop<string | undefined>(undefined);
  public readonly placement = this.prop<ModalPlacement | undefined>(undefined);
  public readonly horizontalPlacement = this.prop<ModalHorizontalPlacement | undefined>(undefined);
  public readonly closeOnBackdrop = this.prop(true);
  public readonly closeOnEscape = this.prop(true);

  public constructor() {
    super();
  }

  public open(): void {
    this.isOpen(true);
  }

  public close(): void {
    this.isOpen(false);
  }

  protected createUI(): Element {
    const dialog = document.createElement('dialog');

    // Modal classes
    this.effect(() => {
      dialog.className = this.#className();
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
    // Handle escape key (TODO: dispose it?)
    dialog.addEventListener('cancel', () => {
      if (this.closeOnEscape()) {
        this.close();
      }
    });
    // Create modal box
    const modalBox = document.createElement('div');
    modalBox.className = 'modal-box';

    // Create header
    const header = document.createElement('h3');
    header.className = 'text-lg font-bold';

    this.effect(() => {
      const title = this.title();
      if (title !== undefined) {
        header.textContent = title;
        header.style.display = '';
      } else {
        header.style.display = 'none';
      }
    });
    modalBox.appendChild(header);

    // Create content container
    const content = document.createElement('div');
    content.className = 'py-4';

    // Render children inside content
    const dispose = this.fragment.render({ in: content });
    this.addDisposable(dispose);
    modalBox.appendChild(content);

    dialog.appendChild(modalBox);

    // Create backdrop form for closing on outside click
    if (this.closeOnBackdrop()) {
      const backdropForm = document.createElement('form');
      backdropForm.method = 'dialog';
      backdropForm.className = 'modal-backdrop';

      backdropForm.addEventListener('click', () => {
        if (this.closeOnBackdrop()) {
          this.close();
        }
      });
      dialog.appendChild(backdropForm);
    }
    return dialog;
  }

  #className(): string {
    const classNames = ['modal'];
    const placement = this.placement();
    if (placement !== 'middle') {
      classNames.push(`modal-${placement}`);
    }
    const horizontalPlacement = this.horizontalPlacement();
    if (horizontalPlacement) {
      classNames.push(`modal-${horizontalPlacement}`);
    }
    if (this.isOpen()) {
      classNames.push('modal-open');
    }
    return classNames.join(' ');
  }

  public override registerProperties(register: IPropertyRegister): void {
    if (IS_DEV) {
      super.registerProperties(register);
      register.addHeader(Modal.name);
      register.addBool('IsOpen', this.isOpen);
      register.addOptionalString('Title', this.title);
      register.addOptionalOptions('Placement', this.placement, Placements);
      register.addBool('CloseOnBackdrop', this.closeOnBackdrop);
      register.addBool('CloseOnEscape', this.closeOnEscape);
    }
  }
}
