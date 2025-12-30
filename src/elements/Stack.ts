import { effect, signal } from '../signals/signals';
import { UIElement } from './UIElement';

export class Stack extends UIElement {
  public direction = signal<'row' | 'column'>('row');
  public alignItems = signal<'start' | 'end' | 'center'>('start');
  public gap = signal<string>('');
  private _children: UIElement[];

  public constructor(children: UIElement[]) {
    super();
    this._children = children;
  }

  public override createUI(): HTMLElement {
    const element = <HTMLDivElement>document.createElement('div');
    element.style.display = 'flex';

    effect(() => {
      element.style.flexDirection = this.direction();
      element.style.alignItems = this.alignItems();
      element.style.gap = this.gap();
    });

    this._children.forEach((child) => {
      element.appendChild(child.createUI());
    });

    return element;
  }
}
