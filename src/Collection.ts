import { BaseElement } from './elements/BaseElement';

export class Collection<T extends BaseElement = BaseElement> {
  private _children: T[] = [];

  public *children(): Generator<T, void, unknown> {
    for (const child of this._children) {
      yield child;
    }
  }

  public push(child: T): void {
    this._children.push(child);
  }
}
