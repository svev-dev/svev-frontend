import { Container } from './Container';

export class Flex extends Container {
  public readonly direction = this.prop<'row' | 'column'>('row');
  public readonly alignItems = this.prop<'start' | 'end' | 'center'>('start');
  public readonly gap = this.prop<string>('');

  public override createUI(): HTMLElement {
    const element = document.createElement('div');
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
