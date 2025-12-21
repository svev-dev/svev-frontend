import { effect } from '../signals/signals';
import { BoolInput } from '../elements/inputs/BoolInput';
import { BaseView } from './BaseView';
import { escapeHTML, htmlToElement } from '../utils/html';

export class BoolView extends BaseView {
  private readonly _boolValue: BoolInput;
  private readonly _element: HTMLElement;

  constructor(boolValue: BoolInput) {
    super();
    this._boolValue = boolValue;
    this._element = this.createElement();
  }

  public override onMount(): HTMLElement {
    const dispose = effect(() => {
      this.sync();
    });
    this._element.addEventListener('change', this.onChange);

    super.onCleanup(dispose);
    this.onCleanup(() => {
      this._element.removeEventListener('change', this.onChange);
    });
    return this._element;
  }

  private createElement(): HTMLElement {
    const escapedId = escapeHTML(this._boolValue.id());
    const escapedLabel = escapeHTML(this._boolValue.label() || '');
    const element = htmlToElement(`
      <div class="form-check">
        <input class="form-check-input" type="checkbox" value="" id="${escapedId}">
        <label class="form-check-label" for="${escapedId}">
          ${escapedLabel}
        </label>
      </div>
    `);
    return element;
  }

  private get input(): HTMLInputElement {
    const input = this._element.querySelector('input');
    if (!input) {
      throw new Error('Input element not found');
    }
    return input;
  }

  private sync(): void {
    this.input.disabled = !this._boolValue.isEnabled();
    this.input.checked = this._boolValue.value();
  }

  private onChange = (_event: Event): void => {
    this._boolValue.value(this.input.checked);
  };
}
