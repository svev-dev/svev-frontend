import { effect } from '../signals/signals';
import { BoolInput } from '../elements/inputs/BoolInput';
import { BaseView } from './BaseView';
import { escapeHTML, htmlToElement } from '../utils/html';

export class BoolView extends BaseView<BoolInput> {
  private readonly _element: HTMLElement;

  constructor(boolInput: BoolInput) {
    super(boolInput);
    this._element = this.createElement();
  }

  public get htmlElement(): HTMLElement {
    return this._element;
  }

  private createElement(): HTMLElement {
    const escapedId = escapeHTML(this.element.id());
    const escapedLabel = escapeHTML(this.element.label() || '');
    const element = htmlToElement(`
      <div class="form-check">
        <input class="form-check-input" type="checkbox" value="" id="${escapedId}">
        <label class="form-check-label" for="${escapedId}">
          ${escapedLabel}
        </label>
      </div>
    `);
    const input = element.querySelector('input');
    if (!input) {
      throw new Error('Input element not found');
    }

    const onChange = () => {
      this.element.value(input.checked);
    };

    element.addEventListener('change', onChange);
    const removeEventListeners = () => {
      element.removeEventListener('change', onChange);
    };

    super.onDispose(
      effect(() => {
        input.disabled = !this.element.isEnabled();
        input.checked = this.element.value();
      })
    );
    this.onDispose(removeEventListeners);

    return element;
  }
}
