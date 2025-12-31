import { renderList } from '../renderList';
import { effect, signal } from '../signals/signals';
import { Container } from './Container';

export class Stack extends Container {
  public direction = signal<'row' | 'column'>('row');
  public alignItems = signal<'start' | 'end' | 'center'>('start');
  public gap = signal<string>('');

  public override createUI(): HTMLElement {
    const element = <HTMLDivElement>document.createElement('div');
    element.style.display = 'flex';

    effect(() => {
      element.style.flexDirection = this.direction();
      element.style.alignItems = this.alignItems();
      element.style.gap = this.gap();
    });

    renderList(element, this.children, (el) => el);

    return element;
  }
}
