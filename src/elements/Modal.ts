import { signal } from '../signals/signals';
import { UIElement } from './UIElement';

import * as bootstrap from 'bootstrap';

// https://getbootstrap.com/docs/5.3/components/modal/

export class Modal extends UIElement {
  public text = signal('');

  public override createUI(): HTMLElement {
    const modal = createDiv('modal fade');
    modal.tabIndex = -1;

    const dialog = createDiv('modal-dialog', modal);
    const content = createDiv('modal-content', dialog);
    {
      const header = createDiv('modal-header', content);

      const title = document.createElement('h5');
      title.className = 'modal-title';
      title.textContent = 'Modal Title';
      title.innerText = 'Title';
      header.appendChild(title);
    }
    {
      const body = createDiv('modal-body', content);

      const title = document.createElement('p');
      title.textContent = 'Modal body text goes here';
      title.innerText = 'Modal body text goes here';
      body.appendChild(title);
    }
    {
      const footer = createDiv('modal-footer', content);

      const closeButton = document.createElement('button');
      closeButton.type = 'button';
      closeButton.className = 'btn btn-secondary';
      closeButton.setAttribute('data-bs-dismiss', 'modal');
      closeButton.ariaLevel = 'Close';

      footer.appendChild(closeButton);
    }
    console.log('fff');

    modal.setAttribute('show', 'true');

    return modal;
  }
}

function createDiv(className: string, parent?: HTMLElement): HTMLDivElement {
  const div = <HTMLDivElement>document.createElement('div');
  div.className = className;
  parent?.appendChild(div);
  return div;
}
