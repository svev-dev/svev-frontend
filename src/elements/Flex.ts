import { Container } from './Container';
import { CSSStyle } from './CSSStyle';
import { Element } from './UIElement';

export class Flex extends Container {
  public readonly direction = this.prop<'row' | 'column'>('row');
  public readonly alignItems = this.prop<'start' | 'end' | 'center'>('start');
  public readonly gap = this.prop<string>('');
  public readonly padding = this.prop<string>('');
  public readonly style = new CSSStyle(this);

  protected createUI(): Element {
    const element = document.createElement('div');
    element.style.display = 'flex';

    this.effect(() => {
      element.style.flexDirection = this.direction();
      element.style.alignItems = this.alignItems();
      element.style.padding = this.padding();
      element.style.gap = this.gap();
      this.style.applyTo(element);
    });

    const dispose = this.fragment.render({ in: element });
    this.addDisposable(dispose);

    return element;
  }
}
