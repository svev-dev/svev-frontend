import { Container } from './Container';

export class Stack extends Container {
  public direction = this.prop<'row' | 'column'>('row');
  public alignItems = this.prop<'start' | 'end' | 'center'>('start');
  public gap = this.prop<string>('');

  public override createUI(): HTMLElement {
    const element = <HTMLDivElement>document.createElement('div');
    element.style.display = 'flex';

    this.effect(() => {
      element.style.flexDirection = this.direction();
      element.style.alignItems = this.alignItems();
      element.style.gap = this.gap();
    });

    this.renderList(element, this.children);

    return element;
  }
}
