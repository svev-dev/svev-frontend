import type { Element } from './UIElement';
import { UIElement } from './UIElement';

export class Divider extends UIElement {
  public constructor() {
    super();
  }

  protected createUI(): Element {
    const element = document.createElement('hr');
    this.applyClassesTo(element, ['solid']);
    element.style.margin = '8px 0';
    element.style.borderWidth = '1px';
    return element;
  }
}
