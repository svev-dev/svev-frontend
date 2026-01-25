import type { Element } from './UIElement';
import { UIElement } from './UIElement';

export class Divider extends UIElement {
  public constructor() {
    super();
  }

  protected createUI(): Element {
    const element = document.createElement('hr');
    element.style.width = '100%';
    return element;
  }
}
