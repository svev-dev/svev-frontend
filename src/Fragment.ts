import { BaseElement } from './elements/BaseElement';

export class Fragment<T extends BaseElement = BaseElement> {
  private _elements: T[] = [];

  public *elements(): Generator<T, void, unknown> {
    for (const element of this._elements) {
      yield element;
    }
  }

  public push(element: T): void {
    this._elements.push(element);
  }
}
